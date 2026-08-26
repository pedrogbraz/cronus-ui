/**
 * Kickoff artifacts for a resolved Cronus stack.
 *
 * Turns a {@link StackConfig} into the three things a user leaves the builder
 * with:
 *  - `generateCommand`   → the `bun create cronus-stack@latest …` shell command.
 *  - `generateKickoff`   → a KICKOFF.md briefing (the resolved stack is the
 *                          single source of truth) for the coding agent.
 *  - `generateStackJson` → a machine-readable snapshot of the stack.
 *
 * SECURITY: the project name is the only user-controlled free text that reaches
 * a shell command. {@link sanitizeProjectName} reduces it to a strict
 * `[a-z0-9-]` slug so it can never break out of the argument or inject flags.
 */

import { catalog as defaultCatalog, MULTI_DEFAULTS } from "./catalog.js";
import { STACK_BUILDER_GENERATOR, STACK_CREATE_COMMAND } from "./constants.js";
import type { Catalog, Category, Option, StackConfig } from "./types.js";

// --------------------------------------------------------------------------
// Project-name hardening
// --------------------------------------------------------------------------

/**
 * Reduce an arbitrary string to a safe project slug: lowercase, ASCII
 * `[a-z0-9-]` only, no leading/trailing/duplicate dashes, capped length. Any
 * shell metacharacters, spaces, quotes, slashes, `..`, or flags collapse away.
 * Falls back to "my-cronus-app" when nothing usable remains.
 */
