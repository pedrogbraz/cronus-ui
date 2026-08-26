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

  it("has no axe violations", async () => {
    const { container } = render(
      <Ripple>
        <p>content</p>
      </Ripple>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
