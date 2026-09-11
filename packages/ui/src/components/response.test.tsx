import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Response } from "./response.js";

describe("Response", () => {
  it("renders children inside a response slot", () => {
    render(
      <Response>
        <p>Answer goes here</p>
      </Response>,
    );

    const paragraph = screen.getByText("Answer goes here");
    expect(paragraph.closest('[data-slot="response"]')).toBeTruthy();
  });

  it("applies a new className when children stay the same", () => {
    const { rerender } = render(
      <Response className="first">
        <p>Answer goes here</p>
      </Response>,
    );
    const root = screen.getByText("Answer goes here").closest("[data-slot=response]");
    expect(root).toHaveClass("first");
    rerender(
      <Response className="second">
        <p>Answer goes here</p>
      </Response>,
    );
    expect(root).toHaveClass("second");
    expect(root).not.toHaveClass("first");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Response>
        <p>Accessible markdown stand-in</p>
      </Response>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
