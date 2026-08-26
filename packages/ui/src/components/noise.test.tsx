import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Noise } from "./noise.js";

describe("Noise", () => {
  it("renders children above a decorative grain overlay", () => {
    render(
      <Noise>
        <span>Grain</span>
      </Noise>,
    );
    expect(screen.getByText("Grain")).toBeInTheDocument();
    const root = screen.getByText("Grain").closest('[data-slot="noise"]');
    expect(root?.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Noise>
        <p>content</p>
      </Noise>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
