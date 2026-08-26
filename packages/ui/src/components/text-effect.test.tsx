import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TextEffect } from "./text-effect.js";

// TextEffect calls motion's `useInView`, which constructs an IntersectionObserver
// even for `trigger="mount"`. jsdom has no IntersectionObserver, so without a
// stub the in-view effect throws on mount. A no-op stub (never firing "in view")
// is enough: every test below uses `trigger="mount"`, so the reveal plays
// regardless of intersection, and the accessible sr-only label is always present.
beforeAll(() => {
  if (!("IntersectionObserver" in globalThis)) {
    class IntersectionObserverStub {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): [] {
        return [];
      }
    }
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
      IntersectionObserverStub;
  }
});

describe("TextEffect", () => {
  it("exposes the full string in the accessible tree exactly once (sr-only)", () => {
    const text = "Welcome to Cronus";
    const { container } = render(<TextEffect trigger="mount">{text}</TextEffect>);
    // getByText (default exact match against accessible text) finds the single
    // sr-only copy; the animated per-unit spans are aria-hidden.
    const srOnly = screen.getByText(text);
    expect(srOnly).toHaveClass("sr-only");
    // Only one node holds the whole clean string.
    const matches = Array.from(container.querySelectorAll("*")).filter(
      (el) => el.childNodes.length === 1 && el.textContent === text,
    );
    expect(matches).toHaveLength(1);
  });

  it("marks the animated tree aria-hidden so the string is announced once", () => {
    const { container } = render(<TextEffect trigger="mount">Hello world</TextEffect>);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toHaveClass("sr-only");
  });

  it("still exposes the whole text with per='char'", () => {
    const text = "Pricing";
    render(
      <TextEffect per="char" trigger="mount">
        {text}
      </TextEffect>,
    );
    expect(screen.getByText(text)).toHaveClass("sr-only");
  });

  it("renders with reducedMotion='never'", () => {
    const text = "Always animate";
    const { container } = render(
      <TextEffect reducedMotion="never" trigger="mount">
        {text}
      </TextEffect>,
    );
    expect(container.querySelector('[data-slot="text-effect"]')).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("renders the requested wrapper element via `as`", () => {
    render(
      <TextEffect as="h1" trigger="mount">
        Big title
      </TextEffect>,
    );
    expect(screen.getByRole("heading", { name: "Big title", level: 1 })).toBeInTheDocument();
  });

  it("preserves the string across multi-word input (words split but label intact)", () => {
    const text = "Reveal me word by word";
    render(<TextEffect trigger="mount">{text}</TextEffect>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <TextEffect as="h2" trigger="mount">
        Accessible reveal
      </TextEffect>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
