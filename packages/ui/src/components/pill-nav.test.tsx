import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { PillNav } from "./pill-nav.js";

const items = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
];

describe("PillNav", () => {
  it("moves the current page on click", async () => {
    const user = userEvent.setup();
    render(<PillNav items={items} defaultValue="home" aria-label="Sections" />);
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Work" }));
    expect(screen.getByRole("button", { name: "Work" })).toHaveAttribute("aria-current", "page");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <PillNav items={items} defaultValue="home" aria-label="Sections" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
