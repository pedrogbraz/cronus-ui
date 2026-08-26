import { expect, test } from "@playwright/test";

/**
 * Package-manager install tabs (Radix Tabs) on /docs/installation.
 *
 * Asserts the Radix tablist semantics and keyboard navigability:
 *   - exposes role="tablist" with role="tab" children (pnpm/npm/yarn/bun)
 *   - default selected tab is pnpm (aria-selected=true)
 *   - ArrowRight moves the active tab via Radix's roving tabindex, updating
 *     aria-selected and the rendered command (role="tabpanel")
 *   - first tablist is the create-cronus-app scaffold (init tabs remain below)
 *
 * This proves the Radix wiring used everywhere install/CLI commands appear.
 */
test.describe("install tabs (package manager)", () => {
  test("exposes tablist/tab roles and is keyboard navigable", async ({ page }) => {
    await page.goto("/docs/installation", { waitUntil: "load" });

    // There can be multiple PackageManagerTabs on the page; scope to the first
    // tablist and its tabs.
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();

    // Exact names: "npm" is a substring of "pnpm", so use exact matching to
    // avoid a strict-mode multi-match.
    const pnpmTab = tablist.getByRole("tab", { name: "pnpm", exact: true });
    const npmTab = tablist.getByRole("tab", { name: "npm", exact: true });
    await expect(pnpmTab).toBeVisible();
    await expect(npmTab).toBeVisible();

    // Default selection is pnpm.
    await expect(pnpmTab).toHaveAttribute("aria-selected", "true");
    await expect(npmTab).toHaveAttribute("aria-selected", "false");

    // The first tablist is the recommended create-cronus-app path. Its selected
    // panel shows the pnpm scaffold command.
    const panel = page
      .getByRole("tabpanel")
      .filter({ hasText: /pnpm dlx create-cronus-app/ })
      .first();
    await expect(panel).toBeVisible();

    // init tabs remain on the page (existing-app path).
    await expect(
      page.getByRole("tabpanel").filter({ hasText: /pnpm dlx cronus-ui@latest init/ }),
    ).toBeVisible();

    // Keyboard: focus the active tab, ArrowRight activates the next tab (npm).
    // Radix uses automatic activation, so ArrowRight both moves focus and
    // selects.
    await pnpmTab.focus();
    await expect(pnpmTab).toBeFocused();
    await page.keyboard.press("ArrowRight");

    await expect(npmTab).toBeFocused();
    await expect(npmTab).toHaveAttribute("aria-selected", "true");
    await expect(pnpmTab).toHaveAttribute("aria-selected", "false");

    // The first tablist's visible command should now be the npm scaffold.
    const npmPanel = page
      .getByRole("tabpanel")
      .filter({ hasText: /npx create-cronus-app/ })
      .first();
    await expect(npmPanel).toBeVisible();
  });
});
