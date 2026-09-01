/**
 * Authenticated gold path for saas/admin compose: SQLite + Drizzle + Better-Auth.
 * Always sqlite — postgres/mysql live in create-cronus-stack.
 */

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CronusUIConfig } from "../config.js";
import { resolveSafeDest, writeFileEnsured } from "../utils.js";
import { baseSnapshotDir } from "./reload.js";

export const GOLD_PATH_TEMPLATES = new Set(["saas", "admin"]);

export function isGoldPathTemplate(name: string): boolean {
  return GOLD_PATH_TEMPLATES.has(name);
}

/** Production npm specs installed with the gold path (devDeps are merged into package.json). */
export const GOLD_PATH_DEPENDENCIES = [
  "drizzle-orm@^0.45.2",
  "better-sqlite3@^12.0.0",
  "better-auth@^1.7.2",
] as const;

const GOLD_PATH_PROD_DEPS: Record<string, string> = {
  "drizzle-orm": "^0.45.2",
  "better-sqlite3": "^12.0.0",
  "better-auth": "^1.7.2",
};

const GOLD_PATH_DEV_DEPS: Record<string, string> = {
  "drizzle-kit": "^0.31.10",
  "@types/better-sqlite3": "^9.6.0",
};

const GOLD_PATH_SCRIPTS: Record<string, string> = {
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate",
  "db:studio": "drizzle-kit studio",
};

const ENV_VARS: Record<string, string> = {
  DATABASE_URL: "file:./data/app.db",
  BETTER_AUTH_SECRET: "change-me-to-a-32-character-secret",
  BETTER_AUTH_URL: "http://localhost:3000",
};

const GITIGNORE_ENTRIES = ["*.db", "data/", "drizzle/"];

const DATABASE_URL_FALLBACK = "file:./data/app.db";

const TITLE_MAX = 200;

export interface GoldPathLayout {
  libDir: string;
  dbDir: string;
  appDir: string;
  componentsDir: string;
  middlewareRel: string;
}

export interface ApplyGoldPathOptions {
  targetDir: string;
  config: CronusUIConfig;
  /** Paths compose actually wrote this run (used to gate the home-page patch). */
  generatedFiles: string[];
  overwrite: boolean;
  /** Composed{} key; when set, the patched home snapshot is updated too. */
  templateName?: string;
}

export interface ApplyGoldPathResult {
  written: string[];
  skipped: string[];
}

export function goldPathLayout(config: CronusUIConfig): GoldPathLayout {
  const libDir = posix(config.paths.lib);
  const uiDir = posix(config.paths.ui);
  const src = libDir === "src" || libDir.startsWith("src/");
  const prefix = src ? "src/" : "";
  const componentsDir = uiDir.endsWith("/ui")
    ? uiDir.slice(0, -"/ui".length)
    : `${prefix}components`;
  return {
    libDir,
    dbDir: `${prefix}db`,
    appDir: `${prefix}app`,
    componentsDir,
    middlewareRel: `${prefix}middleware.ts`,
  };
}

function posix(p: string): string {
  return p.replaceAll("\\", "/");
}

function resolveAppDir(
  targetDir: string,
  layout: GoldPathLayout,
  generatedFiles: string[],
): string {
  const fromGenerated = generatedFiles.find((f) => /(^|\/)\(shell\)\/page\.tsx$/.test(posix(f)));
  if (fromGenerated !== undefined) {
    return posix(fromGenerated).replace(/\/\(shell\)\/page\.tsx$/, "");
  }
  if (existsSync(join(targetDir, "app", "(shell)", "page.tsx"))) return "app";
  if (existsSync(join(targetDir, "src", "app", "(shell)", "page.tsx"))) return "src/app";
  if (existsSync(join(targetDir, layout.appDir))) return layout.appDir;
  if (existsSync(join(targetDir, "app"))) return "app";
  if (existsSync(join(targetDir, "src", "app"))) return "src/app";
  return layout.appDir;
}

function homePageRel(appDir: string, generatedFiles: string[]): string | undefined {
  const match = generatedFiles.find((f) => posix(f) === `${appDir}/(shell)/page.tsx`);
  if (match !== undefined) return posix(match);
  const any = generatedFiles.find((f) => /(^|\/)\(shell\)\/page\.tsx$/.test(posix(f)));
  return any !== undefined ? posix(any) : undefined;
}

function teamPageRel(appDir: string, generatedFiles: string[]): string | undefined {
  const match = generatedFiles.find((f) => posix(f) === `${appDir}/(shell)/team/page.tsx`);
  if (match !== undefined) return posix(match);
  const any = generatedFiles.find((f) => /(^|\/)\(shell\)\/team\/page\.tsx$/.test(posix(f)));
  return any !== undefined ? posix(any) : undefined;
}

function shellLayoutRel(appDir: string, generatedFiles: string[]): string | undefined {
  const match = generatedFiles.find((f) => posix(f) === `${appDir}/(shell)/layout.tsx`);
  if (match !== undefined) return posix(match);
  const any = generatedFiles.find((f) => /(^|\/)\(shell\)\/layout\.tsx$/.test(posix(f)));
  return any !== undefined ? posix(any) : undefined;
}

