import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  CLI_VERSION,
  CONFIG_FILE,
  DEFAULT_CONFIG,
  DEFAULT_REGISTRY,
  readConfig,
} from "./config.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

describe("release-pinned registry defaults", () => {
  it("keeps the CLI runtime version aligned with package.json", () => {
    expect(CLI_VERSION).toBe(pkg.version);
  });

  it("uses the matching release tag instead of mutable main", () => {
    expect(DEFAULT_REGISTRY).toBe(
      `https://raw.githubusercontent.com/pedrogbraz/kronus-ui/v${pkg.version}/registry`,
    );
    expect(DEFAULT_REGISTRY).not.toContain("/main/registry");
    expect(DEFAULT_CONFIG.registry).toBe(DEFAULT_REGISTRY);
  });
});

describe("config defaults cover blocks", () => {
  it("ships a blocks alias and path in DEFAULT_CONFIG", () => {
    expect(DEFAULT_CONFIG.aliases.blocks).toBe("@/components/blocks");
    expect(DEFAULT_CONFIG.paths.blocks).toBe("components/blocks");
  });
});

describe("readConfig (backward-compatible merge)", () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "kronus-ui-cfg-"));
  });

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  it("falls back to the blocks defaults for a config written before blocks existed", async () => {
    // A pre-blocks kronus-ui.json — only ui/lib aliases + paths.
    writeFileSync(
      join(cwd, CONFIG_FILE),
      JSON.stringify({
        aliases: { ui: "@/components/ui", lib: "@/lib" },
        paths: { ui: "components/ui", lib: "lib" },
        registry: "https://example.test/registry",
      }),
      "utf8",
    );

    const config = await readConfig(cwd);

    expect(config.aliases.blocks).toBe(DEFAULT_CONFIG.aliases.blocks);
    expect(config.paths.blocks).toBe(DEFAULT_CONFIG.paths.blocks);
    // Existing fields are preserved, exactly like ui/lib are merged today.
    expect(config.aliases.ui).toBe("@/components/ui");
    expect(config.paths.lib).toBe("lib");
    expect(config.registry).toBe("https://example.test/registry");
  });
});
