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

  it("has no axe violations", async () => {
    const { container } = render(
      <Response>
        <p>Accessible markdown stand-in</p>
      </Response>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
