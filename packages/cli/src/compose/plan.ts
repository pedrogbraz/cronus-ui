/**
 * Pure plan builder + validator. Turns a parsed {@link AppManifest} + caller
 * `choices` into a {@link ComposePlan} the renderer consumes, and aggregates ALL
 * semantic errors (block exists? kind fits slot? routes unique/valid? no
 * dynamic-slug collisions Next rejects? chrome refs exist? extras resolve to a
 * page-kind special file? deps safe?) before returning — never bailing on the
 * first. Nothing here touches the filesystem; the command feeds it the registry
 * index, meta, and shipped chrome sources.
 */

import type { ComposedChoices } from "../config.js";
import type { RegistryIndex } from "../registry.js";
import { assertValidDependency, closestName } from "../utils.js";
import { type AppManifest, type BlockRef, blockRefParts, type Page } from "./manifest.js";

/** Semantic kind of a block (mirrors build-registry's BlockKind, read from meta). */
export type BlockKind = "page" | "section" | "chrome" | "email";

/** A brand-token anchor as recorded in meta. */
export interface BrandToken {
  token: string;
  literal: string;
}

/**
 * A block variant as recorded in meta: its id + the registry `item` the composer
 * installs (bare `<slug>` for the default, `<slug>--<id>` otherwise) + the
 * component `exportName` a generated page imports.
 */
export interface VariantMetaRef {
  id: string;
  item: string;
  exportName: string;
}

/** The subset of `registry/meta.json` the planner reads. */
export interface ComposeMetaBlock {
  exportName: string;
  kind: BlockKind;
  dataSlots: string[];
  brandTokens: BrandToken[];
  /** Declared variants (default first); empty when the block has none. */
  variants?: VariantMetaRef[];
}
export interface ComposeMeta {
  blocks: Record<string, ComposeMetaBlock>;
}

/**
 * A resolved block inside a page: its family slug, the registry `item` name to
 * install (bare `<slug>`, or `<slug>--<variant>` for a non-default variant), the
 * `exportName` a generated page imports, the block kind, and the selected
 * `variant` id when a non-default variant was chosen (absent for the default).
 */
export interface PlanBlock {
  slug: string;
  /** Registry item name to install/import from (`<slug>` or `<slug>--<variant>`). */
  item: string;
  exportName: string;
  kind: BlockKind;
  /** Selected non-default variant id (absent = default variant). */
  variant?: string;
}

/** A resolved page ready to render. */
export interface PlanPage {
  route: string;
  title: string;
  nav?: string;
  chrome: string;
  blocks: PlanBlock[];
}

/** A resolved chrome group (route group + its navbar/footer/shell slugs). */
export interface PlanChrome {
  group: string;
  navbar?: string;
  footer?: string;
  /** App-shell chrome block slug (sidebar shell), when the group uses one. */
  block?: string;
}

/**
 * A resolved Next special-file block (from `manifest.extras`). `file` is the
 * emitted Next special-file path (e.g. `app/not-found.tsx`) and the block is a
 * page-kind block wrapped by the renderer under the golden rule.
 */
export interface PlanExtra {
  /** The extras KEY = the Next special-file name (e.g. "not-found"). */
  key: string;
  /** Emitted file path under `app/` (e.g. "app/not-found.tsx"). */
  file: string;
  /** The resolved block slug for this special file. */
  slug: string;
  /** The block's meta export name (what the wrapper imports). */
  exportName: string;
}

