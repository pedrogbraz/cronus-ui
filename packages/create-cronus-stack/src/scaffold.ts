import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type Assistant, type Skill, writeAiKit, writeDesignDocuments } from "@cronus-ui/ai-kit";
import type { Catalog, StackConfig } from "@cronus-ui/stack";
import {
  catalog as defaultCatalog,
  generateKickoff,
  generateStackJson,
  sanitizeProjectName,
} from "@cronus-ui/stack";
import { type PackageManager, packageManagerFromConfig, runCommand } from "./utils.js";
import { CREATE_STACK_VERSION } from "./version.js";

export interface ScaffoldStackOptions {
  targetDir: string;
  projectName: string;
  config: StackConfig;
  catalog?: Catalog;
}

export interface ScaffoldStackResult {
  fileCount: number;
  unsupported: string[];
}

function single(config: StackConfig, key: string): string | undefined {
  const value = config[key];
  return typeof value === "string" ? value : undefined;
}

function multi(config: StackConfig, key: string): string[] {
  const value = config[key];
  return Array.isArray(value) ? value : [];
}

function add(deps: Record<string, string>, name: string, range: string): void {
  deps[name] = range;
}

const CRONUS_UI_VERSION_RANGE = `^${CREATE_STACK_VERSION}`;
const CRONUS_UI_REGISTRY = `https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v${CREATE_STACK_VERSION}/registry`;

