/**
 * The Kronus Stack Builder taxonomy.
 *
 * Coherent, robust, and CORRECT — every cross-category rule below is encoded on
 * the options themselves (`requires` / `conflicts` / `implies` / `recommends`)
 * so the pure resolver in `engine.ts` can enforce them deterministically.
 *
 * Conventions:
 *  - Option ids are GLOBALLY UNIQUE and prefixed by category, e.g. "orm-drizzle".
 *  - The FIRST option in each "single" category is its default (and is always a
 *    safe, dependency-free choice so cascades can always fall back to it).
 *  - Icons are lucide-react names.
 */

import type { Catalog } from "./types.js";

// --- React-capable web frontends (used by UI-library `requires`). ----------
const REACT_WEB = ["web-next", "web-tanstack-start", "web-tanstack-router", "web-react-router"];

// --- SQL databases (used by ORM / DB-setup constraints). -------------------
const SQL_DBS = ["db-sqlite", "db-postgres", "db-mysql"];

// --- Dedicated backend servers (conflict with fullstack meta-frameworks). --
const DEDICATED_BACKENDS = ["backend-hono", "backend-elysia", "backend-express", "backend-fastify"];

export const catalog: Catalog = [
  // ------------------------------------------------------------------ WEB ---
  {
    id: "web",
    title: "Web Frontend",
    description: "The web client framework.",
    kind: "single",
    options: [
      { id: "web-none", name: "None", description: "No web frontend.", icon: "circle-slash" },
      {
        id: "web-next",
        name: "Next.js",
        description: "React App Router meta-framework.",
        icon: "triangle",
      },
      {
        id: "web-tanstack-start",
        name: "TanStack Start",
        description: "Full-stack React framework on TanStack Router.",
        icon: "layers",
      },
      {
        id: "web-tanstack-router",
        name: "TanStack Router",
        description: "Type-safe SPA router.",
        icon: "route",
      },
      {
        id: "web-react-router",
        name: "React Router",
        description: "React Router framework mode.",
        icon: "git-fork",
      },
      { id: "web-nuxt", name: "Nuxt", description: "Vue meta-framework.", icon: "mountain" },
      { id: "web-svelte", name: "Svelte", description: "SvelteKit app framework.", icon: "flame" },
      { id: "web-solid", name: "Solid", description: "SolidStart app framework.", icon: "atom" },
      {
        id: "web-astro",
        name: "Astro",
        description: "Content-first islands framework.",
        icon: "rocket",
      },
    ],
  },

  // -------------------------------------------------------------- BACKEND ---
  {
    id: "backend",
    title: "Backend",
    description: "The server framework that hosts your API.",
    kind: "single",
    options: [
      {
        id: "backend-none",
        name: "None",
        description: "No dedicated backend.",
        icon: "circle-slash",
      },
      {
        id: "backend-fullstack-next",
        name: "Fullstack Next",
        description: "Use Next.js server (route handlers) as the backend.",
        icon: "triangle",
        // Only meaningful with a Next web app, and replaces a separate backend/runtime.
        requires: ["web-next"],
        conflicts: [...DEDICATED_BACKENDS, "backend-convex"],
      },
      {
        id: "backend-fullstack-tanstack",
        name: "Fullstack TanStack Start",
        description: "Use TanStack Start server functions as the backend.",
        icon: "layers",
        requires: ["web-tanstack-start"],
        conflicts: [...DEDICATED_BACKENDS, "backend-convex"],
      },
      {
        id: "backend-hono",
        name: "Hono",
        description: "Ultrafast edge-ready web framework.",
        icon: "flame",
      },
      {
        id: "backend-elysia",
        name: "Elysia",
        description: "Bun-native, end-to-end typed framework.",
        icon: "feather",
        requires: ["runtime-bun"],
      },
      {
        id: "backend-express",
        name: "Express",
        description: "Classic Node.js web framework.",
        icon: "server",
        requires: ["runtime-node"],
        conflicts: ["runtime-cloudflare"],
      },
      {
        id: "backend-fastify",
        name: "Fastify",
        description: "Fast, low-overhead Node framework.",
        icon: "zap",
      },
      {
        id: "backend-convex",
        name: "Convex",
        description: "All-in-one reactive backend (DB + functions).",
        icon: "box",
        badge: "beta",
        // BaaS owns its own data layer + runtime.
        conflicts: [
          "db-sqlite",
          "db-postgres",
          "db-mysql",
          "db-mongodb",
          "orm-drizzle",
          "orm-prisma",
          "orm-mongoose",
        ],
      },
    ],
  },

  // -------------------------------------------------------------- RUNTIME ---
  {
    id: "runtime",
    title: "Runtime",
    description: "Where the server code executes.",
    kind: "single",
    options: [
      {
        id: "runtime-bun",
        name: "Bun",
        description: "All-in-one JS runtime & toolkit.",
        icon: "rabbit",
      },
      {
        id: "runtime-node",
        name: "Node.js",
        description: "The standard JS runtime.",
        icon: "hexagon",
      },
      {
        id: "runtime-cloudflare",
        name: "Cloudflare Workers",
        description: "Edge runtime on the Cloudflare network.",
        icon: "cloud",
      },
      {
        id: "runtime-none",
        name: "None",
        description: "No standalone runtime.",
        icon: "circle-slash",
      },
    ],
  },

  // ------------------------------------------------------------------ API ---
  {
    id: "api",
    title: "API",
    description: "Type-safe client/server contract.",
    kind: "single",
    options: [
      { id: "api-none", name: "None", description: "No typed API layer.", icon: "circle-slash" },
      { id: "api-trpc", name: "tRPC", description: "End-to-end typesafe RPC.", icon: "plug" },
      {
        id: "api-orpc",
        name: "oRPC",
        description: "OpenAPI-compatible typesafe RPC.",
        icon: "plug-zap",
        badge: "new",
      },
    ],
  },

  // ------------------------------------------------------------- DATABASE ---
  {
    id: "database",
    title: "Database",
    description: "Your primary data store.",
    kind: "single",
    options: [
      { id: "db-none", name: "None", description: "No database.", icon: "circle-slash" },
      { id: "db-sqlite", name: "SQLite", description: "Embedded SQL database.", icon: "database" },
      {
        id: "db-postgres",
        name: "PostgreSQL",
        description: "Advanced open-source SQL.",
        icon: "database",
      },
      { id: "db-mysql", name: "MySQL", description: "Popular open-source SQL.", icon: "database" },
      { id: "db-mongodb", name: "MongoDB", description: "Document-oriented NoSQL.", icon: "leaf" },
    ],
  },

  // ------------------------------------------------------------------ ORM ---
  {
    id: "orm",
    title: "ORM",
    description: "How you talk to the database.",
    kind: "single",
    options: [
      {
        id: "orm-none",
        name: "None",
        description: "No ORM / query builder.",
        icon: "circle-slash",
      },
      {
        id: "orm-drizzle",
        name: "Drizzle",
        description: "Type-safe SQL query builder & ORM.",
        icon: "droplets",
        // SQL-only in this catalog: needs a SQL db, never Mongo.
        requires: ["db-sql"],
        conflicts: ["db-mongodb"],
      },
      {
        id: "orm-prisma",
        name: "Prisma",
        description: "Schema-first ORM with migrations.",
        icon: "triangle",
        requires: ["db-sql"],
        conflicts: ["db-mongodb"],
      },
      {
        id: "orm-mongoose",
        name: "Mongoose",
        description: "MongoDB object modeling.",
        icon: "leaf",
        requires: ["db-mongodb"],
        conflicts: ["db-sqlite", "db-postgres", "db-mysql"],
      },
    ],
  },

  // ------------------------------------------------------------- DB SETUP ---
  {
    id: "dbSetup",
    title: "DB Setup",
    description: "Hosted provider / local setup for the database.",
    kind: "single",
    options: [
      {
        id: "dbsetup-basic",
        name: "Basic",
        description: "Plain local setup, no provider.",
        icon: "settings",
      },
      {
        id: "dbsetup-turso",
        name: "Turso",
        description: "Hosted libSQL (SQLite) edge DB.",
        icon: "globe",
        requires: ["db-sqlite"],
      },
      {
        id: "dbsetup-neon",
        name: "Neon",
        description: "Serverless PostgreSQL.",
        icon: "globe",
        requires: ["db-postgres"],
      },
      {
        id: "dbsetup-supabase",
        name: "Supabase",
        description: "Postgres platform with auth/storage.",
        icon: "globe",
        requires: ["db-postgres"],
      },
      {
        id: "dbsetup-planetscale",
        name: "PlanetScale",
        description: "Serverless MySQL / Postgres.",
        icon: "globe",
        // Available for either Postgres OR MySQL.
        requires: ["db-sql-server"],
        conflicts: ["db-sqlite", "db-mongodb"],
      },
      {
        id: "dbsetup-d1",
        name: "Cloudflare D1",
        description: "Cloudflare's serverless SQLite.",
        icon: "cloud",
        requires: ["db-sqlite"],
      },
      {
        id: "dbsetup-atlas",
        name: "MongoDB Atlas",
        description: "Hosted MongoDB cluster.",
        icon: "leaf",
        requires: ["db-mongodb"],
      },
    ],
  },

  // ----------------------------------------------------------------- AUTH ---
  {
    id: "auth",
    title: "Auth",
    description: "Authentication strategy.",
    kind: "single",
    options: [
      { id: "auth-none", name: "None", description: "No auth.", icon: "circle-slash" },
      {
        id: "auth-better-auth",
        name: "Better-Auth",
        description: "Framework-agnostic, ownable auth.",
        icon: "shield-check",
      },
      {
        id: "auth-clerk",
        name: "Clerk",
        description: "Hosted auth & user management.",
        icon: "shield",
        badge: "gated",
      },
    ],
  },

  // ------------------------------------------------------------- PAYMENTS ---
  {
    id: "payments",
    title: "Payments",
    description: "Billing & monetization.",
    kind: "single",
    optional: true,
    options: [
      { id: "pay-none", name: "None", description: "No payments.", icon: "circle-slash" },
      {
        id: "pay-polar",
        name: "Polar",
        description: "Merchant of record for devs.",
        icon: "circle-dollar-sign",
        badge: "new",
      },
      {
        id: "pay-stripe",
        name: "Stripe",
        description: "The standard payments platform.",
        icon: "credit-card",
      },
    ],
  },

  // ------------------------------------------------------------- UI LIBRARY -
  {
    id: "ui",
    title: "UI Library",
    description: "Component system for the frontend.",
    kind: "single",
    options: [
      {
        id: "ui-kronus",
        name: "Kronus UI",
        description: "Product UI system: compose + live theme + copy-in you can upgrade.",
        icon: "sparkles",
        requires: ["web-react"],
        recommends: ["mcp-kronus-ui"],
      },
      {
        id: "ui-shadcn",
        name: "shadcn/ui",
        description: "Copy-in Radix + Tailwind components.",
        icon: "component",
        requires: ["web-react"],
      },
      {
        id: "ui-heroui",
        name: "HeroUI",
        description: "Beautiful React component library.",
        icon: "component",
        requires: ["web-react"],
      },
      {
        id: "ui-aceternity",
        name: "Aceternity",
        description: "Animated React UI components.",
        icon: "wand-sparkles",
        requires: ["web-react"],
        badge: "experimental",
      },
      {
        id: "ui-tailwind",
        name: "Tailwind-only",
        description: "Utility CSS, bring your own components.",
        icon: "paintbrush",
      },
      { id: "ui-none", name: "None", description: "No UI library.", icon: "circle-slash" },
    ],
  },

  // ------------------------------------------------------- AI ASSISTANTS ----
  {
    id: "assistants",
    title: "AI Assistant",
    description: "Coding agents wired into the repo.",
    kind: "multi",
    options: [
      {
        id: "ai-claude-code",
        name: "Claude Code",
        description: "Anthropic's official coding agent.",
        icon: "bot",
      },
      {
        id: "ai-cursor",
        name: "Cursor",
        description: "AI-first code editor.",
        icon: "mouse-pointer-2",
      },
      { id: "ai-windsurf", name: "Windsurf", description: "Agentic IDE by Codeium.", icon: "wind" },
      { id: "ai-copilot", name: "Copilot", description: "GitHub Copilot.", icon: "github" },
      {
        id: "ai-cline",
        name: "Cline",
        description: "Autonomous coding agent for VS Code.",
        icon: "terminal",
      },
    ],
  },

  // ---------------------------------------------------------- MCP SERVERS ----
  {
    id: "mcp",
    title: "MCP Servers",
    description: "Model Context Protocol servers available to agents.",
    kind: "multi",
    options: [
      {
        id: "mcp-kronus-ui",
        name: "kronus-ui",
        description: "Kronus UI component & token context.",
        icon: "sparkles",
        recommends: ["ui-kronus"],
      },
      {
        id: "mcp-postgres",
        name: "postgres",
        description: "Query & inspect your database.",
        icon: "database",
      },
      {
        id: "mcp-playwright",
        name: "playwright",
        description: "Drive a real browser for testing.",
        icon: "globe",
      },
      {
        id: "mcp-github",
        name: "github",
        description: "Issues, PRs, and repo context.",
        icon: "github",
      },
      {
        id: "mcp-sentry",
        name: "sentry",
        description: "Error & performance telemetry.",
        icon: "siren",
      },
    ],
  },

  // --------------------------------------------------------------- SKILLS ----
  {
    id: "skills",
    title: "Skills",
    description: "Reusable agent skill packs to install.",
    kind: "multi",
    options: [
      {
        id: "skill-frontend",
        name: "frontend",
        description: "Frontend & component patterns.",
        icon: "layout",
      },
      {
        id: "skill-db",
        name: "db",
        description: "Schema, migrations, and queries.",
        icon: "database",
      },
      {
        id: "skill-security-review",
        name: "security-review",
        description: "Adversarial security review.",
        icon: "shield-alert",
      },
      {
        id: "skill-a11y",
        name: "a11y",
        description: "Accessibility auditing & fixes.",
        icon: "accessibility",
      },
      {
        id: "skill-testing",
        name: "testing",
        description: "Unit, integration & e2e testing.",
        icon: "flask-conical",
      },
    ],
  },

  // ------------------------------------------------------------ VIBE MODE ----
  {
    id: "vibe",
    title: "Vibe Mode",
    description: "Looser guardrails, faster iteration for prototyping.",
    kind: "toggle",
    options: [],
  },

  // --------------------------------------------------------------- DEPLOY ----
  {
    id: "deploy",
    title: "Deploy",
    description: "Where the app ships.",
    kind: "single",
    optional: true,
    options: [
      {
        id: "deploy-none",
        name: "None",
        description: "No deploy target configured.",
        icon: "circle-slash",
      },
      {
        id: "deploy-vercel",
        name: "Vercel",
        description: "Zero-config frontend cloud.",
        icon: "triangle",
      },
      {
        id: "deploy-cloudflare",
        name: "Cloudflare",
        description: "Deploy to the Cloudflare edge.",
        icon: "cloud",
        requires: ["runtime-cloudflare"],
      },
      {
        id: "deploy-docker",
        name: "Docker",
        description: "Containerized deploy anywhere.",
        icon: "container",
      },
      {
        id: "deploy-fly",
        name: "Fly.io",
        description: "Run app servers near users.",
        icon: "plane",
      },
    ],
  },

  // ------------------------------------------------------- PACKAGE MANAGER ---
  {
    id: "packageManager",
    title: "Package Manager",
    description: "Dependency & workspace tool.",
    kind: "single",
    options: [
      { id: "pm-bun", name: "bun", description: "Fast all-in-one toolkit.", icon: "rabbit" },
      {
        id: "pm-pnpm",
        name: "pnpm",
        description: "Efficient, strict node_modules.",
        icon: "package",
      },
      {
        id: "pm-npm",
        name: "npm",
        description: "The default Node package manager.",
        icon: "package",
      },
    ],
  },

  // --------------------------------------------------------------- ADDONS ---
  {
    id: "addons",
    title: "Addons",
    description: "Optional tooling & capabilities.",
    kind: "multi",
    options: [
      {
        id: "addon-pwa",
        name: "PWA",
        description: "Installable, offline-capable app.",
        icon: "smartphone",
      },
      {
        id: "addon-tauri",
        name: "Tauri",
        description: "Native desktop app shell.",
        icon: "app-window",
        badge: "experimental",
      },
      { id: "addon-biome", name: "Biome", description: "Fast formatter & linter.", icon: "wand" },
      {
        id: "addon-turborepo",
        name: "Turborepo",
        description: "Monorepo task runner & cache.",
        icon: "git-merge",
      },
      {
        id: "addon-husky",
        name: "Husky/Lefthook",
        description: "Git hooks for quality gates.",
        icon: "dog",
      },
      {
        id: "addon-starlight",
        name: "Starlight",
        description: "Docs site (Astro Starlight).",
        icon: "book-open",
      },
    ],
  },

  // ------------------------------------------------------------------ GIT ---
  {
    id: "git",
    title: "Git",
    description: "Initialize a git repository.",
    kind: "toggle",
    options: [],
  },

  // --------------------------------------------------------- INSTALL DEPS ---
  {
    id: "install",
    title: "Install deps",
    description: "Run the package manager install after scaffolding.",
    kind: "toggle",
    options: [],
  },

  // ---------------------------------------------------------- CONVENTIONS ---
  // Project standards baked into the KICKOFF brief so generated code stays
  // consistent from the first commit. These are simple, self-evident choices, so
  // they render as compact segmented pickers (layout: "segmented") rather than
  // icon cards. The first option in each is the recommended best-practice default.
  {
    id: "naming",
    title: "File naming",
    description: "How files and folders are cased.",
    kind: "single",
    layout: "segmented",
    options: [
      {
        id: "naming-kebab",
        name: "kebab-case",
        description: "user-profile.tsx",
        icon: "case-sensitive",
      },
      {
        id: "naming-camel",
        name: "camelCase",
        description: "userProfile.tsx",
        icon: "case-sensitive",
      },
      {
        id: "naming-pascal",
        name: "PascalCase",
        description: "UserProfile.tsx",
        icon: "case-sensitive",
      },
      {
        id: "naming-snake",
        name: "snake_case",
        description: "user_profile.tsx",
        icon: "case-sensitive",
      },
    ],
  },
  {
    id: "structure",
    title: "Directory structure",
    description: "Where application code lives.",
    kind: "single",
    layout: "segmented",
    options: [
      {
        id: "structure-src",
        name: "src/ directory",
        description: "All app code under src/.",
        icon: "folder-tree",
      },
      {
        id: "structure-root",
        name: "Root-level",
        description: "app/ and code at the repo root.",
        icon: "folder",
      },
    ],
  },
  {
    id: "importAlias",
    title: "Import paths",
    description: "How modules reference each other.",
    kind: "single",
    layout: "segmented",
    options: [
      {
        id: "import-alias",
        name: "@/ alias",
        description: "Absolute imports from the app root.",
        icon: "at-sign",
      },
      {
        id: "import-relative",
        name: "Relative",
        description: "Relative ./ and ../ paths.",
        icon: "route",
      },
    ],
  },
  {
    id: "commitStyle",
    title: "Commits",
    description: "Commit message convention.",
    kind: "single",
    layout: "segmented",
    options: [
      {
        id: "commit-conventional",
        name: "Conventional",
        description: "type(scope): subject",
        icon: "git-commit",
      },
      {
        id: "commit-plain",
        name: "Plain",
        description: "Freeform commit messages.",
        icon: "git-commit",
      },
    ],
  },
  {
    id: "tsStrict",
    title: "TypeScript",
    description: "Type-checking strictness.",
    kind: "single",
    layout: "segmented",
    options: [
      {
        id: "ts-strict",
        name: "Strict",
        description: "strict + no implicit any.",
        icon: "shield-check",
      },
      {
        id: "ts-standard",
        name: "Standard",
        description: "Default tsconfig strictness.",
        icon: "shield",
      },
    ],
  },
];

