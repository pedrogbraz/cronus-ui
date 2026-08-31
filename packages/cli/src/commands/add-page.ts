/**
 * `cronus-ui add-page` — incrementally add ONE page to an already-composed app
 * (D3 graft, F2). It reuses the exact compose plan/render/install core: it
 * reconstructs the app's manifest (chrome + already-composed pages), appends the
 * new page, re-plans + re-validates the WHOLE app (so the new page's chrome ref,
 * route uniqueness, and block kinds are checked against the real chrome and its
 * siblings), then applies ONLY the incremental delta:
 *   - install any new blocks the page needs (unchanged install core);
 *   - write the new page.tsx (+ its layout/chrome wrappers when the page uses a
 *     chrome group the app did not have yet);
 *   - RE-INJECT the affected chrome block's nav data-slot so the new `--nav`
 *     entry appears in the navbar/footer/sidebar;
 *   - grow `composed{}.choices.pages` + `composed{}.files` (union) + the base
 *     snapshot for the new/rewritten files.
 *
 * It never re-writes untouched sibling pages (their bytes are unchanged), and it
 * fails loud when there is no composed app, the app cannot be reloaded, or the
 * route collides (unless `--overwrite`). Determinism + the golden rule are
 * inherited wholesale from the shared renderer.
 */

import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { type AppManifest, type BlockRef, blockRefParts } from "../compose/manifest.js";
import {
  buildComposePlan,
  type ComposeChoiceInput,
  type ComposePlan,
  ComposePlanError,
  type PlanChrome,
} from "../compose/plan.js";
import { baseSnapshotDir, reloadManifest } from "../compose/reload.js";
import {
  chromeWrapperPath,
  layoutPath,
  pagePath,
  renderChromeWrapper,
  renderLayout,
  renderPage,
  renderShellWrapper,
  rewriteChromeBlock,
} from "../compose/render.js";
import {
  CLI_VERSION,
  type ComposedRecord,
  type CronusUIConfig,
  hasConfig,
  type InstalledRecord,
  readConfig,
  writeConfig,
} from "../config.js";
import { Registry, registrySourceVersion } from "../registry.js";
import {
  closestName,
  collectDependencies,
  detectPackageManager,
  log,
  recordDependencies,
  resolveSafeDest,
  rewriteImports,
  runInstall,
  writeFileEnsured,
  writeItemFiles,
} from "../utils.js";
import { readChromeSources, readComposeMeta } from "./compose.js";

/** Options accepted by the addPage library entry + the CLI command. */
export interface AddPageOptions {
  /** Project root (must contain cronus-ui.json with a composed app). */
  targetDir: string;
  /** New route to add, e.g. "/faq". */
  route: string;
  /** Block refs stacked in the page (strings or `{ block, variant }`). */
  blocks: BlockRef[];
  /** Chrome group key for the page; defaults to the app's first chrome group. */
  chrome?: string;
  /** <title> for the page; defaults to a Title-Cased slug from the route. */
  title?: string;
  /** Nav label; when set the page joins the chrome nav (data-slot re-injected). */
  nav?: string;
  /** Which composed app to extend (its `composed{}` key); required if >1 exists. */
  app?: string;
  /** Reload the manifest from this file instead of a bundled template. */
  manifestPath?: string;
  /** Overwrite an existing page file at the route (default false). */
  overwrite?: boolean;
  /** Skip the npm install step (default false). */
  skipInstall?: boolean;
  /** Override the registry source (else the project config's). */
  registry?: string;
}

/** Result of a successful add-page (for programmatic callers / tests). */
export interface AddPageResult {
  /** The composed app the page was added to (the `composed{}` key). */
  appName: string;
  /** The added route. */
  route: string;
  /** Files freshly written (new page, any new layout/wrapper, rewritten chrome). */
  generatedFiles: string[];
  /** Files skipped (already existed, no --overwrite). */
  skippedFiles: string[];
  /** Registry block items newly installed for the page. */
  installedBlocks: string[];
}

/** Title-case a route into a default page title: "/faq" → "Faq", "/help-center" → "Help Center". */
function defaultTitle(route: string): string {
  const last = route.replace(/\/+$/, "").split("/").filter(Boolean).pop() ?? "Home";
  return last
    .replace(/\[(\.\.\.)?([^\]]+)\]/g, "$2")
    .split(/[-_]/)
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

