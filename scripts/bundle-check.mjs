#!/usr/bin/env node

// @ts-check
/**
 * bundle-check.mjs — JS size budget gate for the Cronus UI build output.
 *
 * Two gates run from one invocation:
 *
 *  1. @cronus-ui/www first-load JS — reads the Next.js build diagnostics emitted by
 *     `next build` (apps/www/.next/diagnostics/route-bundle-stats.json) and
 *     fails if the first-load JS of any tracked key route exceeds its budget.
 *
 *  2. @cronus-ui/ui published-package entries — gzip-compresses each tracked entry
 *     in the built `packages/ui/dist` (the barrel `index.js` plus a set of
 *     heavy subpath entries) and fails if any exceeds its per-entry GZIPPED
 *     budget. This is what adopters actually download, so a transitive-dep or
 *     code-bloat regression in the library surfaces here even when the www
 *     route budgets still pass.
 *
 * Run AFTER building, e.g.:
 *   bun run build            # turbo build, produces apps/www/.next + ui/dist
 *   node scripts/bundle-check.mjs
 *
 * The script does NOT build on its own (build is owned by turbo); it only
 * inspects the already-produced output so it can run standalone in CI right
 * after the build step.
 *
 * Tuning knobs (env):
 *   BUNDLE_BUDGET_SLACK   multiplier applied to EVERY budget (www + package),
 *                         default "1". e.g. "1.1" gives a temporary +10%.
 *   BUNDLE_STATS_FILE     override path to route-bundle-stats.json.
 *   BUNDLE_UI_DIST_DIR    override path to the built packages/ui/dist dir.
 *   BUNDLE_CHECK_STRICT   "1" => fail if a tracked route OR a tracked package
 *                         entry is missing from the build output (default:
 *                         warn only, so partial builds don't break).
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const DEFAULT_STATS_FILE = resolve(repoRoot, "apps/www/.next/diagnostics/route-bundle-stats.json");
const statsFile = process.env.BUNDLE_STATS_FILE
  ? resolve(process.env.BUNDLE_STATS_FILE)
  : DEFAULT_STATS_FILE;

const DEFAULT_UI_DIST_DIR = resolve(repoRoot, "packages/ui/dist");
const uiDistDir = process.env.BUNDLE_UI_DIST_DIR
  ? resolve(process.env.BUNDLE_UI_DIST_DIR)
  : DEFAULT_UI_DIST_DIR;

const slackRaw = process.env.BUNDLE_BUDGET_SLACK;
const slack = slackRaw ? Number.parseFloat(slackRaw) : 1;
if (!Number.isFinite(slack) || slack <= 0) {
  console.error(`bundle-check: invalid BUNDLE_BUDGET_SLACK=${slackRaw}`);
  process.exit(2);
}

const strict = process.env.BUNDLE_CHECK_STRICT === "1";

/**
 * Budgets in bytes, keyed by Next route id.
 *
 * Baseline measured 2026-06-22 (Next 16.2.6, Turbopack) after the apps/www
 * split work, then rebased 2026-08-26 for the editorial landing (hero products,
 * CLI island, looks, live theming). Budgets sit roughly 10-15% above current
 * first-load sizes so the gate has useful sensitivity while leaving room for
 * normal compiler drift. Run strict (BUNDLE_CHECK_STRICT=1) in CI so a missing
 * route also fails.
 */
const ROUTE_BUDGETS = /** @type {Record<string, RouteBudget>} */ ({
  "/": { firstLoadUncompressedJsBytes: 1_070_000, firstLoadGzipJsBytes: 325_000 },
  "/stack": { firstLoadUncompressedJsBytes: 970_000, firstLoadGzipJsBytes: 300_000 },
  "/docs": { firstLoadUncompressedJsBytes: 680_000, firstLoadGzipJsBytes: 205_000 },
  "/docs/installation": {
    firstLoadUncompressedJsBytes: 790_000,
    firstLoadGzipJsBytes: 240_000,
  },
  "/docs/cli": { firstLoadUncompressedJsBytes: 790_000, firstLoadGzipJsBytes: 240_000 },
  "/docs/theming": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/frameworks": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/accessibility": {
    firstLoadUncompressedJsBytes: 775_000,
    firstLoadGzipJsBytes: 235_000,
  },
  "/docs/forms": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/registry": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/rtl": { firstLoadUncompressedJsBytes: 775_000, firstLoadGzipJsBytes: 235_000 },
  "/docs/stack-builder": {
    firstLoadUncompressedJsBytes: 775_000,
    firstLoadGzipJsBytes: 235_000,
  },
  "/components/[slug]": {
    firstLoadUncompressedJsBytes: 920_000,
    firstLoadGzipJsBytes: 270_000,
  },
  "/components": { firstLoadUncompressedJsBytes: 680_000, firstLoadGzipJsBytes: 205_000 },
  // Headroom covers the /create icon-library preview (5 tree-shaken icon sets,
  // ~20 glyphs each — verified named imports) plus the preview's `motion/react`
  // spring hover-lift. motion is the only animation dep on this route, so it
  // ships via the slim `LazyMotion` + `m` path with its feature bundle
  // code-split (loaded async after hydration); only the `m` runtime lands in
  // first-load JS (~13 KiB gz). Bumped from 275/935 KiB to keep ~6% headroom.
  "/create": { firstLoadUncompressedJsBytes: 1_040_000, firstLoadGzipJsBytes: 305_000 },
  "/blocks": { firstLoadUncompressedJsBytes: 680_000, firstLoadGzipJsBytes: 205_000 },
  "/blocks/[slug]": { firstLoadUncompressedJsBytes: 690_000, firstLoadGzipJsBytes: 205_000 },
  "/blocks/[slug]/[variant]": {
    firstLoadUncompressedJsBytes: 700_000,
    firstLoadGzipJsBytes: 205_000,
  },
});

