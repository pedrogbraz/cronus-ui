import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CLI_VERSION, CONFIG_FILE, DEFAULT_CONFIG, readConfig } from "../config.js";
import { addPage, parseBlockRefs, previewAddPage } from "./add-page.js";
import { composeApp } from "./compose.js";

/**
 * Integration tests for add-page against the REAL repo registry directory (the
 * same seam compose.test.ts uses). Requires `registry/meta.json`; the whole suite
 * skips when it is absent.
 */

const REPO_REGISTRY = fileURLToPath(new URL("../../../../registry", import.meta.url));
const HAS_REGISTRY = existsSync(join(REPO_REGISTRY, "meta.json"));

describe("parseBlockRefs — --blocks parsing", () => {
  it("parses bare slugs and slug=variant tokens", () => {
    expect(parseBlockRefs("faq,cta")).toEqual(["faq", "cta"]);
    expect(parseBlockRefs("login=split,cta")).toEqual([
      { block: "login", variant: "split" },
      "cta",
    ]);
    expect(parseBlockRefs(" faq , cta ")).toEqual(["faq", "cta"]);
  });

  it("throws on an empty spec", () => {
    expect(() => parseBlockRefs(undefined)).toThrow(/--blocks is required/);
    expect(() => parseBlockRefs("")).toThrow(/--blocks is required/);
    expect(() => parseBlockRefs(" , ")).toThrow(/--blocks is required/);
  });

  it("throws on a malformed slug=variant token", () => {
    expect(() => parseBlockRefs("=split")).toThrow(/expected "slug" or "slug=variant"/);
    expect(() => parseBlockRefs("login=")).toThrow(/expected "slug" or "slug=variant"/);
  });

  it("trims BOTH sides of a slug=variant token (P3)", () => {
    // `login = split` with inner spaces resolves cleanly instead of yielding
    // { block: "login ", variant: " split" } (which fails plan validation).
    expect(parseBlockRefs(" login = split ")).toEqual([{ block: "login", variant: "split" }]);
    expect(parseBlockRefs("faq, login =split ,cta")).toEqual([
      "faq",
      { block: "login", variant: "split" },
      "cta",
    ]);
    // Whitespace-only sides are still rejected.
    expect(() => parseBlockRefs("login =  ")).toThrow(/expected "slug" or "slug=variant"/);
    expect(() => parseBlockRefs("  = split")).toThrow(/expected "slug" or "slug=variant"/);
  });
});

/** Write a minimal consumer project (package.json + cronus-ui.json) pointed at the repo registry. */
function seedProject(cwd: string, name = "loja"): void {
  mkdirSync(cwd, { recursive: true });
  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({ name, version: "0.0.0", private: true }),
  );
  writeFileSync(
    join(cwd, CONFIG_FILE),
    JSON.stringify({ ...DEFAULT_CONFIG, registry: REPO_REGISTRY }, null, 2),
  );
}