/**
 * Pick the composed app to extend, returning its name AND record. When `app` is
 * given it must exist; otherwise the project must have exactly one composed app
 * (the unambiguous default). Throws a clear, listing error on none / ambiguity.
 * Returning the record here keeps the (guaranteed-present) lookup in one place so
 * callers never re-assert on `config.composed`.
 */
function pickComposedApp(
  config: CronusUIConfig,
  app: string | undefined,
): { name: string; record: ComposedRecord } {
  const composed = config.composed ?? {};
  const keys = Object.keys(composed).sort();
  if (keys.length === 0) {
    throw new Error("No composed app found. Run `cronus-ui compose <template>` first.");
  }
  const pick = (name: string): { name: string; record: ComposedRecord } => {
    const record = composed[name];
    if (record === undefined) {
      // Unreachable: `name` is always one of `keys`. Narrows the type for TS.
      throw new Error(`Internal: composed record for "${name}" is missing.`);
    }
    return { name, record };
  };
  if (app !== undefined) {
    if (!(app in composed)) {
      const suggestion = closestName(app, keys);
      throw new Error(
        suggestion
          ? `Unknown composed app "${app}". Did you mean "${suggestion}"? (composed: ${keys.join(", ")})`
          : `Unknown composed app "${app}" (composed: ${keys.join(", ")}).`,
      );
    }
    return pick(app);
  }
  if (keys.length > 1) {
    throw new Error(
      `This project has ${keys.length} composed apps (${keys.join(", ")}). Pass --app <name> to choose one.`,
    );
  }
  return pick(keys[0] as string);
}

/**
 * Build the synthetic manifest for the re-plan: the reloaded manifest's chrome +
 * defaults, its pages FILTERED to the ones this app actually composed (from
 * `composed.choices.pages`, preserving manifest order), plus the appended new
 * page. Re-planning this whole set validates the new page against the real chrome
 * and its live siblings, and yields the full nav set for the chrome re-injection.
 * Throws when the new route already belongs to the app (unless allowed by the
 * caller's `--overwrite`, checked at write time — a duplicate route in the plan
 * would otherwise be a hard plan error).
 */
function synthesizeManifest(
  base: AppManifest,
  composed: ComposedRecord,
  newPage: { route: string; title: string; nav?: string; chrome: string; blocks: BlockRef[] },
  allowExisting: boolean,
): { manifest: AppManifest; alreadyPresent: boolean } {
  const composedRoutes = new Set(composed.choices.pages);
  const keptPages = base.manifest.pages.filter((p) => composedRoutes.has(p.route));
  const alreadyPresent = composedRoutes.has(newPage.route);
  // With --overwrite we replace the existing page in place (drop the old ref so
  // the plan has no duplicate route); otherwise the new page is appended and the
  // caller enforces the collision policy before writing.
  const pages = allowExisting
    ? [...keptPages.filter((p) => p.route !== newPage.route), newPage]
    : [...keptPages, newPage];
  const manifest: AppManifest = {
    ...base,
    manifest: { ...base.manifest, pages },
  };
  return { manifest, alreadyPresent };
}

/**
 * The variant overrides to feed the re-plan. The recorded `choices.variants` are
 * the app's stale FAMILY-WIDE defaults from a prior compose; they exist only so
 * re-rendered sibling/chrome nav stays consistent. But the NEW page's own inline
 * `{ block, variant }` refs are the fresh user intent (`--blocks login=split`),
 * which must WIN over any recorded family override for the same slug — otherwise
 * `resolveBlock`'s `variantOverrides[slug] ?? manifestVariant` precedence would
 * silently discard the request and emit the wrong variant. So we strip from the
 * recorded overrides every slug the new page references with its OWN explicit
 * variant, letting that ref-declared variant flow through as `manifestVariant`.
 */
function replanVariants(
  recorded: Record<string, string>,
  newPageBlocks: BlockRef[],
): Record<string, string> {
  const inlineVariantSlugs = new Set<string>();
  for (const ref of newPageBlocks) {
    const { slug, variant } = blockRefParts(ref);
    if (variant !== undefined) inlineVariantSlugs.add(slug);
  }
  if (inlineVariantSlugs.size === 0) return recorded;
  const out: Record<string, string> = {};
  for (const [slug, variant] of Object.entries(recorded)) {
    if (!inlineVariantSlugs.has(slug)) out[slug] = variant;
  }
  return out;
}

