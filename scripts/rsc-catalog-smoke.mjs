#!/usr/bin/env node
/**
 * rsc-catalog-smoke.mjs — RSC-safety gate for the whole Kronus UI block catalog.
 *
 * Goal: prove that EVERY block in the registry is safe to import into a React
 * Server Component page. The Kronus Compose app generator emits RSC pages that
 * import blocks directly (the golden rule: a page is just imports + a single
 * <main> that stacks blocks). A block that uses hooks / event handlers / other
 * client-only features WITHOUT a "use client" directive at the top of its file
 * compiles fine in isolation but BREAKS `next build` the moment it is imported
 * from a server page. This runner catches that class for the entire catalog at
 * once — not one composed template's subset — so a newly-added client block that
 * forgot its directive can never ship.
 *
 * It mirrors scripts/compose-smoke.mjs (same logging/verdict conventions, same
 * LIGHT-default / opt-in-FULL split so the default run stays fast + offline and
 * CI can gate the slow `next build` behind a flag).
 *
 * Approach: import the BUILT dist of create-kronus-app's `scaffold()` (the exact
 * same way compose-smoke does) to lay down the `default` base, then install
 * every block with the SAME machinery the `kronus-ui add` command uses — the
 * workspace `Registry` (pointed at the local `registry/`) + `writeItemFiles`
 * from the built CLI dist. That is load-bearing: it exercises the real install
 * path (alias rewrites, block→components/blocks placement) rather than copying
 * files by hand, so what we build is byte-identical to what a user's `add` run
 * would produce. Importing the dist directly (rather than spawning the bins from
 * a bare temp dir) sidesteps the chicken-and-egg that a fresh temp project has
 * no node_modules to resolve `kronus-ui` from, and lets us point the registry at
 * the workspace `registry/` (which ships meta.json today; the release remote
 * only will from v0.4.0+).
 *
 * For every block it generates a bare RSC test route
 *
 *     app/(_rsc)/<slug>/page.tsx
 *
 * that imports the block's `exportName` from the blocks alias and renders it
 * inside a single <main> — the golden-rule shape the generator emits, and RSC by
 * default (NO "use client" on the test page, so a client-only block with a
 * missing directive is the ONLY thing that can break the build).
 *
 *   IMPORTANT — why `(_rsc)` and not `_rsc`: a Next.js App-Router folder whose
 *   name starts with a bare underscore is a *private folder* — it is opted OUT of
 *   routing, so `next build` would silently NOT compile those pages and the FULL
 *   proof would be vacuous (green even if every block was broken). Wrapping the
 *   slug pages in the route GROUP `(_rsc)` keeps them namespaced under one dir
 *   AND path-transparent while guaranteeing Next actually compiles each one
 *   (route `/<slug>`). No collision with the base `app/page.tsx` (route `/`).
 *
 * Two modes:
 *
 *   LIGHT (default) — `node scripts/rsc-catalog-smoke.mjs`
 *     Scaffold the default base → install every block (offline, skipInstall) →
 *     generate every test page → assert
 *       - every block's file (components/blocks/<slug>.tsx) was written,
 *       - every test page (app/(_rsc)/<slug>/page.tsx) was written and obeys the
 *         golden-rule shape (imports the exportName from the blocks alias, renders
 *         it inside a single <main>, and is NOT marked "use client"),
 *       - no two test pages resolve to the same route.
 *     No install, no network — deterministic + safe for a fast gate.
 *
 *   FULL  (`RSC_SMOKE_FULL=1 node scripts/rsc-catalog-smoke.mjs`)
 *     Additionally: add the blocks' npm deps to the scaffolded package.json,
 *     `npm install`, run `next build`, and assert it exits 0 and produced `.next`.
 *     This is the DEFINITIVE proof that no block breaks RSC compilation. Because
 *     Next fails the whole build on the FIRST offending page, the runner does a
 *     second, per-slug pass on failure to pin down exactly which block(s) broke
 *     (rebuilding with only one test page present at a time) so the report can
 *     name the slug + its `next build` error. Heavier and needs the npm registry
 *     reachable, so it's behind the flag.
 *
 * Exit code is non-zero on ANY failure. Logs are explicit about what failed.
 */

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
// Standalone script (run directly, not a Turbo task), so RSC_SMOKE_FULL isn't a
// declared Turbo env var — same convention as scripts/compose-smoke.mjs.
// biome-ignore lint/suspicious/noUndeclaredEnvVars: not a Turbo task; see note above.
const FULL = process.env.RSC_SMOKE_FULL === "1";

