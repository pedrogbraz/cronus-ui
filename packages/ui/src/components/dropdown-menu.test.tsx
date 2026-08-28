import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";

function BasicMenu({
  onEdit = () => {},
  onDelete = () => {},
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("renders closed by default", () => {
    render(<BasicMenu />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("does not lock document scroll when opened", async () => {
    const user = userEvent.setup();
    render(<BasicMenu />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("opens a menu with its items when the trigger is activated", async () => {
    const user = userEvent.setup();
    render(<BasicMenu />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);

    const menu = await screen.findByRole("menu");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const items = within(menu).getAllByRole("menuitem");
    expect(items.map((i) => i.textContent)).toEqual(["Edit", "Delete"]);
  });

  it("supports ArrowDown / ArrowUp roving focus over items", async () => {
    const user = userEvent.setup();
    render(<BasicMenu />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");

    // First ArrowDown highlights the first item, second moves to the next.
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Edit");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Delete");
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it("runs an item's handler and closes when the item is activated by click", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<BasicMenu onEdit={onEdit} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    const menu = await screen.findByRole("menu");

    await user.click(within(menu).getByRole("menuitem", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("activates the highlighted item with Enter and closes", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<BasicMenu onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");

    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}"); // -> Edit -> Delete -> activate
    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes via Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<BasicMenu />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await screen.findByRole("menu");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<BasicMenu />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");
    // The menu portals to <body> outside any landmark; "region" is a
    // page-structure rule that does not apply to an isolated component mount.
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