/**
 * Add one page to an already-composed app. Reloads the manifest, appends the new
 * page, re-plans + re-validates the whole app, then writes ONLY the incremental
 * delta (new page + any new layout/wrapper + the re-injected chrome nav) and
 * grows `composed{}` + the base snapshot. Throws {@link ComposePlanError} /
 * {@link Error} on invalid input.
 */
export async function addPage(options: AddPageOptions): Promise<AddPageResult> {
  const { targetDir } = options;
  if (!hasConfig(targetDir)) {
    throw new Error("No cronus-ui.json found. Run `cronus-ui init` first.");
  }
  const config = await readConfig(targetDir);
  const { name: appName, record: composedRecord } = pickComposedApp(config, options.app);

  const overwrite = options.overwrite ?? false;
  const base = await reloadManifest(appName, options.manifestPath, composedRecord);

  // Default the chrome group to the manifest's first (matches "no questions").
  const firstChrome = Object.keys(base.manifest.chrome)[0];
  const chromeGroup = options.chrome ?? firstChrome;
  if (chromeGroup === undefined) {
    throw new Error(`App "${appName}" defines no chrome groups.`);
  }
  const newPage = {
    route: options.route,
    title: options.title ?? defaultTitle(options.route),
    ...(options.nav !== undefined ? { nav: options.nav } : {}),
    chrome: chromeGroup,
    blocks: options.blocks,
  };

  const { manifest, alreadyPresent } = synthesizeManifest(base, composedRecord, newPage, overwrite);
  if (alreadyPresent && !overwrite) {
    throw new Error(
      `Route "${options.route}" is already a page of app "${appName}" — pass --overwrite to replace it.`,
    );
  }

  const sourceUsed = options.registry ?? config.registry;
  const registry = new Registry(sourceUsed);
  const meta = await readComposeMeta(registry);
  if (meta === null) {
    throw new Error(
      "This registry does not ship a meta.json sidecar — add-page needs it (upgrade to v0.4.0+).",
    );
  }
  const index = await registry.index();
  const chromeSources = await readChromeSources(manifest, registry);

  // Re-plan the whole app (chrome + all composed pages + the new page) with the
  // app's recorded choices (brand/seed/variants) so the chrome nav re-injection
  // and every semantic check run against the real, complete plan. The brand is
  // taken from the record verbatim (it was already resolved at compose time), so
  // the re-injected chrome copy keeps the same wordmark. A plan error propagates
  // as a ComposePlanError with its aggregated list intact.
  const choices: ComposeChoiceInput = {
    brand: composedRecord.choices.brand,
    ...(composedRecord.choices.seed !== undefined ? { seed: composedRecord.choices.seed } : {}),
    // The new page's inline `slug=variant` refs win over the app's recorded
    // family overrides (see replanVariants) so `--blocks login=split` is honored.
    variants: replanVariants(composedRecord.choices.variants, newPage.blocks),
  };
  const plan: ComposePlan = buildComposePlan(manifest, choices, index, meta, chromeSources);

  const planPage = plan.pages.find((p) => p.route === options.route);
  if (planPage === undefined) {
    // Should not happen: the new page is always in the synthetic manifest.
    throw new Error(`Internal: planned page for route "${options.route}" not found.`);
  }
  const planChrome = plan.chromes.find((c) => c.group === chromeGroup);
  // Capture this ONCE, before ensureChromeScaffold writes the layout — every
  // downstream step (chrome-block install, scaffold, chrome rewrite) keys off the
  // SAME "is this group brand-new?" answer so they stay lockstep.
  const newChromeGroup = planChrome !== undefined && isNewChromeGroup(planChrome, targetDir);

  const installedVersion = registrySourceVersion(sourceUsed) ?? CLI_VERSION;

  // --- Install the new page's blocks (unchanged install core) ---------------
  // Only the ITEMS this page introduces; sibling pages' blocks are already on
  // disk (installed{}). resolve() over the page items pulls their deps too.
  const pageItems = [...new Set(planPage.blocks.map((b) => b.item))];
  const installed: Record<string, InstalledRecord> = { ...config.installed };
  const installedBlocks: string[] = [];
  // Resolve once (transitive deps included) and reuse for the npm-dep step. The
  // list grows below with a brand-new chrome group's blocks so their deps ship too.
  const resolvedItems = pageItems.length > 0 ? await registry.resolve(pageItems) : [];

  // --- Install a BRAND-NEW chrome group's chrome block(s) -------------------
  // When the page introduces a chrome group the app never scaffolded (its layout
  // does not exist yet), ensureChromeScaffold below emits a wrapper/layout that
  // imports `@/components/blocks/<navbar|footer|app-shell-chrome>` — but those
  // chrome block files are NOT among the page's content blocks, so without this
  // step they are never written and the generated app fails `next build` on an
  // unresolvable import. compose installs them via plan.blockSlugs (which include
  // chrome slugs); add-page narrows to the page's own blocks, so we install the
  // group's chrome slugs here, mirroring the same resolve+writeItemFiles path.
  if (newChromeGroup && planChrome !== undefined) {
    const chromeItems = chromeSlugsOfGroup(planChrome).filter(
      (slug) => installed[slug] === undefined,
    );
    if (chromeItems.length > 0) {
      resolvedItems.push(...(await registry.resolve(chromeItems)));
    }
  }

  for (const item of resolvedItems) {
    const { written } = await writeItemFiles(item, config, targetDir, { overwrite });
    if (written.length === item.files.length && written.length > 0) {
      installed[item.name] = { version: installedVersion, files: written };
      if (item.type === "registry:block") installedBlocks.push(item.name);
    }
  }

  const generatedFiles: string[] = [];
  const skippedFiles: string[] = [];

  // --- Write the new page.tsx (collision-safe) ------------------------------
  const pageRel = pagePath(planPage);
  const pageDest = resolveSafeDest(targetDir, ".", pageRel);
  if (existsSync(pageDest) && !overwrite) {
    skippedFiles.push(pageRel);
  } else {
    const content = renderPage(planPage, config);
    await writeFileEnsured(pageDest, content);
    generatedFiles.push(pageRel);
    await writeFileEnsured(resolveSafeDest(targetDir, baseSnapshotDir(appName), pageRel), content);
  }

  // --- Cross-group overwrite: remove the route's OLD page.tsx ----------------
  // When `--overwrite` MOVES an already-composed route to a DIFFERENT chrome
  // group, the new page.tsx lands at app/(<newGroup>)/<route>/page.tsx while the
  // previously-generated app/(<oldGroup>)/<route>/page.tsx stays on disk — Next.js
  // then rejects the build ("two parallel pages that resolve to the same path").
  // Delete the stale file (+ its base snapshot) and drop it from the tracked file
  // set so the record stays 1:1 with disk. In-group overwrite is a no-op here
  // (same path, replaced in place above).
  const removedOldPage = await removeMovedPage(
    overwrite && alreadyPresent,
    base,
    options.route,
    chromeGroup,
    pageRel,
    targetDir,
    appName,
  );

  // --- Ensure the chrome group's layout + wrappers exist --------------------
  // If the new page uses a chrome group the app did not have yet, its layout and
  // chrome wrappers were never generated — emit them now. An established group's
  // layout is unchanged (thin, nav-agnostic), so this no-ops silently for it.
  if (planChrome !== undefined) {
    await ensureChromeScaffold(plan, planChrome, config, targetDir, appName, generatedFiles);
  }

  // --- Customize the chrome block(s): nav data-slot + brand -----------------
  // Two triggers: (1) `--nav` grows an EXISTING group's nav set, so its chrome
  // block(s) must be re-rendered with the larger nav; (2) a BRAND-NEW group whose
  // chrome block we just installed pristine — it still carries the placeholder
  // nav const + the "Cronus" brand literal, so it MUST be customized to match what
  // compose emits (brand replaced, nav data filled), else the new group ships an
  // uncustomized chrome. We rewrite from the PRISTINE registry source (exactly as
  // compose does): the brand literal ("Cronus") only exists in the pristine source
  // — the on-disk copy already replaced it with the app brand, so re-running the
  // brand pass over the on-disk copy would fail to find the anchor. Rewriting the
  // pristine source re-applies BOTH the nav data-slot and the brand, yielding the
  // same bytes compose would. HONEST CUT: like compose's chrome customization,
  // this regenerates the chrome copy and does not preserve hand edits to it.
  const rewriteChrome = options.nav !== undefined || newChromeGroup;
  if (rewriteChrome && planChrome !== undefined) {
    for (const slug of chromeSlugsOfGroup(planChrome)) {
      const rel = `${config.paths.blocks}/${slug}.tsx`;
      const dest = resolveSafeDest(targetDir, ".", rel);
      const source = plan.chromeSources[slug];
      if (source === undefined || !existsSync(dest)) continue;
      const content = rewriteImports(rewriteChromeBlock(slug, source, plan), config);
      await writeFileEnsured(dest, content);
      if (!generatedFiles.includes(rel)) generatedFiles.push(rel);
    }
  }

  // --- Grow composed{} (pages union + files union) + persist ----------------
  const nextPages = [...new Set([...composedRecord.choices.pages, options.route])];
  // Preserve manifest order of the routes the app actually has.
  const orderedRoutes = plan.pages.map((p) => p.route).filter((r) => nextPages.includes(r));
  const nextChoices = { ...composedRecord.choices, pages: orderedRoutes };
  // Drop the moved-away old page path from the tracked set (it was just deleted).
  const priorFiles =
    removedOldPage !== undefined
      ? composedRecord.files.filter((f) => f !== removedOldPage)
      : composedRecord.files;
  const nextRecord: ComposedRecord = {
    ...composedRecord,
    version: installedVersion,
    choices: nextChoices,
    files: [...new Set([...priorFiles, ...generatedFiles])].sort(),
  };
  const composed = { ...config.composed, [appName]: nextRecord };
  await writeConfig(targetDir, { ...config, installed, composed });

  // --- Record + install npm deps (best-effort) ------------------------------
  const deps = resolvedItems.length > 0 ? collectDependencies(resolvedItems) : [];
  await recordDependencies(targetDir, deps);
  if (deps.length > 0 && !(options.skipInstall ?? false)) {
    const pm = detectPackageManager(targetDir);
    try {
      await runInstall(pm, deps, targetDir);
    } catch {
      // Non-fatal.
    }
  }

  return { appName, route: options.route, generatedFiles, skippedFiles, installedBlocks };
}

