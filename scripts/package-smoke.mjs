#!/usr/bin/env node
/**
 * package-smoke.mjs — publish-time smoke runner for the Cronus UI monorepo.
 *
 * Goal: prove that the *published* artifacts (not the workspace symlinks) are
 * structurally sound and that an external consumer who installs only the tarballs
 * renders STYLED components.
 *
 * Two modes:
 *
 *   LIGHT (default) — `node scripts/package-smoke.mjs`
 *     For every publishable package (@cronus-ui/tokens, @cronus-ui/theme,
 *     @cronus-ui/ui, @cronus-ui/stack, @cronus-ui/ai-kit, cronus-ui,
 *     create-cronus-app, create-cronus-stack, cronus-ui-mcp) run
 *     `npm pack --dry-run --json` and validate the tarball:
 *       - it contains every file referenced by package.json `main`/`types`/`bin`
 *         and each `exports` target,
 *       - it ships the expected top-level dirs (dist, styles, preset, …),
 *       - it does NOT leak junk (node_modules, src maps where unwanted, tsbuildinfo).
 *     It also packs each package with the real release packer (`bun pm pack`) and
 *     asserts any internal Cronus dependencies are pinned to the package version.
 *     Then, for every package, it dynamically `import()`s the built JS entry
 *     (the `exports["."]` / `main` JS file) in a short, offline Node subprocess
 *     and fails if the module THROWS on load — catching a `dist/index.js` whose
 *     internal import is unresolvable (which the tarball-structure checks above,
 *     asserting only that the export *targets* exist on disk, would miss).
 *     No install, no network, fast — safe for CI gates.
 *
 *   FULL  (`SMOKE_FULL=1 node scripts/package-smoke.mjs`)
 *     Additionally: `bun pm pack` real tarballs for every publishable package,
 *     install the runtime UI tarballs (ui + tokens + theme) into
 *     examples/smoke-next and examples/smoke-vite, build each fixture, and assert
 *     the compiled CSS contains the component utility classes (bg-primary,
 *     rounded-lg, bg-surface-raised, …). It also installs all publishable
 *     tarballs into a clean temp project and runs the CLI/generator/MCP bins,
 *     including the default Cronus UI scaffold and a non-Cronus UI neutral
 *     scaffold so unsupported UI choices cannot silently import missing Cronus
 *     packages.
 *     This is the real proof-of-style and proof-of-bin-execution.
 *     Heavier and needs the npm registry reachable for peer deps, so it's behind
 *     the flag.
 *
 * Exit code is non-zero on ANY failure. Logs are explicit about what failed.
 */

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
// This standalone script is run directly (node scripts/package-smoke.mjs), not as
// a Turbo task, so SMOKE_FULL/SMOKE_STRICT intentionally aren't declared in turbo.json.
// biome-ignore lint/suspicious/noUndeclaredEnvVars: not a Turbo task; see note above.
const FULL = process.env.SMOKE_FULL === "1";

/* ------------------------------------------------------------------ *
 * tiny logging + assertion helpers
 * ------------------------------------------------------------------ */
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const log = (...a) => console.log(...a);
const group = (title) => log(`\n${c.bold(c.cyan(`▶ ${title}`))}`);
const ok = (msg) => log(`  ${c.green("✓")} ${msg}`);
const info = (msg) => log(`  ${c.dim("·")} ${c.dim(msg)}`);

// SMOKE_STRICT=1 promotes publishing-hygiene warnings (e.g. test files shipped in
// `src`) to hard failures. Off by default because fixing those lives in
// packages/** (a separate hardening phase) — the warning stays loud regardless.
// biome-ignore lint/suspicious/noUndeclaredEnvVars: standalone script, not a Turbo task.
const STRICT = process.env.SMOKE_STRICT === "1";

