import { describe, expect, it } from "vitest";
import { cssColorToHex } from "./css-color-to-hex.js";

describe("cssColorToHex", () => {
  it("serializes rgb to hex", () => {
    expect(cssColorToHex("rgb(14, 165, 233)")).toBe("#0ea5e9");
  });

  it("treats zero alpha as transparent", () => {
    expect(cssColorToHex("rgba(0, 0, 0, 0)")).toBe("transparent");
  });

  it("keeps 8-digit hex when alpha is partial", () => {
    expect(cssColorToHex("rgba(0, 0, 0, 0.5)")).toBe("#00000080");
  });
});
