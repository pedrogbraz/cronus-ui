#!/usr/bin/env node
/**
 * compose-smoke.mjs — smoke runner for the Cronus Compose app generator (F1).
 *
 * Goal: prove that the *built* composer turns a bundled app template into a real,
 * navigable Next.js app whose pages are ONLY imports of installed registry blocks
 * (the golden rule), and — in FULL mode — that the generated app actually compiles
 * with `next build`.
 *
 * It mirrors scripts/package-smoke.mjs (same logging/verdict conventions, same
 * LIGHT-default / opt-in-FULL split so the default run stays fast + offline and CI
 * can gate the slow `next build` behind a nightly flag).
 *
 * Approach (the brief's second option — "invoking composeApp against a
 * default-scaffold"): import the BUILT dist of create-cronus-app's `scaffold()` and
 * `composeTemplate()` and drive them the SAME way the wired
 * `create-cronus-app --template store` path does (scaffold the `default` base — which
 * ships `app/page.tsx` — then compose on top via the create-cronus-app adapter, NOT
 * raw `composeApp`). Going through `composeTemplate` is load-bearing: it is the
 * layer that removes the base template's `app/page.tsx` so it doesn't collide with
 * the generated `app/(site)/page.tsx` at route "/". Calling `composeApp` directly
 * would silently skip that step and let the FULL `next build` ship the wrong home
 * page. Importing the dist directly (rather than spawning the create-cronus-app bin
 * from a temp dir) sidesteps the F1 chicken-and-egg cleanly:
 *   - the composer's `registry` override points at the local workspace `registry/`
 *     (which ships meta.json today; the release remote only will from v0.4.0+), and
 *   - `cronus-ui/compose` resolves from the workspace, not a bare temp dir that has
 *     no node_modules.
 *
 * Two modes:
 *
 *   LIGHT (default) — `node scripts/compose-smoke.mjs`
 *     For every bundled template (store, landing): scaffold → composeTemplate
 *     (skipInstall) → assert
 *       - every page.tsx the manifest implies exists on disk,
 *       - each generated page obeys the golden rule (imports blocks + a single
 *         <main> that stacks them, no stray UI JSX),
 *       - the base app/page.tsx was removed and NO two pages resolve to the same
 *         URL after stripping (group) segments (the parallel-pages guard),
 *       - the brand string was baked into the installed chrome copy,
 *       - the base snapshot bytes (.cronus-ui/base/<app>/…) are byte-identical to
 *         the emitted page (the F4 merge base), and
 *       - cronus-ui.json recorded composed{<template>} + installed{}.
 *     No install, no network — safe for a fast gate.
 *
 *   FULL  (`SMOKE_FULL=1 node scripts/compose-smoke.mjs`)
 *     Additionally, for the `store` AND `saas` templates composed above (via the
 *     real create-cronus-app scaffold+composeTemplate path, so the base app/page.tsx
 *     is already superseded): add the blocks' npm deps to the scaffolded
 *     package.json, `npm install` (pulls the published @cronus-ui/* + lucide-react +
 *     recharts), run `next build`, and assert it exits 0 and produced `.next` — the
 *     end-to-end proof that the exact wired flows build clean. `saas` is the one that
 *     exercises the Phase-2 machinery (the "use client" app-shell-chrome block
 *     wrapping server-component children through a route-group layout, the
 *     login--split installable variant, and recharts), none of which the `store`
 *     build touches. Heavier and needs the npm registry reachable, so it's behind
 *     the flag.
 *
 * Exit code is non-zero on ANY failure. Logs are explicit about what failed.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
// Standalone script (run directly, not a Turbo task), so SMOKE_FULL isn't a
// declared Turbo env var — same convention as scripts/package-smoke.mjs.
// biome-ignore lint/suspicious/noUndeclaredEnvVars: not a Turbo task; see note above.
const FULL = process.env.SMOKE_FULL === "1";

/* ------------------------------------------------------------------ *
 * tiny logging + assertion helpers (same palette as package-smoke.mjs)
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

const failures = [];
function check(cond, msg) {
  if (cond) {
    ok(msg);
  } else {
    log(`  ${c.red("✗")} ${msg}`);
    failures.push(msg);
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
 * dist entry points (built by `bun run build` before this runs)
 * ------------------------------------------------------------------ */
const DIST = {
  scaffold: join(ROOT, "packages/create-cronus-app/dist/scaffold.js"),
  // The real create-cronus-app adapter (removes the base app/page.tsx after
  // compose) — the EXACT path the wired `--template store` flow runs, not raw
  // `composeApp`.
  composeTemplate: join(ROOT, "packages/create-cronus-app/dist/compose.js"),
};
const WORKSPACE_REGISTRY = join(ROOT, "registry");

