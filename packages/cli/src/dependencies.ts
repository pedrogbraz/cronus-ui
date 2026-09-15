import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { RegistryItem } from "./registry.js";

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

/**
 * Split a registry npm spec (`lucide-react@^0.577.0`, `@cronus-ui/ui@0.6.1`)
 * into name + range. A bare name (no `@range`) leaves `range` undefined so we
 * never write an empty pin into package.json.
 */
export function splitDependencySpec(spec: string): { name: string; range: string | undefined } {
  if (spec.startsWith("@")) {
    const at = spec.indexOf("@", 1);
    if (at === -1) return { name: spec, range: undefined };
    const range = spec.slice(at + 1);
    return { name: spec.slice(0, at), range: range.length > 0 ? range : undefined };
  }
  const at = spec.indexOf("@");
  if (at <= 0) return { name: spec, range: undefined };
  const range = spec.slice(at + 1);
  return { name: spec.slice(0, at), range: range.length > 0 ? range : undefined };
}

/**
 * Merge versioned registry specs into a package.json document. Existing pins
 * win (`??=`) so a scaffold range is not clobbered by a later compose. Specs
 * without a range are skipped. Returns the original string when nothing changes
 * so we do not reformat an untouched file.
 */
export function mergeDependencySpecsIntoPackageJson(raw: string, specs: string[]): string {
  if (specs.length === 0) return raw;
  const pkg = JSON.parse(raw) as {
    dependencies?: Record<string, string>;
    [key: string]: unknown;
  };
  const dependencies = { ...(pkg.dependencies ?? {}) };
  let changed = false;
  for (const spec of specs) {
    const { name, range } = splitDependencySpec(spec);
    if (range === undefined || name.length === 0) continue;
    if (dependencies[name] === undefined) {
      dependencies[name] = range;
      changed = true;
    }
  }
  if (!changed) return raw;
  pkg.dependencies = dependencies;
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

/**
 * Persist registry npm pins into `<cwd>/package.json` even when install is
 * skipped, so a later `bun install` / `npm install` picks up lucide-react,
 * recharts, etc. No-ops when there is no package.json or nothing new to add.
 */
export async function recordDependencies(cwd: string, specs: string[]): Promise<void> {
  if (specs.length === 0) return;
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) return;
  const raw = await readFile(pkgPath, "utf8");
  let next: string;
  try {
    next = mergeDependencySpecsIntoPackageJson(raw, specs);
  } catch {
    return;
  }
  if (next === raw) return;
  await writeFile(pkgPath, next, "utf8");
}
