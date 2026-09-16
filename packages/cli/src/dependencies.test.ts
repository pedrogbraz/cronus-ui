import { describe, expect, it } from "vitest";
import { mergeDependencySpecsIntoPackageJson, splitDependencySpec } from "./dependencies.js";

describe("splitDependencySpec", () => {
  it("splits unscoped and scoped specs with ranges", () => {
    expect(splitDependencySpec("lucide-react@^0.577.0")).toEqual({
      name: "lucide-react",
      range: "^0.577.0",
    });
    expect(splitDependencySpec("@cronus-ui/ui@0.6.1")).toEqual({
      name: "@cronus-ui/ui",
      range: "0.6.1",
    });
  });

  it("leaves a bare name without a range", () => {
    expect(splitDependencySpec("clsx")).toEqual({ name: "clsx", range: undefined });
    expect(splitDependencySpec("@cronus-ui/ui")).toEqual({
      name: "@cronus-ui/ui",
      range: undefined,
    });
  });
});

describe("mergeDependencySpecsIntoPackageJson", () => {
  it("pins missing specs and keeps existing ranges", () => {
    const raw = JSON.stringify(
      { name: "app", dependencies: { next: "16.2.10", "@cronus-ui/ui": "^0.6.1" } },
      null,
      2,
    );
    const next = JSON.parse(
      mergeDependencySpecsIntoPackageJson(raw, [
        "lucide-react@^0.577.0",
        "recharts@^3.9.2",
        "@cronus-ui/ui@0.6.1",
        "clsx",
      ]),
    ) as { dependencies: Record<string, string> };
    expect(next.dependencies["lucide-react"]).toBe("^0.577.0");
    expect(next.dependencies.recharts).toBe("^3.9.2");
    expect(next.dependencies["@cronus-ui/ui"]).toBe("^0.6.1");
    expect(next.dependencies.clsx).toBeUndefined();
    expect(next.dependencies.next).toBe("16.2.10");
  });

  it("returns the original string when nothing new is added", () => {
    const raw = '{"name":"app","dependencies":{"lucide-react":"^0.577.0"}}';
    expect(mergeDependencySpecsIntoPackageJson(raw, ["lucide-react@^0.577.0"])).toBe(raw);
  });
});