function ensureBuilt() {
  for (const [name, p] of Object.entries(DIST)) {
    if (!existsSync(p)) {
      fatal(
        `${name} dist not built (missing ${p.replace(`${ROOT}/`, "")}). Run \`bun run build\` first.`,
      );
    }
  }
  if (!existsSync(join(WORKSPACE_REGISTRY, "meta.json"))) {
    fatal(
      "registry/meta.json is missing — compose needs it. Run `bun run -F cronus-ui registry` first.",
    );
  }
}

async function loadDist() {
  const { scaffold } = await import(pathToFileURL(DIST.scaffold).href);
  const { composeTemplate } = await import(pathToFileURL(DIST.composeTemplate).href);
  return { scaffold, composeTemplate };
}

/* ------------------------------------------------------------------ *
 * manifest → expected page paths (derive, don't hardcode)
 * ------------------------------------------------------------------ *
 * Mirrors the renderer's page path contract: app/(<chromeGroup>)/<routeDir>/page.tsx
 * with the root route ("/") mapping to app/(<group>)/page.tsx. Kept in sync with
 * the manifest so the smoke stays honest if pages are added/removed.
 */
function readManifest(template) {
  const p = join(ROOT, "packages/cli/templates/apps", `${template}.json`);
  return JSON.parse(readFileSync(p, "utf8"));
}

