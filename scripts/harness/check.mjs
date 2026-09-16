#!/usr/bin/env node

// @ts-check
/**
 * scripts/harness/check.mjs — the verification tiers the dev-harness runs.
 *
 * The harness executes argv lists, never a shell: no `&&`, no pipes, no glob.
 * This file is the one place that knows how the CI contract maps onto tiers,
 * so `.harness/project.json` stays a three-line pointer instead of a second
 * copy of `.github/workflows/ci.yml` that drifts.
 *
 *   node scripts/harness/check.mjs quick      scoped to the diff — partial signal
 *   node scripts/harness/check.mjs full       the `gates` job, in CI order
 *   node scripts/harness/check.mjs browser    the `browser` job + visual regression
 *   node scripts/harness/check.mjs --self-test
 *
 * The three map 1:1 onto `checks.quick` / `checks.full` / `checks.critical` in
 * `.harness/project.json`. The harness COMPOSES those groups: `--tier full`
 * runs quick then full, and a task whose risk is `critical` also gets the
 * critical group afterwards. So each tier here must be only its own layer —
 * `browser` deliberately does not re-run `full`, because by the time it runs,
 * `full` has already built the app it needs.
 *
 * `quick` is a fast read while you work: lint always, then only the gates the
 * changed paths can actually break. It is NOT a delivery gate — the harness
 * refuses to integrate on it, and so should you.
 *
 * `full` mirrors `.github/workflows/ci.yml` job `gates` step for step. Keep the
 * two in sync: CI is the contract, this is the local rehearsal of it.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Changing any of these invalidates the scoping logic itself — run everything. */
const FORCE_FULL = new Set([
  "package.json",
  "bun.lock",
  "turbo.json",
  "biome.json",
  "vitest.config.ts",
  "tsconfig.base.json",
  "playwright.config.ts",
  "playwright.audit.config.ts",
  "CONTRACT.md",
]);

/**
 * Workspace root → the Vitest projects that cover it (see vitest.config.ts).
 * Order matters only for readability; Vitest dedupes.
 */
const VITEST_PROJECTS = [
  ["packages/tokens/", ["tokens"]],
  ["packages/cli/", ["cli"]],
  ["packages/create-cronus-app/", ["create-cronus-app"]],
  ["packages/create-cronus-stack/", ["create-cronus-stack"]],
  ["packages/stack/", ["stack"]],
  ["packages/ai-kit/", ["ai-kit"]],
  ["packages/mcp/", ["mcp"]],
  ["packages/ui/", ["ui", "ui-dom"]],
  ["packages/theme/", ["theme-dom"]],
  ["packages/audit/", ["audit", "audit-dom"]],
  ["apps/www/", ["www"]],
];

/**
 * The drift gates. Each generated artifact has a `:check` that re-derives it
 * from source; a path under one of `sources` can make it stale.
 */
const DRIFT_GATES = [
  { script: "contract:check", sources: ["packages/ui/src/"] },
  { script: "registry:check", sources: ["packages/ui/src/", "packages/cli/"] },
  { script: "tokens:check", sources: ["packages/tokens/"] },
  { script: "props:check", sources: ["packages/ui/src/", "apps/www/"] },
  { script: "check:example-sections", sources: ["apps/www/lib/examples/"] },
  { script: "a11y:routes:check", sources: ["apps/www/lib/", "packages/ui/src/"] },
];

function die(message, code = 1) {
  console.error(`harness-check: ${message}`);
  process.exit(code);
}

/**
 * Run one argv list to completion, inheriting stdio. No shell: `argv[0]` is
 * looked up on PATH as a real binary, so a missing tool is a hard failure and
 * never a silently-skipped gate.
 */
function run(argv, { timeout = 1_800_000, env = {} } = {}) {
  console.log(`+ ${argv.join(" ")}`);
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: ROOT,
    stdio: "inherit",
    timeout,
    env: { ...process.env, ...env },
  });
  if (result.error && /** @type {any} */ (result.error).code === "ENOENT") {
    die(`comando ausente: ${argv[0]}`, 2);
  }
  if (result.error && /** @type {any} */ (result.error).code === "ETIMEDOUT") {
    die(`timeout após ${timeout}ms: ${argv.join(" ")}`);
  }
  if (result.error) die(`${argv[0]}: ${result.error.message}`);
  if (result.signal) die(`${argv[0]} morreu com ${result.signal}`);
  if (result.status !== 0) die(`falhou (${result.status}): ${argv.join(" ")}`);
}

