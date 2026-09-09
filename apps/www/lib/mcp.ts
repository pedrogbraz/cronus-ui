/**
 * MCP client snippets and the hosted endpoint. The docs page, /llms.txt, and
 * tests all read from here so a new client cannot land in one surface and
 * vanish from the others.
 */

export const MCP_HTTP_URL = "https://aicronus.com/mcp";
export const MCP_STDIO_COMMAND = "npx -y cronus-ui-mcp";

export const MCP_READ_TOOLS = [
  "list_components",
  "list_blocks",
  "list_catalog",
  "match_catalog",
  "search_registry",
  "get_component",
  "get_install_command",
  "get_design_context",
] as const;

export const MCP_WRITE_TOOLS = [
  "compose_app",
  "add_page",
  "set_theme",
  "install_component",
  "upgrade_components",
  "apply_theme",
] as const;

export type McpTransport = "stdio" | "http" | "both";

export type McpSnippet = {
  id: string;
  label: string;
  language: "bash" | "json" | "toml";
  configPath: string;
  code: string;
  note?: string;
};

export type McpClientRow = {
  label: string;
  transport: McpTransport;
  config: string;
  notes: string;
};

const stdioJson = `{
  "mcpServers": {
    "cronus-ui": {
      "command": "npx",
      "args": ["-y", "cronus-ui-mcp"]
    }
  }
}`;

const httpJson = `{
  "mcpServers": {
    "cronus-ui": {
      "url": "${MCP_HTTP_URL}"
    }
  }
}`;

export const MCP_CLIENTS: readonly McpClientRow[] = [
  {
    label: "Claude Code",
    transport: "both",
    config: "claude mcp add / .mcp.json",
    notes: "create-cronus-app already writes .mcp.json (stdio).",
  },
  {
    label: "Cursor",
    transport: "both",
    config: "~/.cursor/mcp.json or .cursor/mcp.json",
    notes: "Root key is mcpServers.",
  },
  {
    label: "Windsurf",
    transport: "both",
    config: "~/.codeium/windsurf/mcp_config.json",
    notes: "Same mcpServers JSON as Cursor.",
  },
  {
    label: "VS Code / GitHub Copilot",
    transport: "both",
    config: ".vscode/mcp.json",
    notes: "Root key is servers, not mcpServers.",
  },
  {
    label: "Codex",
    transport: "both",
    config: "~/.codex/config.toml",
    notes: "codex mcp add cronus-ui -- npx -y cronus-ui-mcp.",
  },
  {
    label: "Grok CLI",
    transport: "both",
    config: "~/.grok/config.toml",
    notes: "grok mcp add. Also reads .mcp.json / .cursor/mcp.json.",
  },
  {
    label: "OpenCode",
    transport: "both",
    config: "opencode.json",
    notes: "Root key is mcp; command is a single array.",
  },
  {
    label: "Zed",
    transport: "stdio",
    config: "settings.json → context_servers",
    notes: "Zed calls MCP servers context servers.",
  },
  {
    label: "Antigravity",
    transport: "stdio",
    config: "~/.gemini/config/mcp_config.json",
    notes: "Shared with Antigravity IDE and CLI. mcpServers JSON.",
  },
  {
    label: "Kilo Code",
    transport: "stdio",
    config: "kilo.json / .kilocode/",
    notes: "Local stdio. Same command + args as Cursor.",
  },
  {
    label: "Conductor",
    transport: "stdio",
    config: "inherits Claude Code / Codex / Cursor",
    notes: ".mcp.json in the repo is enough for Claude sessions.",
  },
  {
    label: "v0 / Lovable / Replit / Bolt / Base44",
    transport: "http",
    config: "Custom MCP URL field",
    notes: `Paste ${MCP_HTTP_URL}. Read-only catalog — no local CLI.`,
  },
];

