import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Highlighter } from "./highlighter.js";

describe("Highlighter", () => {
  it("keeps the phrase readable and hides the marker from AT", () => {
    render(<Highlighter>important</Highlighter>);
    expect(screen.getByText("important")).toBeInTheDocument();
    const root = screen.getByText("important").closest('[data-slot="highlighter"]');
    expect(root?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Highlighter>mark</Highlighter>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
