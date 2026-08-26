#!/usr/bin/env node
/**
 * release.mjs — LOCAL release pipeline for the Kronus UI monorepo.
 *
 * GitHub Actions was removed (account billing), so releases are cut from a
 * developer machine. This script is the single local entry point for the public
 * npm release line.
 *
 * What it does, in order:
 *   (a) preflight   — assert a clean git working tree and that all publishable
 *                     publishable packages share the same `version`;
 *   (b) gate        — typecheck · lint · test · registry:check · tokens:check ·
 *                     props:check · build (the same checks the old CI ran);
 *   (c) smoke       — package:smoke (pack structure, real pack dependency pins,
 *                     offline import());
 *   (d) tag         — create and push the annotated git tag `v<version>` before
 *                     publishing packages that point at that raw GitHub tag;
 *   (e) publish     — for each package in dependency order
 *                     tokens → theme → ui → stack → ai-kit → cli →
 *                     create-kronus-app → create-kronus-stack → mcp:
 *                       1. `bun pm pack` the package (rewrites `workspace:*`
 *                          ranges to the concrete version and embeds each
 *                          package's own `publishConfig`),
 *                       2. `npm publish <tarball> --registry=npmjs` — npm reads
 *                          `access: public` from the tarball's embedded
 *                          `publishConfig`, while the registry is pinned here so
 *                          machine-level npm config cannot redirect a release.
 *
 * SAFETY: dry-run by DEFAULT. Without `--publish` it runs (a)-(c), then runs
 * the tag and publish plan plus `npm publish --dry-run` for (e).
 * Pass `--publish` to actually push the tag and publish the tarballs.
 *
 * Usage:
 *   node scripts/release.mjs            # dry-run (default) — safe preflight
 *   node scripts/release.mjs --publish  # really push tag + publish
 *   bun run release [--publish]
 *
 * Offline/auth notes: all packages publish to public npm and require a valid npm
 * login / `NPM_TOKEN`. `--publish` only runs from a local `main` that exactly
 * matches `origin/main`, checks npm auth before pushing the tag, and runs the
 * full tarball smoke.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const PUBLISH = process.argv.includes("--publish");

/* ------------------------------------------------------------------ *
 * logging
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
const plan = (msg) => log(`  ${c.yellow("◦")} ${c.yellow(msg)}`);

function fatal(msg, err) {
  log(`\n${c.red(c.bold("RELEASE ABORTED:"))} ${msg}`);
  if (err) {
    const detail = String(err.stderr || err.stdout || err.message || err).trim();
    if (detail) log(c.red(detail));
  }
  process.exit(1);
}

/**
 * Run a command, streaming its output to the terminal (inherit). Throws on a
 * non-zero exit so callers can fail the release.
 */
function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    cwd: opts.cwd || ROOT,
    stdio: opts.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
    env: { ...process.env, ...(opts.env || {}) },
    maxBuffer: 64 * 1024 * 1024,
  });
}

/* ------------------------------------------------------------------ *
 * package matrix — dependency order:
 * tokens → theme → ui → stack → ai-kit → cli → create-kronus-app →
 * create-kronus-stack → mcp
 * ------------------------------------------------------------------ */
const PACKAGES = [
  { dir: "packages/tokens", name: "@kronus-ui/tokens" },
  { dir: "packages/theme", name: "@kronus-ui/theme" },
  { dir: "packages/ui", name: "@kronus-ui/ui" },
  { dir: "packages/stack", name: "@kronus-ui/stack" },
  { dir: "packages/ai-kit", name: "@kronus-ui/ai-kit" },
  { dir: "packages/cli", name: "kronus-ui" },
  { dir: "packages/create-kronus-app", name: "create-kronus-app" },
  { dir: "packages/create-kronus-stack", name: "create-kronus-stack" },
  { dir: "packages/mcp", name: "kronus-ui-mcp" },
];
const PACKAGE_ORDER_LABEL = PACKAGES.map((pkg) => pkg.name).join(" → ");
const PUBLISHABLE_PACKAGE_NAMES = new Set(PACKAGES.map((pkg) => pkg.name));
const NPM_REGISTRY = "https://registry.npmjs.org/";
const GITHUB_REPO = "pedrogbraz/kronus-ui";

