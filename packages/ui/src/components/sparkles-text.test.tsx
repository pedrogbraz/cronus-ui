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

  it("has no axe violations", async () => {
    const { container } = render(<SparklesText>Magic</SparklesText>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
