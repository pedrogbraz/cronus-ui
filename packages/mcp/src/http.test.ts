import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import {
  HOSTED_MCP_URL,
  handleMcpHttpRequest,
  handleMcpOptions,
  type mcpDiscoveryBody,
} from "./http.js";
import { RegistryClient, type RegistryIndex, type RegistryLoader } from "./registry.js";
import { createServer, READ_TOOL_NAMES, WRITE_TOOL_NAMES } from "./server.js";

const INDEX: RegistryIndex = [
  { name: "cn", type: "registry:lib", dependencies: ["clsx@^2.1.1"], registryDependencies: [] },
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot@^1.2.3"],
    registryDependencies: ["cn"],
  },
];

function fixtureLoader(): RegistryLoader {
  return {
    async readJson<T>(file: string): Promise<T> {
      if (file === "index.json") return INDEX as unknown as T;
      throw new Error(`registry fetch failed (404): ${file}`);
    },
  };
}

function jsonRpc(
  method: string,
  params: Record<string, unknown> = {},
  id = 1,
): Record<string, unknown> {
  return { jsonrpc: "2.0", id, method, params };
}

function post(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://aicronus.com/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

async function rpc(
  client: RegistryClient,
  body: unknown,
  headers?: Record<string, string>,
): Promise<{ status: number; json: Record<string, unknown>; headers: Headers }> {
  const response = await handleMcpHttpRequest(post(body, headers), {
    client,
    source: "fixture://registry",
  });
  return {
    status: response.status,
    json: (await response.json()) as Record<string, unknown>,
    headers: response.headers,
  };
}

describe("hosted Streamable HTTP MCP", () => {
  const client = new RegistryClient(fixtureLoader());

  it("answers OPTIONS with CORS for browser clients", () => {
    const response = handleMcpOptions();
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("returns a discovery document on a plain GET", async () => {
    const response = await handleMcpHttpRequest(new Request("https://aicronus.com/mcp"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    const body = (await response.json()) as ReturnType<typeof mcpDiscoveryBody>;
    expect(body.name).toBe("cronus-ui");
    expect(body.transport).toBe("streamable-http");
    expect(body.url).toBe(HOSTED_MCP_URL);
    expect(String(body.tools)).toContain("read-only");
  });

  it("initializes and lists only the read tools", async () => {
    const init = await rpc(
      client,
      jsonRpc("initialize", {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "http-test", version: "0.0.0" },
      }),
    );
    expect(init.status).toBe(200);
    const result = init.json.result as { serverInfo: { name: string }; capabilities: unknown };
    expect(result.serverInfo.name).toBe("cronus-ui");
    expect(init.headers.get("Access-Control-Allow-Origin")).toBe("*");

    const listed = await rpc(client, jsonRpc("tools/list", {}, 2));
    expect(listed.status).toBe(200);
    const tools = (listed.json.result as { tools: { name: string }[] }).tools.map(
      (tool) => tool.name,
    );
    expect(tools.sort()).toEqual([...READ_TOOL_NAMES].sort());
    for (const name of WRITE_TOOL_NAMES) expect(tools).not.toContain(name);
  });

  it("answers a catalog read without a prior session", async () => {
    const listed = await rpc(
      client,
      jsonRpc("tools/call", { name: "list_components", arguments: {} }),
    );
    expect(listed.status).toBe(200);
    const payload = listed.json.result as { content: { type: string; text: string }[] };
    const body = JSON.parse(payload.content[0]?.text ?? "") as {
      count: number;
      items: { name: string }[];
    };
    expect(body.count).toBe(1);
    expect(body.items[0]?.name).toBe("button");
  });

  it("normalizes a JSON-only Accept header so cloud builders are not 406'd", async () => {
    const response = await handleMcpHttpRequest(
      post(
        jsonRpc("initialize", {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "lovable", version: "0.0.0" },
        }),
        { Accept: "application/json" },
      ),
      { client, source: "fixture://registry" },
    );
    expect(response.status).toBe(200);
    const json = (await response.json()) as { result?: { serverInfo?: { name: string } } };
    expect(json.result?.serverInfo?.name).toBe("cronus-ui");
  });
});

describe("createServer({ writes: false })", () => {
  it("registers only the read tools over the in-memory transport", async () => {
    const server = createServer(
      new RegistryClient(fixtureLoader()),
      "fixture://registry",
      {},
      { writes: false },
    );
    const mcp = new Client({ name: "smoke", version: "0.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(serverTransport), mcp.connect(clientTransport)]);
    const { tools } = await mcp.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual([...READ_TOOL_NAMES].sort());
    await mcp.close();
  });
});
