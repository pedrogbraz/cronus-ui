import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { FlickeringGrid } from "./flickering-grid.js";

describe("FlickeringGrid", () => {
  it("renders children above a decorative cell field", () => {
    render(
      <FlickeringGrid columns={4} rows={3}>
        <span>Signal</span>
      </FlickeringGrid>,
    );
    expect(screen.getByText("Signal")).toBeInTheDocument();
    const root = screen.getByText("Signal").closest('[data-slot="flickering-grid"]');
    expect(root?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("does not flash cells at full opacity before the flicker delay", () => {
    const { container } = render(
      <FlickeringGrid columns={2} rows={2}>
        <span>Signal</span>
      </FlickeringGrid>,
    );
    const cell = container.querySelector("[data-slot='flickering-grid'] [aria-hidden] span");
    expect(cell?.className).toContain("[animation-fill-mode:backwards]");
    expect(cell?.className).toContain("opacity-[0.08]");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FlickeringGrid>
        <p>content</p>
      </FlickeringGrid>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
