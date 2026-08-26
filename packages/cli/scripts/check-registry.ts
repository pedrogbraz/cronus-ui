/**
 * Fails (exit 1) when the committed `registry/*.json` (incl. the `meta.json`
 * sidecar) has drifted from the current @cronus-ui/ui + block sources.
 * Regenerates the registry AND metadata into a temporary directory, then diffs
 * every file (content + presence) against the committed `registry/`.
 *
 * The metadata build (`buildMeta`) additionally enforces the compose invariants
 * before any byte-compare: every block `exportName` is unique across blocks, and
 * every block that declares a data-slot or brand-token actually carries those
 * markers/literals in its shipped source. Those throw a clear, block-scoped
 * Error here (caught and reported) rather than crashing.
 *
 * Finally, every bundled app-template manifest (`templates/apps/*.json`) is
 * planned against the freshly-built registry so a typo'd/dropped block, chrome,
 * or `extras` slug is a RED gate here — not a silent broken app the end user
 * only discovers when they run `compose <template>` (SDD §5 "manifest refs exist").
 *
 * Run:  bun run packages/cli/scripts/check-registry.ts
 *       (wired as the "registry:check" package script)
 */
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ManifestError, parseManifest } from "../src/compose/manifest.ts";
import { buildComposePlan, type ComposeMeta, ComposePlanError } from "../src/compose/plan.ts";
import type { RegistryIndex } from "../src/registry.ts";
import {
  buildItems,
  buildMeta,
  extractExportName,
  loadAppManifests,
  outDir,
  type RegistryItem,
  type RegistryMeta,
  readBlockSources,
  readDemoLibSources,
  readVariantSources,
  serializeRegistry,
  variantItemName,
  writeRegistry,
} from "./build-registry.ts";

