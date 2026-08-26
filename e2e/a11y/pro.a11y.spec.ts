import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PRO_ORIGIN = process.env.PLAYWRIGHT_PRO_URL ?? "http://localhost:4748";
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

test("a11y: Cronus Pro origin has no serious/critical violations", async ({ page }) => {
  await page.goto(PRO_ORIGIN, { waitUntil: "load" });
  await expect(page.locator("main#main-content")).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .options({
      rules: {
        "color-contrast": { enabled: true },
        "landmark-one-main": { enabled: true },
        "landmark-unique": { enabled: true },
        region: { enabled: true },
      },
    })
    .analyze();

  const blocking = results.violations.filter(
    (v) => v.impact != null && BLOCKING_IMPACTS.has(v.impact),
  );

  const summary = blocking
    .map((v) => {
      const sampleNode = v.nodes[0]?.target?.join(" ") ?? "(no node)";
      return `  • [${v.impact}] ${v.id}: ${v.help}\n      e.g. ${sampleNode}`;
    })
    .join("\n");

  expect(
    blocking,
    blocking.length > 0
      ? `axe found ${blocking.length} serious/critical violation(s) on Cronus Pro:\n${summary}`
      : undefined,
  ).toEqual([]);
});
