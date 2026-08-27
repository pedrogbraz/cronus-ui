/**
 * Bundled app-template I/O. Lives here (not in commands/compose.ts) so
 * `reloadManifest` can load a template without a circular import through the
 * compose command module.
 */

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { closestName } from "../utils.js";
import { type AppManifest, parseManifest } from "./manifest.js";

/** Directory holding the bundled app-template manifests (dist/ or src/ layout). */
function appsTemplatesDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  // compiled: dist/compose/templates.js → dist/../templates ; source: src/compose → ../templates
  const compiled = join(here, "..", "..", "templates", "apps");
  const fromSource = join(here, "..", "templates", "apps");
  return [compiled, fromSource].find((p) => existsSync(p)) ?? compiled;
}

/** Canonical `-y` / non-TTY compose target — never lexicographic first. */
export const DEFAULT_COMPOSE_TEMPLATE = "saas";

const TEMPLATE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** True when `name` is a safe templates/apps basename (no path traversal). */
export function isTemplateSlug(name: string): boolean {
  return TEMPLATE_SLUG.test(name);
}

/** List the bundled template names (basename without .json), sorted. */
export async function listTemplates(): Promise<string[]> {
  try {
    return (await readdir(appsTemplatesDir()))
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.slice(0, -".json".length))
      .filter(isTemplateSlug)
      .sort();
  } catch {
    return [];
  }
}

/**
 * Template used when the user passes `--yes` or stdin is not a TTY.
 * Prefers SaaS; falls back to the first bundled name if SaaS is missing.
 */
export function defaultComposeTemplate(available: string[]): string {
  if (available.includes(DEFAULT_COMPOSE_TEMPLATE)) return DEFAULT_COMPOSE_TEMPLATE;
  const first = available[0];
  if (first === undefined) throw new Error("no app templates are bundled with this CLI");
  return first;
}

/** Load + strictly parse a bundled template manifest by name. Throws on missing/invalid. */
export async function loadTemplate(name: string): Promise<AppManifest> {
  if (!isTemplateSlug(name)) {
    throw new Error(`Unknown template "${name}".`);
  }
  const file = join(appsTemplatesDir(), `${name}.json`);
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    const available = await listTemplates();
    const suggestion = closestName(name, available);
    throw new Error(
      suggestion
        ? `Unknown template "${name}". Did you mean "${suggestion}"? (available: ${available.join(", ")})`
        : `Unknown template "${name}" (available: ${available.join(", ") || "none"}).`,
    );
  }
  return parseManifest(JSON.parse(raw) as unknown);
}

/** Load + strictly parse a manifest from an explicit file path. */
export async function loadManifestFile(path: string): Promise<AppManifest> {
  const raw = await readFile(path, "utf8");
  return parseManifest(JSON.parse(raw) as unknown);
}
