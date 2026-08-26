import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AnimatedButton } from "./animated-button.js";

describe("AnimatedButton", () => {
  it("renders its label as an accessible button", () => {
    render(<AnimatedButton>Get started</AnimatedButton>);
    const button = screen.getByRole("button", { name: "Get started" });
    expect(button).toHaveAttribute("data-slot", "animated-button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("fires onClick when activated", async () => {
    const onClick = vi.fn();
    render(<AnimatedButton onClick={onClick}>Go</AnimatedButton>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("has no axe violations", async () => {
    const { container } = render(<AnimatedButton variant="primary">Action</AnimatedButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
