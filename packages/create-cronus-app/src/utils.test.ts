import { describe, expect, it } from "vitest";
import { HELP, parseCli } from "./index.js";
import {
  COMPOSED_TEMPLATES,
  DEFAULT_TEMPLATE,
  dirNameFromProjectName,
  isComposedTemplate,
  isGoldPathTemplate,
  isValidProjectName,
  outroLines,
  TEMPLATE_HINTS,
  TEMPLATES,
  THEME_HINTS,
  templateBaseDir,
} from "./utils.js";

describe("isValidProjectName", () => {
  it("accepts simple lowercase names", () => {
    expect(isValidProjectName("my-app")).toBe(true);
    expect(isValidProjectName("my_app.v2")).toBe(true);
  });

  it("accepts scoped names", () => {
    expect(isValidProjectName("@acme/widget")).toBe(true);
  });

  it("rejects empty, uppercase, leading-dot, and space-containing names", () => {
    expect(isValidProjectName("")).toBe(false);
    expect(isValidProjectName("MyApp")).toBe(false);
    expect(isValidProjectName(".hidden")).toBe(false);
    expect(isValidProjectName("my app")).toBe(false);
    expect(isValidProjectName("a/b/c")).toBe(false);
  });
});

describe("templates", () => {
  it("includes the composed templates in the picker set", () => {
    expect(TEMPLATES).toContain("store");
    expect(TEMPLATES).toContain("landing");
    expect(TEMPLATES).toContain("saas");
    expect(TEMPLATES).toContain("admin");
    expect(TEMPLATES).toContain("docs");
    // The bundled-dir templates stay listed too.
    expect(TEMPLATES).toContain("default");
    expect(TEMPLATES).toContain("dashboard");
    expect(TEMPLATES).toContain("marketing");
  });

  it("has a one-line hint for every template", () => {
    for (const t of TEMPLATES) {
      expect(TEMPLATE_HINTS[t], t).toBeTruthy();
    }
  });

  it("keeps DEFAULT_TEMPLATE as default (saas is the documented gold path, not the CLI default)", () => {
    expect(DEFAULT_TEMPLATE).toBe("default");
  });

  it("positions saas as the recommended full-product template", () => {
    expect(TEMPLATE_HINTS.saas).toMatch(/recommended for a full product/);
  });

  it("describes the neutral theme as docs-site chrome, achromatic", () => {
    expect(THEME_HINTS.neutral).toMatch(/docs-site chrome/);
    expect(THEME_HINTS.neutral).toMatch(/achromatic/);
    expect(THEME_HINTS.neutral).toMatch(/black & white/);
  });

  it("classifies store/landing/saas and landing-* flavors as composed templates", () => {
    expect(isComposedTemplate("store")).toBe(true);
    expect(isComposedTemplate("landing")).toBe(true);
    expect(isComposedTemplate("saas")).toBe(true);
    expect(isComposedTemplate("admin")).toBe(true);
    expect(isComposedTemplate("docs")).toBe(true);
    expect(isComposedTemplate("landing-studio")).toBe(true);
    expect(isComposedTemplate("landing-glass")).toBe(true);
    expect(isComposedTemplate("mail")).toBe(true);
    expect(isComposedTemplate("chat")).toBe(true);
    expect(isComposedTemplate("finance")).toBe(true);
    expect(isComposedTemplate("default")).toBe(false);
    expect(isComposedTemplate("dashboard")).toBe(false);
    expect(isComposedTemplate("marketing")).toBe(false);
    expect(Object.keys(COMPOSED_TEMPLATES).sort()).toEqual(
      [
        "admin",
        "docs",
        "landing",
        "landing-agency",
        "landing-agents",
        "landing-broadcast",
        "landing-care",
        "landing-coverage",
        "landing-docs",
        "landing-glass",
        "landing-ops",
        "landing-premium",
        "landing-secure",
        "landing-shop",
        "landing-studio",
        "chat",
        "finance",
        "mail",
        "saas",
        "store",
      ].sort(),
    );
  });

  it("classifies only saas and admin as gold-path templates", () => {
    expect(isGoldPathTemplate("saas")).toBe(true);
    expect(isGoldPathTemplate("admin")).toBe(true);
    expect(isGoldPathTemplate("store")).toBe(false);
    expect(isGoldPathTemplate("landing")).toBe(false);
    expect(isGoldPathTemplate("default")).toBe(false);
  });

  it("maps composed templates to the default base dir, others to themselves", () => {
    expect(templateBaseDir("store")).toBe("default");
    expect(templateBaseDir("landing")).toBe("default");
    expect(templateBaseDir("saas")).toBe("default");
    expect(templateBaseDir("default")).toBe("default");
    expect(templateBaseDir("dashboard")).toBe("dashboard");
    expect(templateBaseDir("marketing")).toBe("marketing");
    expect(templateBaseDir("landing-studio")).toBe("default");
  });
});

