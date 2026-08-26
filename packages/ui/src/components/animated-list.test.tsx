import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AnimatedList } from "./animated-list.js";

describe("AnimatedList", () => {
  it("renders each child as a list item", () => {
    render(
      <AnimatedList reducedMotion="always">
        <span key="a">Alpha</span>
        <span key="b">Beta</span>
      </AnimatedList>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-slot", "animated-list");
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AnimatedList reducedMotion="always">
        <span key="a">Alpha</span>
      </AnimatedList>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
