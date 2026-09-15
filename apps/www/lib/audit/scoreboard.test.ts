import type { FamilyScore } from "@cronus-ui/audit/scoreboard";
import { describe, expect, it } from "vitest";
import { COMPONENT_SLUGS } from "../components-index";
import { cronusSourcesFor } from "./cronus-sources";
import {
  configuredAuditOrigin,
  familyHref,
  geometryText,
  getFamilyScore,
  logicText,
  matchesFilter,
  pixelText,
  SCOREBOARD,
} from "./scoreboard";

function family(overrides: Partial<FamilyScore>): FamilyScore {
  return {
    family: "x",
    status: "ported",
    stubKind: null,
    component: true,
    parity: "match",
    fixtures: [],
    geometry: { status: "pass", pass: 2, fail: 0, notRun: 0, propMismatches: 0 },
    pixel: { status: "pass", pass: 2, diff: 0, fail: 0, notRun: 0, diffPixels: 0 },
    logic: { status: "not-run", pass: 0, fail: 0 },
    ...overrides,
  };
}

describe("committed scoreboard.json", () => {
  it("parses, is sorted, and covers every documented component", () => {
    const names = SCOREBOARD.families.map((f) => f.family);
    expect(names).toEqual([...names].sort());
    expect(new Set(names).size).toBe(names.length);
    for (const slug of COMPONENT_SLUGS) expect(names).toContain(slug);
    expect(SCOREBOARD.totals.families).toBe(names.length);
    expect(SCOREBOARD.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("button is ported with fixtures", () => {
    const button = getFamilyScore("button");
    expect(button?.status).toBe("ported");
    expect(button?.fixtures.map((f) => f.id)).toContain("primary-md");
  });
});

describe("scoreboard view helpers", () => {
  it("filters diffs and not-ported families", () => {
    const diff = family({ parity: "diff" });
    const stub = family({ status: "stub", parity: "not-ported" });
    expect(matchesFilter(diff, "diffs")).toBe(true);
    expect(matchesFilter(stub, "diffs")).toBe(false);
    expect(matchesFilter(stub, "not-ported")).toBe(true);
    expect(matchesFilter(diff, "not-ported")).toBe(false);
    expect(matchesFilter(stub, "all")).toBe(true);
  });

  it("links to the split view only when an audit origin is configured", () => {
    const withFixtures = family({
      family: "button",
      fixtures: [
        {
          id: "primary-md",
          geometry: { status: "pass", mismatches: 0, propMismatches: 0 },
          pixel: { status: "pass", diffPixels: 0 },
        },
      ],
    });
    expect(familyHref(withFixtures, "http://127.0.0.1:5176")).toBe("/audit/button");
    expect(familyHref(withFixtures, null)).toBe("/components/button");
    expect(familyHref(family({ family: "meteors", component: false }), null)).toBeNull();
    const parse = (v: string) => (v.startsWith("http://127.0.0.1") ? v : null);
    expect(configuredAuditOrigin(undefined, parse)).toBeNull();
    expect(configuredAuditOrigin("", parse)).toBeNull();
    expect(configuredAuditOrigin("http://127.0.0.1:5176", parse)).toBe("http://127.0.0.1:5176");
  });

  it("formats cells, with a dash for not run", () => {
    expect(geometryText(family({}).geometry)).toBe("2/2");
    expect(
      geometryText({ status: "not-run", pass: 0, fail: 0, notRun: 1, propMismatches: 0 }),
    ).toBe("—");
    expect(
      pixelText({ status: "diff", pass: 0, diff: 1, fail: 0, notRun: 0, diffPixels: 1836 }),
    ).toBe("1836 px");
    expect(pixelText({ status: "fail", pass: 0, diff: 0, fail: 1, notRun: 0, diffPixels: 0 })).toBe(
      "error",
    );
    expect(logicText({ status: "fail", pass: 1, fail: 1 })).toBe("1/2");
  });
});

describe("cronusSourcesFor", () => {
  it("emits one declaration-only app per fixture", () => {
    const sources = cronusSourcesFor("button");
    const primary = sources.find((s) => s.id === "primary-md");
    expect(primary?.source).toContain("style:button+primary+md");
    expect(primary?.source).toContain('page "/audit/button/primary-md"');
    expect(primary?.source).not.toContain("<");
    expect(sources.map((s) => s.id)).toEqual([...sources.map((s) => s.id)].sort());
    expect(cronusSourcesFor("not-a-family")).toEqual([]);
  });
});
