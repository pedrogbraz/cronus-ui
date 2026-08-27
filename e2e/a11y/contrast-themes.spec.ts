import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Per-theme color-contrast gate.
 *
 * The broad a11y gate (`core-routes.a11y.spec.ts`) runs the FULL axe rule set
 * over EVERY route, but only in the default chrome (neutral/dark). That leaves
 * light mode and the four non-default themes ungated for contrast: a token edit
 * that darkens `muted-foreground` in `sunset/light`, or an under-contrast badge
 * in `emerald/dark`, would ship silently.
 *
 * This spec closes that hole with depth instead of breadth. It runs a
 * CONTRAST-ONLY axe scan (`runOnly: ["color-contrast"]`, WCAG 2/2.1 AA tags)
 * over a CURATED, representative set of routes across ALL 10 theme×mode combos.
 * We deliberately do NOT scan all ~191 routes × 10 combos (~1900 scans — far
 * over the CI budget); the default-theme gate already covers breadth, so here
 * we cover theme depth on a set chosen to exercise the diverse token/surface
 * pairs and every piece of chrome (nav, search, tabs, footer, cards, badges,
 * forms, tables, code, charts). ~30 routes × 10 combos ≈ 300 scans, run at
 * `--workers=4` (see the `test:contrast` script) to stay in budget.
 *
 * Themes are set exactly as the showcase does it: the value written to
 * `localStorage["cronus-ui-theme-v2"]` (`{ theme, mode }`) is read pre-paint by
 * `CronusThemeScript`, so `addInitScript` guarantees the very first paint is in
 * the target theme — no flash, no post-hydration reflow to race.
 *
 * `/` is omitted: ChromeThemeLock forces Neutral after hydrate, so a matrix
 * scan of the homepage cannot represent non-Neutral presets.
 *
 * `/stack` is omitted: the builder is a tall client island. Axe-on-hydrate
 * flakes (wrong theme on first paint) and the retries blow the browser job
 * budget. Default-theme axe still covers the route for breadth.
 */

const THEMES = ["aurora", "neutral", "midnight", "sunset", "emerald"] as const;
const MODES = ["light", "dark"] as const;
const STORAGE_KEY = "cronus-ui-theme-v2";

// Contrast-only, WCAG 2.0/2.1 AA. `serious`/`critical` block; anything softer
// is informational.
const CONTRAST_TAGS = ["wcag2aa", "wcag21aa"];
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

/**
 * A curated, REPRESENTATIVE contrast sweep — NOT the full route catalog.
 *
 * The default-theme gate (`core-routes.a11y.spec.ts`) covers every route for
 * breadth; this list is chosen to exercise the diverse token/surface pairs and
 * all the shared chrome (nav, search, tabs, footer, cards, badges, forms,
 * tables, code, charts) so a theme-specific contrast regression is caught on at
 * least one representative surface. Keep it lean — it multiplies by 10 combos.
 */
const ROUTES = [
  // Core pages — the full app chrome + docs prose + gallery grids.
  // Homepage `/` is Neutral-locked; contrast for the lock lives in flows.
  "/components",
  "/docs",
  "/create",
  "/themes",
  "/templates",
  "/changelog",
  "/docs/theming",
  "/docs/accessibility",
  // Component pages — a spread over the diverse token/surface pairs:
  // actions & status, form controls, tabs/nav, data/tables, calendars,
  // code/JSON surfaces, overlays, composed forms, metrics, charts.
  "/components/button",
  "/components/badge",
  "/components/alert",
  "/components/input",
  "/components/select",
  "/components/tabs",
  "/components/data-table",
  "/components/calendar",
  "/components/code-tabs",
  "/components/json-viewer",
  "/components/slider",
  "/components/tooltip",
  "/components/form",
  "/components/metric",
  "/components/stepper",
  "/components/chart",
  // Blocks — dense, real-world compositions that stack many surfaces at once.
  "/blocks/dashboard",
  "/blocks/pricing",
  "/blocks/login",
  "/blocks/email-receipt",
] as const;

type ContrastData = {
  fgColor?: string;
  bgColor?: string;
  contrastRatio?: number;
  expectedContrastRatio?: string | number;
  fontSize?: string;
  fontWeight?: string;
};

for (const theme of THEMES) {
  for (const mode of MODES) {
    for (const path of ROUTES) {
      test(`contrast: ${theme}/${mode} ${path}`, async ({ page }) => {
        // Seed the theme BEFORE any script runs so CronusThemeScript picks it up
        // pre-paint — the first paint is already in the target theme.
        await page.addInitScript(
          ([key, t, m]) => {
            localStorage.setItem(key, JSON.stringify({ theme: t, mode: m }));
          },
          [STORAGE_KEY, theme, mode] as const,
        );

        // `load` not `networkidle`: /templates (and Pro thumbs) keep iframe
        // preview requests open, so networkidle never settles in CI.
        await page.goto(path, { waitUntil: "load" });
        await expect(page.locator("html")).toHaveAttribute("data-cronus-theme", theme);
        await expect(page.locator("html")).toHaveAttribute("data-cronus-mode", mode);
        // Scan settled, hydrated DOM.
        await expect(page.locator("main#main-content, main").first()).toBeVisible();
        // Scroll the whole page so below-fold lazy/reveal sections mount before
        // the scan — otherwise coverage is non-deterministic (a tinted badge that
        // only renders below the fold could slip past a shorter run).
        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              let y = 0;
              const step = () => {
                window.scrollTo(0, y);
                y += Math.round(window.innerHeight * 0.9);
                if (y < document.body.scrollHeight) requestAnimationFrame(step);
                else {
                  window.scrollTo(0, 0);
                  resolve();
                }
              };
              step();
            }),
        );
        await page.waitForTimeout(300);

        const results = await new AxeBuilder({ page })
          .withTags(CONTRAST_TAGS)
          .options({ runOnly: ["color-contrast"] })
          .analyze();

        const blocking = results.violations.filter(
          (v) => v.impact != null && BLOCKING_IMPACTS.has(v.impact),
        );

        const summary = blocking
          .flatMap((v) =>
            v.nodes.map((node) => {
              const data = (node.any[0]?.data ?? {}) as ContrastData;
              const fg = data.fgColor ?? "?";
              const bg = data.bgColor ?? "?";
              const ratio = data.contrastRatio != null ? data.contrastRatio.toFixed(2) : "?";
              const need = data.expectedContrastRatio ?? "?";
              const target = node.target.join(" ").slice(0, 100);
              return `  • fg ${fg} on bg ${bg} = ${ratio}:1 (need ${need})\n      at ${target}`;
            }),
          )
          .join("\n");

        const nodeCount = blocking.reduce((n, v) => n + v.nodes.length, 0);

        expect(
          blocking,
          blocking.length > 0
            ? `${theme}/${mode} ${path}: ${nodeCount} color-contrast violation(s) — a theme token pair fails WCAG AA:\n${summary}`
            : undefined,
        ).toEqual([]);
      });
    }
  }
}
