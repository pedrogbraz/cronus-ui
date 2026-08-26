import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ExpandableTabs } from "./expandable-tabs.js";

const items = [
  { value: "home", label: "Home", icon: <span>H</span> },
  { value: "search", label: "Search", icon: <span>S</span> },
];

describe("ExpandableTabs", () => {
  it("selects a tab on click", async () => {
    const user = userEvent.setup();
    render(<ExpandableTabs items={items} defaultValue="home" />);
    expect(screen.getByRole("tab", { name: "Home" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Search" }));
    expect(screen.getByRole("tab", { name: "Search" })).toHaveAttribute("aria-selected", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<ExpandableTabs items={items} defaultValue="home" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