/* ------------------------------------------------------------------ *
 * (a) preflight — clean tree + lockstep versions
 * ------------------------------------------------------------------ */
function readPkg(dir) {
  return JSON.parse(readFileSync(join(ROOT, dir, "package.json"), "utf8"));
}

function npmVersionExists(name, version) {
  try {
    const out = run(
      "npm",
      ["view", `${name}@${version}`, "version", "--json", `--registry=${NPM_REGISTRY}`],
      {
        capture: true,
      },
    );
    return out.trim().length > 0;
  } catch (err) {
    const detail = String(err.stderr || err.stdout || err.message || "");
    if (detail.includes("E404") || detail.includes("404 Not Found")) return false;
    fatal(`could not verify npm availability for ${name}@${version}.`, err);
  }
}

function publishSourcePreflight() {
  if (!PUBLISH) return;

  const branch = run("git", ["branch", "--show-current"], { capture: true }).trim();
  if (branch !== "main") {
    fatal(
      `--publish must run from main after PR merge; current branch is ${branch || "(detached)"}.`,
    );
  }

  const head = run("git", ["rev-parse", "HEAD"], { capture: true }).trim();
  let remoteMain = "";
  try {
    remoteMain = run("git", ["ls-remote", "origin", "refs/heads/main"], { capture: true })
      .trim()
      .split(/\s+/)[0];
  } catch (err) {
    fatal("could not read origin/main before publish.", err);
  }
  if (!remoteMain) fatal("origin/main was not found; aborting publish.");
  if (head !== remoteMain) {
    fatal(
      `--publish requires local HEAD to equal origin/main (${remoteMain}); current HEAD is ${head}.`,
    );
  }
  ok("publish source is main and matches origin/main");

  try {
    const user = run("npm", ["whoami", `--registry=${NPM_REGISTRY}`], { capture: true }).trim();
    ok(`npm auth is present for ${NPM_REGISTRY} as ${c.bold(user)}`);
  } catch (err) {
    fatal(`npm auth is required before --publish can push a tag or publish packages.`, err);
  }
}

function verifyGithubRepoPublic() {
  const script = `
const repo = ${JSON.stringify(GITHUB_REPO)};
const url = \`https://api.github.com/repos/\${repo}\`;
const res = await fetch(url, {
  headers: {
    "accept": "application/vnd.github+json",
    "user-agent": "kronus-ui-release-preflight",
  },
});
if (!res.ok) {
  console.error(\`GitHub repo visibility check failed: \${res.status} \${res.statusText} at \${url}\`);
  process.exit(1);
}
const json = await res.json();
if (json.private !== false) {
  console.error(\`GitHub repo \${repo} is not public; private=\${json.private}\`);
  process.exit(1);
}
process.stdout.write(json.full_name || repo);
`;
  try {
    const repo = run(process.execPath, ["--input-type=module", "-e", script], {
      capture: true,
    }).trim();
    ok(`GitHub repo ${c.bold(repo || GITHUB_REPO)} is public`);
  } catch (err) {
    fatal(
      `could not confirm ${GITHUB_REPO} is public before release. ` +
        `Published CLIs resolve raw.githubusercontent.com/${GITHUB_REPO}/vX.Y.Z/registry.`,
      err,
    );
  }
}

