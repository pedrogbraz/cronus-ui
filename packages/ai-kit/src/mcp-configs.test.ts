import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MCP_EDITOR_FILES, MCP_EDITORS, writeMcpConfigs } from "./mcp-configs.js";

describe("writeMcpConfigs", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "mcp-configs-"));
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("covers every advertised editor", () => {
    expect(MCP_EDITOR_FILES.map((file) => file.id)).toEqual([...MCP_EDITORS]);
  });

  it("writes VS Code with servers, not mcpServers", () => {
    writeMcpConfigs({ targetDir: dir, clients: ["vscode"] });
    const body = readFileSync(join(dir, ".vscode/mcp.json"), "utf8");
    expect(body).toContain('"servers"');
    expect(body).not.toContain('"mcpServers"');
    expect(body).toContain("cronus-ui-mcp");
  });

  it("skips existing files and force replaces them", () => {
    writeFileSync(join(dir, "opencode.json"), '{"keep":true}\n');
    const first = writeMcpConfigs({ targetDir: dir, clients: ["opencode"] });
    expect(first.written).toEqual([]);
    expect(first.skipped).toEqual(["opencode.json"]);
    const second = writeMcpConfigs({ targetDir: dir, clients: ["opencode"], force: true });
    expect(second.written).toEqual(["opencode.json"]);
    expect(
      JSON.parse(readFileSync(join(dir, "opencode.json"), "utf8")).mcp["cronus-ui"].command,
    ).toEqual(["npx", "-y", "cronus-ui-mcp"]);
    expect(existsSync(join(dir, ".mcp.json"))).toBe(false);
  });
});
