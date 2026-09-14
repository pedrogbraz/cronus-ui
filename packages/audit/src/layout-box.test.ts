import { describe, expect, it } from "vitest";
import { compareLayoutBox } from "./layout-box.js";

describe("compareLayoutBox", () => {
  it("passes within 2px", () => {
    expect(
      compareLayoutBox(
        { x: 10, y: 10, width: 80, height: 40 },
        { x: 11.5, y: 10, width: 80, height: 41 },
      ).ok,
    ).toBe(true);
  });

  it("fails beyond 2px", () => {
    expect(
      compareLayoutBox(
        { x: 10, y: 10, width: 80, height: 40 },
        { x: 13, y: 10, width: 80, height: 40 },
      ).ok,
    ).toBe(false);
  });
});
