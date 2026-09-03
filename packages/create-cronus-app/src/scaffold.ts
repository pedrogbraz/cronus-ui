import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_MODE,
  DEFAULT_TEMPLATE,
  DEFAULT_THEME,
  type ModeName,
  type PackageManager,
  type TemplateName,
  type Theme,
  templateBaseDir,
} from "./utils.js";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Locate the bundled dir for `template` under `templates/`. In the published
 * package, sources live in `dist/` and templates are a sibling (`../templates`).
 * When running from source (tests/ts-node), they're one level up from `src/` as
 * well.
 */
function templateRoot(template: TemplateName): string {
  const candidates = [
    join(HERE, "..", "templates", template),
    join(HERE, "..", "..", "templates", template),
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      `Could not locate the bundled "${template}" template (looked in: ${candidates.join(", ")}).`,
    );
  }
  return found;
}

/**
 * Files whose dot-prefixed name npm strips when packing a template. We store
 * them undotted in the template and restore the leading "." on scaffold.
 * `gitignore` → `.gitignore`; a `_`-prefixed file → its dotted form.
 */
const DOTFILE_RENAMES: Record<string, string> = {
  gitignore: ".gitignore",
  npmrc: ".npmrc",
};

function restoreDotfileName(base: string): string {
  if (base in DOTFILE_RENAMES) return DOTFILE_RENAMES[base] as string;
  if (base.startsWith("_") && base.length > 1) return `.${base.slice(1)}`;
  return base;
}

/** Text extensions that get token replacement. Everything else is copied raw. */
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".md",
  ".txt",
  ".html",
]);

function isTextFile(path: string): boolean {
  const dot = path.lastIndexOf(".");
  return dot !== -1 && TEXT_EXTENSIONS.has(path.slice(dot));
}

/**
 * Replace template tokens. `__APP_NAME__` is the package name; `__THEME__` /
 * `__MODE__` are the chosen theme preset + color mode (baked into layout.tsx and
 * cronus-ui.json). Theme/mode default to the ship defaults so existing callers
 * (and tests) that pass only a name keep working.
 */
export function applyTokens(
  content: string,
  name: string,
  theme: Theme = DEFAULT_THEME,
  mode: ModeName = DEFAULT_MODE,
): string {
  return content
    .replaceAll("__APP_NAME__", name)
    .replaceAll("__THEME__", theme)
    .replaceAll("__MODE__", mode);
}

export interface ScaffoldOptions {
  /** Absolute path of the directory to create. */
  targetDir: string;
  /** Package name written into package.json / README (may be scoped). */
  name: string;
  /** Theme preset baked into the app. @default "aurora" */
  theme?: Theme;
  /** Default color mode baked into the app. @default "dark" */
  mode?: ModeName;
  /** Starter template to copy. @default "default" */
  template?: TemplateName;
}

export interface ScaffoldResult {
  fileCount: number;
}

/**
 * Recursively copy the chosen template into `targetDir`, replacing tokens in
 * text files and restoring stripped dotfile names. Returns the file count.
 */
export function scaffold(options: ScaffoldOptions): ScaffoldResult {
  // Composed templates (store/landing) have no bundled dir — copy the base they
  // build on (`default`), then the post-scaffold composeApp() step generates the
  // pages/chrome from validated blocks.
  const src = templateRoot(templateBaseDir(options.template ?? DEFAULT_TEMPLATE));
  const { targetDir, name, theme = DEFAULT_THEME, mode = DEFAULT_MODE } = options;
  mkdirSync(targetDir, { recursive: true });
  const fileCount = copyDir(src, targetDir, name, theme, mode);
  return { fileCount };
}

function copyDir(
  srcDir: string,
  destDir: string,
  name: string,
  theme: Theme,
  mode: ModeName,
): number {
  mkdirSync(destDir, { recursive: true });
  let count = 0;
  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, restoreDotfileName(entry));
    if (statSync(srcPath).isDirectory()) {
      count += copyDir(srcPath, destPath, name, theme, mode);
      continue;
    }
    if (isTextFile(srcPath)) {
      const content = applyTokens(readFileSync(srcPath, "utf8"), name, theme, mode);
      writeFileSync(destPath, content);
    } else {
      cpSync(srcPath, destPath);
    }
    count += 1;
  }
  return count;
}

/** Run the package manager's install in `cwd`. Throws if it exits non-zero. */
export function runInstall(pm: PackageManager, cwd: string): void {
  const result = spawnSync(pm, ["install"], {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (typeof result.status === "number" && result.status !== 0) {
    throw new Error(`${pm} install exited with code ${result.status}`);
  }
}

/** `pm run db:push -- --force` — non-interactive first-run sqlite push. */
export const DB_PUSH_ARGS = ["run", "db:push", "--", "--force"] as const;

/** Push the gold-path sqlite schema. Throws if it exits non-zero. */
export function runDbPush(pm: PackageManager, cwd: string): void {
  const result = spawnSync(pm, [...DB_PUSH_ARGS], {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (typeof result.status === "number" && result.status !== 0) {
    throw new Error(`${pm} db:push exited with code ${result.status}`);
  }
}
