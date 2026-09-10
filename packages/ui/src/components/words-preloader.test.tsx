import { act, render, screen } from "@testing-library/react";
import { AnimatePresence } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { DEFAULT_PRELOADER_WORDS, WordsPreloader } from "./words-preloader.js";

class ResizeObserverStub {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    const rect = { width: 800, height: 500, top: 0, left: 0, bottom: 500, right: 800, x: 0, y: 0 };
    this.callback(
      [
        {
          target,
          contentRect: rect as DOMRectReadOnly,
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        },
      ],
      this as unknown as ResizeObserver,
    );
  }
  unobserve() {}
  disconnect() {}
}

describe("WordsPreloader", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 800,
      height: 500,
      top: 0,
      left: 0,
      bottom: 500,
      right: 800,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    });
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("starts on the first greeting and steps through the set", () => {
    render(
      <AnimatePresence>
        <WordsPreloader layout="contained" />
      </AnimatePresence>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByText("Ciao")).toBeInTheDocument();
  });

  it("exposes a busy status region", () => {
    render(<WordsPreloader layout="contained" />);
    const status = screen.getByRole("status", { name: "Loading" });
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("data-slot", "words-preloader");
  });

  it("accepts a custom word list", () => {
    render(<WordsPreloader layout="contained" words={["Oi", "Hey"]} />);
    expect(screen.getByText("Oi")).toBeInTheDocument();
    expect(DEFAULT_PRELOADER_WORDS[0]).toBe("Hello");
    expect(DEFAULT_PRELOADER_WORDS).toContain("ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ");
  });

  it("has no axe violations", async () => {
    vi.useRealTimers();
    const { container } = render(<WordsPreloader layout="contained" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
