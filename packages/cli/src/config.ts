import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const CONFIG_FILE = "cronus-ui.json";

export const CLI_VERSION = "0.6.9";

export const DEFAULT_REGISTRY = `https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v${CLI_VERSION}/registry`;

/** Manifest entry `add`/`upgrade` record per installed registry item. */
export interface InstalledRecord {
  /** Registry release the files came from (git tag without the leading "v"). */
  version: string;
  /** Project-relative paths the item wrote (e.g. "components/ui/button.tsx"). */
  files: string[];
}

/**
 * The normalized `choices` an app was composed with. Persisted with sorted keys
 * (deterministic) so `compose --plan <dir>` clones reproduce the same plan and
 * the 3-way page upgrade (F4) has a stable comparison base. Phase 1 fills `brand`
 * (and, when passed, `seed`); `variants`/`pages` stay empty until F2.
 */
export interface ComposedChoices {
  /** Selected block variant per family slug (F2; `{}` in F1). */
  variants: Record<string, string>;
  /** The routes actually generated, in manifest order. */
  pages: string[];
  /** The `--brand` value baked into chrome/hero copy. */
  brand: string;
  /** Aesthetic PRNG seed (only present when the caller passed `--seed`). */
  seed?: number;
}

/**
 * Per-composed-app record written by `compose` (mirrors {@link InstalledRecord}
 * for `installed`). `files` are the generated page/layout/chrome paths (NOT the
 * installed blocks — those live in `installed`). The `.cronus-ui/base/<composed-key>/`
 * snapshot (template name; legacy compose used the package.json name and F4
 * falls back to that dir) holds the exact bytes for the F4 page-upgrade merge
 * base.
 */
export interface ComposedRecord {
  /** Registry release the app was composed from (git tag without the leading "v"). */
  version: string;
  /** Manifest plan schema version the app was generated against. */
  planVersion: number;
  /** The normalized choices (sorted keys) the app was generated with. */
  choices: ComposedChoices;
  /** Project-relative paths the composer generated (pages, layouts, chrome wrappers). */
  files: string[];
  /**
   * Content fingerprint of the manifest this app was composed from (compose
   * provenance). `add-page` reloads a bundled template only when it matches this
   * hash — so a `--manifest`-composed app whose `name` collides with a bundled
   * template (store/landing/saas) is NOT silently reloaded from the wrong bundled
   * manifest. Absent for apps composed before this field existed (legacy): the
   * verification is then skipped (nothing to compare against).
   */
  manifestHash?: string;
}

export interface CronusUIConfig {
  /** Import aliases used when rewriting component sources. */
  aliases: {
    ui: string;
    lib: string;
    blocks: string;
  };
  /** Filesystem paths (relative to cwd) where files are written. */
  paths: {
    ui: string;
    lib: string;
    blocks: string;
  };
  /** Registry source (http base URL or local directory). */
  registry: string;
  /** The app's theme preset + color mode (written by the scaffolder / `theme set`). */
  theme?: {
    name: string;
    mode: string;
  };
  /**
   * Install manifest: which items are installed, from which registry release,
   * and which files they own. `upgrade` uses the recorded version as the merge
   * base for its 3-way merge. Absent for installs made before this field
   * existed ("legacy") — `upgrade` then falls back to a 2-way diff.
   */
  installed?: Record<string, InstalledRecord>;
  /**
   * Compose manifest: which app templates were generated into this project, the
   * plan version + normalized choices, and the generated files each owns. Mirrors
   * `installed` (round-tripped verbatim); the F4 page-upgrade reads it to know
   * which pages to re-render against their `.cronus-ui/base/` snapshot.
   */
  composed?: Record<string, ComposedRecord>;
}

export const DEFAULT_CONFIG: CronusUIConfig = {
  aliases: { ui: "@/components/ui", lib: "@/lib", blocks: "@/components/blocks" },
  paths: { ui: "components/ui", lib: "lib", blocks: "components/blocks" },
  registry: DEFAULT_REGISTRY,
};

export function configPath(cwd: string): string {
  return join(cwd, CONFIG_FILE);
}

export function hasConfig(cwd: string): boolean {
  return existsSync(configPath(cwd));
}

export async function readConfig(cwd: string): Promise<CronusUIConfig> {
  const raw = await readFile(configPath(cwd), "utf8");
  const parsed = JSON.parse(raw) as Partial<CronusUIConfig>;
  return {
    aliases: { ...DEFAULT_CONFIG.aliases, ...parsed.aliases },
    paths: { ...DEFAULT_CONFIG.paths, ...parsed.paths },
    registry: parsed.registry ?? DEFAULT_CONFIG.registry,
    // Preserve the theme block when present so `add`/`init` round-trips never drop it.
    ...(parsed.theme ? { theme: parsed.theme } : {}),
    // Same for the install manifest — dropping it would silently downgrade every
    // component to the legacy (2-way) upgrade path.
    ...(parsed.installed ? { installed: parsed.installed } : {}),
    // And for the compose manifest — dropping it would orphan generated pages
    // from their base snapshot, breaking the composed-page 3-way upgrade (F4).
    ...(parsed.composed ? { composed: parsed.composed } : {}),
  };
}

export async function writeConfig(cwd: string, config: CronusUIConfig): Promise<void> {
  await writeFile(configPath(cwd), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}
