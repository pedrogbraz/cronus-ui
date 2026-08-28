/**
 * Bridge between the committed Cronus registry (`registry/<name>.json` at the
 * repo root) and the shadcn registry spec, served under `/r/*`. This is what
 * lets the wider shadcn ecosystem (CLI, v0, MCP clients) install Cronus UI
 * straight from the showcase:
 *
 *   npx shadcn@latest add https://aicronus.com/r/button.json
 *
 * Mapping rules (schemas: https://ui.shadcn.com/schema/registry.json and
 * https://ui.shadcn.com/schema/registry-item.json):
 *
 * - Cronus item types are already shadcn-valid (`registry:ui|lib|block`) and
 *   pass through unchanged.
 * - `registryDependencies` become absolute `/r/<name>.json` URLs — a bare name
 *   like "button" would resolve against shadcn's own registry, not ours.
 * - ui/lib sources are rewritten from the canonical in-package specifiers
 *   ("../lib/cn.js", "./button.js") to the `@/registry/<style>/…` convention
 *   the shadcn CLI transforms into the consumer's components.json aliases
 *   (mirrors what packages/cli rewriteImports does against cronus-ui.json).
 * - Block sources import the `@cronus-ui/ui` npm package (declared in
 *   `dependencies`), so they need no rewriting; an explicit `target` mirrors
 *   the cronus-ui CLI's `components/blocks/` default.
 *
 * Everything here runs at BUILD time — the /r routes are force-static.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { getBlockMeta } from "./blocks-index";
import { getComponentDisplayName, getComponentMeta } from "./components-index";
import { absoluteUrl, SITE_URL } from "./site-url";

const REGISTRY_NAME = "cronus-ui";
const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json";
const REGISTRY_ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";

/**
 * Faux style segment for `@/registry/<style>/…` paths. The shadcn import
 * transformer only rewrites specifiers shaped `@/registry/<style>/{ui,lib,…}`,
 * so every served path and rewritten import carries this segment.
 */
const REGISTRY_STYLE = "cronus";

/* -------------------------------------------------------------------------- */
/*  Cronus registry (committed JSON) readers                                   */
/* -------------------------------------------------------------------------- */

type CronusItemType = "registry:ui" | "registry:lib" | "registry:block";

interface CronusRegistryFile {
  /** Path relative to the item kind, e.g. "button.tsx" or "cn.ts". */
  path: string;
  content: string;
  target: "ui" | "lib" | "block";
}

interface CronusRegistryItem {
  name: string;
  type: CronusItemType;
  dependencies: string[];
  registryDependencies: string[];
  files: CronusRegistryFile[];
}

type CronusRegistryIndexEntry = Omit<CronusRegistryItem, "files">;

/**
 * `next build` runs with cwd = apps/www under turbo, but tolerate a repo-root
 * invocation so the reader never silently misses the registry tree.
 */
function registryRoot(): string {
  const cwd = process.cwd();
  for (const candidate of [resolve(cwd, "../../registry"), join(cwd, "registry")]) {
    if (existsSync(join(candidate, "index.json"))) return candidate;
  }
  throw new Error(`shadcn-registry: could not locate registry/ from ${cwd}`);
}

let indexCache: CronusRegistryIndexEntry[] | undefined;

function readCronusIndex(): CronusRegistryIndexEntry[] {
  if (!indexCache) {
    indexCache = JSON.parse(
      readFileSync(join(registryRoot(), "index.json"), "utf8"),
    ) as CronusRegistryIndexEntry[];
  }
  return indexCache;
}

/** Registry names are plain slugs; this also keeps URL params inside registry/. */
const SLUG_RE = /^[a-z0-9-]+$/;

const itemCache = new Map<string, CronusRegistryItem | undefined>();

function readCronusItem(name: string): CronusRegistryItem | undefined {
  if (!itemCache.has(name)) {
    const file = SLUG_RE.test(name) ? join(registryRoot(), `${name}.json`) : undefined;
    itemCache.set(
      name,
      file && existsSync(file)
        ? (JSON.parse(readFileSync(file, "utf8")) as CronusRegistryItem)
        : undefined,
    );
  }
  return itemCache.get(name);
}

/* -------------------------------------------------------------------------- */
/*  Titles + descriptions                                                     */
/* -------------------------------------------------------------------------- */

/** Items that ship in the registry but have no documented showcase page. */
const UNDOCUMENTED_META: Record<string, { title: string; description: string }> = {
  cn: {
    title: "cn",
    description: "Class-name merge helper combining clsx and tailwind-merge.",
  },
  "motion-presets": {
    title: "Motion Presets",
    description: "Shared motion springs, easings, and variants used by the animated components.",
  },
};

