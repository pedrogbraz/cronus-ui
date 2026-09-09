import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Project-scoped MCP config files. Cloud builders (v0, Lovable, Bolt, Base44)
 * take the hosted URL instead — they cannot spawn `npx`.
 */
export const MCP_EDITORS = [
  "claude",
  "cursor",
  "vscode",
  "codex",
  "grok",
  "opencode",
  "gemini",
  "zed",
] as const;
export type McpEditor = (typeof MCP_EDITORS)[number];
export const DEFAULT_MCP_EDITORS: readonly McpEditor[] = MCP_EDITORS;

const STDIO_ARGS = ["-y", "cronus-ui-mcp"] as const;

function jsonFile(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export type McpEditorFile = {
  id: McpEditor;
  rel: string;
  contents: string;
};

/** One file per editor. Contents are the stdio server (`npx -y cronus-ui-mcp`). */
export const MCP_EDITOR_FILES: readonly McpEditorFile[] = [
  {
    id: "claude",
    rel: ".mcp.json",
    contents: jsonFile({
      mcpServers: {
        "cronus-ui": { type: "stdio", command: "npx", args: [...STDIO_ARGS] },
      },
    }),
  },
  {
    id: "cursor",
    rel: ".cursor/mcp.json",
    contents: jsonFile({
      mcpServers: {
        "cronus-ui": { command: "npx", args: [...STDIO_ARGS] },
      },
    }),
  },
  {
    id: "vscode",
    rel: ".vscode/mcp.json",
    contents: jsonFile({
      servers: {
        "cronus-ui": { type: "stdio", command: "npx", args: [...STDIO_ARGS] },
      },
    }),
  },
  {
    id: "codex",
    rel: ".codex/config.toml",
    contents: `[mcp_servers.cronus-ui]
command = "npx"
args = ["-y", "cronus-ui-mcp"]
`,
  },
  {
    id: "grok",
    rel: ".grok/config.toml",
    contents: `[mcp_servers.cronus-ui]
command = "npx"
args = ["-y", "cronus-ui-mcp"]
`,
  },
  {
    id: "opencode",
    rel: "opencode.json",
    contents: jsonFile({
      mcp: {
        "cronus-ui": {
          type: "local",
          command: ["npx", "-y", "cronus-ui-mcp"],
          enabled: true,
        },
      },
    }),
  },
  {
    id: "gemini",
    rel: ".gemini/settings.json",
    contents: jsonFile({
      mcpServers: {
        "cronus-ui": { command: "npx", args: [...STDIO_ARGS] },
      },
    }),
  },
  {
    id: "zed",
    rel: ".zed/settings.json",
    contents: jsonFile({
      context_servers: {
        "cronus-ui": { command: "npx", args: [...STDIO_ARGS] },
      },
    }),
  },
];

export interface WriteMcpConfigsOptions {
  targetDir: string;
  /** Subset of editors. Default: every project-scoped client. */
  clients?: readonly McpEditor[];
  /** Replace existing files. Default false (idempotent). */
  force?: boolean;
}

/**
 * Write stdio MCP config files for the selected editors. Never merges: a file
 * that already exists is skipped unless `force` is set, so hand-edited OpenCode
 * / Zed / Gemini settings are not clobbered.
 */
export function writeMcpConfigs(options: WriteMcpConfigsOptions): {
  written: string[];
  skipped: string[];
} {
  const clients = new Set(options.clients ?? DEFAULT_MCP_EDITORS);
  const force = options.force ?? false;
  const written: string[] = [];
  const skipped: string[] = [];

  for (const file of MCP_EDITOR_FILES) {
    if (!clients.has(file.id)) continue;
    const dest = join(options.targetDir, file.rel);
    if (!force && existsSync(dest)) {
      skipped.push(file.rel);
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, file.contents);
    written.push(file.rel);
  }

  return { written, skipped };
}
