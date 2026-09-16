import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";
import type { CronusUIConfig } from "./config.js";
import type { RegistryItem } from "./registry.js";

/**
 * Rewrite a component's canonical specifiers to the consumer's aliases:
 *   "../lib/cn.js"         → `${aliases.lib}/cn`
 *   "../lib/demo-store.js" → `${aliases.lib}/demo-store`
 *   "./button.js"          → `${aliases.ui}/button`
 * The `../lib/<name>.js` rule is generalized (F3) so any shared `registry:lib`
 * a block depends on — `cn`, `demo-store`, `demo-saas`, … — rewrites to the
 * consumer's `lib` alias, not just `cn`. npm imports are left untouched.
 */
export function rewriteImports(content: string, config: CronusUIConfig): string {
  return content
    .replace(/(["'])\.\.\/lib\/([\w-]+)\.js\1/g, `"${config.aliases.lib}/$2"`)
    .replace(/(["'])\.\/([\w-]+)\.js\1/g, `"${config.aliases.ui}/$2"`);
}

export function targetDir(config: CronusUIConfig, target: "ui" | "lib" | "block"): string {
  switch (target) {
    case "ui":
      return config.paths.ui;
    case "block":
      return config.paths.blocks;
    default:
      return config.paths.lib;
  }
}

export async function writeFileEnsured(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

/**
 * Resolve a registry-supplied `filePath` against `<cwd>/<dir>` while guaranteeing
 * the result stays inside that directory. `filePath` arrives raw from a remote
 * registry, so it is untrusted: reject absolute paths and any `..` traversal that
 * would escape the target root (e.g. "../escape" or "/etc/passwd").
 *
 * Returns the resolved absolute destination; throws a clear Error naming the
 * offending path otherwise.
 */
export function resolveSafeDest(cwd: string, dir: string, filePath: string): string {
  if (isAbsolute(filePath)) {
    throw new Error(`Refusing to write absolute registry path: ${filePath}`);
  }
  const resolvedRoot = resolve(join(cwd, dir));
  const resolvedDest = resolve(join(cwd, dir, filePath));
  if (resolvedDest !== resolvedRoot && !resolvedDest.startsWith(resolvedRoot + sep)) {
    throw new Error(`Refusing to write registry path outside target directory: ${filePath}`);
  }
  return resolvedDest;
}

/** Write all files of a resolved item, applying alias rewrites, return written paths. */
export async function writeItemFiles(
  item: RegistryItem,
  config: CronusUIConfig,
  cwd: string,
  { overwrite }: { overwrite: boolean },
): Promise<{ written: string[]; skipped: string[] }> {
  const written: string[] = [];
  const skipped: string[] = [];
  for (const file of item.files) {
    const dir = targetDir(config, file.target);
    const dest = resolveSafeDest(cwd, dir, file.path);
    if (existsSync(dest) && !overwrite) {
      skipped.push(join(dir, file.path));
      continue;
    }
    await writeFileEnsured(dest, rewriteImports(file.content, config));
    written.push(join(dir, file.path));
  }
  return { written, skipped };
}