function drizzleConfigSource(dbDir: string): string {
  return `import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "${DATABASE_URL_FALLBACK}";
const fileFromUrl = url.startsWith("file:") ? url.slice("file:".length) : url;
mkdirSync(dirname(fileFromUrl) || ".", { recursive: true });

export default defineConfig({
  dialect: "sqlite",
  schema: "./${dbDir}/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
});
`;
}

function dbSchemaSource(): string {
  return `import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: text("active_organization_id"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  issuer: text("issuer").notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const organization = sqliteTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const member = sqliteTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const invitation = sqliteTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  workspaceId: text("workspace_id").references(() => organization.id, { onDelete: "cascade" }),
});
`;
}

function dbClientSource(): string {
  return `import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "${DATABASE_URL_FALLBACK}";
const fileFromUrl = url.startsWith("file:") ? url.slice("file:".length) : url;
mkdirSync(dirname(fileFromUrl) || ".", { recursive: true });
const sqlite = new Database(fileFromUrl);

export const db = drizzle(sqlite, { schema });
`;
}

function authServerSource(): string {
  return `import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  invitation as invitationTable,
  member,
  organization as organizationTable,
  user as userTable,
} from "@/db/schema";

function newId(): string {
  return crypto.randomUUID().replaceAll("-", "");
}

function authBaseURL() {
  const env = process.env.BETTER_AUTH_URL;
  const hosts = ["localhost:*", "127.0.0.1:*"];
  if (env) {
    try {
      hosts.push(new URL(env).host);
    } catch {
      // ignore invalid BETTER_AUTH_URL
    }
  }
  return { allowedHosts: hosts, fallback: env || "http://localhost:3000" };
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.info(\`Reset \${user.email}: \${url}\`);
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const [existing] = await db
            .select({ organizationId: member.organizationId })
            .from(member)
            .where(eq(member.userId, session.userId))
            .limit(1);
          if (existing?.organizationId) {
            return { data: { ...session, activeOrganizationId: existing.organizationId } };
          }
          const [owner] = await db
            .select({ name: userTable.name, email: userTable.email })
            .from(userTable)
            .where(eq(userTable.id, session.userId))
            .limit(1);
          if (owner?.email) {
            const [pending] = await db
              .select({ id: invitationTable.id })
              .from(invitationTable)
              .where(
                and(eq(invitationTable.email, owner.email), eq(invitationTable.status, "pending")),
              )
              .limit(1);
            if (pending) return;
          }
          const orgId = newId();
          const now = new Date();
          await db.insert(organizationTable).values({
            id: orgId,
            name: owner?.name.trim() || "Workspace",
            slug: \`ws-\${session.userId.slice(0, 16)}\`,
            createdAt: now,
          });
          await db.insert(member).values({
            id: newId(),
            organizationId: orgId,
            userId: session.userId,
            role: "owner",
            createdAt: now,
          });
          return { data: { ...session, activeOrganizationId: orgId } };
        },
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: authBaseURL(),
  plugins: [
    organization({
      sendInvitationEmail: async (data) => {
        console.info(\`Invite \${data.email}: /accept-invitation?id=\${data.id}\`);
      },
    }),
    nextCookies(),
  ],
});
`;
}

function authClientSource(): string {
  return `import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [organizationClient()],
});
`;
}

function authAdapterSource(): string {
  return `import { authClient } from "./auth-client";

const INVITE_KEY = "cronus-invitation";

function readInvitation(): string | null {
  if (typeof window === "undefined") return null;
  const fromUrl = new URLSearchParams(window.location.search).get("invitation");
  if (fromUrl) {
    sessionStorage.setItem(INVITE_KEY, fromUrl);
    return fromUrl;
  }
  return sessionStorage.getItem(INVITE_KEY);
}

function afterAuthPath(): string {
  const invitation = readInvitation();
  if (invitation) {
    return \`/accept-invitation?id=\${encodeURIComponent(invitation)}\`;
  }
  return "/";
}

if (typeof window !== "undefined") {
  readInvitation();
}

export async function signInEmail({ email, password }: { email: string; password: string }) {
  const callbackURL = afterAuthPath();
  const { error } = await authClient.signIn.email({ email, password, callbackURL });
  if (error) throw new Error(error.message || "Sign in failed");
  window.location.assign(callbackURL);
}

export async function signUpEmail({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) {
  const callbackURL = afterAuthPath();
  const { error } = await authClient.signUp.email({
    email,
    password,
    name: name ?? email,
    callbackURL,
  });
  if (error) throw new Error(error.message || "Sign up failed");
  window.location.assign(callbackURL);
}

export async function requestPasswordReset({ email }: { email: string }) {
  const { error } = await authClient.requestPasswordReset({
    email,
    redirectTo: "/reset-password",
  });
  if (error) throw new Error(error.message || "Reset failed");
}

export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) {
  const { error } = await authClient.resetPassword({ token, newPassword });
  if (error) throw new Error(error.message || "Reset failed");
  window.location.assign("/login");
}
`;
}

