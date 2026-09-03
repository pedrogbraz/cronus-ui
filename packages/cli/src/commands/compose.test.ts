import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CLI_VERSION, CONFIG_FILE, DEFAULT_CONFIG, readConfig } from "../config.js";
import { composeApp, parseVariants } from "./compose.js";

/**
 * Integration tests for the compose apply core against the REAL repo registry
 * directory (the same seam the MCP smoke test uses: `Registry` accepts a local
 * dir). Requires `registry/meta.json` to exist — it is committed, and the whole
 * suite is skipped if it is not present.
 */

const REPO_REGISTRY = fileURLToPath(new URL("../../../../registry", import.meta.url));
const HAS_REGISTRY = existsSync(join(REPO_REGISTRY, "meta.json"));

describe("parseVariants — --variant slug=variant parsing", () => {
  it("parses one or more slug=variant pairs into a record (last wins)", () => {
    expect(parseVariants(["login=split"])).toEqual({ login: "split" });
    expect(parseVariants(["login=split", "footer=mega"])).toEqual({
      login: "split",
      footer: "mega",
    });
    expect(parseVariants(["login=split", "login=minimal"])).toEqual({ login: "minimal" });
  });

  it("returns {} for no flags", () => {
    expect(parseVariants(undefined)).toEqual({});
    expect(parseVariants([])).toEqual({});
  });

  it("throws a clear error on a malformed pair", () => {
    expect(() => parseVariants(["login"])).toThrow(/expected "slug=variant"/);
    expect(() => parseVariants(["=split"])).toThrow(/expected "slug=variant"/);
    expect(() => parseVariants(["login="])).toThrow(/expected "slug=variant"/);
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

describe.skipIf(!HAS_REGISTRY)("composeApp — integration (local repo registry)", () => {
  let root: string;
  let cwd: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cronus-compose-test-"));
    cwd = join(root, "project");
    seedProject(cwd);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it("composes the bundled landing template end-to-end", async () => {
    const result = await composeApp({
      targetDir: cwd,
      template: "landing",
      choices: { brand: "Minha Loja" },
      skipInstall: true,
    });

    expect(result.templateName).toBe("landing");
    // Pages + layout + chrome wrappers generated.
    expect(result.generatedFiles).toContain("app/(site)/page.tsx");
    expect(result.generatedFiles).toContain("app/(site)/layout.tsx");
    expect(result.generatedFiles).toContain("components/blocks/chrome/site-nav.tsx");
    expect(result.generatedFiles).toContain("components/blocks/chrome/site-footer.tsx");

    // GOLDEN RULE: the page imports blocks and stacks them in a <main>.
    const page = readFileSync(join(cwd, "app/(site)/page.tsx"), "utf8");
    expect(page).toContain('from "@/components/blocks/hero"');
    expect(page).toContain("<HeroBlock />");
    expect(page).toContain("<main");

    // Chrome blocks were installed AND customized (brand replaced, nav injected).
    const navbar = readFileSync(join(cwd, "components/blocks/navbar.tsx"), "utf8");
    expect(navbar).toContain("Minha Loja");
    expect(navbar).not.toContain(">Cronus<");
    expect(navbar).toContain('{ label: "Home", href: "/" }');

    // installed{} records the blocks; composed{} records the app.
    const config = await readConfig(cwd);
    expect(config.installed?.navbar).toBeDefined();
    expect(config.installed?.hero).toBeDefined();
    expect(config.composed?.landing).toBeDefined();
    expect(config.composed?.landing?.version).toBe(CLI_VERSION);
    expect(config.composed?.landing?.planVersion).toBe(1);
    expect(config.composed?.landing?.choices.brand).toBe("Minha Loja");
    expect(config.composed?.landing?.files).toContain("app/(site)/page.tsx");
    expect(existsSync(join(cwd, "DESIGN.md"))).toBe(true);
    expect(readFileSync(join(cwd, "DESIGN.md"), "utf8")).toContain("Cronus UI — DESIGN.md");
    expect(existsSync(join(cwd, "DESIGN.compact.md"))).toBe(true);

    // Base snapshot mirrors the emitted bytes (F4 merge base), keyed by template
    // name (the composed{} key) — not the package.json name (`loja`).
    const snap = readFileSync(join(cwd, ".cronus-ui/base/landing/app/(site)/page.tsx"), "utf8");
    expect(snap).toBe(page);
    expect(existsSync(join(cwd, ".cronus-ui/base/loja/app/(site)/page.tsx"))).toBe(false);
  });

  it("composes the saas template with password reset and activation routes", async () => {
    const result = await composeApp({ targetDir: cwd, template: "saas", skipInstall: true });
    expect(result.templateName).toBe("saas");
    for (const route of [
      "app/(bare)/login/page.tsx",
      "app/(bare)/signup/page.tsx",
      "app/(bare)/forgot-password/page.tsx",
      "app/(bare)/reset-password/page.tsx",
      "app/(shell)/page.tsx",
      "app/(shell)/analytics/page.tsx",
      "app/(shell)/team/page.tsx",
      "app/(shell)/billing/page.tsx",
      "app/(shell)/settings/page.tsx",
      "app/(shell)/welcome/page.tsx",
      "app/(shell)/setup/page.tsx",
      "app/(shell)/checklist/page.tsx",
    ]) {
      expect(result.generatedFiles).toContain(route);
      expect(existsSync(join(cwd, route))).toBe(true);
    }
    const welcome = readFileSync(join(cwd, "app/(shell)/welcome/page.tsx"), "utf8");
    expect(welcome).toContain("<main");
    expect(welcome).toContain("<WelcomeBlock />");
    const forgot = readFileSync(join(cwd, "app/(bare)/forgot-password/page.tsx"), "utf8");
    expect(forgot).toContain(
      'import { ForgotPasswordSplitBlock } from "@/components/blocks/forgot-password-split";',
    );
    expect(forgot).toContain("<ForgotPasswordSplitBlock />");
    expect(forgot).not.toContain("<ForgotPasswordBlock />");
    expect(result.installedBlocks).toContain("forgot-password--split");
    const reset = readFileSync(join(cwd, "app/(bare)/reset-password/page.tsx"), "utf8");
    expect(reset).toContain(
      'import { ForgotPasswordResetBlock } from "@/components/blocks/forgot-password-reset";',
    );
    expect(reset).toContain("<ForgotPasswordResetBlock />");
    expect(result.installedBlocks).toContain("forgot-password--reset");
    const signup = readFileSync(join(cwd, "app/(bare)/signup/page.tsx"), "utf8");
    expect(signup).toContain(
      'import { SignupSplitBlock } from "@/components/blocks/signup-split";',
    );
    expect(signup).toContain("<SignupSplitBlock />");
    expect(signup).not.toContain("<SignupBlock />");
    expect(result.installedBlocks).toContain("signup--split");
    expect(result.installedBlocks).toContain("login--split");
    expect(existsSync(join(cwd, "components/blocks/signup-split.tsx"))).toBe(true);
    const signupSplit = readFileSync(join(cwd, "components/blocks/signup-split.tsx"), "utf8");
    expect(signupSplit).toContain("cronus-invitation");
    expect(signupSplit).toContain("Join the workspace");
    expect(signupSplit).toContain("Create your Cronus workspace.");
    const loginSplit = readFileSync(join(cwd, "components/blocks/login-split.tsx"), "utf8");
    expect(loginSplit).toContain("cronus-invitation");
    expect(loginSplit).toContain("Join the workspace");
    expect(loginSplit).toContain("Sign in to your Cronus workspace.");

    expect(existsSync(join(cwd, "db/schema.ts"))).toBe(true);
    expect(existsSync(join(cwd, "lib/auth.ts"))).toBe(true);
    expect(existsSync(join(cwd, "middleware.ts"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/auth-adapter.ts"), "utf8")).toMatch(
      /authClient|better-auth/,
    );
    const home = readFileSync(join(cwd, "app/(shell)/page.tsx"), "utf8");
    expect(home).toContain("ItemsPanel");
    expect(home).toContain('title: "Items"');
    expect(home).not.toContain("DashboardAnalyticsBlock");
    expect(home).not.toContain("StatsBlock");
    expect(existsSync(join(cwd, "components/blocks/dashboard.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components/blocks/stats.tsx"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/items.ts"), "utf8")).toContain("createItem");
    expect(readFileSync(join(cwd, "components/items-view.tsx"), "utf8")).toContain('name="title"');
    const teamPage = readFileSync(join(cwd, "app/(shell)/team/page.tsx"), "utf8");
    expect(teamPage).toContain("MembersPanel");
    expect(teamPage).not.toContain("TeamBlock");
    expect(readFileSync(join(cwd, "lib/members.ts"), "utf8")).toContain("loadMembers");
    expect(readFileSync(join(cwd, "lib/members.ts"), "utf8")).toContain("pending");
    expect(readFileSync(join(cwd, "components/members-view.tsx"), "utf8")).toContain(
      "pending-invite",
    );
    expect(readFileSync(join(cwd, "components/invite-member.tsx"), "utf8")).toContain(
      "/accept-invitation?id=",
    );
    expect(result.generatedFiles).toContain("db/schema.ts");
    expect(result.generatedFiles).toContain("middleware.ts");

    const chrome = readFileSync(join(cwd, "components/blocks/app-shell-chrome.tsx"), "utf8");
    expect(chrome).not.toContain("../lib/demo-saas.js");
    expect(chrome).toContain("WorkspaceMenu");
    expect(chrome).toContain("InviteMember");
    expect(chrome).toContain("SessionUser");
    expect(chrome).toContain('{ label: "Items", href: "/" }');
    expect(chrome).toContain('{ label: "Team", href: "/team" }');
    expect(chrome).not.toContain('href: "/analytics"');
    expect(chrome).not.toContain('href: "/billing"');
    expect(chrome).not.toContain('href: "/settings"');
    expect(chrome).not.toContain('href: "/checklist"');
    expect(existsSync(join(cwd, "app/(shell)/analytics/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/billing/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/settings/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/checklist/page.tsx"))).toBe(true);
    expect(readFileSync(join(cwd, "components/session-user.tsx"), "utf8")).toContain(
      "authClient.signOut",
    );
    expect(chrome).not.toContain("WORKSPACES");
    expect(existsSync(join(cwd, "app/(bare)/accept-invitation/page.tsx"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/auth-adapter.ts"), "utf8")).toContain("cronus-invitation");

    expect(readFileSync(join(cwd, "db/schema.ts"), "utf8")).toContain("export const organization");
    expect(readFileSync(join(cwd, "lib/auth.ts"), "utf8")).toContain("sendInvitationEmail");
    expect(readFileSync(join(cwd, "lib/auth.ts"), "utf8")).toContain("localhost:*");
    expect(readFileSync(join(cwd, "app/(shell)/layout.tsx"), "utf8")).toContain(
      "auth.api.getSession",
    );
    expect(existsSync(join(cwd, "components/workspace-menu.tsx"))).toBe(true);

    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
    };
    expect(pkg.dependencies["lucide-react"]).toBe("^0.577.0");
    expect(pkg.dependencies.recharts).toBe("^3.9.2");
    expect(pkg.dependencies["drizzle-orm"]).toBe("^0.45.2");
  });

  it("composes the admin template with the sqlite gold path", async () => {
    const result = await composeApp({ targetDir: cwd, template: "admin", skipInstall: true });
    expect(result.templateName).toBe("admin");
    expect(existsSync(join(cwd, "app/(shell)/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "db/schema.ts"))).toBe(true);
    expect(existsSync(join(cwd, "lib/auth.ts"))).toBe(true);
    expect(existsSync(join(cwd, "middleware.ts"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/auth-adapter.ts"), "utf8")).toContain("authClient");
    expect(readFileSync(join(cwd, "app/(shell)/page.tsx"), "utf8")).toContain("ItemsPanel");
    expect(readFileSync(join(cwd, "app/(shell)/page.tsx"), "utf8")).toContain('title: "Items"');
    expect(readFileSync(join(cwd, "app/(shell)/page.tsx"), "utf8")).not.toContain(
      "DashboardAdminOverviewBlock",
    );
    expect(existsSync(join(cwd, "components/blocks/dashboard-admin-overview.tsx"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/items.ts"), "utf8")).toContain("createItem");
    expect(existsSync(join(cwd, "app/(shell)/team/page.tsx"))).toBe(false);
    const adminChrome = readFileSync(join(cwd, "components/blocks/app-shell-chrome.tsx"), "utf8");
    expect(adminChrome).toContain('{ label: "Items", href: "/" }');
    expect(adminChrome).not.toContain('href: "/users"');
    expect(adminChrome).not.toContain('href: "/analytics"');
    expect(adminChrome).not.toContain('href: "/board"');
    expect(adminChrome).not.toContain('href: "/audit"');
    expect(existsSync(join(cwd, "app/(shell)/users/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(shell)/analytics/page.tsx"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/members.ts"), "utf8")).toContain("loadMembers");
    expect(existsSync(join(cwd, "app/(bare)/forgot-password/page.tsx"))).toBe(true);
    expect(readFileSync(join(cwd, "app/(bare)/forgot-password/page.tsx"), "utf8")).toContain(
      "ForgotPasswordSplitBlock",
    );
    expect(existsSync(join(cwd, "app/(bare)/reset-password/page.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "app/(bare)/signup/page.tsx"))).toBe(true);
    expect(readFileSync(join(cwd, "app/(bare)/signup/page.tsx"), "utf8")).toContain(
      "SignupSplitBlock",
    );
    expect(result.installedBlocks).toContain("signup--split");
    expect(readFileSync(join(cwd, "components/blocks/signup-split.tsx"), "utf8")).toContain(
      "Join the workspace",
    );
    expect(readFileSync(join(cwd, "components/blocks/login-split.tsx"), "utf8")).toContain(
      "Join the workspace",
    );
  });

  it("composes the 9-page store template with all routes", async () => {
    const result = await composeApp({ targetDir: cwd, template: "store", skipInstall: true });
    expect(result.templateName).toBe("store");
    for (const route of [
      "app/(site)/page.tsx",
      "app/(site)/products/page.tsx",
      "app/(site)/products/[id]/page.tsx",
      "app/(site)/cart/page.tsx",
      "app/(bare)/checkout/page.tsx",
      "app/(bare)/login/page.tsx",
      "app/(bare)/signup/page.tsx",
      "app/(site)/account/page.tsx",
      "app/(site)/account/settings/page.tsx",
    ]) {
      expect(result.generatedFiles).toContain(route);
      expect(existsSync(join(cwd, route))).toBe(true);
    }
    // The bare group has no chrome furniture (passthrough layout).
    const bareLayout = readFileSync(join(cwd, "app/(bare)/layout.tsx"), "utf8");
    expect(bareLayout).toContain("return <>{children}</>;");

    // Store stays on the demo path — no drizzle / better-auth / middleware.
    // Login/signup still install the DEMO auth-adapter (no authClient).
    expect(existsSync(join(cwd, "drizzle.config.ts"))).toBe(false);
    expect(existsSync(join(cwd, "db/schema.ts"))).toBe(false);
    expect(existsSync(join(cwd, "lib/auth.ts"))).toBe(false);
    expect(existsSync(join(cwd, "middleware.ts"))).toBe(false);
    expect(existsSync(join(cwd, "lib/auth-adapter.ts"))).toBe(true);
    expect(readFileSync(join(cwd, "lib/auth-adapter.ts"), "utf8")).not.toMatch(
      /authClient|better-auth/,
    );
    expect(readFileSync(join(cwd, "app/(site)/page.tsx"), "utf8")).not.toContain("ItemsPanel");
  });

  it("is deterministic across two independent projects", async () => {
    const cwd2 = join(root, "project2");
    seedProject(cwd2);
    await composeApp({
      targetDir: cwd,
      template: "store",
      choices: { brand: "X" },
      skipInstall: true,
    });
    await composeApp({
      targetDir: cwd2,
      template: "store",
      choices: { brand: "X" },
      skipInstall: true,
    });

    for (const rel of [
      "app/(site)/page.tsx",
      "app/(site)/products/[id]/page.tsx",
      "components/blocks/navbar.tsx",
      "components/blocks/footer.tsx",
    ]) {
      expect(readFileSync(join(cwd, rel), "utf8")).toBe(readFileSync(join(cwd2, rel), "utf8"));
    }
  });

  it("skips existing files without --overwrite and rewrites with it", async () => {
    await composeApp({ targetDir: cwd, template: "landing", skipInstall: true });
    // Hand-edit a generated page.
    const pagePath = join(cwd, "app/(site)/page.tsx");
    writeFileSync(pagePath, "// my edits\n", "utf8");

    const skipped = await composeApp({ targetDir: cwd, template: "landing", skipInstall: true });
    expect(skipped.skippedFiles).toContain("app/(site)/page.tsx");
    expect(readFileSync(pagePath, "utf8")).toBe("// my edits\n");

    const forced = await composeApp({
      targetDir: cwd,
      template: "landing",
      overwrite: true,
      skipInstall: true,
    });
    expect(forced.generatedFiles).toContain("app/(site)/page.tsx");
    expect(readFileSync(pagePath, "utf8")).not.toBe("// my edits\n");
  });

  it("preserves an edited chrome block on a re-compose without --overwrite", async () => {
    await composeApp({ targetDir: cwd, template: "landing", skipInstall: true });

    // The installed chrome copy (customized in place) — hand-edit it.
    const navbarPath = join(cwd, "components/blocks/navbar.tsx");
    const firstCompose = readFileSync(navbarPath, "utf8");
    const edited = `// USER HAND EDIT\n${firstCompose}`;
    writeFileSync(navbarPath, edited, "utf8");

    // A benign re-run without --overwrite must NOT clobber the edit.
    const rerun = await composeApp({ targetDir: cwd, template: "landing", skipInstall: true });
    expect(readFileSync(navbarPath, "utf8")).toBe(edited);
    // The skipped chrome file is surfaced (not silently dropped/uncounted).
    expect(rerun.skippedFiles).toContain("components/blocks/navbar.tsx");
    expect(rerun.generatedFiles).not.toContain("components/blocks/navbar.tsx");

    // --overwrite still re-applies the pristine customized bytes.
    const forced = await composeApp({
      targetDir: cwd,
      template: "landing",
      overwrite: true,
      skipInstall: true,
    });
    expect(readFileSync(navbarPath, "utf8")).toBe(firstCompose);
    expect(forced.generatedFiles).toContain("components/blocks/navbar.tsx");
  });

  it("keeps composed{}.files as a non-empty union across a benign re-compose", async () => {
    await composeApp({ targetDir: cwd, template: "landing", skipInstall: true });
    const first = await readConfig(cwd);
    const firstFiles = first.composed?.landing?.files ?? [];
    expect(firstFiles.length).toBeGreaterThan(0);
    expect(firstFiles).toContain("app/(site)/page.tsx");

    // Benign re-run: everything already exists → generatedFiles is empty…
    const rerun = await composeApp({ targetDir: cwd, template: "landing", skipInstall: true });
    expect(rerun.generatedFiles).toHaveLength(0);

    // …but the record must NOT be clobbered to []: it stays the sorted union.
    const after = await readConfig(cwd);
    const afterFiles = after.composed?.landing?.files ?? [];
    expect(afterFiles).toEqual(firstFiles);
    expect(afterFiles.length).toBeGreaterThan(0);
    expect(afterFiles).toContain("app/(site)/page.tsx");
    expect([...afterFiles].sort()).toEqual(afterFiles); // sorted + deduped

    // The referenced page files + their base snapshots still exist on disk.
    for (const rel of afterFiles) {
      expect(existsSync(join(cwd, rel))).toBe(true);
    }
    expect(existsSync(join(cwd, ".cronus-ui/base/landing/app/(site)/page.tsx"))).toBe(true);
  });

  it("composes a login variant: installs login-split.tsx + page imports LoginSplitBlock", async () => {
    const result = await composeApp({
      targetDir: cwd,
      template: "store",
      choices: { variants: { login: "split" } },
      skipInstall: true,
    });

    // The variant item installs as login-split.tsx (single-dash file basename).
    expect(result.installedBlocks).toContain("login--split");
    expect(result.installedBlocks).not.toContain("login");
    const variantFile = join(cwd, "components/blocks/login-split.tsx");
    expect(existsSync(variantFile)).toBe(true);
    expect(readFileSync(variantFile, "utf8")).toMatch(/export function LoginSplitBlock/);

    // The generated /login page imports the variant export from the variant file.
    const loginPage = readFileSync(join(cwd, "app/(bare)/login/page.tsx"), "utf8");
    expect(loginPage).toContain(
      'import { LoginSplitBlock } from "@/components/blocks/login-split";',
    );
    expect(loginPage).toContain("<LoginSplitBlock />");
    expect(loginPage).not.toContain("<LoginBlock />");

    // The choice is recorded in composed{}.
    const config = await readConfig(cwd);
    expect(config.composed?.store?.choices.variants.login).toBe("split");
    // installed{} tracks the variant item, not the bare block.
    expect(config.installed?.["login--split"]).toBeDefined();
    expect(config.installed?.login).toBeUndefined();
  });

  it("throws a clear error for an unknown template (with a suggestion)", async () => {
    await expect(
      composeApp({ targetDir: cwd, template: "stroe", skipInstall: true }),
    ).rejects.toThrow(/Unknown template "stroe".*Did you mean "store"/);
  });

  it("requires a cronus-ui.json (init first)", async () => {
    const bare = join(root, "bare");
    mkdirSync(bare, { recursive: true });
    await expect(composeApp({ targetDir: bare, template: "store" })).rejects.toThrow(
      /No cronus-ui.json/,
    );
  });
});
