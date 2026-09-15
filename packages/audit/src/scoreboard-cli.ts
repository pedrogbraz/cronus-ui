/**
 * Writes `apps/www/lib/audit/scoreboard.json` from the latest audit run.
 *
 *   bun run audit:scoreboard -- --date 2026-09-15
 *
 * Inputs (all optional except the date; a missing report means "not run"):
 *   test-results/audit-geometry/*.json   geometry.spec.ts per-fixture reports
 *   test-results/audit-pixel/*.json      parity.pixel.spec.ts per-fixture reports
 *   test-results/audit-report.json       Playwright JSON (pass/fail + logic.spec.ts)
 *   e2e/audit/logic.spec.ts              logic test title -> family
 *   cronus-kernel.ref                    pinned kernel commit
 *   $CRONUS_KERNEL_DIR/src/cronus_ui_widgets.rs  (default ../cronus-kernel)
 *
 * Flags: --date YYYY-MM-DD (required), --results <dir>, --out <file>.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { listFixtures } from "./fixture-catalog.js";
import { parseKernelFamilies } from "./kernel-families.js";
import {
  buildScoreboard,
  collectReportTests,
  type GeometryRecord,
  GeometryRecordSchema,
  logicTitleFamilies,
  type PixelRecord,
  PixelRecordSchema,
  serializeScoreboard,
} from "./scoreboard.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function readRecords<T>(
  dir: string,
  schema: { safeParse: (v: unknown) => { success: true; data: T } | { success: false } },
): T[] {
  if (!existsSync(dir)) return [];
  const out: T[] = [];
  for (const name of readdirSync(dir).sort()) {
    if (!name.endsWith(".json")) continue;
    const parsed = schema.safeParse(JSON.parse(readFileSync(join(dir, name), "utf8")));
    if (parsed.success) out.push(parsed.data);
    else console.warn(`scoreboard: skipping malformed report ${join(dir, name)}`);
  }
  return out;
}

const date = flag("--date");
if (!date) {
  console.error("usage: bun src/scoreboard-cli.ts --date YYYY-MM-DD [--results dir] [--out file]");
  process.exit(2);
}
const results = resolve(flag("--results") ?? join(root, "test-results"));
const out = resolve(flag("--out") ?? join(root, "apps/www/lib/audit/scoreboard.json"));
const kernelDir = resolve(
  process.env.CRONUS_KERNEL_DIR ?? process.env.CRONUS_KERNEL_ROOT ?? join(root, "../cronus-kernel"),
);

const widgets = join(kernelDir, "src/cronus_ui_widgets.rs");
const kernelFamilies = existsSync(widgets)
  ? parseKernelFamilies(readFileSync(widgets, "utf8"))
  : null;
if (!kernelFamilies) console.warn(`scoreboard: kernel registry not readable at ${widgets}`);

const refFile = join(root, "cronus-kernel.ref");
const kernelRef = existsSync(refFile) ? readFileSync(refFile, "utf8").trim() || null : null;

const { CATEGORIES } = (await import(join(root, "apps/www/lib/components-index.ts"))) as {
  CATEGORIES: { items: { slug: string }[] }[];
};
const componentSlugs = CATEGORIES.flatMap((c) => c.items.map((i) => i.slug));

const reportFile = join(results, "audit-report.json");
const reportTests = existsSync(reportFile)
  ? collectReportTests(JSON.parse(readFileSync(reportFile, "utf8")))
  : null;
const logicSpec = join(root, "e2e/audit/logic.spec.ts");

const board = buildScoreboard({
  generatedAt: date,
  kernelRef,
  componentSlugs,
  kernelFamilies,
  fixtures: listFixtures().map((f) => ({ family: f.family, id: f.id })),
  geometry: readRecords<GeometryRecord>(join(results, "audit-geometry"), GeometryRecordSchema),
  pixel: readRecords<PixelRecord>(join(results, "audit-pixel"), PixelRecordSchema),
  reportTests,
  logicFamilies: existsSync(logicSpec) ? logicTitleFamilies(readFileSync(logicSpec, "utf8")) : {},
});

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, serializeScoreboard(board));
const t = board.totals;
console.log(
  `wrote ${out}: ${t.families} families (${t.ported} ported, ${t.stub} stub, ${t.reactOnly} React-only), ` +
    `${t.fixtures} fixtures; parity match ${t.parity.match} / diff ${t.parity.diff} / not run ${t.parity.notRun}`,
);