/** Chrome block slugs used by one group (navbar/footer/shell), in a stable order. */
function chromeSlugsOfGroup(chrome: PlanChrome): string[] {
  const slugs: string[] = [];
  if (chrome.navbar !== undefined) slugs.push(chrome.navbar);
  if (chrome.footer !== undefined) slugs.push(chrome.footer);
  if (chrome.block !== undefined) slugs.push(chrome.block);
  return slugs;
}

/**
 * True when the page's chrome group was NEVER scaffolded in this app — decided by
 * its layout: an established group already has `app/(<group>)/layout.tsx`, a
 * brand-new one does not. The single source of truth shared by the chrome-block
 * install, ensureChromeScaffold, and the dry-run predictor so they stay lockstep.
 */
function isNewChromeGroup(chrome: PlanChrome, targetDir: string): boolean {
  return !existsSync(resolveSafeDest(targetDir, ".", layoutPath(chrome)));
}

/**
 * Delete the previously-generated page.tsx when `--overwrite` MOVED a route to a
 * different chrome group. The old chrome group is read from the reloaded base
 * manifest's page for that route (the group it was composed under). Returns the
 * project-relative path of the file it removed (so the caller drops it from the
 * tracked file set), or `undefined` when nothing was moved/removed. No-op when the
 * old and new group match (in-group overwrite replaces the file in place) or when
 * the old file does not exist.
 */
