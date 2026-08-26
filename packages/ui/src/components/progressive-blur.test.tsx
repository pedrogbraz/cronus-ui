import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ProgressiveBlur } from "./progressive-blur.js";

describe("ProgressiveBlur", () => {
  it("is decorative and exposes data-slot", () => {
    const { container } = render(<ProgressiveBlur />);
    const root = container.querySelector('[data-slot="progressive-blur"]');
    expect(root).toHaveAttribute("aria-hidden", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<ProgressiveBlur side="top" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
