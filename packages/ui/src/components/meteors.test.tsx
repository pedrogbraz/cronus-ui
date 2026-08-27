import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Meteors } from "./meteors.js";

describe("Meteors", () => {
  it("renders children above a decorative meteor field", () => {
    render(
      <Meteors count={4}>
        <span>Night</span>
      </Meteors>,
    );
    expect(screen.getByText("Night")).toBeInTheDocument();
    const root = screen.getByText("Night").closest('[data-slot="meteors"]');
    expect(root?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("animates along a rotated axis so streaks fall diagonally", () => {
    const { container } = render(
      <Meteors count={1}>
        <span>Night</span>
      </Meteors>,
    );
    const keyframes = container.querySelector("style")?.textContent ?? "";
    expect(keyframes).toContain("rotate(var(--meteor-angle))");
    const streak = container.querySelector("[data-slot='meteors'] [aria-hidden] span");
    expect(streak?.getAttribute("style") ?? "").toContain("--meteor-angle: 122deg");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Meteors>
        <p>content</p>
      </Meteors>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