function authRouteSource(authImport: string): string {
  return `import { toNextJsHandler } from "better-auth/next-js";
import { auth } from ${JSON.stringify(authImport)};

export const { GET, POST } = toNextJsHandler(auth);
`;
}

function middlewareSource(): string {
  return `import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];

function invitationOf(request: NextRequest): string | null {
  const { pathname, searchParams } = request.nextUrl;
  return (
    searchParams.get("invitation") ??
    (pathname === "/accept-invitation" ? searchParams.get("id") : null)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  const isAuthPage = AUTH_PAGES.includes(pathname);
  const invitation = invitationOf(request);

  if (!sessionCookie && pathname === "/accept-invitation") {
    const url = new URL("/signup", request.url);
    if (invitation) url.searchParams.set("invitation", invitation);
    return NextResponse.redirect(url);
  }
  if (!sessionCookie && !isAuthPage) {
    const url = new URL("/login", request.url);
    if (invitation) url.searchParams.set("invitation", invitation);
    return NextResponse.redirect(url);
  }
  if (sessionCookie && isAuthPage && invitation) {
    return NextResponse.redirect(
      new URL(\`/accept-invitation?id=\${encodeURIComponent(invitation)}\`, request.url),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
`;
}

function itemsActionsSource(authImport: string): string {
  return `"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { items, member, organization } from "@/db/schema";
import { auth } from ${JSON.stringify(authImport)};

const TITLE_MAX = ${TITLE_MAX};

async function activeWorkspaceId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;
  const hinted = session.session?.activeOrganizationId ?? null;
  if (hinted) {
    const [membership] = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(and(eq(member.userId, userId), eq(member.organizationId, hinted)))
      .limit(1);
    if (membership?.organizationId) return membership.organizationId;
  }
  const [row] = await db
    .select({ organizationId: member.organizationId })
    .from(member)
    .where(eq(member.userId, userId))
    .limit(1);
  return row?.organizationId ?? null;
}

export async function loadItems(): Promise<{
  email: string;
  workspace: string;
  rows: { id: number; title: string }[];
}> {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? "signed out";
  const orgId = await activeWorkspaceId();
  if (!orgId) return { email, workspace: "no workspace", rows: [] };
  const [org] = await db.select().from(organization).where(eq(organization.id, orgId)).limit(1);
  const rows = await db
    .select({ id: items.id, title: items.title })
    .from(items)
    .where(eq(items.workspaceId, orgId))
    .orderBy(desc(items.id));
  return { email, workspace: org?.name ?? "no workspace", rows };
}

export async function createItem(formData: FormData) {
  const orgId = await activeWorkspaceId();
  if (!orgId) return;
  const title = String(formData.get("title") ?? "")
    .trim()
    .slice(0, TITLE_MAX);
  if (!title) return;
  await db.insert(items).values({ title, workspaceId: orgId });
  revalidatePath("/");
}

export async function deleteItem(formData: FormData) {
  const orgId = await activeWorkspaceId();
  if (!orgId) return;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return;
  await db.delete(items).where(and(eq(items.id, id), eq(items.workspaceId, orgId)));
  revalidatePath("/");
}
`;
}

function itemsPanelSource(actionsImport: string, viewImport: string): string {
  return `import { loadItems } from ${JSON.stringify(actionsImport)};
import { ItemsView } from ${JSON.stringify(viewImport)};

export async function ItemsPanel() {
  const data = await loadItems();
  return <ItemsView email={data.email} workspace={data.workspace} rows={data.rows} />;
}
`;
}

function itemsViewSource(actionsImport: string): string {
  return `"use client";

import { Button, Input } from "@cronus-ui/ui";
import { createItem, deleteItem } from ${JSON.stringify(actionsImport)};

export function ItemsView({
  email,
  workspace,
  rows,
}: {
  email: string;
  workspace: string;
  rows: { id: number; title: string }[];
}) {
  const count = String(rows.length);
  return (
    <section
      data-slot="items-panel"
      aria-labelledby="items-heading"
      className="border-b border-border px-6 py-6"
    >
      <h2 id="items-heading" className="text-sm font-semibold text-fg">
        Items
      </h2>
      <p className="mt-1 text-sm text-fg-tertiary">
        {email} · {workspace} · {count} items
      </p>
      <form action={createItem} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label htmlFor="item-title" className="text-sm font-medium text-fg">
            Title
          </label>
          <Input
            id="item-title"
            name="title"
            required
            maxLength={${TITLE_MAX}}
            autoComplete="off"
            placeholder="New item"
          />
        </div>
        <Button type="submit">Add</Button>
      </form>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-fg-tertiary">No items yet.</p>
      ) : (
        <ul className="mt-4">
          {rows.map((row) => (
            <li
              key={row.id}
              data-slot="item"
              className="flex items-center justify-between gap-3 border-t border-border py-3"
            >
              <span className="min-w-0 truncate text-sm text-fg">{row.title}</span>
              <form action={deleteItem}>
                <input type="hidden" name="id" value={row.id} />
                <Button type="submit" variant="ghost" size="sm" aria-label={"Delete " + row.title}>
                  Delete
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
`;
}

