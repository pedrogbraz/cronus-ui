import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { SERVER_VERSION } from "./version.js";

/**
 * The default public registry base. Mirrors the `cronus-ui` CLI's
 * `DEFAULT_REGISTRY` so the MCP server and the CLI resolve the same items.
 * Overridable at runtime via the `CRONUS_UI_REGISTRY` env var (http(s) base
 * URL or a local directory path).
 */
export const DEFAULT_REGISTRY = `https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v${SERVER_VERSION}/registry`;

/** Resolve the active registry source, honouring the env override. */
export function resolveRegistrySource(env: NodeJS.ProcessEnv = process.env): string {
  const override = env.CRONUS_UI_REGISTRY?.trim();
  return override && override.length > 0 ? override : DEFAULT_REGISTRY;
}

export type RegistryItemType = "registry:ui" | "registry:lib" | "registry:block";

/** A single file shipped with a registry item. */
export interface RegistryFile {
  /** Path relative to the item kind (e.g. "button.tsx" or "cn.ts"). */
  path: string;
  /** Raw source for the file. */
  content: string;
  /** Where it is written in the consumer project. */
  target: "ui" | "lib" | "block";
}

/** A lightweight registry listing entry (from `index.json`). */
export interface RegistryIndexEntry {
  name: string;
  type: RegistryItemType;
  /** npm packages (with version ranges) this item imports. */
  dependencies: string[];
  /** other registry items this item imports (by name). */
  registryDependencies: string[];
}

export type RegistryIndex = RegistryIndexEntry[];

/** A full registry item (from `<name>.json`), including its source files. */
export interface RegistryItem extends RegistryIndexEntry {
  files: RegistryFile[];
}

/** Semantic metadata for one block in `meta.json` (subset the MCP surface reads). */
export interface RegistryMetaBlock {
  title: string;
  description: string;
  category: string;
}

/** Semantic metadata for one component in `meta.json` (subset the MCP surface reads). */
export interface RegistryMetaComponent {
  title: string;
  description: string;
  category: string;
}

/**
 * The `registry/meta.json` sidecar (as much of it as the MCP tools consume).
 * Optional at runtime: older or custom registries may not ship it, in which case
 * the tools fall back to name-derived titles.
 */
export interface RegistryMeta {
  registryVersion?: string;
  blocks?: Record<string, RegistryMetaBlock>;
  components?: Record<string, RegistryMetaComponent>;
}

/**
 * Loads raw JSON documents from the registry. Abstracted behind an interface
 * so the server can run against the network, a local directory, or an
 * in-memory fixture (used by the tests) without touching the network.
 */
export interface RegistryLoader {
  /** Fetch and parse a JSON document by file name (e.g. "index.json"). */
  readJson<T>(file: string): Promise<T>;
}

/**
 * A {@link RegistryLoader} backed by either a local directory or an http(s)
 * base URL — the same dual behaviour as the CLI's `Registry`.
 */
export class SourceRegistryLoader implements RegistryLoader {
  private readonly base: string;
  private readonly isUrl: boolean;

  constructor(base: string) {
    this.isUrl = /^https?:\/\//.test(base);
    this.base = this.isUrl ? base.replace(/\/$/, "") : isAbsolute(base) ? base : resolve(base);
  }

  async readJson<T>(file: string): Promise<T> {
    if (this.isUrl) {
      const url = `${this.base}/${file}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`registry fetch failed (${res.status} ${res.statusText}): ${url}`);
      }
      return (await res.json()) as T;
    }
    const raw = await readFile(join(this.base, file), "utf8");
    return JSON.parse(raw) as T;
  }
}

/**
 * Caching facade over a {@link RegistryLoader}. Caches the index and each item
 * for the lifetime of the process so repeated tool calls do not re-fetch.
 */
export class RegistryClient {
  private indexCache: RegistryIndex | undefined;
  private readonly itemCache = new Map<string, RegistryItem>();
  /** `undefined` = not yet fetched; `null` = fetched but absent (custom/legacy registry). */
  private metaCache: RegistryMeta | null | undefined;

  constructor(private readonly loader: RegistryLoader) {}

  /** The registry listing, cached after the first read. */
  async index(): Promise<RegistryIndex> {
    if (this.indexCache) return this.indexCache;
    const index = await this.loader.readJson<RegistryIndex>("index.json");
    this.indexCache = index;
    return index;
  }

  /** A single full item by name, cached after the first read. */
  async item(name: string): Promise<RegistryItem> {
    const cached = this.itemCache.get(name);
    if (cached) return cached;
    const item = await this.loader.readJson<RegistryItem>(`${encodeURIComponent(name)}.json`);
    this.itemCache.set(name, item);
    return item;
  }

  /**
   * The `meta.json` sidecar, or `null` when the registry does not ship one
   * (older releases or custom registries). Cached after the first read — the
   * absent result is cached too so a missing sidecar is fetched only once.
   */
  async meta(): Promise<RegistryMeta | null> {
    if (this.metaCache !== undefined) return this.metaCache;
    try {
      this.metaCache = await this.loader.readJson<RegistryMeta>("meta.json");
    } catch {
      // 404 / missing file / parse error — degrade gracefully to name-only titles.
      this.metaCache = null;
    }
    return this.metaCache;
  }
}
