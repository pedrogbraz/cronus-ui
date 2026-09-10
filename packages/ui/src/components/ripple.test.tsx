import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Ripple } from "./ripple.js";

describe("Ripple", () => {
  it("renders children above a decorative ripple layer", () => {
    render(
      <Ripple>
        <span>Hero</span>
      </Ripple>,
    );
    expect(screen.getByText("Hero")).toBeInTheDocument();
    const root = screen.getByText("Hero").closest('[data-slot="ripple"]');
    expect(root?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("keeps delayed rings at the 0% pose so they do not flash at full size", () => {
    const { container } = render(
      <Ripple count={3}>
        <span>Hero</span>
      </Ripple>,
    );
    const keyframes = container.querySelector("style")?.textContent ?? "";
    expect(keyframes).toContain("translate(-50%,-50%) scale(0)");
    const ring = container.querySelector("[data-slot='ripple'] [aria-hidden] span");
    expect(ring?.className).toContain("[animation-fill-mode:backwards]");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Ripple>
        <p>content</p>
      </Ripple>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
