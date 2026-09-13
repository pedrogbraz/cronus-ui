import { describe, expect, it } from "vitest";
import { CRONUS_CATALOG_FAMILIES, CRONUS_CATALOG_SOURCE } from "./cronus-language";

describe("cronus language catalog", () => {
  it("lists dedicated and interact families with unique names", () => {
    const names = CRONUS_CATALOG_FAMILIES.map((item) => item.family);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain("button");
    expect(names).toContain("select");
    expect(names).toContain("combobox");
    expect(
      CRONUS_CATALOG_FAMILIES.filter((item) => item.kind === "dedicated").length,
    ).toBeGreaterThan(20);
  });

  it("sample source is declaration-only", () => {
    expect(CRONUS_CATALOG_SOURCE).toContain("style:button+primary+md");
    expect(CRONUS_CATALOG_SOURCE).not.toContain("<div");
    expect(CRONUS_CATALOG_SOURCE).not.toContain("className");
  });
});
