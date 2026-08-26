import { catalog as defaultCatalog } from "./catalog.js";
import { defaultSelection, resolve } from "./engine.js";
import { CLI_FLAGS, flagValue } from "./kickoff.js";
import type { Catalog, Category, Selection, StackConfig } from "./types.js";

export type StackFlagValue = string | string[] | boolean | undefined;
export type StackFlagValues = Record<string, StackFlagValue>;

export interface ParseStackFlagsOptions {
  catalog?: Catalog;
  baseSelection?: Selection;
}

function categoryById(catalog: Catalog, categoryId: string): Category {
  const category = catalog.find((candidate) => candidate.id === categoryId);
  if (!category) throw new Error(`Unknown stack category "${categoryId}".`);
  return category;
}

function firstString(value: StackFlagValue): string | undefined {
  if (Array.isArray(value)) return value.find((entry) => typeof entry === "string");
  return typeof value === "string" ? value : undefined;
}

function tokens(raw: string): string[] {
  return raw
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

function isNone(raw: string): boolean {
  return raw.trim().toLowerCase() === "none";
}

function optionIdForFlag(category: Category, value: string, flag: string): string {
  const normalized = value.trim().toLowerCase();
  const match = category.options.find(
    (option) => option.id === normalized || flagValue(option.id) === normalized,
  );
  if (!match) {
    const allowed = category.options.map((option) => flagValue(option.id)).join(", ");
    throw new Error(`Unknown --${flag} "${value}". Use one of: ${allowed}.`);
  }
  return match.id;
}

/**
 * Parse CLI-style flag values into a partial Stack Builder selection.
 *
 * Values intentionally use the same short tokens emitted by `generateCommand`
 * (`--web next`, `--db-setup neon`, `--mcp kronus-ui,github`, ...). The resolver
 * still performs the final cascade, so invalid combinations auto-correct through
 * the same rules the UI uses.
 */
export function parseStackFlags(
  values: StackFlagValues,
  options: ParseStackFlagsOptions = {},
): Selection {
  const catalog = options.catalog ?? defaultCatalog;
  const selection: Selection = { ...(options.baseSelection ?? {}) };

  for (const { catId, flag, kind } of CLI_FLAGS) {
    const raw = firstString(values[flag]);
    if (!raw) continue;

    const category = categoryById(catalog, catId);
    if (kind === "single") {
      selection[catId] = optionIdForFlag(category, raw, flag);
    } else {
      if (isNone(raw)) {
        selection[catId] = [];
        continue;
      }
      const ids = tokens(raw).map((value) => optionIdForFlag(category, value, flag));
      selection[catId] = [...new Set(ids)];
    }
  }

  if (values.vibe === true) selection.vibe = true;
  if (values.git === true) selection.git = true;
  if (values["no-git"] === true) selection.git = false;
  if (values.install === true) selection.install = true;
  if (values["no-install"] === true) selection.install = false;

  return selection;
}

export function resolveStackFlags(
  values: StackFlagValues,
  options: ParseStackFlagsOptions = {},
): StackConfig {
  const catalog = options.catalog ?? defaultCatalog;
  const base = options.baseSelection ?? defaultSelection(catalog);
  return resolve(catalog, { ...base, ...parseStackFlags(values, { catalog }) }).selection;
}
