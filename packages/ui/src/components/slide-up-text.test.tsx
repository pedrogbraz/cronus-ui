import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SlideUpText, type SlideUpTextRef } from "./slide-up-text.js";

const reducedMotion = vi.hoisted(() => ({ current: false }));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => reducedMotion.current,
  };
});

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

afterEach(() => {
  reducedMotion.current = false;
});

describe("SlideUpText", () => {
  it("exposes the full string once via an sr-only copy", () => {
    const text = "You can just ship things.";
    const { container } = render(<SlideUpText>{text}</SlideUpText>);
    const srOnly = screen.getByText(text);
    expect(srOnly).toHaveClass("sr-only");
    const matches = Array.from(container.querySelectorAll("*")).filter(
      (el) => el.childNodes.length === 1 && el.textContent === text,
    );
    expect(matches).toHaveLength(1);
  });

  it("marks the animated tree aria-hidden so the string is announced once", () => {
    const { container } = render(<SlideUpText>Hello world</SlideUpText>);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toHaveClass("sr-only");
    expect(container.querySelector('[data-slot="slide-up-text"]')).toBeInTheDocument();
  });

  it("still exposes the whole text with split='characters'", () => {
    const text = "Pricing";
    render(<SlideUpText split="characters">{text}</SlideUpText>);
    expect(screen.getByText(text)).toHaveClass("sr-only");
  });

  it("still exposes the whole text with split='lines'", () => {
    const text = "First line\nSecond line";
    const { container } = render(<SlideUpText split="lines">{text}</SlideUpText>);
    expect(container.querySelector(".sr-only")?.textContent).toBe(text);
  });

  it("exposes startAnimation and reset on animationRef", () => {
    const animationRef = createRef<SlideUpTextRef>();
    render(
      <SlideUpText autoStart={false} animationRef={animationRef}>
        Hello
      </SlideUpText>,
    );
    expect(animationRef.current?.startAnimation).toBeTypeOf("function");
    animationRef.current?.startAnimation();
    animationRef.current?.reset();
  });

  it("fires onStart when autoStart plays", () => {
    const onStart = vi.fn();
    render(
      <SlideUpText autoStart onStart={onStart}>
        Hello
      </SlideUpText>,
    );
    expect(onStart).toHaveBeenCalledOnce();
  });

  it("has no axe violations", async () => {
    const { container } = render(<SlideUpText>You can just ship things.</SlideUpText>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("keeps the sr-only string and skips the clip-in under prefers-reduced-motion", () => {
    reducedMotion.current = true;
    const text = "You can just ship things.";
    const { container } = render(<SlideUpText>{text}</SlideUpText>);
    expect(screen.getByText(text)).toHaveClass("sr-only");
    const pieces = container.querySelectorAll('[aria-hidden="true"] .inline-block');
    expect(pieces.length).toBeGreaterThan(0);
    for (const piece of pieces) {
      const transform = (piece as HTMLElement).style.transform;
      expect(transform === "" || transform === "none" || !transform.includes("100%")).toBe(true);
    }
  });
});
