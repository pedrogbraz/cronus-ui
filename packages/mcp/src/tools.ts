import {
  type DesignContextOptions,
  type DesignFormat,
  designMarkdown,
  type LookName,
  lookNames,
  resolveDesignContext,
  type ThemeName,
  themeNames,
} from "@cronus-ui/tokens";
import {
  type CatalogKind,
  listCatalog as listCatalogCards,
  type MatchCatalogInput,
  matchCatalog as rankCatalog,
} from "./catalog.js";
import type { RegistryClient, RegistryIndexEntry, RegistryItem, RegistryMeta } from "./registry.js";

export const DESIGN_THEMES = themeNames as [ThemeName, ...ThemeName[]];
export const DESIGN_LOOKS = lookNames as [LookName, ...LookName[]];
export const DESIGN_FORMATS = ["compact", "extended"] as const;

/** Agent-readable Cronus taste. Values come from @cronus-ui/tokens. */
export function getDesignContext(options: DesignContextOptions = {}): {
  theme: ThemeName;
  look: LookName;
  format: DesignFormat;
  markdown: string;
} {
  const { theme, look, format } = resolveDesignContext(options);
  return {
    theme,
    look,
    format,
    markdown: designMarkdown({ theme, look, format }),
  };
}

/** The CLI invoked to install registry items into a consumer project. */
export const ADD_COMMAND = "npx cronus-ui add";

/**
 * Build the `npx cronus-ui add <names...>` command for one or more items.
 * Names are emitted in the given order, de-duplicated, preserving the first
 * occurrence. Throws on an empty list so callers surface a clear error.
 */
const INSTALL_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function buildInstallCommand(names: string[]): string {
  const cleaned: string[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    const name = raw.trim();
    if (name.length === 0 || seen.has(name)) continue;
    if (!INSTALL_SLUG.test(name) || name.startsWith("-")) {
      throw new Error(`Invalid component name: "${name}".`);
    }
    seen.add(name);
    cleaned.push(name);
  }
  if (cleaned.length === 0) {
    throw new Error("Provide at least one component or block name.");
  }
  return `${ADD_COMMAND} ${cleaned.join(" ")}`;
}

/**
 * Derive a short, human-readable label from a registry item name
 * (e.g. "alert-dialog" -> "Alert Dialog"). The registry index carries no
 * descriptions, so this gives agents a readable title without inventing prose.
 */