/* ------------------------------------------------------------------ *
 * tiny logging + assertion helpers (same palette as compose-smoke.mjs)
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
// Blocks that failed the FULL `next build` pass, with the captured reason —
// surfaced verbatim in the final report so a broken block is named + explained.
const failingBlocks = [];
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
 * ------------------------------------------------------------------ *
 * scaffold() lays down the `default` base; the CLI Registry + writeItemFiles are
 * the EXACT machinery `kronus-ui add` uses to install a block — reused here so the
 * installed files are byte-identical to a real `add` run.
 */
const DIST = {
  scaffold: join(ROOT, "packages/create-kronus-app/dist/scaffold.js"),
  registry: join(ROOT, "packages/cli/dist/registry.js"),
  utils: join(ROOT, "packages/cli/dist/utils.js"),
  config: join(ROOT, "packages/cli/dist/config.js"),
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
  for (const f of ["index.json", "meta.json"]) {
    if (!existsSync(join(WORKSPACE_REGISTRY, f))) {
      fatal(
        `registry/${f} is missing — the RSC smoke needs it. Run \`bun run -F kronus-ui registry\` first.`,
      );
    }
  }
}

async function loadDist() {
  const { scaffold } = await import(pathToFileURL(DIST.scaffold).href);
  const { Registry } = await import(pathToFileURL(DIST.registry).href);
  const { writeItemFiles, collectDependencies } = await import(pathToFileURL(DIST.utils).href);
  const { DEFAULT_CONFIG } = await import(pathToFileURL(DIST.config).href);
  return { scaffold, Registry, writeItemFiles, collectDependencies, DEFAULT_CONFIG };
}

/* ------------------------------------------------------------------ *
 * catalog: every registry:block + its exportName (derive, don't hardcode)
 * ------------------------------------------------------------------ */
function readCatalog() {
  const index = JSON.parse(readFileSync(join(WORKSPACE_REGISTRY, "index.json"), "utf8"));
  const items = Array.isArray(index) ? index : index.items || Object.values(index);
  const blockNames = items.filter((it) => it.type === "registry:block").map((it) => it.name);

  const meta = JSON.parse(readFileSync(join(WORKSPACE_REGISTRY, "meta.json"), "utf8"));
  const metaBlocks = meta.blocks || {};

  const blocks = [];
  for (const name of blockNames.sort()) {
    // Resolve the exportName. Variant items are named `<base>--<variant>` (double
    // dash) and their exportName is NOT a top-level meta.blocks key — it lives in
    // meta.blocks[<base>].variants[] keyed by `item`. Plain items read the
    // top-level meta.blocks[<name>].exportName.
    const base = name.includes("--") ? name.split("--")[0] : name;
    const baseMeta = metaBlocks[base];
    const exportName = name.includes("--")
      ? (baseMeta?.variants || []).find((v) => v.item === name)?.exportName
      : baseMeta?.exportName;
    if (!exportName) {
      // A block with no meta exportName can't be imported by the generator — that
      // is itself a catalog defect, so fail loudly rather than skip it.
      check(false, `${name}: registry/meta.json has an exportName`);
      continue;
    }
    // A chrome SHELL (kind "chrome" + category "shell", e.g. app-shell-chrome)
    // is layout furniture that WRAPS page content: its shipped export takes a
    // required `children` prop. The generator composes it AROUND a page's <main>
    // (chrome.shell.block), never as a childless leaf — so its RSC test page must
    // render it wrapping content, or `next build` type-errors on the missing
    // `children`. Every other block (incl. chrome navbar/footer) is a childless
    // leaf rendered as <Block />.
    const wrapsChildren = baseMeta?.kind === "chrome" && baseMeta?.category === "shell";
    // The registry resolves by ITEM name (`slug`), but variant items install to a
    // SINGLE-dash file (`<base>-<variant>.tsx`) — so the on-disk file, import
    // specifier, and test-page route all key off the single-dash basename.
    const file = name.replace(/--/g, "-");
    blocks.push({ slug: name, file, exportName, wrapsChildren });
  }
  return blocks;
}

/**
 * The npm deps every block needs at build time, resolved transitively from the
 * registry (a block's registryDependencies may add e.g. recharts). In LIGHT mode
 * we skip install, so FULL mode adds these to the scaffolded package.json before
 * `npm install`. The published @kronus-ui/* deps are dropped — the base
 * package.json already pins them and a bare spec here would fight that pin.
 */