/**
 * Budgets for chunks shared by the tracked route set. `common*` covers chunks
 * used by every tracked route; `shared*` covers unique chunks used by two or
 * more tracked routes.
 */
const SHARED_CHUNK_BUDGETS = /** @type {SharedChunkBudgets} */ ({
  commonUncompressedJsBytes: 640_000,
  commonGzipJsBytes: 190_000,
  sharedUncompressedJsBytes: 950_000,
  sharedGzipJsBytes: 290_000,
});

/**
 * Per-entry GZIPPED size budgets (bytes) for the BUILT @cronus-ui/ui package, keyed
 * by the file's path relative to packages/ui/dist. We track the barrel
 * (`index.js`) plus the heaviest subpath entries — the ones most likely to grow
 * unnoticed.
 *
 * Note: these are the package's own transpiled module files (tsc output, not a
 * bundle), so each number is the module's emitted code, not its full dependency
 * closure. That's still the right regression signal: a module that doubles in
 * size, or sprouts a heavy new import surface, trips its budget here.
 *
 * Baseline measured 2026-06-23 from `packages/ui/dist` (tsc build). Budgets are
 * set ~25-30% above the current gzipped size so today passes with headroom but
 * a real bloat regression fails. Re-measure and bump deliberately if an entry
 * legitimately grows.
 *
 *   entry                     current gz   budget gz
 *   index.js (barrel)              2,870      3,600   (re-measured 2026-07-08 after the batch-8 exports)
 *   data-table.js                  7,359      9,400
 *   chart.js                       4,200      4,500
 *   calendar.js                    1,540      1,950   (re-measured 2026-07-10: the rdp v10 DayButton wrapper + classNames map)
 *   command.js                     1,294      1,660
 *   carousel.js                    5,021      6,450
 *   sidebar.js                     4,992      6,400
 *   autocomplete.js                4,719      6,050
 *   morphing-popover.js            3,839      4,920
 *   segmented-control.js           3,725      4,780
 *   text-effect.js                 3,739      4,800
 *   kanban.js                      3,043      3,900
 *   rich-text-editor.js            2,646      3,400
 *   password-input.js              1,325      1,700
 *   masonry.js                       787      1,000
 *   input-group.js                   647        850
 *   button-group.js                  539        700
 *   dock.js                        1,774      2,280
 *   comparison-slider.js           1,473      1,890
 *   fab.js                         1,466      1,880
 *   frame.js                         574        740
 *   heatmap.js                     1,187      1,520
 *   scroll-progress.js             1,639      2,100
 *   lightbox.js                    1,695      2,170
 *   toolbar.js                     1,602      2,050
 */
const PACKAGE_ENTRY_GZIP_BUDGETS = /** @type {Record<string, number>} */ ({
  "index.js": 3_600,
  "components/data-table.js": 9_400,
  "components/chart.js": 4_500,
  "components/calendar.js": 1_950,
  "components/command.js": 1_660,
  "components/carousel.js": 6_450,
  "components/sidebar.js": 6_400,
  "components/autocomplete.js": 6_050,
  "components/morphing-popover.js": 4_920,
  "components/segmented-control.js": 4_780,
  "components/text-effect.js": 4_800,
  "components/kanban.js": 3_900,
  "components/rich-text-editor.js": 3_400,
  "components/password-input.js": 1_700,
  "components/masonry.js": 1_000,
  "components/input-group.js": 850,
  "components/button-group.js": 700,
  "components/dock.js": 2_280,
  "components/comparison-slider.js": 1_890,
  "components/fab.js": 1_880,
  "components/frame.js": 740,
  "components/heatmap.js": 1_520,
  "components/scroll-progress.js": 2_100,
  "components/lightbox.js": 2_170,
  "components/toolbar.js": 2_050,
});

