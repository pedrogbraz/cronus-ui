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
    writeFileSync(join(cwd, "app", "(shell)", "page.tsx"), HOME);
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
      generatedFiles: ["app/(shell)/page.tsx"],
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
    expect(adapter).toContain("cronus-invitation");
    expect(adapter).toContain("/accept-invitation?id=");

    const auth = readFileSync(join(cwd, "lib", "auth.ts"), "utf8");
    expect(auth).toContain("nextCookies");
    expect(auth).toContain('provider: "sqlite"');
    expect(auth).toContain("sendResetPassword");
    expect(auth).toContain("organization(");
    expect(auth).toContain("sendInvitationEmail");
    expect(auth).toContain("databaseHooks");
    expect(auth).toContain("activeOrganizationId");
    expect(auth).toContain("/accept-invitation?id=");
    expect(auth).toContain('invitationTable.status, "pending"');
    expect(readFileSync(join(cwd, "middleware.ts"), "utf8")).toContain("/accept-invitation");
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
    expect(readFileSync(join(cwd, "components", "invite-member.tsx"), "utf8")).toContain(
      'role === "admin"',
    );
    expect(readFileSync(join(cwd, "components", "items-panel.tsx"), "utf8")).toContain(
      "workspaceId",
    );

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

    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    expect(pkg.dependencies.next).toBe("16.2.10");
    expect(pkg.dependencies["drizzle-orm"]).toBe("^0.45.2");
    expect(pkg.dependencies["better-sqlite3"]).toBe("^13.0.3");
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
    expect(existsSync(join(cwd, "db", "schema.ts"))).toBe(true);
  });

  it("skips existing gold-path files without overwrite, except auth-adapter", async () => {
    mkdirSync(join(cwd, "db"), { recursive: true });
    writeFileSync(join(cwd, "db", "schema.ts"), "// KEEP\n");
    mkdirSync(join(cwd, "lib"), { recursive: true });
    writeFileSync(join(cwd, "lib", "auth-adapter.ts"), "// DEMO\n");

    const result = await applyGoldPath({
      targetDir: cwd,
      config: DEFAULT_CONFIG,
      generatedFiles: [],
      overwrite: false,
    });

    expect(result.skipped).toContain("db/schema.ts");
    expect(readFileSync(join(cwd, "db", "schema.ts"), "utf8")).toBe("// KEEP\n");
    expect(readFileSync(join(cwd, "lib", "auth-adapter.ts"), "utf8")).toContain("authClient");
  });
});
