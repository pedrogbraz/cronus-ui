import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import pc from "picocolors";
import {
  goldPatchAppShellChrome,
  goldPatchHomePage,
  goldPatchShellLayout,
  goldPatchTeamPage,
  isGoldPathTemplate,
} from "../compose/gold-path.js";
import { buildComposePlan, type ComposeChoiceInput } from "../compose/plan.js";
import {
  baseSnapshotDest,
  filterManifestToComposedPages,
  listBaseSnapshotRels,
  readBaseSnapshot,
  reloadManifest,
} from "../compose/reload.js";
import { renderPlan } from "../compose/render.js";
import {
  CLI_VERSION,
  type ComposedRecord,
  type CronusUIConfig,
  hasConfig,
  type InstalledRecord,
  readConfig,
  writeConfig,
} from "../config.js";
import {
  Registry,
  type RegistryItem,
  registrySourceAtVersion,
  registrySourceVersion,
} from "../registry.js";
import {
  closestName,
  log,
  resolveSafeDest,
  rewriteImports,
  targetDir,
  writeFileEnsured,
  writeItemFiles,
} from "../utils.js";
import { readChromeSources, readComposeMeta, readProjectName } from "./compose.js";

/** Where the human/agent-readable conflict report is written (project root). */
export const REPORT_FILE = "CRONUS-UPGRADE.md";

export interface UpgradeOptions {
  cwd: string;
  registry?: string;
  /** Upgrade every item recorded in the install manifest. */
  all?: boolean;
  /** Print the per-file plan without writing anything (not even the report). */
  dryRun?: boolean;
  /** Assume "yes" for every confirmation (conflict markers, overwrites). */
  yes?: boolean;
  /** Legacy items (no manifest entry): allow replacing local files with upstream. */
  overwrite?: boolean;
  /** Reload composed apps from this manifest file (same flag as add-page/compose). */
  manifestPath?: string;
  /** Test seam — replaces the interactive stdin confirmation when provided. */
  confirm?: (question: string) => Promise<boolean>;
}

/** Outcome of planning one file of one item. */
export type FileStatus =
  | "up-to-date"
  | "fast-forward"
  | "new-file"
  | "local-edits"
  | "merged"
  | "conflict"
  | "manual"
  | "removed-upstream"
  | "locally-deleted"
  | "legacy-match"
  | "legacy-differs";

interface FilePlan {
  item: string;
  /** Project-relative path (e.g. "components/ui/button.tsx"). */
  relPath: string;
  status: FileStatus;
  /** Absolute destination, for statuses that may write. */
  dest?: string;
  /** Content to write (target, merged result, or conflict-marked merge). */
  content?: string;
  /** base→upstream unified diff, embedded in the report for agents. */
  upstreamDiff?: string;
  /** Rewritten upstream content — report fallback when no diff is available. */
  targetContent?: string;
  /** Set during apply: the conflict-marked file was written to disk. */
  markersWritten?: boolean;
  /** Set during apply: a legacy file was replaced with upstream. */
  overwritten?: boolean;
  /** The registry version this file was merged FROM (for report labels). */
  baseVersion?: string;
  /**
   * Upstream bytes to snapshot after a write (composed-page 3-way). The next
   * merge base must be the render we merged TO, not the merged local file.
   */
  snapshotContent?: string;
  /** Absolute snapshot dest (composed-key dir). Set only on compose file plans. */
  snapshotDest?: string;
}

interface ItemPlan {
  name: string;
  /** true when the item had no usable manifest/base (2-way path). */
  legacy: boolean;
  plans: FilePlan[];
  /** Rel paths of every upstream file — the manifest files list after upgrade. */
  targetFiles: string[];
  /** Set for composed-page upgrades: the `composed{}` key (template name). */
  composeKey?: string;
  /**
   * Registry items the re-plan newly requires that are not in `installed{}`.
   * A template page that grew a block would otherwise import a file that is
   * not on disk. Dry-run logs them; apply writes them (no overwrite).
   */
  installItems?: RegistryItem[];
}

/* -------------------------------------------------------------------------- */
/* git machinery (node:child_process only — no new dependencies)              */
/* -------------------------------------------------------------------------- */

