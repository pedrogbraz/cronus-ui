import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../config.js";
import {
  applyGoldPath,
  isGoldPathTemplate,
  patchChromeSource,
  patchHomePageSource,
  patchShellLayoutSource,
  patchTeamPageSource,
} from "./gold-path.js";

const HOME = `import { DashboardBlock } from "@/components/blocks/dashboard";

export const metadata = { title: "Dashboard" };

export default function HomePage() {
  return (
    <main className="flex min-h-svh flex-col">
      <DashboardBlock />
    </main>
  );
}
`;

const SHELL_LAYOUT = `import type { ReactNode } from "react";
import { AppShellNav } from "@/components/blocks/chrome/app-shell";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return <AppShellNav>{children}</AppShellNav>;
}
`;

const TEAM = `import { TeamBlock } from "@/components/blocks/team";

export const metadata = { title: "Team" };

export default function TeamPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center">
      <TeamBlock />
    </main>
  );
}
`;

describe("isGoldPathTemplate", () => {
  it("is true only for saas and admin", () => {
    expect(isGoldPathTemplate("saas")).toBe(true);
    expect(isGoldPathTemplate("admin")).toBe(true);
    expect(isGoldPathTemplate("store")).toBe(false);
    expect(isGoldPathTemplate("landing")).toBe(false);
    expect(isGoldPathTemplate("mail")).toBe(false);
    expect(isGoldPathTemplate("chat")).toBe(false);
    expect(isGoldPathTemplate("finance")).toBe(false);
  });
});

const CHROME = `"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  InviteDialog,
  SidebarFooter,
  WorkspaceSwitcher,
} from "@cronus-ui/ui";
import { TEAM, USER } from "@/lib/demo-saas";
import { type ReactNode, useState } from "react";

const OWNER = TEAM.find((m) => m.email === USER.email);

const WORKSPACES = [
  { id: "cronus", name: "Cronus", initials: "CR" },
];

export function AppShellChromeBlock({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState("cronus");
  return (
    <div>
      <WorkspaceSwitcher
        workspaces={WORKSPACES}
        value={workspaceId}
        onValueChange={setWorkspaceId}
      />
      <InviteDialog
        trigger={
          <Button variant="outline" size="sm">
            Invite
          </Button>
        }
      />
      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <Avatar className="size-8">
            {OWNER?.avatar ? <AvatarImage src={OWNER.avatar} alt={USER.name} /> : null}
            <AvatarFallback>{USER.initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-fg">{USER.name}</span>
            <span className="truncate text-xs text-fg-tertiary">{USER.email}</span>
          </div>
        </div>
      </SidebarFooter>
      <Avatar className="size-8">
        {OWNER?.avatar ? <AvatarImage src={OWNER.avatar} alt={USER.name} /> : null}
        <AvatarFallback>{USER.initials}</AvatarFallback>
      </Avatar>
      {children}
    </div>
  );
}
`;

describe("patchChromeSource", () => {
  it("replaces demo switcher and invite with live wrappers", () => {
    const out = patchChromeSource(
      CHROME,
      "@/components/workspace-menu",
      "@/components/invite-member",
      "@/components/session-user",
    );
    expect(out).toBeDefined();
    expect(out).toContain('import { WorkspaceMenu } from "@/components/workspace-menu";');
    expect(out).toContain('import { InviteMember } from "@/components/invite-member";');
    expect(out).toContain("<WorkspaceMenu />");
    expect(out).toContain("<InviteMember");
    expect(out).not.toContain("WorkspaceSwitcher");
    expect(out).not.toContain("WORKSPACES");
    expect(out).not.toContain("useState");
    expect(out).not.toContain("InviteDialog");
    expect(out).toContain("SessionUser");
    expect(out).toContain("<SessionUser compact />");
    expect(out).not.toContain("{USER.email}");
    expect(out).not.toContain("demo-saas");
  });

  it("is idempotent when WorkspaceMenu is already wired", () => {
    const once = patchChromeSource(
      CHROME,
      "@/components/workspace-menu",
      "@/components/invite-member",
      "@/components/session-user",
    );
    expect(once).toBeDefined();
    expect(patchChromeSource(once as string, "@/x", "@/y")).toBe(once);
  });

  it("returns undefined when the chrome has no switcher", () => {
    expect(
      patchChromeSource("export function AppShellChromeBlock() { return null; }", "@/a", "@/b"),
    ).toBe(undefined);
  });
});

