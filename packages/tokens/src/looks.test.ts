import { describe, expect, it } from "vitest";
import { defaultLook, isLookName, isThemeName, lookLabels, lookNames } from "./tokens.js";

describe("looks", () => {
  it("exposes three named looks, default first", () => {
    expect(lookNames).toEqual(["default", "brutalist", "glass"]);
    expect(defaultLook).toBe("default");
    expect(lookNames.map((name) => lookLabels[name])).toEqual(["Default", "Brutalist", "Glass"]);
    expect(isLookName("glass")).toBe(true);
    expect(isLookName("mauve")).toBe(false);
    expect(isThemeName("aurora")).toBe(true);
    expect(isThemeName("mauve")).toBe(false);
  });
});
