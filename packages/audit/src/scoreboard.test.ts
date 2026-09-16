import { describe, expect, it } from "vitest";
import {
  buildScoreboard,
  collectReportTests,
  logicTitleFamilies,
  type ScoreboardInput,
  ScoreboardSchema,
  serializeScoreboard,
} from "./scoreboard.js";

const REPORT = {
  config: {},
  suites: [
    {
      title: "geometry.spec.ts",
      file: "geometry.spec.ts",
      suites: [
        {
          title: "geometry parity (React vs Cronus)",
          file: "geometry.spec.ts",
          specs: [
            { title: "button/primary-md", tests: [{ status: "expected" }] },
            { title: "badge/default", tests: [{ status: "unexpected" }] },
          ],
        },
      ],
    },
    {
      title: "parity.pixel.spec.ts",
      file: "parity.pixel.spec.ts",
      specs: [
        { title: "button/primary-md", tests: [{ status: "expected" }] },
        { title: "badge/default", tests: [{ status: "unexpected" }] },
      ],
    },
    {
      title: "logic.spec.ts",
      file: "logic.spec.ts",
      specs: [
        { title: "button data-slot", tests: [{ status: "expected" }] },
        { title: "href renders as a link", tests: [{ status: "expected" }] },
        { title: "radio-group is a div", tests: [{ status: "unexpected" }] },
        { title: "badge/default: span with a variant", tests: [{ status: "expected" }] },
        { title: "skipped thing", tests: [{ status: "skipped" }] },
      ],
    },
  ],
};

function input(overrides: Partial<ScoreboardInput> = {}): ScoreboardInput {
  return {
    generatedAt: "2026-09-15",
    kernelRef: "abc123",
    componentSlugs: ["button", "badge", "radio-group", "radio", "carousel"],
    kernelFamilies: [
      { family: "button", renderer: "dedicated", stubKind: null },
      { family: "badge", renderer: "dedicated", stubKind: null },
      { family: "radio-group", renderer: "dedicated", stubKind: null },
      { family: "meteors", renderer: "stub", stubKind: "fx" },
    ],
    fixtures: [
      { family: "button", id: "primary-md" },
      { family: "button", id: "disabled" },
      { family: "badge", id: "default" },
    ],
    geometry: [
      {
        family: "button",
        fixture: "primary-md",
        mismatches: [],
        propMismatches: [{}, {}],
      },
    ],
    pixel: [
      { family: "button", fixture: "primary-md", pass: true, diffPixels: 0 },
      { family: "button", fixture: "disabled", pass: false, diffPixels: 120 },
    ],
    reportTests: collectReportTests(REPORT),
    logicFamilies: { "href renders as a link": "button" },
    ...overrides,
  };
}

describe("collectReportTests", () => {
  it("flattens nested suites and maps Playwright statuses", () => {
    const tests = collectReportTests(REPORT);
    expect(tests).toContainEqual({
      file: "geometry.spec.ts",
      title: "badge/default",
      status: "failed",
    });
    expect(tests).toContainEqual({
      file: "logic.spec.ts",
      title: "skipped thing",
      status: "skipped",
    });
    expect(tests).toHaveLength(9);
    expect(collectReportTests(null)).toEqual([]);
  });
});

describe("logicTitleFamilies", () => {
  it("maps each test title to its first /audit/<family> navigation", () => {
    const src = `
      test("href renders as a link", async ({ page }) => {
        await page.goto("/audit/button?fixture=as-link");
      });
      test('badge is a span', async ({ page }) => {
        await page.goto("/audit/badge?fixture=default");
        await page.goto("/audit/button?fixture=x");
      });
      test(\`\${family} dynamic\`, async () => { await page.goto("/audit/card"); });
    `;
    expect(logicTitleFamilies(src)).toEqual({
      "href renders as a link": "button",
      "badge is a span": "badge",
    });
  });
});

