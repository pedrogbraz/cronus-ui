import { describe, expect, it } from "vitest";
import {
  MCP_CLIENTS,
  MCP_HTTP_SNIPPETS,
  MCP_HTTP_URL,
  MCP_READ_TOOLS,
  MCP_STDIO_COMMAND,
  MCP_STDIO_SNIPPETS,
  MCP_WRITE_TOOLS,
} from "./mcp";

describe("MCP client catalog", () => {
  it("advertises the hosted URL and the stdio command", () => {
    expect(MCP_HTTP_URL).toBe("https://aicronus.com/mcp");
    expect(MCP_STDIO_COMMAND).toBe("npx -y cronus-ui-mcp");
  });

  it("documents VS Code with the servers key, not mcpServers", () => {
    const vscode = MCP_STDIO_SNIPPETS.find((snippet) => snippet.id === "vscode");
    expect(vscode?.code).toContain('"servers"');
    expect(vscode?.code).not.toContain('"mcpServers"');
  });

  it("covers the clients the hosted page claims", () => {
    const labels = MCP_CLIENTS.map((row) => row.label).join(" ");
    for (const name of [
      "Claude Code",
      "Cursor",
      "VS Code",
      "Codex",
      "Grok",
      "OpenCode",
      "Zed",
      "Antigravity",
      "Kilo",
      "Conductor",
      "Lovable",
      "Bolt",
      "Base44",
      "v0",
    ]) {
      expect(labels).toContain(name);
    }
  });

  it("keeps HTTP snippets pointed at the public endpoint", () => {
    for (const snippet of MCP_HTTP_SNIPPETS) {
      expect(snippet.code).toContain(MCP_HTTP_URL);
    }
  });

  it("lists the read and write tool names", () => {
    expect(MCP_READ_TOOLS).toContain("match_catalog");
    expect(MCP_WRITE_TOOLS).toContain("compose_app");
    expect(MCP_READ_TOOLS).not.toContain("compose_app");
  });
});
