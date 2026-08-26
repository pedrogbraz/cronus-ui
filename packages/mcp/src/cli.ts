import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { SERVER_VERSION } from "./version.js";

/**
 * The pinned CLI spec the write tools execute. The MCP server and the CLI are
 * released in lockstep from the same repo tag, so pinning `kronus-ui` to the
 * server's own version guarantees the spawned CLI resolves items from the same
 * registry release the read tools describe.
 */
export const PINNED_CLI = `kronus-ui@${SERVER_VERSION}`;

/** Default wall-clock budget for one CLI run (registry fetch + npm install). */
export const DEFAULT_CLI_TIMEOUT_MS = 120_000;

/**
 * Launcher command lines to try, in order. Each entry is an argv prefix the
 * CLI subcommand args are appended to.
 *
 * - `KRONUS_MCP_CLI_CMD` (whitespace-split, e.g. "bun /repo/packages/cli/src/index.ts")
 *   replaces the launchers entirely — used by tests and local development.
 *   Paths containing spaces are not supported in this seam.
 * - Otherwise: `bunx --bun kronus-ui@<version>`, falling back to
 *   `npx -y kronus-ui@<version>` when `bunx` is not installed.
 */
export function resolveCliInvocations(env: NodeJS.ProcessEnv = process.env): string[][] {
  const seam = env.KRONUS_MCP_CLI_CMD?.trim();
  if (seam) return [seam.split(/\s+/)];
  return [
    ["bunx", "--bun", PINNED_CLI],
    ["npx", "-y", PINNED_CLI],
  ];
}

/** The per-run timeout, honouring the `KRONUS_MCP_CLI_TIMEOUT_MS` override. */
export function resolveCliTimeoutMs(env: NodeJS.ProcessEnv = process.env): number {
  const raw = env.KRONUS_MCP_CLI_TIMEOUT_MS?.trim();
  if (!raw) return DEFAULT_CLI_TIMEOUT_MS;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_CLI_TIMEOUT_MS;
}

/** Where a write tool operates: the detected consumer project root. */
export interface ProjectRoot {
  dir: string;
  /** Whether `kronus-ui.json` (the CLI's own config) was found there. */
  hasKronusConfig: boolean;
}

/**
 * Detect the consumer project root by walking up from `startDir`:
 * the nearest directory containing `kronus-ui.json` wins (that is where the CLI
 * must run); otherwise the nearest directory containing `package.json`.
 * Returns undefined when neither exists anywhere up the tree.
 */
