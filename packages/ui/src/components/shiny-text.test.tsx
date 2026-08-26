import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ShinyText } from "./shiny-text.js";

describe("ShinyText", () => {
  it("renders its text content", () => {
    render(<ShinyText>Shimmer</ShinyText>);
    expect(screen.getByText("Shimmer")).toBeInTheDocument();
    expect(screen.getByText("Shimmer").closest('[data-slot="shiny-text"]')).toBeTruthy();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ShinyText>Shimmer</ShinyText>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