function preflight() {
  group("preflight");

  // Clean working tree (tracked + untracked). A release must be reproducible
  // from the committed state, and we are about to cut a tag from HEAD.
  let status;
  try {
    status = run("git", ["status", "--porcelain"], { capture: true });
  } catch (err) {
    fatal("could not read git status (is this a git repo?)", err);
  }
  if (status.trim()) {
    log(c.red("  working tree is not clean:"));
    for (const line of status.trim().split("\n")) log(c.red(`    ${line}`));
    fatal("commit, stash, or clean the working tree before releasing.");
  }
  ok("git working tree is clean");

  // All publishable packages must share one version (lockstep 0.x).
  const versions = PACKAGES.map((p) => ({ name: p.name, version: readPkg(p.dir).version }));
  const distinct = [...new Set(versions.map((v) => v.version))];
  if (distinct.length !== 1) {
    log(c.red("  package versions are not in lockstep:"));
    for (const v of versions) log(c.red(`    ${v.name} @ ${v.version}`));
    fatal("bump every publishable package to the SAME version before releasing.");
  }
  const version = distinct[0];
  if (!version) fatal("could not read a version from the packages.");
  ok(`all ${PACKAGES.length} packages are at version ${c.bold(version)}`);

  // Don't clobber an existing release tag.
  const tag = `v${version}`;
  let localTagExists = false;
  try {
    run("git", ["rev-parse", "--verify", "--quiet", `refs/tags/${tag}`], { capture: true });
    localTagExists = true;
  } catch {
    localTagExists = false;
  }
  if (localTagExists) {
    fatal(`git tag ${tag} already exists — bump the version or delete the stale tag first.`);
  }
  ok(`local tag ${c.bold(tag)} is free`);

  let remoteTag = "";
  try {
    remoteTag = run("git", ["ls-remote", "--tags", "origin", `refs/tags/${tag}`], {
      capture: true,
    }).trim();
  } catch (err) {
    fatal(`could not verify remote tag ${tag}.`, err);
  }
  if (remoteTag) {
    fatal(`remote tag ${tag} already exists on origin — bump the version before releasing.`);
  }
  ok(`remote tag ${c.bold(tag)} is free`);

  publishSourcePreflight();
  verifyGithubRepoPublic();

  for (const pkg of PACKAGES) {
    if (npmVersionExists(pkg.name, version)) {
      fatal(`${pkg.name}@${version} already exists on npm — bump the version before releasing.`);
    }
    ok(`${pkg.name}@${version} is free on npm`);
  }

  return { version, tag };
}

/* ------------------------------------------------------------------ *
 * (b) gate + (c) smoke — the same checks the old CI ran, run locally
 * ------------------------------------------------------------------ */
function gate() {
  group("gate (typecheck · lint · test · registry:check · tokens:check · props:check · build)");
  // Order matters: cheap static checks first, build last (smoke needs dist).
  const steps = [
    "typecheck",
    "lint",
    "test",
    "registry:check",
    "tokens:check",
    "props:check",
    "build",
  ];
  for (const step of steps) {
    info(`bun run ${step}`);
    try {
      run("bun", ["run", step]);
    } catch (err) {
      fatal(`gate step "${step}" failed.`, err);
    }
    ok(`${step} passed`);
  }
}

function smoke() {
  group("package:smoke");
  info(PUBLISH ? "SMOKE_FULL=1 bun run package:smoke" : "bun run package:smoke");
  try {
    run("bun", ["run", "package:smoke"], {
      env: PUBLISH ? { SMOKE_FULL: "1" } : {},
    });
  } catch (err) {
    fatal("package:smoke failed.", err);
  }
  ok("package smoke passed");
}

/* ------------------------------------------------------------------ *
 * (e) publish — bun pm pack (rewrites workspace:*) + npm publish <tarball>
 * ------------------------------------------------------------------ *
 * npm/npm pack ships `workspace:*` ranges LITERALLY in this Bun monorepo (which
 * is unresolvable for consumers), so we always pack with `bun pm pack` first —
 * it rewrites `workspace:*` to the concrete version AND keeps each package's
 * `publishConfig`. `npm publish <tarball> --registry=npmjs` then ships the
 * exact packed bytes to public npm while preserving each package's embedded
 * `access: public`.
 *
 * Tarball-naming footgun: `@kronus-ui/ui` and the CLI `kronus-ui` BOTH pack to
 * `kronus-ui-<version>.tgz`. We pack each package into its OWN subdir so the CLI
 * tarball can't overwrite (and be confused with) the @kronus-ui/ui one.
 */
