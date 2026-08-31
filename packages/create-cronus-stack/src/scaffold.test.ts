import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SKILLS } from "@cronus-ui/ai-kit";
import { catalog, defaultSelection, resolve } from "@cronus-ui/stack";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { scaffoldStack } from "./scaffold.js";
import { CREATE_STACK_VERSION } from "./version.js";

describe("scaffoldStack", () => {
  let root: string;
  let targetDir: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "create-cronus-stack-"));
    targetDir = join(root, "my-app");
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("creates a runnable Next + Cronus UI starter for the default stack", () => {
    const config = resolve(catalog, { ...defaultSelection(catalog), install: false }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(result.fileCount).toBeGreaterThan(8);
    expect(existsSync(join(targetDir, "src", "app", "page.tsx"))).toBe(true);
    expect(existsSync(join(targetDir, "KICKOFF.md"))).toBe(true);
    expect(existsSync(join(targetDir, "stack.json"))).toBe(true);
    expect(existsSync(join(targetDir, "drizzle.config.ts"))).toBe(true);
    expect(readFileSync(join(targetDir, "drizzle.config.ts"), "utf8")).toContain("mkdirSync");
    expect(existsSync(join(targetDir, "src", "db", "schema.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "lib", "auth.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "middleware.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "app", "api", "auth", "[...all]", "route.ts"))).toBe(
      true,
    );

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    expect(pkg.dependencies["@cronus-ui/ui"]).toBe(`^${CREATE_STACK_VERSION}`);
    expect(pkg.dependencies["@cronus-ui/tokens"]).toBe(`^${CREATE_STACK_VERSION}`);
    expect(pkg.dependencies["@cronus-ui/theme"]).toBe(`^${CREATE_STACK_VERSION}`);
    expect(pkg.dependencies["drizzle-orm"]).toBe("^0.45.2");
    expect(pkg.dependencies["better-sqlite3"]).toBe("^13.0.3");
    expect(pkg.dependencies["better-auth"]).toBe("^1.7.2");
    expect(pkg.scripts.dev).toBe("next dev");
    expect(pkg.scripts["db:push"]).toBe("drizzle-kit push");

    const nextConfig = readFileSync(join(targetDir, "next.config.mjs"), "utf8");
    expect(nextConfig).toContain("better-sqlite3");

    const page = readFileSync(join(targetDir, "src", "app", "page.tsx"), "utf8");
    expect(page).toContain("auth.api.getSession");
    expect(page).toContain('from "@/db"');
    expect(page).toContain("items");
    expect(page).toContain("workspaceId");
    expect(page).not.toContain('"use client"');

    const schema = readFileSync(join(targetDir, "src", "db", "schema.ts"), "utf8");
    expect(schema).toContain("export const organization");
    expect(schema).toContain("activeOrganizationId");
    expect(readFileSync(join(targetDir, "src", "lib", "auth.ts"), "utf8")).toContain(
      "sendInvitationEmail",
    );
    expect(readFileSync(join(targetDir, "src", "lib", "auth-client.ts"), "utf8")).toContain(
      "organizationClient",
    );

    const auth = readFileSync(join(targetDir, "src", "lib", "auth.ts"), "utf8");
    expect(auth).toContain("nextCookies");
    expect(auth).toContain("sendResetPassword");
    expect(auth).toContain("console.info");

    const middleware = readFileSync(join(targetDir, "src", "middleware.ts"), "utf8");
    expect(middleware).toContain('from "better-auth/cookies"');
    expect(middleware).toContain("getSessionCookie");
    expect(middleware).toContain("/accept-invitation");
    expect(middleware).not.toContain('from "@/db"');
    expect(middleware).not.toContain('from "@/lib/auth"');
    expect(existsSync(join(targetDir, "src", "app", "accept-invitation", "page.tsx"))).toBe(true);
    expect(readFileSync(join(targetDir, "src", "lib", "auth.ts"), "utf8")).toContain(
      "/accept-invitation?id=",
    );

    expect(result.unsupported.join("\n")).not.toContain("Wire the selected database");
    expect(result.unsupported.join("\n")).not.toContain("Implement the selected auth");

    const cronusUi = JSON.parse(readFileSync(join(targetDir, "cronus-ui.json"), "utf8")) as {
      paths: Record<"ui" | "lib" | "blocks", string>;
      registry: string;
    };
    expect(cronusUi.paths).toEqual({
      ui: "src/components/ui",
      lib: "src/lib",
      blocks: "src/components/blocks",
    });
    expect(cronusUi.registry).toBe(
      `https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v${CREATE_STACK_VERSION}/registry`,
    );

    const stack = JSON.parse(readFileSync(join(targetDir, "stack.json"), "utf8")) as {
      name: string;
      stack: Record<string, unknown>;
    };
    expect(stack.name).toBe("my-app");
    expect(stack.stack.web).toBe("web-next");
    expect(stack.stack.database).toBe("db-sqlite");
    expect(stack.stack.orm).toBe("orm-drizzle");
    expect(stack.stack.auth).toBe("auth-better-auth");

    for (const skill of SKILLS) {
      expect(existsSync(join(targetDir, `.claude/skills/${skill}/SKILL.md`))).toBe(true);
    }
  });

  it("writes root app files when structure-root is selected", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      structure: "structure-root",
      install: false,
    }).selection;
    scaffoldStack({ targetDir, projectName: "my-app", config, catalog });
    expect(existsSync(join(targetDir, "app", "page.tsx"))).toBe(true);
    expect(existsSync(join(targetDir, "middleware.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "middleware.ts"))).toBe(false);
    expect(existsSync(join(targetDir, "db", "schema.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "db", "schema.ts"))).toBe(false);
    const tsconfig = readFileSync(join(targetDir, "tsconfig.json"), "utf8");
    expect(tsconfig).toContain('"@/*"');
    expect(tsconfig).toContain('"./*"');
    const cronusUi = JSON.parse(readFileSync(join(targetDir, "cronus-ui.json"), "utf8")) as {
      paths: Record<"ui" | "lib" | "blocks", string>;
    };
    expect(cronusUi.paths).toEqual({
      ui: "components/ui",
      lib: "lib",
      blocks: "components/blocks",
    });
  });

  it("creates a neutral Next starter for non-Cronus UI selections", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      ui: "ui-shadcn",
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(result.unsupported).toContain(
      "The selected UI library is captured in KICKOFF.md; this generator writes a neutral Next.js starter unless Cronus UI is selected, so install and wire the chosen UI library manually.",
    );
    expect(existsSync(join(targetDir, "src", "app", "page.tsx"))).toBe(true);
    expect(existsSync(join(targetDir, "cronus-ui.json"))).toBe(false);
    expect(existsSync(join(targetDir, "postcss.config.mjs"))).toBe(false);

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    expect(pkg.dependencies["@cronus-ui/ui"]).toBeUndefined();
    expect(pkg.dependencies["@cronus-ui/tokens"]).toBeUndefined();
    expect(pkg.dependencies["@cronus-ui/theme"]).toBeUndefined();
    expect(pkg.devDependencies.tailwindcss).toBeUndefined();
    expect(pkg.scripts.dev).toBe("next dev");

    const layout = readFileSync(join(targetDir, "src", "app", "layout.tsx"), "utf8");
    const page = readFileSync(join(targetDir, "src", "app", "page.tsx"), "utf8");
    const globals = readFileSync(join(targetDir, "src", "app", "globals.css"), "utf8");
    expect(layout).not.toContain("@cronus-ui");
    expect(page).not.toContain("@cronus-ui");
    expect(globals).not.toContain("@cronus-ui");
    expect(existsSync(join(targetDir, ".mcp.json"))).toBe(false);
    expect(existsSync(join(targetDir, ".cursor/rules/10-cronus-ui.mdc"))).toBe(false);
    expect(existsSync(join(targetDir, ".claude/skills/ui-add/SKILL.md"))).toBe(false);
    expect(existsSync(join(targetDir, ".claude/skills/theme/SKILL.md"))).toBe(false);
    expect(existsSync(join(targetDir, ".claude/skills/code-review/SKILL.md"))).toBe(true);
  });

  it("does not tell ui-none projects to install a selected UI library", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      ui: "ui-none",
      install: false,
    }).selection;
    scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    const page = readFileSync(join(targetDir, "src", "app", "page.tsx"), "utf8");
    expect(page).toContain("No UI library was selected");
    expect(page).not.toContain("Install and configure the selected UI library");
  });

  it("emits cronus-ui MCP config when selected without Claude", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      assistants: ["ai-cursor"],
      mcp: ["mcp-cronus-ui"],
      install: false,
    }).selection;
    scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(existsSync(join(targetDir, ".mcp.json"))).toBe(true);
    expect(existsSync(join(targetDir, ".cursor/rules/10-cronus-ui.mdc"))).toBe(true);
    expect(existsSync(join(targetDir, ".claude/settings.json"))).toBe(false);

    const kickoff = readFileSync(join(targetDir, "KICKOFF.md"), "utf8");
    expect(kickoff).toContain(
      "Use it only after your assistant has loaded the generated `.mcp.json`",
    );
  });

  it("does not generate cronus-ui MCP for non-Cronus UI stacks", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      ui: "ui-none",
      mcp: ["mcp-cronus-ui"],
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(result.unsupported).toContain(
      "The cronus-ui MCP server is not generated for stacks that do not use Cronus UI.",
    );
    expect(existsSync(join(targetDir, ".mcp.json"))).toBe(false);
  });

  it("writes only the selected AI Kit skills and does not record them as unsupported", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      skills: ["skill-ui-add", "skill-code-review"],
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(existsSync(join(targetDir, ".claude/skills/ui-add/SKILL.md"))).toBe(true);
    expect(existsSync(join(targetDir, ".claude/skills/code-review/SKILL.md"))).toBe(true);
    expect(existsSync(join(targetDir, ".claude/skills/theme/SKILL.md"))).toBe(false);
    expect(existsSync(join(targetDir, ".claude/skills/compose/SKILL.md"))).toBe(false);
    expect(existsSync(join(targetDir, ".claude/skills/upgrade/SKILL.md"))).toBe(false);
    expect(result.unsupported.join("\n")).not.toMatch(/skill/i);
  });

  it("still notes Cline as unsupported", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      assistants: ["ai-cline"],
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(result.unsupported).toContain(
      "Add Cline workspace configuration manually; AI Kit does not emit Cline files yet.",
    );
    expect(existsSync(join(targetDir, ".claude/settings.json"))).toBe(false);
  });

  it("emits a runnable Drizzle + SQLite schema for Next", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      database: "db-sqlite",
      orm: "orm-drizzle",
      auth: "auth-none",
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(existsSync(join(targetDir, "src", "db", "schema.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "db", "index.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "drizzle.config.ts"))).toBe(true);
    expect(readFileSync(join(targetDir, "drizzle.config.ts"), "utf8")).toContain("mkdirSync");

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    expect(pkg.dependencies["drizzle-orm"]).toBe("^0.45.2");
    expect(pkg.dependencies["better-sqlite3"]).toBe("^13.0.3");
    expect(pkg.devDependencies["drizzle-kit"]).toBe("^0.31.10");
    expect(pkg.scripts["db:push"]).toBe("drizzle-kit push");
    expect(pkg.scripts["db:generate"]).toBe("drizzle-kit generate");
    expect(pkg.scripts["db:studio"]).toBe("drizzle-kit studio");

    const env = readFileSync(join(targetDir, ".env.example"), "utf8");
    expect(env).toContain("file:./data/app.db");

    const nextConfig = readFileSync(join(targetDir, "next.config.mjs"), "utf8");
    expect(nextConfig).toContain("better-sqlite3");

    const gitignore = readFileSync(join(targetDir, ".gitignore"), "utf8");
    expect(gitignore).toContain("*.db");
    expect(gitignore).toContain("data/");
    expect(gitignore).toContain("drizzle/");

    const readme = readFileSync(join(targetDir, "README.md"), "utf8");
    expect(readme).toContain("db:push");

    expect(result.unsupported.join("\n")).not.toContain(
      "Wire the selected database/ORM/provider before running db:push.",
    );
    expect(existsSync(join(targetDir, "src", "lib", "auth.ts"))).toBe(false);
    expect(existsSync(join(targetDir, "src", "middleware.ts"))).toBe(false);
  });

  it("emits Drizzle files at the repo root when structure-root is selected", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      database: "db-sqlite",
      orm: "orm-drizzle",
      auth: "auth-none",
      structure: "structure-root",
      install: false,
    }).selection;
    scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(existsSync(join(targetDir, "db", "schema.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "db", "index.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "db", "schema.ts"))).toBe(false);

    const drizzleConfig = readFileSync(join(targetDir, "drizzle.config.ts"), "utf8");
    expect(drizzleConfig).toContain("./db/schema.ts");
    expect(drizzleConfig).not.toContain("./src/db/schema.ts");
    expect(drizzleConfig).toContain("mkdirSync");
  });

  it("emits Better-Auth on the Next + Drizzle + SQLite path", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      database: "db-sqlite",
      orm: "orm-drizzle",
      auth: "auth-better-auth",
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(existsSync(join(targetDir, "src", "lib", "auth.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "lib", "auth-client.ts"))).toBe(true);
    expect(existsSync(join(targetDir, "src", "app", "api", "auth", "[...all]", "route.ts"))).toBe(
      true,
    );

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
    };
    expect(pkg.dependencies["better-auth"]).toBe("^1.7.2");

    const schema = readFileSync(join(targetDir, "src", "db", "schema.ts"), "utf8");
    expect(schema).toContain("export const user");
    expect(schema).toContain("export const items");

    const auth = readFileSync(join(targetDir, "src", "lib", "auth.ts"), "utf8");
    expect(auth).toContain("better-auth/adapters/drizzle");
    expect(auth).toContain("nextCookies");
    expect(auth).toContain("better-auth/next-js");
    expect(auth).toContain("sendResetPassword");
    expect(auth).toContain("console.info");
    expect(auth).toContain('from "@/db"');
    expect(auth).toContain('provider: "sqlite"');

    const middleware = readFileSync(join(targetDir, "src", "middleware.ts"), "utf8");
    expect(middleware).toContain("getSessionCookie");
    expect(middleware).toContain('from "better-auth/cookies"');
    expect(middleware).not.toContain("better-sqlite3");
    expect(middleware).not.toContain('from "@/db"');
    expect(middleware).not.toContain('from "@/lib/auth"');

    const env = readFileSync(join(targetDir, ".env.example"), "utf8");
    expect(env).toContain("BETTER_AUTH_SECRET");
    expect(env.split("\n")).not.toContain("AUTH_SECRET=");

    expect(result.unsupported.join("\n")).not.toContain(
      "Implement the selected auth provider and protect mutating routes.",
    );
  });

  it("uses relative auth/db imports when import-relative is selected", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      database: "db-sqlite",
      orm: "orm-drizzle",
      auth: "auth-better-auth",
      importAlias: "import-relative",
      install: false,
    }).selection;
    scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    const auth = readFileSync(join(targetDir, "src", "lib", "auth.ts"), "utf8");
    expect(auth).toContain('from "../db"');
    expect(auth).toContain('from "../db/schema"');
    expect(auth).not.toContain('from "@/db"');

    const page = readFileSync(join(targetDir, "src", "app", "page.tsx"), "utf8");
    expect(page).toContain('from "../lib/auth"');
    expect(page).toContain('from "../db"');
    expect(page).not.toContain('from "@/lib/auth"');

    const route = readFileSync(
      join(targetDir, "src", "app", "api", "auth", "[...all]", "route.ts"),
      "utf8",
    );
    expect(route).toContain('from "../../../../lib/auth"');
    expect(route).not.toContain('from "@/lib/auth"');
  });

  it("emits Postgres Drizzle drivers without SQLite", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      database: "db-postgres",
      orm: "orm-drizzle",
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
    };
    expect(pkg.dependencies.postgres).toBe("^3.4.9");
    expect(pkg.dependencies["better-sqlite3"]).toBeUndefined();
    expect(pkg.dependencies["drizzle-orm"]).toBe("^0.45.2");

    const client = readFileSync(join(targetDir, "src", "db", "index.ts"), "utf8");
    expect(client).toContain("drizzle-orm/postgres-js");
    expect(client).not.toContain("better-sqlite3");

    const schema = readFileSync(join(targetDir, "src", "db", "schema.ts"), "utf8");
    expect(schema).toContain("drizzle-orm/pg-core");

    const drizzleConfig = readFileSync(join(targetDir, "drizzle.config.ts"), "utf8");
    expect(drizzleConfig).toContain('dialect: "postgresql"');

    const nextConfig = readFileSync(join(targetDir, "next.config.mjs"), "utf8");
    expect(nextConfig).not.toContain("better-sqlite3");

    expect(result.unsupported.join("\n")).not.toContain(
      "Wire the selected database/ORM/provider before running db:push.",
    );
  });

  it("keeps Better-Auth as kickoff-only without Drizzle", () => {
    const config = resolve(catalog, {
      ...defaultSelection(catalog),
      database: "db-none",
      orm: "orm-none",
      auth: "auth-better-auth",
      install: false,
    }).selection;
    const result = scaffoldStack({ targetDir, projectName: "my-app", config, catalog });

    expect(existsSync(join(targetDir, "src", "lib", "auth.ts"))).toBe(false);
    expect(result.unsupported).toContain(
      "Implement the selected auth provider and protect mutating routes.",
    );

    const env = readFileSync(join(targetDir, ".env.example"), "utf8");
    expect(env).toContain("AUTH_SECRET=");
    expect(env).not.toContain("BETTER_AUTH_SECRET");
  });
});
