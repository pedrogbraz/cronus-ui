import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  type Browser,
  expect,
  type FrameLocator,
  type Locator,
  type Page,
  test,
} from "@playwright/test";
import { cronusFrame, FREEZE_CSS, freezeFrame } from "./audit-freeze";

/**
 * Cross-render pixel parity (REPORT-ONLY unless AUDIT_STRICT_PIXELS=1).
 *
 * For every family/fixture: open the split audit page, freeze both panes,
 * screenshot the same region on the React side and on the Cronus side (inside
 * the kernel iframe) at the same size, and compare them with Playwright's own
 * image comparator. The region is the canvas box, except for the families in
 * PIXEL_CLIP (see there), where it is a slot box both sides really render.
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
 * FREEZE_CSS stops CSS animation only. React families animated in JS are
 * listed in REACT_MOTION and shot only once their final frame is stable.
 * Do not run with --update-snapshots (it would overwrite the per-run React PNG).
 */

const STRICT_PIXELS = process.env.AUDIT_STRICT_PIXELS === "1";
const MAX_DIFF_PIXELS = Number(process.env.AUDIT_PIXEL_MAX_DIFF ?? 50);
const THRESHOLD = 0.1;
/** Stability poll for REACT_MOTION families: two identical shots this far apart. */
const STABLE_INTERVAL_MS = 150;
/** ~40 polls. A family that never settles fails the test, strict or not. */
const STABLE_TIMEOUT_MS = 6_000;

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

interface MotionSpec {
  /**
   * Load the page with `prefers-reduced-motion: reduce`. recharts'
   * `isAnimationActive: "auto"` (the default) then renders the final frame
   * directly: verified identical, pixel for pixel, to the settled frame of a
   * normal-motion run. The kernel's only reduced-motion rules for these slots
   * drop animation/transition, which FREEZE_CSS already does.
   */
  reducedMotion?: boolean;
  /** Selector (React pane) that proves the final state has mounted. */
  ready?: string;
  /** Why the entry exists. Required. */
  reason: string;
}

const RECHARTS: MotionSpec = {
  reducedMotion: true,
  reason: "recharts animates series in JS (FREEZE_CSS cannot stop it)",
};

/** React families animated in JS. Shot after `ready`, once two polls agree. */
const REACT_MOTION: Partial<Record<string, MotionSpec>> = {
  "area-chart": RECHARTS,
  "bar-chart": RECHARTS,
  chart: RECHARTS,
  "composed-chart": RECHARTS,
  "funnel-chart": {
    ...RECHARTS,
    ready: ".recharts-label-list text",
    reason: `${RECHARTS.reason}; Funnel mounts its LabelList a few frames after the series, even without animation`,
  },
  "gauge-chart": RECHARTS,
  "line-chart": RECHARTS,
  "pie-chart": RECHARTS,
  "profit-loss-chart": RECHARTS,
  "radar-chart": RECHARTS,
  "ring-chart": RECHARTS,
  "scatter-chart": RECHARTS,
  "card-stack": {
    reason: "motion layout projection + spring run in JS (React PNG differs run to run)",
  },
  "morphing-popover": {
    ready: '[data-slot="morphing-popover-content"] > div[style*="opacity: 1"]',
    reason: "motion content reveal (y 6→0 after a .12s delay) runs in JS",
  },
  reveal: {
    // motion/react ignores prefers-reduced-motion without MotionConfig, so wait
    // for the end of the fadeInUp variant: motion writes `transform: none` last.
    ready: '[data-slot="reveal"][style*="opacity: 1"][style*="transform: none"]',
    reason: "motion fadeInUp entrance runs in JS after useInView fires",
  },
};

type ReactScope =
  /** Slots inside the React canvas, same page. */
  | "canvas"
  /** Slots portaled to <body>, same page. */
  | "portal"
  /** Viewport-fixed slots portaled to <body>, React page sized to the kernel iframe window. */
  | "viewport";