async function removeMovedPage(
  active: boolean,
  base: AppManifest,
  route: string,
  newGroup: string,
  newPageRel: string,
  targetDir: string,
  appName: string,
): Promise<string | undefined> {
  if (!active) return undefined;
  const oldPageDef = base.manifest.pages.find((p) => p.route === route);
  const oldGroup = oldPageDef?.chrome;
  if (oldGroup === undefined || oldGroup === newGroup) return undefined;
  // Build the old page path from route + old chrome (pagePath reads only those).
  const oldRel = pagePath({ route, title: "", chrome: oldGroup, blocks: [] });
  if (oldRel === newPageRel) return undefined; // defensive: same path, nothing to remove
  const oldDest = resolveSafeDest(targetDir, ".", oldRel);
  if (existsSync(oldDest)) await rm(oldDest, { force: true });
  const oldSnap = resolveSafeDest(targetDir, baseSnapshotDir(appName), oldRel);
  if (existsSync(oldSnap)) await rm(oldSnap, { force: true });
  return oldRel;
}

/**
 * Ensure the layout + chrome wrappers for a page's chrome group exist on disk.
 * The group's presence is decided by its layout: if `app/(<group>)/layout.tsx`
 * already exists, the group is ESTABLISHED — its layout + wrappers are unchanged
 * (thin, nav-agnostic), so we do nothing and add no skip noise. Only a page that
 * introduces a BRAND-NEW chrome group triggers writing that group's layout +
 * SiteNav/SiteFooter/AppShellNav wrappers now. Collision-safe: a stray pre-existing
 * wrapper is silently left in place (no --overwrite).
 */
