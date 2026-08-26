import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TypingText } from "./typing-text.js";

describe("TypingText", () => {
  it("renders the first phrase immediately when motion is forced off", () => {
    render(<TypingText text="Ship faster" reducedMotion="never" />);
    expect(screen.getByText("Ship faster")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="typing-text"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TypingText text="Hello" reducedMotion="never" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