interface ClipSpec {
  /** data-slot values; the union of their first matches is compared on both sides. */
  slots: string[];
  react: ReactScope;
  /**
   * `viewport` only: React's fixed portal slots, hidden in the split page (React
   * is shot in its own viewport-sized page). Otherwise React's full-page scrim
   * and panel paint over the kernel iframe and end up in the Cronus shot.
   */
  hideInSplitPage?: string[];
  /** Why the canvas box is not compared. Required. */
  reason: string;
}

const CLOSED_BY_DESIGN = (what: string) =>
  `React opens ${what} on mount (defaultOpen) and portals it over the canvas; the zero-JS kernel keeps it closed until user input, so only the closed trigger both sides render is compared (open content: geometry spec / logic spec)`;

/**
 * Families whose canvas box does not hold the same state on both sides.
 *
 * Closed by design (React open, kernel closed): both sides are clipped to the
 * trigger. Closing React with Escape was rejected: Radix returns focus to the
 * trigger (a keyboard-modality focus ring React-only), HoverCard ignores
 * Escape, and it would also exercise close logic instead of the idle state.
 *
 * Viewport overlays (modal dialogs, sheet): their geometry is a function of the
 * viewport, and the kernel iframe window (640x777) is not the React page
 * (1280x900). React is rendered in a page sized to the iframe window (same
 * breakpoints, same content size, as the geometry spec's measureReactOverlay)
 * and both sides are clipped to the content panel. A full-viewport comparison
 * was rejected: the translucent scrim covers different harness documents
 * (Next audit page vs kernel canvas), which would measure the harness, not the
 * component; the panel's position in the viewport is asserted by the geometry spec.
 *
 * context-menu: Radix ContextMenu opens at the pointer (viewport origin
 * without an event) and portals; the kernel renders it in-canvas under the
 * trigger text. Each side is clipped to its own content box.
 */
const PIXEL_CLIP: Partial<Record<string, ClipSpec>> = {
  "color-picker": {
    slots: ["color-picker-trigger"],
    react: "canvas",
    reason: CLOSED_BY_DESIGN("the picker popover"),
  },
  "date-picker": {
    slots: ["date-picker-trigger"],
    react: "canvas",
    reason: CLOSED_BY_DESIGN("the calendar popover"),
  },
  popover: { slots: ["button"], react: "canvas", reason: CLOSED_BY_DESIGN("popover-content") },
  "hover-card": {
    slots: ["button"],
    react: "canvas",
    reason: CLOSED_BY_DESIGN("hover-card-content"),
  },
  "dropdown-menu": {
    slots: ["button"],
    react: "canvas",
    reason: CLOSED_BY_DESIGN("dropdown-menu-content"),
  },
  menubar: { slots: ["menubar"], react: "canvas", reason: CLOSED_BY_DESIGN("menubar-content") },
  "notification-center": {
    // The unread badge overhangs the trigger box.
    slots: ["notification-trigger", "notification-badge"],
    react: "canvas",
    reason: CLOSED_BY_DESIGN("the notification-center panel"),
  },
  "split-button": {
    slots: ["split-button"],
    react: "canvas",
    reason: CLOSED_BY_DESIGN("the split-button dropdown-menu-content"),
  },
  "alert-dialog": {
    slots: ["alert-dialog-content"],
    react: "viewport",
    hideInSplitPage: ["alert-dialog-overlay", "alert-dialog-content"],
    reason: "viewport-centred modal panel",
  },
  "confirmation-dialog": {
    slots: ["confirmation-dialog"],
    react: "viewport",
    hideInSplitPage: ["alert-dialog-overlay", "confirmation-dialog"],
    reason: "viewport-centred modal panel",
  },
  "invite-dialog": {
    slots: ["invite-dialog"],
    react: "viewport",
    hideInSplitPage: ["dialog-overlay", "invite-dialog"],
    reason: "viewport-centred modal panel",
  },
  dialog: {
    slots: ["dialog-content"],
    react: "viewport",
    hideInSplitPage: ["dialog-overlay", "dialog-content"],
    reason: "viewport-centred modal panel",
  },
  tooltip: {
    slots: ["button"],
    react: "canvas",
    reason: CLOSED_BY_DESIGN("tooltip-content"),
  },
  sheet: {
    slots: ["sheet-content"],
    react: "viewport",
    hideInSplitPage: ["sheet-overlay", "sheet-content"],
    reason: "edge-pinned sheet panel",
  },
  "context-menu": {
    slots: ["context-menu-content"],
    react: "portal",
    reason: "Radix opens at the pointer and portals; kernel renders the menu in-canvas",
  },
};

