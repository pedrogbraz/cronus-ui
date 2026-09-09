import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mcpInit } from "./mcp.js";

describe("mcpInit", () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "cronus-ui-mcp-"));
  });
  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  it("writes every editor file by default", () => {
    mcpInit({ cwd });
    expect(existsSync(join(cwd, ".mcp.json"))).toBe(true);
    expect(existsSync(join(cwd, ".cursor/mcp.json"))).toBe(true);
    expect(existsSync(join(cwd, ".vscode/mcp.json"))).toBe(true);
    expect(existsSync(join(cwd, ".codex/config.toml"))).toBe(true);
    expect(existsSync(join(cwd, ".grok/config.toml"))).toBe(true);
    expect(existsSync(join(cwd, "opencode.json"))).toBe(true);
    expect(existsSync(join(cwd, ".gemini/settings.json"))).toBe(true);
    expect(existsSync(join(cwd, ".zed/settings.json"))).toBe(true);

    const vscode = JSON.parse(readFileSync(join(cwd, ".vscode/mcp.json"), "utf8")) as {
      servers?: { "cronus-ui"?: { command?: string } };
      mcpServers?: unknown;
    };
    expect(vscode.servers?.["cronus-ui"]?.command).toBe("npx");
    expect(vscode.mcpServers).toBeUndefined();

    const opencode = JSON.parse(readFileSync(join(cwd, "opencode.json"), "utf8")) as {
      mcp: { "cronus-ui": { command: string[] } };
    };
    expect(opencode.mcp["cronus-ui"].command).toEqual(["npx", "-y", "cronus-ui-mcp"]);
  });

  it("writes only the requested client", () => {
    mcpInit({ cwd, client: "vscode" });
    expect(existsSync(join(cwd, ".vscode/mcp.json"))).toBe(true);
    expect(existsSync(join(cwd, ".mcp.json"))).toBe(false);
    expect(existsSync(join(cwd, ".cursor/mcp.json"))).toBe(false);
  });

  it("skips existing files unless force", () => {
    writeFileSync(join(cwd, ".mcp.json"), '{"keep":true}\n');
    mcpInit({ cwd, client: "claude" });
    expect(JSON.parse(readFileSync(join(cwd, ".mcp.json"), "utf8"))).toEqual({ keep: true });
    mcpInit({ cwd, client: "claude", force: true });
    const replaced = JSON.parse(readFileSync(join(cwd, ".mcp.json"), "utf8")) as {
      mcpServers: { "cronus-ui": { command: string } };
    };
    expect(replaced.mcpServers["cronus-ui"].command).toBe("npx");
  });

  it("rejects an unknown client", () => {
    const previous = process.exitCode;
    process.exitCode = 0;
    mcpInit({ cwd, client: "notepad" });
    expect(process.exitCode).toBe(1);
    process.exitCode = previous ?? 0;
  });
});
