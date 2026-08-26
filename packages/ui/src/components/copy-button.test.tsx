import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CopyButton } from "./copy-button.js";

describe("CopyButton", () => {
  it("writes the value to the clipboard and shows the copied state on click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyButton value="npm i @cronus-ui/ui" />);
    const button = screen.getByRole("button", { name: "Copy" });
    await userEvent.click(button);

    expect(writeText).toHaveBeenCalledWith("npm i @cronus-ui/ui");
    // Success is announced once via the polite live region.
    expect(await screen.findByText("Copied")).toBeInTheDocument();
    expect(button).toHaveAttribute("data-copied", "true");
  });

  it("uses a stable accessible name in the idle state", () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    render(<CopyButton value="x" copyLabel="Copy token" />);
    expect(screen.getByRole("button", { name: "Copy token" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    const { container } = render(<CopyButton value="hello" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
