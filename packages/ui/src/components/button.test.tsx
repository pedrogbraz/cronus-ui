import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./button.js";

describe("Button", () => {
  it("renders its label as an accessible button", () => {
    render(<Button>Save profile</Button>);
    expect(screen.getByRole("button", { name: "Save profile" })).toBeInTheDocument();
  });

  it("fires onClick when activated", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick while disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        No
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "No" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("paints primary with the theme pair, not a darkened mix or a gradient", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("text-primary-foreground");
    expect(button.className).not.toContain("gradient");
    expect(button.className).not.toContain("color-mix");
  });

  it("gives the destructive variant an AA-contrast foreground on the error surface", () => {
    // `text-white` must sit on the darkened error mix (not the raw `bg-error`,
    // which fails AA in the dark themes) — see button.tsx for the ratios.
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveClass("text-white");
    expect(button.className).toContain("color-mix(in_oklch,var(--kronus-error),black_30%)");
    expect(button.className).not.toContain("bg-error");
  });

  it("renders as the child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/pricing">Pricing</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link).toHaveAttribute("href", "/pricing");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
