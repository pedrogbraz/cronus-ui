import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Confetti } from "./confetti.js";

describe("Confetti", () => {
  it("renders children above a decorative canvas", () => {
    render(
      <Confetti>
        <button type="button">Celebrate</button>
      </Confetti>,
    );
    expect(screen.getByRole("button", { name: "Celebrate" })).toBeInTheDocument();
    const root = document.querySelector('[data-slot="confetti"]');
    expect(root?.querySelector("canvas[aria-hidden='true']")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Confetti>
        <button type="button">Celebrate</button>
      </Confetti>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
