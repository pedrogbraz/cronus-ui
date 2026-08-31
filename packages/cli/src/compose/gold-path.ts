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
  "better-sqlite3@^13.0.3",
  "better-auth@^1.7.2",
] as const;

const GOLD_PATH_PROD_DEPS: Record<string, string> = {
  "drizzle-orm": "^0.45.2",
  "better-sqlite3": "^13.0.3",
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

function drizzleConfigSource(dbDir: string): string {
  return `import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./${dbDir}/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "${DATABASE_URL_FALLBACK}" },
});
`;
}

function dbSchemaSource(): string {
  return `import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
});

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
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ url }) => {
      console.info(url);
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [nextCookies()],
});
`;
}

function authClientSource(): string {
  return `import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
`;
}

function authAdapterSource(): string {
  return `import { authClient } from "./auth-client";

export async function signInEmail({ email, password }: { email: string; password: string }) {
  const { error } = await authClient.signIn.email({ email, password, callbackURL: "/" });
  if (error) throw new Error(error.message || "Sign in failed");
  window.location.assign("/");
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
  const { error } = await authClient.signUp.email({
    email,
    password,
    name: name ?? email,
    callbackURL: "/",
  });
  if (error) throw new Error(error.message || "Sign up failed");
  window.location.assign("/");
}

export async function requestPasswordReset({ email }: { email: string }) {
  const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/login" });
  if (error) throw new Error(error.message || "Reset failed");
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

const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];

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
  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
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

function itemsPanelSource(authImport: string): string {
  return `import { headers } from "next/headers";
import { db } from "@/db";
import { items } from "@/db/schema";
import { auth } from ${JSON.stringify(authImport)};

export async function ItemsPanel() {
  const session = await auth.api.getSession({ headers: await headers() });
  const rows = await db.select().from(items);
  const email = session?.user?.email ?? "signed out";
  const count = String(rows.length);
  return (
    <p className="px-6 pt-6 text-sm text-fg-tertiary">
      {email} · {count} items
    </p>
  );
}
`;
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
 * Overwrites lib/auth-adapter.ts always (replaces the demo adapter). Patches
 * the shell home page only when compose wrote it this run.
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
  const itemsImport = "@/components/items-panel";

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
      rel: `${appDir}/api/auth/[...all]/route.ts`,
      content: authRouteSource(authImport),
    },
    { rel: middlewareRel, content: middlewareSource() },
    { rel: `${layout.componentsDir}/items-panel.tsx`, content: itemsPanelSource(authImport) },
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
