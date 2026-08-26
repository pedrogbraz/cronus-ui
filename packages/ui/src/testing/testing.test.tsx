import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../components/button.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/tooltip.js";
import { expectNoA11yViolations, findDialog, findTooltip, renderWithKronus } from "./index.js";

function BasicDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** The wrapper div the scoped (non-asRoot) provider renders around the UI. */
function themedScopeOf(element: HTMLElement): HTMLElement | null {
  return element.closest("[data-kronus-theme]");
}

describe("renderWithKronus", () => {
  it("mounts the UI inside a scoped aurora/dark provider by default", () => {
    renderWithKronus(<Button>Save</Button>);

    const scope = themedScopeOf(screen.getByRole("button", { name: "Save" }));
    expect(scope).not.toBeNull();
    expect(scope).toHaveAttribute("data-kronus-theme", "aurora");
    expect(scope).toHaveAttribute("data-kronus-mode", "dark");
    // Scoped provider (non-asRoot): the document root stays untouched.
    expect(document.documentElement).not.toHaveAttribute("data-kronus-theme");
  });

  it("honors the theme/mode options", () => {
    renderWithKronus(<Button>Save</Button>, { theme: "neutral", mode: "light" });

    const scope = themedScopeOf(screen.getByRole("button", { name: "Save" }));
    expect(scope).toHaveAttribute("data-kronus-theme", "neutral");
    expect(scope).toHaveAttribute("data-kronus-mode", "light");
    expect(scope).not.toHaveClass("dark");
  });

  it("rerenderWithTheme flips the themed scope", () => {
    const { rerenderWithTheme } = renderWithKronus(<Button>Save</Button>);
    expect(themedScopeOf(screen.getByRole("button", { name: "Save" }))).toHaveAttribute(
      "data-kronus-theme",
      "aurora",
    );

    rerenderWithTheme("midnight", "light");

    const scope = themedScopeOf(screen.getByRole("button", { name: "Save" }));
    expect(scope).toHaveAttribute("data-kronus-theme", "midnight");
    expect(scope).toHaveAttribute("data-kronus-mode", "light");
  });

  it("rerenderWithTheme without a mode keeps the current mode", () => {
    const { rerenderWithTheme } = renderWithKronus(<Button>Save</Button>, { mode: "light" });

    rerenderWithTheme("sunset");

    const scope = themedScopeOf(screen.getByRole("button", { name: "Save" }));
    expect(scope).toHaveAttribute("data-kronus-theme", "sunset");
    expect(scope).toHaveAttribute("data-kronus-mode", "light");
  });

  it("rerender keeps the new UI inside the themed scope", () => {
    const { rerender } = renderWithKronus(<Button>Before</Button>, { theme: "neutral" });

    rerender(<Button>After</Button>);

    const scope = themedScopeOf(screen.getByRole("button", { name: "After" }));
    expect(scope).toHaveAttribute("data-kronus-theme", "neutral");
  });
});

describe("findDialog", () => {
  it("finds the open portaled dialog by accessible name", async () => {
    const user = userEvent.setup();
    renderWithKronus(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = await findDialog("Delete project");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-labelledby");
  });

  it("finds the open dialog without a name filter", async () => {
    const user = userEvent.setup();
    renderWithKronus(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    expect(await findDialog()).toBeInTheDocument();
  });
});

describe("findTooltip", () => {
  it("finds the open portaled tooltip by its text", async () => {
    const user = userEvent.setup();
    renderWithKronus(
      <Tooltip delayDuration={0}>
        <TooltipTrigger>More info</TooltipTrigger>
        <TooltipContent>Helpful hint</TooltipContent>
      </Tooltip>,
    );

    await user.hover(screen.getByText("More info"));

    const tooltip = await findTooltip("Helpful hint");
    expect(tooltip).toHaveTextContent("Helpful hint");
  });
});

describe("expectNoA11yViolations", () => {
  it("passes on an open, accessible dialog via baseElement", async () => {
    const user = userEvent.setup();
    const { baseElement } = renderWithKronus(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await findDialog("Delete project");

    // The overlay portals to document.body, so scan the whole baseElement.
    await expectNoA11yViolations(baseElement);
  });

  it("fails with the violation details on inaccessible markup", async () => {
    const container = document.createElement("div");
    container.innerHTML = '<img src="x">';
    document.body.appendChild(container);
    try {
      await expect(expectNoA11yViolations(container)).rejects.toThrow(/image-alt/);
    } finally {
      container.remove();
    }
  });
});
