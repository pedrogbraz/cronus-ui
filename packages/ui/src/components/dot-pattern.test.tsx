import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { DotPattern } from "./dot-pattern.js";

describe("DotPattern", () => {
  it("renders children above a decorative svg pattern", () => {
    render(
      <DotPattern>
        <span>Dotted</span>
      </DotPattern>,
    );
    expect(screen.getByText("Dotted")).toBeInTheDocument();
    const root = screen.getByText("Dotted").closest('[data-slot="dot-pattern"]');
    expect(root?.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <DotPattern>
        <p>content</p>
      </DotPattern>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
