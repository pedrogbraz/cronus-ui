import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { writeDesignDocuments } from "@cronus-ui/ai-kit";
import { applyGoldPath, GOLD_PATH_DEPENDENCIES, isGoldPathTemplate } from "../compose/gold-path.js";
import { type AppManifest, type ManifestError, manifestFingerprint } from "../compose/manifest.js";
import {
  buildComposePlan,
  type ComposeChoiceInput,
  type ComposeMeta,
  ComposePlanError,
} from "../compose/plan.js";
import { renderPreview } from "../compose/preview.js";
import { baseSnapshotDir } from "../compose/reload.js";
import { renderPlan } from "../compose/render.js";
import {
  defaultComposeTemplate,
  listTemplates,
  loadManifestFile,
  loadTemplate,
} from "../compose/templates.js";
import {
  CLI_VERSION,
  type ComposedRecord,
  type CronusUIConfig,
  hasConfig,
  type InstalledRecord,
  readConfig,
  writeConfig,
} from "../config.js";
import { Registry, type RegistryItem, registrySourceVersion } from "../registry.js";
import {
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

export { listTemplates, loadManifestFile, loadTemplate } from "../compose/templates.js";

/** Read the chrome block sources named by the manifest's chrome map from the registry. */
export async function readChromeSources(
  manifest: AppManifest,
  registry: Registry,
): Promise<Record<string, string>> {
  const slugs = new Set<string>();
  for (const group of Object.values(manifest.manifest.chrome)) {
    if (group.navbar !== undefined) slugs.add(group.navbar);
    if (group.footer !== undefined) slugs.add(group.footer);
    if (group.block !== undefined) slugs.add(group.block);
  }
  const sources: Record<string, string> = {};
  for (const slug of slugs) {
    try {
      const item = await registry.item(slug);
      const content = item.files[0]?.content;
      if (content !== undefined) sources[slug] = content;
    } catch {
      // Left absent → plan validation reports "shipped source unavailable".
    }
  }
  return sources;
}

/** The compose meta subset, loaded from the registry's `meta.json`. */
export async function readComposeMeta(registry: Registry): Promise<ComposeMeta | null> {
  const meta = await registry.meta<{ blocks?: Record<string, unknown> }>();
  if (meta === null || meta.blocks === undefined) return null;
  return meta as ComposeMeta;
}

/**
 * The project's package name (from package.json), used as the default brand and
 * as `__APP_NAME__`. Falls back to the directory basename when unreadable, so the
 * composer never fails on a bare project. Derives the trailing segment of a scoped
 * name ("@acme/shop" → "shop").
 */
export async function readProjectName(cwd: string): Promise<string> {
  const fallback = cwd.split(/[/\\]/).filter(Boolean).pop() ?? "app";
  try {
    const pkg = JSON.parse(await readFile(join(cwd, "package.json"), "utf8")) as { name?: unknown };
    if (typeof pkg.name === "string" && pkg.name.length > 0) {
      const slash = pkg.name.lastIndexOf("/");
      return slash === -1 ? pkg.name : pkg.name.slice(slash + 1);
    }
  } catch {
    // No/invalid package.json — fall back to the dir name.
  }
  return fallback;
}

/** Options accepted by the composeApp library entry + the CLI command. */
export interface ComposeAppOptions {
  /** Project root (must contain cronus-ui.json). */
  targetDir: string;
  /** Bundled template name (mutually exclusive with `manifestPath`). */
  template?: string;
  /** Explicit manifest file path (mutually exclusive with `template`). */
  manifestPath?: string;
  /** Plan-shaping choices (brand/seed/pages/variants). */
  choices?: ComposeChoiceInput;
  /** Overwrite existing files instead of skipping (default false). */
  overwrite?: boolean;
  /** Skip the npm install step (default false). */
  skipInstall?: boolean;
  /** Override the registry source (else use the project config's). */
  registry?: string;
}

/** Result of a successful compose (for programmatic callers / tests). */
export interface ComposeAppResult {
  /** The template/manifest name (the `composed{}` key). */
  templateName: string;
  /** The resolved project/brand name. */
  appName: string;
  installedBlocks: string[];
  generatedFiles: string[];
  skippedFiles: string[];
}

/**
 * Compose an app template into an existing Cronus UI project: resolve + install the
 * blocks, customize the chrome copies (nav data + brand), write the generated
 * pages/layouts/wrappers, snapshot the emitted bytes, and record `installed{}` +
 * `composed{}`. Reuses the exact `add` install core — this is one more caller, not
 * a new write path. Throws {@link ComposePlanError} / {@link ManifestError} on
 * invalid input.
 */
export async function composeApp(options: ComposeAppOptions): Promise<ComposeAppResult> {
  const { targetDir } = options;
  if (!hasConfig(targetDir)) {
    throw new Error("No cronus-ui.json found. Run `cronus-ui init` first.");
  }
  const config = await readConfig(targetDir);
  const sourceUsed = options.registry ?? config.registry;
  const registry = new Registry(sourceUsed);

  const manifest =
    options.manifestPath !== undefined
      ? await loadManifestFile(options.manifestPath)
      : await loadTemplate(requireTemplate(options.template));

  const meta = await readComposeMeta(registry);
  if (meta === null) {
    throw new Error(
      "This registry does not ship a meta.json sidecar — compose needs it (upgrade the CLI/registry to v0.4.0+).",
    );
  }
  const index = await registry.index();
  const chromeSources = await readChromeSources(manifest, registry);

  const choices: ComposeChoiceInput = {
    ...options.choices,
    appName: options.choices?.appName ?? (await readProjectName(targetDir)),
  };
  const plan = buildComposePlan(manifest, choices, index, meta, chromeSources);

  // --- Resolve + install the blocks (unchanged install core) ----------------
  const items = await registry.resolve(plan.blockSlugs);
  const installedVersion = registrySourceVersion(sourceUsed) ?? CLI_VERSION;
  const installed: Record<string, InstalledRecord> = { ...config.installed };
  const overwrite = options.overwrite ?? false;

  const installedBlocks: string[] = [];
  // Files the install loop actually wrote this run (fresh install or --overwrite).
  // Used to gate the chrome rewrite: only customize a chrome copy we just laid
  // down pristine — never a pre-existing one that the user may have hand-edited.
  const writtenThisRun = new Set<string>();
  for (const item of items) {
    const { written } = await writeItemFiles(item, config, targetDir, { overwrite });
    for (const path of written) writtenThisRun.add(path);
    if (written.length === item.files.length && written.length > 0) {
      installed[item.name] = { version: installedVersion, files: written };
      if (item.type === "registry:block") installedBlocks.push(item.name);
    }
  }

  const generatedFiles: string[] = [];
  const skippedFiles: string[] = [];

  // --- Customize the installed chrome copies in place -----------------------
  // The chrome block was just (re)installed pristine by the loop above. Honor
  // the same collision-safety guarantee as the generated pages: if the install
  // loop SKIPPED it (already existed, no --overwrite), the on-disk copy is the
  // previously-customized bytes the user may have edited — do NOT clobber it.
  // Only rewrite a chrome copy we actually wrote this run.
  const { files: generated, chromeRewrites } = renderPlan(plan, config);
  for (const rewrite of chromeRewrites) {
    if (!writtenThisRun.has(rewrite.file)) {
      skippedFiles.push(rewrite.file);
      continue;
    }
    const dest = resolveSafeDest(targetDir, ".", rewrite.file);
    await writeFileEnsured(dest, rewriteImports(rewrite.content, config));
    generatedFiles.push(rewrite.file);
  }

  // --- Write the generated pages/layouts/wrappers (safe writes) -------------
  for (const file of generated) {
    const dest = resolveSafeDest(targetDir, ".", file.path);
    if (existsSync(dest) && !overwrite) {
      skippedFiles.push(file.path);
      continue;
    }
    await writeFileEnsured(dest, file.content);
    generatedFiles.push(file.path);
    // Base snapshot: the exact bytes emitted, for the F4 3-way page upgrade.
    // Keyed by template name (the composed{} key), not package.json name — a
    // project can compose several templates.
    const snapDest = resolveSafeDest(targetDir, baseSnapshotDir(plan.templateName), file.path);
    await writeFileEnsured(snapDest, file.content);
  }

  // Authenticated gold path (saas/admin only): sqlite + drizzle + better-auth.
  if (isGoldPathTemplate(plan.templateName)) {
    const gold = await applyGoldPath({
      targetDir,
      config,
      generatedFiles,
      overwrite,
      templateName: plan.templateName,
    });
    generatedFiles.push(...gold.written);
    skippedFiles.push(...gold.skipped);
  }

  // --- Record composed{} + installed{} --------------------------------------
  // Keyed by TEMPLATE name (not project name): a project can compose several
  // templates, and re-composing the same one updates its record in place.
  //
  // `files` must describe the app's COMPLETE generated surface, independent of
  // what this particular run happened to write. On a benign re-compose (no
  // --overwrite) every page + chrome copy already exists and goes to
  // skippedFiles, so `generatedFiles` is empty; a straight assignment would
  // clobber the record to `files: []` and orphan every composed page from its
  // .cronus-ui/base/ snapshot (the F4 3-way upgrade merge base). Union with the
  // prior record so a no-op re-run never empties the tracked file set.
  const composed: Record<string, ComposedRecord> = { ...config.composed };
  const priorFiles = config.composed?.[plan.templateName]?.files ?? [];
  composed[plan.templateName] = {
    version: installedVersion,
    planVersion: plan.planVersion,
    choices: plan.choices,
    files: [...new Set([...priorFiles, ...generatedFiles])].sort(),
    // Compose provenance: lets add-page verify a bundled reload is the SAME
    // manifest this app was composed from (guards the bundled-name collision).
    manifestHash: manifestFingerprint(manifest),
  };
  const nextConfig: CronusUIConfig = { ...config, installed, composed };
  await writeConfig(targetDir, nextConfig);

  writeDesignDocuments(targetDir, { theme: nextConfig.theme?.name });

  // --- Record + install npm deps --------------------------------------------
  // Always pin registry specs into package.json (lucide-react, recharts, …)
  // even when --no-install: a later `bun install` must match `pm add`.
  const registryDeps = collectDependencies(items);
  await recordDependencies(targetDir, registryDeps);
  const deps = isGoldPathTemplate(plan.templateName)
    ? [...new Set([...registryDeps, ...GOLD_PATH_DEPENDENCIES])].sort()
    : registryDeps;
  if (deps.length > 0 && !(options.skipInstall ?? false)) {
    const pm = detectPackageManager(targetDir);
    try {
      await runInstall(pm, deps, targetDir);
    } catch {
      // Non-fatal: caller/log surfaces the manual command.
    }
  }

  return {
    templateName: plan.templateName,
    appName: plan.appName,
    installedBlocks,
    generatedFiles,
    skippedFiles,
  };
}

function requireTemplate(template: string | undefined): string {
  if (template === undefined || template.length === 0) {
    throw new Error("No template given. Pass a template name, e.g. `cronus-ui compose store`.");
  }
  return template;
}

/** CLI-facing options (flags parsed by commander in index.ts). */
export interface ComposeCommandOptions {
  cwd: string;
  registry?: string;
  manifest?: string;
  pages?: string;
  variant?: string[];
  brand?: string;
  seed?: string;
  overwrite?: boolean;
  skipInstall?: boolean;
  dryRun?: boolean;
  yes?: boolean;
}

/**
 * Parse `--variant login=split --variant footer=mega` into a `{ slug: variant }`
 * record. Each pair MUST be `slug=variant` with a non-empty slug and variant;
 * a malformed pair (no `=`, empty side) throws so a typo like `--variant login`
 * fails loud instead of being silently dropped. A repeated slug keeps the last
 * value (last flag wins).
 */
export function parseVariants(pairs: string[] | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of pairs ?? []) {
    const eq = pair.indexOf("=");
    const slug = eq > 0 ? pair.slice(0, eq) : "";
    const variant = eq > 0 ? pair.slice(eq + 1) : "";
    if (slug.length === 0 || variant.length === 0) {
      throw new Error(`Invalid --variant "${pair}" (expected "slug=variant", e.g. login=split).`);
    }
    out[slug] = variant;
  }
  return out;
}