const failures = [];
const warnings = [];
function check(cond, msg) {
  if (cond) {
    ok(msg);
  } else {
    log(`  ${c.red("✗")} ${msg}`);
    failures.push(msg);
  }
}
function warn(cond, msg) {
  if (cond) {
    ok(msg);
  } else if (STRICT) {
    log(`  ${c.red("✗")} ${msg} ${c.dim("(strict)")}`);
    failures.push(msg);
  } else {
    log(`  ${c.yellow("!")} ${msg} ${c.dim("(warning — set SMOKE_STRICT=1 to fail)")}`);
    warnings.push(msg);
  }
}
function fatal(msg, err) {
  log(`\n${c.red(c.bold("FATAL:"))} ${msg}`);
  if (err) log(c.red(String(err.stack || err.message || err)));
  process.exit(1);
}

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    cwd: opts.cwd || ROOT,
    encoding: "utf8",
    stdio: opts.inherit ? "inherit" : ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...(opts.env || {}) },
    maxBuffer: 64 * 1024 * 1024,
  });
}

/* ------------------------------------------------------------------ *
 * package matrix
 * ------------------------------------------------------------------ */
const PACKAGES = [
  { dir: "packages/tokens", name: "@cronus-ui/tokens" },
  { dir: "packages/theme", name: "@cronus-ui/theme" },
  { dir: "packages/ui", name: "@cronus-ui/ui" },
  { dir: "packages/stack", name: "@cronus-ui/stack" },
  { dir: "packages/ai-kit", name: "@cronus-ui/ai-kit" },
  { dir: "packages/cli", name: "cronus-ui" },
  { dir: "packages/create-cronus-app", name: "create-cronus-app" },
  { dir: "packages/create-cronus-stack", name: "create-cronus-stack" },
  { dir: "packages/mcp", name: "cronus-ui-mcp" },
];
const FIXTURE_PACKAGE_NAMES = ["@cronus-ui/ui", "@cronus-ui/tokens", "@cronus-ui/theme"];
const PUBLISHABLE_PACKAGE_NAMES = new Set(PACKAGES.map((pkg) => pkg.name));

// Utility classes that MUST appear in a consumer's compiled CSS once the
// component markup is scanned. Drawn straight from the built Button + Card
// (packages/ui/dist/components/{button,card}.js). If the @source line is missing
// or wrong, none of these are emitted — which is exactly what we want to catch.
const REQUIRED_CSS_CLASSES = [
  ".bg-primary",
  ".text-primary-foreground",
  ".rounded-lg",
  ".rounded-xl",
  ".bg-surface-raised",
  ".inline-flex",
  ".shadow-xs",
];

/* ------------------------------------------------------------------ *
 * exports-target collection (which files a tarball must contain)
 * ------------------------------------------------------------------ */
function collectExpectedFiles(pkgJson) {
  const expected = new Set();
  const addRel = (p) => {
    if (typeof p === "string" && p.startsWith("./")) expected.add(p.slice(2));
  };
  addRel(pkgJson.main);
  addRel(pkgJson.types);
  if (pkgJson.bin && typeof pkgJson.bin === "object") {
    for (const v of Object.values(pkgJson.bin)) addRel(v);
  } else if (typeof pkgJson.bin === "string") {
    addRel(pkgJson.bin);
  }
  const walkExports = (node) => {
    if (typeof node === "string") {
      addRel(node);
    } else if (node && typeof node === "object") {
      for (const v of Object.values(node)) walkExports(v);
    }
  };
  if (pkgJson.exports) walkExports(pkgJson.exports);
  // The "./package.json" self-export resolves to a real file but isn't a build
  // artifact worth special-casing; it's always present in the tarball.
  expected.delete("package.json");
  return expected;
}

function readTarballManifest(tgz) {
  return JSON.parse(run("tar", ["-xOf", tgz, "package/package.json"]));
}

function validatePackedInternalDeps(tgz, pkgName, version) {
  const manifest = readTarballManifest(tgz);
  const problems = [];

  for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
    for (const [name, range] of Object.entries(manifest[field] || {})) {
      if (PUBLISHABLE_PACKAGE_NAMES.has(name) && range !== version) {
        problems.push(`${field}.${name}=${range}`);
      }
    }
  }

  check(
    problems.length === 0,
    `${pkgName} packed internal deps are pinned to ${version}${
      problems.length ? ` (found: ${problems.join(", ")})` : ""
    }`,
  );
}

