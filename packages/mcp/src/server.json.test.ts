import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SERVER_VERSION } from "./version.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(HERE, "..");

describe("official MCP registry server.json", () => {
  const pkg = JSON.parse(readFileSync(join(PKG_ROOT, "package.json"), "utf8")) as {
    name: string;
    version: string;
    mcpName?: string;
  };
  const server = JSON.parse(readFileSync(join(PKG_ROOT, "server.json"), "utf8")) as {
    name: string;
    description: string;
    version: string;
    packages: { identifier: string; version: string; registryType: string }[];
    remotes: { type: string; url: string }[];
  };

  it("ties mcpName, package version, and server.json together", () => {
    expect(pkg.mcpName).toBe("io.github.pedrogbraz/cronus-ui");
    expect(server.name).toBe(pkg.mcpName);
    expect(server.version).toBe(pkg.version);
    expect(server.version).toBe(SERVER_VERSION);
    expect(server.packages[0]?.identifier).toBe(pkg.name);
    expect(server.packages[0]?.version).toBe(pkg.version);
    expect(server.packages[0]?.registryType).toBe("npm");
  });

  it("stays within the official registry description limit and lists both transports", () => {
    expect(server.description.length).toBeGreaterThan(0);
    expect(server.description.length).toBeLessThanOrEqual(100);
    expect(server.remotes[0]).toEqual({
      type: "streamable-http",
      url: "https://aicronus.com/mcp",
    });
  });
});
