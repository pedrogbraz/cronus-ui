import { MCP_EDITORS, parseList, writeMcpConfigs } from "@cronus-ui/ai-kit";
import { log } from "../utils.js";

export interface McpInitOptions {
  cwd: string;
  client?: string;
  force?: boolean;
}

/**
 * Write project-scoped MCP config files so Claude Code, Cursor, VS Code,
 * Codex, Grok, OpenCode, Gemini, and Zed can spawn `npx -y cronus-ui-mcp`.
 * Existing files are skipped unless `--force`.
 */
export function mcpInit(options: McpInitOptions): void {
  let clients: readonly (typeof MCP_EDITORS)[number][];
  try {
    clients = parseList(options.client, MCP_EDITORS, "MCP client");
  } catch (err) {
    log.err((err as Error).message);
    process.exitCode = 1;
    return;
  }

  if (clients.length === 0) {
    log.err('No MCP clients selected. Pass --client all (or a list), not "none".');
    process.exitCode = 1;
    return;
  }

  log.title("Wiring the Cronus UI MCP server");
  log.step(`Clients: ${clients.join(", ")}`);

  const { written, skipped } = writeMcpConfigs({
    targetDir: options.cwd,
    clients,
    force: options.force,
  });

  for (const path of written) log.ok(`Wrote ${path}`);
  if (skipped.length > 0) {
    log.step(`Skipped ${skipped.length} existing file(s) (pass --force to replace):`);
    for (const path of skipped) log.step(`  ${path}`);
  }

  if (written.length === 0 && skipped.length === 0) {
    log.title("Nothing to write.");
    return;
  }

  if (written.length === 0) {
    log.title("Nothing to do — MCP config is already in place.");
    return;
  }

  log.title(`Done — ${written.length} file(s) written.`);
  log.step("Restart the agent so it loads the new server. Write tools need a local project.");
}