export function humanizeName(name: string): string {
  return name
    .split(/[-_]/g)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** A registry item as summarised for `list_*` / `search_registry` results. */
export interface ItemSummary {
  name: string;
  type: RegistryIndexEntry["type"];
  /** A readable label — the `meta.json` title when available, else name-derived. */
  title: string;
  /** One-line description from `meta.json`; omitted when no metadata is available. */
  description?: string;
  /** The item's semantic category from `meta.json`; omitted when unavailable. */
  category?: string;
  style?: string;
  palette?: string;
  motion?: string;
  intents?: string[];
  dependencies: string[];
  registryDependencies: string[];
  /** The command that installs this item. */
  install: string;
}

/**
 * Look up the metadata entry for a registry item by name across the meta
 * `blocks` and `components` maps (both keyed by the same slug as the index name).
 * Returns `undefined` when there is no metadata (absent sidecar or unknown item),
 * so callers fall back to name-derived titles.
 */
function metaEntryFor(
  name: string,
  meta: RegistryMeta | null,
):
  | {
      title: string;
      description: string;
      category: string;
      style?: string;
      palette?: string;
      motion?: string;
      intents?: string[];
    }
  | undefined {
  if (!meta) return undefined;
  return meta.blocks?.[name] ?? meta.components?.[name] ?? undefined;
}

/**
 * Summarise one index entry, enriching `title`/`description`/`category` from
 * `meta.json` when present. Falls back to {@link humanizeName} for the title (and
 * omits description/category) so older/custom registries without a sidecar still
 * produce a usable summary.
 */
function summarise(entry: RegistryIndexEntry, meta: RegistryMeta | null): ItemSummary {
  const info = metaEntryFor(entry.name, meta);
  return {
    name: entry.name,
    type: entry.type,
    title: info?.title ?? humanizeName(entry.name),
    ...(info?.description ? { description: info.description } : {}),
    ...(info?.category ? { category: info.category } : {}),
    ...(info?.style ? { style: info.style } : {}),
    ...(info?.palette ? { palette: info.palette } : {}),
    ...(info?.motion ? { motion: info.motion } : {}),
    ...(info?.intents && info.intents.length > 0 ? { intents: info.intents } : {}),
    dependencies: entry.dependencies,
    registryDependencies: entry.registryDependencies,
    install: buildInstallCommand([entry.name]),
  };
}

/** Output of {@link listComponents}. */
export interface ListResult {
  count: number;
  items: ItemSummary[];
}

/** List installable UI components (registry items of type `registry:ui`). */
export async function listComponents(client: RegistryClient): Promise<ListResult> {
  const [index, meta] = await Promise.all([client.index(), client.meta()]);
  const items = index
    .filter((entry) => entry.type === "registry:ui")
    .map((entry) => summarise(entry, meta));
  return { count: items.length, items };
}

/** List installable blocks (registry items of type `registry:block`). */
export async function listBlocks(client: RegistryClient): Promise<ListResult> {
  const [index, meta] = await Promise.all([client.index(), client.meta()]);
  const items = index
    .filter((entry) => entry.type === "registry:block")
    .map((entry) => summarise(entry, meta));
  return { count: items.length, items };
}

/** Output of {@link searchRegistry}. */
export interface SearchResult extends ListResult {
  query: string;
}

/**
 * Fuzzy-filter components and blocks by name (case-insensitive substring on the
 * raw name and its humanized title, plus the `meta.json` title, description and
 * category when a sidecar is available). The lib primitive (`cn`) is excluded —
 * it is pulled in automatically as a dependency, not something agents add
 * directly. Degrades to name/title matching when no metadata is present.
 */
export async function searchRegistry(client: RegistryClient, query: string): Promise<SearchResult> {
  const [index, meta] = await Promise.all([client.index(), client.meta()]);
  const needle = query.trim().toLowerCase();
  const items = index
    .filter((entry) => entry.type === "registry:ui" || entry.type === "registry:block")
    .filter((entry) => {
      if (needle.length === 0) return true;
      const info = metaEntryFor(entry.name, meta);
      const haystack = [
        entry.name,
        humanizeName(entry.name),
        info?.title ?? "",
        info?.description ?? "",
        info?.category ?? "",
        info?.style ?? "",
        info?.palette ?? "",
        info?.motion ?? "",
        ...(info?.intents ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    })
    .map((entry) => summarise(entry, meta));
  return { query, count: items.length, items };
}

/** Output of {@link getComponent}. */
export interface ComponentDetail {
  name: string;
  type: RegistryItem["type"];
  title: string;
  /** One-line description from `meta.json`; omitted when no metadata is available. */
  description?: string;
  /** The item's semantic category from `meta.json`; omitted when unavailable. */
  category?: string;
  style?: string;
  palette?: string;
  motion?: string;
  intents?: string[];
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryItem["files"];
  /** The command that installs this item (and its registry dependencies). */
  install: string;
}

/**
 * Fetch the full detail for a single component or block: its source file(s),
 * npm `dependencies`, `registryDependencies`, and the install command. Enriches
 * `title`/`description`/`category` from `meta.json` when a sidecar is available,
 * falling back to a name-derived title otherwise.
 */
export async function getComponent(client: RegistryClient, name: string): Promise<ComponentDetail> {
  const [item, meta] = await Promise.all([client.item(name), client.meta()]);
  const info = metaEntryFor(item.name, meta);
  return {
    name: item.name,
    type: item.type,
    title: info?.title ?? humanizeName(item.name),
    ...(info?.description ? { description: info.description } : {}),
    ...(info?.category ? { category: info.category } : {}),
    ...(info?.style ? { style: info.style } : {}),
    ...(info?.palette ? { palette: info.palette } : {}),
    ...(info?.motion ? { motion: info.motion } : {}),
    ...(info?.intents && info.intents.length > 0 ? { intents: info.intents } : {}),
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: item.files,
    install: buildInstallCommand([item.name]),
  };
}

/** Output of {@link getInstallCommand}. */
export interface InstallCommandResult {
  names: string[];
  command: string;
}

/** Build the install command for one or more component/block names. */
export function getInstallCommand(names: string[]): InstallCommandResult {
  const command = buildInstallCommand(names);
  return { names, command };
}

/** Compact tagged catalog (no source files) for Hydra / low-context agents. */
export async function listCatalog(client: RegistryClient, kind?: CatalogKind) {
  const [index, meta] = await Promise.all([client.index(), client.meta()]);
  return listCatalogCards(index, meta, kind);
}

/**
 * Two-query catalog match: intent (login, pricing, …) × motion/style
 * (smooth, glass, …). Pass a free-text `query` and filters are inferred.
 */
export async function matchCatalog(client: RegistryClient, input: MatchCatalogInput) {
  const [index, meta] = await Promise.all([client.index(), client.meta()]);
  return rankCatalog(index, meta, input);
}