/** The fully-resolved, validated plan the renderer turns into files. */
export interface ComposePlan {
  /** The template/manifest name — the key of the `composed{}` record. */
  templateName: string;
  /** The project name (brand default + `__APP_NAME__` + legacy snapshot-dir fallback). */
  appName: string;
  planVersion: number;
  title: string;
  description: string;
  choices: ComposedChoices;
  pages: PlanPage[];
  chromes: PlanChrome[];
  /** Resolved Next special-file blocks (from `manifest.extras`), sorted by key. */
  extras: PlanExtra[];
  /**
   * Every unique registry ITEM the plan installs (pages + chrome + extras),
   * sorted. Item names, not family slugs: a non-default variant contributes its
   * `<slug>--<variant>` item, so this is what the composer resolves/installs.
   */
  blockSlugs: string[];
  /** Chrome block slugs used by any group, sorted. */
  chromeSlugs: string[];
  /** Shipped source per chrome slug (for the in-place data-slot/brand rewrite). */
  chromeSources: Record<string, string>;
  /** Declared data-slots per chrome slug (from meta). */
  dataSlotsBySlug: Record<string, string[]>;
  /** Declared brand tokens per chrome slug (from meta). */
  brandTokensBySlug: Record<string, BrandToken[]>;
  /** Whether any group uses a navbar / footer / shell (drives wrapper emission). */
  usesNavbar: boolean;
  usesFooter: boolean;
  usesShell: boolean;
  navbarSlug?: string;
  footerSlug?: string;
  shellSlug?: string;
  navbarExportName?: string;
  footerExportName?: string;
  shellExportName?: string;
}

