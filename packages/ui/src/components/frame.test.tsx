import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Frame } from "./frame.js";

describe("Frame", () => {
  it("renders its children", () => {
    render(
      <Frame url="https://kronus.com">
        <p>Framed content</p>
      </Frame>,
    );
    expect(screen.getByText("Framed content")).toBeInTheDocument();
  });

  it("shows the url in the address bar for the browser variant", () => {
    render(
      <Frame variant="browser" url="https://kronus.com/checkout">
        <span>body</span>
      </Frame>,
    );
    expect(screen.getByText("https://kronus.com/checkout")).toBeInTheDocument();
  });

  it("omits the address bar for the window variant", () => {
    render(
      <Frame variant="window" url="https://kronus.com">
        <span>body</span>
      </Frame>,
    );
    expect(screen.queryByText("https://kronus.com")).not.toBeInTheDocument();
  });

  it("reflects the variant via data attributes", () => {
    const { rerender } = render(<Frame>browser</Frame>);
    expect(document.querySelector('[data-slot="frame"]')).toHaveAttribute(
      "data-variant",
      "browser",
    );
    rerender(<Frame variant="window">window</Frame>);
    expect(document.querySelector('[data-slot="frame"]')).toHaveAttribute("data-variant", "window");
  });

  it("renders three decorative traffic-light dots that are hidden from a11y", () => {
    render(<Frame url="https://kronus.com">body</Frame>);
    const dotGroup = document.querySelector('[aria-hidden="true"]');
    expect(dotGroup).toBeInTheDocument();
    expect(dotGroup?.querySelectorAll("span")).toHaveLength(3);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Frame url="https://kronus.com">
        <p>Accessible content</p>
      </Frame>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