describe("buildScoreboard", () => {
  it("merges reports per fixture and rolls them up per family", () => {
    const board = buildScoreboard(input());
    const button = board.families.find((f) => f.family === "button");
    expect(button).toMatchObject({
      status: "ported",
      component: true,
      parity: "diff",
      geometry: { status: "pass", pass: 1, fail: 0, notRun: 1, propMismatches: 2 },
      pixel: { status: "diff", pass: 1, diff: 1, notRun: 0, diffPixels: 120 },
      logic: { status: "pass", pass: 2, fail: 0 },
    });
    expect(button?.fixtures.map((f) => f.id)).toEqual(["disabled", "primary-md"]);
    expect(button?.fixtures[0]).toEqual({
      id: "disabled",
      geometry: { status: "not-run", mismatches: null, propMismatches: null },
      pixel: { status: "diff", diffPixels: 120 },
    });

    // Test status wins over a missing record; pixel test failed without a record.
    expect(board.families.find((f) => f.family === "badge")).toMatchObject({
      parity: "diff",
      geometry: { status: "fail", fail: 1 },
      pixel: { status: "fail", fail: 1, diffPixels: 0 },
      // "badge/default: …" logic title maps by the family/ prefix.
      logic: { status: "pass", pass: 1, fail: 0 },
    });
    // Longest-prefix: "radio-group is a div" belongs to radio-group, not radio.
    expect(board.families.find((f) => f.family === "radio-group")?.logic).toEqual({
      status: "fail",
      pass: 0,
      fail: 1,
    });
    expect(board.families.find((f) => f.family === "radio")).toMatchObject({
      status: "react-only",
      parity: "not-ported",
    });
    expect(board.families.find((f) => f.family === "meteors")).toMatchObject({
      status: "stub",
      stubKind: "fx",
      component: false,
      parity: "not-ported",
    });
    expect(board.totals).toMatchObject({
      families: 6,
      components: 5,
      ported: 3,
      stub: 1,
      reactOnly: 2,
      fixtures: 3,
      parity: { match: 0, diff: 3, notRun: 0, notPorted: 3 },
      pixel: { diffPixels: 120 },
      logic: { pass: 3, fail: 1 },
    });
    expect(ScoreboardSchema.parse(board)).toEqual(board);
  });

  it("reports not run when there are no reports at all", () => {
    const board = buildScoreboard(input({ geometry: [], pixel: [], reportTests: null }));
    expect(board.sources).toEqual({
      auditReport: false,
      geometryReports: 0,
      pixelReports: 0,
      kernelRegistry: true,
    });
    const button = board.families.find((f) => f.family === "button");
    expect(button?.parity).toBe("not-run");
    expect(button?.geometry.status).toBe("not-run");
    expect(button?.pixel.status).toBe("not-run");
    expect(button?.logic.status).toBe("not-run");
  });

  it("falls back to the geometry record when the Playwright report is missing", () => {
    const board = buildScoreboard(
      input({
        reportTests: null,
        geometry: [{ family: "badge", fixture: "default", mismatches: [{}], propMismatches: [] }],
      }),
    );
    expect(board.families.find((f) => f.family === "badge")?.geometry.status).toBe("fail");
  });

  it("marks family status unknown when the kernel registry is unreadable", () => {
    const board = buildScoreboard(input({ kernelFamilies: null, reportTests: null, pixel: [] }));
    expect(board.families.find((f) => f.family === "carousel")).toMatchObject({
      status: "unknown",
      parity: "not-run",
    });
  });

  it("is deterministic regardless of input order", () => {
    const a = serializeScoreboard(buildScoreboard(input()));
    const shuffled = input();
    shuffled.componentSlugs.reverse();
    shuffled.fixtures.reverse();
    shuffled.pixel.reverse();
    expect(serializeScoreboard(buildScoreboard(shuffled))).toBe(a);
  });

  it("rejects a date that is not YYYY-MM-DD", () => {
    expect(() => buildScoreboard(input({ generatedAt: "today" }))).toThrow(/YYYY-MM-DD/);
  });
});