describe("dirNameFromProjectName", () => {
  it("returns the name unchanged when unscoped", () => {
    expect(dirNameFromProjectName("my-app")).toBe("my-app");
  });

  it("strips the scope for scoped names", () => {
    expect(dirNameFromProjectName("@acme/widget")).toBe("widget");
  });
});

describe("parseCli", () => {
  it("reads the positional name and defaults install to true", () => {
    expect(parseCli(["my-app"])).toMatchObject({
      name: "my-app",
      pm: undefined,
      install: true,
      theme: undefined,
      mode: undefined,
      yes: false,
      ai: undefined,
    });
  });

  it("honors --no-install and --pm", () => {
    expect(parseCli(["my-app", "--no-install", "--pm", "pnpm"])).toMatchObject({
      name: "my-app",
      pm: "pnpm",
      install: false,
    });
  });

  it("parses --theme, --mode and --yes", () => {
    expect(parseCli(["my-app", "--theme", "sunset", "--mode", "light", "--yes"])).toMatchObject({
      theme: "sunset",
      mode: "light",
      yes: true,
    });
  });

  it("parses --template and leaves it undefined (prompt later) when omitted", () => {
    expect(parseCli(["my-app"]).template).toBeUndefined();
    expect(parseCli(["my-app", "--template", "dashboard"]).template).toBe("dashboard");
    expect(parseCli(["my-app", "--template", "marketing"]).template).toBe("marketing");
    expect(parseCli(["my-app", "--template", "default"]).template).toBe("default");
  });

  it("accepts the composed templates (store/landing/saas and landing flavors)", () => {
    expect(parseCli(["my-app", "--template", "store"]).template).toBe("store");
    expect(parseCli(["my-app", "--template", "landing"]).template).toBe("landing");
    expect(parseCli(["my-app", "--template", "saas"]).template).toBe("saas");
    expect(parseCli(["my-app", "--template", "admin"]).template).toBe("admin");
    expect(parseCli(["my-app", "--template", "docs"]).template).toBe("docs");
    expect(parseCli(["my-app", "--template", "landing-studio"]).template).toBe("landing-studio");
  });

  it("defaults the AI Kit fields (ai undecided, all assistants/skills, standard preset)", () => {
    const parsed = parseCli(["my-app"]);
    expect(parsed.ai).toBeUndefined();
    expect(parsed.preset).toBe("standard");
    expect(parsed.assistants).toEqual(["claude", "cursor", "copilot", "windsurf", "gemini"]);
    expect(parsed.skills).toEqual([
      "ui-add",
      "theme",
      "compose",
      "upgrade",
      "code-review",
      "ship-pr",
      "evidence-check",
    ]);
  });

  it("leaves ai undecided under --yes (the kit is included unless --no-ai)", () => {
    // parseArgs defaults `--ai` to false, but parseCli maps that to `undefined`
    // so main() can apply the --yes / prompt default (include the kit).
    expect(parseCli(["my-app", "--yes"]).ai).toBeUndefined();
    expect(parseCli(["my-app", "--yes", "--no-ai"]).ai).toBe(false);
    expect(parseCli(["my-app", "--yes", "--ai"]).ai).toBe(true);
  });

  it("parses --ai / --no-ai / --assistants / --preset / --skills", () => {
    expect(parseCli(["my-app", "--no-ai"]).ai).toBe(false);
    expect(parseCli(["my-app", "--ai"]).ai).toBe(true);
    expect(
      parseCli([
        "my-app",
        "--ai",
        "--assistants",
        "claude,cursor",
        "--preset",
        "fintech",
        "--skills",
        "ui-add,theme",
      ]),
    ).toMatchObject({
      ai: true,
      assistants: ["claude", "cursor"],
      preset: "fintech",
      skills: ["ui-add", "theme"],
    });
  });

  it("throws on an unknown --pm", () => {
    expect(() => parseCli(["my-app", "--pm", "cargo"])).toThrow(/Unknown --pm/);
  });

  it("throws on an unknown --theme", () => {
    expect(() => parseCli(["my-app", "--theme", "galaxy"])).toThrow(/Unknown --theme/);
  });

  it("throws on an unknown --template", () => {
    expect(() => parseCli(["my-app", "--template", "blog"])).toThrow(/Unknown --template/);
  });

  it("throws on an unknown --mode", () => {
    expect(() => parseCli(["my-app", "--mode", "sepia"])).toThrow(/Unknown --mode/);
  });

  it("throws on an unknown --assistant, --preset, or --skill", () => {
    expect(() => parseCli(["my-app", "--assistants", "notepad"])).toThrow(/Unknown assistant/);
    expect(() => parseCli(["my-app", "--preset", "crypto"])).toThrow(/Unknown --preset/);
    expect(() => parseCli(["my-app", "--skills", "deploy"])).toThrow(/Unknown skill/);
  });
});