export const MCP_STDIO_SNIPPETS: readonly McpSnippet[] = [
  {
    id: "claude",
    label: "Claude Code",
    language: "bash",
    configPath: "terminal",
    code: "claude mcp add cronus-ui -- npx -y cronus-ui-mcp",
    note: "Project scope: the same JSON in `.mcp.json` at the repo root.",
  },
  {
    id: "cursor",
    label: "Cursor / Windsurf",
    language: "json",
    configPath: "~/.cursor/mcp.json",
    code: stdioJson,
  },
  {
    id: "vscode",
    label: "VS Code / Copilot",
    language: "json",
    configPath: ".vscode/mcp.json",
    code: `{
  "servers": {
    "cronus-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "cronus-ui-mcp"]
    }
  }
}`,
    note: "The root key is `servers`. Pasting `mcpServers` here does nothing.",
  },
  {
    id: "codex",
    label: "Codex",
    language: "toml",
    configPath: "~/.codex/config.toml",
    code: `[mcp_servers.cronus-ui]
command = "npx"
args = ["-y", "cronus-ui-mcp"]`,
    note: "Or: `codex mcp add cronus-ui -- npx -y cronus-ui-mcp`.",
  },
  {
    id: "grok",
    label: "Grok CLI",
    language: "bash",
    configPath: "~/.grok/config.toml",
    code: "grok mcp add cronus-ui -- npx -y cronus-ui-mcp",
    note: "Same TOML shape as Codex under `[mcp_servers.cronus-ui]`.",
  },
  {
    id: "opencode",
    label: "OpenCode",
    language: "json",
    configPath: "opencode.json",
    code: `{
  "mcp": {
    "cronus-ui": {
      "type": "local",
      "command": ["npx", "-y", "cronus-ui-mcp"],
      "enabled": true
    }
  }
}`,
  },
  {
    id: "zed",
    label: "Zed",
    language: "json",
    configPath: "settings.json",
    code: `{
  "context_servers": {
    "cronus-ui": {
      "command": "npx",
      "args": ["-y", "cronus-ui-mcp"]
    }
  }
}`,
  },
  {
    id: "antigravity",
    label: "Antigravity",
    language: "json",
    configPath: "~/.gemini/config/mcp_config.json",
    code: stdioJson,
  },
];

export const MCP_HTTP_SNIPPETS: readonly McpSnippet[] = [
  {
    id: "url",
    label: "URL",
    language: "bash",
    configPath: "Custom MCP / Connectors",
    code: MCP_HTTP_URL,
    note: "Paste the URL. No API key. Catalog only — install still happens in a local repo via the CLI.",
  },
  {
    id: "claude-http",
    label: "Claude Code",
    language: "bash",
    configPath: "terminal",
    code: `claude mcp add --transport http cronus-ui ${MCP_HTTP_URL}`,
  },
  {
    id: "cursor-http",
    label: "Cursor / Windsurf",
    language: "json",
    configPath: "~/.cursor/mcp.json",
    code: httpJson,
  },
  {
    id: "vscode-http",
    label: "VS Code / Copilot",
    language: "json",
    configPath: ".vscode/mcp.json",
    code: `{
  "servers": {
    "cronus-ui": {
      "type": "http",
      "url": "${MCP_HTTP_URL}"
    }
  }
}`,
  },
  {
    id: "codex-http",
    label: "Codex",
    language: "toml",
    configPath: "~/.codex/config.toml",
    code: `[mcp_servers.cronus-ui]
url = "${MCP_HTTP_URL}"`,
  },
  {
    id: "grok-http",
    label: "Grok CLI",
    language: "bash",
    configPath: "~/.grok/config.toml",
    code: `grok mcp add --transport http cronus-ui ${MCP_HTTP_URL}`,
  },
  {
    id: "opencode-http",
    label: "OpenCode",
    language: "json",
    configPath: "opencode.json",
    code: `{
  "mcp": {
    "cronus-ui": {
      "type": "remote",
      "url": "${MCP_HTTP_URL}",
      "enabled": true
    }
  }
}`,
  },
];
