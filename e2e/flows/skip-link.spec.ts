import { expect, test } from "@playwright/test";

/**
 * Skip link keyboard flow.
 *
 * The skip link is the first focusable element in <body> and is visually
 * hidden (`sr-only`) until focused. Tabbing once from the top of the page must
 * reveal it; activating it must move focus to <main id="main-content">.
 *
 * This guards the bypass-block hardening (WCAG 2.4.1) end-to-end, in a real
 * browser, including the focus-visible reveal and the in-page anchor jump.
 */
test.describe("skip link", () => {
  test("first Tab reveals 'Skip to content' and activating it focuses #main-content", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });

    // Ensure focus starts at the document root (no element focused), so the
    // first Tab lands on the very first focusable element — the skip link.
    // (A real mouse click on <body> would move focus and defeat the check.)
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: "Skip to content" });
    // It must now be the focused element AND visually shown (left sr-only).
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute("href", "#main-content");

    // Activating it performs the in-page jump to #main-content.
    await page.keyboard.press("Enter");

    const main = page.locator("main#main-content");
    await expect(main).toBeVisible();
    // The browser's fragment navigation sets the URL hash; assert the jump.
    await expect(page).toHaveURL(/#main-content$/);

    // The real user guarantee of a skip link: the browser sets <main> as the
    // sequential-focus starting point, so the NEXT Tab moves focus to the first
    // focusable element inside (or after) <main> — never back into the nav.
    // <main> has no tabindex, so `activeElement === main` is not reliable across
    // browsers; asserting "the next Tab lands in/after main" verifies the bypass
    // actually skipped the header.
    await page.keyboard.press("Tab");
    const focusLandedInOrAfterMain = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      const mainEl = document.getElementById("main-content");
      if (!active || !mainEl) return false;
      if (mainEl.contains(active)) return true;
      // "after main" in document order also proves the header was bypassed.
      const position = mainEl.compareDocumentPosition(active);
      return (position & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    });
    expect(focusLandedInOrAfterMain).toBe(true);
  });
});
