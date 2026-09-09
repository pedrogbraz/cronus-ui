import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ExploreNav } from "./explore-nav.js";

const PRODUCTS = [
  {
    id: "pro",
    name: "iPhone 17 Pro",
    image: "https://example.com/pro.png",
    price: "From $1099",
    priceNote: "or $45.79/mo. for 24 mo.",
  },
  {
    id: "air",
    name: "iPhone 17 Air",
    image: "https://example.com/air.png",
    badge: "New",
  },
];

const LINKS = [
  { id: "highlights", label: "Highlights" },
  { id: "design", label: "Design" },
];

describe("ExploreNav", () => {
  it("renders the collapsed bar with title, Explore and Buy", () => {
    render(<ExploreNav title="iPhone 17 Pro" products={PRODUCTS} />);
    expect(screen.getByRole("navigation", { name: "iPhone 17 Pro" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "iPhone 17 Pro" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explore" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Buy" })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='explore-nav']")).toBeInTheDocument();
  });

  it("expands into the product carousel on Explore and closes with the Plus control", async () => {
    const user = userEvent.setup();
    render(<ExploreNav title="iPhone 17 Pro" products={PRODUCTS} links={LINKS} />);
    await user.click(screen.getByRole("button", { name: "Explore" }));
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /iPhone 17 Pro/ })).toBeInTheDocument();
    expect(screen.getByText("Currently Viewing")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Highlights" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByRole("button", { name: "Explore" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("marks the selected product as current", async () => {
    const user = userEvent.setup();
    render(<ExploreNav title="iPhone 17 Pro" products={PRODUCTS} defaultExpanded />);
    await user.click(screen.getByRole("button", { name: /iPhone 17 Air/ }));
    expect(screen.getByRole("button", { name: /iPhone 17 Air/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("has no axe violations when expanded", async () => {
    const { container } = render(
      <ExploreNav title="iPhone 17 Pro" products={PRODUCTS} links={LINKS} defaultExpanded />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
