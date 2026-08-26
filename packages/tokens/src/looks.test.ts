import { describe, expect, it } from "vitest";
import { defaultLook, lookLabels, lookNames } from "./tokens.js";

describe("looks", () => {
  it("exposes four named looks, default first", () => {
    expect(lookNames).toEqual(["default", "brutalist", "glass", "mauve"]);
    expect(defaultLook).toBe("default");
    expect(lookNames.map((name) => lookLabels[name])).toEqual([
      "Default",
      "Brutalist",
      "Glass",
      "Mauve",
    ]);
  });
});
