import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Loader } from "./loader.js";

describe("Loader", () => {
  it("exposes a default Loading status to assistive tech", () => {
    render(<Loader />);
    const status = screen.getByRole("status", { name: "Loading" });
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("data-slot", "loader");
  });

  it("accepts custom labels", () => {
    render(<Loader labels={{ loading: "Fetching" }} />);
    expect(screen.getByRole("status", { name: "Fetching" })).toBeInTheDocument();
  });

  it("forwards a numeric size to the glyph", () => {
    const { container } = render(<Loader size={24} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Loader size={20} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