function expectedPagePaths(manifest) {
  return manifest.manifest.pages.map((page) => {
    const group = page.chrome;
    const routeDir = page.route.replace(/^\//, "");
    return routeDir === "" ? `app/(${group})/page.tsx` : `app/(${group})/${routeDir}/page.tsx`;
  });
}

/**
 * The npm deps the (installed) blocks need at build time, read straight from the
 * registry index for the blocks this manifest uses. In LIGHT mode we skip install,
 * so FULL mode adds these to the scaffolded package.json before `npm install`.
 */
function blockNpmDeps(manifest) {
  const index = JSON.parse(readFileSync(join(WORKSPACE_REGISTRY, "index.json"), "utf8"));
  const items = Array.isArray(index) ? index : index.items || Object.values(index);
  const byName = new Map(items.map((it) => [it.name, it]));

  const wanted = new Set();
  for (const page of manifest.manifest.pages) {
    for (const b of page.blocks) wanted.add(typeof b === "string" ? b : b.block);
  }
  for (const grp of Object.values(manifest.manifest.chrome)) {
    if (grp.navbar) wanted.add(grp.navbar);
    if (grp.footer) wanted.add(grp.footer);
    if (grp.block) wanted.add(grp.block);
  }

  const deps = new Set();
  for (const name of wanted) {
    const item = byName.get(name);
    for (const d of item?.dependencies || []) {
      // Keep the published @cronus-ui/* deps out — the base package.json already
      // pins them; adding a bare-version spec here would fight that pin.
      if (d.startsWith("@cronus-ui/")) continue;
      deps.add(d);
    }
  }
  return [...deps].sort();
}

/* ------------------------------------------------------------------ *
 * LIGHT: scaffold + composeApp + structural assertions
 * ------------------------------------------------------------------ */
async function lightComposeTemplate({ scaffold, composeTemplate }, template) {
  group(`compose · ${template} (scaffold default base + composeTemplate, offline)`);
  const tmp = mkdtempSync(join(tmpdir(), `compose-smoke-${template}-`));
  // `appName` (the base-snapshot dir segment) is the project's package.json name;
  // the scaffold below writes it as "loja".
  const appName = "loja";
  const target = join(tmp, "loja");
  const brand = "Minha Loja Smoke";

  try {
    // 1) Scaffold the default base (composed templates copy `default`). This ships
    //    the base app/page.tsx that would collide with the generated "/" page —
    //    exactly what the wired `create-cronus-app --template store` flow does.
    scaffold({ targetDir: target, name: appName, template });
    check(existsSync(join(target, "cronus-ui.json")), `${template}: scaffolded cronus-ui.json`);
    check(
      existsSync(join(target, "app/page.tsx")),
      `${template}: base scaffold shipped app/page.tsx (the "/" collision source)`,
    );

    // 2) Compose on top via the REAL create-cronus-app adapter (removes the base
    //    app/page.tsx), against the local workspace registry (has meta.json).
    const result = await composeTemplate({
      targetDir: target,
      template,
      brand,
      skipInstall: true,
      registry: WORKSPACE_REGISTRY,
    });

    check(result.ok === true, `${template}: composeTemplate succeeded`);
    if (!result.ok) {
      log(c.red(`      ${result.reason}`));
      rmSync(tmp, { recursive: true, force: true });
      return null;
    }
    check(result.blockCount > 0, `${template}: installed ${result.blockCount} block(s)`);

    // 3) Every manifest-implied page exists on disk.
    const manifest = readManifest(template);
    const expected = expectedPagePaths(manifest);
    for (const rel of expected) {
      check(existsSync(join(target, rel)), `${template}: generated ${rel}`);
    }
    check(
      result.pageCount === expected.length,
      `${template}: page.tsx count matches manifest (${result.pageCount} === ${expected.length})`,
    );

    // 4) Golden rule: each page is imports + a single <main> that stacks blocks —
    //    no <div>/<section>/other JSX the renderer must never emit.
    for (const rel of expected) {
      const src = readFileSync(join(target, rel), "utf8");
      const okShape =
        src.includes("<main") &&
        src.includes("@/components/blocks/") &&
        !/<(div|section|header|footer|nav|span|p)[\s>]/.test(src);
      check(okShape, `${template}: ${rel} obeys the golden rule (imports + <main> only)`);
    }

    // 4b) No two pages resolve to the same URL. When the manifest DOES own "/"
    //     (store/landing, and now saas — its dashboard IS the shell home at "/"),
    //     the base app/page.tsx MUST have been removed (it and the generated
    //     app/(<group>)/page.tsx both own "/"). When it does NOT, the base page is
    //     legitimately KEPT so "/" still resolves — assert that instead. Either way
    //     no route survives twice after stripping path-transparent (group) segments.
    const ownsRoot = manifest.manifest.pages.some((p) => p.route === "/");
    if (ownsRoot) {
      check(
        !existsSync(join(target, "app/page.tsx")),
        `${template}: base app/page.tsx removed (no "/" collision with generated home)`,
      );
    } else {
      check(
        existsSync(join(target, "app/page.tsx")),
        `${template}: base app/page.tsx kept (manifest has no "/" page to supersede it)`,
      );
    }
    assertNoRouteCollisions(template, target);

    // 5) Brand baked into the installed chrome copy: navbar (site chrome) and/or
    //    the app-shell block (shell chrome). At least one chrome copy exists per
    //    manifest, so require the brand to land in whichever ships.
    const chromeCopies = [
      join(target, "components/blocks/navbar.tsx"),
      join(target, "components/blocks/app-shell-chrome.tsx"),
    ].filter((p) => existsSync(p));
    check(chromeCopies.length > 0, `${template}: at least one chrome copy installed`);
    for (const copy of chromeCopies) {
      check(
        readFileSync(copy, "utf8").includes(brand),
        `${template}: brand baked into ${copy.replace(`${target}/`, "")}`,
      );
    }

    // 6) Base snapshot bytes are byte-identical to the emitted page (F4 merge base).
    const firstPage = expected[0];
    const snap = join(target, ".cronus-ui/base", appName, firstPage);
    check(existsSync(snap), `${template}: base snapshot written for ${firstPage}`);
    if (existsSync(snap)) {
      const same = readFileSync(snap, "utf8") === readFileSync(join(target, firstPage), "utf8");
      check(same, `${template}: base snapshot is byte-identical to the generated page`);
    }

    // 7) composed{} + installed{} recorded in cronus-ui.json.
    const config = JSON.parse(readFileSync(join(target, "cronus-ui.json"), "utf8"));
    check(
      config.composed?.[template]?.files?.length > 0,
      `${template}: cronus-ui.json records composed[${template}] with files`,
    );
    check(
      Object.keys(config.installed || {}).length > 0,
      `${template}: cronus-ui.json records installed{} blocks`,
    );

    return { tmp, target, manifest };
  } catch (err) {
    check(false, `${template}: compose threw`);
    log(c.red(`      ${String(err.stack || err.message || err)}`));
    rmSync(tmp, { recursive: true, force: true });
    return null;
  }
}

/**
 * Fail if any two page.tsx files under `app/` resolve to the same URL. Next.js
 * route groups `(group)` are path-transparent, so we strip them (and each
 * dynamic `[slug]` down to a positional marker) before comparing — that is how
 * `next build` decides two pages collide. Catches the parallel-pages class in
 * the fast LIGHT gate instead of only under opt-in SMOKE_FULL `next build`.
 */
function assertNoRouteCollisions(template, target) {
  const appDir = join(target, "app");
  const pages = [];
  const walk = (dir, rel) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(join(dir, entry.name), childRel);
      else if (entry.name === "page.tsx") pages.push(rel);
    }
  };
  walk(appDir, "");

  const byRoute = new Map();
  for (const rel of pages) {
    // rel is the dir path holding page.tsx (e.g. "(site)/products/[id]").
    const route =
      "/" +
      rel
        .split("/")
        .filter((seg) => seg.length > 0 && !/^\(.*\)$/.test(seg)) // drop route groups
        .map((seg) => (/^\[.+\]$/.test(seg) ? "[*]" : seg)) // normalize dynamic slugs
        .join("/");
    const existing = byRoute.get(route);
    if (existing) existing.push(rel);
    else byRoute.set(route, [rel]);
  }

  const collisions = [...byRoute.entries()].filter(([, rels]) => rels.length > 1);
  check(
    collisions.length === 0,
    collisions.length === 0
      ? `${template}: no two pages resolve to the same URL`
      : `${template}: route collision — ${collisions
          .map(([route, rels]) => `${route} ← ${rels.map((r) => `${r}/page.tsx`).join(" + ")}`)
          .join("; ")}`,
  );
}

