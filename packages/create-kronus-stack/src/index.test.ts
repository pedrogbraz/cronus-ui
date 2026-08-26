import { readFileSync } from "node:fs";
import { CLI_FLAGS } from "@kronus-ui/stack";
import { describe, expect, it } from "vitest";
import { parseCli, stackFlagHelpLines } from "./index.js";
import { CREATE_STACK_VERSION } from "./version.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

describe("create-kronus-stack CLI", () => {
  it("keeps the runtime version aligned with package.json", () => {
    expect(CREATE_STACK_VERSION).toBe(pkg.version);
  });

  it("documents every Stack Builder flag accepted by parseCli", () => {
    const help = stackFlagHelpLines();
    for (const { flag } of CLI_FLAGS) {
      expect(help).toContain(`--${flag} <`);
    }
  });

  it("parses late-added stack flags", () => {
    const parsed = parseCli([
      "my-app",
      "--runtime",
      "cloudflare",
      "--api",
      "trpc",
      "--db-setup",
      "neon",
      "--auth",
      "better-auth",
      "--payments",
      "stripe",
      "--deploy",
      "vercel",
      "--addons",
      "biome,husky",
    ]);
    expect(parsed.values.runtime).toBe("cloudflare");
    expect(parsed.values.api).toBe("trpc");
    expect(parsed.values["db-setup"]).toBe("neon");
    expect(parsed.values.auth).toBe("better-auth");
    expect(parsed.values.payments).toBe("stripe");
    expect(parsed.values.deploy).toBe("vercel");
    expect(parsed.values.addons).toBe("biome,husky");
  });

  it("accepts none for multi-select stack flags", () => {
    const parsed = parseCli(["my-app", "--ai", "none"]);
    expect(parsed.values.ai).toBe("none");
  });
});
