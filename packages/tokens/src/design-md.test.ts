import { describe, expect, it } from "vitest";
import { designMarkdown, resolveDesignContext } from "./design-md.js";
import { themes } from "./tokens.js";

describe("designMarkdown", () => {
  it("emits extended taste with live Aurora tokens", () => {
    const md = designMarkdown({ format: "extended" });
    expect(md).toContain("# Cronus UI — DESIGN.md");
    expect(md).toContain("Aurora is generated product");
    expect(md).toContain(themes.aurora.dark.primary);
    expect(md).toContain("data-cronus-look");
    expect(md).toContain("One chromatic filled action");
    expect(md).toContain("rounded-lg");
    expect(md).toContain("rounded-xl");
    expect(md).not.toContain("acid-lime");
  });

  it("compact is short and names the requested theme and look", () => {
    const md = designMarkdown({ theme: "neutral", look: "brutalist", format: "compact" });
    expect(md).toContain("# Cronus UI — DESIGN.md (compact)");
    expect(md).toContain("**neutral**");
    expect(md).toContain("**brutalist**");
    expect(md).toContain(themes.neutral.dark.surfaceBase);
    expect(md.length).toBeLessThan(2800);
  });

  it("rejects unknown names", () => {
    expect(() => resolveDesignContext({ theme: "mauve" as never })).toThrow(/Unknown theme/);
    expect(() => resolveDesignContext({ look: "mauve" as never })).toThrow(/Unknown look/);
  });
});
