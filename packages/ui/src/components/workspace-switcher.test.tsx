import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { WorkspaceSwitcher } from "./workspace-switcher.js";

const WORKSPACES = [
  { id: "cronus", name: "Cronus", initials: "CR" },
  { id: "northwind", name: "Northwind", initials: "NW" },
  { id: "acme", name: "Acme", initials: "AC" },
] as const;

describe("WorkspaceSwitcher", () => {
  it("shows the current workspace name", () => {
    render(<WorkspaceSwitcher workspaces={WORKSPACES} />);

    expect(screen.getByRole("button", { name: "Switch workspace, Cronus" })).toBeInTheDocument();
    expect(screen.getByText("Cronus")).toBeInTheDocument();
  });

  it("calls onValueChange when another workspace is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<WorkspaceSwitcher workspaces={WORKSPACES} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Switch workspace, Cronus" }));
    await user.click(await screen.findByRole("menuitemradio", { name: /Northwind/ }));

    expect(onValueChange).toHaveBeenCalledWith("northwind");
  });

  it("renders nothing when there are no workspaces", () => {
    render(<WorkspaceSwitcher workspaces={[]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    render(<WorkspaceSwitcher workspaces={WORKSPACES} />);

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
