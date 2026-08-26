import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { GradientText } from "./gradient-text.js";

describe("GradientText", () => {
  it("renders its text content", () => {
    render(<GradientText>Cronus</GradientText>);
    const el = screen.getByText("Cronus");
    expect(el).toHaveAttribute("data-slot", "gradient-text");
  });

  it("renders as the child element when asChild is set", () => {
    render(
      <GradientText asChild>
        <h1>Heading</h1>
      </GradientText>,
    );
    const heading = screen.getByRole("heading", { name: "Heading" });
    expect(heading).toHaveAttribute("data-slot", "gradient-text");
  });

  it("has no axe violations", async () => {
    const { container } = render(<GradientText>Gradient</GradientText>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
