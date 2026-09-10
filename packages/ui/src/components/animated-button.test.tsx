import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AnimatedButton } from "./animated-button.js";

const reducedMotion = vi.hoisted(() => ({ current: false }));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => reducedMotion.current,
  };
});

afterEach(() => {
  reducedMotion.current = false;
});

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

  it("stays a pressable button under prefers-reduced-motion", async () => {
    reducedMotion.current = true;
    const onClick = vi.fn();
    render(<AnimatedButton onClick={onClick}>Go</AnimatedButton>);
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveAttribute("data-slot", "animated-button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