export function sanitizeProjectName(raw: string): string {
  const slug = (raw ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // any non-alnum run -> single dash
    .replace(/^-+|-+$/g, "") // trim dashes
    .slice(0, 64)
    .replace(/-+$/g, ""); // re-trim after slice
  return slug.length > 0 ? slug : "my-cronus-app";
}

// --------------------------------------------------------------------------
// Catalog/selection lookup helpers
// --------------------------------------------------------------------------

function indexCatalog(catalog: Catalog) {
  const catById = new Map<string, Category>();
  const optById = new Map<string, Option>();
  for (const cat of catalog) {
    catById.set(cat.id, cat);
    for (const opt of cat.options) optById.set(opt.id, opt);
  }
  return { catById, optById };
}

function singleId(config: StackConfig, catId: string): string | undefined {
  const v = config[catId];
  return typeof v === "string" ? v : undefined;
}

function multiIds(config: StackConfig, catId: string): string[] {
  const v = config[catId];
  return Array.isArray(v) ? v : [];
}

function toggleOn(config: StackConfig, catId: string): boolean {
  return config[catId] === true;
}

/** Map an option id to the short CLI flag value (strips the category prefix). */
export function flagValue(optionId: string): string {
  const dash = optionId.indexOf("-");
  return dash === -1 ? optionId : optionId.slice(dash + 1);
}

function optName(optById: Map<string, Option>, id: string): string {
  return optById.get(id)?.name ?? id;
}

// --------------------------------------------------------------------------
// CLI command
// --------------------------------------------------------------------------

/**
 * The categories emitted as `--flag value` pairs, in stable order. Toggles map
 * to presence/absence flags; multis to comma-separated lists.
 */
export const CLI_FLAGS: { catId: string; flag: string; kind: "single" | "multi" }[] = [
  { catId: "web", flag: "web", kind: "single" },
  { catId: "backend", flag: "backend", kind: "single" },
  { catId: "runtime", flag: "runtime", kind: "single" },
  { catId: "api", flag: "api", kind: "single" },
  { catId: "database", flag: "database", kind: "single" },
  { catId: "orm", flag: "orm", kind: "single" },
  { catId: "dbSetup", flag: "db-setup", kind: "single" },
  { catId: "auth", flag: "auth", kind: "single" },
  { catId: "payments", flag: "payments", kind: "single" },
  { catId: "ui", flag: "ui", kind: "single" },
  { catId: "assistants", flag: "ai", kind: "multi" },
  { catId: "mcp", flag: "mcp", kind: "multi" },
  { catId: "skills", flag: "skills", kind: "multi" },
  { catId: "deploy", flag: "deploy", kind: "single" },
  { catId: "packageManager", flag: "package-manager", kind: "single" },
  { catId: "addons", flag: "addons", kind: "multi" },
  // Conventions — project standards baked into the scaffold.
  { catId: "naming", flag: "naming", kind: "single" },
  { catId: "structure", flag: "structure", kind: "single" },
  { catId: "importAlias", flag: "import-alias", kind: "single" },
  { catId: "commitStyle", flag: "commits", kind: "single" },
  { catId: "tsStrict", flag: "ts", kind: "single" },
];

/**
 * Build the scaffolding command. One flag per selected category (multi → CSV).
 * The project name is sanitized to a safe slug. Output is a single string with
 * line continuations for readability.
 */
export function generateCommand(config: StackConfig, projectName = "my-cronus-app"): string {
  const slug = sanitizeProjectName(projectName);
  const parts: string[] = [`${STACK_CREATE_COMMAND} ${slug} --yes`];

  for (const { catId, flag, kind } of CLI_FLAGS) {
    if (kind === "single") {
      const id = singleId(config, catId);
      if (id) parts.push(`--${flag} ${flagValue(id)}`);
    } else {
      const ids = multiIds(config, catId);
      if (ids.length > 0) parts.push(`--${flag} ${ids.map(flagValue).join(",")}`);
      else if ((MULTI_DEFAULTS[catId]?.length ?? 0) > 0) parts.push(`--${flag} none`);
    }
  }

  // Boolean toggles -> explicit on/off flags so the command is unambiguous.
  if (config.vibe === true) parts.push("--vibe");
  parts.push(toggleOn(config, "git") ? "--git" : "--no-git");
  parts.push(toggleOn(config, "install") ? "--install" : "--no-install");

  return parts.join(" \\\n  ");
}

// --------------------------------------------------------------------------
// stack.json
// --------------------------------------------------------------------------

/** A machine-readable snapshot of the resolved stack. */
export function generateStackJson(config: StackConfig, projectName = "my-cronus-app"): string {
  const snapshot = {
    $schema: "https://cronus.dev/schema/stack-1.json",
    version: 1,
    name: sanitizeProjectName(projectName),
    generator: STACK_BUILDER_GENERATOR,
    stack: config,
  };
  return JSON.stringify(snapshot, null, 2);
}

// --------------------------------------------------------------------------
// Conventions & standards
// --------------------------------------------------------------------------

/**
 * Turn the chosen convention options into concrete, imperative rules for the
 * KICKOFF brief. These are what make generated projects follow consistent best
 * practices — the resolver guarantees each convention category always has a
 * value (its default), so the list is never empty.
 */
function conventionRules(config: StackConfig): string[] {
  const rules: string[] = [];

  switch (singleId(config, "naming")) {
    case "naming-kebab":
      rules.push(
        "**Naming:** kebab-case for file and folder names (`user-profile.tsx`); keep React components PascalCase in code.",
      );
      break;
    case "naming-camel":
      rules.push("**Naming:** camelCase for file names and identifiers (`userProfile.tsx`).");
      break;
    case "naming-pascal":
      rules.push(
        "**Naming:** PascalCase for files and exported components/types (`UserProfile.tsx`).",
      );
      break;
    case "naming-snake":
      rules.push("**Naming:** snake_case for file and folder names (`user_profile.tsx`).");
      break;
  }

  switch (singleId(config, "structure")) {
    case "structure-src":
      rules.push(
        "**Structure:** all application code lives under `src/`; keep config at the root.",
      );
      break;
    case "structure-root":
      rules.push(
        "**Structure:** application code lives at the repo root (e.g. `app/`) — no `src/` directory.",
      );
      break;
  }

  switch (singleId(config, "importAlias")) {
    case "import-alias":
      rules.push(
        "**Imports:** use the `@/…` path alias for absolute imports; avoid deep relative paths (`../../../`).",
      );
      break;
    case "import-relative":
      rules.push("**Imports:** use relative import paths (`./`, `../`).");
      break;
  }

  switch (singleId(config, "commitStyle")) {
    case "commit-conventional":
      rules.push(
        "**Commits:** Conventional Commits — `type(scope): subject` (`feat`, `fix`, `chore`, …).",
      );
      break;
    case "commit-plain":
      rules.push("**Commits:** short, imperative commit subjects.");
      break;
  }

  switch (singleId(config, "tsStrict")) {
    case "ts-strict":
      rules.push(
        "**TypeScript:** strict mode — no implicit `any`, no `!` non-null assertions to silence the compiler.",
      );
      break;
    case "ts-standard":
      rules.push("**TypeScript:** the framework's default tsconfig strictness.");
      break;
  }

  return rules;
}

// --------------------------------------------------------------------------
// KICKOFF.md
// --------------------------------------------------------------------------

function selectedSingleName(
  config: StackConfig,
  optById: Map<string, Option>,
  catId: string,
): string | undefined {
  const id = singleId(config, catId);
  if (!id) return undefined;
  // Hide the empty "None" choices from the prose.
  if (id.endsWith("-none")) return undefined;
  return optName(optById, id);
}

function scriptCommand(pmBin: string, script: string): string {
  return pmBin === "npm" ? `npm run ${script}` : `${pmBin} ${script}`;
}

function kickoffAppDir(config: StackConfig): "app" | "src/app" | "src" {
  const web = singleId(config, "web");
  if (web !== "web-next") return "src";
  return singleId(config, "structure") === "structure-root" ? "app" : "src/app";
}

/**
 * Render the KICKOFF.md briefing. The resolved stack is the SINGLE SOURCE OF
 * TRUTH: mission, repo map, commands, configured AI capabilities, the Cronus UI
 * contract (only when UI = Cronus UI), guardrails, and a Definition of Done.
 */
export function generateKickoff(
  config: StackConfig,
  projectName = "my-cronus-app",
  catalog: Catalog = defaultCatalog,
): string {
  const { optById } = indexCatalog(catalog);
  const slug = sanitizeProjectName(projectName);

  const web = selectedSingleName(config, optById, "web");
  const backend = selectedSingleName(config, optById, "backend");
  const runtime = selectedSingleName(config, optById, "runtime");
  const api = selectedSingleName(config, optById, "api");
  const database = selectedSingleName(config, optById, "database");
  const orm = selectedSingleName(config, optById, "orm");
  const dbSetup = selectedSingleName(config, optById, "dbSetup");
  const auth = selectedSingleName(config, optById, "auth");
  const payments = selectedSingleName(config, optById, "payments");
  const ui = singleId(config, "ui");
  const uiName = ui ? optName(optById, ui) : undefined;
  const deploy = selectedSingleName(config, optById, "deploy");
  const pm = singleId(config, "packageManager");
  const pmName = pm ? optName(optById, pm) : "bun";
  const pmBin = pm ? flagValue(pm) : "bun";

  const assistants = multiIds(config, "assistants").map((id) => optName(optById, id));
  const mcp = multiIds(config, "mcp").map((id) => optName(optById, id));
  const skills = multiIds(config, "skills").map((id) => optName(optById, id));
  const addons = multiIds(config, "addons").map((id) => optName(optById, id));
  const vibe = config.vibe === true;
  const isCronusUi = ui === "ui-cronus";
  const appDir = kickoffAppDir(config);
  const webId = singleId(config, "web");
  const backendId = singleId(config, "backend");
  const apiId = singleId(config, "api");
  const databaseId = singleId(config, "database");
  const authId = singleId(config, "auth");
  const paymentsId = singleId(config, "payments");
  const isNext = webId === "web-next";
  const hasDatabase = databaseId !== undefined && databaseId !== "db-none";
  const hasApi = apiId !== undefined && apiId !== "api-none";
  const hasDedicatedBackend =
    backendId !== undefined &&
    backendId !== "backend-none" &&
    backendId !== "backend-fullstack-next" &&
    backendId !== "backend-fullstack-tanstack";
  const hasAuth = authId !== undefined && authId !== "auth-none";
  const hasPayments = paymentsId !== undefined && paymentsId !== "pay-none";
  const hasEnv = hasDatabase || hasAuth || hasPayments;
  const hasLint = multiIds(config, "addons").includes("addon-biome");

  const stackRows: [string, string | undefined][] = [
    ["Web", web],
    ["Backend", backend],
    ["Runtime", runtime],
    ["API", api],
    ["Database", database],
    ["ORM", orm],
    ["DB Setup", dbSetup],
    ["Auth", auth],
    ["Payments", payments],
    ["UI", uiName],
    ["Deploy", deploy],
    ["Package Manager", pmName],
  ];

  const lines: string[] = [];
  lines.push(`# KICKOFF — ${slug}`);
  lines.push("");
  lines.push(
    "> Generated by the Cronus Stack Builder. This file is the **single source of truth** for the project's stack, conventions, and mission. Read it fully before writing any code.",
  );
  lines.push("");

  // --- Mission ---
  lines.push("## Mission");
  lines.push("");
  lines.push(
    `Build **${slug}** on the stack below. Keep choices consistent with this stack — do not introduce frameworks, databases, or tools not listed here without explicit approval.`,
  );
  lines.push("");

  // --- Resolved stack ---
  lines.push("## Stack (resolved — the truth)");
  lines.push("");
  lines.push("| Layer | Choice |");
  lines.push("| --- | --- |");
  for (const [label, value] of stackRows) {
    if (value) lines.push(`| ${label} | ${value} |`);
  }
  lines.push("");

  // --- Conventions & standards ---
  const conventions = conventionRules(config);
  if (conventions.length > 0) {
    lines.push("## Conventions & standards");
    lines.push("");
    lines.push(
      "Project standards — apply them everywhere, from the first commit, so the codebase stays consistent no matter who writes the next file.",
    );
    lines.push("");
    for (const rule of conventions) lines.push(`- ${rule}`);
    lines.push("");
  }

  // --- Repo map ---
  lines.push("## Repo map");
  lines.push("");
  lines.push("```");
  lines.push(`${slug}/`);
  lines.push("  package.json     # scripts and selected dependencies");
  if (isNext) {
    lines.push(`  ${appDir}/        # Next.js App Router starter`);
  } else {
    lines.push("  src/index.ts     # placeholder entry for the selected web framework");
  }
  if (isNext && isCronusUi)
    lines.push("  cronus-ui.json    # Cronus UI registry paths and pinned registry URL");
  if (hasEnv)
    lines.push(
      "  .env.example     # required environment variables to fill before wiring services",
    );
  lines.push("  KICKOFF.md       # this briefing");
  lines.push("  stack.json       # machine-readable stack snapshot");
  lines.push("```");
  lines.push("");

  const followUps: string[] = [];
  if (!isNext && web) {
    followUps.push(
      "Wire the selected web framework; the generator wrote a placeholder entry only.",
    );
  }
  if (hasDedicatedBackend && backend) {
    followUps.push(`Add the dedicated backend service for **${backend}**.`);
  }
  if (hasApi && api) {
    followUps.push(`Add the typed API contract for **${api}**.`);
  }
  if (hasDatabase && database) {
    followUps.push(`Wire **${database}**${orm ? ` with **${orm}**` : ""} before syncing schema.`);
  }
  if (auth) followUps.push(`Implement **${auth}** and protect mutating routes.`);
  if (payments) {
    followUps.push(
      `Implement **${payments}** webhooks server-side; never trust client-side amounts.`,
    );
  }
  if (followUps.length > 0) {
    lines.push("## Manual follow-up from selected stack");
    lines.push("");
    for (const item of followUps) lines.push(`- ${item}`);
    lines.push("");
  }

  // --- Commands ---
  lines.push("## Commands");
  lines.push("");
  lines.push("```bash");
  lines.push(`${pmBin} install`);
  lines.push(scriptCommand(pmBin, "dev"));
  lines.push(scriptCommand(pmBin, "typecheck"));
  if (hasLint) lines.push(scriptCommand(pmBin, "lint"));
  lines.push(scriptCommand(pmBin, "build"));
  if (hasDatabase)
    lines.push(`${scriptCommand(pmBin, "db:push")}   # sync schema after DB is wired`);
  lines.push("```");
  lines.push("");

  // --- AI capabilities ---
  lines.push("## AI capabilities selected");
  lines.push("");
  lines.push(`- **Assistants:** ${assistants.length ? assistants.join(", ") : "none"}`);
  lines.push(`- **MCP servers:** ${mcp.length ? mcp.join(", ") : "none"}`);
  lines.push(`- **Skills:** ${skills.length ? skills.join(", ") : "none"}`);
  lines.push(
    "- Generated files cover the supported assistants/templates; any unsupported MCP server or skill pack remains manual follow-up.",
  );
  if (vibe) {
    lines.push(
      "- **Vibe Mode: ON** — looser guardrails for fast prototyping. Prefer momentum over ceremony, but never skip the security/DoD checks below.",
    );
  }
  lines.push("");

  // --- Cronus UI contract (only when relevant) ---
  if (isCronusUi) {
    lines.push("## Cronus UI contract");
    lines.push("");
    lines.push("This project uses **Cronus UI**. Treat these as hard rules:");
    lines.push("");
    lines.push(
      "- Use **only** components from `@cronus-ui/ui` — never hand-roll a primitive that already exists.",
    );
    lines.push(
      "- Use **only** semantic design-system tokens (e.g. `bg-surface-raised`, `text-fg`, `border-border`). Never hardcode hex/rgb colors or raw Tailwind palette classes.",
    );
    lines.push("- Compose class names with `cn` from `@cronus-ui/ui`.");
    lines.push('- Add `"use client"` to any component that holds state or effects.');
    lines.push(
      "- Every interactive element must have a visible `focus-visible` ring and pass the axe a11y gate.",
    );
    lines.push("- Tag composite elements with `data-slot` for styling hooks.");
    if (multiIds(config, "mcp").includes("mcp-cronus-ui")) {
      lines.push(
        "- The **cronus-ui MCP server** is selected. Use it only after your assistant has loaded the generated `.mcp.json` or an equivalent MCP config.",
      );
    }
    lines.push("");
  }

  // --- Addons ---
  if (addons.length > 0) {
    lines.push("## Addons selected");
    lines.push("");
    for (const a of addons) lines.push(`- ${a}`);
    lines.push(
      "- Generated files include only addons implemented by the generator; anything else is tracked as manual follow-up in the scaffold README.",
    );
    lines.push("");
  }

  // --- Guardrails ---
  lines.push("## Guardrails");
  lines.push("");
  lines.push("- Stay on the stack above; ask before adding new top-level dependencies.");
  lines.push("- No secrets in the repo — use `.env` and document required vars in `.env.example`.");
  lines.push("- Keep changes typed; do not introduce `any` or suppress type errors to ship.");
  if (auth)
    lines.push(`- Auth is **${auth}** — protect every mutation/route that needs a signed-in user.`);
  if (payments)
    lines.push(
      `- Payments via **${payments}** — verify webhooks and never trust client-side amounts.`,
    );
  lines.push("");

  // --- Definition of Done ---
  lines.push("## Definition of Done");
  lines.push("");
  lines.push("- [ ] Type checks pass (no errors, no new `any`).");
  if (hasLint) lines.push("- [ ] Lint/format pass.");
  lines.push("- [ ] Tests pass (and new behavior is covered).");
  if (isCronusUi)
    lines.push("- [ ] UI uses only `@cronus-ui/ui` + semantic tokens; axe a11y gate is green.");
  lines.push("- [ ] App runs locally end-to-end against the configured stack.");
  if (deploy) lines.push(`- [ ] Deploy config for **${deploy}** is present and documented.`);
  lines.push("");

  return lines.join("\n");
}
