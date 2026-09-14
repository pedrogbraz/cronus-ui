import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { cronusFrame, FREEZE_CSS, freezeFrame } from "./audit-freeze";

/**
 * Cross-render pixel parity (REPORT-ONLY unless AUDIT_STRICT_PIXELS=1).
 *
 * For every family/fixture: open the split audit page, freeze both panes,
 * screenshot the React canvas and the Cronus canvas (inside the kernel iframe)
 * at the same size, and compare them with Playwright's own image comparator.
 *
 * No committed baseline: the React PNG is written, per run, to the path
 * `testInfo.snapshotPath()` resolves through `snapshotPathTemplate`
 * (test-results/audit-pixel-baseline/, set in both audit configs — only
 * `toMatchSnapshot` uses it; `toHaveScreenshot` baselines keep their own
 * pathTemplate). `toMatchSnapshot` then compares the Cronus PNG against it and
 * attaches expected (React) / actual (Cronus) / diff on a mismatch.
 *
 * Results: annotation `audit-pixel` + test-results/audit-pixel/<family>-<fixture>.json.
 * Tunables: AUDIT_PIXEL_MAX_DIFF (absolute maxDiffPixels, default 50); threshold 0.1.
 *
 * Limits: only the canvas box is captured, so portaled/viewport-fixed React
 * content (dialogs, sheets, popovers) is outside the React shot — those
 * families are expected to differ; the geometry spec covers their layout.
 * Do not run with --update-snapshots (it would overwrite the per-run React PNG).
 */

const STRICT_PIXELS = process.env.AUDIT_STRICT_PIXELS === "1";
const MAX_DIFF_PIXELS = Number(process.env.AUDIT_PIXEL_MAX_DIFF ?? 50);
const THRESHOLD = 0.1;

const REPO_ROOT = join(__dirname, "..", "..");
const FIXTURES_ROOT = join(REPO_ROOT, "packages", "audit", "fixtures");
const REPORT_DIR = join(REPO_ROOT, "test-results", "audit-pixel");

const CASES = readdirSync(FIXTURES_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
  .map((entry) => entry.name)
  .sort()
  .flatMap((family) =>
    readdirSync(join(FIXTURES_ROOT, family))
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.slice(0, -".json".length))
      .sort()
      .map((fixture) => ({ family, fixture })),
  );

async function settle(locator: Locator): Promise<void> {
  await locator.evaluate(async (el) => {
    const doc = el.ownerDocument;
    const win = doc.defaultView ?? window;
    await doc.fonts.ready;
    await new Promise<void>((resolve) =>
      win.requestAnimationFrame(() => win.requestAnimationFrame(() => resolve())),
    );
  });
}

async function box(locator: Locator, side: string) {
  const b = await locator.boundingBox();
  if (!b) throw new Error(`${side} canvas has no bounding box`);
  return b;
}

async function shoot(
  page: Page,
  origin: { x: number; y: number },
  size: { width: number; height: number },
): Promise<Buffer> {
  // Page-level clip (fullPage so a tall canvas is not cut at the viewport):
  // the kernel iframe composites into the page, so both shots share one pipeline.
  return page.screenshot({
    clip: { x: Math.round(origin.x), y: Math.round(origin.y), ...size },
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
}

const ESC = String.fromCharCode(27);
const stripAnsi = (value: string) =>
  value
    .split(ESC)
    .map((chunk, i) => (i === 0 ? chunk : chunk.replace(/^\[[0-9;]*m/, "")))
    .join("");

test.describe("pixel parity (React vs Cronus)", () => {
  for (const { family, fixture } of CASES) {
    test(`${family}/${fixture}`, async ({ page }, testInfo) => {
      await page.goto(`/audit/${family}?fixture=${fixture}&preset=aurora&mode=dark`);
      const react = page.locator('[data-audit-side="react"] [data-audit-canvas]');
      const frame = cronusFrame(page);
      const cronus = frame.locator("[data-audit-canvas]");
      await expect(react).toBeVisible();
      await expect(cronus).toBeVisible();
      await page.addStyleTag({ content: FREEZE_CSS });
      await freezeFrame(frame);
      await settle(react);
      await settle(cronus);

      const reactBox = await box(react, "React");
      const cronusBox = await box(cronus, "Cronus");
      const size = {
        width: Math.round(Math.max(reactBox.width, cronusBox.width)),
        height: Math.round(Math.max(reactBox.height, cronusBox.height)),
      };
      const reactPng = await shoot(page, reactBox, size);
      const cronusPng = await shoot(page, cronusBox, size);

      const name = `${family}-${fixture}.png`;
      const baseline = testInfo.snapshotPath(name);
      mkdirSync(dirname(baseline), { recursive: true });
      writeFileSync(baseline, reactPng);

      let failure: string | null = null;
      try {
        expect(cronusPng).toMatchSnapshot(name, {
          maxDiffPixels: MAX_DIFF_PIXELS,
          threshold: THRESHOLD,
        });
      } catch (error) {
        failure = stripAnsi(error instanceof Error ? error.message : String(error));
        // toMatchSnapshot attaches expected/actual/diff only when sizes match;
        // keep both raw shots so a size mismatch is still reviewable.
        await testInfo.attach("react-canvas", { body: reactPng, contentType: "image/png" });
        await testInfo.attach("cronus-canvas", { body: cronusPng, contentType: "image/png" });
      }

      const diffMatch = failure?.match(/(\d+) pixels \(ratio ([\d.]+)/);
      const record = {
        family,
        fixture,
        pass: failure === null,
        strict: STRICT_PIXELS,
        maxDiffPixels: MAX_DIFF_PIXELS,
        threshold: THRESHOLD,
        size,
        react: { width: reactBox.width, height: reactBox.height },
        cronus: { width: cronusBox.width, height: cronusBox.height },
        diffPixels: diffMatch ? Number(diffMatch[1]) : failure === null ? 0 : null,
        diffRatio: diffMatch ? Number(diffMatch[2]) : failure === null ? 0 : null,
        message: failure?.split("\n").slice(0, 6).join("\n") ?? null,
      };
      mkdirSync(REPORT_DIR, { recursive: true });
      writeFileSync(
        join(REPORT_DIR, `${family}-${fixture}.json`),
        `${JSON.stringify(record, null, 2)}\n`,
      );

      if (failure !== null) {
        const summary = record.diffPixels
          ? `${record.diffPixels} px differ (ratio ${record.diffRatio}), max ${MAX_DIFF_PIXELS}`
          : (record.message ?? "mismatch");
        testInfo.annotations.push({
          type: "audit-pixel",
          description: `${summary}${STRICT_PIXELS ? "" : " (report-only; AUDIT_STRICT_PIXELS=1 fails)"}`,
        });
        console.log(`[pixel] ${family}/${fixture}: ${summary}`);
        if (STRICT_PIXELS) throw new Error(failure);
      }
    });
  }
});