export function findProjectRoot(startDir: string = process.cwd()): ProjectRoot | undefined {
  let dir = resolve(startDir);
  let packageJsonDir: string | undefined;
  for (;;) {
    if (existsSync(join(dir, "kronus-ui.json"))) return { dir, hasKronusConfig: true };
    if (packageJsonDir === undefined && existsSync(join(dir, "package.json"))) {
      packageJsonDir = dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return packageJsonDir === undefined ? undefined : { dir: packageJsonDir, hasKronusConfig: false };
}

/** Options shared by {@link runCli} and the write-tool entry points. */
export interface CliRunOptions {
  /** Directory to detect the project from (default: `process.cwd()`). */
  cwd?: string;
  /** Wall-clock budget for the child process. */
  timeoutMs?: number;
  /** Environment consulted for the launcher/timeout/registry seams. */
  env?: NodeJS.ProcessEnv;
  /** Explicit launcher argv prefixes (tests); overrides the env seam. */
  candidates?: string[][];
}

/** The raw outcome of one CLI child process. */
export interface CliRunResult {
  /** The exact command line that ran, for transparency in tool output. */
  command: string;
  exitCode: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
}

function spawnOnce(argv: string[], cwd: string, timeoutMs: number): Promise<CliRunResult> {
  return new Promise((resolvePromise, reject) => {
    const [command = "", ...args] = argv;
    const child = spawn(command, args, {
      cwd,
      // NO_COLOR keeps picocolors output plain so the result parsers see the
      // literal `✔ Added <path>` lines. stdin is closed: the CLI surface used
      // here is non-interactive, so nothing may wait on input.
      env: { ...process.env, NO_COLOR: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolvePromise({ command: argv.join(" "), exitCode: code, timedOut, stdout, stderr });
    });
  });
}

/**
 * Run one `kronus-ui` CLI invocation with the given subcommand args, trying
 * each launcher candidate in order (a missing launcher binary — ENOENT — moves
 * on to the next; any other spawn failure is thrown as-is).
 */
export async function runCli(
  subArgs: string[],
  options: { cwd: string } & Omit<CliRunOptions, "cwd">,
): Promise<CliRunResult> {
  const env = options.env ?? process.env;
  const candidates = options.candidates ?? resolveCliInvocations(env);
  const timeoutMs = options.timeoutMs ?? resolveCliTimeoutMs(env);
  for (const prefix of candidates) {
    try {
      return await spawnOnce([...prefix, ...subArgs], options.cwd, timeoutMs);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw error;
    }
  }
  const tried = candidates.map((c) => c[0]).join(", ");
  throw new Error(
    `Could not launch the kronus-ui CLI — none of the launchers exist on PATH (tried: ${tried}). ` +
      "Install bun or node/npm, or point KRONUS_MCP_CLI_CMD at a runnable CLI.",
  );
}

/** How a completed CLI run is classified in tool output. */
export type RunStatus = "success" | "failed" | "timeout";

function classify(run: CliRunResult): RunStatus {
  if (run.timedOut) return "timeout";
  return run.exitCode === 0 ? "success" : "failed";
}

// Defensive: NO_COLOR should already keep the output plain, but a consumer
// env forcing color must not break parsing.
// biome-ignore lint/suspicious/noControlCharactersInRegex: matching the ESC character is the whole point — this strips ANSI SGR color sequences.
const ANSI_PATTERN = /\u001B\[[0-9;]*m/g;

/** Strip ANSI SGR color sequences from CLI output. */
export function stripAnsi(text: string): string {
  return text.replace(ANSI_PATTERN, "");
}

/** What `kronus-ui add` reported doing, extracted from its output. */
export interface ParsedAddOutput {
  /** Project-relative paths written this run (components, blocks, lib files). */
  installedFiles: string[];
  /** Paths that already existed and were left untouched (use overwrite). */
  skippedFiles: string[];
  dependencies: {
    /** True when the CLI ran the package-manager install successfully. */
    installed: boolean;
    /** npm specs still to be installed manually (skip/failed install). */
    pending: string[];
  };
}

/** Parse the `kronus-ui add` log lines into a structured summary. */
export function parseAddOutput(stdout: string): ParsedAddOutput {
  const installedFiles: string[] = [];
  const skippedFiles: string[] = [];
  let installed = false;
  let pending: string[] = [];
  for (const raw of stripAnsi(stdout).split("\n")) {
    const line = raw.trim();
    const added = line.match(/^✔ Added (.+)$/);
    if (added?.[1]) {
      installedFiles.push(added[1]);
      continue;
    }
    const skipped = line.match(/^⚠ Skipped (.+) \(exists/);
    if (skipped?.[1]) {
      skippedFiles.push(skipped[1]);
      continue;
    }
    if (line === "✔ Installed dependencies") {
      installed = true;
      continue;
    }
    // `--skip-install` prints "Dependencies to install:"; a failed install
    // prints "Install manually: <pm> add <specs>". Either way the specs are
    // still pending in the consumer project.
    const manual = line.match(/^› Install manually: \S+ add (.+)$/);
    const toInstall = manual ?? line.match(/^› Dependencies to install: (.+)$/);
    if (toInstall?.[1]) pending = toInstall[1].split(/\s+/);
  }
  return { installedFiles, skippedFiles, dependencies: { installed, pending } };
}

/** What `kronus-ui theme add` reported doing, extracted from its output. */
export interface ParsedThemeOutput {
  /** Completed writes ("Updated app/layout.tsx …", "Wrote the override block …"). */
  changes: string[];
  /** Dry-run plan lines ("Would update …", "Would write …"). */
  planned: string[];
  /** Warnings (e.g. no layout mounting the theme runtime was found). */
  warnings: string[];
}

/** Parse the `kronus-ui theme add` log lines into a structured summary. */
export function parseThemeOutput(stdout: string): ParsedThemeOutput {
  const changes: string[] = [];
  const planned: string[] = [];
  const warnings: string[] = [];
  for (const raw of stripAnsi(stdout).split("\n")) {
    const line = raw.trim();
    if (line.startsWith("✔ ")) changes.push(line.slice(2));
    else if (line.startsWith("› Would ")) planned.push(line.slice(2));
    else if (line.startsWith("⚠ ")) warnings.push(line.slice(2));
  }
  return { changes, planned, warnings };
}

/**
 * Registry item names are slugs. Anything else is rejected before it reaches
 * the child argv, so a name can never be smuggled in as a CLI flag.
 */
const ITEM_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*$/i;

function collectItemNames(names: string[]): string[] {
  const cleaned: string[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    const name = raw.trim();
    if (name.length === 0 || seen.has(name)) continue;
    if (!ITEM_NAME_PATTERN.test(name)) {
      throw new Error(
        `Invalid registry item name: "${name}". Names are slugs like "button" or "data-table".`,
      );
    }
    seen.add(name);
    cleaned.push(name);
  }
  return cleaned;
}

function cleanItemNames(names: string[]): string[] {
  const cleaned = collectItemNames(names);
  if (cleaned.length === 0) {
    throw new Error("Provide at least one component or block name.");
  }
  return cleaned;
}

function requireProjectRoot(cwd: string | undefined): ProjectRoot {
  const start = cwd ?? process.cwd();
  const root = findProjectRoot(start);
  if (!root) {
    throw new Error(
      `Not inside a project: no kronus-ui.json or package.json found walking up from ${resolve(start)}. ` +
        "Start the MCP server inside the consumer project (its package.json directory), " +
        "and run `npx kronus-ui init` there once to create kronus-ui.json.",
    );
  }
  return root;
}

/** Input accepted by the `install_component` tool. */
export interface InstallComponentInput {
  names: string[];
  overwrite?: boolean;
  /** Write the files but skip the package-manager install of npm deps. */
  skipInstall?: boolean;
}

/** Structured result returned by the `install_component` tool. */
export interface InstallComponentResult extends ParsedAddOutput {
  status: RunStatus;
  projectRoot: string;
  command: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Install registry items into the consumer project by running the pinned
 * `kronus-ui add` CLI at the detected project root.
 */
export async function installComponent(
  input: InstallComponentInput,
  options: CliRunOptions = {},
): Promise<InstallComponentResult> {
  const names = cleanItemNames(input.names);
  const root = requireProjectRoot(options.cwd);
  const env = options.env ?? process.env;

  const args = ["add", ...names];
  if (input.overwrite) args.push("--overwrite");
  if (input.skipInstall) args.push("--skip-install");
  // Keep the CLI on the same registry the read tools describe when the server
  // was started with a registry override.
  const registry = env.KRONUS_UI_REGISTRY?.trim();
  if (registry) args.push("--registry", registry);

  const run = await runCli(args, { ...options, cwd: root.dir, env });
  return {
    status: classify(run),
    projectRoot: root.dir,
    command: run.command,
    exitCode: run.exitCode,
    ...parseAddOutput(run.stdout),
    stdout: run.stdout,
    stderr: run.stderr,
  };
}

/** Input accepted by the `apply_theme` tool. */
export interface ApplyThemeInput {
  source: string;
  dryRun?: boolean;
}

/** Structured result returned by the `apply_theme` tool. */
export interface ApplyThemeResult extends ParsedThemeOutput {
  status: RunStatus;
  dryRun: boolean;
  projectRoot: string;
  command: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Apply a Create Studio theme to the consumer project by running the pinned
 * `kronus-ui theme add` CLI at the detected project root.
 */
export async function applyTheme(
  input: ApplyThemeInput,
  options: CliRunOptions = {},
): Promise<ApplyThemeResult> {
  const source = input.source.trim();
  if (source.length === 0) {
    throw new Error("Provide a theme source: a Create Studio permalink or a theme JSON file path.");
  }
  if (source.startsWith("-")) {
    throw new Error(`Invalid theme source: "${source}" (must not look like a CLI flag).`);
  }
  const root = requireProjectRoot(options.cwd);
  const dryRun = input.dryRun === true;

  const args = ["theme", "add", source];
  if (dryRun) args.push("--dry-run");

  const run = await runCli(args, { ...options, cwd: root.dir });
  return {
    status: classify(run),
    dryRun,
    projectRoot: root.dir,
    command: run.command,
    exitCode: run.exitCode,
    ...parseThemeOutput(run.stdout),
    stdout: run.stdout,
    stderr: run.stderr,
  };
}

/** Bundled compose templates the `compose_app` tool accepts. */
export const COMPOSE_TEMPLATES = ["store", "landing", "saas", "mail", "chat", "finance"] as const;
export type ComposeTemplate = (typeof COMPOSE_TEMPLATES)[number];

/** Baked-in presets the `set_theme` tool accepts. */
export const THEME_PRESETS = ["aurora", "neutral", "midnight", "sunset", "emerald"] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];

/** Color modes the `set_theme` tool accepts. */
export const THEME_MODES = ["dark", "light"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/**
 * Capture `✔` / `⚠` / `›` CLI lines as opaque notes. Compose and add-page logs
 * are not the `✔ Added` shape {@link parseAddOutput} expects; this is the
 * generic fallback so we never invent a fragile per-command parser.
 */
export function parseNotes(stdout: string): string[] {
  const notes: string[] = [];
  for (const raw of stripAnsi(stdout).split("\n")) {
    const line = raw.trim();
    if (line.startsWith("✔ ") || line.startsWith("⚠ ") || line.startsWith("› ")) {
      notes.push(line);
    }
  }
  return notes;
}

function looksLikeFlag(value: string): boolean {
  return value.startsWith("-");
}

/** Trim and reject values that would be parsed as extra CLI flags. Empty → undefined. */
function optionalNonFlag(raw: string | undefined, label: string): string | undefined {
  if (raw === undefined) return undefined;
  const value = raw.trim();
  if (value.length === 0) return undefined;
  if (looksLikeFlag(value)) {
    throw new Error(`Invalid ${label}: "${raw}" (must not look like a CLI flag).`);
  }
  return value;
}

/**
 * Path for `--manifest`. Trim, empty → undefined. Reject flags, `--`, and
 * whitespace so the value cannot split argv. Does not fetch URLs or read the
 * file — the CLI does that.
 *
 * Custom compose apps whose `composed{}.manifestHash` does not match a bundled
 * template must re-supply the file (same contract as CLI add-page/upgrade).
 */
function cleanManifestPath(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  const value = raw.trim();
  if (value.length === 0) return undefined;
  if (looksLikeFlag(value) || value.includes("--") || /\s/.test(value)) {
    throw new Error(`Invalid manifest: "${raw}" (must not look like a CLI flag).`);
  }
  return value;
}

function appendRegistry(args: string[], env: NodeJS.ProcessEnv): void {
  const registry = env.KRONUS_UI_REGISTRY?.trim();
  if (registry) args.push("--registry", registry);
}

function isBlockRefToken(item: string): boolean {
  const eq = item.indexOf("=");
  if (eq === -1) return ITEM_NAME_PATTERN.test(item);
  return ITEM_NAME_PATTERN.test(item.slice(0, eq)) && ITEM_NAME_PATTERN.test(item.slice(eq + 1));
}

/**
 * `--variant` tokens are `slug=id` (same slug/id alphabet as add-page block
 * refs). Flags (`-`, `--`) are rejected so a token can never smuggle extra argv.
 */
function cleanVariantTokens(raw: string[] | undefined): string[] {
  if (raw === undefined) return [];
  const cleaned: string[] = [];
  for (const token of raw) {
    const item = token.trim();
    if (item.length === 0) continue;
    if (looksLikeFlag(item) || item.includes("--")) {
      throw new Error(`Invalid variant: "${token}" (must not look like a CLI flag).`);
    }
    const eq = item.indexOf("=");
    if (eq === -1 || /\s/.test(item) || !isBlockRefToken(item)) {
      throw new Error(`Invalid variant "${item}". Use slug=id (e.g. "login=split").`);
    }
    cleaned.push(item);
  }
  return cleaned;
}

/** Input accepted by the `compose_app` tool. */
export interface ComposeAppInput {
  template: ComposeTemplate;
  brand?: string;
  dryRun?: boolean;
  /** Non-interactive (`-y`). Defaults to true so agents never hang on a prompt. */
  yes?: boolean;
  /** Write the files but skip the package-manager install of npm deps. */
  skipInstall?: boolean;
  /** Overwrite files that already exist (`--overwrite`). */
  overwrite?: boolean;
  /** Block variant selections as `slug=id` tokens (each becomes `--variant <token>`). */
  variant?: string[];
}

/** Structured result returned by the `compose_app` tool. */
export interface ComposeAppResult {
  status: RunStatus;
  dryRun: boolean;
  projectRoot: string;
  command: string;
  exitCode: number | null;
  /** `✔` / `⚠` / `›` lines from the CLI log. */
  notes: string[];
  stdout: string;
  stderr: string;
}

/**
 * Compose a full app from a validated template by running the pinned
 * `kronus-ui compose` CLI at the detected project root.
 */
export async function composeApp(
  input: ComposeAppInput,
  options: CliRunOptions = {},
): Promise<ComposeAppResult> {
  const template = input.template.trim();
  if (!(COMPOSE_TEMPLATES as readonly string[]).includes(template) || looksLikeFlag(template)) {
    throw new Error(
      `Invalid compose template: "${input.template}". Use one of: ${COMPOSE_TEMPLATES.join(", ")}.`,
    );
  }
  const brand = optionalNonFlag(input.brand, "brand");
  const variants = cleanVariantTokens(input.variant);
  const root = requireProjectRoot(options.cwd);
  const env = options.env ?? process.env;
  const dryRun = input.dryRun === true;
  const yes = input.yes !== false;

  const args = ["compose", template];
  if (yes) args.push("-y");
  if (brand !== undefined) args.push("--brand", brand);
  if (dryRun) args.push("--dry-run");
  if (input.overwrite) args.push("--overwrite");
  if (input.skipInstall) args.push("--skip-install");
  for (const token of variants) {
    args.push("--variant", token);
  }
  appendRegistry(args, env);

  const run = await runCli(args, { ...options, cwd: root.dir, env });
  return {
    status: classify(run),
    dryRun,
    projectRoot: root.dir,
    command: run.command,
    exitCode: run.exitCode,
    notes: parseNotes(run.stdout),
    stdout: run.stdout,
    stderr: run.stderr,
  };
}

function cleanBlocksSpec(raw: string): string {
  const spec = raw.trim();
  if (spec.length === 0) {
    throw new Error(
      'Provide at least one block slug (comma-separated), e.g. "pricing,cta" or "login=split".',
    );
  }
  if (looksLikeFlag(spec) || spec.includes("--")) {
    throw new Error(`Invalid blocks spec: "${raw}" (must not look like a CLI flag).`);
  }
  const cleaned: string[] = [];
  for (const token of spec.split(",")) {
    const item = token.trim();
    if (item.length === 0) {
      throw new Error(`Invalid --blocks token "${token}" (empty).`);
    }
    if (/\s/.test(item) || item.includes("--") || looksLikeFlag(item) || !isBlockRefToken(item)) {
      throw new Error(
        `Invalid --blocks token "${item}". Use slugs or slug=variant ` +
          '(e.g. "faq,cta" or "login=split").',
      );
    }
    cleaned.push(item);
  }
  return cleaned.join(",");
}

function cleanRoute(raw: string): string {
  const route = raw.trim();
  if (
    route.length === 0 ||
    !route.startsWith("/") ||
    looksLikeFlag(route) ||
    route.includes("--")
  ) {
    throw new Error(
      `Invalid route: "${raw}". Routes start with "/" (e.g. "/pricing") and ` +
        "must not look like a CLI flag.",
    );
  }
  return route;
}

/** Input accepted by the `add_page` tool. */
export interface AddPageInput {
  route: string;
  /** Comma-separated block slugs, or `slug=variant` tokens. */
  blocks: string;
  nav?: string;
  title?: string;
  chrome?: string;
  /**
   * Composed app key (`--app`). Required when the project has more than one
   * composed app.
   */
  app?: string;
  dryRun?: boolean;
  skipInstall?: boolean;
  overwrite?: boolean;
  /**
   * Path to the compose manifest (`--manifest`). Custom compose apps whose
   * `composed{}.manifestHash` does not match a bundled template must re-supply
   * the file (same contract as CLI add-page/upgrade).
   */
  manifest?: string;
}

/** Structured result returned by the `add_page` tool. */
export interface AddPageResult {
  status: RunStatus;
  dryRun: boolean;
  projectRoot: string;
  command: string;
  exitCode: number | null;
  notes: string[];
  stdout: string;
  stderr: string;
}

/**
 * Add one page to an already-composed app by running the pinned
 * `kronus-ui add-page` CLI at the detected project root.
 */
export async function addPage(
  input: AddPageInput,
  options: CliRunOptions = {},
): Promise<AddPageResult> {
  const route = cleanRoute(input.route);
  const blocks = cleanBlocksSpec(input.blocks);
  const nav = optionalNonFlag(input.nav, "nav");
  const title = optionalNonFlag(input.title, "title");
  const chrome = optionalNonFlag(input.chrome, "chrome");
  const app = optionalNonFlag(input.app, "app");
  const manifest = cleanManifestPath(input.manifest);
  const root = requireProjectRoot(options.cwd);
  const env = options.env ?? process.env;
  const dryRun = input.dryRun === true;

  const args = ["add-page", "--route", route, "--blocks", blocks];
  if (nav !== undefined) args.push("--nav", nav);
  if (title !== undefined) args.push("--title", title);
  if (chrome !== undefined) args.push("--chrome", chrome);
  if (app !== undefined) args.push("--app", app);
  if (dryRun) args.push("--dry-run");
  if (input.overwrite) args.push("--overwrite");
  if (input.skipInstall) args.push("--skip-install");
  if (manifest !== undefined) args.push("--manifest", manifest);
  appendRegistry(args, env);

  const run = await runCli(args, { ...options, cwd: root.dir, env });
  return {
    status: classify(run),
    dryRun,
    projectRoot: root.dir,
    command: run.command,
    exitCode: run.exitCode,
    notes: parseNotes(run.stdout),
    stdout: run.stdout,
    stderr: run.stderr,
  };
}

/** Input accepted by the `set_theme` tool. */
export interface SetThemeInput {
  name: ThemePreset;
  mode?: ThemeMode;
}

/** Structured result returned by the `set_theme` tool. */
export interface SetThemeResult extends ParsedThemeOutput {
  status: RunStatus;
  projectRoot: string;
  command: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Switch a baked-in theme preset by running the pinned `kronus-ui theme set`
 * CLI at the detected project root. Create Studio permalinks use {@link applyTheme}.
 */
export async function setTheme(
  input: SetThemeInput,
  options: CliRunOptions = {},
): Promise<SetThemeResult> {
  const name = input.name.trim();
  if (!(THEME_PRESETS as readonly string[]).includes(name) || looksLikeFlag(name)) {
    throw new Error(`Unknown theme "${input.name}". Choose one of: ${THEME_PRESETS.join(", ")}.`);
  }
  let mode: string | undefined;
  if (input.mode !== undefined) {
    mode = input.mode.trim();
    if (!(THEME_MODES as readonly string[]).includes(mode) || looksLikeFlag(mode)) {
      throw new Error(`Invalid mode "${input.mode}". Choose "dark" or "light".`);
    }
  }
  const root = requireProjectRoot(options.cwd);

  const args = ["theme", "set", name];
  if (mode !== undefined) args.push("--mode", mode);

  const run = await runCli(args, { ...options, cwd: root.dir });
  return {
    status: classify(run),
    projectRoot: root.dir,
    command: run.command,
    exitCode: run.exitCode,
    ...parseThemeOutput(run.stdout),
    stdout: run.stdout,
    stderr: run.stderr,
  };
}

/** Input accepted by the `upgrade_components` tool. */
export interface UpgradeComponentsInput {
  names?: string[];
  /** Upgrade every installed component (`--all`). Default when `names` is empty. */
  all?: boolean;
  dryRun?: boolean;
  yes?: boolean;
  /**
   * Path to the compose manifest (`--manifest`). Custom compose apps whose
   * `composed{}.manifestHash` does not match a bundled template must re-supply
   * the file (same contract as CLI add-page/upgrade).
   */
  manifest?: string;
}

/** Structured result returned by the `upgrade_components` tool. */
export interface UpgradeComponentsResult {
  status: RunStatus;
  dryRun: boolean;
  projectRoot: string;
  command: string;
  exitCode: number | null;
  notes: string[];
  stdout: string;
  stderr: string;
}

/**
 * Upgrade installed components by running the pinned `kronus-ui upgrade` CLI
 * at the detected project root. Defaults to `--all` when no names are given
 * (the usual "pull latest" request). `--all` also 3-way-merges composed
 * pages/layouts vs `.kronus-ui/base`. Named upgrades do not touch pages.
 * Prefer this over `install_component` with overwrite: it 3-way merges so
 * local edits survive.
 */
export async function upgradeComponents(
  input: UpgradeComponentsInput,
  options: CliRunOptions = {},
): Promise<UpgradeComponentsResult> {
  const names = collectItemNames(input.names ?? []);
  if (names.length === 0 && input.all === false) {
    throw new Error(
      'Specify component names or set all: true (e.g. upgrade_components { "all": true }).',
    );
  }
  const manifest = cleanManifestPath(input.manifest);
  const root = requireProjectRoot(options.cwd);
  const env = options.env ?? process.env;
  const dryRun = input.dryRun === true;

  const args = ["upgrade"];
  if (names.length > 0) {
    args.push(...names);
  } else {
    args.push("--all");
  }
  if (dryRun) args.push("--dry-run");
  if (input.yes) args.push("-y");
  if (manifest !== undefined) args.push("--manifest", manifest);
  appendRegistry(args, env);

  const run = await runCli(args, { ...options, cwd: root.dir, env });
  return {
    status: classify(run),
    dryRun,
    projectRoot: root.dir,
    command: run.command,
    exitCode: run.exitCode,
    notes: parseNotes(run.stdout),
    stdout: run.stdout,
    stderr: run.stderr,
  };
}