/* ------------------------------------------------------------------ *
 * FULL: npm install + next build against a composed template
 * ------------------------------------------------------------------ *
 * Generalized over the template so the FULL gate covers BOTH `store` (site/bare
 * chrome, plain login) AND `saas` — the Phase-2 template that introduces the
 * genuinely new build-time machinery: the `"use client"` app-shell-chrome block
 * wrapping server-component page children through a route-group layout, the
 * installable `login--split` variant, and the recharts deps pulled by the
 * analytics/dashboard blocks. None of that overlaps the store surface, so
 * building only store left the shell/variant/recharts compile path ungated.
 */
function fullBuild(template, composed) {
  const { target, manifest } = composed;
  group(`full build · ${template} (npm install + next build)`);

  // Add the blocks' npm deps (e.g. lucide-react, recharts) to the scaffolded
  // package.json — in LIGHT we skipInstall, so persist them the way `pm add` would.
  const pkgPath = join(target, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.dependencies = pkg.dependencies || {};
  const deps = blockNpmDeps(manifest);
  for (const spec of deps) {
    const at = spec.lastIndexOf("@");
    const name = at > 0 ? spec.slice(0, at) : spec;
    const range = at > 0 ? spec.slice(at + 1) : "latest";
    pkg.dependencies[name] = range;
  }
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  info(`added block deps: ${deps.join(", ") || "(none)"}`);

  try {
    info("npm install (pulls published @cronus-ui/* + block deps)");
    run("npm", ["install", "--no-audit", "--no-fund", "--install-strategy=hoisted"], {
      cwd: target,
      inherit: true,
    });
  } catch (err) {
    return check(false, `${template}: npm install failed: ${err.message}`);
  }

  try {
    info("next build");
    run("npm", ["run", "build"], { cwd: target, inherit: true });
    check(existsSync(join(target, ".next")), `${template}: next build produced .next`);
    ok(`${template}: next build exited 0`);
  } catch (err) {
    check(false, `${template}: next build failed: ${err.message}`);
  }
}

/* ------------------------------------------------------------------ *
 * main
 * ------------------------------------------------------------------ */
async function main() {
  log(c.bold("\nCronus Compose — app-generator smoke runner"));
  log(
    c.dim(
      `mode: ${FULL ? "FULL (scaffold + compose + install + next build)" : "LIGHT (scaffold + compose + structure, offline)"}`,
    ),
  );
  log(c.dim(`root: ${ROOT}`));

  ensureBuilt();
  const dist = await loadDist();

  const cleanups = [];
  try {
    // LIGHT: every composed template, always.
    const landing = await lightComposeTemplate(dist, "landing");
    if (landing) cleanups.push(landing.tmp);
    const store = await lightComposeTemplate(dist, "store");
    if (store) cleanups.push(store.tmp);
    const saas = await lightComposeTemplate(dist, "saas");
    if (saas) cleanups.push(saas.tmp);

    // FULL: build the composed store AND saas. store covers the site/bare chrome
    // + plain-login path; saas covers the Phase-2 machinery (app-shell-chrome
    // client wrapper through the route-group layout, the login--split variant, and
    // recharts) that the store build never exercises.
    if (FULL) {
      if (store) {
        fullBuild("store", store);
      } else {
        check(false, "store: composed app unavailable for FULL build");
      }
      if (saas) {
        fullBuild("saas", saas);
      } else {
        check(false, "saas: composed app unavailable for FULL build");
      }
    } else {
      group("full build");
      info("skipped — set SMOKE_FULL=1 to npm install + next build the composed store + saas");
    }
  } catch (err) {
    fatal("compose smoke crashed", err);
  } finally {
    for (const dir of cleanups) rmSync(dir, { recursive: true, force: true });
  }

  // --- verdict ---
  log("");
  if (failures.length) {
    log(c.red(c.bold(`✗ ${failures.length} check(s) failed:`)));
    for (const f of failures) log(c.red(`  - ${f}`));
    process.exit(1);
  }
  log(c.green(c.bold("✓ all compose smoke checks passed")));
}

main().catch((err) => fatal("compose smoke crashed", err));