/** Parse a comma-separated `--pages /,/products,login` into normalized routes. */
function parsePages(spec: string | undefined): string[] | undefined {
  if (spec === undefined) return undefined;
  return spec
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => (s.startsWith("/") ? s : `/${s}`));
}

/**
 * The `cronus-ui compose` command. Resolves a template (bundled or `--manifest`),
 * plans + validates it (aggregating errors), and either prints a deterministic
 * dry-run preview or applies it via {@link composeApp}. TTY-prompts for a template
 * when none is given (unless `--yes`).
 */
export async function compose(
  templateArg: string | undefined,
  options: ComposeCommandOptions,
): Promise<void> {
  const { cwd } = options;

  if (!hasConfig(cwd)) {
    log.err("No cronus-ui.json found. Run `cronus-ui init` first.");
    process.exitCode = 1;
    return;
  }

  const seed = options.seed !== undefined ? Number.parseInt(options.seed, 10) : undefined;
  if (options.seed !== undefined && (seed === undefined || Number.isNaN(seed))) {
    log.err(`Invalid --seed "${options.seed}" (expected an integer).`);
    process.exitCode = 1;
    return;
  }

  // Parse `--variant slug=variant` up front so a malformed pair fails loud before
  // any registry work (parseVariants throws on a bad shape).
  let variants: Record<string, string>;
  try {
    variants = parseVariants(options.variant);
  } catch (err) {
    log.err((err as Error).message);
    process.exitCode = 1;
    return;
  }

  // Resolve which template/manifest to use.
  let template = templateArg;
  const usingManifestFile = options.manifest !== undefined;
  if (!usingManifestFile && template === undefined) {
    const available = await listTemplates();
    if (available.length === 0) {
      log.err("No app templates are bundled with this CLI.");
      process.exitCode = 1;
      return;
    }
    template = await promptTemplate(available, options.yes ?? false);
  }

  const config = await readConfig(cwd);
  const sourceUsed = options.registry ?? config.registry;
  const registry = new Registry(sourceUsed);

  // Load + validate the manifest.
  let manifest: AppManifest;
  try {
    manifest = usingManifestFile
      ? await loadManifestFile(options.manifest as string)
      : await loadTemplate(template as string);
  } catch (err) {
    reportError(err);
    process.exitCode = 1;
    return;
  }

  const meta = await readComposeMeta(registry);
  if (meta === null) {
    log.err(
      "This registry does not ship a meta.json sidecar — compose needs it (upgrade to v0.4.0+).",
    );
    process.exitCode = 1;
    return;
  }
  const index = await registry.index();
  const chromeSources = await readChromeSources(manifest, registry);

  const parsedPages = parsePages(options.pages);
  const choices: ComposeChoiceInput = {
    appName: await readProjectName(cwd),
    ...(options.brand !== undefined ? { brand: options.brand } : {}),
    ...(seed !== undefined ? { seed } : {}),
    ...(parsedPages !== undefined ? { pages: parsedPages } : {}),
    variants,
  };

  // Plan + validate (aggregate ALL errors).
  let plan: ReturnType<typeof buildComposePlan>;
  try {
    plan = buildComposePlan(manifest, choices, index, meta, chromeSources);
  } catch (err) {
    reportError(err);
    process.exitCode = 1;
    return;
  }

  // --- Dry-run: preview + per-file plan, write nothing ----------------------
  if (options.dryRun === true) {
    log.title(`Compose plan (dry-run) — ${plan.title}`);
    console.log(renderPreview(plan));
    console.log("");
    const { files } = renderPlan(plan, config);
    for (const file of files) log.step(`Would write ${file.path}`);
    for (const slug of plan.chromeSlugs) {
      log.step(`Would customize ${config.paths.blocks}/${slug}.tsx (nav links + brand)`);
    }
    log.title(
      `Plan: ${plan.blockSlugs.length} block(s), ${plan.pages.length} page(s), ${plan.chromes.length} chrome group(s). Nothing written (dry-run).`,
    );
    return;
  }

  // --- Apply -----------------------------------------------------------------
  log.title(`Composing ${plan.title}`);
  let result: ComposeAppResult;
  try {
    result = await composeApp({
      targetDir: cwd,
      ...(usingManifestFile ? { manifestPath: options.manifest } : { template }),
      choices,
      overwrite: options.overwrite ?? false,
      skipInstall: options.skipInstall ?? false,
      registry: options.registry,
    });
  } catch (err) {
    reportError(err);
    process.exitCode = 1;
    return;
  }

  for (const path of result.generatedFiles) log.ok(`Generated ${path}`);
  for (const path of result.skippedFiles) log.warn(`Skipped ${path} (exists — use --overwrite)`);
  if (result.installedBlocks.length > 0) {
    log.step(
      `Installed ${result.installedBlocks.length} block(s): ${result.installedBlocks.join(", ")}`,
    );
  }
  log.title(
    `Done — ${result.templateName}: ${result.installedBlocks.length} block(s) + ${result.generatedFiles.length} generated file(s).`,
  );
  log.title("Next steps");
  log.step("npx cronus-ui add-page --route /pricing --blocks pricing,cta --nav Pricing");
  log.step("npx cronus-ui theme set aurora --mode dark");
  log.step("npx cronus-ui upgrade --all --dry-run");
}