describe("HELP", () => {
  it("leads examples with --template saas and documents composed landing flavors", () => {
    expect(HELP).toContain("npx create-cronus-app my-app --template saas");
    expect(HELP).toContain("npx create-cronus-app my-app --template landing-studio");
    expect(HELP).toContain("npx create-cronus-app my-app --template mail");
    expect(HELP).toContain("mail, chat, finance");
    expect(HELP).toContain("landing-* flavors");
  });
});

describe("outroLines", () => {
  const joined = (
    name: string,
    pm: "bun" | "npm" | "pnpm" | "yarn",
    installed: boolean,
    template?: (typeof TEMPLATES)[number],
  ) => outroLines(name, pm, installed, template).join("\n");

  it("for composed templates, points at add-page / theme set / upgrade", () => {
    for (const t of ["saas", "store", "landing", "admin", "docs"] as const) {
      const text = joined("acme", "npm", true, t);
      expect(text, t).toContain(
        "npx cronus-ui add-page --route /pricing --blocks pricing,cta --nav Pricing",
      );
      expect(text, t).toContain("npx cronus-ui theme set aurora --mode dark");
      expect(text, t).toContain("npx cronus-ui upgrade --all --dry-run");
      expect(text, t).not.toContain("npx cronus-ui add dialog table tabs");
    }
  });

  it("for default/dashboard/marketing, keeps add + a compose hint", () => {
    for (const t of ["default", "dashboard", "marketing"] as const) {
      const text = joined("my-app", "npm", true, t);
      expect(text, t).toContain("npx cronus-ui add dialog table tabs");
      expect(text, t).toContain("npx cronus-ui compose saas");
      expect(text, t).not.toContain("add-page --route /pricing");
    }
  });

  it("when template is omitted, keeps the component-add next step", () => {
    const text = joined("my-app", "npm", true);
    expect(text).toContain("npx cronus-ui add dialog table tabs");
    expect(text).toContain("npx cronus-ui compose saas");
  });

  it("omits the install line when dependencies were installed", () => {
    expect(joined("my-app", "npm", true, "saas")).not.toContain("npm install");
    expect(joined("my-app", "npm", false, "saas")).toContain("npm install");
  });

  it("uses the package manager's install and dev commands", () => {
    expect(joined("my-app", "bun", true)).toContain("bun dev");
    expect(joined("my-app", "pnpm", true)).toContain("pnpm dev");
    expect(joined("my-app", "yarn", false)).toMatch(/\byarn\b/);
    expect(joined("my-app", "npm", true)).toContain("npm run dev");
  });

  it("for saas/admin, lists db:push before dev when the schema was not pushed", () => {
    for (const t of ["saas", "admin"] as const) {
      const lines = outroLines("acme", "npm", true, t, false);
      const pushIdx = lines.findIndex((l) => l.includes("db:push"));
      const devIdx = lines.findIndex((l) => l.includes("npm run dev"));
      expect(pushIdx, t).toBeGreaterThan(-1);
      expect(devIdx, t).toBeGreaterThan(-1);
      expect(pushIdx, t).toBeLessThan(devIdx);
    }
    expect(joined("acme", "bun", false, "saas")).toContain("bun run db:push");
    expect(joined("acme", "npm", true, "store")).not.toContain("db:push");
    expect(joined("acme", "npm", true, "landing")).not.toContain("db:push");
  });

  it("omits db:push when the gold-path schema was already pushed", () => {
    expect(outroLines("acme", "bun", true, "saas", true).join("\n")).not.toContain("db:push");
    expect(outroLines("acme", "npm", true, "admin", true).join("\n")).not.toContain("db:push");
  });
});
