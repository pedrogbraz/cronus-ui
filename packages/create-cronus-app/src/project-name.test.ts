import { describe, expect, it } from "vitest";
import { dirNameFromProjectName, isValidProjectName } from "./project-name.js";

describe("isValidProjectName", () => {
  it("accepts simple lowercase names", () => {
    expect(isValidProjectName("my-app")).toBe(true);
    expect(isValidProjectName("my_app.v2")).toBe(true);
  });

  it("accepts scoped names", () => {
    expect(isValidProjectName("@acme/widget")).toBe(true);
  });

  it("rejects empty, uppercase, leading-dot, and space-containing names", () => {
    expect(isValidProjectName("")).toBe(false);
    expect(isValidProjectName("MyApp")).toBe(false);
    expect(isValidProjectName(".hidden")).toBe(false);
    expect(isValidProjectName("my app")).toBe(false);
    expect(isValidProjectName("a/b/c")).toBe(false);
  });
});

describe("dirNameFromProjectName", () => {
  it("returns the name unchanged when unscoped", () => {
    expect(dirNameFromProjectName("my-app")).toBe("my-app");
  });

  it("strips the scope for scoped names", () => {
    expect(dirNameFromProjectName("@acme/widget")).toBe("widget");
  });
});
