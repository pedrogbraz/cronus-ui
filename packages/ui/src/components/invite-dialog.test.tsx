import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./button.js";
import { InviteDialog } from "./invite-dialog.js";

beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

describe("InviteDialog", () => {
  it("opens from its trigger and renders the title and email field", async () => {
    const user = userEvent.setup();
    render(<InviteDialog trigger={<Button>Invite</Button>} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Invite" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Invite member")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("calls onInvite with email+role and closes once an async invite resolves", async () => {
    const user = userEvent.setup();
    let resolveInvite: (() => void) | undefined;
    const onInvite = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveInvite = resolve;
        }),
    );

    render(<InviteDialog defaultOpen onInvite={onInvite} />);

    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    const send = screen.getByRole("button", { name: "Send invite" });
    await user.click(send);

    expect(onInvite).toHaveBeenCalledTimes(1);
    expect(onInvite).toHaveBeenCalledWith({ email: "ada@example.com", role: "member" });
    expect(send).toBeDisabled();
    expect(send).toHaveAttribute("aria-busy", "true");
    expect(document.querySelector('[data-slot="spinner"]')).toBeInTheDocument();

    resolveInvite?.();
    await waitForElementToBeRemoved(() => screen.queryByText("Invite member"));
  });

  it("stays open and surfaces the error when onInvite rejects", async () => {
    const user = userEvent.setup();
    const onInvite = vi.fn(() => Promise.reject(new Error("Network unreachable")));

    render(<InviteDialog defaultOpen onInvite={onInvite} />);

    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Send invite" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Network unreachable");
    expect(screen.getByText("Invite member")).toBeInTheDocument();
  });

  it("stays open with a copyable link when onInvite resolves { url }", async () => {
    const user = userEvent.setup();
    const url = "http://localhost:3000/accept-invitation?id=inv_1";
    const onInvite = vi.fn(() => Promise.resolve({ url }));

    render(<InviteDialog defaultOpen onInvite={onInvite} />);

    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Send invite" }));

    expect(await screen.findByText("Invite sent")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="invite-dialog-success"]')).toBeInTheDocument();
    expect(screen.getByDisplayValue(url)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy invite link" })).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => {
      expect(screen.queryByText("Invite sent")).not.toBeInTheDocument();
    });
  });

  it("has no axe violations", async () => {
    render(<InviteDialog defaultOpen />);

    expect(await axe(document.body)).toHaveNoViolations();
  });

  it("has no axe violations on the success surface", async () => {
    const user = userEvent.setup();
    render(
      <InviteDialog
        defaultOpen
        onInvite={() =>
          Promise.resolve({ url: "http://localhost:3000/accept-invitation?id=inv_1" })
        }
      />,
    );
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Send invite" }));
    expect(await screen.findByText("Invite sent")).toBeInTheDocument();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
