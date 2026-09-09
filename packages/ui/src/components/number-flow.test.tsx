import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { NumberFlow } from "./number-flow.js";

describe("NumberFlow", () => {
  it("exposes the formatted value as the accessible name on first paint", () => {
    render(<NumberFlow value={1234} locale="en-US" reducedMotion="always" />);
    expect(screen.getByRole("img", { name: "1,234" })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='number-flow']")).toBeInTheDocument();
  });

  it("draws prefix and suffix around the formatted number", () => {
    render(<NumberFlow value={42} prefix="$" suffix="/mo" locale="en-US" reducedMotion="always" />);
    expect(screen.getByRole("img", { name: "$42/mo" })).toBeInTheDocument();
  });

  it("formats currency with two fraction digits; the symbol is prefix", () => {
    render(
      <NumberFlow
        value={19348.43}
        prefix="$"
        format="currency"
        locale="en-US"
        reducedMotion="always"
      />,
    );
    expect(screen.getByRole("img", { name: "$19,348.43" })).toBeInTheDocument();
  });

  it("formats percentage through Intl (0.42 → 42%)", () => {
    render(<NumberFlow value={0.42} format="percentage" locale="en-US" reducedMotion="always" />);
    expect(screen.getByRole("img", { name: "42%" })).toBeInTheDocument();
  });

  it("honours locale grouping", () => {
    render(<NumberFlow value={1234} locale="de-DE" reducedMotion="always" />);
    expect(screen.getByRole("img", { name: "1.234" })).toBeInTheDocument();
  });

  it("sanitizes a non-finite value to 0 (never the literal NaN/∞)", () => {
    render(<NumberFlow value={Number.NaN} locale="en-US" reducedMotion="always" />);
    const node = screen.getByRole("img");
    expect(node.getAttribute("aria-label")).not.toContain("NaN");
    expect(node).toHaveAttribute("aria-label", "0");
  });

  it("updates the accessible name when value changes", () => {
    const { rerender } = render(<NumberFlow value={100} locale="en-US" reducedMotion="always" />);
    expect(screen.getByRole("img", { name: "100" })).toBeInTheDocument();
    rerender(<NumberFlow value={250} locale="en-US" reducedMotion="always" />);
    expect(screen.getByRole("img", { name: "250" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <NumberFlow
        value={12345}
        prefix="$"
        format="currency"
        locale="en-US"
        reducedMotion="always"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
