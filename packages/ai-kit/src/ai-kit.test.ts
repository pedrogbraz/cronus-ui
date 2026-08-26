import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ASSISTANTS, parseList, SKILLS, writeAiKit } from "./ai-kit.js";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Same lookup as `templatesRoot` in ai-kit.ts (src vs dist). */
function templatesRoot(): string {
  const candidates = [join(HERE, "..", "templates"), join(HERE, "..", "..", "templates")];
  const found = candidates.find((p) => existsSync(join(p, "AGENTS.base.md")));
  if (!found) {
    throw new Error(
      `Could not locate @kronus-ui/ai-kit templates (looked in: ${candidates.join(", ")}).`,
    );
  }
  return found;
}

describe("writeAiKit", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "ai-kit-"));
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("writes the full kit for all assistants + the standard doctrine", () => {
    const { written } = writeAiKit({ targetDir: dir, name: "acme" });
    expect(existsSync(join(dir, "AGENTS.md"))).toBe(true);
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(join(dir, ".mcp.json"))).toBe(true);
    expect(existsSync(join(dir, ".claude/settings.json"))).toBe(true);
    expect(existsSync(join(dir, ".claude/agents/code-reviewer.md"))).toBe(true);
    for (const s of SKILLS) {
      expect(existsSync(join(dir, `.claude/skills/${s}/SKILL.md`))).toBe(true);
    }
    expect(existsSync(join(dir, ".cursor/rules/00-doctrine.mdc"))).toBe(true);
    expect(existsSync(join(dir, ".cursor/rules/10-kronus-ui.mdc"))).toBe(true);
    expect(existsSync(join(dir, ".github/copilot-instructions.md"))).toBe(true);
    expect(existsSync(join(dir, ".windsurf/rules/doctrine.md"))).toBe(true);
    expect(existsSync(join(dir, "GEMINI.md"))).toBe(true);
    expect(written.length).toBeGreaterThan(10);
  });

  it("substitutes __APP_NAME__ and leaves no token behind", () => {
    writeAiKit({ targetDir: dir, name: "acme" });
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    expect(agents).toContain("acme");
    expect(agents).not.toContain("__APP_NAME__");
  });

  it.each([
    ["fintech", "Fintech / payments preset"],
    ["saas", "SaaS preset"],
    ["oss", "Open-source preset"],
    ["agency", "Agency / client-work preset"],
  ] as const)("appends the %s preset addendum to AGENTS.md", (preset, heading) => {
    writeAiKit({ targetDir: dir, name: "acme", preset });
    expect(readFileSync(join(dir, "AGENTS.md"), "utf8")).toContain(heading);
  });

  it("standard preset is the base doctrine only (no preset addendum)", () => {
    writeAiKit({ targetDir: dir, name: "acme", preset: "standard" });
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    expect(agents).not.toContain("Fintech / payments preset");
    expect(agents).not.toContain("SaaS preset");
  });

  it("respects the assistants selection (claude only → no cursor/github/windsurf/gemini)", () => {
    writeAiKit({ targetDir: dir, name: "acme", assistants: ["claude"] });
    expect(existsSync(join(dir, ".claude/settings.json"))).toBe(true);
    expect(existsSync(join(dir, ".cursor"))).toBe(false);
    expect(existsSync(join(dir, ".github/copilot-instructions.md"))).toBe(false);
    expect(existsSync(join(dir, ".windsurf"))).toBe(false);
    expect(existsSync(join(dir, "GEMINI.md"))).toBe(false);
  });

  it("includes only the selected skills", () => {
    writeAiKit({ targetDir: dir, name: "acme", assistants: ["claude"], skills: ["ui-add"] });
    expect(existsSync(join(dir, ".claude/skills/ui-add/SKILL.md"))).toBe(true);
    expect(existsSync(join(dir, ".claude/skills/theme/SKILL.md"))).toBe(false);
  });

  it("preset=none skips the doctrine + its references but keeps the design-system rule", () => {
    writeAiKit({ targetDir: dir, name: "acme", preset: "none" });
    expect(existsSync(join(dir, "AGENTS.md"))).toBe(false);
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(false);
    expect(existsSync(join(dir, ".claude/agents/code-reviewer.md"))).toBe(false);
    expect(existsSync(join(dir, ".cursor/rules/00-doctrine.mdc"))).toBe(false);
    expect(existsSync(join(dir, ".cursor/rules/10-kronus-ui.mdc"))).toBe(true);
  });

  it("can emit generic assistant tooling without Kronus UI rules or skills", () => {
    writeAiKit({
      targetDir: dir,
      name: "acme",
      assistants: ["claude", "cursor", "copilot"],
      includeKronusUi: false,
    });

    expect(existsSync(join(dir, "AGENTS.md"))).toBe(true);
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(join(dir, ".mcp.json"))).toBe(false);
    expect(existsSync(join(dir, ".claude/settings.json"))).toBe(true);
    expect(existsSync(join(dir, ".claude/agents/code-reviewer.md"))).toBe(true);
    expect(existsSync(join(dir, ".claude/skills/code-review/SKILL.md"))).toBe(true);
    expect(existsSync(join(dir, ".claude/skills/ui-add/SKILL.md"))).toBe(false);
    expect(existsSync(join(dir, ".claude/skills/theme/SKILL.md"))).toBe(false);
    expect(existsSync(join(dir, ".claude/skills/compose/SKILL.md"))).toBe(false);
    expect(existsSync(join(dir, ".cursor/rules/00-doctrine.mdc"))).toBe(true);
    expect(existsSync(join(dir, ".cursor/rules/10-kronus-ui.mdc"))).toBe(false);
    expect(existsSync(join(dir, ".github/copilot-instructions.md"))).toBe(true);

    const claude = readFileSync(join(dir, "CLAUDE.md"), "utf8");
    expect(claude).toContain("If `.mcp.json` registers");
  });

  it("omits the compose skill when includeKronusUi is false (with ui-add and theme)", () => {
    writeAiKit({
      targetDir: dir,
      name: "acme",
      assistants: ["claude"],
      includeKronusUi: false,
    });
    expect(existsSync(join(dir, ".claude/skills/compose/SKILL.md"))).toBe(false);
    expect(existsSync(join(dir, ".claude/skills/ui-add/SKILL.md"))).toBe(false);
    expect(existsSync(join(dir, ".claude/skills/theme/SKILL.md"))).toBe(false);
    expect(existsSync(join(dir, ".claude/skills/code-review/SKILL.md"))).toBe(true);
  });

  it("decouples the kronus-ui MCP config from the Claude assistant", () => {
    writeAiKit({
      targetDir: dir,
      name: "acme",
      assistants: ["cursor"],
      kronusUiMcp: true,
    });

    expect(existsSync(join(dir, ".mcp.json"))).toBe(true);
    expect(existsSync(join(dir, ".cursor/rules/10-kronus-ui.mdc"))).toBe(true);
    expect(existsSync(join(dir, ".claude/settings.json"))).toBe(false);
  });

  it("is idempotent: a second run writes nothing and skips the existing files", () => {
    writeAiKit({ targetDir: dir, name: "acme" });
    const second = writeAiKit({ targetDir: dir, name: "acme" });
    expect(second.written).toEqual([]);
    expect(second.skipped.length).toBeGreaterThan(10);
  });
});