function catalogNpmDeps(Registry, collectDependencies, blocks) {
  return (async () => {
    const registry = new Registry(WORKSPACE_REGISTRY);
    const items = await registry.resolve(blocks.map((b) => b.slug));
    const deps = collectDependencies(items).filter((d) => !d.startsWith("@kronus-ui/"));
    return deps.sort();
  })();
}

/* ------------------------------------------------------------------ *
 * the golden-rule RSC test page for a single block
 * ------------------------------------------------------------------ *
 * imports the block's exportName from the blocks alias and renders it inside a
 * single <main>. RSC by default — deliberately NO "use client" — so the ONLY way
 * this page can break `next build` is a client-only block missing its own
 * directive.
 *
 * A chrome SHELL block (`wrapsChildren`) is the inverse: it WRAPS the page's
 * <main> (it takes a required `children` prop and owns no <main> itself — the
 * SINGLE-MAIN INVARIANT). Rendering it as a childless `<Block />` would type-error
 * on the missing `children`, so its page nests the single <main> INSIDE the shell
 * — exactly the composition the generator emits (chrome.shell.block around a page).
 */
function rscTestPage(blocksAlias, slug, exportName, wrapsChildren = false) {
  if (wrapsChildren) {
    return `import { ${exportName} } from "${blocksAlias}/${slug}";

export default function Page() {
  return (
    <${exportName}>
      <main>Content</main>
    </${exportName}>
  );
}
`;
  }
  return `import { ${exportName} } from "${blocksAlias}/${slug}";

export default function Page() {
  return (
    <main>
      <${exportName} />
    </main>
  );
}
`;
}

/** Where a block's test page lives, relative to the scaffolded project root. */
function testPageRel(slug) {
  // Route GROUP "(_rsc)" — path-transparent AND compiled by next build (a bare
  // "_rsc" folder would be a private folder Next never compiles). Route = /<slug>.
  return join("app", "(_rsc)", slug, "page.tsx");
}

/* ------------------------------------------------------------------ *
 * scaffold + install every block + write every RSC test page
 * ------------------------------------------------------------------ */
async function buildCatalogApp(dist) {
  const { scaffold, Registry, writeItemFiles, DEFAULT_CONFIG } = dist;
  const tmp = mkdtempSync(join(tmpdir(), "rsc-catalog-smoke-"));
  const target = join(tmp, "catalog");

  // 1) Scaffold the default base (the same base composed templates copy). It
  //    ships app/layout.tsx (theme provider) + app/page.tsx (route "/").
  scaffold({ targetDir: target, name: "catalog", template: "default" });
  check(existsSync(join(target, "kronus-ui.json")), "scaffolded default base (kronus-ui.json)");
  check(existsSync(join(target, "app/layout.tsx")), "base ships app/layout.tsx (RSC root)");

  // 2) Install EVERY block with the real CLI machinery: resolve the transitive
  //    closure from the workspace registry, then writeItemFiles into the base
  //    using the default config (its paths match the scaffolded kronus-ui.json).
  const blocks = readCatalog();
  check(blocks.length > 0, `catalog has blocks (${blocks.length})`);

  const registry = new Registry(WORKSPACE_REGISTRY);
  const items = await registry.resolve(blocks.map((b) => b.slug));
  for (const item of items) {
    await writeItemFiles(item, DEFAULT_CONFIG, target, { overwrite: false });
  }

  // Every block's own source file must be on disk (blocks land in
  // components/blocks/<file>.tsx; they import @kronus-ui/ui + lucide-react, not
  // copied component source, so only the block file itself is asserted here).
  // Variant items install to a single-dash `<file>.tsx`, not the double-dash item
  // name — so this keys off `file`, not `slug`.
  const blocksDir = DEFAULT_CONFIG.paths.blocks; // "components/blocks"
  const blocksAlias = DEFAULT_CONFIG.aliases.blocks; // "@/components/blocks"
  for (const { file } of blocks) {
    check(
      existsSync(join(target, blocksDir, `${file}.tsx`)),
      `installed block file: ${join(blocksDir, `${file}.tsx`)}`,
    );
  }

  // 3) Generate a bare RSC test page per block (imports + single <main>). The
  //    import specifier and route both use the single-dash `file` basename. A
  //    chrome shell wraps the <main> instead of being a childless leaf.
  for (const { file, exportName, wrapsChildren } of blocks) {
    const rel = testPageRel(file);
    const abs = join(target, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, rscTestPage(blocksAlias, file, exportName, wrapsChildren), "utf8");
  }

  return { tmp, target, blocks, blocksAlias };
}

/* ------------------------------------------------------------------ *
 * LIGHT: assert every block file + test page exists and is the golden shape
 * ------------------------------------------------------------------ */
