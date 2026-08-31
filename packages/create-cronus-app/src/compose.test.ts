import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { composeTemplate } from "./compose.js";
import { scaffold } from "./scaffold.js";

/**
 * `composeTemplate` is a thin adapter over `cronus-ui`'s `composeApp()` library
 * entry. The happy-path integration exercises it against the REAL repo registry
 * dir (same seam as the CLI's compose.test.ts) — it needs BOTH the committed
 * `registry/meta.json` AND the built `cronus-ui/compose` dist (dynamic import), so
 * it is skipped when either is absent (e.g. a pre-build test run). The graceful
 * paths run always: the adapter must never throw.
 */

const REPO_REGISTRY = fileURLToPath(new URL("../../../registry", import.meta.url));
const COMPOSE_DIST = fileURLToPath(
  new URL("../node_modules/cronus-ui/dist/compose.js", import.meta.url),
);
const CAN_COMPOSE = existsSync(join(REPO_REGISTRY, "meta.json")) && existsSync(COMPOSE_DIST);

/** A minimal scaffolded project (package.json + cronus-ui.json) for the composer. */
function seedProject(cwd: string, registry: string, name = "loja"): void {
  mkdirSync(cwd, { recursive: true });
  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({ name, version: "0.0.0", private: true }),
  );
  writeFileSync(
    join(cwd, "cronus-ui.json"),
    JSON.stringify(
      {
        aliases: { ui: "@/components/ui", lib: "@/lib", blocks: "@/components/blocks" },
        paths: { ui: "components/ui", lib: "lib", blocks: "components/blocks" },
        registry,
      },
      null,
      2,
    ),
  );
}

describe("composeTemplate — graceful failure (never throws)", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cca-compose-"));
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("returns { ok: false } when the target has no cronus-ui.json", async () => {
    const bare = join(root, "bare");
    mkdirSync(bare, { recursive: true });
    const result = await composeTemplate({
      targetDir: bare,
      template: "store",
      brand: "Bare",
      skipInstall: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/cronus-ui\.json/);
  });

  it("returns { ok: false } when the registry lacks a meta.json sidecar", async () => {
    const cwd = join(root, "no-meta");
    // Point at an empty local dir → index()/meta() both miss → graceful skip.
    const emptyRegistry = join(root, "empty-registry");
    mkdirSync(emptyRegistry, { recursive: true });
    seedProject(cwd, emptyRegistry);
    const result = await composeTemplate({
      targetDir: cwd,
      template: "store",
      brand: "NoMeta",
      registry: emptyRegistry,
      skipInstall: true,
    });
    expect(result.ok).toBe(false);
  });
});

