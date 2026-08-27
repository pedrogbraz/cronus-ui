import { expect, type Page, test } from "@playwright/test";

/**
 * Visual regression for the component showcase (`/components/[slug]`).
 *
 * WHAT we screenshot: each component's **Gallery** view — the variants grid
 * (`ComponentVariantsGallery`) that renders every documented example's live
 * preview side by side, WITHOUT the code blocks. That gives full variant
 * coverage per component in a single snapshot, and code-sample edits (a
 * non-visual change) can never break the visual suite.
 *
 * HOW it stays deterministic:
 *  - `reducedMotion: "reduce"` is emulated → JS-driven animations that check
 *    `matchMedia` (e.g. Terminal's typing script) render their final, static
 *    state. Preview frames set `data-force-motion` (not `<html>`), so the
 *    tokens.css reduced-motion reset still applies to chrome. We ALSO inject a
 *    global `animation/transition: none` style tag and pass
 *    `animations: "disabled"` to `toHaveScreenshot` as the final backstop.
 *  - Blinking text carets are hidden (`caret-color: transparent`).
 *  - We wait for the lazily-loaded example family chunk (first
 *    `[data-slot="preview-frame"]` visible) and for `document.fonts.ready`.
 *  - All showcase examples pin fixed dates (e.g. the Calendar anchors June
 *    2026) and seed "random" data with an LCG, so pages are render-stable.
 *
 * Baselines are per-platform (see `snapshotPathTemplate` in
 * playwright.config.ts): darwin baselines are generated locally and committed;
 * linux baselines are bootstrapped by the CI job (see `visual` in ci.yml and
 * the "Visual regression" section of CONTRIBUTING.md).
 */

/** Must match the `storageKey` given to CronusThemeScript/CronusUIProvider in apps/www/app/layout.tsx. */
const THEME_STORAGE_KEY = "cronus-ui-theme-v2";

type Mode = "light" | "dark";

/**
 * The curated full set — ~15 representative components spanning every example
 * family tier (buttons, forms, data-display, navigation, overlays, date-time,
 * premium). Deliberately NOT the whole catalog: this suite is a tripwire for
 * theme/token/primitive regressions, not a pixel test of all 100+ components.
 */
const FULL_SET = [
  "button",
  "card",
  "badge",
  "input",
  "select", // closed trigger states only — opening a portal is covered by `dialog open`
  "dialog", // gallery = closed trigger cards; the open overlay has its own test below
  "data-table",
  "tabs",
  "calendar", // examples pin June 2026, so no moving "today" marker
  "metric",
  "stepper",
  "terminal", // honours prefers-reduced-motion via matchMedia → full script, static
  "spotlight-card", // pointer-driven; mouse never enters the frame, so it's inert
  "json-viewer",
  "timeline",
] as const;

/** Cross-theme smoke — enough to catch a broken theme palette without a 5×2 full matrix. */
const SMOKE_SET = ["button", "card", "input"] as const;

/**
 * Theme/mode combos for the smoke set. The FULL_SET already covers the
 * default aurora/dark; the smoke adds the other four themes (their default
 * dark mode) plus aurora/light for mode coverage.
 */
const SMOKE_COMBOS: Array<{ theme: string; mode: Mode }> = [
  { theme: "neutral", mode: "dark" },
  { theme: "midnight", mode: "dark" },
  { theme: "sunset", mode: "dark" },
  { theme: "emerald", mode: "dark" },
  { theme: "aurora", mode: "light" },
];

/**
 * Kills any remaining CSS motion. Injected AFTER load so it sits last in the
 * cascade and wins `!important` ties against tokens.css (which exempts the
 * showcase's `data-force-motion` subtree from its reduced-motion reset).
 */
const FREEZE_CSS = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
    caret-color: transparent !important;
  }
