/**
 * Coverage inventory. Reads www catalog slugs + kernel PORTED_FAMILIES.
 * Run with bun from the monorepo: `bun src/catalog-inventory.ts`
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

function portedFromKernel(kernelRoot: string | undefined): string[] {
  if (!kernelRoot) return [];
  const file = join(kernelRoot, "src/cronus_ui_widgets.rs");
  if (!existsSync(file)) return [];
  const src = readFileSync(file, "utf8");
  const m = src.match(/pub const PORTED_FAMILIES: &\[&str\] = &\[([\s\S]*?)\];/);
  if (!m?.[1]) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1] ?? "").filter(Boolean);
}

const root = monorepoRoot();
const componentSlugs = itemSlugsFromCategories(
  readFileSync(join(root, "apps/www/lib/components-index.ts"), "utf8"),
);
const blockSlugs = itemSlugsFromCategories(
  readFileSync(join(root, "apps/www/lib/blocks-index.ts"), "utf8"),
);
const templates = templateSlugs(join(root, "apps/www/lib/templates/catalog.ts"));
const kernelRoot = process.env.CRONUS_KERNEL_ROOT;
const ported = portedFromKernel(kernelRoot);

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

export { blockSlugs, componentSlugs, ported, templates };
