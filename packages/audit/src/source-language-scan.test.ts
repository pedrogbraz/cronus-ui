import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { emitCronusApp } from "./emit-cronus-fixture.js";
import {
  HTML_IN_SOURCE,
  JSX,
  SIDECAR_SOURCE,
  STACK_REACT,
  TEMPLATE,
  TW_CSS,
  VOODOO,
} from "./error-codes.js";
import { getFixture } from "./fixture-catalog.js";
import { codesOf, scanSourceLanguage } from "./source-language-scan.js";

const here = dirname(fileURLToPath(import.meta.url));
const cheatsDir = join(here, "../fixtures/_cheats");

describe("source-language-scan", () => {
  it("lets a clean emitted app through", () => {
    const fixture = getFixture("button", "primary-md");
    const src = emitCronusApp([fixture]);
    expect(src).not.toContain("source");
    expect(scanSourceLanguage(src)).toEqual([]);
  });

  it("fails comparison-free HTML and allows 2 < 3", () => {
    expect(codesOf(scanSourceLanguage('label "<div>"'))).toContain(HTML_IN_SOURCE);
    expect(codesOf(scanSourceLanguage('label "2 < 3"'))).not.toContain(HTML_IN_SOURCE);
  });

  it("fails all 8 source cheats", () => {
    const files = readdirSync(cheatsDir)
      .filter((f) => f.endsWith(".cronus"))
      .sort();
    expect(files).toHaveLength(8);
    const expected: Record<string, string> = {
      "01-html-in-source.cronus": HTML_IN_SOURCE,
      "02-jsx-tsx.cronus": JSX,
      "03-template-style-block.cronus": TEMPLATE,
      "04-import-tsx.cronus": SIDECAR_SOURCE,
      "04-page-source-html.cronus": SIDECAR_SOURCE,
      "09-stack-react.cronus": STACK_REACT,
      "11-tw-css.cronus": TW_CSS,
      "12-voodoo.cronus": VOODOO,
    };
    for (const name of files) {
      const source = readFileSync(join(cheatsDir, name), "utf8");
      const codes = codesOf(scanSourceLanguage(source));
      expect(codes, name).toContain(expected[name]);
    }
  });
});