function membersActionsSource(authImport: string): string {
  return `"use server";

import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { member, organization, user } from "@/db/schema";
import { auth } from ${JSON.stringify(authImport)};

async function activeWorkspaceId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return null;
  const hinted = session.session?.activeOrganizationId ?? null;
  if (hinted) {
    const [membership] = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(and(eq(member.userId, userId), eq(member.organizationId, hinted)))
      .limit(1);
    if (membership?.organizationId) return membership.organizationId;
  }
  const [row] = await db
    .select({ organizationId: member.organizationId })
    .from(member)
    .where(eq(member.userId, userId))
    .limit(1);
  return row?.organizationId ?? null;
}

export async function loadMembers(): Promise<{
  workspace: string;
  rows: { id: string; name: string; email: string; image: string | null; role: string }[];
}> {
  const orgId = await activeWorkspaceId();
  if (!orgId) return { workspace: "no workspace", rows: [] };
  const [org] = await db.select().from(organization).where(eq(organization.id, orgId)).limit(1);
  const rows = await db
    .select({
      id: member.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: member.role,
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(eq(member.organizationId, orgId))
    .orderBy(asc(member.createdAt));
  return { workspace: org?.name ?? "no workspace", rows };
}
`;
}

function membersPanelSource(actionsImport: string, viewImport: string): string {
  return `import { loadMembers } from ${JSON.stringify(actionsImport)};
import { MembersView } from ${JSON.stringify(viewImport)};

export async function MembersPanel() {
  const data = await loadMembers();
  return <MembersView workspace={data.workspace} rows={data.rows} />;
}
`;
}

function membersViewSource(inviteImport: string): string {
  return `"use client";

import { Avatar, AvatarFallback, AvatarImage, Badge, Button } from "@cronus-ui/ui";
import { InviteMember } from ${JSON.stringify(inviteImport)};

function initialsOf(name: string, email: string): string {
  const parts = name.trim().split(/\\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return \`\${parts[0]?.[0] ?? ""}\${parts[1]?.[0] ?? ""}\`.toUpperCase();
  }
  if (parts[0]?.[0]) return parts[0][0].toUpperCase();
  return email.slice(0, 2).toUpperCase();
}

function roleLabel(role: string): string {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "member") return "Member";
  return role;
}

function roleVariant(role: string): "primary" | "info" | "secondary" {
  if (role === "owner") return "primary";
  if (role === "admin") return "info";
  return "secondary";
}

export function MembersView({
  workspace,
  rows,
}: {
  workspace: string;
  rows: { id: string; name: string; email: string; image: string | null; role: string }[];
}) {
  const count = String(rows.length);
  return (
    <section
      data-slot="members-panel"
      aria-labelledby="members-heading"
      className="mx-auto w-full max-w-xl px-6 py-6"
    >
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 id="members-heading" className="text-sm font-semibold text-fg">
            Team
          </h1>
          <p className="mt-1 text-sm text-fg-tertiary">
            {workspace} · {count} members
          </p>
        </div>
        <InviteMember
          trigger={
            <Button type="button" size="sm">
              Invite
            </Button>
          }
        />
      </div>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-fg-tertiary">No members yet.</p>
      ) : (
        <ul className="mt-4">
          {rows.map((row) => (
            <li
              key={row.id}
              data-slot="member"
              className="flex items-center gap-3 border-t border-border py-3"
            >
              <Avatar className="size-8">
                {row.image ? <AvatarImage src={row.image} alt={row.name} /> : null}
                <AvatarFallback>{initialsOf(row.name, row.email)}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm text-fg">{row.name}</span>
                <span className="truncate text-sm text-fg-tertiary">{row.email}</span>
              </div>
              <Badge variant={roleVariant(row.role)}>{roleLabel(row.role)}</Badge>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
`;
}

function workspaceMenuSource(authClientImport: string): string {
  return `"use client";

import { WorkspaceSwitcher } from "@cronus-ui/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from ${JSON.stringify(authClientImport)};

export function WorkspaceMenu() {
  const router = useRouter();
  const { data: orgs } = authClient.useListOrganizations();
  const { data: active } = authClient.useActiveOrganization();
  const workspaces = (orgs ?? []).map((org) => ({ id: org.id, name: org.name }));
  const firstId = workspaces[0]?.id;
  useEffect(() => {
    if (active || !firstId) return;
    void authClient.organization.setActive({ organizationId: firstId }).then(() => {
      router.refresh();
    });
  }, [active, firstId, router]);
  return (
    <WorkspaceSwitcher
      workspaces={workspaces}
      value={active?.id}
      onValueChange={(id) => {
        void authClient.organization.setActive({ organizationId: id }).then(() => {
          router.refresh();
        });
      }}
    />
  );
}
`;
}

function inviteMemberSource(authClientImport: string): string {
  return `"use client";

import { InviteDialog } from "@cronus-ui/ui";
import type { ReactNode } from "react";
import { authClient } from ${JSON.stringify(authClientImport)};

export function InviteMember({ trigger }: { trigger: ReactNode }) {
  return (
    <InviteDialog
      trigger={trigger}
      onInvite={async ({ email, role }) => {
        const assigned = role === "admin" || role === "owner" ? role : "member";
        const { error } = await authClient.organization.inviteMember({
          email,
          role: assigned,
        });
        if (error) throw new Error(error.message || "Invite failed");
      }}
    />
  );
}
`;
}

