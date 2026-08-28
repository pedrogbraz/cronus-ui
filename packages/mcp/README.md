# cronus-ui-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for
**Cronus UI**. It lets MCP-compatible AI agents and assistants discover, fetch,
and **install** Cronus UI components and blocks straight from the registry — and
**compose** full apps, **add pages**, **set themes**, and **upgrade** installed
components and composed pages — so an agent can list what's available, search it,
pull the exact source files, and grow the project it is working in along the
product loop (compose → add-page → theme → upgrade), not just `add button`.

The MCP server does **not** scaffold a new app. Greenfield starts with
`npx create-cronus-app`; write tools then operate inside that already-inited
project.

It speaks MCP over **stdio** and is the same registry the
[`cronus-ui`](https://www.npmjs.com/package/cronus-ui) CLI installs from.

## What it exposes

### Read-only tools

| Tool | Input | Returns |
| --- | --- | --- |
| `list_components` | — | All installable components (`registry:ui`): name, title, tags, dependencies, and the install command. |
| `list_blocks` | — | All installable blocks (`registry:block`) — composed sections like hero, pricing, login, dashboard. |
| `list_catalog` | `{ kind?: component\|block\|variant\|template }` | Compact Hydra-ready cards (description, design style, palette, motion, intents). No source files. |
| `match_catalog` | `{ query?, intent?, style?, palette?, motion?, kind?, limit? }` | Two-query match for low-context agents. `query: "login page with smooth animation"` infers intent + motion and returns `pick` / `intent` / `motion` hits. |
| `search_registry` | `{ query: string }` | Components and blocks whose name (or readable title) matches `query` (case-insensitive substring). |
| `get_component` | `{ name: string }` | Full detail for one component **or** block: source `files` (path + content), npm `dependencies`, `registryDependencies`, and the install command. |
| `get_install_command` | `{ names: string[] }` | The `npx cronus-ui add ...` command for one or more items. |
| `get_design_context` | `{ theme?: aurora\|neutral\|midnight\|sunset\|emerald, look?: default\|brutalist\|glass, format?: compact\|extended }` | Cronus visual taste (`DESIGN.md`). Read this before generating UI. |

These are annotated `readOnlyHint: true` — they never touch the project.

### Write tools

| Tool | Input | Does |
| --- | --- | --- |
| `compose_app` | `{ template: "saas"\|"store"\|"landing"\|"landing-*"\|"mail"\|"chat"\|"finance", brand?: string, dryRun?: boolean, yes?: boolean, skipInstall?: boolean, overwrite?: boolean, variant?: string[] }` | Runs `cronus-ui compose <template> -y` in the project (agents default to `-y`, which composes **saas** when no template is given). Optional `--brand`, `--dry-run`, `--skip-install`, `--overwrite`, and one `--variant <slug=id>` per `variant` entry. Prefer this over hand-writing pages when the user wants a full multi-page app from a validated template. Does **not** scaffold a new repo. |
| `add_page` | `{ route: string, blocks: string, nav?: string, title?: string, chrome?: string, dryRun?: boolean, skipInstall?: boolean, overwrite?: boolean, manifest?: string, app?: string }` | Runs `cronus-ui add-page --route <route> --blocks <blocks>` to grow an already-composed app by one page (installs blocks, writes the stacked `<main>` page, updates nav). Optional `--skip-install`, `--overwrite`, `--manifest` (custom compose apps), and `--app` (required when the project has more than one composed app). |
| `set_theme` | `{ name: "aurora"\|"neutral"\|"midnight"\|"sunset"\|"emerald", mode?: "dark"\|"light" }` | Runs `cronus-ui theme set <name>` (optional `--mode`) to switch a baked-in preset. For Create Studio permalinks use `apply_theme`. |
| `install_component` | `{ names: string[], overwrite?: boolean, skipInstall?: boolean }` | Runs `cronus-ui add <names...>` in the project: writes the component/block source files, resolves registry dependencies, and installs npm dependencies with the project's package manager. Existing files are skipped unless `overwrite` is set. Prefer `upgrade_components` when the files already exist and you want to pull upstream without discarding local edits. |
| `upgrade_components` | `{ names?: string[], all?: boolean, dryRun?: boolean, yes?: boolean, manifest?: string }` | Runs `cronus-ui upgrade --all` (default when `names` is omitted) or `cronus-ui upgrade <names...>`. 3-way merge of installed components AND composed pages/layouts so local edits survive. Prefer this over `install_component` overwrite and over `compose --overwrite`. `dryRun` first is recommended (`--dry-run`); `-y` only when `yes` is true. Optional `manifest` (`--manifest`) for custom compose apps. |
| `apply_theme` | `{ source: string, dryRun?: boolean }` | Runs `cronus-ui theme add <source>` in the project: updates the app layout's theme attributes, writes the theme override block into the global stylesheet, and records the theme in `cronus-ui.json`. `source` is a Create Studio permalink, a bare `c=` payload, or an exported theme JSON file. `dryRun` previews without writing. |

Write tools return a structured JSON result: `status` (`success` / `failed` /
`timeout`), the detected `projectRoot`, the exact `command` that ran, the parsed
report (files written/skipped, dependency state, theme changes, or CLI notes),
and the CLI's verbatim `stdout`/`stderr`. They are annotated as non-read-only
(`destructiveHint: true`, `idempotentHint: true`).

#### How writes work (security)

The server itself never writes files. Write tools **only** spawn the
version-pinned `cronus-ui` CLI — `bunx --bun cronus-ui@<the server's own version>`
(falling back to `npx -y`) — so the code that touches your project is exactly
the published CLI release matching the server, resolving from the same pinned
registry the read tools describe. The child runs at the detected project root
(the nearest directory with a `cronus-ui.json`, else the nearest `package.json`,
walking up from the server's working directory), with a 120s timeout. Item
names are validated as registry slugs, compose/add-page/theme/variant arguments
may not look like flags, and block specs reject `--` / stray spaces, so tool
arguments can never smuggle extra CLI options. The project must already exist and be
initialised (`npx create-cronus-app my-app --template saas`, or
`npx cronus-ui init` in an existing app); otherwise the CLI fails with a
clear error and writes nothing. MCP write tools never scaffold a new
repository.

### Resources

| Resource | URI | Description |
| --- | --- | --- |
| `registry-index` | `cronus-ui://registry/index` | The full registry listing (every component and block with its dependencies) as JSON. |
| `catalog-tags` | `cronus-ui://catalog/tags` | Compact tagged catalog Hydra ranks against (no source files). |

## Setup

The server runs with `npx` — no global install needed.

### Claude Code

```sh
claude mcp add cronus-ui -- npx -y cronus-ui-mcp
```

### Cursor / Windsurf (and other clients that use an `mcpServers` JSON)

Add this to your MCP config (e.g. `~/.cursor/mcp.json`, or a project
`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "cronus-ui": {
      "command": "npx",
      "args": ["-y", "cronus-ui-mcp"]
    }
  }
}
```

To point at a different registry, add an `env` block (see below):

```json
{
  "mcpServers": {
    "cronus-ui": {
      "command": "npx",
      "args": ["-y", "cronus-ui-mcp"],
      "env": { "CRONUS_UI_REGISTRY": "/absolute/path/to/registry" }
    }
  }
}
```

## Configuration

| Env var | Default | Description |
| --- | --- | --- |
| `CRONUS_UI_REGISTRY` | The public Cronus UI registry for the pinned version. | Registry source override — either an `http(s)` base URL or a local directory path. Useful for testing a fork or an unpublished registry locally. Also forwarded to the CLI by `install_component`, `compose_app`, `add_page`, and `upgrade_components` (`--registry`). |
| `CRONUS_MCP_CLI_CMD` | `bunx --bun cronus-ui@<version>`, then `npx -y cronus-ui@<version>` | Launcher override for the write tools (whitespace-split), e.g. `bun /repo/packages/cli/src/index.ts` to run a local CLI checkout. |
| `CRONUS_MCP_CLI_TIMEOUT_MS` | `120000` | Wall-clock budget for one CLI run made by a write tool. |

The server fetches `index.json` for listings and `<name>.json` for item detail,
and caches both in memory for the lifetime of the process. All diagnostics are
written to **stderr**; **stdout** carries only the MCP protocol.

## Example agent flow

**Greenfield is not an MCP tool.** Scaffold a new app first, then point the
MCP server at that project:

```sh
npx create-cronus-app my-app --template saas
```

MCP write tools only run inside an already-inited project (`cronus-ui.json` or
at least `package.json`). Then:

1. `compose_app { "template": "saas", "brand": "Acme" }` → installs the SaaS
   template's blocks and writes generated pages that stack them in `<main>`.
   Optional `variant: ["login=split"]`, `skipInstall`, `overwrite`.
2. `add_page { "route": "/pricing", "blocks": "pricing,cta", "nav": "Pricing" }` →
   grows the composed app by one route. Optional `skipInstall`, `overwrite`,
   and `manifest` (custom compose apps).
3. `set_theme { "name": "sunset", "mode": "dark" }` → switches the baked-in
   preset. (Create Studio permalinks go through `apply_theme` instead.)
4. `upgrade_components { "dryRun": true }` → preview the 3-way merge of
   installed components and composed pages/layouts against the current
   registry (`upgrade --all --dry-run`). Prefer this over `install_component`
   with `overwrite` (and over `compose --overwrite`) so local edits survive.
   Optional `manifest` when the app was composed from a custom `--manifest`.

Low-context pick (Hydra / an agent that has not read the docs):

1. `match_catalog { "query": "login page with smooth animation" }` → two
   lookups (intent=`login`, motion=`smooth`) and a `pick` of compact cards
   (description, design style, palette, motion, intents). No source dumped.
2. `get_component { "name": "<picked name>" }` → source only after the pick.
3. `install_component { "names": ["<picked name>"] }` → write it into the project.

For a single primitive by name, keep using the registry tools:

1. `search_registry { "query": "table" }` → finds `data-table`, `table`, `filter-bar`.
2. `get_component { "name": "data-table" }` → returns the `.tsx` source, its npm
   deps (`@tanstack/react-table`, …), its registry deps, and
   `npx cronus-ui add data-table`.
3. `install_component { "names": ["data-table"] }` → the pinned CLI writes the
   files into the project, pulls in the registry dependencies, and installs the
   npm packages — the result lists every file written.

## Development

```sh
bun run build      # tsc -> dist
bun run typecheck  # tsc --noEmit
bun run test       # vitest (tool logic, no network)
```

## License

MIT
