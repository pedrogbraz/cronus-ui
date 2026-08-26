import { expect, test } from "@playwright/test";

/**
 * Command palette (cmdk) flow.
 *
 * Proves three things at once:
 *   1. The palette opens via the keyboard shortcut (Meta/Ctrl + K). This also
 *      exercises the lazy-load: the cmdk dialog is `next/dynamic(ssr:false)` and
 *      only imports after intent, so a working open proves the dynamic import
 *      resolves in the browser.
 *   2. Typing a block term ("pricing") surfaces the indexed block item — proof
 *      the block/variant search index is built and fuzzy-matched (incl. the
 *      curated aliases for "pricing": plans/tiers/billing…).
 *   3. Selecting that item navigates to the correct /blocks route.
 *
 * A second case repeats with "login" (auth alias) to prove the alias index is
 * not a one-off.
 */

// Meta on macOS/WebKit; Control elsewhere. The listener accepts either, and
// Playwright's "ControlOrMeta" maps to the right platform key.
const OPEN_PALETTE = "ControlOrMeta+KeyK";

test.describe("command palette", () => {
  test("opens via Ctrl/Meta+K, finds the 'pricing' block, and navigates to it", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });

    // Open via shortcut — this triggers the dynamic import of the cmdk dialog.
    await page.keyboard.press(OPEN_PALETTE);

    const dialog = page.getByRole("dialog", { name: "Search documentation" });
    await expect(dialog).toBeVisible();

    const input = page.getByPlaceholder("Search documentation…");
    await expect(input).toBeFocused();

    await input.fill("pricing");

    // The Pricing block item should appear in the cmdk list. cmdk renders
    // matching items as role=option; match the visible primary label.
    const pricingOption = page.getByRole("option", { name: /pricing/i }).first();
    await expect(pricingOption).toBeVisible();

    await pricingOption.click();

    // Routes to a /blocks/pricing... path (block or one of its variants).
    await expect(page).toHaveURL(/\/blocks\/pricing(\/.*)?$/);
    // Dialog closes after selection.
    await expect(dialog).toBeHidden();
  });

  test("alias search: typing 'login' surfaces the auth block and navigates", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });

    await page.keyboard.press(OPEN_PALETTE);
    const dialog = page.getByRole("dialog", { name: "Search documentation" });
    await expect(dialog).toBeVisible();

    const input = page.getByPlaceholder("Search documentation…");
    await input.fill("login");

    const loginOption = page.getByRole("option", { name: /login/i }).first();
    await expect(loginOption).toBeVisible();

    await loginOption.click();
    await expect(page).toHaveURL(/\/blocks\/login(\/.*)?$/);
  });

  test("Escape closes the palette", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });

    await page.keyboard.press(OPEN_PALETTE);
    const dialog = page.getByRole("dialog", { name: "Search documentation" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