function packTarball(absDir, destDir) {
  run("mkdir", ["-p", destDir]);
  const before = new Set(readdirSync(destDir).filter((f) => f.endsWith(".tgz")));
  run("bun", ["pm", "pack", "--destination", destDir], { cwd: absDir, capture: true });
  const created = readdirSync(destDir)
    .filter((f) => f.endsWith(".tgz") && !before.has(f))
    .map((f) => join(destDir, f));
  if (created.length !== 1) {
    throw new Error(
      `expected \`bun pm pack\` to create exactly one tarball in ${destDir}, found ${created.length}`,
    );
  }
  return created[0];
}

function validatePackedInternalDeps(tarball, pkgName, version) {
  const manifest = JSON.parse(
    run("tar", ["-xOf", tarball, "package/package.json"], { capture: true }),
  );
  const problems = [];

  for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
    for (const [name, range] of Object.entries(manifest[field] || {})) {
      if (PUBLISHABLE_PACKAGE_NAMES.has(name) && range !== version) {
        problems.push(`${field}.${name}=${range}`);
      }
    }
  }

  if (problems.length > 0) {
    fatal(
      `${pkgName} tarball has internal Kronus deps outside lockstep ${version}: ${problems.join(", ")}`,
    );
  }
  ok(`${pkgName} tarball internal deps are pinned to ${version}`);
}

