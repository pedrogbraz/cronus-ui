import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Particles } from "./particles.js";

describe("Particles", () => {
  it("renders children above a decorative canvas", () => {
    render(
      <Particles>
        <span>Field</span>
      </Particles>,
    );
    expect(screen.getByText("Field")).toBeInTheDocument();
    const root = screen.getByText("Field").closest('[data-slot="particles"]');
    expect(root?.querySelector("canvas[aria-hidden='true']")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Particles>
        <p>content</p>
      </Particles>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