function write(targetDir: string, rel: string, content: string): void {
  const path = join(targetDir, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function appDir(config: StackConfig): "app" | "src/app" {
  return single(config, "structure") === "structure-root" ? "app" : "src/app";
}

function aliasTarget(config: StackConfig): string | undefined {
  if (single(config, "importAlias") !== "import-alias") return undefined;
  return appDir(config).startsWith("src/") ? "./src/*" : "./*";
}

function cronusUiPaths(config: StackConfig): Record<"ui" | "lib" | "blocks", string> {
  const prefix = appDir(config).startsWith("src/") ? "src/" : "";
  return {
    ui: `${prefix}components/ui`,
    lib: `${prefix}lib`,
    blocks: `${prefix}components/blocks`,
  };
}

function usesCronusUi(config: StackConfig): boolean {
  return single(config, "ui") === "ui-cronus";
}

const SQL_DATABASES = new Set(["db-sqlite", "db-postgres", "db-mysql"]);
const HOSTED_DB_SETUPS = new Set([
  "dbsetup-turso",
  "dbsetup-neon",
  "dbsetup-supabase",
  "dbsetup-planetscale",
  "dbsetup-d1",
  "dbsetup-atlas",
]);

function sqlDialect(config: StackConfig): "sqlite" | "postgresql" | "mysql" | undefined {
  switch (single(config, "database")) {
    case "db-sqlite":
      return "sqlite";
    case "db-postgres":
      return "postgresql";
    case "db-mysql":
      return "mysql";
    default:
      return undefined;
  }
}

function emitsDrizzle(config: StackConfig): boolean {
  return (
    single(config, "web") === "web-next" &&
    single(config, "orm") === "orm-drizzle" &&
    SQL_DATABASES.has(single(config, "database") ?? "")
  );
}

function emitsBetterAuth(config: StackConfig): boolean {
  return emitsDrizzle(config) && single(config, "auth") === "auth-better-auth";
}

function usesImportAlias(config: StackConfig): boolean {
  return single(config, "importAlias") === "import-alias";
}

function sourceRoot(config: StackConfig): "" | "src/" {
  return single(config, "structure") === "structure-root" ? "" : "src/";
}

function dbDir(config: StackConfig): string {
  return `${sourceRoot(config)}db`;
}

function libDir(config: StackConfig): string {
  return `${sourceRoot(config)}lib`;
}

function defaultDatabaseUrl(config: StackConfig): string | undefined {
  switch (single(config, "database")) {
    case "db-sqlite":
      return "file:./data/app.db";
    case "db-postgres":
      return "postgres://postgres:postgres@localhost:5432/app";
    case "db-mysql":
      return "mysql://root:password@localhost:3306/app";
    default:
      return undefined;
  }
}

function betterAuthProvider(config: StackConfig): "sqlite" | "pg" | "mysql" {
  switch (single(config, "database")) {
    case "db-postgres":
      return "pg";
    case "db-mysql":
      return "mysql";
    default:
      return "sqlite";
  }
}

function dbModuleImport(config: StackConfig, subpath?: "schema"): string {
  const target = subpath ? `db/${subpath}` : "db";
  return usesImportAlias(config) ? `@/${target}` : `../${target}`;
}

function authModuleImport(config: StackConfig): string {
  return usesImportAlias(config) ? "@/lib/auth" : "../../../../lib/auth";
}

function scriptCommand(pm: PackageManager, script: string): string {
  return pm === "npm" ? `npm run ${script}` : `${pm} ${script}`;
}

function packageJson(projectName: string, config: StackConfig): string {
  const isNext = single(config, "web") === "web-next";
  const isCronusUi = usesCronusUi(config);
  const deps: Record<string, string> = {};
  const devDeps: Record<string, string> = {
    typescript: "^6.0.3",
  };

  if (isNext) {
    add(deps, "next", "16.2.10");
    add(deps, "react", "^19.2.0");
    add(deps, "react-dom", "^19.2.0");
    add(devDeps, "@types/node", "^22.10.0");
    add(devDeps, "@types/react", "^19.0.0");
    add(devDeps, "@types/react-dom", "^19.0.0");
  }

  if (isCronusUi) {
    add(deps, "@cronus-ui/theme", CRONUS_UI_VERSION_RANGE);
    add(deps, "@cronus-ui/tokens", CRONUS_UI_VERSION_RANGE);
    add(deps, "@cronus-ui/ui", CRONUS_UI_VERSION_RANGE);
    add(devDeps, "@tailwindcss/postcss", "^4.3.0");
    add(devDeps, "tailwindcss", "^4.3.0");
  }

  if (multi(config, "addons").includes("addon-biome")) {
    add(devDeps, "@biomejs/biome", "^2.0.6");
  }

  if (single(config, "commitStyle") === "commit-conventional") {
    add(devDeps, "@commitlint/cli", "^20.2.0");
    add(devDeps, "@commitlint/config-conventional", "^20.2.0");
  }

  if (emitsDrizzle(config)) {
    add(deps, "drizzle-orm", "^0.45.2");
    add(devDeps, "drizzle-kit", "^0.31.10");
    switch (single(config, "database")) {
      case "db-sqlite":
        add(deps, "better-sqlite3", "^12.0.0");
        add(devDeps, "@types/better-sqlite3", "^9.6.0");
        break;
      case "db-postgres":
        add(deps, "postgres", "^3.4.9");
        break;
      case "db-mysql":
        add(deps, "mysql2", "^3.24.2");
        break;
    }
  }
  if (emitsBetterAuth(config)) {
    add(deps, "better-auth", "^1.7.2");
  }

  const scripts: Record<string, string> = isNext
    ? {
        dev: "next dev",
        build: "next build",
        start: "next start",
        typecheck: "tsc --noEmit",
      }
    : {
        dev: 'echo "Open KICKOFF.md and wire the selected framework scaffold."',
        build: "tsc --noEmit",
        typecheck: "tsc --noEmit",
      };

  if (multi(config, "addons").includes("addon-biome")) {
    scripts.lint = "biome check .";
    scripts.format = "biome format --write .";
  }
  if (emitsDrizzle(config)) {
    scripts["db:push"] = "drizzle-kit push";
    scripts["db:generate"] = "drizzle-kit generate";
    scripts["db:studio"] = "drizzle-kit studio";
  } else if (single(config, "database") !== "db-none") {
    scripts["db:push"] = 'echo "Configure the selected database/ORM before syncing schema."';
  }

  return `${JSON.stringify(
    {
      name: projectName,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts,
      dependencies: deps,
      devDependencies: devDeps,
    },
    null,
    2,
  )}\n`;
}

function tsconfig(config: StackConfig): string {
  const alias = aliasTarget(config);
  const strict = single(config, "tsStrict") === "ts-strict";
  const compilerOptions: Record<string, unknown> = {
    target: "ES2022",
    lib: ["dom", "dom.iterable", "ES2022"],
    allowJs: true,
    skipLibCheck: true,
    strict,
    noEmit: true,
    esModuleInterop: true,
    module: "esnext",
    moduleResolution: "bundler",
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: "preserve",
    incremental: true,
  };
  if (strict) {
    compilerOptions.noUncheckedIndexedAccess = true;
    compilerOptions.noImplicitOverride = true;
  }
  if (alias) compilerOptions.paths = { "@/*": [alias] };
  if (single(config, "web") === "web-next") compilerOptions.plugins = [{ name: "next" }];

  return `${JSON.stringify(
    {
      compilerOptions,
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  )}\n`;
}

function globalsCss(config: StackConfig): string {
  const app = appDir(config);
  const sourceNodeModules = app.startsWith("src/")
    ? "../../node_modules/@cronus-ui/ui/dist/**/*.js"
    : "../node_modules/@cronus-ui/ui/dist/**/*.js";
  const sourceApp = app.startsWith("src/") ? "../**/*.{ts,tsx}" : "./**/*.{ts,tsx}";
  return `@import "tailwindcss";
@import "@cronus-ui/tokens/styles.css";

@source "${sourceNodeModules}";
@source "${sourceApp}";
`;
}

function neutralGlobalsCss(): string {
  return `:root {
  color-scheme: light dark;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #0f172a;
  color: #f8fafc;
}

a {
  color: inherit;
}
`;
}

function layoutTsx(projectName: string): string {
  return `import { CronusThemeScript, CronusUIProvider } from "@cronus-ui/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "A Next.js app built with Cronus UI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <CronusThemeScript storageKey="theme" defaultThemeName="aurora" defaultModeName="dark" />
      </head>
      <body>
        <CronusUIProvider
          asRoot
          storageKey="theme"
          defaultThemeName="aurora"
          defaultModeName="dark"
        >
          {children}
        </CronusUIProvider>
      </body>
    </html>
  );
}
`;
}

function neutralLayoutTsx(projectName: string): string {
  return `import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "A Next.js app generated by create-cronus-stack.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
}

function fromAppImport(config: StackConfig, target: string): string {
  return usesImportAlias(config) ? `@/${target}` : `../${target}`;
}

function pageStatusCopy(config: StackConfig): string {
  if (emitsBetterAuth(config) && emitsDrizzle(config)) {
    return `          {session ? (
            <p className="max-w-prose text-fg-secondary">
              Signed in as {session.user?.email}. {itemCount} items in the active workspace.
            </p>
          ) : (
            <p className="max-w-prose text-fg-secondary">
              Sign in required on this stack. Middleware redirects unsigned-in visitors to /login.
            </p>
          )}`;
  }
  if (emitsDrizzle(config)) {
    return `          <p className="max-w-prose text-fg-secondary">
            {itemCount} items in the database. Read KICKOFF.md before changing frameworks,
            databases, auth, payments, or design-system rules.
          </p>`;
  }
  return `          <p className="max-w-prose text-fg-secondary">
            This app was scaffolded from the Cronus Stack Builder. Read KICKOFF.md before changing
            frameworks, databases, auth, payments, or design-system rules.
          </p>`;
}

function pageTsx(config: StackConfig): string {
  const withDrizzle = emitsDrizzle(config);
  const withAuth = emitsBetterAuth(config);
  const extraImports = [
    withDrizzle && withAuth
      ? 'import { count, eq } from "drizzle-orm";'
      : withDrizzle
        ? 'import { count } from "drizzle-orm";'
        : undefined,
    withAuth ? 'import { headers } from "next/headers";' : undefined,
    withDrizzle ? `import { db } from "${fromAppImport(config, "db")}";` : undefined,
    withDrizzle && withAuth
      ? `import { items, member } from "${fromAppImport(config, "db/schema")}";`
      : withDrizzle
        ? `import { items } from "${fromAppImport(config, "db/schema")}";`
        : undefined,
    withAuth ? `import { auth } from "${fromAppImport(config, "lib/auth")}";` : undefined,
  ]
    .filter((line): line is string => line !== undefined)
    .join("\n");
  const asyncKw = withDrizzle || withAuth ? "async " : "";
  let loader = "";
  if (withDrizzle && withAuth) {
    loader = `  const session = await auth.api.getSession({ headers: await headers() });
  let orgId = session?.session?.activeOrganizationId ?? null;
  if (!orgId && session?.user?.id) {
    const [row] = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, session.user.id))
      .limit(1);
    orgId = row?.organizationId ?? null;
  }
  const [itemRow] = orgId
    ? await db.select({ value: count() }).from(items).where(eq(items.workspaceId, orgId))
    : [{ value: 0 }];
  const itemCount = new Intl.NumberFormat("en-US").format(Number(itemRow?.value ?? 0));

`;
  } else if (withDrizzle) {
    loader = `  const [itemRow] = await db.select({ value: count() }).from(items);
  const itemCount = new Intl.NumberFormat("en-US").format(Number(itemRow?.value ?? 0));

`;
  } else if (withAuth) {
    loader = `  const session = await auth.api.getSession({ headers: await headers() });

`;
  }

  return `import { Badge } from "@cronus-ui/ui/badge";
import { Button } from "@cronus-ui/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cronus-ui/ui/card";
${extraImports ? `${extraImports}\n` : ""}
const metrics = [
  { label: "Revenue", value: "R$ 48.2k" },
  { label: "Active users", value: "2,318" },
  { label: "NPS", value: "72" },
];

export default ${asyncKw}function Page() {
${loader}  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4">
        <Badge variant="primary" className="w-fit">
          Built with Cronus UI
        </Badge>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-fg">Your stack is ready</h1>
${pageStatusCopy(config)}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Start building</Button>
          <Button variant="outline">Read KICKOFF.md</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle>{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-fg-secondary">
              Replace this with your real product data.
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
`;
}

function neutralPageTsx(config: StackConfig): string {
  const uiStep =
    single(config, "ui") === "ui-none"
      ? "No UI library was selected; add product UI intentionally when the design direction is clear."
      : "Install and configure the selected UI library from stack.json.";
  return `const nextSteps = [
  "Read KICKOFF.md before installing framework, UI, database, auth, or payment adapters.",
  "${uiStep}",
  "Replace this neutral starter with product-specific routes and components.",
];

export default function Page() {
  return (
    <main style={{ margin: "0 auto", maxWidth: "64rem", padding: "4rem 1.5rem" }}>
      <p style={{ color: "#38bdf8", fontSize: "0.875rem", fontWeight: 700 }}>
        Generated by create-cronus-stack
      </p>
      <h1 style={{ fontSize: "3rem", letterSpacing: "-0.04em", margin: "1rem 0" }}>
        Your neutral stack starter is ready
      </h1>
      <p style={{ color: "#cbd5e1", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "42rem" }}>
        This project records your selected stack in KICKOFF.md and stack.json. The default Cronus UI
        stack is runnable immediately; non-Cronus UI choices are intentionally left as explicit
        follow-up so the scaffold does not install or import the wrong design system.
      </p>
      <ul style={{ color: "#e2e8f0", lineHeight: 1.8, marginTop: "2rem", paddingLeft: "1.25rem" }}>
        {nextSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
    </main>
  );
}
`;
}

function basicIndex(projectName: string): string {
  return `console.log("${projectName}: read KICKOFF.md and wire the selected framework scaffold.");
`;
}

function readme(projectName: string, config: StackConfig, unsupported: string[]): string {
  const pm = packageManagerFromConfig(config);
  const install = pm === "yarn" ? "yarn" : `${pm} install`;
  const runLines = [install];
  if (emitsDrizzle(config) && single(config, "database") === "db-sqlite") {
    runLines.push(scriptCommand(pm, "db:push"));
  }
  runLines.push(scriptCommand(pm, "dev"));
  return `# ${projectName}

Generated by \`create-cronus-stack\`.

Read \`KICKOFF.md\` first. It is the source of truth for stack choices,
conventions, AI capabilities, guardrails, and Definition of Done.

## Run

\`\`\`sh
${runLines.join("\n")}
\`\`\`

## Generated artifacts

- \`stack.json\` — machine-readable resolved stack.
- \`KICKOFF.md\` — handoff prompt for the coding agent.
- App starter files for the supported scaffold path.

${unsupported.length ? `## Manual follow-up\n\n${unsupported.map((item) => `- ${item}`).join("\n")}\n` : ""}
`;
}

function envExample(config: StackConfig): string | undefined {
  const lines: string[] = [];
  if (single(config, "database") !== "db-none") {
    const url = emitsDrizzle(config) ? (defaultDatabaseUrl(config) ?? "") : "";
    lines.push(`DATABASE_URL=${url}`);
  }
  if (emitsBetterAuth(config)) {
    lines.push("BETTER_AUTH_SECRET=change-me-to-a-32-character-secret");
    lines.push("BETTER_AUTH_URL=http://localhost:3000");
  } else if (single(config, "auth") !== "auth-none") {
    lines.push("AUTH_SECRET=");
  }
  if (single(config, "payments") !== "pay-none") {
    lines.push("PAYMENTS_SECRET_KEY=");
    lines.push("PAYMENTS_WEBHOOK_SECRET=");
  }
  return lines.length ? `${lines.join("\n")}\n` : undefined;
}

function gitignore(config: StackConfig): string {
  const lines = ["node_modules", ".next", "dist", ".env*", "!.env.example", ".DS_Store"];
  if (emitsDrizzle(config)) {
    lines.push("*.db", "data/", "drizzle/");
  }
  return `${lines.join("\n")}\n`;
}

function nextConfigMjs(config: StackConfig): string {
  const body =
    emitsDrizzle(config) && single(config, "database") === "db-sqlite"
      ? `{
  serverExternalPackages: ["better-sqlite3"],
}`
      : "{}";
  return `/** @type {import('next').NextConfig} */
const nextConfig = ${body};

export default nextConfig;
`;
}

function assistantIds(config: StackConfig): Assistant[] {
  const picked = new Set<Assistant>();
  for (const id of multi(config, "assistants")) {
    if (id === "ai-claude-code") picked.add("claude");
    if (id === "ai-cursor") picked.add("cursor");
    if (id === "ai-copilot") picked.add("copilot");
    if (id === "ai-windsurf") picked.add("windsurf");
  }
  return [...picked];
}

const CATALOG_SKILL_TO_KIT: Record<string, Skill> = {
  "skill-ui-add": "ui-add",
  "skill-theme": "theme",
  "skill-compose": "compose",
  "skill-upgrade": "upgrade",
  "skill-code-review": "code-review",
  "skill-ship-pr": "ship-pr",
  "skill-evidence-check": "evidence-check",
};

/** Catalog skill ids → AI Kit skills. Empty selection keeps the kit default. */
function kitSkillsFromConfig(config: StackConfig): readonly Skill[] | undefined {
  const selected = multi(config, "skills");
  if (selected.length === 0) return undefined;
  const mapped: Skill[] = [];
  for (const id of selected) {
    const skill = CATALOG_SKILL_TO_KIT[id];
    if (skill) mapped.push(skill);
  }
  return mapped;
}

function drizzleConfig(config: StackConfig): string {
  const dialect = sqlDialect(config) ?? "sqlite";
  const fallback = defaultDatabaseUrl(config) ?? "file:./data/app.db";
  if (dialect === "sqlite") {
    return `import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "${fallback}";
const fileFromUrl = url.startsWith("file:") ? url.slice("file:".length) : url;
mkdirSync(dirname(fileFromUrl) || ".", { recursive: true });

export default defineConfig({
  dialect: "sqlite",
  schema: "./${dbDir(config)}/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
});
`;
  }
  return `import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "${dialect}",
  schema: "./${dbDir(config)}/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "${fallback}" },
});
`;
}

function sqliteAuthTables(): string {
  return `
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
`;
}

function pgAuthTables(): string {
  return `
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: text("active_organization_id"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
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
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull(),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
`;
}

function mysqlAuthTables(): string {
  return `
export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: varchar("active_organization_id", { length: 36 }),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  issuer: varchar("issuer", { length: 255 }).notNull(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const organization = mysqlTable("organization", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull(),
});

export const member = mysqlTable("member", {
  id: varchar("id", { length: 36 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = mysqlTable("invitation", {
  id: varchar("id", { length: 36 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  status: varchar("status", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  inviterId: varchar("inviter_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
`;
}

function drizzleSchema(config: StackConfig): string {
  const withAuth = emitsBetterAuth(config);
  switch (sqlDialect(config)) {
    case "postgresql": {
      const imports = withAuth
        ? 'import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";'
        : 'import { integer, pgTable, text } from "drizzle-orm/pg-core";';
      const workspaceCol = withAuth
        ? `\n  workspaceId: text("workspace_id").references(() => organization.id, { onDelete: "cascade" }),`
        : "";
      return `${imports}
${withAuth ? pgAuthTables() : ""}
export const items = pgTable("items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),${workspaceCol}
});
`;
    }
    case "mysql": {
      const imports = withAuth
        ? 'import { boolean, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";'
        : 'import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";';
      const workspaceCol = withAuth
        ? `\n  workspaceId: varchar("workspace_id", { length: 36 }).references(() => organization.id, { onDelete: "cascade" }),`
        : "";
      return `${imports}
${withAuth ? mysqlAuthTables() : ""}
export const items = mysqlTable("items", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),${workspaceCol}
});
`;
    }
    default: {
      const workspaceCol = withAuth
        ? `\n  workspaceId: text("workspace_id").references(() => organization.id, { onDelete: "cascade" }),`
        : "";
      return `import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
${withAuth ? sqliteAuthTables() : ""}
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),${workspaceCol}
});
`;
    }
  }
}

function drizzleClient(config: StackConfig): string {
  const fallback = defaultDatabaseUrl(config) ?? "file:./data/app.db";
  switch (sqlDialect(config)) {
    case "postgresql":
      return `import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "${fallback}";
const client = postgres(url);

export const db = drizzle(client, { schema });
`;
    case "mysql":
      return `import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "${fallback}";
const pool = mysql.createPool(url);

export const db = drizzle(pool, { schema, mode: "default" });
`;
    default:
      return `import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "${fallback}";
const fileFromUrl = url.startsWith("file:") ? url.slice("file:".length) : url;
mkdirSync(dirname(fileFromUrl) || ".", { recursive: true });
const sqlite = new Database(fileFromUrl);

export const db = drizzle(sqlite, { schema });
`;
  }
}

function betterAuthServer(config: StackConfig): string {
  const provider = betterAuthProvider(config);
  const dbImport = dbModuleImport(config);
  const schemaImport = dbModuleImport(config, "schema");
  return `import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { and, eq } from "drizzle-orm";
import { db } from "${dbImport}";
import * as schema from "${schemaImport}";
import {
  invitation as invitationTable,
  member,
  organization as organizationTable,
  user as userTable,
} from "${schemaImport}";

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
  database: drizzleAdapter(db, { provider: "${provider}", schema }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ url }) => {
      console.info("Password reset URL:", url);
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
  plugins: [
    organization({
      sendInvitationEmail: async (data) => {
        console.info(\`Invite \${data.email}: /accept-invitation?id=\${data.id}\`);
      },
    }),
    nextCookies(),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: authBaseURL(),
});
`;
}

function betterAuthMiddleware(): string {
  return `import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];

function invitationOf(request: NextRequest): string | null {
  const { pathname, searchParams } = request.nextUrl;
  return (
    searchParams.get("invitation") ??
    (pathname === "/accept-invitation" ? searchParams.get("id") : null)
  );
}

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const path = request.nextUrl.pathname;
  const isAuthPage = AUTH_PAGES.includes(path);
  const invitation = invitationOf(request);
  if (!sessionCookie && path === "/accept-invitation") {
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
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\\\..*).*)"],
};
`;
}

function acceptInvitationPage(config: StackConfig): string {
  const authClientImport = fromAppImport(config, "lib/auth-client");
  return `"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "${authClientImport}";

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
    <main>
      {error ? <p role="alert">{error}</p> : <p>Accepting invitation…</p>}
    </main>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<main><p>Accepting invitation…</p></main>}>
      <AcceptInvitation />
    </Suspense>
  );
}
`;
}

function betterAuthClient(): string {
  return `import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [organizationClient()],
});
`;
}

function betterAuthRoute(config: StackConfig): string {
  return `import { auth } from "${authModuleImport(config)}";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
`;
}

function unsupportedNotes(config: StackConfig): string[] {
  const notes: string[] = [];
  if (single(config, "web") !== "web-next") {
    notes.push(
      "The selected web framework is captured in KICKOFF.md; this generator currently writes a runnable app only for Next.js.",
    );
  }
  const ui = single(config, "ui");
  if (ui && ui !== "ui-cronus" && ui !== "ui-none") {
    notes.push(
      "The selected UI library is captured in KICKOFF.md; this generator writes a neutral Next.js starter unless Cronus UI is selected, so install and wire the chosen UI library manually.",
    );
  }
  if (
    single(config, "backend") !== "backend-none" &&
    single(config, "backend") !== "backend-fullstack-next"
  ) {
    notes.push("Add the selected dedicated backend service described in KICKOFF.md.");
  }
  if (emitsDrizzle(config)) {
    if (HOSTED_DB_SETUPS.has(single(config, "dbSetup") ?? "")) {
      notes.push(
        "Configure the selected hosted database provider; generated Drizzle files use a local DATABASE_URL.",
      );
    }
  } else if (single(config, "database") !== "db-none") {
    notes.push("Wire the selected database/ORM/provider before running db:push.");
  }
  if (!emitsBetterAuth(config) && single(config, "auth") !== "auth-none") {
    notes.push("Implement the selected auth provider and protect mutating routes.");
  }
  if (single(config, "payments") !== "pay-none") {
    notes.push("Implement payment webhooks server-side; never trust client-side amounts.");
  }
  const assistantIds = multi(config, "assistants");
  if (assistantIds.includes("ai-cline")) {
    notes.push("Add Cline workspace configuration manually; AI Kit does not emit Cline files yet.");
  }
  const mcpIds = multi(config, "mcp");
  const unsupportedMcp = mcpIds.filter((id) => id !== "mcp-cronus-ui");
  if (unsupportedMcp.length > 0) {
    notes.push(
      "Configure the selected non-Cronus MCP servers manually; the generated AI Kit template only ships the cronus-ui MCP entry today.",
    );
  }
  if (mcpIds.includes("mcp-cronus-ui") && !usesCronusUi(config)) {
    notes.push("The cronus-ui MCP server is not generated for stacks that do not use Cronus UI.");
  }
  const unsupportedAddons = multi(config, "addons").filter((id) => id !== "addon-biome");
  if (unsupportedAddons.length > 0) {
    notes.push(
      "Wire the selected addons manually unless noted otherwise; this generator currently scaffolds Biome config and records the rest in KICKOFF.md.",
    );
  }
  return notes;
}

export function assertWritableTarget(targetDir: string): void {
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    throw new Error(`Directory "${targetDir}" already exists and is not empty.`);
  }
}

export function scaffoldStack(options: ScaffoldStackOptions): ScaffoldStackResult {
  const { targetDir, config, catalog = defaultCatalog } = options;
  const projectName = sanitizeProjectName(options.projectName);
  const unsupported = unsupportedNotes(config);
  let fileCount = 0;
  const emit = (rel: string, content: string | undefined): void => {
    if (content === undefined) return;
    write(targetDir, rel, content);
    fileCount += 1;
  };

  mkdirSync(targetDir, { recursive: true });
  emit("package.json", packageJson(projectName, config));
  emit("README.md", readme(projectName, config, unsupported));
  emit("KICKOFF.md", generateKickoff(config, projectName, catalog));
  emit("stack.json", `${generateStackJson(config, projectName)}\n`);
  emit(".gitignore", gitignore(config));
  emit("tsconfig.json", tsconfig(config));
  emit(".env.example", envExample(config));

  if (single(config, "commitStyle") === "commit-conventional") {
    emit(
      "commitlint.config.cjs",
      'module.exports = { extends: ["@commitlint/config-conventional"] };\n',
    );
  }
  if (multi(config, "addons").includes("addon-biome")) {
    emit(
      "biome.json",
      `${JSON.stringify({ $schema: "https://biomejs.dev/schemas/2.0.6/schema.json", formatter: { enabled: true }, linter: { enabled: true } }, null, 2)}\n`,
    );
  }

  if (single(config, "web") === "web-next") {
    const isCronusUi = usesCronusUi(config);
    emit("next.config.mjs", nextConfigMjs(config));
    const app = appDir(config);
    if (isCronusUi) {
      emit("postcss.config.mjs", 'export default { plugins: { "@tailwindcss/postcss": {} } };\n');
      emit(`${app}/globals.css`, globalsCss(config));
      emit(`${app}/layout.tsx`, layoutTsx(projectName));
      emit(`${app}/page.tsx`, pageTsx(config));
      emit(
        "cronus-ui.json",
        `${JSON.stringify(
          {
            aliases: { ui: "@/components/ui", lib: "@/lib", blocks: "@/components/blocks" },
            paths: cronusUiPaths(config),
            registry: CRONUS_UI_REGISTRY,
            theme: { name: "aurora", mode: "dark" },
          },
          null,
          2,
        )}\n`,
      );
    } else {
      emit(`${app}/globals.css`, neutralGlobalsCss());
      emit(`${app}/layout.tsx`, neutralLayoutTsx(projectName));
      emit(`${app}/page.tsx`, neutralPageTsx(config));
    }

    if (emitsDrizzle(config)) {
      emit("drizzle.config.ts", drizzleConfig(config));
      emit(`${dbDir(config)}/schema.ts`, drizzleSchema(config));
      emit(`${dbDir(config)}/index.ts`, drizzleClient(config));
    }
    if (emitsBetterAuth(config)) {
      emit(`${libDir(config)}/auth.ts`, betterAuthServer(config));
      emit(`${libDir(config)}/auth-client.ts`, betterAuthClient());
      emit(`${app}/api/auth/[...all]/route.ts`, betterAuthRoute(config));
      emit(
        single(config, "structure") === "structure-root" ? "middleware.ts" : "src/middleware.ts",
        betterAuthMiddleware(),
      );
      emit(`${app}/accept-invitation/page.tsx`, acceptInvitationPage(config));
    }
  } else {
    emit("src/index.ts", basicIndex(projectName));
  }

  const assistants = assistantIds(config);
  const isCronusUi = usesCronusUi(config);
  const cronusUiMcp = isCronusUi && multi(config, "mcp").includes("mcp-cronus-ui");
  if (assistants.length > 0 || cronusUiMcp) {
    const { written } = writeAiKit({
      targetDir,
      name: projectName,
      assistants,
      preset: "standard",
      skills: kitSkillsFromConfig(config),
      includeCronusUi: isCronusUi,
      cronusUiMcp,
    });
    fileCount += written.length;
  } else if (isCronusUi) {
    const { written } = writeDesignDocuments(targetDir);
    fileCount += written.length;
  }

  return { fileCount, unsupported };
}

export function initGit(cwd: string): void {
  runCommand("git", ["init"], cwd);
}

export function runInstall(pm: PackageManager, cwd: string): void {
  runCommand(pm, ["install"], cwd);
}