function publishAll(version) {
  group(PUBLISH ? `publish (${PACKAGE_ORDER_LABEL})` : "publish — DRY-RUN (no packages published)");

  // Pack into a temp dir so workspace:* gets rewritten before we ever publish.
  const destDir = join(ROOT, ".release-tarballs");
  // Clean any leftovers from a prior aborted run.
  run("rm", ["-rf", destDir]);
  run("mkdir", ["-p", destDir]);

  const published = [];
  try {
    for (const pkg of PACKAGES) {
      const absDir = join(ROOT, pkg.dir);
      const registry = NPM_REGISTRY;

      // Per-package subdir: @kronus-ui/ui and the CLI kronus-ui share a tarball name,
      // so isolate each so one can't clobber the other.
      const pkgDest = join(destDir, pkg.dir.replace(/^packages\//, ""));
      let tarball;
      try {
        tarball = packTarball(absDir, pkgDest);
        validatePackedInternalDeps(tarball, pkg.name, version);
      } catch (err) {
        fatal(`could not pack ${pkg.name}.`, err);
      }
      const tarballName = tarball.replace(/^.*\//, "");

      const publishArgs = ["publish", tarball, `--registry=${NPM_REGISTRY}`];
      if (!PUBLISH) publishArgs.push("--dry-run");

      if (PUBLISH) {
        info(`npm publish ${tarballName}  →  ${registry}`);
        try {
          run("npm", publishArgs, { cwd: ROOT });
        } catch (err) {
          fatal(
            `npm publish failed for ${pkg.name} (${registry}). ` +
              `Earlier packages in the order may already be published.`,
            err,
          );
        }
        ok(`published ${pkg.name}@${version}  →  ${registry}`);
      } else {
        plan(`would publish ${c.bold(`${pkg.name}@${version}`)}  →  ${registry}`);
        info(`(npm publish ${tarballName} --dry-run)`);
        try {
          // A dry-run still validates the tarball + registry resolution.
          run("npm", publishArgs, { cwd: ROOT, capture: true });
        } catch (err) {
          fatal(`npm publish --dry-run failed for ${pkg.name}@${version}.`, err);
        }
        ok(`npm dry-run accepted ${pkg.name}@${version}`);
      }
      published.push({ name: pkg.name, registry, tarball: tarballName });
    }
  } finally {
    if (PUBLISH) run("rm", ["-rf", destDir]);
    else info(`tarballs left in ${destDir.replace(`${ROOT}/`, "")}/ for inspection (dry-run)`);
  }

  return published;
}

/* ------------------------------------------------------------------ *
 * (d) tag — annotated v<version>, pushed to origin
 * ------------------------------------------------------------------ */
function tagAndPush(tag) {
  group(PUBLISH ? "tag" : "tag — DRY-RUN (no tag created or pushed)");
  if (!PUBLISH) {
    plan(`would create annotated tag ${c.bold(tag)} at HEAD and push it to origin`);
    info(`(git tag -a ${tag} -m "${tag}"  &&  git push origin ${tag})`);
    return;
  }
  try {
    run("git", ["tag", "-a", tag, "-m", tag]);
    ok(`created annotated tag ${tag}`);
    run("git", ["push", "origin", tag]);
    ok(`pushed ${tag} to origin`);
  } catch (err) {
    fatal(
      `tagging/pushing ${tag} failed. No packages were published by this run — ` +
        `fix the tag push before retrying.`,
      err,
    );
  }
}

/* ------------------------------------------------------------------ *
 * summary
 * ------------------------------------------------------------------ */
function summary({ version, tag, published }) {
  log(`\n${c.bold(c.cyan("━━━ release summary ━━━"))}`);
  log(`  mode:    ${PUBLISH ? c.green(c.bold("PUBLISH")) : c.yellow(c.bold("DRY-RUN"))}`);
  log(`  version: ${c.bold(version)}`);
  log(`  tag:     ${tag}${PUBLISH ? "" : c.dim(" (not created)")}`);
  log(`  ${PUBLISH ? "published" : "would publish"} (in order):`);
  for (const p of published) {
    log(`    ${PUBLISH ? c.green("✓") : c.yellow("◦")} ${p.name}@${version}  →  ${p.registry}`);
  }

  log(`\n${c.bold("Preflight checks this script DID run:")}`);
  log(
    `  ${c.green("✓")} Confirmed the GitHub repo ${c.bold(GITHUB_REPO)} is ${c.bold("public")} so the` +
      ` published CLI's pinned registry is reachable.`,
  );
  log(
    `    ${c.dim("·")} (raw.githubusercontent.com/${GITHUB_REPO}/${tag}/registry) resolves for` +
      ` \`npx kronus-ui add\`.`,
  );

  log(`\n${c.bold("Post-publish steps this script did NOT do:")}`);
  log(`  ${c.dim("·")} Create a GitHub Release for ${tag} (notes / assets), if desired.`);
  log(`  ${c.dim("·")} SBOM / build-provenance attestation (was CI-only; CI is removed).`);

  if (!PUBLISH) {
    log(
      `\n${c.yellow(c.bold("This was a DRY-RUN."))} Re-run with ${c.bold("--publish")} to push tag + publish.`,
    );
  } else {
    log(`\n${c.green(c.bold(`✓ released ${tag}`))}`);
  }
}

/* ------------------------------------------------------------------ *
 * main
 * ------------------------------------------------------------------ */
function main() {
  log(c.bold("\nKronus UI — local release pipeline"));
  log(
    c.dim(
      `mode: ${PUBLISH ? "PUBLISH (will push tag + publish tarballs)" : "DRY-RUN (default; prints the plan only)"}`,
    ),
  );
  log(c.dim(`root: ${ROOT}`));

  if (!existsSync(join(ROOT, "package.json"))) fatal(`no package.json at repo root ${ROOT}`);

  const { version, tag } = preflight();
  gate();
  smoke();
  tagAndPush(tag);
  const published = publishAll(version);
  summary({ version, tag, published });
}

main();
