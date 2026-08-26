import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { RetroGrid } from "./retro-grid.js";

describe("RetroGrid", () => {
  it("renders children above a decorative floor", () => {
    render(
      <RetroGrid>
        <span>Floor</span>
      </RetroGrid>,
    );
    expect(screen.getByText("Floor")).toBeInTheDocument();
    const root = screen.getByText("Floor").closest('[data-slot="retro-grid"]');
    expect(root?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <RetroGrid>
        <p>content</p>
      </RetroGrid>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