/** Thrown by {@link buildComposePlan} carrying EVERY semantic error found. */
export class ComposePlanError extends Error {
  readonly errors: string[];
  constructor(errors: string[]) {
    super(`Invalid compose plan:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
    this.name = "ComposePlanError";
    this.errors = errors;
  }
}

/** Options a caller passes to shape the plan (F1: brand, seed, page subset). */
export interface ComposeChoiceInput {
  /** Brand wordmark; falls back to manifest default (with `__APP_NAME__` filled) then appName. */
  brand?: string;
  /** Aesthetic PRNG seed (recorded when present; F1 renderer does not vary on it yet). */
  seed?: number;
  /** Route subset to include (F2); when omitted, all manifest pages are used. */
  pages?: string[];
  /**
   * Per-family variant override (`{ login: "split" }`); a present entry wins over
   * the manifest ref's declared variant for that slug. Recorded in `composed{}`.
   */
  variants?: Record<string, string>;
  /** Project name, used to fill `__APP_NAME__` in the manifest brand default. */
  appName?: string;
}

/** Valid App Router route: "/", or "/seg" parts of `[a-z0-9-]` / dynamic `[x]`/`[...x]`. */
const ROUTE_SEGMENT_RE = /^(?:\[(?:\.\.\.)?[a-z0-9-]+\]|[a-z0-9-]+)$/;

function isValidRoute(route: string): boolean {
  if (route === "/") return true;
  if (!route.startsWith("/")) return false;
  const segments = route.slice(1).split("/");
  if (segments.some((s) => s.length === 0)) return false; // trailing/double slash
  return segments.every((s) => ROUTE_SEGMENT_RE.test(s));
}

/** True for a dynamic segment `[x]` / `[...x]`. */
function isDynamicSegment(seg: string): boolean {
  return seg.startsWith("[") && seg.endsWith("]");
}

/** The slug NAME inside a dynamic segment (`[...id]` → "id", `[id]` → "id"). */
function dynamicSlugName(seg: string): string {
  return seg.slice(1, -1).replace(/^\.\.\./, "");
}

/**
 * The static route SKELETON: every dynamic segment collapsed to a positional
 * marker so `/products/[id]` and `/products/[slug]` share a skeleton (Next treats
 * them as the same path shape and refuses two different slug names for it).
 */
function routeSkeleton(route: string): string {
  if (route === "/") return "/";
  return route
    .slice(1)
    .split("/")
    .map((seg) => (isDynamicSegment(seg) ? "[*]" : seg))
    .join("/");
}

/**
 * The Next special-file names an `extras` block may target in F1. Each maps its
 * extras KEY to the emitted `app/<file>` special-file path. Only page-kind blocks
 * may fill these (they are full-page surfaces).
 */
const EXTRAS_SPECIAL_FILES: Readonly<Record<string, string>> = {
  "not-found": "app/not-found.tsx",
};

/** Resolve the brand string: explicit choice → manifest default (filled) → appName. */
function resolveBrand(manifest: AppManifest, input: ComposeChoiceInput): string {
  const appName = input.appName ?? manifest.name;
  if (input.brand !== undefined && input.brand.length > 0) return input.brand;
  const dflt = manifest.manifest.defaults?.brand;
  if (dflt !== undefined && dflt.length > 0) return dflt.replaceAll("__APP_NAME__", appName);
  return appName;
}

/** Build the normalized (sorted-key) choices record persisted to `composed{}`. */
function normalizeChoices(
  manifest: AppManifest,
  input: ComposeChoiceInput,
  planPages: PlanPage[],
): ComposedChoices {
  const variants = input.variants ?? {};
  const sortedVariants: Record<string, string> = {};
  for (const key of Object.keys(variants).sort()) {
    const v = variants[key];
    if (v !== undefined) sortedVariants[key] = v;
  }
  return {
    variants: sortedVariants,
    pages: planPages.map((p) => p.route),
    brand: resolveBrand(manifest, input),
    ...(input.seed !== undefined ? { seed: input.seed } : {}),
  };
}

/**
 * Build a {@link ComposePlan} from a parsed manifest, caller choices, the registry
 * index, meta, and the shipped chrome sources. Aggregates ALL semantic errors and
 * THROWS {@link ComposePlanError} when invalid. The returned plan is a pure
 * function of its inputs (stable ordering, no I/O/Date).
 */
export function buildComposePlan(
  manifest: AppManifest,
  input: ComposeChoiceInput,
  index: RegistryIndex,
  meta: ComposeMeta,
  chromeSources: Record<string, string>,
): ComposePlan {
  const errors: string[] = [];
  const known = new Set(index.map((i) => i.name));
  const blockNames = index.filter((i) => i.type === "registry:block").map((i) => i.name);
  const body = manifest.manifest;
  const appName = input.appName ?? manifest.name;

  // Page subset (F2 `--pages`); default = all manifest pages, in order.
  const wantRoutes = input.pages;
  const selectedPages: Page[] =
    wantRoutes === undefined ? body.pages : body.pages.filter((p) => wantRoutes.includes(p.route));
  if (wantRoutes !== undefined) {
    for (const route of wantRoutes) {
      if (!body.pages.some((p) => p.route === route)) {
        errors.push(`--pages: route "${route}" is not in the "${manifest.name}" template`);
      }
    }
    if (selectedPages.length === 0) {
      errors.push(`--pages: selection matched no pages in the "${manifest.name}" template`);
    }
  }

  // Per-family variant overrides from choices (`--variant login=split`); a
  // present override wins over whatever variant the manifest ref declared.
  const variantOverrides = input.variants ?? {};

  // Resolve a block ref against the registry index + meta, collecting errors,
  // honoring variants: the effective variant is the choices override (if any),
  // else the manifest ref's `{ block, variant }`. The default variant resolves to
  // the bare `<slug>` item + the block's own export; a non-default variant to
  // `<slug>--<id>` + the variant's export (both read from meta so a generated
  // page imports exactly what ships).
  const resolveBlock = (ref: BlockRef, where: string): PlanBlock | undefined => {
    const { slug, variant: manifestVariant } = blockRefParts(ref);
    if (!known.has(slug)) {
      const suggestion = closestName(slug, blockNames);
      errors.push(
        suggestion
          ? `${where}: unknown block "${slug}". Did you mean "${suggestion}"?`
          : `${where}: unknown block "${slug}".`,
      );
      return undefined;
    }
    const m = meta.blocks[slug];
    if (m === undefined) {
      errors.push(`${where}: block "${slug}" has no metadata (regenerate registry meta.json).`);
      return undefined;
    }

    // Choice override wins over the manifest-declared variant.
    const wantVariant = variantOverrides[slug] ?? manifestVariant;
    if (wantVariant === undefined) {
      // Default variant → bare item + the block's own export.
      return { slug, item: slug, exportName: m.exportName, kind: m.kind };
    }

    const variants = m.variants ?? [];
    const match = variants.find((v) => v.id === wantVariant);
    if (match === undefined) {
      const ids = variants.map((v) => v.id);
      const suggestion = closestName(wantVariant, ids);
      const hint = ids.length > 0 ? ` (known: ${ids.join(", ")})` : " (this block has no variants)";
      errors.push(
        suggestion
          ? `${where}: unknown variant "${wantVariant}" for block "${slug}". Did you mean "${suggestion}"?`
          : `${where}: unknown variant "${wantVariant}" for block "${slug}"${hint}.`,
      );
      return undefined;
    }

    // Meta named a variant item; the registry index must actually publish it,
    // else `registry.resolve(plan.blockSlugs)` would later crash with a raw
    // ENOENT on the missing item file. This can happen on a drifted custom
    // `--registry` whose meta references a variant its index omits; the shipped
    // registry is protected by check-registry's validateVariantItems gate.
    if (!known.has(match.item)) {
      errors.push(
        `${where}: variant "${wantVariant}" of block "${slug}" resolves to item "${match.item}", ` +
          `which the registry index does not publish (regenerate/repair the registry).`,
      );
      return undefined;
    }

    // A matched variant carries its own registry item + export. The default
    // variant's meta `item` equals the bare slug (so `variant` stays absent);
    // a non-default variant records its id so the renderer imports from
    // `<slug>--<id>`.
    const isDefault = match.item === slug;
    return {
      slug,
      item: match.item,
      exportName: match.exportName,
      kind: m.kind,
      ...(isDefault ? {} : { variant: match.id }),
    };
  };

  // --- Pages ---------------------------------------------------------------
  const seenRoutes = new Set<string>();
  const planPages: PlanPage[] = [];
  const chromeGroupsUsed = new Set<string>();
  // Family slugs a page/extras block references — the ONLY slots where a
  // `--variant` override is consulted (inside resolveBlock). Chrome-slot slugs
  // and slugs matching no slot are validated separately below so an override
  // that had no effect is never silently accepted+persisted.
  const variantTargetSlugs = new Set<string>();

  for (const page of selectedPages) {
    const where = `page "${page.route}"`;

    if (!isValidRoute(page.route)) {
      errors.push(`${where}: invalid route (use "/" or lowercase "/a-z0-9-" / dynamic "[id]").`);
    }
    if (seenRoutes.has(page.route)) {
      errors.push(`${where}: duplicate route.`);
    }
    seenRoutes.add(page.route);

    if (!(page.chrome in body.chrome)) {
      errors.push(`${where}: chrome group "${page.chrome}" is not defined in manifest.chrome.`);
    } else {
      chromeGroupsUsed.add(page.chrome);
    }

    const blocks: PlanBlock[] = [];
    page.blocks.forEach((ref, i) => {
      variantTargetSlugs.add(blockRefParts(ref).slug);
      const resolved = resolveBlock(ref, `${where}.blocks[${i}]`);
      if (resolved === undefined) return;
      // Semantic slot check: email never in a page; chrome only in a chrome slot.
      if (resolved.kind === "email") {
        errors.push(
          `${where}.blocks[${i}]: block "${resolved.slug}" is an email template — it cannot be a page section.`,
        );
      }
      if (resolved.kind === "chrome") {
        errors.push(
          `${where}.blocks[${i}]: block "${resolved.slug}" is layout chrome — it belongs in a chrome group, not a page.`,
        );
      }
      blocks.push(resolved);
    });

    planPages.push({
      route: page.route,
      title: page.title,
      ...(page.nav !== undefined ? { nav: page.nav } : {}),
      chrome: page.chrome,
      blocks,
    });
  }

  // Dynamic-slug collisions Next.js rejects at build time, checked per chrome
  // group (route groups are path-transparent, so sibling routes in the SAME group
  // share a URL namespace):
  //   1. Two routes with the same static skeleton but different dynamic-slug NAMES
  //      → "You cannot use different slug names for the same dynamic path".
  //   2. A single route that repeats a slug name across its dynamic segments
  //      → "You cannot have the same slug name repeated within a single path".
  // isValidRoute only validates each segment in isolation; seenRoutes only dedupes
  // whole strings — neither catches these, so an otherwise-clean plan would fail
  // `next build`. Grouped by chrome so identical routes under different groups (a
  // real, valid layout split) are not falsely flagged.
  const skeletonSlugByGroup = new Map<string, Map<string, { route: string; name: string }>>();
  for (const page of planPages) {
    if (!isValidRoute(page.route)) continue; // already reported; skeleton is meaningless

    // (2) repeated slug name within one path.
    const dynSegs =
      page.route === "/" ? [] : page.route.slice(1).split("/").filter(isDynamicSegment);
    const namesSeen = new Set<string>();
    for (const seg of dynSegs) {
      const name = dynamicSlugName(seg);
      if (namesSeen.has(name)) {
        errors.push(
          `page "${page.route}": dynamic slug "[${name}]" is repeated in the same route.`,
        );
      }
      namesSeen.add(name);
    }

    // (1) same skeleton, different slug name, within the same chrome group.
    if (dynSegs.length === 0) continue;
    const skeleton = routeSkeleton(page.route);
    const name = dynSegs.map(dynamicSlugName).join("/");
    let bySkeleton = skeletonSlugByGroup.get(page.chrome);
    if (bySkeleton === undefined) {
      bySkeleton = new Map();
      skeletonSlugByGroup.set(page.chrome, bySkeleton);
    }
    const prior = bySkeleton.get(skeleton);
    if (prior !== undefined && prior.name !== name) {
      errors.push(
        `page "${page.route}": dynamic slug name(s) differ from "${prior.route}" for the same route shape ` +
          `— Next.js requires one slug name per dynamic path position.`,
      );
    } else if (prior === undefined) {
      bySkeleton.set(skeleton, { route: page.route, name });
    }
  }

  // --- Chrome groups -------------------------------------------------------
  const planChromes: PlanChrome[] = [];
  const chromeSlugsSet = new Set<string>();
  // Family slugs a chrome slot (navbar/footer/shell) references in a USED group,
  // whether or not the ref resolved — chrome slots never consult `--variant`, so
  // an override targeting one is rejected below rather than silently dropped.
  const chromeSlotSlugs = new Set<string>();
  let usesNavbar = false;
  let usesFooter = false;
  let usesShell = false;
  let navbarSlug: string | undefined;
  let footerSlug: string | undefined;
  let shellSlug: string | undefined;
  // The renderer collapses the shell to SINGLE globals (one shellSlug + one
  // AppShellNav wrapper scoped to one group). Two shell groups would both import
  // that single wrapper and mis-render the sidebar nav of every group after the
  // first, so only one shell group per app is supported. Count them to fail loud.
  const shellGroups: string[] = [];

  // Only groups actually used by an included page get a layout (sorted for stability).
  for (const group of [...chromeGroupsUsed].sort()) {
    const def = body.chrome[group];
    if (def === undefined) continue; // already reported above
    const chrome: PlanChrome = { group };

    // Validate one chrome-block ref (navbar / footer / shell): the block must
    // exist, have meta, and be kind "chrome". On success it records the slug in
    // `chrome` + the shared wrapper globals. `slot` is only used for the error
    // wording; the caller wires the resolved slug into the right field.
    const checkChromeRef = (slug: string, slot: "navbar" | "footer" | "block"): void => {
      if (!known.has(slug)) {
        const suggestion = closestName(slug, blockNames);
        errors.push(
          suggestion
            ? `chrome "${group}".${slot}: unknown block "${slug}". Did you mean "${suggestion}"?`
            : `chrome "${group}".${slot}: unknown block "${slug}".`,
        );
        return;
      }
      const m = meta.blocks[slug];
      if (m === undefined) {
        errors.push(`chrome "${group}".${slot}: block "${slug}" has no metadata.`);
        return;
      }
      if (m.kind !== "chrome") {
        errors.push(
          `chrome "${group}".${slot}: block "${slug}" is kind "${m.kind}" — only chrome blocks belong in a chrome slot.`,
        );
        return;
      }
      chromeSlugsSet.add(slug);
      if (slot === "navbar") {
        chrome.navbar = slug;
        usesNavbar = true;
        navbarSlug = slug;
      } else if (slot === "footer") {
        chrome.footer = slug;
        usesFooter = true;
        footerSlug = slug;
      } else {
        chrome.block = slug;
        usesShell = true;
        shellSlug = slug;
      }
    };

    if (def.navbar !== undefined) {
      chromeSlotSlugs.add(def.navbar);
      checkChromeRef(def.navbar, "navbar");
    }
    if (def.footer !== undefined) {
      chromeSlotSlugs.add(def.footer);
      checkChromeRef(def.footer, "footer");
    }
    // The app-shell chrome block (sidebar shell): the (app)-group layout wraps
    // {children} in it, exactly as (site) wraps SiteNav/SiteFooter. Mixing a
    // shell with navbar/footer in one group is a design error — a shell IS the
    // full page frame — so reject that combination up front.
    if (def.block !== undefined) {
      if (def.navbar !== undefined || def.footer !== undefined) {
        errors.push(
          `chrome "${group}": a shell "block" cannot be combined with navbar/footer in the same group.`,
        );
      }
      shellGroups.push(group);
      chromeSlotSlugs.add(def.block);
      checkChromeRef(def.block, "block");
    }
    planChromes.push(chrome);
  }

  // Only ONE shell group per app is supported: the renderer emits a single
  // AppShellNav wrapper backed by one block copy scoped to one group, so a
  // second shell group would silently render the first group's sidebar nav.
  // Fail loud, mirroring the shell+navbar/footer guard above.
  if (shellGroups.length > 1) {
    const [, ...extras] = shellGroups;
    for (const group of extras) {
      errors.push(
        `chrome "${group}": only one shell "block" group is supported per app ` +
          `(already used by "${shellGroups[0]}").`,
      );
    }
  }

  // --- Chrome sources + meta lookups (for the renderer) --------------------
  const resolvedChromeSources: Record<string, string> = {};
  const dataSlotsBySlug: Record<string, string[]> = {};
  const brandTokensBySlug: Record<string, BrandToken[]> = {};
  for (const slug of [...chromeSlugsSet].sort()) {
    const source = chromeSources[slug];
    if (source === undefined) {
      errors.push(`chrome block "${slug}": shipped source is unavailable (registry read failed).`);
    } else {
      resolvedChromeSources[slug] = source;
    }
    const m = meta.blocks[slug];
    if (m !== undefined) {
      dataSlotsBySlug[slug] = [...m.dataSlots];
      brandTokensBySlug[slug] = m.brandTokens.map((b) => ({ ...b }));
    }
  }

  // --- Extras (Next special-file blocks, e.g. not-found → app/not-found.tsx) ---
  // Resolve each declared extras block the same way page blocks are, then require
  // it to be a page-kind block (special files are full-page surfaces) and map its
  // KEY to a supported Next special-file path. Resolved extras are installed and
  // wrapped by the renderer under the golden rule. Sorted by key for determinism.
  const planExtras: PlanExtra[] = [];
  const extras = body.extras ?? {};
  for (const key of Object.keys(extras).sort()) {
    const slug = extras[key];
    if (slug === undefined) continue; // never happens (own key); satisfies the checker
    const where = `extras."${key}"`;
    const file = EXTRAS_SPECIAL_FILES[key];
    if (file === undefined) {
      const suggestion = closestName(key, Object.keys(EXTRAS_SPECIAL_FILES));
      errors.push(
        suggestion
          ? `${where}: unsupported special file "${key}". Did you mean "${suggestion}"?`
          : `${where}: unsupported special file "${key}" (supported: ${Object.keys(EXTRAS_SPECIAL_FILES).join(", ")}).`,
      );
      continue;
    }
    variantTargetSlugs.add(blockRefParts(slug).slug);
    const resolved = resolveBlock(slug, where);
    if (resolved === undefined) continue; // resolveBlock already pushed the error
    if (resolved.kind !== "page") {
      errors.push(
        `${where}: block "${resolved.slug}" is kind "${resolved.kind}" — a Next special file needs a page-kind block.`,
      );
      continue;
    }
    planExtras.push({ key, file, slug: resolved.slug, exportName: resolved.exportName });
  }

  // --- Variant-override targets --------------------------------------------
  // A `--variant slug=id` override is consulted ONLY inside resolveBlock, i.e.
  // only for a family slug some included page/extras block references. If the
  // slug is a chrome-slot slug (navbar/footer/shell), the override is silently
  // ignored (chrome variants are out of F2 scope); if it matches no slot at all
  // (typo / dead / nonexistent slug), it is silently ignored too. Either way the
  // override is still persisted into choices.variants, producing a record that
  // does not match the generated app. Cross-check every override key here so an
  // override that had no effect fails loud instead — mirroring the clear
  // did-you-mean error a page-block variant typo already gets.
  for (const slug of Object.keys(variantOverrides).sort()) {
    if (variantTargetSlugs.has(slug)) continue; // applied by a page/extras block
    if (chromeSlotSlugs.has(slug)) {
      errors.push(
        `--variant "${slug}": chrome slots (navbar/footer/shell) do not accept --variant.`,
      );
      continue;
    }
    const suggestion = closestName(slug, [...variantTargetSlugs]);
    errors.push(
      suggestion
        ? `--variant "${slug}": no included page/extras block uses block "${slug}". Did you mean "${suggestion}"?`
        : `--variant "${slug}": no included page/extras block uses block "${slug}".`,
    );
  }

  // --- Dependencies (arg-injection guard reuse) ----------------------------
  // Collect the registry ITEM names to install (a non-default variant contributes
  // its `<slug>--<variant>` item, not the bare slug), so resolve/install and the
  // arg-injection guard both run over exactly what lands on disk. Chrome + extras
  // are bare items (no variants in those slots in F2).
  const allBlockItems = new Set<string>();
  for (const page of planPages) for (const b of page.blocks) allBlockItems.add(b.item);
  for (const slug of chromeSlugsSet) allBlockItems.add(slug);
  for (const extra of planExtras) allBlockItems.add(extra.slug);
  for (const entry of index) {
    if (!allBlockItems.has(entry.name)) continue;
    for (const dep of entry.dependencies) {
      try {
        assertValidDependency(dep);
      } catch (err) {
        errors.push(`block "${entry.name}": ${(err as Error).message}`);
      }
    }
  }

  const navbarMeta = navbarSlug !== undefined ? meta.blocks[navbarSlug] : undefined;
  const footerMeta = footerSlug !== undefined ? meta.blocks[footerSlug] : undefined;
  const shellMeta = shellSlug !== undefined ? meta.blocks[shellSlug] : undefined;

  const plan: ComposePlan = {
    templateName: manifest.name,
    appName,
    planVersion: manifest.planVersion,
    title: body.title,
    description: body.description,
    choices: normalizeChoices(manifest, input, planPages),
    pages: planPages,
    chromes: planChromes,
    extras: planExtras,
    blockSlugs: [...allBlockItems].sort(),
    chromeSlugs: [...chromeSlugsSet].sort(),
    chromeSources: resolvedChromeSources,
    dataSlotsBySlug,
    brandTokensBySlug,
    usesNavbar,
    usesFooter,
    usesShell,
    ...(navbarSlug !== undefined ? { navbarSlug } : {}),
    ...(footerSlug !== undefined ? { footerSlug } : {}),
    ...(shellSlug !== undefined ? { shellSlug } : {}),
    ...(navbarMeta !== undefined ? { navbarExportName: navbarMeta.exportName } : {}),
    ...(footerMeta !== undefined ? { footerExportName: footerMeta.exportName } : {}),
    ...(shellMeta !== undefined ? { shellExportName: shellMeta.exportName } : {}),
  };

  if (errors.length > 0) throw new ComposePlanError(errors);
  return plan;
}

/**
 * Validate-only entry point: builds the plan and returns the aggregated error
 * list (empty when valid) instead of throwing. Handy for `--dry-run` callers and
 * tests that assert on the full error set. The successful plan is returned too.
 */
export function validateComposePlan(
  manifest: AppManifest,
  input: ComposeChoiceInput,
  index: RegistryIndex,
  meta: ComposeMeta,
  chromeSources: Record<string, string>,
): { plan?: ComposePlan; errors: string[] } {
  try {
    const plan = buildComposePlan(manifest, input, index, meta, chromeSources);
    return { plan, errors: [] };
  } catch (err) {
    if (err instanceof ComposePlanError) return { errors: err.errors };
    throw err;
  }
}
