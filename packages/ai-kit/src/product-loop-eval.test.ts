import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Mechanical coverage of `docs/evals/agent-product-loop.md` (20 prompts).
 * Asserts the kit encodes the Expected action so a kit-following agent can
 * hit that column. Not a live Cursor / Claude session score.
 */

/** Same lookup as `templatesRoot` in ai-kit.ts (src vs dist). */
function templatesRoot(): string {
  const candidates = [join(HERE, "..", "templates"), join(HERE, "..", "..", "templates")];
  const found = candidates.find((p) => existsSync(join(p, "AGENTS.base.md")));
  if (!found) {
    throw new Error(
      `Could not locate @cronus-ui/ai-kit templates (looked in: ${candidates.join(", ")}).`,
    );
  }
  return found;
}

function mcpReadme(): string {
  const candidates = [
    join(HERE, "..", "..", "mcp", "README.md"),
    join(HERE, "..", "..", "..", "mcp", "README.md"),
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      `Could not locate packages/mcp/README.md (looked in: ${candidates.join(", ")}).`,
    );
  }
  return readFileSync(found, "utf8");
}

// Digest across Copilot / Gemini / Windsurf / CLAUDE.md / 10-cronus-ui.mdc
// (`--template saas`, `add-page`, `upgrade --all`, never `npx shadcn init`)
// lives in ai-kit.test.ts — this file maps prompts 1–20 onto the skills.
describe("product-loop kit coverage (not a live agent score)", () => {
  const root = templatesRoot();
  const compose = readFileSync(join(root, "claude", "skills", "compose", "SKILL.md"), "utf8");
  const uiAdd = readFileSync(join(root, "claude", "skills", "ui-add", "SKILL.md"), "utf8");
  const theme = readFileSync(join(root, "claude", "skills", "theme", "SKILL.md"), "utf8");
  const upgrade = readFileSync(join(root, "claude", "skills", "upgrade", "SKILL.md"), "utf8");
  const cursor = readFileSync(join(root, "cursor", "rules", "10-cronus-ui.mdc"), "utf8");
  const mcp = mcpReadme();

  describe("claude/skills/compose/SKILL.md", () => {
    it("#1 scaffold SaaS: create-cronus-app + --template saas", () => {
      expect(compose).toContain("create-cronus-app <name> --template saas");
    });

    it("#2 store template: --template store", () => {
      expect(compose).toContain("--template store");
    });

    it("#3 landing + sunset on the same scaffold command", () => {
      expect(compose).toContain("--template landing --theme sunset");
    });

    it("#4 CLI default is saas; pass --template saas as the canonical command", () => {
      expect(compose).toContain("pass `--template saas`");
      expect(compose).toContain("CLI default is `saas`");
      expect(compose).toContain("create-cronus-app <name> --template saas -y");
    });

    it("#5 --no-install on create-cronus-app; --skip-install on compose/add-page; do not mix", () => {
      expect(compose).toContain("create-cronus-app <name> --template saas --no-install");
      expect(compose).toContain("`--no-install` is a **create-cronus-app** flag");
      expect(compose).toContain("`cronus-ui compose` / `add` / `add-page` use `--skip-install`");
      expect(compose).toContain("Do not mix them.");
    });

    it("#6 add-page + /pricing + pricing block", () => {
      expect(compose).toContain("add-page --route /pricing");
      expect(compose).toContain("--blocks pricing");
    });

    it("#7 pricing,cta on add-page", () => {
      expect(compose).toContain("pricing,cta");
    });

    it("#8 split login: login=split and login--split", () => {
      expect(compose).toContain("login=split");
      expect(compose).toContain("login--split");
    });

    it("#9 faq as a block via add-page", () => {
      expect(compose).toContain("add-page --route /faq --blocks faq");
    });

    it("#10 settings page with account-security", () => {
      expect(compose).toContain("settings,account-security");
    });

    it("#14 refuse zinc-*; offer bg-surface-*", () => {
      expect(compose).toContain("zinc-*");
      expect(compose).toContain("bg-surface-*");
    });

    it("#15/#17 single primitive (dialog, button) defers to ui-add / cronus-ui add", () => {
      expect(compose).toContain("`button`");
      expect(compose).toContain("`dialog`");
      expect(compose).toContain("ui-add");
      expect(compose).toContain("npx cronus-ui add <slug>");
    });

    it("#18 hand-roll from Cronus primitives only if the registry has no match; no palette", () => {
      expect(compose).toContain("Hand-roll");
      expect(compose).toContain("no matching component or block");
      expect(compose).toContain("semantic tokens");
      expect(compose).toContain("bg-zinc-900");
    });

    it("#19 upgrade --all --dry-run then --all; never compose --overwrite as upgrade", () => {
      expect(compose).toContain("upgrade --all --dry-run");
      expect(compose).toContain("upgrade --all");
      expect(compose).toContain("Do NOT run `compose --overwrite` / `compose -o`");
      expect(compose).toContain('to "upgrade" an existing app');
    });

    it("#20 cronus-ui ai; never shadcn components.json / shadcn init", () => {
      expect(compose.includes("npx cronus-ui ai") || compose.includes("cronus-ui ai")).toBe(true);
      expect(compose).toContain("Never write a shadcn `components.json` or run `shadcn init`");
    });
  });

  describe("claude/skills/ui-add/SKILL.md", () => {
    it("#8 split login registry item login--split / login=split", () => {
      expect(uiAdd).toContain("login--split");
      expect(uiAdd).toContain("login=split");
    });

    it("#9 faq listed as a block", () => {
      expect(uiAdd).toContain("`faq`");
    });

    it("#10 account-security listed as a block", () => {
      expect(uiAdd).toContain("account-security");
      expect(uiAdd).toContain("`settings`");
    });

    it("#14 refuse zinc-*; offer bg-surface-* / setOverrides", () => {
      expect(uiAdd).toContain("zinc-*");
      expect(uiAdd).toContain("bg-surface-*");
      expect(uiAdd).toContain("setOverrides");
    });

    it("#15 add dialog via cronus-ui add / install_component", () => {
      expect(uiAdd).toContain("npx cronus-ui add");
      expect(uiAdd).toContain("`dialog`");
      expect(uiAdd).toContain("install_component");
    });

    it("#16 invoices data table: data-table + demo-saas + INVOICES", () => {
      expect(uiAdd).toContain("data-table");
      expect(uiAdd).toContain("demo-saas");
      expect(uiAdd).toContain("INVOICES");
      expect(uiAdd).toContain("npx cronus-ui add data-table demo-saas");
    });

    it("#17 add button (ui-add covers primitives)", () => {
      expect(uiAdd).toContain("`button`");
      expect(uiAdd).toContain("npx cronus-ui add <slug>");
    });

    it("#18 hand-roll from Cronus primitives + tokens; never a parallel kit", () => {
      expect(uiAdd).toContain("Cronus UI primitives");
      expect(uiAdd).toContain("same tokens");
      expect(uiAdd).toContain("shadcn add");
    });

    it("#19 upgrade --all --dry-run then --all", () => {
      expect(uiAdd).toContain("upgrade --all --dry-run");
      expect(uiAdd).toContain("upgrade --all");
      expect(uiAdd).toContain("3-way-merges generated compose pages");
    });
  });

  describe("claude/skills/theme/SKILL.md", () => {
    it("#11 theme set + emerald + dark", () => {
      expect(theme).toContain("theme set");
      expect(theme).toContain("emerald");
      expect(theme).toContain("--mode dark");
      expect(theme).toContain('setTheme("emerald")');
      expect(theme).toContain("setMode");
    });

    it("#12 theme add or MCP apply_theme", () => {
      expect(theme).toContain("theme add");
      expect(theme).toContain("apply_theme");
    });

    it("#13 setOverrides + radius", () => {
      expect(theme).toContain("setOverrides");
      expect(theme).toContain("radius");
    });

    it("#14 refuse zinc-*; offer bg-surface-* / setOverrides", () => {
      expect(theme).toContain("zinc-*");
      expect(theme).toContain("bg-surface-*");
      expect(theme).toContain("setOverrides");
    });

    it("looks vs themes: data-cronus-look, no theme set glass", () => {
      expect(theme).toContain("data-cronus-look");
      expect(theme).toContain("theme set glass");
      expect(theme).toContain("ButtonGlass");
      expect(theme).toContain("get_design_context");
    });
  });

  describe("claude/skills/upgrade/SKILL.md", () => {
    it("#19 upgrade --all --dry-run then --all; never compose --overwrite as upgrade", () => {
      expect(upgrade).toContain("npx cronus-ui diff");
      expect(upgrade).toContain("upgrade --all --dry-run");
      expect(upgrade).toContain("upgrade --all");
      expect(upgrade).toContain("compose --overwrite");
      expect(upgrade).toContain("upgrade_components");
      expect(upgrade).toContain('"dryRun": true');
      expect(upgrade).toContain(".cronus-ui/base");
      expect(upgrade).toContain("CRONUS-UPGRADE.md");
      expect(upgrade).toContain("git merge-file --diff3");
      expect(upgrade).not.toContain("npx shadcn init");
    });
  });

  describe("cursor/rules/10-cronus-ui.mdc", () => {
    it("#14 refuse zinc-*; offer bg-surface-* / setOverrides", () => {
      expect(cursor).toContain("zinc-*");
      expect(cursor).toContain("bg-surface-*");
      expect(cursor.includes("bg-surface") || cursor.includes("setOverrides")).toBe(true);
    });
  });

  describe("packages/mcp/README.md write tools", () => {
    it("#1 greenfield remains create-cronus-app --template saas (MCP does not scaffold)", () => {
      expect(mcp).toContain("create-cronus-app");
      expect(mcp).toContain("--template saas");
      expect(mcp).toMatch(/does \*\*not\*\* scaffold a new app/);
    });

    it("#5 skipInstall on compose_app / add_page (not --no-install)", () => {
      expect(mcp).toContain("skipInstall");
      expect(mcp).toContain("compose_app");
      expect(mcp).toContain("add_page");
    });

    it("#6/#7 add_page /pricing + pricing,cta", () => {
      expect(mcp).toContain("add_page");
      expect(mcp).toContain('"/pricing"');
      expect(mcp).toContain("pricing,cta");
    });

    it("#8 compose_app variant login=split", () => {
      expect(mcp).toContain("login=split");
    });

    it("#11 set_theme (preset + mode)", () => {
      expect(mcp).toContain("set_theme");
      expect(mcp).toContain('"mode": "dark"');
    });

    it("#12 apply_theme for Create Studio / theme add", () => {
      expect(mcp).toContain("apply_theme");
      expect(mcp).toContain("theme add");
    });

    it("#15/#17 install_component for a single primitive", () => {
      expect(mcp).toContain("install_component");
    });

    it("#19 upgrade_components dry-run then write", () => {
      expect(mcp).toContain("upgrade_components");
      expect(mcp).toContain('"dryRun": true');
      expect(mcp).toContain("upgrade --all --dry-run");
      expect(mcp).toContain("composed pages");
      expect(mcp).toContain("manifest");
    });
  });
});