describe("patchHomePageSource", () => {
  it("inserts ItemsPanel inside the existing main and makes the page async", () => {
    const out = patchHomePageSource(HOME, "@/components/items-panel");
    expect(out).toBeDefined();
    expect(out).toContain('import { ItemsPanel } from "@/components/items-panel";');
    expect(out).toContain("export default async function HomePage()");
    expect(out).toContain("<ItemsPanel />");
    expect(out).toContain("<DashboardBlock />");
    expect(out?.match(/<main\b/g)?.length).toBe(1);
  });

  it("returns undefined when there is no main", () => {
    expect(patchHomePageSource("export default function HomePage() { return null; }", "@/x")).toBe(
      undefined,
    );
  });
});

describe("patchTeamPageSource", () => {
  it("replaces TeamBlock with MembersPanel and makes the page async", () => {
    const out = patchTeamPageSource(TEAM, "@/components/members-panel");
    expect(out).toBeDefined();
    expect(out).toContain('import { MembersPanel } from "@/components/members-panel";');
    expect(out).toContain("export default async function TeamPage()");
    expect(out).toContain("<MembersPanel />");
    expect(out).not.toContain("TeamBlock");
    expect(out?.match(/<main\b/g)?.length).toBe(1);
  });

  it("is idempotent when MembersPanel is already wired", () => {
    const once = patchTeamPageSource(TEAM, "@/components/members-panel");
    expect(once).toBeDefined();
    expect(patchTeamPageSource(once as string, "@/x")).toBe(once);
  });

  it("returns undefined when the page has no team surface", () => {
    expect(patchTeamPageSource("export default function TeamPage() { return null; }", "@/x")).toBe(
      undefined,
    );
  });
});

describe("patchShellLayoutSource", () => {
  it("makes the shell layout async and redirects unsigned-in visitors", () => {
    const out = patchShellLayoutSource(SHELL_LAYOUT, "@/lib/auth");
    expect(out).toBeDefined();
    expect(out).toContain('import { auth } from "@/lib/auth";');
    expect(out).toContain('from "next/headers"');
    expect(out).toContain('from "next/navigation"');
    expect(out).toContain("export default async function ShellLayout");
    expect(out).toContain("auth.api.getSession");
    expect(out).toContain('redirect("/login")');
    expect(out).toContain("<AppShellNav>{children}</AppShellNav>");
  });

  it("is idempotent when the session gate is already wired", () => {
    const once = patchShellLayoutSource(SHELL_LAYOUT, "@/lib/auth");
    expect(once).toBeDefined();
    expect(patchShellLayoutSource(once as string, "@/x")).toBe(once);
  });

  it("returns undefined when the layout is not the app shell", () => {
    expect(patchShellLayoutSource("export default function Layout() { return null; }", "@/x")).toBe(
      undefined,
    );
  });
});