describe("parseList", () => {
  it("expands undefined / empty / 'all' to the full set", () => {
    expect(parseList(undefined, ASSISTANTS, "assistant")).toEqual([...ASSISTANTS]);
    expect(parseList("all", ASSISTANTS, "assistant")).toEqual([...ASSISTANTS]);
    expect(parseList("", ASSISTANTS, "assistant")).toEqual([...ASSISTANTS]);
  });

  it("maps 'none' to an empty list", () => {
    expect(parseList("none", ASSISTANTS, "assistant")).toEqual([]);
  });

  it("parses a comma list and trims whitespace", () => {
    expect(parseList("claude, cursor", ASSISTANTS, "assistant")).toEqual(["claude", "cursor"]);
  });

  it("throws on an unknown token", () => {
    expect(() => parseList("notepad", ASSISTANTS, "assistant")).toThrow(/Unknown assistant/);
  });
});

describe("Kronus skill templates (product-loop holes)", () => {
  const root = templatesRoot();
  const compose = readFileSync(join(root, "claude", "skills", "compose", "SKILL.md"), "utf8");
  const uiAdd = readFileSync(join(root, "claude", "skills", "ui-add", "SKILL.md"), "utf8");
  const cursor = readFileSync(join(root, "cursor", "rules", "10-kronus-ui.mdc"), "utf8");

  it("compose names the saas template, --no-install, --theme, AI kit, and upgrade --all", () => {
    expect(compose).toContain("--template saas");
    expect(compose).toContain("--no-install");
    expect(compose).toContain("--theme");
    expect(compose.includes("npx kronus-ui ai") || compose.includes("kronus-ui ai")).toBe(true);
    expect(compose).toContain("upgrade --all");
  });

  it("ui-add points invoices at demo-saas INVOICES and uses upgrade", () => {
    expect(uiAdd).toContain("demo-saas");
    expect(uiAdd).toContain("INVOICES");
    expect(uiAdd).toContain("upgrade");
    expect(uiAdd).toContain("account-security");
  });

  it("compose add-page stacks settings with account-security", () => {
    expect(compose).toContain("settings,account-security");
  });

  it("cursor rule offers bg-surface or setOverrides", () => {
    expect(cursor.includes("bg-surface") || cursor.includes("setOverrides")).toBe(true);
  });

  it("cursor Kronus rule is always applied so greenfield chats see the loop", () => {
    expect(cursor).toMatch(/alwaysApply:\s*true/);
  });

  it.each([
    "github/copilot-instructions.md",
    "gemini/GEMINI.md",
    "windsurf/rules/doctrine.md",
    "CLAUDE.md",
    "cursor/rules/10-kronus-ui.mdc",
  ])("%s encodes the product loop and never npx shadcn init", (rel) => {
    const body = readFileSync(join(root, ...rel.split("/")), "utf8");
    expect(body).toContain("--template saas");
    expect(body).toContain("add-page");
    expect(body).toContain("upgrade --all");
    expect(body).not.toContain("npx shadcn init");
  });

  it.each([
    "ui-add",
    "theme",
    "compose",
  ] as const)("%s does not contain muted-foreground or shadcn init", (skill) => {
    const body = readFileSync(join(root, "claude", "skills", skill, "SKILL.md"), "utf8");
    expect(body).not.toContain("text-muted-foreground");
    expect(body).not.toContain("npx shadcn init");
  });
});
