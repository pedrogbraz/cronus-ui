import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  addPage,
  applyTheme,
  type CliRunOptions,
  COMPOSE_TEMPLATES,
  composeApp,
  installComponent,
  type RunStatus,
  setTheme,
  THEME_MODES,
  THEME_PRESETS,
  upgradeComponents,
} from "./cli.js";
import type { RegistryClient } from "./registry.js";
import {
  getComponent,
  getInstallCommand,
  listBlocks,
  listComponents,
  searchRegistry,
} from "./tools.js";
import { SERVER_VERSION } from "./version.js";

export const SERVER_NAME = "cronus-ui";

/**
 * The shape returned by every tool handler in the SDK 1.x API. A `type` alias
 * (not an `interface`) so it stays assignable to the SDK's result type, which
 * carries an open `[x: string]: unknown` index signature.
 */
type ToolResult = {
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

/** Wrap a JSON-serialisable value as a successful text tool result. */
function ok(value: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

/** Wrap an error as a tool result (never throws across the transport). */
function fail(error: unknown): ToolResult {
  const message = error instanceof Error ? error.message : String(error);
  return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
}

/**
 * Wrap a completed CLI run as a tool result: the full structured outcome
 * (verbatim stdout/stderr included) either way, flagged as an error when the
 * CLI did not succeed so agents notice without parsing the JSON.
 */
function ranCli(result: { status: RunStatus }): ToolResult {
  const body = ok(result);
  return result.status === "success" ? body : { ...body, isError: true };
}

/**
 * Annotation sets (all MCP `ToolAnnotations` are hints, not guarantees).
 *
 * - Read tools never touch the consumer project and only fetch from the one
 *   configured registry, hence `readOnlyHint` and a closed world.
 * - Write tools modify the consumer project's files (and `install_component`
 *   runs the package manager). They can replace existing content
 *   (`--overwrite`, theme override block), hence `destructiveHint`. Re-running
 *   with the same arguments converges on the same state, hence
 *   `idempotentHint`.
 */
const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;
const WRITES_PROJECT = {
  readOnlyHint: false,
  destructiveHint: true,
  idempotentHint: true,
  openWorldHint: false,
} as const;

/**
 * Build the configured MCP server. Exposes the Cronus UI registry as a set of
 * read-only tools (and the index as a resource) plus write tools that compose
 * apps, add pages, install/upgrade components, and apply/set themes by running
 * the version-pinned `cronus-ui` CLI in the consumer project.
 *
 * `cliOptions` (cwd/env/launcher/timeout) is a seam for tests and embedding —
 * the stdio entry point passes nothing and the write tools then operate on
 * `process.cwd()`.
 */
export function createServer(
  client: RegistryClient,
  source: string,
  cliOptions: CliRunOptions = {},
): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  server.registerTool(
    "list_components",
    {
      title: "List Cronus UI components",
      description:
        "List the installable Cronus UI components (registry items of type 'registry:ui'). " +
        "Returns each component's name, a readable title, its npm and registry dependencies, " +
        "and the `npx cronus-ui add <name>` command to install it.",
      inputSchema: {},
      annotations: READ_ONLY,
    },
    async () => {
      try {
        return ok(await listComponents(client));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "list_blocks",
    {
      title: "List Cronus UI blocks",
      description:
        "List the installable Cronus UI blocks (registry items of type 'registry:block') — " +
        "larger, composed sections such as hero, pricing, login, and dashboard. Returns each " +
        "block's name, title, dependencies, and its `npx cronus-ui add <name>` install command.",
      inputSchema: {},
      annotations: READ_ONLY,
    },
    async () => {
      try {
        return ok(await listBlocks(client));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "search_registry",
    {
      title: "Search the Cronus UI registry",
      description:
        "Fuzzy-search Cronus UI components and blocks by name (case-insensitive substring match). " +
        "Use this to find the right item before fetching its source with `get_component`.",
      inputSchema: {
        query: z
          .string()
          .describe(
            "Search text matched against component and block names, e.g. 'button' or 'card'.",
          ),
      },
      annotations: READ_ONLY,
    },
    async ({ query }) => {
      try {
        return ok(await searchRegistry(client, query));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a Cronus UI component or block",
      description:
        "Fetch the full detail for a single Cronus UI component or block by name: its source " +
        "file(s) (path + content), its npm `dependencies`, its `registryDependencies` (other " +
        "registry items it needs), and the `npx cronus-ui add <name>` install command. Works for " +
        "both components and blocks.",
      inputSchema: {
        name: z
          .string()
          .describe("The exact registry item name, e.g. 'button', 'data-table', or 'pricing'."),
      },
      annotations: READ_ONLY,
    },
    async ({ name }) => {
      try {
        return ok(await getComponent(client, name));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "get_install_command",
    {
      title: "Build a Cronus UI install command",
      description:
        "Build the `npx cronus-ui add ...` command for one or more components/blocks. The CLI " +
        "resolves and installs each item's registry dependencies automatically. This only " +
        "returns the command string — to actually install, use `install_component`.",
      inputSchema: {
        names: z
          .array(z.string())
          .min(1)
          .describe(
            "One or more registry item names to install, e.g. ['button', 'card', 'dialog'].",
          ),
      },
      annotations: READ_ONLY,
    },
    async ({ names }) => {
      try {
        return ok(getInstallCommand(names));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "install_component",
    {
      title: "Install Cronus UI components into the project",
      description:
        "MODIFIES THE FILESYSTEM. Install one or more Cronus UI components/blocks into the " +
        "current project by running the version-pinned `cronus-ui add` CLI at the detected " +
        "project root (nearest directory with cronus-ui.json, else package.json). It writes the " +
        "component source files, pulls in their registry dependencies, and installs their npm " +
        "packages with the project's package manager. Use this — not a shell command — whenever " +
        "the user asks to add/install a Cronus UI component or block. Existing files are " +
        "skipped unless `overwrite` is true (overwrite discards local edits to those files). " +
        "Requires a project initialised with `npx cronus-ui init`.",
      inputSchema: {
        names: z
          .array(z.string())
          .min(1)
          .describe(
            "Registry item names to install, e.g. ['button', 'card'] or ['pricing']. " +
              "Registry dependencies are resolved automatically.",
          ),
        overwrite: z
          .boolean()
          .optional()
          .describe(
            "Overwrite files that already exist in the project (destroys local edits to " +
              "those files). Default: existing files are skipped.",
          ),
        skipInstall: z
          .boolean()
          .optional()
          .describe(
            "Write the source files but skip the package-manager install of npm " +
              "dependencies; the result then lists them as pending.",
          ),
      },
      annotations: WRITES_PROJECT,
    },
    async ({ names, overwrite, skipInstall }) => {
      try {
        return ranCli(await installComponent({ names, overwrite, skipInstall }, cliOptions));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "upgrade_components",
    {
      title: "Upgrade installed Cronus UI components and composed pages",
      description:
        "MODIFIES THE FILESYSTEM. Upgrade installed Cronus UI components and composed pages/layouts " +
        "to the current registry release by running the version-pinned `cronus-ui upgrade` CLI at " +
        "the detected project root. 3-way merge of installed items AND composed pages/layouts so " +
        "local edits survive. Prefer this over install_component overwrite and over compose " +
        "--overwrite. dryRun first is recommended. Defaults to `--all` when `names` is omitted " +
        '(the usual "pull latest" request). Pass `manifest` for custom compose apps. Requires a ' +
        "project initialised with `npx cronus-ui init`.",
      inputSchema: {
        names: z
          .array(z.string())
          .optional()
          .describe(
            "Registry item names to upgrade, e.g. ['button', 'card']. Omit (and leave `all` " +
              "unset or true) to upgrade every installed component and composed pages/layouts. " +
              "Named upgrades do not touch pages.",
          ),
        all: z
          .boolean()
          .optional()
          .describe(
            "Upgrade every installed component and composed pages/layouts (`--all`). Default " +
              "when `names` is empty. Set false only when passing `names`.",
          ),
        dryRun: z
          .boolean()
          .optional()
          .describe("Preview the per-file plan (fast-forward / merge / conflict) without writing."),
        yes: z
          .boolean()
          .optional()
          .describe(
            "Pass `-y`: write conflict markers and confirmed overwrites without asking. " +
              "Unlike compose_app, this does not default to true.",
          ),
        manifest: z
          .string()
          .optional()
          .describe(
            "Path to the compose manifest file (`--manifest`). Required when the app was " +
              "composed from a custom `--manifest` whose name collides with a bundled template " +
              "(or is not a bundled template).",
          ),
      },
      annotations: WRITES_PROJECT,
    },
    async ({ names, all, dryRun, yes, manifest }) => {
      try {
        return ranCli(await upgradeComponents({ names, all, dryRun, yes, manifest }, cliOptions));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "apply_theme",
    {
      title: "Apply a Cronus UI theme to the project",
      description:
        "MODIFIES THE FILESYSTEM. Apply a theme built in the Cronus UI Create Studio to the " +
        "current project by running the version-pinned `cronus-ui theme add` CLI at the " +
        "detected project root. It updates the app layout's theme attributes, writes the theme " +
        "override block into the global stylesheet (replacing any previous one), and records " +
        "the theme in cronus-ui.json. Use this when the user provides a Create Studio permalink " +
        "or an exported theme JSON file and wants it applied. Set `dryRun` to preview the " +
        "changes without writing anything.",
      inputSchema: {
        source: z
          .string()
          .describe(
            "The theme to apply: a Create Studio permalink URL, a bare `c=` payload, or a " +
              "path to an exported theme JSON file.",
          ),
        dryRun: z
          .boolean()
          .optional()
          .describe("Preview what would change without writing any files."),
      },
      annotations: WRITES_PROJECT,
    },
    async ({ source: themeSource, dryRun }) => {
      try {
        return ranCli(await applyTheme({ source: themeSource, dryRun }, cliOptions));
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "compose_app",
    {
      title: "Compose a Cronus UI app from a template",
      description:
        "MODIFIES THE FILESYSTEM. Generate a full multi-page app from a validated Cronus UI " +
        "template (saas, store, or landing) by running the version-pinned `cronus-ui compose` " +
        "CLI at the detected project root. Prefer this over hand-writing pages: it installs " +
        "the template's blocks, writes route files that only stack those blocks in <main>, " +
        "and records the app in cronus-ui.json. Use when the user wants a full product " +
        "(SaaS / store / landing), not a single primitive. Set `dryRun` to preview without " +
        "writing. Requires a project initialised with `npx cronus-ui init` — this does not " +
        "scaffold a new app (use `npx create-cronus-app` for greenfield).",
      inputSchema: {
        template: z
          .enum(COMPOSE_TEMPLATES)
          .describe("Bundled app template to compose: 'saas', 'store', or 'landing'."),
        brand: z
          .string()
          .optional()
          .describe("Brand wordmark baked into chrome/hero. Ignored when empty."),
        dryRun: z
          .boolean()
          .optional()
          .describe("Preview the validated plan without writing any files."),
        yes: z
          .boolean()
          .optional()
          .describe("Pass `-y` (non-interactive). Defaults to true so agents never hang."),
        skipInstall: z
          .boolean()
          .optional()
          .describe("Write the files but skip the package-manager install of npm dependencies."),
        overwrite: z
          .boolean()
          .optional()
          .describe("Overwrite files that already exist (`--overwrite`)."),
        variant: z
          .array(z.string())
          .optional()
          .describe(
            "Block variant selections as slug=id tokens, e.g. ['login=split']. Each becomes " +
              "`--variant <token>`.",
          ),
      },
      annotations: WRITES_PROJECT,
    },
    async ({ template, brand, dryRun, yes, skipInstall, overwrite, variant }) => {
      try {
        return ranCli(
          await composeApp(
            { template, brand, dryRun, yes, skipInstall, overwrite, variant },
            cliOptions,
          ),
        );
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "add_page",
    {
      title: "Add a page to a composed Cronus UI app",
      description:
        "MODIFIES THE FILESYSTEM. Grow an already-composed app by one page: install the " +
        "named blocks, write a generated page that stacks them in <main>, and update the " +
        "chrome nav + composed record. Runs the version-pinned `cronus-ui add-page` CLI at " +
        "the detected project root. Use after `compose_app` when the user wants a new route. " +
        "Set `dryRun` to preview without writing. Pass `app` (`--app`) when the project has " +
        "more than one composed app. Pass `manifest` when the app was composed from a custom " +
        "`--manifest`.",
      inputSchema: {
        route: z.string().describe("Route to add, starting with '/', e.g. '/pricing'."),
        blocks: z
          .string()
          .describe(
            "Comma-separated block slugs to stack, e.g. 'pricing,cta'. Variant syntax " +
              "'login=split' is allowed.",
          ),
        nav: z.string().optional().describe("Nav label; adds the page to the chrome nav."),
        title: z.string().optional().describe("Page <title> (default: title-cased route)."),
        chrome: z
          .string()
          .optional()
          .describe("Chrome group for the page (default: the app's first group)."),
        app: z
          .string()
          .optional()
          .describe(
            "Composed app key (`--app`). Required when the project has more than one composed app.",
          ),
        dryRun: z.boolean().optional().describe("Preview the plan without writing any files."),
        skipInstall: z
          .boolean()
          .optional()
          .describe("Write the files but skip the package-manager install of npm dependencies."),
        overwrite: z
          .boolean()
          .optional()
          .describe("Replace the page if the route already exists (`--overwrite`)."),
        manifest: z
          .string()
          .optional()
          .describe(
            "Path to the compose manifest file (`--manifest`). Required when the app was " +
              "composed from a custom `--manifest` whose name collides with a bundled template " +
              "(or is not a bundled template).",
          ),
      },
      annotations: WRITES_PROJECT,
    },
    async ({
      route,
      blocks,
      nav,
      title,
      chrome,
      app,
      dryRun,
      skipInstall,
      overwrite,
      manifest,
    }) => {
      try {
        return ranCli(
          await addPage(
            { route, blocks, nav, title, chrome, app, dryRun, skipInstall, overwrite, manifest },
            cliOptions,
          ),
        );
      } catch (error) {
        return fail(error);
      }
    },
  );

  server.registerTool(
    "set_theme",
    {
      title: "Set the Cronus UI theme preset",
      description:
        "MODIFIES THE FILESYSTEM. Switch the baked-in Cronus UI theme preset (and optionally " +
        "the color mode) by running the version-pinned `cronus-ui theme set` CLI at the " +
        "detected project root. Use this for aurora / neutral / midnight / sunset / emerald. " +
        "For Create Studio permalinks or exported JSON, use `apply_theme` instead.",
      inputSchema: {
        name: z
          .enum(THEME_PRESETS)
          .describe("Baked-in preset: 'aurora', 'neutral', 'midnight', 'sunset', or 'emerald'."),
        mode: z
          .enum(THEME_MODES)
          .optional()
          .describe("Color mode to pin ('dark' or 'light'). Omitting leaves the current mode."),
      },
      annotations: WRITES_PROJECT,
    },
    async ({ name, mode }) => {
      try {
        return ranCli(await setTheme({ name, mode }, cliOptions));
      } catch (error) {
        return fail(error);
      }
    },
  );

  // Expose the registry index as a resource so agents can browse the full
  // catalog in one read.
  server.registerResource(
    "registry-index",
    "cronus-ui://registry/index",
    {
      title: "Cronus UI registry index",
      description:
        "The full Cronus UI registry listing (all components and blocks with their dependencies). " +
        `Source: ${source}`,
      mimeType: "application/json",
    },
    async (uri) => {
      const index = await client.index();
      return {
        contents: [
          { uri: uri.href, mimeType: "application/json", text: JSON.stringify(index, null, 2) },
        ],
      };
    },
  );

  return server;
}