function sessionUserSource(authClientImport: string): string {
  return `"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@cronus-ui/ui";
import { authClient } from ${JSON.stringify(authClientImport)};

function initialsOf(name: string, email: string): string {
  const parts = name.trim().split(/\\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return \`\${parts[0]?.[0] ?? ""}\${parts[1]?.[0] ?? ""}\`.toUpperCase();
  }
  if (parts[0]?.[0]) return parts[0][0].toUpperCase();
  return email.slice(0, 2).toUpperCase();
}

export function SessionUser({ compact = false }: { compact?: boolean }) {
  const { data } = authClient.useSession();
  const user = data?.user;
  if (!user) return null;
  const name = user.name || user.email || "Account";
  const email = user.email || "";
  const initials = initialsOf(name, email);
  const avatar = (
    <Avatar className="size-8">
      {user.image ? <AvatarImage src={user.image} alt={name} /> : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
  if (compact) return avatar;
  return (
    <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
      {avatar}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-fg">{name}</span>
        <span className="truncate text-xs text-fg-tertiary">{email}</span>
      </div>
    </div>
  );
}
`;
}

function acceptInvitationPageSource(authClientImport: string): string {
  return `"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from ${JSON.stringify(authClientImport)};

function AcceptInvitation() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? params.get("invitation");
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!id) {
      setError("Invitation is missing.");
      return;
    }
    if (!session) {
      router.replace(\`/signup?invitation=\${encodeURIComponent(id)}\`);
      return;
    }
    let cancelled = false;
    void (async () => {
      const { data, error: acceptError } = await authClient.organization.acceptInvitation({
        invitationId: id,
      });
      if (cancelled) return;
      if (acceptError) {
        setError(acceptError.message || "Could not accept invitation.");
        return;
      }
      const orgId = data?.invitation?.organizationId ?? data?.member?.organizationId;
      if (orgId) {
        await authClient.organization.setActive({ organizationId: orgId });
      }
      try {
        sessionStorage.removeItem("cronus-invitation");
      } catch {
        // ignore
      }
      window.location.assign("/");
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isPending, router, session]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6">
      {error ? (
        <p role="alert" className="text-sm text-error-strong">
          {error}
        </p>
      ) : (
        <p className="text-sm text-fg-tertiary">Accepting invitation…</p>
      )}
    </main>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-svh flex-col items-center justify-center px-6">
          <p className="text-sm text-fg-tertiary">Accepting invitation…</p>
        </main>
      }
    >
      <AcceptInvitation />
    </Suspense>
  );
}
`;
}

function insertImport(source: string, line: string): string {
  if (source.includes(line)) return source;
  const firstImport = source.match(/^import .+$/m);
  if (firstImport?.index !== undefined) {
    return `${source.slice(0, firstImport.index)}${line}\n${source.slice(firstImport.index)}`;
  }
  return `${line}\n${source}`;
}

/**
 * Wire the installed app-shell-chrome copy to live Better-Auth orgs + session.
 * Idempotent: a chrome that already has WorkspaceMenu and SessionUser is left
 * untouched. Returns undefined when the WorkspaceSwitcher / InviteDialog
 * anchors are missing and nothing else can be patched.
 */