const bun = (script, options) => run(["bun", "run", script], options);

/**
 * `harness start` creates an empty worktree — a checkout of tracked files and
 * nothing else, because `node_modules` is ignored. Every gate would fail on a
 * missing binary, which the harness correctly reports as a pending item rather
 * than a pass. Install once, up front.
 *
 * `--frozen-lockfile` is load-bearing: a `bun.lock` rewritten mid-run would
 * change the content fingerprint and the harness would void the whole run as
 * `invalidated`. It also matches CI.
 */
function ensureInstall() {
  if (existsSync(resolve(ROOT, "node_modules", ".bin"))) return;
  run(["bun", "install", "--frozen-lockfile"], { timeout: 900_000 });
}

function git(...args) {
  const result = spawnSync("git", ["-C", ROOT, ...args], {
    encoding: "utf8",
    timeout: 60_000,
  });
  return { code: result.status ?? 1, stdout: result.stdout ?? "" };
}

function baseBranch() {
  const file = resolve(ROOT, ".harness", "project.json");
  if (!existsSync(file)) return "main";
  try {
    return JSON.parse(readFileSync(file, "utf8")).base_branch || "main";
  } catch {
    return "main";
  }
}

/**
 * Everything this worktree touched: uncommitted, staged, untracked, and the
 * commits since the base. A gate must see work that is not committed yet.
 */
export function changedPaths(base) {
  const names = new Set();
  const queries = [
    ["diff", "--name-only", "HEAD"],
    ["diff", "--name-only", "--cached"],
    ["ls-files", "--others", "--exclude-standard"],
    ["diff", "--name-only", `${base}...HEAD`],
  ];
  for (const args of queries) {
    const { code, stdout } = git(...args);
    if (code !== 0) continue;
    for (const line of stdout.split("\n")) {
      const path = line.trim();
      if (path) names.add(path);
    }
  }
  return [...names].sort();
}

export function classify(paths) {
  const projects = new Set();
  const gates = new Set();
  let typescript = false;
  let forceFull = paths.length === 0;

  for (const path of paths) {
    if (FORCE_FULL.has(path) || path.startsWith("scripts/")) forceFull = true;
    if (/\.(ts|tsx|mts|cts)$/.test(path)) typescript = true;
    for (const [prefix, names] of VITEST_PROJECTS) {
      if (path.startsWith(prefix)) for (const name of names) projects.add(name);
    }
    for (const gate of DRIFT_GATES) {
      if (gate.sources.some((prefix) => path.startsWith(prefix))) gates.add(gate.script);
    }
  }

  return {
    projects: [...projects].sort(),
    gates: DRIFT_GATES.map((g) => g.script).filter((s) => gates.has(s)),
    typescript,
    forceFull,
  };
}

function quick(plan) {
  ensureInstall();
  // Biome checks the whole tree in ~250ms — scoping it would only add a way
  // to miss something.
  bun("lint", { timeout: 300_000 });

  // Widest quick, not `full`: a build here would be thrown away and then
  // repeated by the `full` group the harness runs right after this one.
  const gates = plan.forceFull ? DRIFT_GATES.map((g) => g.script) : plan.gates;
  for (const script of gates) bun(script, { timeout: 600_000 });

  // `typecheck` is also the build step here: turbo declares
  // `"typecheck": {"dependsOn": ["^build"]}`, so it produces the workspace
  // `dist` output that the package-boundary tests import. Without it Vitest
  // fails on `Failed to resolve entry for package "@cronus-ui/…"` — a red that
  // says nothing about the change. `plan.typescript` alone is not enough:
  // a CSS-only diff still selects Vitest projects.
  const willTest = plan.forceFull || plan.projects.length > 0;
  if (plan.typescript || willTest) bun("typecheck", { timeout: 900_000 });

  if (plan.forceFull) {
    bun("test", { timeout: 1_800_000 });
  } else if (plan.projects.length > 0) {
    run(["bunx", "vitest", "run", ...plan.projects.flatMap((p) => ["--project", p])], {
      timeout: 1_800_000,
    });
  }
}

