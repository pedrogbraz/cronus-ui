import { render, screen } from "@testing-library/react";
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

  it("starts on the first word and steps through the set", async () => {
    vi.useRealTimers();
    render(
      <AnimatePresence>
        <WordsPreloader
          layout="contained"
          words={["Compose", "Theme"]}
          firstDelayMs={50}
          stepDelayMs={50}
        />
      </AnimatePresence>,
    );
    expect(document.querySelector('[data-slot="slide-up-text"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="slide-up-text"] .sr-only')?.textContent).toBe(
      "Compose",
    );
    await vi.waitFor(
      () => {
        expect(document.querySelector('[data-slot="slide-up-text"] .sr-only')?.textContent).toBe(
          "Theme",
        );
      },
      { timeout: 2000 },
    );
  });

  it("exposes a busy status region", () => {
    render(<WordsPreloader layout="contained" />);
    const status = screen.getByRole("status", { name: "Loading" });
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("data-slot", "words-preloader");
  });

  it("accepts a custom word list", () => {
    render(<WordsPreloader layout="contained" words={["Oi", "Hey"]} />);
    expect(document.querySelector('[data-slot="slide-up-text"] .sr-only')?.textContent).toBe("Oi");
    expect(DEFAULT_PRELOADER_WORDS).toEqual([
      "The innovation of interfaces.",
      "One system. The whole product follows.",
    ]);
  });

  it("renders the end mark after the last line", async () => {
    vi.useRealTimers();
    render(
      <WordsPreloader
        layout="contained"
        words={["Compose"]}
        firstDelayMs={40}
        lastHoldMs={400}
        end={<span>Mark</span>}
      />,
    );
    expect(document.querySelector('[data-slot="slide-up-text"] .sr-only')?.textContent).toBe(
      "Compose",
    );
    expect(await screen.findByText("Mark", {}, { timeout: 2500 })).toBeInTheDocument();
  });

  it("calls onComplete after the last word is held", async () => {
    vi.useRealTimers();
    const onComplete = vi.fn();
    render(
      <WordsPreloader
        layout="contained"
        words={["Oi", "Hey"]}
        firstDelayMs={80}
        stepDelayMs={80}
        lastHoldMs={60}
        onComplete={onComplete}
      />,
    );
    await vi.waitFor(
      () => {
        expect(document.querySelector('[data-slot="slide-up-text"] .sr-only')?.textContent).toBe(
          "Hey",
        );
      },
      { timeout: 2000 },
    );
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), { timeout: 2000 });
  });

  it("has no axe violations", async () => {
    vi.useRealTimers();
    const { container } = render(<WordsPreloader layout="contained" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
