import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";
import pc from "picocolors";
import type { KronusUIConfig } from "./config.js";
import type { RegistryItem } from "./registry.js";

export const log = {
  info: (msg: string) => console.log(`${pc.cyan("ℹ")} ${msg}`),
  ok: (msg: string) => console.log(`${pc.green("✔")} ${msg}`),
  warn: (msg: string) => console.log(`${pc.yellow("⚠")} ${msg}`),
  err: (msg: string) => console.error(`${pc.red("✖")} ${msg}`),
  step: (msg: string) => console.log(`${pc.dim("›")} ${msg}`),
  title: (msg: string) => console.log(`\n${pc.bold(msg)}`),
};

export type PackageManager = "bun" | "pnpm" | "yarn" | "npm";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "bun.lock")) || existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function installArgs(pm: PackageManager, deps: string[]): string[] {
  switch (pm) {
    case "bun":
      return ["add", ...deps];
    case "pnpm":
      return ["add", ...deps];
    case "yarn":
      return ["add", ...deps];
    default:
      return ["install", ...deps];
  }
}

export function runInstall(pm: PackageManager, deps: string[], cwd: string): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(pm, installArgs(pm, deps), { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`${pm} exited with code ${code}`)),
    );
  });
}

/**
 * Rewrite a component's canonical specifiers to the consumer's aliases:
 *   "../lib/cn.js"         → `${aliases.lib}/cn`
 *   "../lib/demo-store.js" → `${aliases.lib}/demo-store`
 *   "./button.js"          → `${aliases.ui}/button`
 * The `../lib/<name>.js` rule is generalized (F3) so any shared `registry:lib`
 * a block depends on — `cn`, `demo-store`, `demo-saas`, … — rewrites to the
 * consumer's `lib` alias, not just `cn`. npm imports are left untouched.
 */
export function rewriteImports(content: string, config: KronusUIConfig): string {
  return content
    .replace(/(["'])\.\.\/lib\/([\w-]+)\.js\1/g, `"${config.aliases.lib}/$2"`)
    .replace(/(["'])\.\/([\w-]+)\.js\1/g, `"${config.aliases.ui}/$2"`);
}

export function targetDir(config: KronusUIConfig, target: "ui" | "lib" | "block"): string {
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
  config: KronusUIConfig,
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

/**
 * A valid npm package spec: an optionally-scoped name with an optional
 * `@version`/range suffix (e.g. "react", "@radix-ui/react-slot", "clsx@^2.1.1").
 * Case-insensitive.
 */
const VALID_DEPENDENCY_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*(@[^\s]+)?$/i;

/**
 * Guard a single registry-supplied dependency token before it is handed to the
 * package manager. Dependency strings arrive raw from a remote registry, so a
 * malicious entry like "--registry=http://evil" or "-g" would otherwise be
 * spawned as a package-manager flag (arg injection). Reject anything that is not
 * a plain npm package spec, naming the offending token in the thrown Error.
 *
 * Note the explicit leading-`-` check: a literal `-` is a legal *internal*
 * package-name character (so the name char class permits it), which means the
 * regex alone would accept "-g". We reject a leading dash outright so a spec can
 * never be parsed as a CLI flag.
 */
export function assertValidDependency(dep: string): void {
  if (dep.startsWith("-") || !VALID_DEPENDENCY_RE.test(dep)) {
    throw new Error(`Refusing to install invalid dependency spec from registry: ${dep}`);
  }
}

/**
 * Collect + de-duplicate npm deps across resolved items. Every dependency is
 * validated here — the single point all registry deps pass through before the
 * package-manager spawn — so an injected/malformed spec throws before install.
 */
export function collectDependencies(items: RegistryItem[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    for (const dep of item.dependencies) {
      assertValidDependency(dep);
      set.add(dep);
    }
  }
  return [...set].sort();
}

/** Levenshtein edit distance between two strings (small inputs: registry names). */
export function levenshtein(a: string, b: string): number {
  // Single rolling row of the DP matrix (row 0 = distances against an empty `a`).
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prevDiag = row[0] ?? 0; // dist[i-1][0]
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j] ?? 0; // dist[i-1][j], not yet overwritten
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(above + 1, (row[j - 1] ?? 0) + 1, prevDiag + cost);
      prevDiag = above;
    }
  }
  return row[b.length] ?? 0;
}

/**
 * Find the closest registry name to a (presumably mistyped) `name`. Prefers a
 * substring match, then falls back to the nearest by edit distance, but only
 * when that distance is small enough to be a plausible typo. Returns undefined
 * when nothing is close enough to suggest.
 */
export function closestName(name: string, candidates: string[]): string | undefined {
  if (candidates.length === 0) return undefined;
  const needle = name.toLowerCase();

  const substring = candidates.find(
    (c) => c.toLowerCase().includes(needle) || needle.includes(c.toLowerCase()),
  );
  if (substring) return substring;

  let best: string | undefined;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const candidate of candidates) {
    const dist = levenshtein(needle, candidate.toLowerCase());
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  // Only suggest when it is a plausible typo (scaled to the name length).
  const threshold = Math.max(2, Math.floor(name.length / 2));
  return best !== undefined && bestDist <= threshold ? best : undefined;
}