/* ------------------------------------------------------------------ *
 * LIGHT path: npm pack --dry-run --json + structural validation
 * ------------------------------------------------------------------ */
function packDryRun(absDir) {
  const out = run("npm", ["pack", "--dry-run", "--json"], { cwd: absDir });
  const json = JSON.parse(out);
  const entry = Array.isArray(json) ? json[0] : json;
  if (!entry || !Array.isArray(entry.files)) {
    throw new Error("unexpected `npm pack --dry-run --json` shape");
  }
  return entry;
}

function lightCheckPackage(pkg) {
  const absDir = join(ROOT, pkg.dir);
  group(`pack --dry-run · ${pkg.name} (${pkg.dir})`);

  const pkgJsonPath = join(absDir, "package.json");
  if (!existsSync(pkgJsonPath)) return fatal(`missing ${pkgJsonPath}`);
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));

  check(pkgJson.name === pkg.name, `name is "${pkg.name}"`);

  let entry;
  try {
    entry = packDryRun(absDir);
  } catch (err) {
    return fatal(`npm pack --dry-run failed for ${pkg.name}`, err);
  }

  const filesInTarball = new Set(entry.files.map((f) => f.path.replace(/^\.\//, "")));
  info(`${filesInTarball.size} files, ${entry.unpackedSize} B unpacked`);

  // package.json must always be present.
  check(filesInTarball.has("package.json"), "tarball includes package.json");

  // Every exports/main/types/bin target must be shipped.
  const expected = collectExpectedFiles(pkgJson);
  if (expected.size === 0) {
    info("no main/types/bin/exports targets declared");
  }
  for (const rel of [...expected].sort()) {
    check(filesInTarball.has(rel), `ships exports target: ${rel}`);
  }

  // `files` whitelist dirs should actually contribute content.
  for (const f of pkgJson.files || []) {
    // Negation patterns (e.g. "!src/**/*.test.ts") contribute by EXCLUDING,
    // not by matching files — they are validated by the test/junk-leak guards
    // below, so skip the "contributes content" assertion for them.
    if (f.startsWith("!")) continue;
    const dir = f.replace(/\/?\*+.*$/, "").replace(/\/$/, "");
    if (!dir || dir.includes("*")) continue;
    const has = [...filesInTarball].some((p) => p === dir || p.startsWith(`${dir}/`));
    check(has, `files[] entry "${f}" contributes content`);
  }

  // Hard junk guard — things that must NEVER be published.
  const junk = [...filesInTarball].filter(
    (p) => p.startsWith("node_modules/") || p.endsWith(".tsbuildinfo"),
  );
  check(
    junk.length === 0,
    `no junk files leaked${junk.length ? ` (found: ${junk.join(", ")})` : ""}`,
  );

  // Publishing-hygiene: test/spec files shouldn't ship in the tarball. Reported
  // as a warning by default (the fix lives in packages/**), hard-fail under STRICT.
  const testLeak = [...filesInTarball].filter(
    (p) => p.includes("/__tests__/") || /\.(test|spec)\.(tsx?|jsx?|d\.ts)$/.test(p),
  );
  warn(
    testLeak.length === 0,
    `no test/spec files leaked${testLeak.length ? ` (found: ${testLeak.join(", ")})` : ""}`,
  );

  // bin must be marked executable-resolvable (file exists in tarball).
  if (pkgJson.bin) {
    const bins = typeof pkgJson.bin === "string" ? [pkgJson.bin] : Object.values(pkgJson.bin);
    for (const b of bins) {
      const rel = b.replace(/^\.\//, "");
      check(filesInTarball.has(rel), `bin target ships: ${rel}`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * LIGHT path: dynamically import() each built JS entry (offline)
 * ------------------------------------------------------------------ *
 * The tarball-structure checks above only assert that the `exports` *targets*
 * exist on disk — they would NOT notice that a built `dist/index.js` references
 * an internal/transitive module that can't actually be resolved at runtime.
 * Here we resolve each package's main JS entry (or first bin for bin-only
 * packages) and import() it inside a short
 * Node subprocess. A non-zero exit (the module threw on load) is a hard failure.
 *
 * Why a subprocess (and not an in-process import()):
 *   - it isolates module side effects from this runner — notably the CLI's
 *     `dist/index.js`, which calls `program.parseAsync(process.argv)` at the
 *     top level (we set a benign argv and discard its stdout so it can't print
 *     help into the smoke output or read OUR args),
 *   - a faulty module that crashes the interpreter can't take the runner down,
 *   - it keeps each import's module registry clean (no cross-package bleed).
 * It stays fully offline: the subprocess only imports a local file URL; no
 * `--registry`/network access is involved.
 */
function resolveMainEntry(pkgJson) {
  // Prefer the `import` condition of the "." export, then top-level `main`,
  // then the first `bin` target for bin-only packages.
  const dot = pkgJson.exports?.["."];
  let target;
  if (typeof dot === "string") {
    target = dot;
  } else if (dot && typeof dot === "object") {
    target = dot.import ?? dot.default ?? dot.node;
  }
  target = target ?? pkgJson.main;
  if (!target && pkgJson.bin) {
    target = typeof pkgJson.bin === "string" ? pkgJson.bin : Object.values(pkgJson.bin)[0];
  }
  if (typeof target !== "string") return undefined;
  return target.replace(/^\.\//, "");
}

function importCheckPackage(pkg) {
  const absDir = join(ROOT, pkg.dir);
  group(`import() built entry · ${pkg.name}`);

  const pkgJson = JSON.parse(readFileSync(join(absDir, "package.json"), "utf8"));
  const rel = resolveMainEntry(pkgJson);
  if (!rel) {
    info("no main/bin JS entry declared — nothing to import");
    return;
  }

  const entryAbs = join(absDir, rel);
  if (!existsSync(entryAbs)) {
    // The structural pass already reports the missing target; don't double-fail.
    info(`built entry not on disk yet (${rel}) — skipping import (see structural check)`);
    return;
  }

  const entryUrl = pathToFileURL(entryAbs).href;
  // Run in a child Node process: import the built entry, exit 0 once it resolves
  // and non-zero (printing the error) if it throws/rejects while loading.
  //
  // `process.argv` is reset to a benign `[node, entry, --help]` so a CLI bin that
  // parses argv at the top of its module (cronus-ui calls `program.parseAsync`)
  // never reads the smoke runner's own args. `--help` is deliberate: with no args
  // commander treats "no command" as an error and `process.exit(1)`s (a false
  // import failure), whereas `--help` makes it print usage and exit 0 — which also
  // proves the command tree builds. Non-CLI entries ignore argv, so this is inert
  // for them; the signal there is simply that `import()` resolved without throwing.
  const loader = [
    "--input-type=module",
    "-e",
    `process.argv = [process.argv[0], ${JSON.stringify(entryAbs)}, "--help"];` +
      `import(${JSON.stringify(entryUrl)}).then(` +
      `() => process.exit(0),` +
      `(err) => { console.error(err?.stack || String(err)); process.exit(1); },` +
      `);`,
  ];

  try {
    // Capture (not inherit) stdout/stderr so a CLI's top-level help print stays
    // out of the smoke log; we only surface output if the import actually fails.
    run(process.execPath, loader, { cwd: absDir });
    check(true, `built entry import()s cleanly: ${rel}`);
  } catch (err) {
    check(false, `built entry import()s cleanly: ${rel}`);
    const detail = String(err.stderr || err.stdout || err.message || err).trim();
    if (detail)
      log(
        c.red(
          detail
            .split("\n")
            .map((l) => `      ${l}`)
            .join("\n"),
        ),
      );
  }
}

/* ------------------------------------------------------------------ *
 * FULL path helpers
 * ------------------------------------------------------------------ */
function realPack(absDir, destDir) {
  // Release uses `bun pm pack` because it rewrites workspace protocol deps to
  // concrete versions. Use the same packer here so the smoke installs exercise
  // the exact publish path instead of a sanitized npm-pack approximation.
  const before = new Set(readdirSync(destDir).filter((entry) => entry.endsWith(".tgz")));
  run("bun", ["pm", "pack", "--destination", destDir], { cwd: absDir });

  const created = readdirSync(destDir)
    .filter((entry) => entry.endsWith(".tgz") && !before.has(entry))
    .map((entry) => join(destDir, entry));

  if (created.length !== 1) {
    throw new Error(
      `expected bun pm pack to create exactly one tarball in ${destDir}, found ${created.length}`,
    );
  }

  return created[0];
}

function packedDependencyCheckPackage(pkg) {
  const absDir = join(ROOT, pkg.dir);
  group(`bun pm pack deps · ${pkg.name}`);
  const tmp = mkdtempSync(join(tmpdir(), "cronus-pack-"));

  try {
    const pkgTmp = join(tmp, pkg.dir.replace(/^packages\//, ""));
    run("mkdir", ["-p", pkgTmp]);
    const tgz = realPack(absDir, pkgTmp);
    const version = JSON.parse(readFileSync(join(absDir, "package.json"), "utf8")).version;
    validatePackedInternalDeps(tgz, pkg.name, version);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/**
 * Rewrite `workspace:` protocol deps in a packed tarball to a concrete version so
 * `npm install <tarball>` can resolve them from the sibling local tarballs
 * instead of choking on `workspace:*` (EUNSUPPORTEDPROTOCOL).
 *
 * NOTE: this is a compatibility fallback for the fixture install only. The
 * packed-dependency guard above already records a hard failure if a release
 * tarball contains a workspace protocol or any non-lockstep internal range.
 *
 * Returns the path of a fresh, sanitized tarball (same basename, in `destDir`).
 */
function sanitizeTarball(tgz, version, destDir) {
  const stage = mkdtempSync(join(destDir, "stage-"));
  // Extract: npm tarballs always root everything under "package/".
  run("tar", ["-xzf", tgz, "-C", stage]);
  const pkgRoot = join(stage, "package");
  const pkgJsonPath = join(pkgRoot, "package.json");
  const pj = JSON.parse(readFileSync(pkgJsonPath, "utf8"));

  let rewrote = false;
  for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
    const deps = pj[field];
    if (!deps) continue;
    for (const [name, range] of Object.entries(deps)) {
      if (typeof range === "string" && range.startsWith("workspace:")) {
        // workspace:* / workspace:^ / workspace:~ → pin to the packed version so
        // npm picks the sibling local tarball we install alongside this one.
        deps[name] = version;
        rewrote = true;
      }
    }
  }

  if (!rewrote) {
    rmSync(stage, { recursive: true, force: true });
    return tgz; // nothing to fix; install the original
  }

  warn(
    false,
    `${pj.name} ships "workspace:" deps in its tarball; sanitized for the smoke install (publish pipeline must pin these)`,
  );
  writeFileSync(pkgJsonPath, `${JSON.stringify(pj, null, 2)}\n`);

  const outName = `${tgz.replace(/^.*\//, "").replace(/\.tgz$/, "")}-sanitized.tgz`;
  const outPath = join(destDir, outName);
  // Re-create the tarball with the same internal layout (rooted at "package/").
  run("tar", ["-czf", outPath, "-C", stage, "package"]);
  rmSync(stage, { recursive: true, force: true });
  return outPath;
}

function findCss(dir) {
  // Recursively collect *.css under a built output dir.
  const found = [];
  const walk = (d) => {
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".css")) found.push(p);
    }
  };
  walk(dir);
  return found;
}

function assertStyledCss(fixtureName, outDirs) {
  let cssFiles = [];
  for (const d of outDirs) cssFiles = cssFiles.concat(findCss(d));
  check(cssFiles.length > 0, `[${fixtureName}] produced at least one compiled .css`);
  if (cssFiles.length === 0) return;

  const blob = cssFiles
    .map((f) => {
      const size = statSync(f).size;
      info(`[${fixtureName}] css: ${f.replace(`${ROOT}/`, "")} (${size} B)`);
      return readFileSync(f, "utf8");
    })
    .join("\n");

  for (const cls of REQUIRED_CSS_CLASSES) {
    // class selectors are escaped in output but the bare token (e.g. bg-primary)
    // always appears; match the unescaped token to be robust.
    const token = cls.replace(/^\./, "");
    check(blob.includes(token), `[${fixtureName}] compiled CSS contains "${token}"`);
  }
}

function fullSmokeFixture({ name, dir, tarballs, buildOutDirs, restoreFiles = [] }) {
  group(`full smoke · ${name} (${dir})`);
  const fixtureAbs = join(ROOT, dir);
  if (!existsSync(fixtureAbs)) return fatal(`fixture missing: ${fixtureAbs}`);

  // Snapshot every committed file the install/build might rewrite, and restore
  // their exact bytes afterwards no matter what — the fixture must stay pristine.
  //   - package.json: `npm install <tarball>` pins a machine-specific file: dep.
  //   - next-env.d.ts / tsconfig.json: `next build` rewrites these in place.
  const snapshotFiles = ["package.json", ...restoreFiles];
  const snapshots = new Map();
  for (const rel of snapshotFiles) {
    const p = join(fixtureAbs, rel);
    if (existsSync(p)) snapshots.set(p, readFileSync(p, "utf8"));
  }

  // Clean any previous run so the install is deterministic.
  for (const sub of ["node_modules", ".next", "dist", "package-lock.json"]) {
    rmSync(join(fixtureAbs, sub), { recursive: true, force: true });
  }

  try {
    // Install the local tarballs alongside the fixture's declared deps. Passing
    // the tarball paths explicitly makes the @cronus-ui/* packages resolve to the
    // PUBLISHED artifact (not a workspace symlink). We let npm save (so the
    // dependency graph is deterministic) and restore package.json below.
    const installArgs = [
      "install",
      "--no-audit",
      "--no-fund",
      "--install-strategy=hoisted",
      ...tarballs,
    ];
    info(`npm install (tarballs: ${tarballs.map((t) => t.replace(/^.*\//, "")).join(", ")})`);
    try {
      run("npm", installArgs, { cwd: fixtureAbs, inherit: true });
    } catch (err) {
      throw new Error(`[${name}] npm install failed: ${err.message}`);
    }

    // Verify the @cronus-ui/* packages were materialized into node_modules.
    for (const scoped of ["@cronus-ui/ui", "@cronus-ui/tokens", "@cronus-ui/theme"]) {
      check(
        existsSync(join(fixtureAbs, "node_modules", scoped, "package.json")),
        `[${name}] installed ${scoped} from tarball`,
      );
    }

    // Build.
    info("npm run build");
    try {
      run("npm", ["run", "build"], { cwd: fixtureAbs, inherit: true });
    } catch (err) {
      throw new Error(`[${name}] build failed: ${err.message}`);
    }

    // Assert the compiled CSS proves style emission.
    assertStyledCss(
      name,
      buildOutDirs.map((d) => join(fixtureAbs, d)),
    );
  } finally {
    // Always restore every snapshotted committed file (install/build mutated them).
    for (const [p, bytes] of snapshots) writeFileSync(p, bytes);
    // Drop the generated lockfile so the fixture stays clean in git.
    rmSync(join(fixtureAbs, "package-lock.json"), { force: true });
  }
}

function fullSmokeBins(tarballsByName) {
  group("full smoke · installed bins");
  const fixtureAbs = mkdtempSync(join(tmpdir(), "cronus-bin-smoke-"));
  const allTarballs = PACKAGES.map((pkg) => tarballsByName[pkg.name]);

  try {
    writeFileSync(
      join(fixtureAbs, "package.json"),
      `${JSON.stringify({ name: "cronus-bin-smoke", private: true, type: "module" }, null, 2)}\n`,
    );
    info(`npm install (tarballs: ${allTarballs.map((t) => t.replace(/^.*\//, "")).join(", ")})`);
    run(
      "npm",
      ["install", "--no-audit", "--no-fund", "--install-strategy=hoisted", ...allTarballs],
      { cwd: fixtureAbs, inherit: true },
    );

    const binChecks = [
      { bin: "cronus-ui", args: ["--help"], contains: "Usage:" },
      { bin: "create-cronus-app", args: ["--help"], contains: "create-cronus-app" },
      { bin: "create-cronus-stack", args: ["--help"], contains: "create-cronus-stack" },
      { bin: "cronus-ui-mcp", args: ["--help"], contains: "cronus-ui-mcp" },
    ];

    for (const checkSpec of binChecks) {
      const out = run("npx", ["--no-install", checkSpec.bin, ...checkSpec.args], {
        cwd: fixtureAbs,
      });
      check(
        out.includes(checkSpec.contains),
        `${checkSpec.bin} ${checkSpec.args.join(" ")} runs from installed tarball`,
      );
    }

    const version = readTarballManifest(tarballsByName["@cronus-ui/stack"]).version;
    for (const bin of ["create-cronus-app", "create-cronus-stack", "cronus-ui-mcp"]) {
      const out = run("npx", ["--no-install", bin, "--version"], { cwd: fixtureAbs });
      check(out.trim() === version, `${bin} --version reports ${version}`);
    }

    run(
      "npx",
      ["--no-install", "create-cronus-stack", "smoke-stack", "--yes", "--no-install", "--no-git"],
      { cwd: fixtureAbs, inherit: true },
    );
    check(
      existsSync(join(fixtureAbs, "smoke-stack", "src", "app", "page.tsx")),
      "create-cronus-stack scaffold writes src/app/page.tsx",
    );
    const cronusUi = JSON.parse(
      readFileSync(join(fixtureAbs, "smoke-stack", "cronus-ui.json"), "utf8"),
    );
    check(
      cronusUi.paths?.ui === "src/components/ui" &&
        cronusUi.paths?.lib === "src/lib" &&
        cronusUi.paths?.blocks === "src/components/blocks",
      "create-cronus-stack scaffold aligns cronus-ui.json paths with src alias",
    );

    run(
      "npx",
      [
        "--no-install",
        "create-cronus-stack",
        "smoke-neutral",
        "--yes",
        "--ui",
        "shadcn",
        "--no-install",
        "--no-git",
      ],
      { cwd: fixtureAbs, inherit: true },
    );
    const neutralDir = join(fixtureAbs, "smoke-neutral");
    check(
      existsSync(join(neutralDir, "src", "app", "page.tsx")),
      "create-cronus-stack non-Cronus UI scaffold writes src/app/page.tsx",
    );
    check(
      !existsSync(join(neutralDir, "cronus-ui.json")),
      "create-cronus-stack non-Cronus UI scaffold does not write cronus-ui.json",
    );
    const neutralSources = [
      "package.json",
      "src/app/layout.tsx",
      "src/app/page.tsx",
      "src/app/globals.css",
    ].map((rel) => readFileSync(join(neutralDir, rel), "utf8"));
    check(
      neutralSources.every((content) => !content.includes("@cronus-ui")),
      "create-cronus-stack non-Cronus UI scaffold has no @cronus-ui imports or deps",
    );
    info("[smoke-neutral] npm install");
    run("npm", ["install", "--no-audit", "--no-fund", "--install-strategy=hoisted"], {
      cwd: neutralDir,
      inherit: true,
    });
    info("[smoke-neutral] npm run build");
    run("npm", ["run", "build"], { cwd: neutralDir, inherit: true });
    ok("create-cronus-stack non-Cronus UI scaffold builds");

    run(
      "npx",
      ["--no-install", "create-cronus-app", "smoke-app", "--yes", "--no-install", "--no-ai"],
      { cwd: fixtureAbs, inherit: true },
    );
    check(
      existsSync(join(fixtureAbs, "smoke-app", "app", "page.tsx")),
      "create-cronus-app scaffold writes app/page.tsx",
    );
  } finally {
    rmSync(fixtureAbs, { recursive: true, force: true });
  }
}

/* ------------------------------------------------------------------ *
 * main
 * ------------------------------------------------------------------ */
function ensureBuilt() {
  // The tarballs include dist/** — those must already be built. Fail loudly
  // (rather than silently shipping an empty dist) if a package wasn't built.
  for (const pkg of PACKAGES) {
    const distIndex = join(ROOT, pkg.dir, "dist", "index.js");
    if (!existsSync(distIndex)) {
      fatal(
        `${pkg.name} is not built (missing ${pkg.dir}/dist/index.js). ` +
          `Run \`bun run build\` first.`,
      );
    }
  }
  // tokens needs its generated CSS + preset too.
  for (const rel of ["packages/tokens/styles/tokens.css", "packages/tokens/preset/index.js"]) {
    if (!existsSync(join(ROOT, rel))) {
      fatal(`missing generated artifact ${rel}. Run \`bun run build\` first.`);
    }
  }
}

function main() {
  log(c.bold("\nCronus UI — package smoke runner"));
  log(
    c.dim(
      `mode: ${FULL ? "FULL (pack + install + build + style-assert + bins)" : "LIGHT (pack --dry-run + structure + deps)"}`,
    ),
  );
  log(c.dim(`root: ${ROOT}`));

  ensureBuilt();

  // --- LIGHT (always) ---
  for (const pkg of PACKAGES) lightCheckPackage(pkg);
  // Prove the real release packer pins internal workspace deps to the release
  // version. `npm pack --dry-run` above cannot catch stale Bun workspace metadata.
  for (const pkg of PACKAGES) packedDependencyCheckPackage(pkg);
  // Prove every built JS entry actually loads (offline) — catches dist files
  // whose internal imports are unresolvable, which the structural pass misses.
  for (const pkg of PACKAGES) importCheckPackage(pkg);

  // --- FULL (opt-in) ---
  if (FULL) {
    let tmp;
    try {
      tmp = mkdtempSync(join(tmpdir(), "cronus-smoke-"));
      group("packing real tarballs");
      const tarballs = {};
      for (const pkg of PACKAGES) {
        const pj = JSON.parse(readFileSync(join(ROOT, pkg.dir, "package.json"), "utf8"));
        const pkgTmp = join(tmp, pkg.dir.replace(/^packages\//, ""));
        run("mkdir", ["-p", pkgTmp]);
        const raw = realPack(join(ROOT, pkg.dir), pkgTmp);
        validatePackedInternalDeps(raw, pkg.name, pj.version);
        // Sanitize workspace: protocol deps so npm can install the tarball offline.
        const tgz = sanitizeTarball(raw, pj.version, pkgTmp);
        tarballs[pkg.name] = tgz;
        ok(`packed ${pkg.name} → ${tgz.replace(/^.*\//, "")}`);
      }
      const fixtureTarballs = FIXTURE_PACKAGE_NAMES.map((name) => tarballs[name]);

      fullSmokeFixture({
        name: "smoke-next",
        dir: "examples/smoke-next",
        tarballs: fixtureTarballs,
        buildOutDirs: [".next"],
        // `next build` rewrites these in place; restore them after.
        restoreFiles: ["next-env.d.ts", "tsconfig.json"],
      });
      fullSmokeFixture({
        name: "smoke-vite",
        dir: "examples/smoke-vite",
        tarballs: fixtureTarballs,
        buildOutDirs: ["dist"],
      });
      fullSmokeBins(tarballs);
    } catch (err) {
      fatal("full smoke crashed", err);
    } finally {
      if (tmp) rmSync(tmp, { recursive: true, force: true });
    }
  } else {
    group("full smoke");
    info(
      "skipped — set SMOKE_FULL=1 to install tarballs, build fixtures, assert CSS, and run installed bins",
    );
  }

  // --- verdict ---
  log("");
  if (warnings.length) {
    log(
      c.yellow(c.bold(`! ${warnings.length} warning(s) (non-fatal; SMOKE_STRICT=1 to enforce):`)),
    );
    for (const w of warnings) log(c.yellow(`  - ${w}`));
  }
  if (failures.length) {
    log(c.red(c.bold(`✗ ${failures.length} check(s) failed:`)));
    for (const f of failures) log(c.red(`  - ${f}`));
    process.exit(1);
  }
  log(c.green(c.bold("✓ all package smoke checks passed")));
}

main();
