import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SpinningText } from "./spinning-text.js";

describe("SpinningText", () => {
  it("exposes the phrase to assistive tech once", () => {
    render(<SpinningText>Cronus UI</SpinningText>);
    expect(screen.getByText("Cronus UI")).toHaveClass("sr-only");
    expect(document.querySelector('[data-slot="spinning-text"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(<SpinningText>Cronus UI</SpinningText>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