function lightAssertPages({ target, blocks, blocksAlias }) {
  group(`structure · ${blocks.length} RSC test pages (offline)`);

  const routes = new Map();
  for (const { slug, file, exportName } of blocks) {
    const rel = testPageRel(file);
    const abs = join(target, rel);
    if (!existsSync(abs)) {
      check(false, `${slug}: test page written (${rel})`);
      continue;
    }
    const src = readFileSync(abs, "utf8");

    // Golden-rule shape: imports the exportName from the blocks alias, renders it
    // inside a single <main>, and is RSC (no "use client"). No stray chrome JSX.
    // The import specifier keys off the single-dash `file` basename.
    const importsFromAlias =
      src.includes(`from "${blocksAlias}/${file}"`) && new RegExp(`\\b${exportName}\\b`).test(src);
    const hasMain = /<main[\s>]/.test(src) && /<\/main>/.test(src);
    const rendersBlock = new RegExp(`<${exportName}[\\s/>]`).test(src);
    const noStrayJsx = !/<(div|section|header|footer|nav|span|p|article)[\s>]/.test(src);
    const isServerPage = !/^\s*['"]use client['"]/.test(src);

    check(
      importsFromAlias && hasMain && rendersBlock && noStrayJsx && isServerPage,
      `${slug}: test page is the golden RSC shape (imports ${exportName} + single <main>, no "use client")`,
    );

    // Route uniqueness: strip the path-transparent "(_rsc)" group; each block
    // must own a distinct route so next build never sees a parallel-page clash.
    // Routes key off the single-dash `file` basename (avoids any `--` route edge).
    const route = `/${file}`;
    const existing = routes.get(route);
    if (existing) existing.push(slug);
    else routes.set(route, [slug]);
  }

  const collisions = [...routes.entries()].filter(([, s]) => s.length > 1);
  check(
    collisions.length === 0,
    collisions.length === 0
      ? "no two test pages resolve to the same route"
      : `route collision — ${collisions.map(([r, s]) => `${r} ← ${s.join(" + ")}`).join("; ")}`,
  );
}

/* ------------------------------------------------------------------ *
 * FULL: npm install + next build with EVERY block imported as an RSC page
 * ------------------------------------------------------------------ */
async function fullBuildCatalog(dist, composed) {
  const { target, blocks } = composed;
  group(`full build · ${blocks.length} blocks as RSC pages (npm install + next build)`);

  // Add the blocks' npm deps (lucide-react, recharts, …) to package.json — in
  // LIGHT we skipInstall, so persist them the way `pm add` would have.
  const pkgPath = join(target, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.dependencies = pkg.dependencies || {};
  const deps = await catalogNpmDeps(dist.Registry, dist.collectDependencies, blocks);
  for (const spec of deps) {
    const at = spec.lastIndexOf("@");
    const name = at > 0 ? spec.slice(0, at) : spec;
    const range = at > 0 ? spec.slice(at + 1) : "latest";
    pkg.dependencies[name] = range;
  }
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  info(`added block deps: ${deps.join(", ") || "(none)"}`);

  try {
    info("npm install (pulls published @kronus-ui/* + block deps)");
    run("npm", ["install", "--no-audit", "--no-fund", "--install-strategy=hoisted"], {
      cwd: target,
      inherit: true,
    });
  } catch (err) {
    return check(false, `npm install failed: ${err.message}`);
  }

  const build = tryNextBuild(target);
  if (build.ok) {
    check(existsSync(join(target, ".next")), "next build produced .next");
    ok(`next build exited 0 with all ${blocks.length} blocks imported as RSC pages`);
    return;
  }

  // The build failed. Next fails the WHOLE build on the first offending page, so
  // a single error can hide others. Isolate the culprit(s): rebuild with exactly
  // one test page present at a time and record every slug whose lone-page build
  // fails, with its captured `next build` error.
  check(false, "next build failed with the full catalog imported — isolating culprit block(s)");
  log(c.yellow("      (rebuilding per-block to name the failing slug(s); this is slow)"));
  isolateFailingBlocks(target, blocks);
}

/**
 * Run `next build` in `dir`. Returns { ok, output } — output is combined
 * stdout+stderr (captured, not inherited) so a failure can be attributed.
 */
function tryNextBuild(dir, { inherit = false } = {}) {
  try {
    const output = run("npm", ["run", "build"], { cwd: dir, inherit });
    return { ok: true, output: output || "" };
  } catch (err) {
    const output = `${err.stdout || ""}\n${err.stderr || ""}`.trim() || String(err.message || err);
    return { ok: false, output };
  }
}

/**
 * Pin down which block(s) break RSC compilation. The test pages all live under
 * app/(_rsc)/<slug>/. Move the whole group aside, then for each block move ONLY
 * its page back, `next build`, and record a failure (with the trimmed error) if
 * that lone page breaks the build. Restores the group afterward.
 */
function isolateFailingBlocks(target, blocks) {
  const groupDir = join(target, "app", "(_rsc)");
  const stash = join(target, ".rsc-stash");
  rmSync(stash, { recursive: true, force: true });
  renameSync(groupDir, stash);
  mkdirSync(groupDir, { recursive: true });

  try {
    for (const { slug, file, exportName } of blocks) {
      // Test-page folders are named by the single-dash `file` basename, so the
      // move keys off `file`; reports still name the registry item `slug`.
      const from = join(stash, file);
      const to = join(groupDir, file);
      if (!existsSync(from)) continue;
      renameSync(from, to);
      const build = tryNextBuild(target);
      if (!build.ok) {
        const firstError = extractBuildError(build.output);
        failingBlocks.push({ slug, exportName, reason: firstError });
        check(false, `${slug} (${exportName}): breaks RSC \`next build\` — ${firstError}`);
      }
      // Move it back out so the next block builds in isolation.
      renameSync(to, from);
    }
  } finally {
    // Restore the full group so the tmp dir (and any post-run inspection) is intact.
    rmSync(groupDir, { recursive: true, force: true });
    renameSync(stash, groupDir);
  }

  if (failingBlocks.length === 0) {
    // The full-catalog build failed but no single block's lone-page build did —
    // the failure is not a per-block RSC violation (e.g. an env/base issue).
    check(
      false,
      "full-catalog build failed but no individual block reproduced it — inspect the build log above",
    );
  }
}

/**
 * Pull the most useful one-liner out of a `next build` error blob: prefer the
 * canonical "use client" hint Next prints for a server/client boundary violation,
 * else the first "Error:"/"Failed to compile" line, else a trimmed tail.
 */
function extractBuildError(output) {
  const lines = output.split("\n").map((l) => l.trim());
  const useClient = lines.find(
    (l) => /use client/i.test(l) && /(only works in a client|server component)/i.test(l),
  );
  if (useClient) return useClient;
  const hookHint = lines.find((l) => /only works in a client component/i.test(l));
  if (hookHint) return hookHint;
  const errLine = lines.find((l) =>
    /^(Error:|Failed to compile|Type error:|.*\bis not\b.*)/.test(l),
  );
  if (errLine) return errLine;
  const nonEmpty = lines.filter(Boolean);
  return nonEmpty.slice(-3).join(" · ") || "unknown next build error";
}

/* ------------------------------------------------------------------ *
 * main
 * ------------------------------------------------------------------ */
async function main() {
  log(c.bold("\nKronus UI — RSC catalog smoke runner"));
  log(
    c.dim(
      `mode: ${
        FULL
          ? "FULL (scaffold + install-all + next build every block as RSC)"
          : "LIGHT (scaffold + install-all + structure, offline)"
      }`,
    ),
  );
  log(c.dim(`root: ${ROOT}`));

  ensureBuilt();
  const dist = await loadDist();

  let tmp;
  try {
    const composed = await buildCatalogApp(dist);
    tmp = composed.tmp;

    lightAssertPages(composed);

    if (FULL) {
      await fullBuildCatalog(dist, composed);
    } else {
      group("full build");
      info("skipped — set RSC_SMOKE_FULL=1 to npm install + next build every block as an RSC page");
    }
  } catch (err) {
    fatal("RSC catalog smoke crashed", err);
  } finally {
    if (tmp) rmSync(tmp, { recursive: true, force: true });
  }

  // --- verdict ---
  log("");
  if (failingBlocks.length) {
    log(c.red(c.bold(`✗ ${failingBlocks.length} block(s) break RSC compilation:`)));
    for (const b of failingBlocks) {
      log(c.red(`  - ${b.slug} (${b.exportName}): ${b.reason}`));
    }
  }
  if (failures.length) {
    log(c.red(c.bold(`✗ ${failures.length} check(s) failed:`)));
    for (const f of failures) log(c.red(`  - ${f}`));
    process.exit(1);
  }
  log(
    c.green(
      c.bold(
        FULL
          ? "✓ every block is RSC-safe — next build passed with the whole catalog imported"
          : "✓ all RSC catalog structure checks passed",
      ),
    ),
  );
}

main().catch((err) => fatal("RSC catalog smoke crashed", err));
