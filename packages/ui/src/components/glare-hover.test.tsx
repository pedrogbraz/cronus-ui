import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { GlareHover } from "./glare-hover.js";

describe("GlareHover", () => {
  it("renders children on a glare surface", () => {
    render(
      <GlareHover>
        <span>Card</span>
      </GlareHover>,
    );
    expect(screen.getByText("Card")).toBeInTheDocument();
    expect(screen.getByText("Card").closest('[data-slot="glare-hover"]')).toBeTruthy();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <GlareHover>
        <p>content</p>
      </GlareHover>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
