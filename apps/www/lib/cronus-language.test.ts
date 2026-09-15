import { describe, expect, it } from "vitest";
import { SCOREBOARD } from "./audit/scoreboard";
import {
  CRONUS_CATALOG_FAMILIES,
  CRONUS_CATALOG_RUN,
  CRONUS_CATALOG_SOURCE,
  CRONUS_HOW_IT_WORKS,
  CRONUS_RULES,
} from "./cronus-language";

describe("cronus language catalog", () => {
  it("derives kernel registry families from the scoreboard", () => {
    const names = CRONUS_CATALOG_FAMILIES.map((item) => item.family);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain("button");
    expect(names).toContain("select");
    expect(names).toContain("combobox");
    expect(CRONUS_CATALOG_FAMILIES.filter((item) => item.kind === "dedicated")).toHaveLength(
      SCOREBOARD.totals.ported,
    );
    expect(CRONUS_CATALOG_FAMILIES.filter((item) => item.kind === "stub")).toHaveLength(
      SCOREBOARD.totals.stub,
    );
    expect(CRONUS_CATALOG_FAMILIES.find((item) => item.family === "date-picker")?.kind).toBe(
      "dedicated",
    );
  });

  it("sample source is declaration-only", () => {
    expect(CRONUS_CATALOG_SOURCE).toContain("style:button+primary+md");
    expect(CRONUS_CATALOG_SOURCE).not.toContain("<div");
    expect(CRONUS_CATALOG_SOURCE).not.toContain("className");
  });

  it("run snippet uses IPv4 and the debug binary", () => {
    expect(CRONUS_CATALOG_RUN).toContain("127.0.0.1:5311");
    expect(CRONUS_CATALOG_RUN).toContain("target/debug/cronus run");
    expect(CRONUS_CATALOG_RUN).toContain("bun run www");
    expect(CRONUS_HOW_IT_WORKS).toHaveLength(3);
    expect(CRONUS_RULES.some((rule) => rule.includes("JSX"))).toBe(true);
  });
});
