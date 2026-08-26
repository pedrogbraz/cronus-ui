import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import routes from "./routes.generated.json" with { type: "json" };

/**
 * Accessibility coverage (axe-core) for EVERY Cronus UI route.
 *
 * For each route we run the full axe-core rule set, scoped to WCAG 2.0/2.1
 * A & AA tags, and assert ZERO violations at impact level `serious` or
 * `critical`. A fresh contrast failure, a missing label, a broken landmark, an
 * unnamed control — any of those fail the gate immediately, and the failure
 * message names the exact rule + a sample node so it's actionable.
 *
 * Coverage is comprehensive, not curated: the curated `CORE_PAGES` below carry
 * bespoke settle logic (the pages that hydrate async data), and every documented
 * component and block page is scanned from `routes.generated.json` — regenerated
 * by `scripts/build-a11y-routes.mjs` and drift-checked in CI (`a11y:routes:check`),
 * so a new component page is gated the moment it's documented.
 *
 * `serious`/`critical` are hard failures; `moderate`/`minor` (cosmetic
 * best-practice hints) are reported but not blocking — high signal, low noise.
 */

const BLOCKING_IMPACTS = new Set(["serious", "critical"]);
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

type Route = { path: string; label: string; settle?: (page: Page) => Promise<void> };

// Non-catalog pages. A few hydrate async content, so they get an explicit
// settle assertion before the scan runs against a stable DOM.
const CORE_PAGES: ReadonlyArray<Route> = [
  { path: "/", label: "home" },
  { path: "/components", label: "components overview" },
  { path: "/blocks", label: "blocks overview" },
  { path: "/templates", label: "templates" },
  { path: "/sponsor", label: "sponsor" },
  { path: "/templates/mail", label: "templates · mail" },
  { path: "/templates/saas", label: "templates · saas" },
  { path: "/templates/landing-studio", label: "templates · landing-studio" },
  { path: "/themes", label: "themes gallery" },
  {
    path: "/create",
    label: "create studio",
    settle: async (page) => {
      await expect(page.getByText("Spending breakdown")).toBeVisible();
    },
  },
  { path: "/stack", label: "stack builder" },
  { path: "/docs", label: "docs landing" },
  { path: "/docs/installation", label: "docs · installation" },
  { path: "/docs/cli", label: "docs · cli" },
  { path: "/docs/compare", label: "docs · compare" },
  { path: "/docs/theming", label: "docs · theming" },
  { path: "/docs/frameworks", label: "docs · frameworks" },
  { path: "/docs/accessibility", label: "docs · accessibility" },
  { path: "/docs/accessibility/conformance", label: "docs · conformance" },
  { path: "/changelog", label: "changelog" },
];

const COMPONENT_ROUTES: ReadonlyArray<Route> = routes.components.map((slug) => ({
  path: `/components/${slug}`,
  label: `components · ${slug}`,
}));

const BLOCK_ROUTES: ReadonlyArray<Route> = routes.blocks.map((slug) => ({
  path: `/blocks/${slug}`,
  label: `blocks · ${slug}`,
}));

const ALL_ROUTES: ReadonlyArray<Route> = [...CORE_PAGES, ...COMPONENT_ROUTES, ...BLOCK_ROUTES];

async function runAxe(page: Page) {
  return new AxeBuilder({ page })
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
}

for (const route of ALL_ROUTES) {
  test(`a11y: ${route.label} (${route.path}) has no serious/critical violations`, async ({
    page,
  }) => {
    await page.goto(route.path, { waitUntil: "networkidle" });
    // Wait for the route's main landmark so we scan settled, hydrated DOM.
    await expect(page.locator("main#main-content, main").first()).toBeVisible();
    if (route.settle) await route.settle(page);

    const results = await runAxe(page);
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
        ? `axe found ${blocking.length} serious/critical violation(s) on ${route.path}:\n${summary}`
        : undefined,
    ).toEqual([]);
  });
}