describe("applyGoldPath", () => {
  let root: string;
  let cwd: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cronus-gold-path-"));
    cwd = join(root, "app");
    mkdirSync(join(cwd, "app", "(shell)"), { recursive: true });
    writeFileSync(
      join(cwd, "package.json"),
      JSON.stringify(
        {
          name: "demo",
          version: "0.0.0",
          private: true,
          scripts: { dev: "next dev" },
          dependencies: { next: "16.2.10", react: "^19.2.0" },
          devDependencies: { typescript: "^6.0.3" },
        },
        null,
        2,
      ),
    );
    writeFileSync(
      join(cwd, "next.config.mjs"),
      `const nextConfig = {\n  reactStrictMode: true,\n};\n\nexport default nextConfig;\n`,
    );
    writeFileSync(join(cwd, "app", "(shell)", "layout.tsx"), SHELL_LAYOUT);
    writeFileSync(join(cwd, "app", "(shell)", "page.tsx"), HOME);
    mkdirSync(join(cwd, "app", "(shell)", "team"), { recursive: true });
    writeFileSync(join(cwd, "app", "(shell)", "team", "page.tsx"), TEAM);
    mkdirSync(join(cwd, "components", "blocks"), { recursive: true });
    writeFileSync(join(cwd, "components", "blocks", "app-shell-chrome.tsx"), CHROME);
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("writes sqlite drizzle + better-auth files and patches a generated home", async () => {
    const result = await applyGoldPath({
      targetDir: cwd,
      config: DEFAULT_CONFIG,
      generatedFiles: [
        "app/(shell)/layout.tsx",
        "app/(shell)/page.tsx",
        "app/(shell)/team/page.tsx",
      ],
      overwrite: false,
      templateName: "saas",
    });

    expect(result.written).toContain("db/schema.ts");
    expect(result.written).toContain("lib/auth.ts");
    expect(result.written).toContain("lib/auth-adapter.ts");
    expect(result.written).toContain("middleware.ts");
    expect(existsSync(join(cwd, "db", "index.ts"))).toBe(true);
    expect(existsSync(join(cwd, "lib", "auth-client.ts"))).toBe(true);
    expect(existsSync(join(cwd, "app", "api", "auth", "[...all]", "route.ts"))).toBe(true);
    expect(existsSync(join(cwd, "components", "items-panel.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components", "items-view.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "lib", "items.ts"))).toBe(true);
    expect(existsSync(join(cwd, "lib", "members.ts"))).toBe(true);
    expect(existsSync(join(cwd, "components", "members-panel.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components", "members-view.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "drizzle.config.ts"))).toBe(true);
    expect(readFileSync(join(cwd, "drizzle.config.ts"), "utf8")).toContain("mkdirSync");

    const schema = readFileSync(join(cwd, "db", "schema.ts"), "utf8");
    expect(schema).toContain("export const items");
    expect(schema).toContain("export const user");
    expect(schema).toContain("export const organization");
    expect(schema).toContain("export const member");
    expect(schema).toContain("export const invitation");
    expect(schema).toContain("workspaceId");
    expect(schema).toContain("activeOrganizationId");
    expect(schema).toContain("issuer:");

    const adapter = readFileSync(join(cwd, "lib", "auth-adapter.ts"), "utf8");
    expect(adapter).toContain("authClient");
    expect(adapter).toContain("requestPasswordReset");
    expect(adapter).toContain("resetPassword");
    expect(adapter).toContain('redirectTo: "/reset-password"');
    expect(adapter).toContain("cronus-invitation");
    expect(adapter).toContain("/accept-invitation?id=");

    const auth = readFileSync(join(cwd, "lib", "auth.ts"), "utf8");
    expect(auth).toContain("nextCookies");
    expect(auth).toContain('provider: "sqlite"');
    expect(auth).toContain("sendResetPassword");
    expect(auth).toMatch(/Reset \$\{user\.email\}/);
    expect(auth).toContain("organization(");
    expect(auth).toContain("sendInvitationEmail");
    expect(auth).toContain("databaseHooks");
    expect(auth).toContain("activeOrganizationId");
    expect(auth).toContain("/accept-invitation?id=");
    expect(auth).toContain("allowedHosts");
    expect(auth).toContain("localhost:*");
    expect(auth).toContain("authBaseURL");
    expect(auth).toContain('invitationTable.status, "pending"');
    const middleware = readFileSync(join(cwd, "middleware.ts"), "utf8");
    expect(middleware).toContain("/reset-password");
    expect(middleware).toContain("/accept-invitation");
    expect(middleware).toContain("sessionCookie && isAuthPage && invitation");
    expect(middleware).not.toContain('new URL("/", request.url)');
    expect(existsSync(join(cwd, "app", "(bare)", "accept-invitation", "page.tsx"))).toBe(true);
    const acceptPage = readFileSync(
      join(cwd, "app", "(bare)", "accept-invitation", "page.tsx"),
      "utf8",
    );
    expect(acceptPage).toContain("acceptInvitation");
    expect(acceptPage).toContain("setActive");

    expect(readFileSync(join(cwd, "lib", "auth-client.ts"), "utf8")).toContain(
      "organizationClient",
    );
    expect(existsSync(join(cwd, "components", "workspace-menu.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components", "invite-member.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components", "session-user.tsx"))).toBe(true);
    const sessionUser = readFileSync(join(cwd, "components", "session-user.tsx"), "utf8");
    expect(sessionUser).toContain("authClient.signOut");
    expect(sessionUser).toContain('aria-label="Sign out"');
    expect(sessionUser).toContain('window.location.assign("/login")');
    expect(readFileSync(join(cwd, "components", "invite-member.tsx"), "utf8")).toContain(
      'role === "admin"',
    );
    const actions = readFileSync(join(cwd, "lib", "items.ts"), "utf8");
    expect(actions.startsWith('"use server"')).toBe(true);
    expect(actions).toContain("export async function createItem");
    expect(actions).toContain("export async function deleteItem");
    expect(actions).toContain("export async function loadItems");
    expect(actions).toContain("insert(items)");
    expect(actions).toContain("delete(items)");
    expect(actions).toContain("workspaceId: orgId");
    expect(actions).toContain("eq(items.workspaceId, orgId)");
    expect(actions).toContain("revalidatePath");
    expect(actions).toContain("member.organizationId");
    expect(actions).toContain("member.userId");

    const panel = readFileSync(join(cwd, "components", "items-panel.tsx"), "utf8");
    expect(panel).toContain("loadItems");
    expect(panel).toContain("ItemsView");
    expect(panel).toContain('from "@/lib/items"');

    const view = readFileSync(join(cwd, "components", "items-view.tsx"), "utf8");
    expect(view.startsWith('"use client"')).toBe(true);
    expect(view).toContain("createItem");
    expect(view).toContain("deleteItem");
    expect(view).toContain('name="title"');
    expect(view).toContain('id="item-title"');
    expect(view).toContain('data-slot="items-panel"');
    expect(view).toContain("No items yet.");
    expect(view).toContain('from "@/lib/items"');
    expect(view).toContain("Button");
    expect(view).toContain("Input");

    const members = readFileSync(join(cwd, "lib", "members.ts"), "utf8");
    expect(members.startsWith('"use server"')).toBe(true);
    expect(members).toContain("export async function loadMembers");
    expect(members).toContain("innerJoin(user");
    expect(members).toContain("eq(member.organizationId, orgId)");
    expect(members).toContain("member.userId");

    const membersPanel = readFileSync(join(cwd, "components", "members-panel.tsx"), "utf8");
    expect(membersPanel).toContain("loadMembers");
    expect(membersPanel).toContain("MembersView");
    expect(membersPanel).toContain('from "@/lib/members"');

    const membersView = readFileSync(join(cwd, "components", "members-view.tsx"), "utf8");
    expect(membersView.startsWith('"use client"')).toBe(true);
    expect(membersView).toContain("InviteMember");
    expect(membersView).toContain('data-slot="members-panel"');
    expect(membersView).toContain('data-slot="member"');
    expect(membersView).toContain("Avatar");
    expect(membersView).toContain("Badge");

    const chrome = readFileSync(join(cwd, "components", "blocks", "app-shell-chrome.tsx"), "utf8");
    expect(chrome).toContain("WorkspaceMenu");
    expect(chrome).toContain("InviteMember");
    expect(chrome).toContain("SessionUser");
    expect(chrome).not.toContain("WORKSPACES");
    expect(chrome).not.toContain("demo-saas");

    const home = readFileSync(join(cwd, "app", "(shell)", "page.tsx"), "utf8");
    expect(home).toContain("ItemsPanel");
    expect(home).toContain("export default async function HomePage()");
    expect(home.match(/<main\b/g)?.length).toBe(1);

    const snap = readFileSync(join(cwd, ".cronus-ui/base/saas/app/(shell)/page.tsx"), "utf8");
    expect(snap).toBe(home);

    const team = readFileSync(join(cwd, "app", "(shell)", "team", "page.tsx"), "utf8");
    expect(team).toContain("MembersPanel");
    expect(team).toContain("export default async function TeamPage()");
    expect(team).not.toContain("TeamBlock");
    const teamSnap = readFileSync(
      join(cwd, ".cronus-ui/base/saas/app/(shell)/team/page.tsx"),
      "utf8",
    );
    expect(teamSnap).toBe(team);

    const shellLayout = readFileSync(join(cwd, "app", "(shell)", "layout.tsx"), "utf8");
    expect(shellLayout).toContain("auth.api.getSession");
    expect(shellLayout).toContain('redirect("/login")');
    expect(shellLayout).toContain("export default async function ShellLayout");
    const layoutSnap = readFileSync(
      join(cwd, ".cronus-ui/base/saas/app/(shell)/layout.tsx"),
      "utf8",
    );
    expect(layoutSnap).toBe(shellLayout);

    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    expect(pkg.dependencies.next).toBe("16.2.10");
    expect(pkg.dependencies["drizzle-orm"]).toBe("^0.45.2");
    expect(pkg.dependencies["better-sqlite3"]).toBe("^12.0.0");
    expect(pkg.dependencies["better-auth"]).toBe("^1.7.2");
    expect(pkg.devDependencies["drizzle-kit"]).toBe("^0.31.10");
    expect(pkg.scripts["db:push"]).toBe("drizzle-kit push");

    const nextConfig = readFileSync(join(cwd, "next.config.mjs"), "utf8");
    expect(nextConfig).toContain('serverExternalPackages: ["better-sqlite3"]');
    expect(nextConfig).toContain("reactStrictMode: true");

    const env = readFileSync(join(cwd, ".env.example"), "utf8");
    expect(env).toContain("DATABASE_URL=file:./data/app.db");
    expect(env).toContain("BETTER_AUTH_SECRET=");
    expect(env).toContain("BETTER_AUTH_URL=");

    const gitignore = readFileSync(join(cwd, ".gitignore"), "utf8");
    expect(gitignore).toContain("*.db");
    expect(gitignore).toContain("data/");
    expect(gitignore).toContain("drizzle/");
  });

  it("does not patch a home page that was not generated this run", async () => {
    await applyGoldPath({
      targetDir: cwd,
      config: DEFAULT_CONFIG,
      generatedFiles: [],
      overwrite: false,
    });
    expect(readFileSync(join(cwd, "app", "(shell)", "page.tsx"), "utf8")).toBe(HOME);
    expect(readFileSync(join(cwd, "app", "(shell)", "team", "page.tsx"), "utf8")).toBe(TEAM);
    expect(readFileSync(join(cwd, "app", "(shell)", "layout.tsx"), "utf8")).toBe(SHELL_LAYOUT);
    expect(existsSync(join(cwd, "db", "schema.ts"))).toBe(true);
  });

  it("skips existing gold-path files without overwrite, except owned adapters", async () => {
    mkdirSync(join(cwd, "db"), { recursive: true });
    writeFileSync(join(cwd, "db", "schema.ts"), "// KEEP\n");
    mkdirSync(join(cwd, "lib"), { recursive: true });
    writeFileSync(join(cwd, "lib", "auth-adapter.ts"), "// DEMO\n");
    writeFileSync(join(cwd, "lib", "items.ts"), "// KEEP\n");
    mkdirSync(join(cwd, "components"), { recursive: true });
    writeFileSync(join(cwd, "components", "items-panel.tsx"), "// KEEP\n");
    writeFileSync(join(cwd, "components", "items-view.tsx"), "// KEEP\n");
    writeFileSync(join(cwd, "lib", "members.ts"), "// KEEP\n");
    writeFileSync(join(cwd, "components", "members-panel.tsx"), "// KEEP\n");
    writeFileSync(join(cwd, "components", "members-view.tsx"), "// KEEP\n");

    const result = await applyGoldPath({
      targetDir: cwd,
      config: DEFAULT_CONFIG,
      generatedFiles: [],
      overwrite: false,
    });

    expect(result.skipped).toContain("db/schema.ts");
    expect(readFileSync(join(cwd, "db", "schema.ts"), "utf8")).toBe("// KEEP\n");
    expect(readFileSync(join(cwd, "lib", "auth-adapter.ts"), "utf8")).toContain("authClient");
    expect(readFileSync(join(cwd, "lib", "items.ts"), "utf8")).toContain("createItem");
    expect(readFileSync(join(cwd, "components", "items-view.tsx"), "utf8")).toContain(
      'data-slot="items-panel"',
    );
    expect(readFileSync(join(cwd, "lib", "members.ts"), "utf8")).toContain("loadMembers");
    expect(readFileSync(join(cwd, "components", "members-view.tsx"), "utf8")).toContain(
      'data-slot="members-panel"',
    );
  });
});
