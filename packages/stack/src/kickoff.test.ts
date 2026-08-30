import { describe, expect, it } from "vitest";
import { catalog } from "./catalog.js";
import { defaultSelection } from "./engine.js";
import { generateCommand, generateKickoff, generateStackJson } from "./kickoff.js";

/**
 * The Stack Builder's payoff is a KICKOFF brief that encodes both the tech stack
 * AND the project's conventions, so generated code stays consistent. These lock
 * the convention wiring (KICKOFF section, CLI flags, stack.json) in place.
 */
describe("kickoff — conventions & standards", () => {
  const config = defaultSelection(catalog);

  it("KICKOFF.md carries a Conventions & standards section built from the defaults", () => {
    const md = generateKickoff(config, "acme", catalog);
    expect(md).toContain("## Conventions & standards");
    expect(md).toContain("kebab-case");
    expect(md).toContain("under `src/`");
    expect(md).toContain("`@/…`");
    expect(md).toContain("Conventional Commits");
    expect(md).toContain("strict mode");
  });

  it("is fully out of beta (no BETA marker in the brief)", () => {
    const md = generateKickoff(config, "acme", catalog);
    expect(md).not.toContain("BETA");
    expect(md).not.toContain("(Beta)");
  });

  it("reflects a changed convention in the brief", () => {
    const snake = { ...config, naming: "naming-snake", structure: "structure-root" };
    const md = generateKickoff(snake, "acme", catalog);
    expect(md).toContain("snake_case");
    expect(md).toContain("no `src/` directory");
    expect(md).not.toContain("kebab-case");
  });

  it("the scaffold command carries the convention flags", () => {
    const cmd = generateCommand(config, "acme");
    expect(cmd).toContain("--naming kebab");
    expect(cmd).toContain("--structure src");
    expect(cmd).toContain("--import-alias alias");
    expect(cmd).toContain("--commits conventional");
    expect(cmd).toContain("--ts strict");
  });

  it("stack.json snapshots the convention choices", () => {
    const json = JSON.parse(generateStackJson(config, "acme")) as {
      stack: Record<string, unknown>;
    };
    expect(json.stack.naming).toBe("naming-kebab");
    expect(json.stack.structure).toBe("structure-src");
    expect(json.stack.importAlias).toBe("import-alias");
    expect(json.stack.commitStyle).toBe("commit-conventional");
    expect(json.stack.tsStrict).toBe("ts-strict");
  });

  it("KICKOFF.md repo map and commands match the generated default scaffold", () => {
    const md = generateKickoff(config, "acme", catalog);
    expect(md).toContain("  package.json     # scripts and selected dependencies");
    expect(md).toContain("  src/app/        # Next.js App Router starter");
    expect(md).toContain("  cronus-ui.json    # Cronus UI registry paths and pinned registry URL");
    expect(md).toContain("bun install");
    expect(md).toContain("bun dev");
    expect(md).toContain("bun typecheck");
    expect(md).toContain("bun build");
    expect(md).not.toContain("apps/web/");
    expect(md).not.toContain("bun test");
  });

  it("does not require lint/format in the DoD unless lint tooling is selected", () => {
    const withoutBiome = { ...config, addons: [] };
    const md = generateKickoff(withoutBiome, "acme", catalog);
    expect(md).not.toContain("Lint/format pass.");
  });

  it("KICKOFF.md reflects root app structure when selected", () => {
    const rootStructure = { ...config, structure: "structure-root" };
    const md = generateKickoff(rootStructure, "acme", catalog);
    expect(md).toContain("  app/        # Next.js App Router starter");
    expect(md).not.toContain("  src/app/        # Next.js App Router starter");
  });

  it("lists selected AI Kit skills in the brief", () => {
    const md = generateKickoff(
      { ...config, skills: ["skill-ui-add", "skill-upgrade"] },
      "acme",
      catalog,
    );
    expect(md).toContain("ui-add");
    expect(md).toContain("upgrade");
    expect(md).not.toContain("skill-frontend");
    expect(md).not.toContain("frontend & component");
  });
});