/** Proves a React modal has mounted (Radix Dialog / AlertDialog / Sheet). */
const OVERLAY_READY = '[role="dialog"], [role="alertdialog"]';

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const auditPath = (family: string, fixture: string) =>
  `/audit/${family}?fixture=${fixture}&preset=aurora&mode=dark`;

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

async function box(locator: Locator, side: string): Promise<Box> {
  const b = await locator.boundingBox();
  if (!b) throw new Error(`${side} region has no bounding box`);
  return b;
}

/** Union of the first match of each slot inside `scope`. */
async function slotsBox(
  scope: Page | FrameLocator | Locator,
  slots: string[],
  side: string,
): Promise<Box> {
  const boxes: Box[] = [];
  for (const slot of slots) {
    boxes.push(await box(scope.locator(`[data-slot="${slot}"]`).first(), `${side} ${slot}`));
  }
  const left = Math.min(...boxes.map((b) => b.x));
  const top = Math.min(...boxes.map((b) => b.y));
  return {
    x: left,
    y: top,
    width: Math.max(...boxes.map((b) => b.x + b.width)) - left,
    height: Math.max(...boxes.map((b) => b.y + b.height)) - top,
  };
}

async function shoot(
  page: Page,
  origin: { x: number; y: number },
  size: { width: number; height: number },
): Promise<Buffer> {
  // Page-level clip: the kernel iframe composites into the page, so both shots
  // share one pipeline. fullPage only when the region leaves the viewport: a
  // fullPage capture grows the viewport, the audit iframe's height follows it,
  // and viewport-centred kernel content (dialogs) moves out of the measured box.
  const clip = { x: Math.round(origin.x), y: Math.round(origin.y), ...size };
  const viewport = page.viewportSize();
  const fits =
    viewport !== null &&
    clip.x + clip.width <= viewport.width &&
    clip.y + clip.height <= viewport.height;
  return page.screenshot({
    clip,
    fullPage: !fits,
    animations: "disabled",
    caret: "hide",
  });
}

/** Shoots until two consecutive shots are identical; fails when never stable. */
async function stableShoot(
  page: Page,
  origin: { x: number; y: number },
  size: { width: number; height: number },
  label: string,
): Promise<{ png: Buffer; polls: number }> {
  let png = await shoot(page, origin, size);
  let polls = 0;
  await expect
    .poll(
      async () => {
        polls += 1;
        const next = await shoot(page, origin, size);
        const same = next.equals(png);
        png = next;
        return same;
      },
      {
        message: `React ${label} never settled: no two identical shots ${STABLE_INTERVAL_MS}ms apart within ${STABLE_TIMEOUT_MS}ms`,
        intervals: [STABLE_INTERVAL_MS],
        timeout: STABLE_TIMEOUT_MS,
      },
    )
    .toBe(true);
  return { png, polls };
}

/**
 * PIXEL_CLIP `viewport` families: the same audit page in a window of the
 * kernel iframe's size; the React region is shot there. Returns the region box
 * so the caller can size both shots before shooting.
 */
