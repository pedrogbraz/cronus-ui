import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { GridPattern } from "./grid-pattern.js";

describe("GridPattern", () => {
  it("renders children above a decorative svg grid", () => {
    render(
      <GridPattern>
        <span>Grid</span>
      </GridPattern>,
    );
    expect(screen.getByText("Grid")).toBeInTheDocument();
    const root = screen.getByText("Grid").closest('[data-slot="grid-pattern"]');
    expect(root?.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <GridPattern>
        <p>content</p>
      </GridPattern>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