/**
 * @typedef {{
 *   firstLoadUncompressedJsBytes: number,
 *   firstLoadGzipJsBytes: number,
 * }} RouteBudget
 *
 * @typedef {{
 *   commonUncompressedJsBytes: number,
 *   commonGzipJsBytes: number,
 *   sharedUncompressedJsBytes: number,
 *   sharedGzipJsBytes: number,
 * }} SharedChunkBudgets
 *
 * @typedef {{
 *   route: string,
 *   firstLoadUncompressedJsBytes: number,
 *   firstLoadChunkPaths?: string[],
 * }} RouteStat
 *
 * @typedef {{
 *   firstLoadUncompressedJsBytes: number,
 *   firstLoadGzipJsBytes: number,
 * }} RouteMeasurements
 */

/** @returns {RouteStat[]} */
function readStats() {
  let raw;
  try {
    raw = readFileSync(statsFile, "utf8");
  } catch (err) {
    console.error(
      `bundle-check: could not read ${statsFile}\n` +
        "  Did you run the www build first? (bun run build)\n" +
        `  ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(2);
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("expected a JSON array");
    return parsed;
  } catch (err) {
    console.error(
      `bundle-check: ${statsFile} is not valid route-bundle-stats JSON\n` +
        `  ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(2);
  }
}

function fmtKiB(bytes) {
  return `${(bytes / 1024).toFixed(0)} KiB`;
}

/** @param {number} bytes */
function withSlack(bytes) {
  return Math.round(bytes * slack);
}

/** @param {string} chunkPath */
function readChunk(chunkPath) {
  try {
    return readFileSync(resolve(repoRoot, "apps/www", chunkPath));
  } catch (err) {
    console.error(
      `bundle-check: could not read first-load chunk ${chunkPath}\n` +
        `  ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(2);
  }
}

/**
 * @param {RouteStat} stat
 * @returns {RouteMeasurements}
 */
function measureRoute(stat) {
  let gzipBytes = 0;
  for (const chunkPath of stat.firstLoadChunkPaths ?? []) {
    gzipBytes += gzipSync(readChunk(chunkPath)).byteLength;
  }

  return {
    firstLoadUncompressedJsBytes: Number(stat.firstLoadUncompressedJsBytes) || 0,
    firstLoadGzipJsBytes: gzipBytes,
  };
}

/**
 * @param {Map<string, RouteStat>} byRoute
 */
function measureSharedChunks(byRoute) {
  /** @type {Map<string, number>} */
  const usage = new Map();
  let trackedRoutesFound = 0;

  for (const route of Object.keys(ROUTE_BUDGETS)) {
    const stat = byRoute.get(route);
    if (!stat) continue;
    trackedRoutesFound += 1;
    for (const chunkPath of stat.firstLoadChunkPaths ?? []) {
      usage.set(chunkPath, (usage.get(chunkPath) ?? 0) + 1);
    }
  }

  const totals = {
    commonUncompressedJsBytes: 0,
    commonGzipJsBytes: 0,
    sharedUncompressedJsBytes: 0,
    sharedGzipJsBytes: 0,
  };

  for (const [chunkPath, count] of usage) {
    if (count < 2) continue;
    const chunk = readChunk(chunkPath);
    const gzipBytes = gzipSync(chunk).byteLength;

    totals.sharedUncompressedJsBytes += chunk.byteLength;
    totals.sharedGzipJsBytes += gzipBytes;

    if (trackedRoutesFound > 0 && count === trackedRoutesFound) {
      totals.commonUncompressedJsBytes += chunk.byteLength;
      totals.commonGzipJsBytes += gzipBytes;
    }
  }

  return totals;
}

/**
 * @param {string} label
 * @param {number} actual
 * @param {number} budget
 * @returns {{ ok: boolean, message: string }}
 */
function compareBudget(label, actual, budget) {
  if (actual > budget) {
    return {
      ok: false,
      message: `  ✗ ${label}  ${fmtKiB(actual)} > budget ${fmtKiB(budget)}  (+${fmtKiB(
        actual - budget,
      )})`,
    };
  }

  return {
    ok: true,
    message: `  ✓ ${label}  ${fmtKiB(actual)} <= ${fmtKiB(budget)}  (${fmtKiB(
      budget - actual,
    )} headroom)`,
  };
}

/** A KiB string that keeps one decimal — package entries are small (~1-10 KiB). */
function fmtKiB1(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

/**
 * Compare against a small gzipped budget. Uses one-decimal KiB so a few-hundred
 * -byte regression on a ~2 KiB entry is legible in the output.
 *
 * @param {string} label
 * @param {number} actual
 * @param {number} budget
 * @returns {{ ok: boolean, message: string }}
 */
function compareGzipBudget(label, actual, budget) {
  if (actual > budget) {
    return {
      ok: false,
      message: `  ✗ ${label}  gz ${fmtKiB1(actual)} > budget ${fmtKiB1(budget)}  (+${fmtKiB1(
        actual - budget,
      )})`,
    };
  }
  return {
    ok: true,
    message: `  ✓ ${label}  gz ${fmtKiB1(actual)} <= ${fmtKiB1(budget)}  (${fmtKiB1(
      budget - actual,
    )} headroom)`,
  };
}

/**
 * Measure the BUILT @cronus-ui/ui package entries against their gzipped budgets.
 *
 * @returns {{ ok: string[], failures: string[], missing: string[] }}
 */
function measurePackageEntries() {
  /** @type {string[]} */
  const ok = [];
  /** @type {string[]} */
  const failures = [];
  /** @type {string[]} */
  const missing = [];

  for (const [entry, budget] of Object.entries(PACKAGE_ENTRY_GZIP_BUDGETS)) {
    const filePath = resolve(uiDistDir, entry);
    let bytes;
    try {
      bytes = readFileSync(filePath);
    } catch {
      missing.push(entry);
      continue;
    }
    const gzipBytes = gzipSync(bytes).byteLength;
    const result = compareGzipBudget(`@cronus-ui/ui ${entry}`, gzipBytes, withSlack(budget));
    (result.ok ? ok : failures).push(result.message);
  }

  return { ok, failures, missing };
}

function main() {
  const stats = readStats();
  /** @type {Map<string, RouteStat>} */
  const byRoute = new Map();
  for (const s of stats) {
    if (s && typeof s.route === "string") {
      byRoute.set(s.route, s);
    }
  }

  /** @type {string[]} */
  const failures = [];
  /** @type {string[]} */
  const missing = [];
  /** @type {string[]} */
  const ok = [];

  for (const [route, routeBudget] of Object.entries(ROUTE_BUDGETS)) {
    const stat = byRoute.get(route);
    if (stat === undefined) {
      missing.push(route);
      continue;
    }

    const measurements = measureRoute(stat);
    for (const [metric, actual] of Object.entries(measurements)) {
      const result = compareBudget(
        `${route} ${metric}`,
        actual,
        withSlack(routeBudget[/** @type {keyof RouteBudget} */ (metric)]),
      );
      (result.ok ? ok : failures).push(result.message);
    }
  }

  const sharedMeasurements = measureSharedChunks(byRoute);
  for (const [metric, actual] of Object.entries(sharedMeasurements)) {
    const result = compareBudget(
      `shared chunks ${metric}`,
      actual,
      withSlack(SHARED_CHUNK_BUDGETS[/** @type {keyof SharedChunkBudgets} */ (metric)]),
    );
    (result.ok ? ok : failures).push(result.message);
  }

  console.log(`bundle-check: first-load JS budgets${slack !== 1 ? ` (slack x${slack})` : ""}`);
  console.log(`  stats: ${statsFile}`);
  for (const line of ok) console.log(line);

  if (missing.length > 0) {
    const msg = `  ? not found in build stats: ${missing.join(", ")}`;
    if (strict) {
      failures.push(msg);
    } else {
      console.warn(`${msg} (non-strict: ignored)`);
    }
  }

  // ── @cronus-ui/ui published-package entry budgets (gzipped) ──────────────
  const pkg = measurePackageEntries();
  console.log(`\nbundle-check: @cronus-ui/ui package entry budgets (gzipped)`);
  console.log(`  dist: ${uiDistDir}`);
  for (const line of pkg.ok) console.log(line);
  for (const line of pkg.failures) failures.push(line);

  if (pkg.missing.length > 0) {
    const msg = `  ? not found in packages/ui/dist: ${pkg.missing.join(", ")}`;
    if (strict) {
      failures.push(msg);
    } else {
      console.warn(`${msg} (non-strict: ignored — did you build @cronus-ui/ui?)`);
    }
  }

  if (failures.length > 0) {
    console.error("\nbundle-check: FAILED — JS over budget:");
    for (const line of failures) console.error(line);
    console.error(
      "\nEither trim the route/package output or, if intentional, raise the" +
        " budget in scripts/bundle-check.mjs.",
    );
    process.exit(1);
  }

  console.log("\nbundle-check: OK — all tracked routes and @cronus-ui/ui entries within budget.");
}

main();
