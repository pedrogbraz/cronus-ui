import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TextShimmer } from "./text-shimmer.js";

describe("TextShimmer", () => {
  it("renders the shimmering phrase", () => {
    render(<TextShimmer>Thinking</TextShimmer>);
    const el = screen.getByText("Thinking");
    expect(el).toHaveAttribute("data-slot", "text-shimmer");
  });

  it("accepts duration and spread props", () => {
    render(
      <TextShimmer duration={1.5} spread={3}>
        Loading
      </TextShimmer>,
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TextShimmer>Thinking</TextShimmer>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
