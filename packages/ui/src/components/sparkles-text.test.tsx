import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SparklesText } from "./sparkles-text.js";

describe("SparklesText", () => {
  it("keeps the phrase readable", () => {
    render(<SparklesText>Magic</SparklesText>);
    expect(screen.getByText("Magic")).toBeInTheDocument();
    expect(screen.getByText("Magic").closest('[data-slot="sparkles-text"]')).toBeTruthy();
  });

  it("holds delayed sparkles at scale 0 until their clock starts", () => {
    const { container } = render(<SparklesText count={4}>Magic</SparklesText>);
    const sparkle = container.querySelector('[data-slot="sparkles-text"] [aria-hidden] span');
    expect(sparkle?.className).toContain("[animation-fill-mode:backwards]");
    expect(sparkle?.getAttribute("style") ?? "").toContain("scale(0)");
  });

  it("has no axe violations", async () => {
    const { container } = render(<SparklesText>Magic</SparklesText>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
