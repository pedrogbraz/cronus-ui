import { describe, expect, it } from "vitest";
import { HELP, parseCli } from "./index.js";
import { DEFAULT_TEMPLATE } from "./scaffold-options.js";

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
    expect(HELP).toContain(`Starter template (default: ${DEFAULT_TEMPLATE})`);
    expect(HELP).toContain("npx create-cronus-app my-app --template saas");
    expect(HELP).toContain("npx create-cronus-app my-app --template landing-studio");
    expect(HELP).toContain("npx create-cronus-app my-app --template mail");
    expect(HELP).toContain("mail, chat, finance");
    expect(HELP).toContain("landing-* flavors");
  });
});
