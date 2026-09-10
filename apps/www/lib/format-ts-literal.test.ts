import { describe, expect, it } from "vitest";
import { formatTsLiteral } from "./format-ts-literal";

describe("formatTsLiteral", () => {
  it("renders strings, booleans, and empty collections", () => {
    expect(formatTsLiteral("saas")).toBe('"saas"');
    expect(formatTsLiteral(true)).toBe("true");
    expect(formatTsLiteral([])).toBe("[]");
    expect(formatTsLiteral({})).toBe("{}");
  });

  it("drops undefined object fields and formats nested refs", () => {
    expect(formatTsLiteral({ navbar: "navbar", footer: undefined })).toBe('{ navbar: "navbar" }');
    expect(formatTsLiteral([{ block: "hero" }, { block: "cta", variant: "banner" }])).toBe(
      '[{ block: "hero" }, { block: "cta", variant: "banner" }]',
    );
  });
});