async function openReactInViewport(
  browser: Browser,
  baseURL: string | undefined,
  path: string,
  viewport: { width: number; height: number },
  clip: ClipSpec,
): Promise<{ page: Page; region: Box; close: () => Promise<void> }> {
  const context = await browser.newContext({
    baseURL,
    viewport,
    deviceScaleFactor: 1,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto(path);
  await expect(page.locator(OVERLAY_READY).first()).toBeVisible();
  await page.addStyleTag({ content: FREEZE_CSS });
  // Idle state, as the geometry spec measures it: Radix FocusScope auto-focuses
  // the first control and paints its focus ring; the zero-JS kernel cannot focus.
  await page.evaluate(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) active.blur();
  });
  await settle(page.locator("body"));
  return {
    page,
    region: await slotsBox(page, clip.slots, "React"),
    close: () => context.close(),
  };
}

const ESC = String.fromCharCode(27);
const stripAnsi = (value: string) =>
  value
    .split(ESC)
    .map((chunk, i) => (i === 0 ? chunk : chunk.replace(/^\[[0-9;]*m/, "")))
    .join("");

test.describe("pixel parity (React vs Cronus)", () => {
  for (const { family, fixture } of CASES) {
    test(`${family}/${fixture}`, async ({ page, browser, baseURL }, testInfo) => {
      const motion = REACT_MOTION[family] ?? null;
      const clip = PIXEL_CLIP[family] ?? null;
      if (motion?.reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });

      const path = auditPath(family, fixture);
      await page.goto(path);
      const reactCanvas = page.locator('[data-audit-side="react"] [data-audit-canvas]');
      const frame = cronusFrame(page);
      const cronusCanvas = frame.locator("[data-audit-canvas]");
      await expect(reactCanvas).toBeVisible();
      await expect(cronusCanvas).toBeVisible();
      if (motion?.ready) {
        await expect(
          page.locator(`[data-audit-side="react"] ${motion.ready}`).first(),
        ).toBeVisible();
      }
      await page.addStyleTag({ content: FREEZE_CSS });
      await freezeFrame(frame);
      if (clip?.hideInSplitPage) {
        // Split-page CSS only; the kernel iframe is a separate document.
        const selectors = clip.hideInSplitPage.map((slot) => `[data-slot="${slot}"]`).join(", ");
        await page.addStyleTag({ content: `${selectors} { display: none !important; }` });
      }
      await settle(reactCanvas);
      await settle(cronusCanvas);

      const cronusBox = clip
        ? await slotsBox(cronusCanvas, clip.slots, "Cronus")
        : await box(cronusCanvas, "Cronus");

      let reactPage = page;
      let closeReact: (() => Promise<void>) | null = null;
      let reactBox: Box;
      if (clip?.react === "viewport") {
        const opened = await openReactInViewport(
          browser,
          baseURL,
          path,
          await cronusCanvas.evaluate((el) => {
            const win = el.ownerDocument.defaultView ?? window;
            return { width: win.innerWidth, height: win.innerHeight };
          }),
          clip,
        );
        reactPage = opened.page;
        reactBox = opened.region;
        closeReact = opened.close;
      } else if (clip?.react === "portal") {
        reactBox = await slotsBox(page, clip.slots, "React");
      } else if (clip) {
        reactBox = await slotsBox(reactCanvas, clip.slots, "React");
      } else {
        reactBox = await box(reactCanvas, "React");
      }

      const size = {
        width: Math.round(Math.max(reactBox.width, cronusBox.width)),
        height: Math.round(Math.max(reactBox.height, cronusBox.height)),
      };
      let reactPng: Buffer;
      let stablePolls: number | null = null;
      try {
        if (motion) {
          const shot = await stableShoot(reactPage, reactBox, size, family);
          reactPng = shot.png;
          stablePolls = shot.polls;
        } else {
          reactPng = await shoot(reactPage, reactBox, size);
        }
      } finally {
        await closeReact?.();
      }
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
        region: clip ? { slots: clip.slots, react: clip.react, reason: clip.reason } : "canvas",
        motion: motion ? { ...motion, stablePolls } : null,
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