export function patchChromeSource(
  source: string,
  workspaceImport: string,
  inviteImport: string,
  sessionImport?: string,
): string | undefined {
  const hasMenu = source.includes("WorkspaceMenu");
  const hasSession = source.includes("SessionUser");
  if (hasMenu && hasSession) return source;
  const canPatchMenu =
    !hasMenu &&
    /<WorkspaceSwitcher[\s\S]*?\/>/.test(source) &&
    /<InviteDialog[\s\S]*?\/>/.test(source);
  const canPatchSession =
    sessionImport !== undefined &&
    !hasSession &&
    source.includes("{USER.email}") &&
    source.includes("<SidebarFooter>");
  if (!canPatchMenu && !canPatchSession) {
    return hasMenu ? source : undefined;
  }

  let out = source;
  if (canPatchMenu) {
    out = insertImport(out, `import { WorkspaceMenu } from ${JSON.stringify(workspaceImport)};`);
    out = insertImport(out, `import { InviteMember } from ${JSON.stringify(inviteImport)};`);
    out = out.replace(/<WorkspaceSwitcher[\s\S]*?\/>/, "<WorkspaceMenu />");
    out = out.replace(/<InviteDialog([\s\S]*?)\/>/, "<InviteMember$1/>");
    out = out.replace(/\nconst WORKSPACES = \[[\s\S]*?\];\n/, "\n");
    out = out.replace(/\s*const \[workspaceId, setWorkspaceId\] = useState\("[^"]*"\);\n/, "\n");
    out = out.replace(/,\s*useState/, "");
    out = out.replace(/\s*InviteDialog,\n/, "\n");
    out = out.replace(/\s*WorkspaceSwitcher,\n/, "\n");
  }
  if (canPatchSession && sessionImport !== undefined) {
    out = insertImport(out, `import { SessionUser } from ${JSON.stringify(sessionImport)};`);
    out = out.replace(
      /<SidebarFooter>\s*<div className="flex items-center gap-2 rounded-lg px-2 py-1\.5">[\s\S]*?<\/SidebarFooter>/,
      "<SidebarFooter>\n        <SessionUser />\n      </SidebarFooter>",
    );
    out = out.replace(
      /<Avatar className="size-8">\s*\{OWNER\?\.avatar \? <AvatarImage src=\{OWNER\.avatar\} alt=\{USER\.name\} \/> : null\}\s*<AvatarFallback>\{USER\.initials\}<\/AvatarFallback>\s*<\/Avatar>/,
      "<SessionUser compact />",
    );
    out = out.replace(/\nimport \{ TEAM, USER \} from "[^"]+";\n/, "\n");
    out = out.replace(/\nconst OWNER = TEAM\.find\(\(m\) => m\.email === USER\.email\);\n/, "\n");
    out = out.replace(/\s*Avatar,\n/, "\n");
    out = out.replace(/\s*AvatarFallback,\n/, "\n");
    out = out.replace(/\s*AvatarImage,\n/, "\n");
  }
  return out;
}

function nextConfigSource(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
`;
}

/** Insert ItemsPanel into a generated home page. Returns undefined when there is no main. */
export function patchHomePageSource(source: string, itemsImport: string): string | undefined {
  if (!/<main\b/.test(source)) return undefined;
  let out = source;
  const importLine = `import { ItemsPanel } from ${JSON.stringify(itemsImport)};`;
  if (!out.includes(importLine)) {
    const match = out.match(/^import .+$/m);
    if (match?.index !== undefined) {
      out = `${out.slice(0, match.index)}${importLine}\n${out.slice(match.index)}`;
    } else {
      out = `${importLine}\n${out}`;
    }
  }
  out = out.replace(/export default(?! async) function/, "export default async function");
  if (!/<ItemsPanel\s*\/>/.test(out)) {
    out = out.replace(/(<main\b[^>]*>)/, "$1\n      <ItemsPanel />");
  }
  return out;
}

/**
 * Replace the catalog TeamBlock on a generated /team page with MembersPanel.
 * Idempotent. Returns undefined when there is no TeamBlock and no MembersPanel.
 */
export function patchTeamPageSource(source: string, membersImport: string): string | undefined {
  const hasPanel = /<MembersPanel\s*\/>/.test(source);
  const hasTeam = /<TeamBlock\s*\/>/.test(source);
  if (!hasPanel && !hasTeam) return undefined;
  if (hasPanel) return source;
  let out = source;
  const importLine = `import { MembersPanel } from ${JSON.stringify(membersImport)};`;
  out = insertImport(out, importLine);
  out = out.replace(/import \{ TeamBlock \} from "[^"]+";\n/, "");
  out = out.replace(/export default(?! async) function/, "export default async function");
  out = out.replace(/<TeamBlock\s*\/>/, "<MembersPanel />");
  return out;
}

/**
 * Validate the session in the shell layout so a stale cookie cannot sit in the
 * app chrome. Idempotent. Returns undefined when AppShellNav is missing.
 */
export function patchShellLayoutSource(source: string, authImport: string): string | undefined {
  if (source.includes("auth.api.getSession") && source.includes('redirect("/login")')) {
    return source;
  }
  if (!source.includes("AppShellNav") || !source.includes("{children}")) return undefined;
  let out = source;
  out = insertImport(out, `import { headers } from "next/headers";`);
  out = insertImport(out, `import { redirect } from "next/navigation";`);
  out = insertImport(out, `import { auth } from ${JSON.stringify(authImport)};`);
  out = out.replace(/export default(?! async) function/, "export default async function");
  if (!out.includes("auth.api.getSession")) {
    out = out.replace(
      /(\{ children \}: \{ children: ReactNode \}\) \{)\n/,
      `$1
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
`,
    );
  }
  return out;
}

function mergePackageJson(raw: string): string {
  const pkg = JSON.parse(raw) as {
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: unknown;
  };
  const dependencies = { ...(pkg.dependencies ?? {}) };
  const devDependencies = { ...(pkg.devDependencies ?? {}) };
  const scripts = { ...(pkg.scripts ?? {}) };
  for (const [name, range] of Object.entries(GOLD_PATH_PROD_DEPS)) {
    dependencies[name] ??= range;
  }
  for (const [name, range] of Object.entries(GOLD_PATH_DEV_DEPS)) {
    devDependencies[name] ??= range;
  }
  for (const [name, cmd] of Object.entries(GOLD_PATH_SCRIPTS)) {
    scripts[name] ??= cmd;
  }
  pkg.dependencies = dependencies;
  pkg.devDependencies = devDependencies;
  pkg.scripts = scripts;
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

function mergeNextConfig(raw: string): string {
  if (raw.includes("better-sqlite3")) return raw;
  if (/serverExternalPackages:\s*\[/.test(raw)) {
    return raw.replace(
      /serverExternalPackages:\s*\[/,
      'serverExternalPackages: ["better-sqlite3", ',
    );
  }
  const empty = raw.replace(
    /const nextConfig = \{\s*\}/,
    'const nextConfig = {\n  serverExternalPackages: ["better-sqlite3"],\n}',
  );
  if (empty !== raw) return empty;
  if (raw.includes("const nextConfig = {")) {
    return raw.replace(
      /const nextConfig = \{/,
      'const nextConfig = {\n  serverExternalPackages: ["better-sqlite3"],',
    );
  }
  return `${raw.trimEnd()}\n`;
}

function mergeEnvExample(raw: string): string {
  const lines = raw.split(/\r?\n/);
  const keys = new Set(
    lines.map((line) => {
      const eq = line.indexOf("=");
      return eq === -1 ? line.trim() : line.slice(0, eq).trim();
    }),
  );
  const extra: string[] = [];
  for (const [key, value] of Object.entries(ENV_VARS)) {
    if (!keys.has(key)) extra.push(`${key}=${value}`);
  }
  if (extra.length === 0) return raw.endsWith("\n") ? raw : `${raw}\n`;
  const base = raw.endsWith("\n") || raw.length === 0 ? raw : `${raw}\n`;
  return `${base}${extra.join("\n")}\n`;
}

function mergeGitignore(raw: string): string {
  const lines = raw.split(/\r?\n/);
  const have = new Set(lines.map((l) => l.trim()));
  const extra = GITIGNORE_ENTRIES.filter((entry) => !have.has(entry));
  if (extra.length === 0) return raw.endsWith("\n") ? raw : `${raw}\n`;
  const base = raw.endsWith("\n") || raw.length === 0 ? raw : `${raw}\n`;
  return `${base}${extra.join("\n")}\n`;
}

async function writeRel(
  targetDir: string,
  rel: string,
  content: string,
  overwrite: boolean,
  always: boolean,
  written: string[],
  skipped: string[],
): Promise<void> {
  const dest = resolveSafeDest(targetDir, ".", rel);
  if (!always && existsSync(dest) && !overwrite) {
    skipped.push(rel);
    return;
  }
  await writeFileEnsured(dest, content);
  written.push(rel);
}

/**
 * Write sqlite + Drizzle + Better-Auth files into a composed saas/admin app.
 * Overwrites lib/auth-adapter.ts, lib/items.ts, and lib/members.ts always.
 * Patches the shell home, /team, and shell layout only when compose wrote them
 * this run.
 */
export async function applyGoldPath(options: ApplyGoldPathOptions): Promise<ApplyGoldPathResult> {
  const { targetDir, config, generatedFiles, overwrite } = options;
  const layout = goldPathLayout(config);
  const appDir = resolveAppDir(targetDir, layout, generatedFiles);
  const middlewareRel =
    appDir === "src/app"
      ? "src/middleware.ts"
      : appDir === "app"
        ? "middleware.ts"
        : layout.middlewareRel;
  const authImport = `${config.aliases.lib}/auth`;
  const authClientImport = `${config.aliases.lib}/auth-client`;
  const itemsActionsImport = `${config.aliases.lib}/items`;
  const itemsViewImport = "@/components/items-view";
  const itemsImport = "@/components/items-panel";
  const membersActionsImport = `${config.aliases.lib}/members`;
  const membersViewImport = "@/components/members-view";
  const membersImport = "@/components/members-panel";
  const workspaceImport = "@/components/workspace-menu";
  const inviteImport = "@/components/invite-member";
  const sessionImport = "@/components/session-user";
  const chromeRel = `${posix(config.paths.blocks)}/app-shell-chrome.tsx`;

  const written: string[] = [];
  const skipped: string[] = [];

  const files: Array<{ rel: string; content: string; always?: boolean }> = [
    { rel: "drizzle.config.ts", content: drizzleConfigSource(layout.dbDir) },
    { rel: `${layout.dbDir}/schema.ts`, content: dbSchemaSource() },
    { rel: `${layout.dbDir}/index.ts`, content: dbClientSource() },
    { rel: `${layout.libDir}/auth.ts`, content: authServerSource() },
    { rel: `${layout.libDir}/auth-client.ts`, content: authClientSource() },
    { rel: `${layout.libDir}/auth-adapter.ts`, content: authAdapterSource(), always: true },
    {
      rel: `${layout.libDir}/items.ts`,
      content: itemsActionsSource(authImport),
      always: true,
    },
    {
      rel: `${appDir}/api/auth/[...all]/route.ts`,
      content: authRouteSource(authImport),
    },
    { rel: middlewareRel, content: middlewareSource() },
    {
      rel: `${layout.componentsDir}/items-panel.tsx`,
      content: itemsPanelSource(itemsActionsImport, itemsViewImport),
      always: true,
    },
    {
      rel: `${layout.componentsDir}/items-view.tsx`,
      content: itemsViewSource(itemsActionsImport),
      always: true,
    },
    {
      rel: `${layout.libDir}/members.ts`,
      content: membersActionsSource(authImport),
      always: true,
    },
    {
      rel: `${layout.componentsDir}/members-panel.tsx`,
      content: membersPanelSource(membersActionsImport, membersViewImport),
      always: true,
    },
    {
      rel: `${layout.componentsDir}/members-view.tsx`,
      content: membersViewSource(inviteImport),
      always: true,
    },
    {
      rel: `${layout.componentsDir}/workspace-menu.tsx`,
      content: workspaceMenuSource(authClientImport),
      always: true,
    },
    {
      rel: `${layout.componentsDir}/invite-member.tsx`,
      content: inviteMemberSource(authClientImport),
      always: true,
    },
    {
      rel: `${layout.componentsDir}/session-user.tsx`,
      content: sessionUserSource(authClientImport),
      always: true,
    },
    {
      rel: `${appDir}/(bare)/accept-invitation/page.tsx`,
      content: acceptInvitationPageSource(authClientImport),
      always: true,
    },
  ];

  for (const file of files) {
    await writeRel(
      targetDir,
      file.rel,
      file.content,
      overwrite,
      file.always === true,
      written,
      skipped,
    );
  }

  const chromeDest = resolveSafeDest(targetDir, ".", chromeRel);
  if (existsSync(chromeDest)) {
    const current = await readFile(chromeDest, "utf8");
    const patched = patchChromeSource(current, workspaceImport, inviteImport, sessionImport);
    if (patched !== undefined && patched !== current) {
      await writeFileEnsured(chromeDest, patched);
      if (!written.includes(chromeRel)) written.push(chromeRel);
      const templateName = options.templateName;
      if (templateName !== undefined) {
        const snapDest = resolveSafeDest(targetDir, baseSnapshotDir(templateName), chromeRel);
        await writeFileEnsured(snapDest, patched);
      }
    }
  }

  const layoutRel = shellLayoutRel(appDir, generatedFiles);
  if (layoutRel !== undefined) {
    const dest = resolveSafeDest(targetDir, ".", layoutRel);
    if (existsSync(dest)) {
      const current = await readFile(dest, "utf8");
      const patched = patchShellLayoutSource(current, authImport);
      if (patched !== undefined && patched !== current) {
        await writeFileEnsured(dest, patched);
        const templateName = options.templateName;
        if (templateName !== undefined) {
          const snapDest = resolveSafeDest(targetDir, baseSnapshotDir(templateName), layoutRel);
          await writeFileEnsured(snapDest, patched);
        }
      }
    }
  }

  const teamRel = teamPageRel(appDir, generatedFiles);
  if (teamRel !== undefined) {
    const dest = resolveSafeDest(targetDir, ".", teamRel);
    if (existsSync(dest)) {
      const current = await readFile(dest, "utf8");
      const patched = patchTeamPageSource(current, membersImport);
      if (patched !== undefined && patched !== current) {
        await writeFileEnsured(dest, patched);
        const templateName = options.templateName;
        if (templateName !== undefined) {
          const snapDest = resolveSafeDest(targetDir, baseSnapshotDir(templateName), teamRel);
          await writeFileEnsured(snapDest, patched);
        }
      }
    }
  }

  const homeRel = homePageRel(appDir, generatedFiles);
  if (homeRel !== undefined) {
    const dest = resolveSafeDest(targetDir, ".", homeRel);
    if (existsSync(dest)) {
      const current = await readFile(dest, "utf8");
      const patched = patchHomePageSource(current, itemsImport);
      if (patched !== undefined && patched !== current) {
        await writeFileEnsured(dest, patched);
        const templateName = options.templateName;
        if (templateName !== undefined) {
          const snapDest = resolveSafeDest(targetDir, baseSnapshotDir(templateName), homeRel);
          await writeFileEnsured(snapDest, patched);
        }
      }
    }
  }

  await mergeTextFile(targetDir, "package.json", mergePackageJson);
  await mergeOrCreate(targetDir, "next.config.mjs", nextConfigSource(), mergeNextConfig);
  await mergeOrCreate(
    targetDir,
    ".env.example",
    `${Object.entries(ENV_VARS)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n")}\n`,
    mergeEnvExample,
  );
  await mergeOrCreate(targetDir, ".gitignore", `${GITIGNORE_ENTRIES.join("\n")}\n`, mergeGitignore);

  return { written, skipped };
}

async function mergeOrCreate(
  targetDir: string,
  rel: string,
  created: string,
  merge: (raw: string) => string,
): Promise<void> {
  const dest = resolveSafeDest(targetDir, ".", rel);
  if (!existsSync(dest)) {
    await writeFileEnsured(dest, created);
    return;
  }
  const raw = await readFile(dest, "utf8");
  const next = merge(raw);
  if (next !== raw) await writeFileEnsured(dest, next);
}

async function mergeTextFile(
  targetDir: string,
  rel: string,
  merge: (raw: string) => string,
): Promise<void> {
  const dest = resolveSafeDest(targetDir, ".", rel);
  if (!existsSync(dest)) return;
  const raw = await readFile(dest, "utf8");
  let next: string;
  try {
    next = merge(raw);
  } catch {
    return;
  }
  if (next !== raw) await writeFileEnsured(dest, next);
}
