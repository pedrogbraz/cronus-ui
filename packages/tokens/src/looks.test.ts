import { describe, expect, it } from "vitest";
import { defaultLook, lookLabels, lookNames } from "./tokens.js";

describe("looks", () => {
  it("exposes three named looks, default first", () => {
    expect(lookNames).toEqual(["default", "brutalist", "glass"]);
    expect(defaultLook).toBe("default");
    expect(lookNames.map((name) => lookLabels[name])).toEqual(["Default", "Brutalist", "Glass"]);
  });
});
