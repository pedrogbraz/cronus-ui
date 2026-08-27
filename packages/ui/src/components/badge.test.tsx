import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Badge } from "./badge.js";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies the destructive variant classes", () => {
    render(<Badge variant="destructive">Failed</Badge>);
    const badge = screen.getByText("Failed");
    expect(badge).toHaveClass("text-error-strong");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("data-variant", "destructive");
  });

  it("applies the success variant classes", () => {
    render(<Badge variant="success">Paid</Badge>);
    expect(screen.getByText("Paid")).toHaveClass("text-success-strong");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Badge variant="primary">Beta</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