/** Print a plan/manifest error's aggregated list, or a plain message. */
function reportError(err: unknown): void {
  if (err instanceof ComposePlanError) {
    log.err("Compose plan is invalid:");
    for (const e of err.errors) log.step(e);
    return;
  }
  // ManifestError carries an `errors` array too (duck-typed to avoid a cyclic import cost).
  const maybe = err as Partial<ManifestError>;
  if (Array.isArray(maybe.errors)) {
    log.err("App manifest is invalid:");
    for (const e of maybe.errors) log.step(e);
    return;
  }
  log.err((err as Error).message);
}

/** TTY-prompt for a template name; `--yes`/non-TTY picks SaaS (not lexical first). */
async function promptTemplate(available: string[], yes: boolean): Promise<string> {
  const fallback = defaultComposeTemplate(available);
  if (yes || !process.stdin.isTTY) return fallback;
  const { createInterface } = await import("node:readline/promises");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log("Pick an app template:");
    available.forEach((name, i) => {
      console.log(`  ${i + 1} ${name}`);
    });
    const answer = (
      await rl.question(`(1-${available.length} or name, default ${fallback}) `)
    ).trim();
    if (answer.length === 0) return fallback;
    const asNum = Number.parseInt(answer, 10);
    if (Number.isInteger(asNum)) {
      const picked = available[asNum - 1];
      if (picked !== undefined) return picked;
    }
    return available.includes(answer) ? answer : fallback;
  } finally {
    rl.close();
  }
}

export type { RegistryItem };