async function ensureChromeScaffold(
  plan: ComposePlan,
  chrome: PlanChrome,
  config: CronusUIConfig,
  targetDir: string,
  appName: string,
  generatedFiles: string[],
): Promise<void> {
  // Established group → nothing to scaffold (its layout/wrappers already exist and
  // are unchanged by adding a page).
  if (!isNewChromeGroup(chrome, targetDir)) return;

  const write = async (rel: string, content: string): Promise<void> => {
    const dest = resolveSafeDest(targetDir, ".", rel);
    if (existsSync(dest)) return; // leave a stray pre-existing wrapper untouched
    await writeFileEnsured(dest, content);
    generatedFiles.push(rel);
    await writeFileEnsured(resolveSafeDest(targetDir, baseSnapshotDir(appName), rel), content);
  };

  // Chrome wrappers first (the layout imports them). Only emit for the furniture
  // this group actually uses, mirroring renderPlan.
  if (chrome.navbar !== undefined && plan.navbarExportName !== undefined) {
    await write(
      chromeWrapperPath(config, "site-nav"),
      renderChromeWrapper("SiteNav", chrome.navbar, plan.navbarExportName, config),
    );
  }
  if (chrome.footer !== undefined && plan.footerExportName !== undefined) {
    await write(
      chromeWrapperPath(config, "site-footer"),
      renderChromeWrapper("SiteFooter", chrome.footer, plan.footerExportName, config),
    );
  }
  if (chrome.block !== undefined && plan.shellExportName !== undefined) {
    await write(
      chromeWrapperPath(config, "app-shell"),
      renderShellWrapper("AppShellNav", chrome.block, plan.shellExportName, config),
    );
  }
  await write(layoutPath(chrome), renderLayout(chrome, config));
}

/** CLI-facing options (flags parsed by commander in index.ts). */
export interface AddPageCommandOptions {
  cwd: string;
  route?: string;
  blocks?: string;
  chrome?: string;
  title?: string;
  nav?: string;
  app?: string;
  manifest?: string;
  overwrite?: boolean;
  skipInstall?: boolean;
  dryRun?: boolean;
  registry?: string;
}

/**
 * Parse the `--blocks hero,cta` / `--blocks login=split,cta` spec into block refs.
 * A `slug=variant` token becomes `{ block, variant }`; a bare token stays a string
 * (default variant). Empty tokens are dropped; an empty spec throws.
 */