/**
 * Virtual / synthetic option ids used only inside `requires`/`conflicts` to
 * express GROUP constraints the resolver expands against the real selection:
 *  - "web-react"      → any of the React-capable web frontends is selected.
 *  - "db-sql"         → any SQL database is selected.
 *  - "db-sql-server"  → Postgres or MySQL is selected (PlanetScale).
 *
 * Keeping these out of the catalog options keeps the UI clean while still
 * letting constraints reference logical groups.
 */
export const SYNTHETIC_REQUIREMENTS: Record<string, string[]> = {
  "web-react": REACT_WEB,
  "db-sql": SQL_DBS,
  "db-sql-server": ["db-postgres", "db-mysql"],
};

/** Toggle categories that default to ON. */
export const TOGGLE_DEFAULTS_ON = new Set(["git", "install"]);

/** Multi categories that default to a preselected set. */
export const MULTI_DEFAULTS: Record<string, string[]> = {
  assistants: ["ai-claude-code"],
};

/** Re-exported convenience groups (also consumed by tests). */
export const GROUPS = { REACT_WEB, SQL_DBS, DEDICATED_BACKENDS } as const;

/**
 * The builder section each category renders under. Assigned to `category.group`
 * at module load so the catalog stays the single source of truth; the builder
 * reads `group` + {@link GROUP_ORDER} to lay the page out in labeled sections.
 */
const CATEGORY_GROUP: Record<string, string> = {
  web: "Framework",
  backend: "Framework",
  runtime: "Framework",
  api: "Framework",
  database: "Data",
  orm: "Data",
  dbSetup: "Data",
  auth: "Product",
  payments: "Product",
  ui: "Product",
  assistants: "AI & agents",
  mcp: "AI & agents",
  skills: "AI & agents",
  vibe: "AI & agents",
  naming: "Conventions",
  structure: "Conventions",
  importAlias: "Conventions",
  commitStyle: "Conventions",
  tsStrict: "Conventions",
  deploy: "Tooling",
  packageManager: "Tooling",
  addons: "Tooling",
  git: "Tooling",
  install: "Tooling",
};

/** The fixed order builder sections render in (empty sections are skipped). */
export const GROUP_ORDER: readonly string[] = [
  "Framework",
  "Data",
  "Product",
  "AI & agents",
  "Conventions",
  "Tooling",
];

for (const cat of catalog) cat.group = CATEGORY_GROUP[cat.id];
