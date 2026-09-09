import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { RegistryClient, resolveRegistrySource, SourceRegistryLoader } from "./registry.js";
import { createServer, SERVER_NAME } from "./server.js";
import { SERVER_VERSION } from "./version.js";

/** Canonical public Streamable HTTP endpoint (read-only catalog). */
export const HOSTED_MCP_URL = "https://aicronus.com/mcp";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version, MCP-Session-Id",
  "Access-Control-Max-Age": "86400",
};

export interface HandleMcpHttpOptions {
  /** Injected registry (tests). Defaults to the env-resolved public registry. */
  client?: RegistryClient;
  /** Registry source label shown on resources. */
  source?: string;
}

let cached: { source: string; client: RegistryClient } | undefined;

function defaultRegistry(): { source: string; client: RegistryClient } {
  const source = resolveRegistrySource();
  if (cached?.source === source) return cached;
  cached = { source, client: new RegistryClient(new SourceRegistryLoader(source)) };
  return cached;
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** CORS preflight for browser MCP clients (Lovable, Bolt, v0, Base44). */
export function handleMcpOptions(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Human-readable discovery document for a plain GET (browser, curl). MCP
 * clients that open the Streamable HTTP GET SSE stream send `text/event-stream`
 * in Accept and go through {@link handleMcpHttpRequest} instead.
 */
export function mcpDiscoveryBody(): Record<string, unknown> {
  return {
    name: SERVER_NAME,
    version: SERVER_VERSION,
    transport: "streamable-http",
    url: HOSTED_MCP_URL,
    docs: "https://aicronus.com/docs/mcp",
    tools:
      "read-only catalog (list, match, get source). Write tools live on stdio: npx -y cronus-ui-mcp",
  };
}

/**
 * The Streamable HTTP spec requires Accept to list both JSON and SSE. Cloud
 * builders often send only `application/json`. Rewrite so those clients are
 * not rejected with 406.
 */
function normalizeRequest(request: Request): Request {
  const accept = request.headers.get("accept") ?? "";
  const contentType = request.headers.get("content-type") ?? "";
  const acceptOk = accept.includes("application/json") && accept.includes("text/event-stream");
  const contentOk = request.method !== "POST" || contentType.includes("application/json");
  if (acceptOk && contentOk) return request;

  const headers = new Headers(request.headers);
  if (!acceptOk) headers.set("Accept", "application/json, text/event-stream");
  if (!contentOk) headers.set("Content-Type", "application/json");
  return new Request(request, { headers });
}

/**
 * Handle one Streamable HTTP MCP request (stateless, JSON responses).
 *
 * Write tools are omitted: this process has no consumer project to mutate.
 * Each request builds a fresh server + transport so the handler is safe on
 * a serverless runtime with no sticky sessions.
 */
export async function handleMcpHttpRequest(
  request: Request,
  options: HandleMcpHttpOptions = {},
): Promise<Response> {
  if (request.method === "OPTIONS") return handleMcpOptions();

  if (request.method === "GET") {
    const accept = request.headers.get("accept") ?? "";
    if (!accept.includes("text/event-stream")) {
      return new Response(JSON.stringify(mcpDiscoveryBody(), null, 2), {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" },
      });
    }
  }

  const { source, client } = options.client
    ? { source: options.source ?? "injected", client: options.client }
    : defaultRegistry();

  const server = createServer(client, source, {}, { writes: false });
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  return withCors(await transport.handleRequest(normalizeRequest(request)));
}