describe.skipIf(!CAN_COMPOSE)("composeTemplate — integration (local repo registry)", () => {
  let root: string;
  let cwd: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cca-compose-int-"));
    cwd = join(root, "loja");
    seedProject(cwd, REPO_REGISTRY);
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("composes the landing template and reports page/block counts", async () => {
    const result = await composeTemplate({
      targetDir: cwd,
      template: "landing",
      brand: "Minha Loja",
      registry: REPO_REGISTRY,
      skipInstall: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pageCount).toBeGreaterThan(0);
    expect(result.blockCount).toBeGreaterThan(0);
    expect(result.files).toContain("app/(site)/page.tsx");

    // The generated page follows the golden rule (imports blocks + <main>).
    const page = readFileSync(join(cwd, "app/(site)/page.tsx"), "utf8");
    expect(page).toContain("<main");
    // Brand was baked into the installed navbar copy.
    const navbar = readFileSync(join(cwd, "components/blocks/navbar.tsx"), "utf8");
    expect(navbar).toContain("Minha Loja");
  });

  it("composes a named landing flavor (landing-studio) from validated blocks", async () => {
    const result = await composeTemplate({
      targetDir: cwd,
      template: "landing-studio",
      brand: "Studio",
      registry: REPO_REGISTRY,
      skipInstall: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pageCount).toBe(1);
    expect(result.files).toContain("app/(site)/page.tsx");
    const page = readFileSync(join(cwd, "app/(site)/page.tsx"), "utf8");
    expect(page).toContain("<main");
    expect(page).toMatch(/AtmosphereHeroBlock|HeroBlock/);
  });

  it("composes the store template into (site)/(bare) route groups", async () => {
    const result = await composeTemplate({
      targetDir: cwd,
      template: "store",
      brand: "loja",
      registry: REPO_REGISTRY,
      skipInstall: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // 9 manifest pages → 9 generated page.tsx files.
    expect(result.pageCount).toBe(9);
    expect(existsSync(join(cwd, "app/(site)/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(bare)/login/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(site)/products/page.tsx"))).toBe(true);

    // The brand reaches the VISIBLE chrome via the brandTokens literal path (not
    // a generated lib/brand.ts, which does not exist): the installed navbar copy
    // carries the app brand, and the generated home page is tracked in composed{}.
    expect(existsSync(join(cwd, "lib/brand.ts"))).toBe(false);
    const navbar = readFileSync(join(cwd, "components/blocks/navbar.tsx"), "utf8");
    expect(navbar).toContain("loja");
    expect(result.files).toContain("app/(site)/page.tsx");

    expect(existsSync(join(cwd, "drizzle.config.ts"))).toBe(false);
    expect(existsSync(join(cwd, "db/schema.ts"))).toBe(false);
    expect(existsSync(join(cwd, "lib/auth.ts"))).toBe(false);
    expect(existsSync(join(cwd, "middleware.ts"))).toBe(false);
    expect(existsSync(join(cwd, "lib/auth-adapter.ts"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/auth-adapter.ts"), "utf8")).not.toMatch(
      /authClient|better-auth/,
    );
  });

  it("composes the Pro mail pack into (shell)/(bare) from validated blocks", async () => {
    const result = await composeTemplate({
      targetDir: cwd,
      template: "mail",
      brand: "Inbox",
      registry: REPO_REGISTRY,
      skipInstall: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pageCount).toBe(4);
    expect(existsSync(join(cwd, "app/(bare)/login/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/compose/page.tsx"))).toBe(true);
    const home = readFileSync(join(cwd, "app/(shell)/page.tsx"), "utf8");
    expect(home).toContain("<main");
    expect(home).toMatch(/notification-panel|NotificationPanel/);
  });

  it("composes the saas template into (shell)/(bare) route groups with the app-shell chrome", async () => {
    const result = await composeTemplate({
      targetDir: cwd,
      template: "saas",
      brand: "Painel",
      registry: REPO_REGISTRY,
      skipInstall: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // 11 manifest pages + gold-path accept-invitation.
    expect(result.pageCount).toBe(12);
    expect(existsSync(join(cwd, "app/(bare)/accept-invitation/page.tsx"))).toBe(true);
    // Bare auth pages + shell pages. The dashboard is the shell HOME at "/", so it
    // lives at app/(shell)/page.tsx (not /dashboard) — this is the polished landing
    // surface that create-cronus-app opens on, and it supersedes the base app/page.tsx.
    expect(existsSync(join(cwd, "app/(bare)/login/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(bare)/forgot-password/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/dashboard/page.tsx"))).toBe(false);
    expect(existsSync(join(cwd, "app/(shell)/settings/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/welcome/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/setup/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/checklist/page.tsx"))).toBe(true);

    // The (shell) layout is a thin AppShellNav wrapper (golden rule).
    const layout = readFileSync(join(cwd, "app/(shell)/layout.tsx"), "utf8");
    expect(layout).toContain("<AppShellNav>{children}</AppShellNav>");
    const wrapper = readFileSync(join(cwd, "components/blocks/chrome/app-shell.tsx"), "utf8");
    expect(wrapper).toContain("AppShellChromeBlock");

    // The login page uses the split variant (imported from the dash-named file).
    const login = readFileSync(join(cwd, "app/(bare)/login/page.tsx"), "utf8");
    expect(login).toContain("login-split");

    // The installed shell block copy carries the real sidebar nav + brand. The
    // Dashboard nav entry now points at "/" (the shell home), not "/dashboard".
    const shellBlock = readFileSync(join(cwd, "components/blocks/app-shell-chrome.tsx"), "utf8");
    expect(shellBlock).toContain('{ label: "Dashboard", href: "/" }');
    expect(shellBlock).toContain('{ label: "Setup", href: "/checklist" }');
    expect(shellBlock).not.toContain('href: "/welcome"');
    expect(shellBlock).not.toContain('href: "/setup"');
    expect(shellBlock).toContain("Painel");
    // It stays a client boundary (AppShell/Sidebar use hooks) for the RSC layout.
    expect(shellBlock.startsWith('"use client"')).toBe(true);

    // Chrome identity comes from the session, not the demo-saas USER / Lena Park.
    expect(shellBlock).not.toContain("../lib/demo-saas.js");
    expect(shellBlock).toContain("WorkspaceMenu");
    expect(shellBlock).toContain("InviteMember");
    expect(shellBlock).toContain("SessionUser");
    expect(shellBlock).not.toContain("WORKSPACES");
    expect(shellBlock).not.toContain("demo-saas");
    expect(shellBlock).not.toContain("Lena Park");
    expect(shellBlock).not.toContain("lena@acme.dev");
    const statsBlock = readFileSync(join(cwd, "components/blocks/stats.tsx"), "utf8");
    expect(statsBlock).toContain('from "@/lib/demo-saas"');
    expect(statsBlock).toContain("KPIS");
    const dashboardBlock = readFileSync(join(cwd, "components/blocks/dashboard.tsx"), "utf8");
    expect(dashboardBlock).not.toContain("Lena Park");
    expect(dashboardBlock).toContain("demo-saas");

    expect(existsSync(join(cwd, "db/schema.ts"))).toBe(true);
    expect(existsSync(join(cwd, "lib/auth.ts"))).toBe(true);
    expect(existsSync(join(cwd, "middleware.ts"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/auth-adapter.ts"), "utf8")).toMatch(
      /authClient|better-auth/,
    );
    expect(readFileSync(join(cwd, "app/(shell)/page.tsx"), "utf8")).toContain("ItemsPanel");
    expect(readFileSync(join(cwd, "lib/items.ts"), "utf8")).toContain("createItem");
    expect(readFileSync(join(cwd, "components/items-view.tsx"), "utf8")).toContain('name="title"');
    const teamPage = readFileSync(join(cwd, "app/(shell)/team/page.tsx"), "utf8");
    expect(teamPage).toContain("MembersPanel");
    expect(teamPage).not.toContain("TeamBlock");
    expect(readFileSync(join(cwd, "lib/members.ts"), "utf8")).toContain("loadMembers");

    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
    };
    expect(pkg.dependencies["lucide-react"]).toBe("^0.577.0");
    expect(pkg.dependencies.recharts).toBe("^3.9.2");
  });

  it("composes the admin template into (shell)/(bare) with the admin-overview dashboard", async () => {
    const result = await composeTemplate({
      targetDir: cwd,
      template: "admin",
      brand: "Console",
      registry: REPO_REGISTRY,
      skipInstall: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pageCount).toBe(7);
    expect(existsSync(join(cwd, "app/(bare)/accept-invitation/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(bare)/login/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/users/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/analytics/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/board/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/audit/page.tsx"))).toBe(true);

    const login = readFileSync(join(cwd, "app/(bare)/login/page.tsx"), "utf8");
    expect(login).toContain("login-split");
    const home = readFileSync(join(cwd, "app/(shell)/page.tsx"), "utf8");
    expect(home).toMatch(/dashboard-admin-overview|admin-overview/);
    const shellBlock = readFileSync(join(cwd, "components/blocks/app-shell-chrome.tsx"), "utf8");
    expect(shellBlock).toContain('{ label: "Overview", href: "/" }');
    expect(shellBlock).toContain("Console");
    expect(shellBlock.startsWith('"use client"')).toBe(true);

    expect(existsSync(join(cwd, "db/schema.ts"))).toBe(true);
    expect(existsSync(join(cwd, "lib/auth.ts"))).toBe(true);
    expect(existsSync(join(cwd, "middleware.ts"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/auth-adapter.ts"), "utf8")).toMatch(
      /authClient|better-auth/,
    );
    expect(readFileSync(join(cwd, "app/(shell)/page.tsx"), "utf8")).toContain("ItemsPanel");
    expect(readFileSync(join(cwd, "lib/items.ts"), "utf8")).toContain("createItem");
  });

  it("composes the docs template into (site) chrome from content blocks, not landing-docs", async () => {
    const result = await composeTemplate({
      targetDir: cwd,
      template: "docs",
      brand: "Docs",
      registry: REPO_REGISTRY,
      skipInstall: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pageCount).toBe(5);
    expect(existsSync(join(cwd, "app/(site)/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(site)/blog/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(site)/blog/[slug]/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(site)/faq/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(site)/about/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/page.tsx"))).toBe(false);

    const home = readFileSync(join(cwd, "app/(site)/page.tsx"), "utf8");
    expect(home).toMatch(/changelog|Changelog/);
    expect(home).not.toMatch(/hero-compact|Hero/);
    const article = readFileSync(join(cwd, "app/(site)/blog/[slug]/page.tsx"), "utf8");
    expect(article).toMatch(/blog-post-with-sidebar|with-sidebar/);
  });
});

/**
 * The wired `create-cronus-app --template store|landing` flow scaffolds the
 * `default` base (which ships `app/page.tsx`) and THEN composes on top. Since a
 * route group like `(site)` is path-transparent, the base `app/page.tsx` and the
 * generated `app/(site)/page.tsx` would BOTH own "/", which `next build` rejects
 * ("two parallel pages resolve to /") or, on Turbopack, silently serves the wrong
 * (base) home. `composeTemplate` must delete the superseded base page — these
 * tests reproduce the REAL scaffold+compose path (not the minimal seedProject).
 */
describe.skipIf(!CAN_COMPOSE)("composeTemplate — base app/page.tsx collision (real base)", () => {
  let root: string;
  let cwd: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cca-compose-base-"));
    cwd = join(root, "loja");
    // Scaffold the REAL default base so app/page.tsx actually exists on disk
    // before composing — the exact collision source the CLI hits.
    scaffold({ targetDir: cwd, name: "loja", template: "store" });
    // The base ships app/page.tsx + app/layout.tsx; without a fix they'd collide.
    expect(existsSync(join(cwd, "app/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/layout.tsx"))).toBe(true);
    // Point the scaffolded config at the repo registry (has meta.json).
    const configPath = join(cwd, "cronus-ui.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.registry = REPO_REGISTRY;
    writeFileSync(configPath, JSON.stringify(config, null, 2));
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  /** Every dir under app/ that holds a page.tsx (route-group-relative path). */
  function pageDirs(appDir: string, rel = ""): string[] {
    const out: string[] = [];
    for (const entry of readdirSync(appDir, { withFileTypes: true })) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) out.push(...pageDirs(join(appDir, entry.name), childRel));
      else if (entry.name === "page.tsx") out.push(rel);
    }
    return out;
  }

  /** Route each page resolves to, with path-transparent (group) segments dropped. */
  function resolvedRoute(pageDir: string): string {
    const segs = pageDir.split("/").filter((s) => s.length > 0 && !/^\(.*\)$/.test(s));
    return `/${segs.join("/")}`;
  }

  it.each([
    "store",
    "landing",
    "landing-studio",
  ] as const)("removes the base app/page.tsx so exactly one page resolves to / (%s)", async (template) => {
    const result = await composeTemplate({
      targetDir: cwd,
      template,
      brand: "Minha Loja",
      registry: REPO_REGISTRY,
      skipInstall: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // The composer authored the "/" home under the route group…
    expect(existsSync(join(cwd, "app/(site)/page.tsx"))).toBe(true);
    // …and the colliding base page is gone.
    expect(existsSync(join(cwd, "app/page.tsx"))).toBe(false);
    // The root layout (required <html>/<body>) is KEPT — only the PAGE collides.
    expect(existsSync(join(cwd, "app/layout.tsx"))).toBe(true);

    // No two pages resolve to the same URL after stripping route groups.
    const routes = pageDirs(join(cwd, "app")).map(resolvedRoute);
    expect(routes).toContain("/");
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("removes the base app/page.tsx for saas (dashboard is the shell home at /)", async () => {
    // Re-scaffold with the saas base (default) so app/page.tsx exists on disk.
    scaffold({ targetDir: cwd, name: "loja", template: "saas" });
    const configPath = join(cwd, "cronus-ui.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.registry = REPO_REGISTRY;
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    expect(existsSync(join(cwd, "app/page.tsx"))).toBe(true);

    const result = await composeTemplate({
      targetDir: cwd,
      template: "saas",
      brand: "Painel",
      registry: REPO_REGISTRY,
      skipInstall: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // The composed dashboard owns "/" under the shell group…
    expect(existsSync(join(cwd, "app/(shell)/page.tsx"))).toBe(true);
    // …so the throwaway base starter is gone (the app opens on the real dashboard).
    expect(existsSync(join(cwd, "app/page.tsx"))).toBe(false);
    // The root layout (required <html>/<body>) is KEPT.
    expect(existsSync(join(cwd, "app/layout.tsx"))).toBe(true);

    // No two pages resolve to the same URL after stripping route groups, and
    // exactly one owns "/".
    const routes = pageDirs(join(cwd, "app")).map(resolvedRoute);
    expect(routes).toContain("/");
    expect(routes.filter((r) => r === "/").length).toBe(1);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("keeps the base app/page.tsx when compose fails (never orphans the home route)", async () => {
    // An empty registry → compose fails gracefully; the base page must survive so
    // the fallback `default` scaffold still has a working "/" route.
    const emptyRegistry = join(root, "empty-registry");
    mkdirSync(emptyRegistry, { recursive: true });
    const result = await composeTemplate({
      targetDir: cwd,
      template: "store",
      brand: "Minha Loja",
      registry: emptyRegistry,
      skipInstall: true,
    });
    expect(result.ok).toBe(false);
    // Compose never ran → base page is untouched (still the app's "/" route).
    expect(existsSync(join(cwd, "app/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(site)/page.tsx"))).toBe(false);
  });
});
