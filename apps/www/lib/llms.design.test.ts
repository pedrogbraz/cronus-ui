import { describe, expect, it } from "vitest";
import { guideMarkdown, markdownForPath, markdownStaticParams } from "./llms";

describe("DESIGN.md llm mirrors", () => {
  it("serves extended and compact from the same generator", () => {
    const extended = guideMarkdown("design");
    expect(extended).toContain("# Cronus UI — DESIGN.md");
    expect(extended).toContain("Aurora is generated product");
    expect(markdownForPath(["docs", "design.md"])).toBe(extended);
    expect(markdownForPath(["design.compact.md"])).toContain("# Cronus UI — DESIGN.md (compact)");
    expect(markdownStaticParams()).toContainEqual({ slug: ["design.compact.md"] });
    expect(markdownStaticParams()).toContainEqual({ slug: ["docs", "design.md"] });
  });
});