describe.skipIf(!HAS_REGISTRY)("addPage — integration (local repo registry)", () => {
  let root: string;
  let cwd: string;

  beforeEach(async () => {
    root = mkdtempSync(join(tmpdir(), "cronus-add-page-test-"));
    cwd = join(root, "project");
    seedProject(cwd);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    // Every test starts from a composed `landing` app (one "/" page, site chrome).
    await composeApp({
      targetDir: cwd,
      template: "landing",
      choices: { brand: "Minha Loja" },
      skipInstall: true,
    });
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it("adds a page + updates the nav + composed record", async () => {
    // `stats`/`about` are NOT part of the landing "/" page, so they are freshly
    // installed by add-page (faq/cta ship with landing already).
    const result = await addPage({
      targetDir: cwd,
      route: "/faq",
      blocks: ["stats", "about"],
      nav: "FAQ",
      skipInstall: true,
    });

    expect(result.appName).toBe("landing");
    expect(result.route).toBe("/faq");

    // The new page.tsx exists under the site route group and follows the golden rule.
    const pageRel = "app/(site)/faq/page.tsx";
    expect(result.generatedFiles).toContain(pageRel);
    const page = readFileSync(join(cwd, pageRel), "utf8");
    expect(page).toContain('from "@/components/blocks/stats"');
    expect(page).toContain("<StatsBlock />");
    expect(page).toContain("<main");
    expect(page).toContain("<AboutStoryBlock />");

    // The stats/about blocks were freshly installed.
    expect(result.installedBlocks).toContain("stats");
    expect(result.installedBlocks).toContain("about");
    expect(existsSync(join(cwd, "components/blocks/stats.tsx"))).toBe(true);

    // The chrome nav data-slot was re-injected to include BOTH Home and the new FAQ.
    const navbar = readFileSync(join(cwd, "components/blocks/navbar.tsx"), "utf8");
    expect(navbar).toContain('{ label: "Home", href: "/" }');
    expect(navbar).toContain('{ label: "FAQ", href: "/faq" }');
    // The brand stays the composed brand (not re-defaulted).
    expect(navbar).toContain("Minha Loja");
    // The footer (also in the site group) is re-injected too.
    const footer = readFileSync(join(cwd, "components/blocks/footer.tsx"), "utf8");
    expect(footer).toContain('{ label: "FAQ", href: "/faq" }');
    expect(result.generatedFiles).toContain("components/blocks/navbar.tsx");
    expect(result.generatedFiles).toContain("components/blocks/footer.tsx");

    // composed{} grew: pages union (order preserved) + files union, version pinned.
    const config = await readConfig(cwd);
    const rec = config.composed?.landing;
    expect(rec?.choices.pages).toEqual(["/", "/faq"]);
    expect(rec?.choices.brand).toBe("Minha Loja");
    expect(rec?.version).toBe(CLI_VERSION);
    expect(rec?.files).toContain(pageRel);
    expect([...(rec?.files ?? [])].sort()).toEqual(rec?.files); // sorted + deduped
    // installed{} tracks the new blocks.
    expect(config.installed?.stats).toBeDefined();
    expect(config.installed?.about).toBeDefined();

    // Base snapshot mirrors the emitted page bytes (F4 merge base).
    const snap = readFileSync(join(cwd, `.cronus-ui/base/landing/${pageRel}`), "utf8");
    expect(snap).toBe(page);
  });

  it("adds a page WITHOUT --nav: page written, nav unchanged", async () => {
    const navbarBefore = readFileSync(join(cwd, "components/blocks/navbar.tsx"), "utf8");
    const result = await addPage({
      targetDir: cwd,
      route: "/pricing",
      blocks: ["pricing"],
      skipInstall: true,
    });
    expect(result.generatedFiles).toContain("app/(site)/pricing/page.tsx");
    // No --nav → the chrome block bytes are untouched (not in the written set).
    expect(result.generatedFiles).not.toContain("components/blocks/navbar.tsx");
    expect(readFileSync(join(cwd, "components/blocks/navbar.tsx"), "utf8")).toBe(navbarBefore);
    // The route still joins composed{}.pages.
    const config = await readConfig(cwd);
    expect(config.composed?.landing?.choices.pages).toContain("/pricing");
  });

  it("defaults the page title from the route when --title is omitted", async () => {
    await addPage({ targetDir: cwd, route: "/help-center", blocks: ["faq"], skipInstall: true });
    const page = readFileSync(join(cwd, "app/(site)/help-center/page.tsx"), "utf8");
    expect(page).toContain('export const metadata = { title: "Help Center" };');
  });

  it("re-injects the chrome nav from the pristine source with the correct brand", async () => {
    // The re-injected navbar re-applies the app brand + the (now-larger) nav from
    // the pristine registry source — same contract as compose's chrome pass.
    await addPage({
      targetDir: cwd,
      route: "/faq",
      blocks: ["faq"],
      nav: "FAQ",
      skipInstall: true,
    });
    const navbar = readFileSync(join(cwd, "components/blocks/navbar.tsx"), "utf8");
    expect(navbar).toContain('{ label: "FAQ", href: "/faq" }');
    expect(navbar).toContain('{ label: "Home", href: "/" }');
    // Brand re-applied (placeholder gone).
    expect(navbar).toContain("Minha Loja");
    expect(navbar).not.toContain(">Cronus<");
  });

  it("--dry-run (previewAddPage) writes nothing", async () => {
    const before = readFileSync(join(cwd, "components/blocks/navbar.tsx"), "utf8");
    const preview = await previewAddPage({
      targetDir: cwd,
      route: "/faq",
      blocks: ["stats"],
      nav: "FAQ",
    });
    expect(preview.appName).toBe("landing");
    expect(preview.wouldWrite).toContain("app/(site)/faq/page.tsx");
    expect(preview.wouldWrite).toContain("components/blocks/navbar.tsx");
    expect(preview.wouldInstall).toContain("stats");

    // Nothing was written.
    expect(existsSync(join(cwd, "app/(site)/faq/page.tsx"))).toBe(false);
    expect(readFileSync(join(cwd, "components/blocks/navbar.tsx"), "utf8")).toBe(before);
    const config = await readConfig(cwd);
    expect(config.composed?.landing?.choices.pages).toEqual(["/"]);
  });

  it("scaffolds a brand-new chrome group's layout when the added page introduces it", async () => {
    // A fresh project composing `store` but only its `site` pages → the `bare`
    // group is declared in the manifest yet never scaffolded on disk.
    const app = join(root, "store-app");
    seedProject(app);
    await composeApp({
      targetDir: app,
      template: "store",
      choices: { pages: ["/", "/products"] },
      skipInstall: true,
    });
    expect(existsSync(join(app, "app/(bare)/layout.tsx"))).toBe(false);

    // Adding a `bare`-group page must write that group's (passthrough) layout now.
    const result = await addPage({
      targetDir: app,
      route: "/login",
      blocks: ["login"],
      chrome: "bare",
      app: "store",
      skipInstall: true,
    });
    expect(result.generatedFiles).toContain("app/(bare)/login/page.tsx");
    expect(result.generatedFiles).toContain("app/(bare)/layout.tsx");
    const bareLayout = readFileSync(join(app, "app/(bare)/layout.tsx"), "utf8");
    expect(bareLayout).toContain("return <>{children}</>;");
    // The new layout is recorded + base-snapshotted.
    const config = await readConfig(app);
    expect(config.composed?.store?.files).toContain("app/(bare)/layout.tsx");
    expect(existsSync(join(app, ".cronus-ui/base/store/app/(bare)/layout.tsx"))).toBe(true);
  });

  it("rejects a route that collides with an existing page (no --overwrite)", async () => {
    await expect(
      addPage({ targetDir: cwd, route: "/", blocks: ["hero"], skipInstall: true }),
    ).rejects.toThrow(/already a page of app "landing".*--overwrite/);
  });

  it("replaces the page with --overwrite on a colliding route", async () => {
    const result = await addPage({
      targetDir: cwd,
      route: "/",
      blocks: ["pricing"],
      overwrite: true,
      skipInstall: true,
    });
    expect(result.generatedFiles).toContain("app/(site)/page.tsx");
    const page = readFileSync(join(cwd, "app/(site)/page.tsx"), "utf8");
    expect(page).toContain("<PricingBlock />");
    // pages set does not duplicate "/".
    const config = await readConfig(cwd);
    expect(config.composed?.landing?.choices.pages).toEqual(["/"]);
  });

  it("aggregates plan errors for an unknown block", async () => {
    await expect(
      addPage({
        targetDir: cwd,
        route: "/faq",
        blocks: ["definitely-not-a-block"],
        skipInstall: true,
      }),
    ).rejects.toThrow(/unknown block "definitely-not-a-block"/);
  });

  it("rejects a chrome (layout) block used as a page section", async () => {
    await expect(
      addPage({ targetDir: cwd, route: "/faq", blocks: ["navbar"], skipInstall: true }),
    ).rejects.toThrow(/is layout chrome/);
  });

  it("requires a composed app (compose first)", async () => {
    const fresh = join(root, "fresh");
    seedProject(fresh);
    await expect(
      addPage({ targetDir: fresh, route: "/faq", blocks: ["faq"], skipInstall: true }),
    ).rejects.toThrow(/No composed app found/);
  });

  it("requires --app when the project has more than one composed app", async () => {
    // Compose a second app into the same project.
    await composeApp({ targetDir: cwd, template: "store", skipInstall: true });
    await expect(
      addPage({ targetDir: cwd, route: "/faq", blocks: ["faq"], skipInstall: true }),
    ).rejects.toThrow(/Pass --app <name>/);
    // With --app it works.
    const result = await addPage({
      targetDir: cwd,
      route: "/faq",
      blocks: ["faq"],
      app: "landing",
      skipInstall: true,
    });
    expect(result.appName).toBe("landing");
  });

  it("is deterministic: the same add-page yields identical page bytes across projects", async () => {
    const cwd2 = join(root, "project2");
    seedProject(cwd2);
    await composeApp({
      targetDir: cwd2,
      template: "landing",
      choices: { brand: "Minha Loja" },
      skipInstall: true,
    });
    await addPage({
      targetDir: cwd,
      route: "/faq",
      blocks: ["faq", "cta"],
      nav: "FAQ",
      skipInstall: true,
    });
    await addPage({
      targetDir: cwd2,
      route: "/faq",
      blocks: ["faq", "cta"],
      nav: "FAQ",
      skipInstall: true,
    });
    for (const rel of ["app/(site)/faq/page.tsx", "components/blocks/navbar.tsx"]) {
      expect(readFileSync(join(cwd, rel), "utf8")).toBe(readFileSync(join(cwd2, rel), "utf8"));
    }
  });
});

describe.skipIf(!HAS_REGISTRY)("addPage — confirmed-defect fixes", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cronus-add-page-fix-"));
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  // --- P1: install the chrome block(s) of a brand-new chrome group -----------
  it("installs + builds a brand-new SHELL chrome group (P1): the wrapper's imported block exists", async () => {
    const app = join(root, "saas-app");
    seedProject(app);
    // Compose saas with ONLY its bare pages → the `shell` group (app-shell-chrome)
    // is declared in the manifest but never scaffolded (block never installed).
    await composeApp({
      targetDir: app,
      template: "saas",
      choices: { pages: ["/login", "/signup"] },
      skipInstall: true,
    });
    expect(existsSync(join(app, "app/(shell)/layout.tsx"))).toBe(false);
    expect(existsSync(join(app, "components/blocks/app-shell-chrome.tsx"))).toBe(false);

    const result = await addPage({
      targetDir: app,
      route: "/dashboard",
      blocks: ["dashboard", "stats"],
      chrome: "shell",
      nav: "Dashboard",
      app: "saas",
      skipInstall: true,
    });

    // The wrapper the new layout imports (@/components/blocks/chrome/app-shell) is
    // written AND the underlying chrome block it re-exports now exists on disk.
    expect(result.generatedFiles).toContain("components/blocks/chrome/app-shell.tsx");
    expect(result.generatedFiles).toContain("app/(shell)/layout.tsx");
    const shellBlockPath = join(app, "components/blocks/app-shell-chrome.tsx");
    expect(existsSync(shellBlockPath)).toBe(true);
    // The chrome block is tracked in installedBlocks + installed{}.
    expect(result.installedBlocks).toContain("app-shell-chrome");
    const config = await readConfig(app);
    expect(config.installed?.["app-shell-chrome"]).toBeDefined();

    // The wrapper's imported symbol resolves to the on-disk block file (no missing
    // module → the generated app is buildable).
    const wrapper = readFileSync(join(app, "components/blocks/chrome/app-shell.tsx"), "utf8");
    const importMatch = wrapper.match(/from "@\/components\/blocks\/([^"]+)"/);
    expect(importMatch?.[1]).toBe("app-shell-chrome");
    // The installed block was customized (nav + brand), matching compose output:
    // its sidebar nav lists the new Dashboard entry.
    const shellBlock = readFileSync(shellBlockPath, "utf8");
    expect(shellBlock).toContain('{ label: "Dashboard", href: "/dashboard" }');
  });

  it("installs + builds a brand-new SITE chrome group (P1): navbar + footer blocks exist", async () => {
    const app = join(root, "store-app");
    seedProject(app);
    // Compose store with ONLY a bare page → the `site` group (navbar/footer) is
    // declared but never scaffolded, so navbar.tsx/footer.tsx are absent.
    await composeApp({
      targetDir: app,
      template: "store",
      choices: { pages: ["/login"] },
      skipInstall: true,
    });
    expect(existsSync(join(app, "components/blocks/navbar.tsx"))).toBe(false);
    expect(existsSync(join(app, "components/blocks/footer.tsx"))).toBe(false);

    const result = await addPage({
      targetDir: app,
      route: "/about",
      blocks: ["about"],
      chrome: "site",
      nav: "About",
      app: "store",
      skipInstall: true,
    });

    // Both chrome blocks the site wrappers import are now on disk.
    expect(existsSync(join(app, "components/blocks/navbar.tsx"))).toBe(true);
    expect(existsSync(join(app, "components/blocks/footer.tsx"))).toBe(true);
    expect(result.installedBlocks).toContain("navbar");
    expect(result.installedBlocks).toContain("footer");
    // The wrappers + layout were scaffolded and reference existing blocks.
    expect(result.generatedFiles).toContain("components/blocks/chrome/site-nav.tsx");
    expect(result.generatedFiles).toContain("components/blocks/chrome/site-footer.tsx");
    expect(result.generatedFiles).toContain("app/(site)/layout.tsx");
    const nav = readFileSync(join(app, "components/blocks/navbar.tsx"), "utf8");
    // Customized (nav entry + composed brand), not the pristine placeholder.
    expect(nav).toContain('{ label: "About", href: "/about" }');
  });

  it("customizes a brand-new group's chrome block even WITHOUT --nav (P1)", async () => {
    // Without --nav the chrome block must still be brand/nav customized to match
    // compose (never left as the pristine placeholder-carrying install).
    const app = join(root, "store-nonav");
    seedProject(app, "Acme Store");
    await composeApp({
      targetDir: app,
      template: "store",
      choices: { pages: ["/login"], brand: "Acme Store" },
      skipInstall: true,
    });
    const result = await addPage({
      targetDir: app,
      route: "/about",
      blocks: ["about"],
      chrome: "site",
      app: "store",
      skipInstall: true,
    });
    expect(existsSync(join(app, "components/blocks/navbar.tsx"))).toBe(true);
    const nav = readFileSync(join(app, "components/blocks/navbar.tsx"), "utf8");
    // Brand replaced (no leftover ">Cronus<" placeholder wordmark).
    expect(nav).not.toContain(">Cronus<");
    expect(nav).toContain("Acme Store");
    // The customized block is tracked as a generated file.
    expect(result.generatedFiles).toContain("components/blocks/navbar.tsx");
  });

  // --- P2: inline --blocks slug=variant wins over recorded family override ----
  it("the new page's inline variant WINS over a recorded family override (P2)", async () => {
    const app = join(root, "variant-app");
    seedProject(app);
    // Compose saas with a recorded family override login=minimal.
    await composeApp({
      targetDir: app,
      template: "saas",
      choices: { pages: ["/login"], variants: { login: "minimal" } },
      skipInstall: true,
    });
    // A later add-page explicitly asks for login=split — it must win.
    const result = await addPage({
      targetDir: app,
      route: "/signin2",
      blocks: [{ block: "login", variant: "split" }],
      chrome: "bare",
      app: "saas",
      skipInstall: true,
    });
    const page = readFileSync(join(app, "app/(bare)/signin2/page.tsx"), "utf8");
    expect(page).toContain('from "@/components/blocks/login-split"');
    expect(page).toContain("<LoginSplitBlock />");
    expect(page).not.toContain("LoginMinimalBlock");
    // The requested variant item is actually installed (not silently skipped).
    expect(result.installedBlocks).toContain("login--split");
    // The recorded family override is untouched (only stripped for the re-plan).
    const config = await readConfig(app);
    expect(config.composed?.saas?.choices.variants).toEqual({ login: "minimal" });
  });

  it("a recorded override still applies to a SIBLING re-render the new page does not re-declare (P2)", async () => {
    // The strip is surgical: only slugs the NEW page references inline are removed
    // from the override, so an unrelated recorded variant keeps steering siblings.
    const app = join(root, "variant-sibling");
    seedProject(app);
    await composeApp({
      targetDir: app,
      template: "saas",
      choices: { pages: ["/login"], variants: { login: "minimal" } },
      skipInstall: true,
    });
    // Add a page that does NOT touch login → login=minimal must still govern the
    // existing /login page's recorded choice (unchanged) and the re-plan.
    await addPage({
      targetDir: app,
      route: "/signup",
      blocks: ["signup"],
      chrome: "bare",
      app: "saas",
      skipInstall: true,
    });
    const config = await readConfig(app);
    expect(config.composed?.saas?.choices.variants).toEqual({ login: "minimal" });
  });

  // --- P2: manifest provenance — fail loud on a bundled-name collision --------
  it("fails loud when a --manifest app whose name collides with a bundled template is reloaded without --manifest (P2)", async () => {
    const app = join(root, "collide-app");
    seedProject(app);
    // A CUSTOM manifest named "store" (collides with the bundled store template)
    // with a page the bundled store does NOT declare.
    const manifestPath = join(app, "my-store.json");
    writeFileSync(
      manifestPath,
      JSON.stringify({
        name: "store",
        type: "registry:app",
        planVersion: 1,
        manifest: {
          title: "My Store",
          description: "custom",
          chrome: { site: { navbar: "navbar", footer: "footer" } },
          pages: [
            { route: "/", title: "Home", nav: "Home", chrome: "site", blocks: ["hero"] },
            {
              route: "/specials",
              title: "Specials",
              nav: "Specials",
              chrome: "site",
              blocks: ["cta"],
            },
          ],
        },
      }),
    );
    await composeApp({ targetDir: app, manifestPath, skipInstall: true });
    // Sanity: the custom page was tracked.
    const before = await readConfig(app);
    expect(before.composed?.store?.choices.pages).toEqual(["/", "/specials"]);

    // add-page WITHOUT --manifest must NOT silently load the bundled store (which
    // lacks /specials) — it fails loud demanding --manifest.
    await expect(
      addPage({
        targetDir: app,
        route: "/faq",
        blocks: ["faq"],
        nav: "FAQ",
        app: "store",
        skipInstall: true,
      }),
    ).rejects.toThrow(/does not match the manifest|Re-run with --manifest/);

    // The record is untouched — /specials is still tracked, nothing dropped.
    const after = await readConfig(app);
    expect(after.composed?.store?.choices.pages).toEqual(["/", "/specials"]);
  });

  it("a bundled app grown by a prior add-page still reloads fine without --manifest (P2 no-false-positive)", async () => {
    // add-page routinely adds routes NOT in the bundled template. A second
    // add-page (no --manifest) must NOT trip the provenance guard: the recorded
    // hash is the bundled template's, which still matches on reload.
    const app = join(root, "grown-app");
    seedProject(app, "Minha Loja");
    await composeApp({
      targetDir: app,
      template: "landing",
      choices: { brand: "Minha Loja" },
      skipInstall: true,
    });
    await addPage({
      targetDir: app,
      route: "/faq",
      blocks: ["faq"],
      nav: "FAQ",
      app: "landing",
      skipInstall: true,
    });
    // Second add-page of ANOTHER new route, still no --manifest — must SUCCEED
    // (the provenance guard passes because the recorded hash is the bundled
    // template's). NOTE: reconstructing add-page-added routes across re-plans is a
    // separate pre-existing limitation (they are not in the bundled manifest), so
    // this test asserts only that the guard does not false-positive here.
    const result = await addPage({
      targetDir: app,
      route: "/pricing",
      blocks: ["pricing"],
      app: "landing",
      skipInstall: true,
    });
    expect(result.route).toBe("/pricing");
    expect(existsSync(join(app, "app/(site)/pricing/page.tsx"))).toBe(true);
  });

  it("re-passing --manifest for a colliding-name app works (P2 control)", async () => {
    const app = join(root, "collide-ok");
    seedProject(app);
    const manifestPath = join(app, "my-store.json");
    writeFileSync(
      manifestPath,
      JSON.stringify({
        name: "store",
        type: "registry:app",
        planVersion: 1,
        manifest: {
          title: "My Store",
          description: "custom",
          chrome: { site: { navbar: "navbar", footer: "footer" } },
          pages: [
            { route: "/", title: "Home", nav: "Home", chrome: "site", blocks: ["hero"] },
            {
              route: "/specials",
              title: "Specials",
              nav: "Specials",
              chrome: "site",
              blocks: ["cta"],
            },
          ],
        },
      }),
    );
    await composeApp({ targetDir: app, manifestPath, skipInstall: true });
    const result = await addPage({
      targetDir: app,
      route: "/faq",
      blocks: ["faq"],
      nav: "FAQ",
      app: "store",
      manifestPath,
      skipInstall: true,
    });
    expect(result.route).toBe("/faq");
    const after = await readConfig(app);
    // Both the original custom page and the new one survive.
    expect(after.composed?.store?.choices.pages).toEqual(["/", "/specials", "/faq"]);
  });

  // --- P2: cross-group overwrite removes the old page.tsx ---------------------
  it("--overwrite moving a route to a DIFFERENT chrome group deletes the old page (P2)", async () => {
    const app = join(root, "move-app");
    seedProject(app);
    // store: /login is chrome "bare". Compose it (+ "/" so the site group exists).
    await composeApp({
      targetDir: app,
      template: "store",
      choices: { pages: ["/", "/login"] },
      skipInstall: true,
    });
    expect(existsSync(join(app, "app/(bare)/login/page.tsx"))).toBe(true);

    // Overwrite /login into the "site" group → old (bare) page must be removed.
    const result = await addPage({
      targetDir: app,
      route: "/login",
      blocks: ["signup"],
      chrome: "site",
      overwrite: true,
      app: "store",
      skipInstall: true,
    });
    expect(existsSync(join(app, "app/(site)/login/page.tsx"))).toBe(true);
    expect(existsSync(join(app, "app/(bare)/login/page.tsx"))).toBe(false);
    // The old path is gone from composed.files; only the new one remains.
    const config = await readConfig(app);
    const files = config.composed?.store?.files ?? [];
    expect(files).toContain("app/(site)/login/page.tsx");
    expect(files).not.toContain("app/(bare)/login/page.tsx");
    // The base snapshot of the old page is removed too.
    expect(existsSync(join(app, ".cronus-ui/base/store/app/(bare)/login/page.tsx"))).toBe(false);
    expect(result.route).toBe("/login");
  });

  it("in-group --overwrite (same chrome) keeps a single page in place (P2 control)", async () => {
    const app = join(root, "inplace-app");
    seedProject(app);
    await composeApp({
      targetDir: app,
      template: "store",
      choices: { pages: ["/", "/login"] },
      skipInstall: true,
    });
    await addPage({
      targetDir: app,
      route: "/login",
      blocks: ["signup"],
      chrome: "bare",
      overwrite: true,
      app: "store",
      skipInstall: true,
    });
    // Same path replaced in place; no stray site copy created.
    expect(existsSync(join(app, "app/(bare)/login/page.tsx"))).toBe(true);
    expect(existsSync(join(app, "app/(site)/login/page.tsx"))).toBe(false);
  });

  // --- P2: dry-run predicts EXACTLY what apply writes ------------------------
  it("--dry-run matches the apply path for a brand-new shell group (P2)", async () => {
    const app = join(root, "dry-shell");
    seedProject(app);
    await composeApp({
      targetDir: app,
      template: "saas",
      choices: { pages: ["/login", "/signup"] },
      skipInstall: true,
    });

    const preview = await previewAddPage({
      targetDir: app,
      route: "/dashboard",
      blocks: ["dashboard", "stats"],
      chrome: "shell",
      nav: "Dashboard",
      app: "saas",
    });
    // Nothing written by the dry-run.
    expect(existsSync(join(app, "app/(shell)/dashboard/page.tsx"))).toBe(false);

    const result = await addPage({
      targetDir: app,
      route: "/dashboard",
      blocks: ["dashboard", "stats"],
      chrome: "shell",
      nav: "Dashboard",
      app: "saas",
      skipInstall: true,
    });

    // The prediction is EXACTLY the set apply wrote (order-independent).
    expect([...preview.wouldWrite].sort()).toEqual([...result.generatedFiles].sort());
    // Specifically: the wrapper is predicted, the raw chrome block is NOT falsely
    // predicted as a standalone write, and the layout is predicted.
    expect(preview.wouldWrite).toContain("components/blocks/chrome/app-shell.tsx");
    expect(preview.wouldWrite).toContain("app/(shell)/layout.tsx");
    // The installed chrome block is predicted in wouldInstall (matches result).
    expect(preview.wouldInstall).toEqual(expect.arrayContaining(result.installedBlocks));
    expect([...preview.wouldInstall].sort()).toEqual([...result.installedBlocks].sort());
    // New shell chrome is gold-patched, not left as catalog Mara.
    const newShellChrome = readFileSync(
      join(app, "components/blocks/app-shell-chrome.tsx"),
      "utf8",
    );
    expect(newShellChrome).toContain("WorkspaceMenu");
    expect(newShellChrome).toContain("InviteMember");
    expect(newShellChrome).toContain("SessionUser");
    expect(newShellChrome).not.toContain("WORKSPACES");
    expect(newShellChrome).not.toContain("../lib/demo-saas.js");
    const newShellLayout = readFileSync(join(app, "app/(shell)/layout.tsx"), "utf8");
    expect(newShellLayout).toContain("auth.api.getSession");
    expect(newShellLayout).toContain('redirect("/login")');
    expect(newShellLayout).toContain('from "@/lib/auth"');
  });

  it("add-page --nav on a composed saas app keeps gold-path chrome (WorkspaceMenu)", async () => {
    const app = join(root, "saas-nav");
    seedProject(app, "Painel");
    await composeApp({
      targetDir: app,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    const chromeBefore = readFileSync(join(app, "components/blocks/app-shell-chrome.tsx"), "utf8");
    expect(chromeBefore).toContain("WorkspaceMenu");
    expect(chromeBefore).toContain("InviteMember");
    expect(chromeBefore).toContain("SessionUser");

    const result = await addPage({
      targetDir: app,
      route: "/faq",
      blocks: ["faq"],
      chrome: "shell",
      nav: "FAQ",
      app: "saas",
      skipInstall: true,
    });
    expect(result.generatedFiles).toContain("app/(shell)/faq/page.tsx");
    expect(result.generatedFiles).toContain("components/blocks/app-shell-chrome.tsx");

    const chrome = readFileSync(join(app, "components/blocks/app-shell-chrome.tsx"), "utf8");
    expect(chrome).toContain('{ label: "FAQ", href: "/faq" }');
    expect(chrome).toContain('{ label: "Items", href: "/" }');
    expect(chrome).toContain("WorkspaceMenu");
    expect(chrome).toContain("InviteMember");
    expect(chrome).toContain("SessionUser");
    expect(chrome).toContain("Painel");
    expect(chrome).not.toContain("WORKSPACES");
    expect(chrome).not.toContain("WorkspaceSwitcher");
    expect(chrome).not.toContain("InviteDialog");
    expect(chrome).not.toContain("../lib/demo-saas.js");
    const layout = readFileSync(join(app, "app/(shell)/layout.tsx"), "utf8");
    expect(layout).toContain("auth.api.getSession");
    expect(layout).toContain('redirect("/login")');
    const team = readFileSync(join(app, "app/(shell)/team/page.tsx"), "utf8");
    expect(team).toContain("MembersPanel");
    expect(team).not.toContain("TeamBlock");
  });

  it("add-page --overwrite /team on a composed saas app keeps MembersPanel", async () => {
    const app = join(root, "saas-team");
    seedProject(app, "Painel");
    await composeApp({
      targetDir: app,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    expect(readFileSync(join(app, "app/(shell)/team/page.tsx"), "utf8")).toContain("MembersPanel");

    const result = await addPage({
      targetDir: app,
      route: "/team",
      blocks: ["team"],
      chrome: "shell",
      overwrite: true,
      app: "saas",
      skipInstall: true,
    });
    expect(result.generatedFiles).toContain("app/(shell)/team/page.tsx");

    const team = readFileSync(join(app, "app/(shell)/team/page.tsx"), "utf8");
    expect(team).toContain("MembersPanel");
    expect(team).toContain("export default async function");
    expect(team).not.toContain("TeamBlock");
  });

  it("--dry-run matches the apply path for a --nav add on an EXISTING group (P2)", async () => {
    const app = join(root, "dry-existing");
    seedProject(app, "Minha Loja");
    await composeApp({
      targetDir: app,
      template: "landing",
      choices: { brand: "Minha Loja" },
      skipInstall: true,
    });
    const preview = await previewAddPage({
      targetDir: app,
      route: "/faq",
      blocks: ["stats"],
      nav: "FAQ",
      app: "landing",
    });
    const result = await addPage({
      targetDir: app,
      route: "/faq",
      blocks: ["stats"],
      nav: "FAQ",
      app: "landing",
      skipInstall: true,
    });
    expect([...preview.wouldWrite].sort()).toEqual([...result.generatedFiles].sort());
  });
});
