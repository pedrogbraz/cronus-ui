import { describe, expect, it } from "vitest";
import { isSafeChartColor } from "./chart.js";

describe("isSafeChartColor (chart CSS-injection allowlist)", () => {
  it("accepts hex colors (#rgb / #rgba / #rrggbb / #rrggbbaa)", () => {
    expect(isSafeChartColor("#fff")).toBe(true);
    expect(isSafeChartColor("#ffff")).toBe(true);
    expect(isSafeChartColor("#aabbcc")).toBe(true);
    expect(isSafeChartColor("#aabbccdd")).toBe(true);
  });

  it("accepts rgb()/rgba()/hsl()/hsla() with numeric args", () => {
    expect(isSafeChartColor("rgb(255, 0, 0)")).toBe(true);
    expect(isSafeChartColor("rgba(255, 0, 0, 0.5)")).toBe(true);
    expect(isSafeChartColor("hsl(210, 50%, 40%)")).toBe(true);
    expect(isSafeChartColor("hsla(210 50% 40% / 0.5)")).toBe(true);
  });

  it("accepts oklch()/oklab() with numeric args", () => {
    expect(isSafeChartColor("oklch(0.685 0.169 237.3)")).toBe(true);
    expect(isSafeChartColor("oklab(0.5 -0.1 0.1)")).toBe(true);
  });

  it("accepts var(--token) references, including chained fallbacks", () => {
    expect(isSafeChartColor("var(--kronus-primary)")).toBe(true);
    expect(isSafeChartColor("var(--a, var(--b))")).toBe(true);
    expect(isSafeChartColor("var(--chart-1, #fff)")).toBe(true);
  });

  it("accepts bare named tokens / keywords", () => {
    expect(isSafeChartColor("transparent")).toBe(true);
    expect(isSafeChartColor("currentColor")).toBe(true);
    expect(isSafeChartColor("rebeccapurple")).toBe(true);
  });

  it("REJECTS a CSS-injection breakout payload", () => {
    expect(isSafeChartColor("red;} body{display:none")).toBe(false);
  });

  it("rejects values containing CSS terminators / braces / at-rules", () => {
    expect(isSafeChartColor("red;")).toBe(false);
    expect(isSafeChartColor("blue} body{color:red")).toBe(false);
    expect(isSafeChartColor("#fff;}")).toBe(false);
    expect(isSafeChartColor("</style><script>alert(1)</script>")).toBe(false);
    expect(isSafeChartColor("rgb(0,0,0);background:url(javascript:alert(1))")).toBe(false);
    expect(isSafeChartColor("@import 'evil.css'")).toBe(false);
  });

  it("rejects url()/expression() and other disallowed functions", () => {
    expect(isSafeChartColor("url(http://evil)")).toBe(false);
    expect(isSafeChartColor("expression(alert(1))")).toBe(false);
    expect(isSafeChartColor("rgb(0,0,0) url(x)")).toBe(false);
  });

  it("rejects empty, whitespace-only, and over-long values", () => {
    expect(isSafeChartColor("")).toBe(false);
    expect(isSafeChartColor("   ")).toBe(false);
    expect(isSafeChartColor(`#${"a".repeat(200)}`)).toBe(false);
  });
});
