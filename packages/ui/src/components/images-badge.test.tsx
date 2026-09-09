import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ImagesBadge } from "./images-badge.js";

const IMAGES = [
  "https://example.com/a.webp",
  "https://example.com/b.webp",
  "https://example.com/c.webp",
  "https://example.com/d.webp",
];

describe("ImagesBadge", () => {
  it("renders the label and at most three preview images", () => {
    render(<ImagesBadge text="Introducing Agenforce Marketing Template" images={IMAGES} />);
    expect(screen.getByText("Introducing Agenforce Marketing Template")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(document.querySelector("[data-slot='images-badge']")).toBeInTheDocument();
  });

  it("renders as a link when href is set", () => {
    render(
      <ImagesBadge
        text="Open"
        images={IMAGES.slice(0, 1)}
        href="https://example.com"
        target="_blank"
      />,
    );
    const link = screen.getByRole("link", { name: /Open/ });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("fans images on hover without dropping the label", async () => {
    render(<ImagesBadge text="Gallery View" images={IMAGES.slice(0, 2)} />);
    const root = document.querySelector("[data-slot='images-badge']");
    expect(root).toBeTruthy();
    await userEvent.hover(root as HTMLElement);
    expect(screen.getByText("Gallery View")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ImagesBadge text="Quick Preview" images={IMAGES.slice(0, 3)} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
