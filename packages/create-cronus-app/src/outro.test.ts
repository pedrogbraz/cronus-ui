import { describe, expect, it } from "vitest";
import { outroLines } from "./outro.js";
import type { TEMPLATES } from "./scaffold-options.js";

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
    for (const t of ["default", "dashboard", "marketing", "gontify", "portfolio"] as const) {
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
