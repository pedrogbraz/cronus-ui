import type { ThemeOverrides } from "@cronus-ui/tokens";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CronusUIProvider } from "./provider.js";

const root = () => document.documentElement;

afterEach(() => {
  // The asRoot provider sets --cronus-* vars on <html> on mount and removes them
  // on unmount, but reset defensively so a failed assertion can't leak state.
  root().style.cssText = "";
});

describe("CronusUIProvider — nested island", () => {
  it("sets text-fg on the wrapper so color is not inherited from chrome", () => {
    const { container } = render(
      <CronusUIProvider defaultThemeName="aurora" defaultModeName="dark">
        <span>child</span>
      </CronusUIProvider>,
    );
    const island = container.querySelector("[data-cronus-theme='aurora']");
    expect(island).toHaveClass("text-fg");
    expect(island).toHaveClass("dark");
    expect(island).toHaveAttribute("data-cronus-mode", "dark");
  });
});

describe("CronusUIProvider — reactive overrides", () => {
  it("applies the overrides prop to <html> when asRoot", () => {
    render(
      <CronusUIProvider asRoot overrides={{ radius: "20px" }}>
        <div>child</div>
      </CronusUIProvider>,
    );

    expect(root().style.getPropertyValue("--cronus-radius")).toBe("20px");
  });

  it("does NOT loop or reset when re-rendered with a new object of equal content", () => {
    const { rerender } = render(
      <CronusUIProvider asRoot overrides={{ radius: "20px" }}>
        <div>child</div>
      </CronusUIProvider>,
    );
    expect(root().style.getPropertyValue("--cronus-radius")).toBe("20px");

    // A brand-new object reference with identical content (the inline-object
    // case the provider must tolerate) — the var must stay put.
    rerender(
      <CronusUIProvider asRoot overrides={{ radius: "20px" }}>
        <div>child</div>
      </CronusUIProvider>,
    );

    expect(root().style.getPropertyValue("--cronus-radius")).toBe("20px");
  });

  it("updates the CSS var when the overrides CONTENT changes", () => {
    const { rerender } = render(
      <CronusUIProvider asRoot overrides={{ radius: "20px" }}>
        <div>child</div>
      </CronusUIProvider>,
    );
    expect(root().style.getPropertyValue("--cronus-radius")).toBe("20px");

    const next: ThemeOverrides = { radius: "4px", primary: "oklch(0.6 0.2 30)" };
    rerender(
      <CronusUIProvider asRoot overrides={next}>
        <div>child</div>
      </CronusUIProvider>,
    );

    expect(root().style.getPropertyValue("--cronus-radius")).toBe("4px");
    expect(root().style.getPropertyValue("--cronus-primary")).toBe("oklch(0.6 0.2 30)");
  });
});