async function readIfExists(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

/** Build the planner's `RegistryIndex` view from the freshly-built items. */
function indexOf(items: RegistryItem[]): RegistryIndex {
  return items.map(({ name, type, dependencies, registryDependencies }) => ({
    name,
    type,
    dependencies,
    registryDependencies,
  }));
}

/**
 * The compose-time app-template reference gate (SDD §5 "manifest refs exist").
 *
 * For every bundled `templates/apps/*.json`, strictly `parseManifest` it and then
 * `buildComposePlan` it against the FRESHLY-BUILT registry index + meta + chrome
 * sources — the exact resolution the end user hits at `compose <template>` time,
 * moved to build/CI time. The planner aggregates EVERY reference error: each
 * `pages[].blocks[]` (bare slug or `{ block }`), each `chrome[].{navbar,footer}`
 * ref, and each `extras{}` value (Next special-file blocks like `not-found`) is
 * resolved against the registry, so a typo'd/dropped slug anywhere is a hard gate
 * failure with the offending template + slug — never a silent broken app the end
 * user only hits at `compose <template>`.
 *
 * Returns a flat list of `"<template>: <problem>"` strings (empty when clean).
 */
export function validateAppTemplateRefs(
  manifests: Awaited<ReturnType<typeof loadAppManifests>>,
  items: RegistryItem[],
  meta: RegistryMeta,
  blockSources: Map<string, string>,
): string[] {
  const problems: string[] = [];
  const index = indexOf(items);
  // RegistryMeta.blocks is a structural superset of the planner's ComposeMeta.
  const composeMeta: ComposeMeta = { blocks: meta.blocks };
  // Every chrome-kind block's shipped source, so the planner can resolve a
  // manifest's navbar/footer refs (a missing source is itself reported by it).
  const chromeSources: Record<string, string> = {};
  for (const [slug, block] of Object.entries(meta.blocks)) {
    if (block.kind !== "chrome") continue;
    const source = blockSources.get(slug);
    if (source !== undefined) chromeSources[slug] = source;
  }

  for (const { file, name, raw } of manifests) {
    const where = `templates/apps/${file}`;

    let parsed: ReturnType<typeof parseManifest>;
    try {
      parsed = parseManifest(raw);
    } catch (err) {
      if (err instanceof ManifestError) {
        for (const e of err.errors) problems.push(`${where}: ${e}`);
      } else {
        problems.push(`${where}: ${err instanceof Error ? err.message : String(err)}`);
      }
      continue;
    }

    // The planner resolves every page/chrome/extras block ref against index+meta
    // and aggregates all unknown-block/kind errors into one ComposePlanError.
    try {
      buildComposePlan(parsed, { appName: name }, index, composeMeta, chromeSources);
    } catch (err) {
      if (err instanceof ComposePlanError) {
        for (const e of err.errors) problems.push(`${where}: ${e}`);
      } else {
        throw err;
      }
    }
  }

  return problems;
}

/**
 * The variant-item gate (F2): for every block variant declared in `meta`, its
 * `item` must be a PUBLISHED registry item whose file's shipped export matches
 * the variant's `exportName`, and every block export must be unique across the
 * WHOLE registry (a generated page imports the export by name). Uniqueness is
 * checked against every shipped block item's export — bare blocks (incl. the 35
 * that declare no variants) AND variant items — not just variant-vs-variant, so
 * a variant renamed onto a bare block's export (e.g. `SettingsBlock`) fails loud
 * here. The DEFAULT variant must map to the bare `<slug>` item; a non-default
 * variant to `<slug>--<id>`. Returns a flat list of problems (empty when clean).
 */
export function validateVariantItems(items: RegistryItem[], meta: RegistryMeta): string[] {
  const problems: string[] = [];
  const itemsByName = new Map(items.map((i) => [i.name, i] as const));
  // Every published block item's TS-parsed export (the single exported top-level
  // function), so a variant's meta.exportName can be checked against what really
  // ships. Uses the same robust extractor as the build (comment/string-proof,
  // single-export-enforced); an item that ships zero or multiple exports is left
  // out here and surfaced as a `ships no \`export function\`` problem downstream.
  const exportOfItem = new Map<string, string>();
  for (const item of items) {
    if (item.type !== "registry:block") continue;
    const content = item.files[0]?.content ?? "";
    try {
      exportOfItem.set(item.name, extractExportName(content, item.name));
    } catch {
      // Left unrecorded → the downstream "ships no `export function`" check fires.
    }
  }

  // exportName → the ITEM NAME that first claimed it (must be globally unique
  // across the WHOLE import namespace — bare blocks AND variants). Seed it with
  // every shipped block item's export FIRST so a variant renamed onto a
  // zero-variant bare block's export (e.g. SettingsBlock/OtpBlock — 35 blocks
  // that never appear as a variant entry) is caught here, matching the
  // docstring's "unique across the registry" claim. Owner values are item names
  // throughout, so the variant loop below can assert an exportName is owned by no
  // item other than the variant's own `variant.item` (its default variant simply
  // re-confirms the bare item it already owns from this seed pass — no conflict).
  const exportOwner = new Map<string, string>();
  for (const [itemName, exportName] of exportOfItem) {
    const prior = exportOwner.get(exportName);
    if (prior !== undefined && prior !== itemName) {
      problems.push(
        `item "${itemName}": exportName "${exportName}" is also shipped by "${prior}" — ` +
          `block exports must be unique across the registry.`,
      );
    } else {
      exportOwner.set(exportName, itemName);
    }
  }

  for (const [slug, block] of Object.entries(meta.blocks)) {
    for (const variant of block.variants) {
      const where = `block "${slug}" variant "${variant.id}"`;
      const isDefault = variant.item === slug;
      const expectedItem = isDefault ? slug : variantItemName(slug, variant.id);

      // The default variant maps to the bare slug; a non-default one to `slug--id`.
      if (variant.item !== expectedItem) {
        problems.push(
          `${where}: item "${variant.item}" should be "${expectedItem}" ` +
            `(default → bare slug, non-default → <slug>--<id>).`,
        );
      }

      const published = itemsByName.get(variant.item);
      if (published === undefined) {
        problems.push(`${where}: no published registry item "${variant.item}".`);
        continue;
      }

      const shipped = exportOfItem.get(variant.item);
      if (shipped === undefined) {
        problems.push(`${where}: item "${variant.item}" ships no \`export function\`.`);
      } else if (shipped !== variant.exportName) {
        problems.push(
          `${where}: meta.exportName "${variant.exportName}" ≠ shipped export "${shipped}" ` +
            `in item "${variant.item}".`,
        );
      }

      // The variant's meta.exportName must be owned by NO item other than its
      // own backing `variant.item`. exportOwner is pre-seeded with every shipped
      // block export (bare + variant), so this now also catches a variant that
      // collides with a zero-variant bare block's export (the 35 bare blocks that
      // never appear as a variant entry), not just variant-vs-variant.
      const prior = exportOwner.get(variant.exportName);
      if (prior !== undefined && prior !== variant.item) {
        problems.push(
          `${where}: exportName "${variant.exportName}" is also used by "${prior}" — ` +
            `variant exports must be unique across the registry.`,
        );
      } else {
        exportOwner.set(variant.exportName, variant.item);
      }
    }
  }

  return problems;
}

// ─── F3: anti-inline-mock gate ───────────────────────────────────────────────

/**
 * The block items whose inline demo data was LIFTED into the `registry:lib`
 * datasets (`demo-store` / `demo-saas`). After the F3 migration each of these
 * blocks must READ its data from the lib import — never re-declare a distinctive
 * lib data value inline — so the storefront/dashboard narrative has a single
 * source of truth. Keep this set EXACTLY equal to the blocks that are 100% free
 * of inline lib-data; a block that has not been migrated (e.g. the un-migrated
 * `order-history--cards` / `reviews--compact` variants, or a block that still
 * carries block-local person/mock data never lifted into a lib) legitimately
 * keeps its inline data and must NOT appear here.
 *
 * `dashboard` analytics chrome and `dashboard--admin-overview` (table + footer)
 * read identity from `USER` + `TEAM`. `analytics` (admin overview) maps `KPIS`
 * by index; `analytics--engagement` stays un-migrated (cohorts, not the saas
 * KPI grid). Stats compact/pipeline variants stay un-migrated (they are not
 * the saas default KPI grid). `product-detail` (and gallery/minimal) read the
 * Aurora SKU via `productById`; `checkout` (classic) reads the playbook line.
 * `checkout--one-page` / `checkout--multi-step` stay un-migrated (other catalog).
 * `product-grid--showcase` maps the digital SKUs + playbook hero; `invoice` maps
 * the playbook line via `ORDERS[1]` (seats/support stay local). `order-tracking`
 * / `--delivered` read `ORDERS[0]` / `ORDERS[1]`; `--delayed` and `invoice--receipt`
 * stay un-migrated.
 */
export const MIGRATED_BLOCKS = [
  "cart",
  "cart--drawer",
  "order-history",
  "reviews",
  "product-grid",
  "product-grid--with-filters",
  "billing",
  "billing--plans",
  "usage-dashboard",
  "app-shell-chrome",
  "dashboard",
  "settings",
  "stats",
  "team",
  "dashboard--admin-overview",
  "analytics",
  "product-detail",
  "product-detail--gallery",
  "product-detail--minimal",
  "checkout",
  "product-grid--showcase",
  "invoice",
  "order-tracking",
  "order-tracking--delivered",
  "signup",
  "signup--split-proof",
  "signup--with-plan",
] as const;

/** Which `registry:lib` a migrated block reads its demo data from. */
type MockLib = "demo-store" | "demo-saas";

/**
 * Values that are lib string LITERALS but are NOT distinctive mock DATA, so a
 * migrated block may legitimately restate them without re-inlining a data record:
 *   - the BRAND wordmarks: the demo store/app NAME. It is a brand token handled by
 *     the separate brandTokens literal-replacement path on chrome, not lifted mock
 *     data (a storefront block may print the store name in copy — e.g. "ships from
 *     Aurora Audio" — as intended demo cohesion).
 * Kept tiny and explicit; everything else distinctive is derived from source.
 */
const NON_DATA_LIB_VALUES: ReadonlySet<string> = new Set(["Aurora Audio", "Northwind"]);

/**
 * The union-type MEMBER literals declared in a lib module — the values of a
 * `type X = "a" | "b"` alias or an inline `field: "a" | "b"` union. These are
 * STRUCTURAL enums (order/activity status, role, trend), not data records, and a
 * migrated block legitimately restates them (it declares its own `type OrderStatus
 * = "Delivered" | "In transit" | ...` and renders status badges). Excluding them
 * keeps the gate from false-positiving on a block's own status/role type.
 */
function unionMemberLiterals(libSource: string): Set<string> {
  const members = new Set<string>();
  // Matches a `=`/`:`-introduced union of ≥2 double-quoted literals: `"a" | "b"`.
  for (const m of libSource.matchAll(/[=:]\s*((?:"[^"\n]+"\s*\|\s*)+"[^"\n]+")/g)) {
    for (const lit of m[1].matchAll(/"([^"\n]+)"/g)) members.add(lit[1]);
  }
  return members;
}

/**
 * True when a lib string VALUE is DISTINCTIVE mock data — a value that can only
 * originate from a re-inlined data record, so its presence inside a migrated block
 * is a true-positive inline mock. Complete-by-construction from the lib source
 * (self-updating when the lib changes), and deliberately CONSERVATIVE to avoid
 * false positives on a legitimately-migrated block:
 *   - EMAIL: `foo@bar.tld` (customer/team emails).
 *   - STRUCTURED ID: `#CD-58291`, `INV-2048`, `INV-2026-006`, `PO-…` — an
 *     uppercase prefix + dash + alphanumerics (order/invoice/activity ids).
 *   - MULTI-WORD PROPER VALUE: a spaced, ≥8-char string that starts with a letter,
 *     has an uppercase letter, and contains no code/CSS punctuation — i.e. a
 *     person/product name, kind caption, review title/body, plan tagline/feature,
 *     KPI label, or date. Prose data, never a className or a code token.
 * EXCLUDED (too coincidence-prone / not a data record): bare prices like "$290"
 * (a block may show a computed/static total that happens to equal a lib figure),
 * bare single common words like plan/status names ("Team"/"Owner" — a block may
 * label the current plan), the brand wordmark, and any union-member enum literal.
 */
function isDistinctiveMockValue(value: string, unionMembers: ReadonlySet<string>): boolean {
  if (NON_DATA_LIB_VALUES.has(value)) return false;
  if (unionMembers.has(value)) return false;
  // Email.
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return true;
  // Structured id (#CD-…, INV-…, PO-…): uppercase prefix + dash + alphanumerics.
  if (/^#?[A-Z][A-Z0-9]*-[A-Za-z0-9-]+$/.test(value)) return true;
  // Multi-word proper value (prose/name/title/caption/date): spaced, has an
  // uppercase letter, starts with a letter, and free of code/CSS punctuation
  // (which would mark it a className or a source token, not a data value).
  if (
    value.length >= 8 &&
    /\s/.test(value) &&
    /^[A-Za-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    !/[/:;{}=<>#[\]$]/.test(value)
  ) {
    return true;
  }
  return false;
}

/**
 * Derive, PROGRAMMATICALLY from a demo lib's own source, the set of distinctive
 * data values that must live ONLY in that lib and never be re-inlined into a
 * migrated block. Collects every double-quoted string literal in the module and
 * keeps the ones {@link isDistinctiveMockValue} deems true mock data (excluding
 * union-member enums + the brand wordmark). Complete-by-construction: when the
 * lib gains a new product/reviewer/plan the forbidden set updates itself, so the
 * gate can never silently drift behind the lib (the sentinel-list bug this fixes).
 */
export function distinctiveLibValues(libSource: string): Set<string> {
  const unionMembers = unionMemberLiterals(libSource);
  const out = new Set<string>();
  // Every double-quoted literal in the lib (data modules use double quotes; the
  // Biome style + the lib source guarantee it). Escaped-quote-free values only —
  // the lib carries none, and a stray escaped literal is not a re-inline risk.
  for (const m of libSource.matchAll(/"([^"\\\n]+)"/g)) {
    const value = m[1];
    if (isDistinctiveMockValue(value, unionMembers)) out.add(value);
  }
  return out;
}

/**
 * The anti-inline-mock gate (a migrated-family block cannot contain inline mocks).
 * For EXACTLY the {@link MIGRATED_BLOCKS} items, fail loud if the block's shipped
 * source still carries a distinctive data VALUE that now belongs only to its
 * `registry:lib` — a re-inlined mock that should come via the import instead.
 *
 * The forbidden value set is DERIVED from the demo lib sources at check time
 * ({@link distinctiveLibValues}), not a hand-maintained sentinel list, so it is
 * complete-by-construction and self-updating when the lib changes — closing the
 * false-negative where a lifted value that was never a sentinel slipped back in.
 *
 * `sourceOf` maps an item name to its SHIPPED source (the exact bytes `add`
 * writes) — the caller merges `readBlockSources()` + `readVariantSources()`.
 * `libSourceByName` maps each demo lib name to its SOURCE (from
 * `readDemoLibSources()`). A migrated block's domain is inferred from which lib it
 * imports (`../lib/demo-store.js` vs `../lib/demo-saas.js`); a migrated block that
 * imports NEITHER is itself a failure (its data can no longer come from the lib).
 *
 * CRITICAL: only the migrated BLOCK files are scanned. The demo libs are the
 * SOURCE of every value and are never scanned against themselves — they are read
 * solely to derive the forbidden set.
 *
 * Returns a flat list of `"<item>: <problem>"` strings (empty when clean).
 */
export function validateNoInlineMocks(
  sourceOf: Map<string, string>,
  libSourceByName: Map<string, string>,
): string[] {
  const problems: string[] = [];
  // Derive the distinctive-value set for each demo lib once, from its source.
  const forbiddenByLib = new Map<MockLib, Set<string>>();
  for (const lib of ["demo-store", "demo-saas"] as const) {
    const src = libSourceByName.get(lib);
    if (src === undefined) {
      problems.push(`lib "${lib}": missing source — cannot derive the forbidden mock-value set.`);
      continue;
    }
    forbiddenByLib.set(lib, distinctiveLibValues(src));
  }

  for (const item of MIGRATED_BLOCKS) {
    const source = sourceOf.get(item);
    if (source === undefined) {
      // A migrated item with no shipped source is a drift bug (renamed/removed
      // block, or the migrated-set fell out of sync with the registry).
      problems.push(`${item}: migrated block has no shipped source (registry drift?).`);
      continue;
    }

    const importsStore = /from\s+["']\.\.\/lib\/demo-store\.js["']/.test(source);
    const importsSaas = /from\s+["']\.\.\/lib\/demo-saas\.js["']/.test(source);
    const lib: MockLib | undefined = importsStore
      ? "demo-store"
      : importsSaas
        ? "demo-saas"
        : undefined;

    if (lib === undefined) {
      problems.push(
        `${item}: migrated block imports neither "../lib/demo-store.js" nor ` +
          `"../lib/demo-saas.js" — its data can no longer come from the lib.`,
      );
      continue;
    }

    const forbidden = forbiddenByLib.get(lib);
    if (forbidden === undefined) continue; // lib source missing — already reported above.

    for (const value of forbidden) {
      if (source.includes(value)) {
        problems.push(
          `${item}: contains inline mock value "${value}" that must now come from ` +
            `the "${lib}" lib (re-inlined data — import it instead).`,
        );
      }
    }
  }

  return problems;
}

async function main() {
  // Build + validate from source, then materialize into a tmp dir (literal regen).
  // `buildMeta` runs the compose gates (unique exportName + data-slot/brand-token
  // markers present); a violation throws a clear Error caught by `main().catch`.
  const items = await buildItems();
  const blockSources = await readBlockSources();
  const variantSources = await readVariantSources();
  let meta: Awaited<ReturnType<typeof buildMeta>>;
  try {
    meta = await buildMeta(blockSources, variantSources);
  } catch (err) {
    console.error("registry:check FAILED — metadata invariant violated:");
    console.error(`  - ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  // Every meta-declared variant must have a published item with a matching,
  // globally-unique export (default → bare slug, non-default → <slug>--<id>).
  const variantProblems = validateVariantItems(items, meta);
  if (variantProblems.length > 0) {
    console.error("registry:check FAILED — block variant items are out of sync with meta:");
    for (const p of variantProblems) console.error(`  - ${p}`);
    process.exit(1);
  }

  // Every MIGRATED block must read its demo data from the lib, never re-inline it
  // (F3). Scans ONLY the migrated block sources (bare + variant items); the demo
  // libs are read solely to DERIVE the forbidden distinctive-value set from source
  // (complete-by-construction), never scanned against themselves.
  const libSources = await readDemoLibSources();
  const inlineMockProblems = validateNoInlineMocks(
    new Map([...blockSources, ...variantSources]),
    libSources,
  );
  if (inlineMockProblems.length > 0) {
    console.error("registry:check FAILED — a migrated block still contains inline demo data:");
    for (const p of inlineMockProblems) console.error(`  - ${p}`);
    console.error(
      "\nThose values now live in packages/ui/src/lib/{demo-store,demo-saas}.ts — " +
        "import them instead of re-declaring them in the block.",
    );
    process.exit(1);
  }

  // Every bundled app-template must reference only blocks that exist in the
  // registry it ships with — fail loud on a typo'd/dropped ref rather than
  // deferring the break to the end user's `compose <template>` call.
  const manifests = await loadAppManifests();
  const refProblems = validateAppTemplateRefs(manifests, items, meta, blockSources);
  if (refProblems.length > 0) {
    console.error("registry:check FAILED — app template references a block not in the registry:");
    for (const p of refProblems) console.error(`  - ${p}`);
    process.exit(1);
  }

  const expected = serializeRegistry(items, meta);

  const tmp = await mkdtemp(join(tmpdir(), "cronus-registry-check-"));
  const diffs: string[] = [];
  try {
    await writeRegistry(tmp, items, meta);

    // 1. Every expected file must match the committed copy byte-for-byte.
    for (const [file, content] of Object.entries(expected)) {
      const committed = await readIfExists(join(outDir, file));
      if (committed === null) {
        diffs.push(`missing in registry/: ${file}`);
      } else if (committed !== content) {
        diffs.push(`drifted: ${file}`);
      }
    }

    // 2. No stale files left in registry/ that the generator no longer produces.
    let committedFiles: string[] = [];
    try {
      committedFiles = (await readdir(outDir)).filter((f) => f.endsWith(".json"));
    } catch {
      committedFiles = [];
    }
    for (const file of committedFiles) {
      if (!(file in expected)) diffs.push(`stale (not generated): ${file}`);
    }
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }

  if (diffs.length > 0) {
    console.error("registry:check FAILED — registry/ is out of sync with packages/ui:");
    for (const d of diffs) console.error(`  - ${d}`);
    console.error("\nRun `bun run -F cronus-ui registry` and commit the result.");
    process.exit(1);
  }

  console.log(`registry:check OK — ${Object.keys(expected).length} files in sync.`);
}

// Only run when invoked directly (not when imported by a test that exercises
// `validateAppTemplateRefs`), so the import has no side effects / process.exit.
if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