function itemMeta(name: string): { title: string; description?: string } {
  const component = getComponentMeta(name);
  if (component) {
    return { title: getComponentDisplayName(component.name), description: component.description };
  }
  const block = getBlockMeta(name);
  if (block) return { title: block.name, description: block.description };
  const extra = UNDOCUMENTED_META[name];
  if (extra) return extra;
  // Humanize the slug so the index never ships an untitled item.
  return {
    title: name
      .split("-")
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(" "),
  };
}

/* -------------------------------------------------------------------------- */
/*  Cronus item → shadcn registry-item                                         */
/* -------------------------------------------------------------------------- */

export interface ShadcnRegistryFile {
  path: string;
  type: string;
  target?: string;
  content?: string;
}

export interface ShadcnRegistryItem {
  $schema: string;
  name: string;
  type: CronusItemType;
  title: string;
  description?: string;
  dependencies: string[];
  registryDependencies: string[];
  files: ShadcnRegistryFile[];
}

/**
 * Rewrite the canonical in-package specifiers to the `@/registry/<style>/…`
 * form the shadcn CLI transforms into the consumer's aliases:
 *   "../lib/cn.js" → "@/registry/cronus/lib/cn"    (→ e.g. "@/lib/cn")
 *   "./button.js"  → "@/registry/cronus/ui/button" (→ e.g. "@/components/ui/button")
 * npm specifiers are left untouched.
 */
function rewriteForShadcn(content: string): string {
  return content
    .replace(/(["'])\.\.\/lib\/cn\.js\1/g, `"@/registry/${REGISTRY_STYLE}/lib/cn"`)
    .replace(/(["'])\.\/([\w-]+)\.js\1/g, `"@/registry/${REGISTRY_STYLE}/ui/$2"`);
}

function toShadcnFile(file: CronusRegistryFile, withContent: boolean): ShadcnRegistryFile {
  switch (file.target) {
    case "ui":
      return {
        path: `registry/${REGISTRY_STYLE}/ui/${file.path}`,
        type: "registry:ui",
        ...(withContent ? { content: rewriteForShadcn(file.content) } : {}),
      };
    case "lib":
      return {
        path: `registry/${REGISTRY_STYLE}/lib/${file.path}`,
        type: "registry:lib",
        ...(withContent ? { content: rewriteForShadcn(file.content) } : {}),
      };
    default:
      // Block sources import the @cronus-ui/ui npm package, so the content is
      // already consumer-ready; the explicit target keeps placement in lockstep
      // with the cronus-ui CLI (components/blocks/), src-dir aware via the CLI.
      return {
        path: `registry/${REGISTRY_STYLE}/blocks/${file.path}`,
        type: "registry:component",
        target: `components/blocks/${file.path}`,
        ...(withContent ? { content: file.content } : {}),
      };
  }
}

function toShadcnItem(name: string, withContent: boolean): ShadcnRegistryItem | undefined {
  const item = readCronusItem(name);
  if (!item) return undefined;
  const meta = itemMeta(name);
  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: item.name,
    type: item.type,
    title: meta.title,
    ...(meta.description !== undefined ? { description: meta.description } : {}),
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies.map((dep) => absoluteUrl(`/r/${dep}.json`)),
    files: item.files.map((file) => toShadcnFile(file, withContent)),
  };
}

/** Full registry-item document for `/r/<name>.json`; undefined for unknown names. */
export function getShadcnItem(name: string): ShadcnRegistryItem | undefined {
  return toShadcnItem(name, true);
}

/* -------------------------------------------------------------------------- */
/*  Registry index (/r/registry.json)                                         */
/* -------------------------------------------------------------------------- */

export interface ShadcnRegistry {
  $schema: string;
  name: string;
  homepage: string;
  items: Omit<ShadcnRegistryItem, "$schema">[];
}

/** The whole registry in shadcn `registry.json` shape (file lists, no content). */
export function buildShadcnRegistry(): ShadcnRegistry {
  const items = readCronusIndex().map((entry) => {
    const item = toShadcnItem(entry.name, false);
    if (!item) {
      throw new Error(`shadcn-registry: index references missing item "${entry.name}"`);
    }
    const { $schema: _schema, ...rest } = item;
    return rest;
  });
  return { $schema: REGISTRY_SCHEMA, name: REGISTRY_NAME, homepage: SITE_URL, items };
}

/** Static params for /r/[name] — every registry item, `.json`-suffixed. */
export function shadcnItemParams(): { name: string }[] {
  return readCronusIndex().map((entry) => ({ name: `${entry.name}.json` }));
}
