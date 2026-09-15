/**
 * Coverage inventory. Reads www catalog slugs + kernel PORTED_FAMILIES.
 * Run with bun from the monorepo: `bun src/catalog-inventory.ts [--strict]`
 *
 * Kernel checkout: `CRONUS_KERNEL_DIR` (or legacy `CRONUS_KERNEL_ROOT`),
 * defaulting to `../cronus-kernel` next to the monorepo.
 *
 * `--strict` exits 1 when a kernel-ported family has no fixture under
 * packages/audit/fixtures/<family>/*.json (or when PORTED_FAMILIES can't be read).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseKernelFamilies, portedFamilyNames } from "./kernel-families.js";

const here = dirname(fileURLToPath(import.meta.url));

function monorepoRoot(): string {
  let dir = here;
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, "packages/audit")) && existsSync(join(dir, "apps/www"))) {
      return dir;
    }
    dir = dirname(dir);
  }
  throw new Error("not inside the cronus-ui monorepo");
}

function itemSlugsFromCategories(src: string): string[] {
  const slugs: string[] = [];
  for (const block of src.matchAll(/items:\s*\[([\s\S]*?)\]\s*,?\s*\}/g)) {
    const body = block[1] ?? "";
    for (const m of body.matchAll(/slug:\s+"([^"]+)"/g)) {
      if (m[1]) slugs.push(m[1]);
    }
  }
  return slugs;
}

function templateSlugs(file: string): string[] {
  const src = readFileSync(file, "utf8");
  const slugs: string[] = [];
  for (const m of src.matchAll(/^\s+slug:\s+"([^"]+)"/gm)) {
    if (m[1]) slugs.push(m[1]);
  }
  return slugs;
}

function portedFromKernel(kernelRoot: string): string[] | null {
  const file = join(kernelRoot, "src/cronus_ui_widgets.rs");
  if (!existsSync(file)) return null;
  const families = parseKernelFamilies(readFileSync(file, "utf8"));
  return families ? portedFamilyNames(families) : null;
}

/** Families with at least one fixture JSON (same rule as fixture-catalog.ts). */
function fixtureFamilies(root: string): Set<string> {
  const dir = join(root, "packages/audit/fixtures");
  const out = new Set<string>();
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    if (readdirSync(join(dir, entry.name)).some((file) => file.endsWith(".json"))) {
      out.add(entry.name);
    }
  }
  return out;
}

const strict = process.argv.includes("--strict");
const root = monorepoRoot();
const componentSlugs = itemSlugsFromCategories(
  readFileSync(join(root, "apps/www/lib/components-index.ts"), "utf8"),
);
const blockSlugs = itemSlugsFromCategories(
  readFileSync(join(root, "apps/www/lib/blocks-index.ts"), "utf8"),
);
const templates = templateSlugs(join(root, "apps/www/lib/templates/catalog.ts"));
const kernelRoot = resolve(
  process.env.CRONUS_KERNEL_DIR ?? process.env.CRONUS_KERNEL_ROOT ?? join(root, "../cronus-kernel"),
);
const portedOrNull = portedFromKernel(kernelRoot);
const ported = portedOrNull ?? [];

const portedSet = new Set(ported);
const portedComponents = componentSlugs.filter((s) => portedSet.has(s));

console.log(
  `ported ${portedComponents.length} / ${componentSlugs.length} components, 0 / ${blockSlugs.length} blocks, 0 / ${templates.length} templates`,
);

const { CATEGORIES } = await import(join(root, "apps/www/lib/components-index.ts"));
if (Array.isArray(CATEGORIES)) {
  for (const cat of CATEGORIES as { slug: string; items: { slug: string }[] }[]) {
    const n = cat.items.filter((i) => portedSet.has(i.slug)).length;
    console.log(`  ${cat.slug}: ${n} / ${cat.items.length}`);
  }
}

if (strict) {
  if (portedOrNull === null) {
    console.error(
      `inventory --strict: cannot read PORTED_FAMILIES from ${join(kernelRoot, "src/cronus_ui_widgets.rs")} (set CRONUS_KERNEL_DIR)`,
    );
    process.exit(1);
  }
  const withFixtures = fixtureFamilies(root);
  const missing = ported.filter((family) => !withFixtures.has(family)).sort();
  if (missing.length > 0) {
    console.error(
      `inventory --strict: ${missing.length} kernel-ported famil${missing.length === 1 ? "y has" : "ies have"} no audit fixture:`,
    );
    for (const family of missing) console.error(`  - ${family}`);
    process.exit(1);
  }
  console.log(`inventory --strict: all ${ported.length} kernel-ported families have fixtures`);
}

export { blockSlugs, componentSlugs, ported, templates };
