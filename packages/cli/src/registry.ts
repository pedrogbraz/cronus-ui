import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";

/** A single file that ships with a registry item. */
export interface RegistryFile {
  /** Path relative to the item kind (e.g. "button.tsx" or "cn.ts"). */
  path: string;
  /** Raw source, with canonical `../lib/cn.js` / `./x.js` specifiers. */
  content: string;
  /** Where it is written in the consumer. */
  target: "ui" | "lib" | "block";
}

export type RegistryItemType = "registry:ui" | "registry:lib" | "registry:block";

export interface RegistryItem {
  name: string;
  type: RegistryItemType;
  /** npm packages (with version ranges) this item imports. */
  dependencies: string[];
  /** other registry items this item imports (by name). */
  registryDependencies: string[];
  files: RegistryFile[];
}

export interface RegistryIndexEntry {
  name: string;
  type: RegistryItemType;
  dependencies: string[];
  registryDependencies: string[];
}

export type RegistryIndex = RegistryIndexEntry[];

/**
 * Matches a release-pinned "/vX.Y.Z/" path segment in a registry source, e.g.
 * ".../cronus-ui/v0.5.0/registry" (the default raw.githubusercontent.com layout)
 * or a local ".../v0.5.0/registry" mirror. The trailing separator is a
 * lookahead so replacements never eat it.
 */
const VERSION_SEGMENT_RE = /([/\\])v(\d+\.\d+\.\d+(?:-[\w.]+)?)(?=[/\\])/;

/** Extract the release version a registry source is pinned to, if any. */
export function registrySourceVersion(source: string): string | undefined {
  return VERSION_SEGMENT_RE.exec(source)?.[2];
}

/**
 * Re-pin a versioned registry source to a different release tag. Because the
 * default registry lives at `raw.githubusercontent.com/.../v<version>/registry`,
 * every published release's registry stays addressable forever — `upgrade`
 * uses this to fetch the exact merge base a component was installed from.
 * Returns undefined when the source carries no version segment (an unversioned
 * URL or plain local directory), in which case past releases are unreachable.
 */
export function registrySourceAtVersion(source: string, version: string): string | undefined {
  if (!VERSION_SEGMENT_RE.test(source)) return undefined;
  return source.replace(VERSION_SEGMENT_RE, `$1v${version}`);
}

/** A registry source: either a local directory or an http(s) base URL. */
export class Registry {
  private readonly base: string;
  private readonly isUrl: boolean;
  private cache = new Map<string, RegistryItem>();

  constructor(base: string) {
    this.isUrl = /^https?:\/\//.test(base);
    this.base = this.isUrl ? base.replace(/\/$/, "") : isAbsolute(base) ? base : resolve(base);
  }

  private async readJson<T>(file: string): Promise<T> {
    if (this.isUrl) {
      const res = await fetch(`${this.base}/${file}`);
      if (!res.ok) throw new Error(`registry fetch failed (${res.status}): ${this.base}/${file}`);
      return (await res.json()) as T;
    }
    const raw = await readFile(join(this.base, file), "utf8");
    return JSON.parse(raw) as T;
  }

  async index(): Promise<RegistryIndex> {
    return this.readJson<RegistryIndex>("index.json");
  }

  /**
   * The `registry/meta.json` sidecar, or `null` when the registry does not ship
   * one (older releases / custom registries). Mirrors the MCP client's graceful
   * degradation so `compose` can fail with a clear message rather than a raw 404.
   */
  async meta<T = unknown>(): Promise<T | null> {
    try {
      return await this.readJson<T>("meta.json");
    } catch {
      return null;
    }
  }

  async item(name: string): Promise<RegistryItem> {
    const cached = this.cache.get(name);
    if (cached) return cached;
    const item = await this.readJson<RegistryItem>(`${name}.json`);
    this.cache.set(name, item);
    return item;
  }

  /**
   * Resolve the full transitive closure of registry items needed for `names`,
   * returned in dependency-first order (so files write cleanly).
   */
  async resolve(names: string[]): Promise<RegistryItem[]> {
    const ordered: RegistryItem[] = [];
    const seen = new Set<string>();
    const visiting = new Set<string>();

    const visit = async (name: string): Promise<void> => {
      if (seen.has(name)) return;
      if (visiting.has(name)) return; // guard against cycles
      visiting.add(name);
      const item = await this.item(name);
      for (const dep of item.registryDependencies) await visit(dep);
      visiting.delete(name);
      seen.add(name);
      ordered.push(item);
    };

    for (const name of names) await visit(name);
    return ordered;
  }
}
