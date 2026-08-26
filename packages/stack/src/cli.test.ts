import { describe, expect, it } from "vitest";
import { catalog } from "./catalog.js";
import { resolveStackFlags } from "./cli.js";
import { defaultSelection } from "./engine.js";
import { generateCommand } from "./kickoff.js";

describe("resolveStackFlags", () => {
  it("maps short CLI values back to catalog option ids", () => {
    const config = resolveStackFlags(
      {
        web: "next",
        database: "postgres",
        orm: "drizzle",
        "db-setup": "neon",
        ui: "kronus",
        ai: "claude-code,cursor",
        mcp: "kronus-ui,github",
        "no-install": true,
      },
      { catalog },
    );

    expect(config.web).toBe("web-next");
    expect(config.database).toBe("db-postgres");
    expect(config.orm).toBe("orm-drizzle");
    expect(config.dbSetup).toBe("dbsetup-neon");
    expect(config.ui).toBe("ui-kronus");
    expect(config.assistants).toEqual(["ai-claude-code", "ai-cursor"]);
    expect(config.mcp).toEqual(["mcp-kronus-ui", "mcp-github"]);
    expect(config.install).toBe(false);
  });

  it("throws a useful error for unknown flag values", () => {
    expect(() => resolveStackFlags({ web: "wordpress" }, { catalog })).toThrow(/Unknown --web/);
  });

  it("maps the literal none to an empty multi-selection", () => {
    const config = resolveStackFlags({ ai: "none" }, { catalog });
    expect(config.assistants).toEqual([]);
  });

  it("round-trips an intentionally empty defaulted multi-selection", () => {
    const selected = { ...defaultSelection(catalog), assistants: [] };
    const command = generateCommand(selected, "acme");

    expect(command).toContain("--ai none");

    const config = resolveStackFlags({ ai: "none" }, { catalog });
    expect(config.assistants).toEqual(selected.assistants);
  });
});
