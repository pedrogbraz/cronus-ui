import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ScrollNav } from "./scroll-nav.js";

beforeAll(() => {
  if (!("IntersectionObserver" in globalThis)) {
    class IntersectionObserverStub {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): [] {
        return [];
      }
    }
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
      IntersectionObserverStub;
  }
  if (!HTMLElement.prototype.scrollIntoView) {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  }
  if (!HTMLElement.prototype.scrollTo) {
    HTMLElement.prototype.scrollTo = vi.fn();
  }
});

const TERMS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: <p>By using this site you agree to these terms.</p>,
  },
  {
    id: "license",
    title: "License Agreement",
    content: <p>The software is licensed, not sold.</p>,
  },
];

describe("ScrollNav", () => {
  it("renders the title, sections, and sidebar links", () => {
    render(<ScrollNav title="Terms & Conditions" terms={TERMS} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Terms & Conditions" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Sections" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Acceptance of Terms" })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='scroll-nav']")).toBeInTheDocument();
    expect(document.getElementById("acceptance")).toBeInTheDocument();
  });

  it("marks the first section as the current location", () => {
    render(<ScrollNav terms={TERMS} />);
    expect(screen.getByRole("link", { name: "Acceptance of Terms" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("jumps to a section when a sidebar link is clicked", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
    render(<ScrollNav terms={TERMS} />);
    await user.click(screen.getByRole("link", { name: "License Agreement" }));
    expect(screen.getByRole("link", { name: "License Agreement" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ScrollNav title="Terms & Conditions" terms={TERMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
