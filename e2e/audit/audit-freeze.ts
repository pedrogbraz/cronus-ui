import type { FrameLocator, Page } from "@playwright/test";

export const FREEZE_CSS = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
    caret-color: transparent !important;
  }
`;

export const SCREENSHOT_OPTIONS = {
  animations: "disabled" as const,
  maxDiffPixelRatio: 0.02,
};

export async function freezeFrame(frame: FrameLocator): Promise<void> {
  await frame.locator("[data-audit-canvas]").evaluate((el, css) => {
    const doc = el.ownerDocument;
    const tag = doc.createElement("style");
    tag.setAttribute("data-audit-freeze", "");
    tag.textContent = css;
    doc.head.appendChild(tag);
  }, FREEZE_CSS);
}

export function cronusFrame(page: Page): FrameLocator {
  return page.frameLocator('[data-audit-side="cronus"] iframe');
}
