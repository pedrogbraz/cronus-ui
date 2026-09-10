import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { clearLinkPreviewCache, LinkPreview, type LinkPreviewMetadata } from "./link-preview.js";

const metadata: LinkPreviewMetadata = {
  title: "GAIA — Personal AI assistant",
  description: "Open-source assistant for tasks, email, and calendar.",
  favicon: "https://heygaia.io/favicon.ico",
  websiteName: "heygaia.io",
  image: "https://heygaia.io/og.png",
  url: "https://heygaia.io",
};

function mockIntersectionObserver() {
  const observe = vi.fn((element: Element) => {
    const observer = (element as HTMLElement & { __observer?: IntersectionObserver }).__observer;
    void observer;
  });
  class FakeIntersectionObserver {
    callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe(element: Element) {
      this.callback(
        [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
  }
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  return observe;
}

describe("LinkPreview", () => {
  beforeEach(() => {
    clearLinkPreviewCache();
    mockIntersectionObserver();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("unfurls metadata on hover after the link is in view", async () => {
    const user = userEvent.setup();
    const fetcher = vi.fn().mockResolvedValue(metadata);
    render(
      <LinkPreview href="https://heygaia.io" fetcher={fetcher}>
        GAIA
      </LinkPreview>,
    );
    expect(await screen.findByRole("link", { name: "GAIA" })).toHaveAttribute(
      "href",
      "https://heygaia.io",
    );
    expect(fetcher).toHaveBeenCalled();
    await user.hover(screen.getByRole("link", { name: "GAIA" }));
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("GAIA — Personal AI assistant");
    expect(tooltip).toHaveTextContent("Open-source assistant for tasks, email, and calendar.");
    expect(tooltip).toHaveTextContent("heygaia.io");
  });

  it("shows an invalid-url state for mailto links", async () => {
    const user = userEvent.setup();
    render(<LinkPreview href="mailto:hi@example.com">Email us</LinkPreview>);
    await user.hover(screen.getByRole("link", { name: "Email us" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Invalid URL");
  });

  it("has no axe violations while the preview is open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(
      <LinkPreview href="https://heygaia.io" fetcher={() => Promise.resolve(metadata)}>
        GAIA
      </LinkPreview>,
    );
    await user.hover(screen.getByRole("link", { name: "GAIA" }));
    await screen.findByRole("tooltip");
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