function runGit(args: string[]): Promise<{ code: number; stdout: string }> {
  return new Promise((resolvePromise) => {
    const child = spawn("git", args, { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (chunk: Buffer) => {
      out += chunk.toString("utf8");
    });
    child.on("error", () => resolvePromise({ code: -1, stdout: "" }));
    child.on("close", (code) => resolvePromise({ code: code ?? -1, stdout: out }));
  });
}

/** Probe for a usable `git` binary once per process. */
let gitProbe: Promise<boolean> | undefined;
function gitAvailable(): Promise<boolean> {
  gitProbe ??= runGit(["--version"]).then((r) => r.code === 0);
  return gitProbe;
}

/** Run `fn` with the given named contents written to a fresh temp dir. */
async function withTempFiles<T>(
  contents: Record<string, string>,
  fn: (paths: Record<string, string>) => Promise<T>,
): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), "cronus-ui-upgrade-"));
  try {
    const paths: Record<string, string> = {};
    for (const [name, content] of Object.entries(contents)) {
      const path = join(dir, name);
      await writeFile(path, content, "utf8");
      paths[name] = path;
    }
    return await fn(paths);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export type MergeResult =
  | { status: "clean" | "conflict"; content: string }
  | { status: "unavailable" };

/**
 * 3-way merge via `git merge-file -p --diff3`. Exit code 0 = clean merge,
 * 1..127 = that many conflicts (stdout still holds the marked-up result),
 * anything else (or no git at all) = unavailable → caller falls back to a
 * whole-file "manual merge needed" report.
 */
export async function mergeThreeWay(
  base: string,
  local: string,
  target: string,
  labels: { base: string; target: string },
): Promise<MergeResult> {
  if (!(await gitAvailable())) return { status: "unavailable" };
  return withTempFiles({ base, local, target }, async (paths) => {
    const { code, stdout } = await runGit([
      "merge-file",
      "-p",
      "--diff3",
      "-L",
      "LOCAL (your edits)",
      "-L",
      `BASE (${labels.base})`,
      "-L",
      `UPSTREAM (${labels.target})`,
      paths.local ?? "",
      paths.base ?? "",
      paths.target ?? "",
    ]);
    if (code === 0) return { status: "clean", content: stdout };
    if (code > 0 && code < 128) return { status: "conflict", content: stdout };
    return { status: "unavailable" };
  });
}

/**
 * Unified diff (a→b) via `git diff --no-index`, with the temp-file headers
 * replaced by the given labels. Returns undefined when git is unavailable or
 * errors (exit 1 just means "files differ" and is expected).
 */
export async function unifiedDiff(
  a: string,
  b: string,
  labelA: string,
  labelB: string,
): Promise<string | undefined> {
  if (!(await gitAvailable())) return undefined;
  return withTempFiles({ a, b }, async (paths) => {
    const { code, stdout } = await runGit([
      "diff",
      "--no-index",
      "--unified=3",
      paths.a ?? "",
      paths.b ?? "",
    ]);
    if (code !== 0 && code !== 1) return undefined;
    const lines = stdout.split("\n");
    const firstHunk = lines.findIndex((line) => line.startsWith("@@"));
    if (firstHunk === -1) return undefined;
    return [`--- ${labelA}`, `+++ ${labelB}`, ...lines.slice(firstHunk)].join("\n").trimEnd();
  });
}

/* -------------------------------------------------------------------------- */
/* planning                                                                   */
/* -------------------------------------------------------------------------- */

/** Whitespace-insensitive equality, matching how `diff` detects drift. */
function same(a: string, b: string): boolean {
  return a.trim() === b.trim();
}

/** Rel path + safe absolute dest for one registry file (throws on traversal). */
function fileDest(
  config: CronusUIConfig,
  cwd: string,
  file: RegistryItem["files"][number],
): { rel: string; dest: string } {
  const dir = targetDir(config, file.target);
  return { rel: join(dir, file.path), dest: resolveSafeDest(cwd, dir, file.path) };
}

/**
 * Decision matrix for one file of a 3-way upgrade (components AND composed
 * pages). `base === undefined` means the file is not in the merge base
 * (snapshot missing → treat as empty, same as an upstream-new collision).
 *
 *   missing locally, new upstream        → new-file        (write upstream)
 *   missing locally, existed in base     → locally-deleted (respect deletion)
 *   local == upstream                    → up-to-date
 *   base == upstream (only local moved)  → local-edits     (keep local)
 *   local == base (only upstream moved)  → fast-forward    (write upstream)
 *   all three differ                     → 3-way merge     (merged | conflict)
 */
async function planThreeWayFile(args: {
  item: string;
  relPath: string;
  dest: string;
  base: string | undefined;
  local: string | undefined;
  target: string;
  labels: { base: string; target: string };
  baseVersion?: string;
}): Promise<FilePlan> {
  const { item, relPath, dest, base, local, target, labels, baseVersion } = args;
  const common = { item, relPath, dest, baseVersion };

  if (local === undefined) {
    return base === undefined
      ? { ...common, status: "new-file", content: target }
      : { ...common, status: "locally-deleted" };
  }
  if (same(local, target)) {
    return { ...common, status: "up-to-date" };
  }
  if (base !== undefined && same(base, target)) {
    return { ...common, status: "local-edits" };
  }
  if (base !== undefined && same(local, base)) {
    return { ...common, status: "fast-forward", content: target };
  }
  // All three versions differ (an upstream-new file colliding with an
  // existing local file merges against an empty base).
  const merged = await mergeThreeWay(base ?? "", local, target, labels);
  if (merged.status === "clean") {
    return { ...common, status: "merged", content: merged.content };
  }
  if (merged.status === "conflict") {
    const upstreamDiff = await unifiedDiff(base ?? "", target, labels.base, labels.target);
    return {
      ...common,
      status: "conflict",
      content: merged.content,
      upstreamDiff,
      targetContent: target,
    };
  }
  return { ...common, status: "manual", targetContent: target };
}

/**
 * Plan the upgrade of an item that HAS a merge base (install manifest + the
 * registry at the installed version). Files present in base but dropped
 * upstream are reported (removed-upstream) and never deleted — removing user
 * files is not this command's call.
 */
async function planManifestItem(args: {
  name: string;
  config: CronusUIConfig;
  cwd: string;
  baseItem: RegistryItem;
  targetItem: RegistryItem;
  baseVersion: string;
  targetVersion: string;
}): Promise<ItemPlan> {
  const { name, config, cwd, baseItem, targetItem, baseVersion, targetVersion } = args;
  const labels = { base: `registry v${baseVersion}`, target: `registry v${targetVersion}` };
  const plans: FilePlan[] = [];
  const targetFiles: string[] = [];

  const baseByRel = new Map<string, string>();
  for (const file of baseItem.files) {
    const dir = targetDir(config, file.target);
    baseByRel.set(join(dir, file.path), rewriteImports(file.content, config));
  }

  for (const file of targetItem.files) {
    let rel: string;
    let dest: string;
    try {
      ({ rel, dest } = fileDest(config, cwd, file));
    } catch (err) {
      log.warn(`${name}: ${(err as Error).message}`);
      continue;
    }
    targetFiles.push(rel);
    const target = rewriteImports(file.content, config);
    const base = baseByRel.get(rel);
    const local = existsSync(dest) ? await readFile(dest, "utf8") : undefined;
    plans.push(
      await planThreeWayFile({
        item: name,
        relPath: rel,
        dest,
        base,
        local,
        target,
        labels,
        baseVersion,
      }),
    );
  }

  for (const rel of baseByRel.keys()) {
    if (!targetFiles.includes(rel)) {
      plans.push({ item: name, relPath: rel, status: "removed-upstream", baseVersion });
    }
  }

  return { name, legacy: false, plans, targetFiles };
}

/**
 * Plan an item installed before the manifest existed (or whose base registry
 * release is unreachable): with no base there is nothing to merge against, so
 * this is a 2-way local-vs-upstream comparison. Matching files adopt the
 * manifest going forward; diverged files are only replaced under --overwrite
 * (plus confirmation).
 */
async function planLegacyItem(args: {
  name: string;
  config: CronusUIConfig;
  cwd: string;
  targetItem: RegistryItem;
  targetVersion: string;
}): Promise<ItemPlan> {
  const { name, config, cwd, targetItem, targetVersion } = args;
  const plans: FilePlan[] = [];
  const targetFiles: string[] = [];

  for (const file of targetItem.files) {
    let rel: string;
    let dest: string;
    try {
      ({ rel, dest } = fileDest(config, cwd, file));
    } catch (err) {
      log.warn(`${name}: ${(err as Error).message}`);
      continue;
    }
    targetFiles.push(rel);
    const target = rewriteImports(file.content, config);
    const common = { item: name, relPath: rel, dest };

    if (!existsSync(dest)) {
      plans.push({ ...common, status: "new-file", content: target });
      continue;
    }
    const local = await readFile(dest, "utf8");
    if (same(local, target)) {
      plans.push({ ...common, status: "legacy-match" });
      continue;
    }
    const upstreamDiff = await unifiedDiff(local, target, "local (yours)", labelFor(targetVersion));
    plans.push({
      ...common,
      status: "legacy-differs",
      content: target,
      upstreamDiff,
      targetContent: target,
    });
  }

  return { name, legacy: true, plans, targetFiles };
}

function labelFor(version: string): string {
  return `registry v${version}`;
}

/** Rel paths owned by `installed{}` items — chrome blocks, not generated pages. */
function installedFileSet(config: CronusUIConfig): Set<string> {
  const out = new Set<string>();
  for (const rec of Object.values(config.installed ?? {})) {
    for (const file of rec.files) out.add(file);
  }
  return out;
}

/**
 * Plan a 3-way upgrade of one composed app's generated pages/layouts/wrappers.
 * Reloads the manifest (same provenance guard as add-page), re-renders with
 * recorded choices, and runs the same decision matrix as {@link planManifestItem}.
 * Chrome rewrites are NOT applied — chrome blocks are `installed{}` items.
 */
async function planComposedApp(args: {
  composedKey: string;
  record: ComposedRecord;
  config: CronusUIConfig;
  cwd: string;
  registry: Registry;
  targetVersion: string;
  manifestPath: string | undefined;
}): Promise<ItemPlan> {
  const { composedKey, record, config, cwd, registry, targetVersion, manifestPath } = args;
  const item = `compose:${composedKey}`;
  const labels = {
    base: `registry v${record.version}`,
    target: `registry v${targetVersion}`,
  };

  const base = await reloadManifest(composedKey, manifestPath, record);
  const synthetic = filterManifestToComposedPages(base, record);

  const meta = await readComposeMeta(registry);
  if (meta === null) {
    throw new Error(
      "This registry does not ship a meta.json sidecar — compose upgrade needs it (upgrade to v0.4.0+).",
    );
  }
  const index = await registry.index();
  const chromeSources = await readChromeSources(synthetic, registry);
  const appName = await readProjectName(cwd);
  const keptRoutes = synthetic.manifest.pages.map((p) => p.route);
  const choices: ComposeChoiceInput = {
    brand: record.choices.brand,
    variants: record.choices.variants,
    appName,
    ...(record.choices.seed !== undefined ? { seed: record.choices.seed } : {}),
    ...(keptRoutes.length > 0 ? { pages: keptRoutes } : {}),
  };
  const plan = buildComposePlan(synthetic, choices, index, meta, chromeSources);
  // Pages + layouts + chrome WRAPPERS only. Chrome block bodies are installed{}
  // items and already 3-way as local edits — do not re-run brand/nav rewrite.
  const { files } = renderPlan(plan, config);

  const plans: FilePlan[] = [];
  const targetFiles: string[] = [];

  for (const file of files) {
    let dest: string;
    try {
      dest = resolveSafeDest(cwd, ".", file.path);
    } catch (err) {
      log.warn(`${item}: ${(err as Error).message}`);
      continue;
    }
    targetFiles.push(file.path);
    const target = file.content;
    // Snapshot missing → empty base (same as upstream-new colliding with local).
    const snap = await readBaseSnapshot(cwd, composedKey, plan.appName, file.path);
    const local = existsSync(dest) ? await readFile(dest, "utf8") : undefined;
    const filePlan = await planThreeWayFile({
      item,
      relPath: file.path,
      dest,
      base: snap,
      local,
      target,
      labels,
      baseVersion: record.version,
    });
    // Snapshot dest is always the composed key (new writes never go to appName).
    let snapshotDest: string | undefined;
    try {
      snapshotDest = baseSnapshotDest(cwd, composedKey, file.path);
    } catch {
      snapshotDest = undefined;
    }
    plans.push({ ...filePlan, snapshotContent: target, snapshotDest });
  }

  const installedFiles = installedFileSet(config);
  const tracked = new Set<string>([
    ...targetFiles,
    ...(await listBaseSnapshotRels(cwd, composedKey, plan.appName)),
  ]);
  for (const rel of record.files) {
    if (!installedFiles.has(rel)) tracked.add(rel);
  }
  for (const rel of tracked) {
    if (!targetFiles.includes(rel)) {
      plans.push({
        item,
        relPath: rel,
        status: "removed-upstream",
        baseVersion: record.version,
      });
    }
  }

  // Template pages may have grown a block the project never installed. Resolve
  // those items (plus transitive registry deps) so apply can write them before
  // the page that imports them. Already-installed slugs are left alone.
  const missing = plan.blockSlugs.filter((slug) => config.installed?.[slug] === undefined);
  const installItems = missing.length > 0 ? await registry.resolve(missing) : [];

  return {
    name: item,
    legacy: false,
    plans,
    targetFiles,
    composeKey: composedKey,
    installItems,
  };
}

/* -------------------------------------------------------------------------- */
/* apply + report                                                             */
/* -------------------------------------------------------------------------- */

async function askConfirmDefault(question: string): Promise<boolean> {
  if (!process.stdin.isTTY) return false;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(`${question} [y/N] `)).trim().toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

/** Human label per status, shared by console output and the report table. */
function statusLabel(plan: FilePlan): string {
  switch (plan.status) {
    case "up-to-date":
      return "up to date";
    case "fast-forward":
      return "fast-forward (no local edits)";
    case "new-file":
      return "new upstream file";
    case "local-edits":
      return "upstream unchanged — kept your edits";
    case "merged":
      return "merged cleanly (your edits + upstream)";
    case "conflict":
      return plan.markersWritten
        ? "CONFLICT (markers written — resolve manually)"
        : "CONFLICT (left untouched)";
    case "manual":
      return "CONFLICT (git unavailable — manual merge needed)";
    case "removed-upstream":
      return "removed upstream — left in place";
    case "locally-deleted":
      return "locally deleted — skipped";
    case "legacy-match":
      return "matches upstream (manifest recorded)";
    case "legacy-differs":
      return plan.overwritten
        ? "overwritten with upstream"
        : "differs (legacy install — kept; use --overwrite)";
    default:
      return plan.status;
  }
}

/**
 * saas/admin: upgrade 3-ways chrome against the catalog item (Mara) and
 * layout/team/home against the catalog compose render. After any write (or a
 * catalog file already on disk), re-apply the gold-path identity. Idempotent;
 * skipped when conflict markers are present.
 */
async function repatchGoldPathFile(
  cwd: string,
  rel: string,
  patch: (source: string) => string | undefined,
  label: string,
): Promise<void> {
  let dest: string;
  try {
    dest = resolveSafeDest(cwd, ".", rel);
  } catch {
    return;
  }
  if (!existsSync(dest)) return;
  const current = await readFile(dest, "utf8");
  if (current.includes("<<<<<<<")) return;
  const patched = patch(current);
  if (patched === undefined || patched === current) return;
  await writeFileEnsured(dest, patched);
  log.ok(`gold-path ${rel}: re-applied ${label}`);
}

function goldPathSurfaceRels(cwd: string, composed: Record<string, ComposedRecord>): string[] {
  const rels = new Set<string>();
  for (const rec of Object.values(composed)) {
    for (const file of rec.files) rels.add(file.replaceAll("\\", "/"));
  }
  for (const rel of [
    "app/(shell)/layout.tsx",
    "src/app/(shell)/layout.tsx",
    "app/(shell)/team/page.tsx",
    "src/app/(shell)/team/page.tsx",
    "app/(shell)/page.tsx",
    "src/app/(shell)/page.tsx",
  ]) {
    if (existsSync(join(cwd, rel))) rels.add(rel);
  }
  return [...rels];
}

async function repatchGoldPathSurfaces(
  cwd: string,
  config: CronusUIConfig,
  composed: Record<string, ComposedRecord>,
): Promise<void> {
  if (!Object.keys(composed).some((key) => isGoldPathTemplate(key))) return;
  const authImport = `${config.aliases.lib}/auth`;
  await repatchGoldPathFile(
    cwd,
    join(config.paths.blocks, "app-shell-chrome.tsx"),
    goldPatchAppShellChrome,
    "WorkspaceMenu / InviteMember / SessionUser",
  );
  for (const rel of goldPathSurfaceRels(cwd, composed)) {
    if (/(^|\/)\(shell\)\/layout\.tsx$/.test(rel)) {
      await repatchGoldPathFile(
        cwd,
        rel,
        (source) => goldPatchShellLayout(source, authImport),
        "session gate",
      );
    }
    if (/(^|\/)\(shell\)\/team\/page\.tsx$/.test(rel)) {
      await repatchGoldPathFile(cwd, rel, goldPatchTeamPage, "MembersPanel");
    }
    if (/(^|\/)\(shell\)\/page\.tsx$/.test(rel)) {
      await repatchGoldPathFile(cwd, rel, goldPatchHomePage, "ItemsPanel");
    }
  }
}

/** Statuses that write the planned content to disk unconditionally. */
const WRITE_STATUSES: ReadonlySet<FileStatus> = new Set(["fast-forward", "new-file", "merged"]);

function fileWasWritten(plan: FilePlan): boolean {
  return WRITE_STATUSES.has(plan.status) || plan.markersWritten === true;
}

/**
 * After a composed-page write, refresh the snapshot to the NEW UPSTREAM render
 * (not the merged local). The next upgrade's base must be "the bytes we emitted
 * last time from the template".
 */
async function refreshComposeSnapshots(items: ItemPlan[]): Promise<void> {
  for (const item of items) {
    if (item.composeKey === undefined) continue;
    for (const plan of item.plans) {
      if (!fileWasWritten(plan)) continue;
      if (plan.snapshotDest === undefined || plan.snapshotContent === undefined) continue;
      await writeFileEnsured(plan.snapshotDest, plan.snapshotContent);
    }
  }
}

/**
 * Write registry items a composed re-plan newly requires. Never overwrites an
 * existing file (same collision-safety as `add` without `--overwrite`). Returns
 * the `installed{}` records for items whose files all landed.
 */
async function installPendingBlocks(
  items: ItemPlan[],
  config: CronusUIConfig,
  cwd: string,
  version: string,
): Promise<Record<string, InstalledRecord>> {
  const next: Record<string, InstalledRecord> = {};
  const seen = new Set<string>();
  for (const item of items) {
    for (const registryItem of item.installItems ?? []) {
      if (seen.has(registryItem.name)) continue;
      seen.add(registryItem.name);
      const { written } = await writeItemFiles(registryItem, config, cwd, { overwrite: false });
      if (written.length === registryItem.files.length && written.length > 0) {
        next[registryItem.name] = { version, files: written };
        log.ok(`${pc.dim(item.name)} install ${registryItem.name}`);
      }
    }
  }
  return next;
}

/** Execute a plan: write files, asking before conflict markers / overwrites. */
async function applyPlans(
  items: ItemPlan[],
  options: UpgradeOptions,
  confirm: (question: string) => Promise<boolean>,
): Promise<number> {
  let written = 0;
  for (const item of items) {
    for (const plan of item.plans) {
      if (plan.dest === undefined || plan.content === undefined) continue;
      if (WRITE_STATUSES.has(plan.status)) {
        await writeFileEnsured(plan.dest, plan.content);
        written += 1;
      } else if (plan.status === "conflict") {
        const ok =
          options.yes === true ||
          (await confirm(`Write ${plan.relPath} WITH conflict markers for manual resolution?`));
        if (ok) {
          await writeFileEnsured(plan.dest, plan.content);
          plan.markersWritten = true;
          written += 1;
        }
      } else if (plan.status === "legacy-differs" && options.overwrite === true) {
        const ok =
          options.yes === true ||
          (await confirm(`Overwrite ${plan.relPath} with upstream? Your local edits are lost.`));
        if (ok) {
          await writeFileEnsured(plan.dest, plan.content);
          plan.overwritten = true;
          written += 1;
        }
      }
    }
  }
  return written;
}

/** True when every file landed in a state that embodies the target version. */
function itemFullyUpgraded(item: ItemPlan): boolean {
  if (item.legacy) {
    return item.plans.every(
      (p) => p.status === "legacy-match" || p.status === "new-file" || p.overwritten === true,
    );
  }
  return item.plans.every(
    (p) => p.status !== "manual" && (p.status !== "conflict" || p.markersWritten === true),
  );
}

/** A file the report should carry an agent prompt for. */
function needsAttention(plan: FilePlan): boolean {
  return (
    plan.status === "conflict" ||
    plan.status === "manual" ||
    (plan.status === "legacy-differs" && plan.overwritten !== true)
  );
}

/**
 * Ready-to-paste prompt for a coding agent (Claude Code, Cursor, …) to finish
 * one file's merge. Deliberately provider-agnostic: it is plain text plus the
 * base→upstream diff, so any agent — or a patient human — can act on it.
 */
function agentPrompt(plan: FilePlan, targetVersion: string): string {
  const target = labelFor(targetVersion);
  const diffBlock =
    plan.upstreamDiff !== undefined
      ? `\`\`\`diff\n${plan.upstreamDiff}\n\`\`\``
      : `\`\`\`\n${(plan.targetContent ?? "").trimEnd()}\n\`\`\``;

  if (plan.status === "legacy-differs") {
    return [
      `2-way merge \`${plan.relPath}\` (Cronus UI item "${plan.item}", upgrading to ${target}).`,
      "This component predates install manifests, so there is no recorded base version.",
      "The file on disk is my edited copy. Apply the upstream changes below onto it,",
      "keeping my local intent (naming, added props, styling tweaks) and adopting the",
      "upstream fixes. Do not reformat unrelated code.",
      "",
      plan.upstreamDiff !== undefined
        ? "Upstream change (my local file → upstream):"
        : "Full upstream version of the file:",
      "",
      diffBlock,
    ].join("\n");
  }

  const base = labelFor(plan.baseVersion ?? "unknown");
  const intro = `3-way merge \`${plan.relPath}\` (Cronus UI item "${plan.item}", ${base} → ${target}).`;
  const state =
    plan.markersWritten === true
      ? [
          "The file on disk contains git diff3 conflict markers:",
          "- `<<<<<<< LOCAL (your edits)` … my customized version — KEEP my local intent.",
          `- \`||||||| BASE (${base})\` … the version I originally installed.`,
          `- \`>>>>>>> UPSTREAM (${target})\` … the new version — ADOPT its fixes.`,
          "Merge both sides and remove every marker: re-apply my customizations on top",
          "of the upstream structure. Do not reformat unrelated code.",
        ]
      : [
          "The file on disk is my unmodified local copy (no conflict markers were written).",
          "Apply the upstream change below onto it, keeping my local edits intact and",
          "adopting the upstream fixes. Do not reformat unrelated code.",
        ];
  const reference =
    plan.upstreamDiff !== undefined
      ? "For reference, the upstream change (base → upstream) is:"
      : "git was unavailable, so here is the FULL upstream version to merge against:";

  return [intro, "", ...state, "", reference, "", diffBlock].join("\n");
}

/** Build CRONUS-UPGRADE.md: status table + one agent prompt per pending file. */
function buildReport(items: ItemPlan[], targetVersion: string): string {
  const rows = items.flatMap((item) =>
    item.plans.map((plan) => `| ${plan.item} | \`${plan.relPath}\` | ${statusLabel(plan)} |`),
  );
  const pending = items.flatMap((item) => item.plans.filter(needsAttention));

  const sections = pending.map((plan) =>
    [
      `### \`${plan.relPath}\` (${plan.item})`,
      "",
      "Copy-paste this prompt into your coding agent:",
      "",
      "````text",
      agentPrompt(plan, targetVersion),
      "````",
    ].join("\n"),
  );

  return [
    "# Cronus UI upgrade report",
    "",
    `- Generated by \`cronus-ui upgrade\` on ${new Date().toISOString()}`,
    `- Upgrade target: registry v${targetVersion}`,
    "- This file is safe to delete once every conflict below is resolved.",
    "",
    "## File status",
    "",
    "| Item | File | Status |",
    "| --- | --- | --- |",
    ...rows,
    "",
    "## Files needing attention",
    "",
    sections.length > 0 ? sections.join("\n\n") : "None — everything merged cleanly.",
    "",
  ].join("\n");
}

/* -------------------------------------------------------------------------- */
/* command                                                                    */
/* -------------------------------------------------------------------------- */

/** Resolve which item names this run should process. */
async function resolveTargets(
  names: string[],
  options: UpgradeOptions,
  installed: Record<string, InstalledRecord>,
  registry: Registry,
  config: CronusUIConfig,
  cwd: string,
): Promise<string[] | undefined> {
  if (names.length > 0) {
    // Same typo guard as `add`: validate against the index when reachable.
    try {
      const available = (await registry.index()).map((i) => i.name);
      const known = new Set(available);
      const unknown = names.filter((name) => !known.has(name));
      if (unknown.length > 0) {
        for (const name of unknown) {
          const suggestion = closestName(name, available);
          log.err(
            suggestion
              ? `Unknown item "${name}". Did you mean "${suggestion}"?`
              : `Unknown item "${name}".`,
          );
        }
        process.exitCode = 1;
        return undefined;
      }
    } catch {
      // Index unavailable — defer failures to the per-item fetch below.
    }
    return [...new Set(names)];
  }

  if (options.all !== true) {
    log.err("Specify component names or use --all, e.g. `cronus-ui upgrade button` .");
    process.exitCode = 1;
    return undefined;
  }

  const manifestNames = Object.keys(installed);
  if (manifestNames.length > 0) return manifestNames;

  // Pre-manifest project: adopt what is on disk by scanning the registry index
  // for items with at least one locally present file (mirrors `diff`).
  log.step("No install manifest found — scanning the registry for locally installed items…");
  const found: string[] = [];
  for (const entry of await registry.index()) {
    let item: RegistryItem;
    try {
      item = await registry.item(entry.name);
    } catch {
      continue;
    }
    const present = item.files.some((file) => {
      try {
        return existsSync(fileDest(config, cwd, file).dest);
      } catch {
        return false;
      }
    });
    if (present) found.push(entry.name);
  }
  return found;
}

/**
 * `cronus-ui upgrade` — pull upstream component (and, with `--all`, composed
 * page) updates WITHOUT losing local edits. For every target it 3-way merges
 * base, local, and upstream via `git merge-file --diff3`. Conflicts are never
 * silently clobbered: markers are only written with consent, and
 * CRONUS-UPGRADE.md gets a ready-to-paste agent prompt per unresolved file.
 */
export async function upgrade(names: string[], options: UpgradeOptions): Promise<void> {
  const { cwd } = options;
  if (!hasConfig(cwd)) {
    log.err("No cronus-ui.json found. Run `cronus-ui init` first.");
    process.exitCode = 1;
    return;
  }
  const config = await readConfig(cwd);
  // Target = the registry at the RUNNING CLI's release. A cronus-ui.json written
  // by an older CLI still carries its old pinned URL, so re-pin it; an explicit
  // --registry is respected verbatim.
  const targetSource =
    options.registry ?? registrySourceAtVersion(config.registry, CLI_VERSION) ?? config.registry;
  const targetVersion = registrySourceVersion(targetSource) ?? CLI_VERSION;
  const targetRegistry = new Registry(targetSource);
  const installed: Record<string, InstalledRecord> = { ...config.installed };
  const composed: Record<string, ComposedRecord> = { ...config.composed };
  const composedKeys = Object.keys(composed).sort();
  const upgradeComposed = options.all === true && composedKeys.length > 0;
  const confirm = options.confirm ?? askConfirmDefault;

  const targets = await resolveTargets(names, options, installed, targetRegistry, config, cwd);
  if (targets === undefined) return;
  if (targets.length === 0 && !upgradeComposed) {
    log.title("Nothing to upgrade — no installed components found.");
    return;
  }

  log.title(
    `${options.dryRun === true ? "Upgrade plan (dry-run)" : "Upgrading"} → registry v${targetVersion}`,
  );

  const baseRegistries = new Map<string, Registry>();
  const itemPlans: ItemPlan[] = [];

  for (const name of targets) {
    let targetItem: RegistryItem;
    try {
      targetItem = await targetRegistry.item(name);
    } catch {
      log.warn(`${name}: not in registry v${targetVersion} — skipped.`);
      continue;
    }

    const record = installed[name];
    let baseItem: RegistryItem | undefined;
    let baseVersion: string | undefined;
    if (record !== undefined) {
      if (record.version === targetVersion) {
        baseItem = targetItem; // same release → base and upstream coincide
        baseVersion = record.version;
      } else {
        const baseSource = registrySourceAtVersion(targetSource, record.version);
        if (baseSource === undefined) {
          log.warn(
            `${name}: registry source is not release-pinned, cannot fetch v${record.version} as merge base — falling back to a 2-way diff.`,
          );
        } else {
          let baseRegistry = baseRegistries.get(baseSource);
          if (baseRegistry === undefined) {
            baseRegistry = new Registry(baseSource);
            baseRegistries.set(baseSource, baseRegistry);
          }
          try {
            baseItem = await baseRegistry.item(name);
            baseVersion = record.version;
          } catch {
            log.warn(
              `${name}: version v${record.version} registry not found — was it published? Falling back to a 2-way diff.`,
            );
          }
        }
      }
    }

    const itemPlan =
      baseItem !== undefined && baseVersion !== undefined
        ? await planManifestItem({
            name,
            config,
            cwd,
            baseItem,
            targetItem,
            baseVersion,
            targetVersion,
          })
        : await planLegacyItem({ name, config, cwd, targetItem, targetVersion });
    itemPlans.push(itemPlan);
  }

  // Composed pages: plan after components, fail loud before any write.
  if (upgradeComposed) {
    try {
      for (const key of composedKeys) {
        const record = composed[key];
        if (record === undefined) continue;
        itemPlans.push(
          await planComposedApp({
            composedKey: key,
            record,
            config,
            cwd,
            registry: targetRegistry,
            targetVersion,
            manifestPath: options.manifestPath,
          }),
        );
      }
    } catch (err) {
      log.err((err as Error).message);
      process.exitCode = 1;
      return;
    }
  }

  if (itemPlans.length === 0) {
    log.title("Nothing to upgrade.");
    return;
  }

  if (options.dryRun === true) {
    printPlan(itemPlans);
    return;
  }

  // Install newly required blocks BEFORE writing pages that import them.
  const newlyInstalled = await installPendingBlocks(itemPlans, config, cwd, targetVersion);
  Object.assign(installed, newlyInstalled);

  const written = await applyPlans(itemPlans, options, confirm);
  await repatchGoldPathSurfaces(cwd, config, composed);
  await refreshComposeSnapshots(itemPlans);

  // Manifest: record every item that now fully embodies the target release.
  // Compose items update `composed{}` (never `installed{}`) and never drop
  // add-page files from the tracked set.
  let manifestChanged = false;
  for (const item of itemPlans) {
    if (item.composeKey !== undefined) {
      const rec = composed[item.composeKey];
      if (rec === undefined) continue;
      const writtenRels = item.plans.filter(fileWasWritten).map((p) => p.relPath);
      const files = [...new Set([...rec.files, ...item.targetFiles, ...writtenRels])].sort();
      const version = itemFullyUpgraded(item) ? targetVersion : rec.version;
      composed[item.composeKey] = { ...rec, files, version };
      manifestChanged = true;
      continue;
    }
    if (!itemFullyUpgraded(item)) continue;
    installed[item.name] = { version: targetVersion, files: item.targetFiles };
    manifestChanged = true;
  }
  if (manifestChanged) {
    await writeConfig(cwd, { ...config, installed, composed });
  }

  for (const item of itemPlans) {
    for (const plan of item.plans) {
      const line = `${pc.dim(plan.item)} ${plan.relPath}: ${statusLabel(plan)}`;
      if (needsAttention(plan)) log.warn(line);
      else log.ok(line);
    }
  }

  const pending = itemPlans.flatMap((item) => item.plans.filter(needsAttention));
  if (pending.length > 0) {
    const reportPath = join(cwd, REPORT_FILE);
    await writeFile(reportPath, buildReport(itemPlans, targetVersion), "utf8");
    log.title(`${pending.length} file(s) need attention — see ${REPORT_FILE}`);
    log.step("Each one has a ready-to-paste agent prompt (Claude Code, Cursor, …) in the report.");
  } else {
    log.title(`Done — ${written} file(s) written, everything merged cleanly.`);
  }
}

/** Dry-run output: one line per file plus a status tally. Writes nothing. */
function printPlan(items: ItemPlan[]): void {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const plan of item.plans) {
      const label = plan.status === "conflict" ? "CONFLICT" : statusLabel(plan);
      counts.set(label, (counts.get(label) ?? 0) + 1);
      const line = `${pc.dim(plan.item)} ${plan.relPath}: ${label}`;
      if (needsAttention(plan)) log.warn(line);
      else log.step(line);
    }
    for (const registryItem of item.installItems ?? []) {
      log.step(`${pc.dim(item.name)} would install ${registryItem.name}`);
    }
  }
  const tally = [...counts.entries()].map(([label, count]) => `${count} ${label}`).join(", ");
  log.title(`Plan: ${tally}. Nothing written (dry-run).`);
}
