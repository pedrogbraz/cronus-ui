#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PINNED_CLI } from "./cli.js";
import { RegistryClient, resolveRegistrySource, SourceRegistryLoader } from "./registry.js";
import { createServer } from "./server.js";
import { SERVER_VERSION } from "./version.js";

const HELP = `cronus-ui-mcp — expose the Cronus UI registry through MCP.

Usage
  cronus-ui-mcp [options]

Options
  -h, --help     Show this help
  -v, --version  Show the version

Environment
  CRONUS_UI_REGISTRY         Override the registry source
  CRONUS_MCP_CLI_CMD         Override the CLI launcher used by the write tools
                            (default: bunx --bun ${PINNED_CLI}, then npx)
  CRONUS_MCP_CLI_TIMEOUT_MS  Per-run CLI timeout for the write tools (default: 120000)
`;

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(HELP);
    return;
  }
  if (args.includes("--version") || args.includes("-v")) {
    process.stdout.write(`${SERVER_VERSION}\n`);
    return;
  }

  const source = resolveRegistrySource();
  const client = new RegistryClient(new SourceRegistryLoader(source));
  const server = createServer(client, source);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stdout is reserved for the MCP protocol — diagnostics go to stderr only.
  process.stderr.write(`cronus-ui-mcp ${SERVER_VERSION} ready (registry: ${source})\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`cronus-ui-mcp failed to start: ${message}\n`);
  process.exitCode = 1;
});
