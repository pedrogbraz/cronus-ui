import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { StarBorder } from "./star-border.js";

describe("StarBorder", () => {
  it("renders children above decorative sparkles", () => {
    render(
      <StarBorder>
        <span>Featured</span>
      </StarBorder>,
    );
    expect(screen.getByText("Featured")).toBeInTheDocument();
    const root = screen.getByText("Featured").closest('[data-slot="star-border"]');
    expect(root?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <StarBorder>
        <p>content</p>
      </StarBorder>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