export function parseBlockRefs(spec: string | undefined): BlockRef[] {
  const tokens = (spec ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (tokens.length === 0) {
    throw new Error("--blocks is required, e.g. --blocks faq,cta (or login=split).");
  }
  return tokens.map((tok) => {
    const eq = tok.indexOf("=");
    if (eq === -1) return tok;
    // Trim BOTH sides of the `=` so `login = split` (and stray inner spaces)
    // resolve to { block: "login", variant: "split" } instead of failing plan
    // validation with an unhelpful `unknown block "login "`.
    const block = tok.slice(0, eq).trim();
    const variant = tok.slice(eq + 1).trim();
    if (block.length === 0 || variant.length === 0) {
      throw new Error(`Invalid --blocks token "${tok}" (expected "slug" or "slug=variant").`);
    }
    return { block, variant };
  });
}

/**
 * The `cronus-ui add-page` command: adds ONE page to a composed app, or previews
 * it with `--dry-run` (writes nothing). Aggregated plan errors are printed as a
 * list, like `compose`.
 */
export async function addPageCommand(options: AddPageCommandOptions): Promise<void> {
  const { cwd } = options;
  if (!hasConfig(cwd)) {
    log.err("No cronus-ui.json found. Run `cronus-ui init` first.");
    process.exitCode = 1;
    return;
  }
  if (options.route === undefined || options.route.length === 0) {
    log.err("--route is required, e.g. `cronus-ui add-page --route /faq --blocks faq,cta`.");
    process.exitCode = 1;
    return;
  }
  const route = options.route.startsWith("/") ? options.route : `/${options.route}`;

  let blocks: BlockRef[];
  try {
    blocks = parseBlockRefs(options.blocks);
  } catch (err) {
    log.err((err as Error).message);
    process.exitCode = 1;
    return;
  }

  // --- Dry-run: plan + preview the single page, write nothing ---------------
  if (options.dryRun === true) {
    try {
      const preview = await previewAddPage({
        targetDir: cwd,
        route,
        blocks,
        ...(options.chrome !== undefined ? { chrome: options.chrome } : {}),
        ...(options.title !== undefined ? { title: options.title } : {}),
        ...(options.nav !== undefined ? { nav: options.nav } : {}),
        ...(options.app !== undefined ? { app: options.app } : {}),
        ...(options.manifest !== undefined ? { manifestPath: options.manifest } : {}),
        ...(options.registry !== undefined ? { registry: options.registry } : {}),
        overwrite: options.overwrite ?? false,
      });
      log.title(`Add page (dry-run) — ${route} → app "${preview.appName}"`);
      for (const f of preview.wouldWrite) log.step(`Would write ${f}`);
      if (preview.wouldInstall.length > 0) {
        log.step(`Would install: ${preview.wouldInstall.join(", ")}`);
      }
      log.title("Nothing written (dry-run).");
    } catch (err) {
      reportError(err);
      process.exitCode = 1;
    }
    return;
  }

  // --- Apply ----------------------------------------------------------------
  let result: AddPageResult;
  try {
    result = await addPage({
      targetDir: cwd,
      route,
      blocks,
      ...(options.chrome !== undefined ? { chrome: options.chrome } : {}),
      ...(options.title !== undefined ? { title: options.title } : {}),
      ...(options.nav !== undefined ? { nav: options.nav } : {}),
      ...(options.app !== undefined ? { app: options.app } : {}),
      ...(options.manifest !== undefined ? { manifestPath: options.manifest } : {}),
      ...(options.registry !== undefined ? { registry: options.registry } : {}),
      overwrite: options.overwrite ?? false,
      skipInstall: options.skipInstall ?? false,
    });
  } catch (err) {
    reportError(err);
    process.exitCode = 1;
    return;
  }

  for (const path of result.generatedFiles) log.ok(`Wrote ${path}`);
  for (const path of result.skippedFiles) log.warn(`Skipped ${path} (exists — use --overwrite)`);
  if (result.installedBlocks.length > 0) {
    log.step(
      `Installed ${result.installedBlocks.length} block(s): ${result.installedBlocks.join(", ")}`,
    );
  }
  log.title(`Added ${result.route} to "${result.appName}".`);
  log.title("Next steps");
  log.step("npx cronus-ui add-page --route /pricing --blocks pricing,cta --nav Pricing");
  log.step("npx cronus-ui theme set aurora --mode dark");
  log.step("npx cronus-ui upgrade --all --dry-run");
}

/** A dry-run preview of an add-page: the files it would write + blocks it would install. */
export interface AddPagePreview {
  appName: string;
  route: string;
  wouldWrite: string[];
  wouldInstall: string[];
}

/**
 * Plan the add-page (validating everything) and return the files it WOULD write
 * and blocks it WOULD install, without touching the filesystem. Reuses the same
 * reload + synthesize + plan path as {@link addPage}.
 */
export async function previewAddPage(
  options: Omit<AddPageOptions, "skipInstall">,
): Promise<AddPagePreview> {
  const { targetDir } = options;
  if (!hasConfig(targetDir)) {
    throw new Error("No cronus-ui.json found. Run `cronus-ui init` first.");
  }
  const config = await readConfig(targetDir);
  const { name: appName, record: composedRecord } = pickComposedApp(config, options.app);
  const overwrite = options.overwrite ?? false;
  const base = await reloadManifest(appName, options.manifestPath, composedRecord);

  const firstChrome = Object.keys(base.manifest.chrome)[0];
  const chromeGroup = options.chrome ?? firstChrome;
  if (chromeGroup === undefined) throw new Error(`App "${appName}" defines no chrome groups.`);
  const newPage = {
    route: options.route,
    title: options.title ?? defaultTitle(options.route),
    ...(options.nav !== undefined ? { nav: options.nav } : {}),
    chrome: chromeGroup,
    blocks: options.blocks,
  };
  const { manifest, alreadyPresent } = synthesizeManifest(base, composedRecord, newPage, overwrite);
  if (alreadyPresent && !overwrite) {
    throw new Error(
      `Route "${options.route}" is already a page of app "${appName}" — pass --overwrite to replace it.`,
    );
  }

  const registry = new Registry(options.registry ?? config.registry);
  const meta = await readComposeMeta(registry);
  if (meta === null) {
    throw new Error(
      "This registry does not ship a meta.json sidecar — add-page needs it (upgrade to v0.4.0+).",
    );
  }
  const index = await registry.index();
  const chromeSources = await readChromeSources(manifest, registry);
  const choices: ComposeChoiceInput = {
    brand: composedRecord.choices.brand,
    ...(composedRecord.choices.seed !== undefined ? { seed: composedRecord.choices.seed } : {}),
    // Mirror addPage: the new page's inline variant refs win over recorded ones.
    variants: replanVariants(composedRecord.choices.variants, newPage.blocks),
  };
  const plan = buildComposePlan(manifest, choices, index, meta, chromeSources);
  const planPage = plan.pages.find((p) => p.route === options.route);
  if (planPage === undefined)
    throw new Error(`Internal: planned page "${options.route}" not found.`);
  const planChrome = plan.chromes.find((c) => c.group === chromeGroup);

  // Predict EXACTLY what addPage writes, mirroring its apply path so a dry-run is
  // trustworthy: the page.tsx, then (for a brand-new group) the chrome block(s)
  // it installs + the SiteNav/SiteFooter/AppShellNav wrappers + the layout, and
  // the customized chrome block(s) when `--nav` grows an existing group's nav.
  const wouldWrite = [pagePath(planPage)];
  const wouldInstallSet = new Set<string>();
  if (planChrome !== undefined) {
    const newGroup = isNewChromeGroup(planChrome, targetDir);
    const groupSlugs = chromeSlugsOfGroup(planChrome);

    // Chrome block install (only for a brand-new group's not-yet-installed slugs).
    if (newGroup) {
      for (const slug of groupSlugs) {
        if (config.installed?.[slug] === undefined) wouldInstallSet.add(slug);
      }
    }

    // Chrome block customization (nav data-slot + brand): apply rewrites the block
    // when `--nav` OR the group is new, per-slug only if the block will be on disk
    // (new group installs it above; an existing group must already have it).
    if (options.nav !== undefined || newGroup) {
      for (const slug of groupSlugs) {
        const rel = `${config.paths.blocks}/${slug}.tsx`;
        const onDisk = existsSync(resolveSafeDest(targetDir, ".", rel));
        if (newGroup || onDisk) wouldWrite.push(rel);
      }
    }

    // Layout + chrome wrappers: only a brand-new group scaffolds them, each gated
    // on "not already present" — exactly mirroring ensureChromeScaffold.
    if (newGroup) {
      const predictWrapper = (name: string): void => {
        const rel = chromeWrapperPath(config, name);
        if (!existsSync(resolveSafeDest(targetDir, ".", rel))) wouldWrite.push(rel);
      };
      if (planChrome.navbar !== undefined && plan.navbarExportName !== undefined) {
        predictWrapper("site-nav");
      }
      if (planChrome.footer !== undefined && plan.footerExportName !== undefined) {
        predictWrapper("site-footer");
      }
      if (planChrome.block !== undefined && plan.shellExportName !== undefined) {
        predictWrapper("app-shell");
      }
      const layoutRel = layoutPath(planChrome);
      if (!existsSync(resolveSafeDest(targetDir, ".", layoutRel))) wouldWrite.push(layoutRel);
    }
  }
  for (const item of planPage.blocks.map((b) => b.item)) {
    if (config.installed?.[item] === undefined) wouldInstallSet.add(item);
  }
  return {
    appName,
    route: options.route,
    wouldWrite: [...new Set(wouldWrite)],
    wouldInstall: [...wouldInstallSet],
  };
}

/** Print a plan/manifest error's aggregated list, or a plain message. */
function reportError(err: unknown): void {
  if (err instanceof ComposePlanError) {
    log.err("Add-page plan is invalid:");
    for (const e of err.errors) log.step(e);
    return;
  }
  const maybe = err as { errors?: unknown };
  if (Array.isArray(maybe.errors)) {
    log.err("App manifest is invalid:");
    for (const e of maybe.errors as string[]) log.step(e);
    return;
  }
  log.err((err as Error).message);
}
