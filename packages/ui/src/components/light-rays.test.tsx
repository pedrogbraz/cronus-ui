import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { LightRays } from "./light-rays.js";

describe("LightRays", () => {
  it("renders children above decorative rays", () => {
    render(
      <LightRays>
        <span>Sun</span>
      </LightRays>,
    );
    expect(screen.getByText("Sun")).toBeInTheDocument();
    const root = screen.getByText("Sun").closest('[data-slot="light-rays"]');
    expect(root?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <LightRays>
        <p>content</p>
      </LightRays>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