/** `.github/workflows/ci.yml` job `gates`, step for step. */
function full() {
  ensureInstall();
  bun("build", { timeout: 2_400_000 });
  bun("lint", { timeout: 300_000 });
  bun("contract:check", { timeout: 600_000 });
  bun("typecheck", { timeout: 900_000 });
  bun("test", { timeout: 1_800_000 });
  bun("registry:check", { timeout: 600_000 });
  bun("tokens:check", { timeout: 600_000 });
  bun("props:check", { timeout: 600_000 });
  bun("check:example-sections", { timeout: 600_000 });
  bun("a11y:routes:check", { timeout: 600_000 });
  bun("bundle:check", { timeout: 600_000, env: { BUNDLE_CHECK_STRICT: "1" } });
  bun("package:smoke", { timeout: 1_200_000 });
}

/**
 * `.github/workflows/ci.yml` job `browser`, plus the visual regression job.
 * Runs only for `--risk critical` tasks, and only after the `full` group —
 * Playwright serves the build output with `next start`, and `full` built it.
 */
function browser() {
  ensureInstall();
  run(["bunx", "playwright", "install", "chromium"], { timeout: 900_000 });
  bun("test:a11y", { timeout: 2_400_000 });
  bun("test:contrast", { timeout: 2_400_000 });
  bun("test:e2e", { timeout: 2_400_000 });
  run(["bunx", "playwright", "test", "--project=visual"], { timeout: 2_400_000 });
}

function selfTest() {
  const assert = (condition, message) => {
    if (!condition) die(`self-test: ${message}`, 3);
  };

  const ui = classify(["packages/ui/src/components/button.tsx"]);
  assert(ui.projects.join(",") === "ui,ui-dom", `ui projects: ${ui.projects}`);
  assert(ui.typescript, "ui typescript");
  assert(!ui.forceFull, "ui forceFull");
  assert(ui.gates.includes("contract:check"), "ui contract gate");
  assert(ui.gates.includes("registry:check"), "ui registry gate");
  assert(!ui.gates.includes("tokens:check"), "ui must not pull the tokens gate");

  // A CSS-only diff selects Vitest projects without touching TypeScript — the
  // case that made `quick` run Vitest against unbuilt packages.
  const styles = classify(["packages/ui/src/components/button.css"]);
  assert(styles.projects.length > 0, `styles projects: ${styles.projects}`);
  assert(!styles.typescript, "styles must not report typescript");

  const docs = classify(["README.md"]);
  assert(docs.projects.length === 0, `docs projects: ${docs.projects}`);
  assert(!docs.typescript, "docs typescript");
  assert(docs.gates.length === 0, `docs gates: ${docs.gates}`);

  const lock = classify(["bun.lock"]);
  assert(lock.forceFull, "bun.lock must force full");

  const script = classify(["scripts/bundle-check.mjs"]);
  assert(script.forceFull, "a gate's own source must force full");

  const empty = classify([]);
  assert(empty.forceFull, "an empty diff must not report success cheaply");

  const tokens = classify(["packages/tokens/src/colors.ts"]);
  assert(tokens.gates.includes("tokens:check"), "tokens gate");
  assert(tokens.projects.join(",") === "tokens", `tokens projects: ${tokens.projects}`);

  // Gate order is CI order, not Set insertion order.
  const both = classify(["apps/www/lib/examples/index.ts", "packages/tokens/src/colors.ts"]);
  assert(
    both.gates.indexOf("tokens:check") < both.gates.indexOf("check:example-sections"),
    `gate order: ${both.gates}`,
  );

  console.log("self-test ok");
}

function main(argv) {
  if (!existsSync(resolve(ROOT, "CONTRACT.md"))) {
    die("não parece o cronus-ui (CONTRACT.md ausente)", 2);
  }
  if (argv.length === 1 && argv[0] === "--self-test") {
    selfTest();
    return;
  }
  const tier = argv[0];
  if (argv.length !== 1 || !["quick", "full", "browser"].includes(tier)) {
    die("uso: check.mjs quick|full|browser", 2);
  }

  if (tier === "quick") {
    const plan = classify(changedPaths(baseBranch()));
    console.log(
      `tier=quick typescript=${plan.typescript} force_full=${plan.forceFull} ` +
        `projects=${plan.projects.join(",") || "-"} gates=${plan.gates.join(",") || "-"}`,
    );
    quick(plan);
  } else if (tier === "full") {
    console.log("tier=full");
    full();
  } else {
    console.log("tier=browser");
    browser();
  }

  console.log(`harness-check: ${tier} ok`);
}

main(process.argv.slice(2));