`;

const SCREENSHOT_OPTIONS = {
  animations: "disabled",
  maxDiffPixelRatio: 0.02,
} as const;

/**
 * Persist the theme BEFORE any document script runs, exactly the way the site
 * does it: CronusThemeScript reads `localStorage[storageKey]` as JSON
 * `{ theme, mode }` pre-paint and sets `data-cronus-theme` / `data-cronus-mode`
 * / `.dark` on <html> (see packages/theme/src/theme-script.tsx).
 */
async function useTheme(page: Page, theme: string, mode: Mode): Promise<void> {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [THEME_STORAGE_KEY, JSON.stringify({ theme, mode })] as const,
  );
  // colorScheme keeps UA-rendered bits (scrollbars, form controls) in the same
  // scheme as the app theme; reducedMotion is read by matchMedia-driven demos.
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: mode });
}

/** Navigate to a component docs page and settle it for screenshotting. */
async function openComponentPage(page: Page, slug: string): Promise<void> {
  await page.goto(`/components/${slug}`, { waitUntil: "load" });
  // The example family chunk is code-split & lazy — hydrated once the first
  // real preview frame replaces the loading skeleton.
  await expect(page.locator('[data-slot="preview-frame"]').first()).toBeVisible();
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/**
 * Switch the Examples section to the Gallery view and return the variants
 * grid.
 *
 * The page is SSG, so the tab button exists in the HTML long before React
 * hydrates and attaches its onClick — a single early click is a silent no-op.
 * `toPass` retry-clicks until the tab actually reports selected, which
 * doubles as the hydration wait.
 *
 * The grid has no test id, so we anchor on its `<figure>` cards (the gallery
 * is the only place the docs render figures) and take their parent —
 * structural, but independent of Tailwind class names.
 */
async function openGallery(page: Page) {
  const galleryTab = page.getByRole("tab", { name: "Gallery" });
  await expect(async () => {
    await galleryTab.click();
    await expect(galleryTab).toHaveAttribute("aria-selected", "true", { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
  const cards = page.locator("article figure");
  await expect(cards.first()).toBeVisible();
  const grid = cards.first().locator("..");
  // Give the freshly-mounted previews one settled frame before capture.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
  return grid;
}

test.describe("component gallery — aurora/dark (full set)", () => {
  for (const slug of FULL_SET) {
    test(`${slug} gallery`, async ({ page }) => {
      await useTheme(page, "aurora", "dark");
      await openComponentPage(page, slug);
      const gallery = await openGallery(page);
      await expect(gallery).toHaveScreenshot(`${slug}--aurora-dark.png`, SCREENSHOT_OPTIONS);
    });
  }
});

test.describe("theme smoke — other themes + light mode", () => {
  for (const { theme, mode } of SMOKE_COMBOS) {
    for (const slug of SMOKE_SET) {
      test(`${slug} gallery — ${theme}/${mode}`, async ({ page }) => {
        await useTheme(page, theme, mode);
        await openComponentPage(page, slug);
        const gallery = await openGallery(page);
        await expect(gallery).toHaveScreenshot(`${slug}--${theme}-${mode}.png`, SCREENSHOT_OPTIONS);
      });
    }
  }
});

test.describe("overlay states", () => {
  test("dialog open", async ({ page }) => {
    await useTheme(page, "aurora", "dark");
    await openComponentPage(page, "dialog");
    // Open the first example's dialog through the page like a user would.
    // Same SSG hydration race as the gallery tab: retry-click the trigger
    // until the (client-only, portalled) dialog actually appears.
    const trigger = page.locator('[data-slot="preview-frame"]').first().getByRole("button").first();
    const dialog = page.getByRole("dialog");
    await expect(async () => {
      await trigger.click();
      await expect(dialog).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 15_000 });
    // Focus lands wherever Radix puts it; the frozen caret keeps that stable.
    await expect(dialog).toHaveScreenshot("dialog--open--aurora-dark.png", SCREENSHOT_OPTIONS);
  });
});
