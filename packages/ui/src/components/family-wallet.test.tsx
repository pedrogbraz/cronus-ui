import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { FamilyWallet } from "./family-wallet.js";

beforeAll(() => {
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
  if (!document.elementFromPoint) {
    document.elementFromPoint = () => null;
  }
});

describe("FamilyWallet", () => {
  it("renders the Sign In trigger", () => {
    render(<FamilyWallet />);
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='family-wallet']")).toBeInTheDocument();
  });

  it("opens the drawer with socials, method tabs and Connect Wallet", async () => {
    const user = userEvent.setup();
    render(<FamilyWallet />);
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in with Google" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Select Email" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Connect Wallet" })).toBeInTheDocument();
  });

  it("switches Email / Phone / Passkey", async () => {
    const user = userEvent.setup();
    render(<FamilyWallet defaultOpen />);
    expect(screen.getByPlaceholderText("yo@gxuri.me")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Select Phone" }));
    expect(screen.getByPlaceholderText("+1 (555) 123-4567")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Select Passkey" }));
    expect(screen.getByText("Login with passkey")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
  });

  it("submits email and shows the OTP view", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<FamilyWallet defaultOpen onContinue={onContinue} />);
    await user.type(screen.getByPlaceholderText("yo@gxuri.me"), "yo@gxuri.me");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onContinue).toHaveBeenCalledWith("email", "yo@gxuri.me");
    await waitFor(() => {
      expect(screen.getByText("Confirm Email")).toBeInTheDocument();
    });
    expect(screen.getByText("yo@gxuri.me")).toBeInTheDocument();
  });

  it("opens the waiting-passkey view from Continue", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<FamilyWallet defaultOpen onContinue={onContinue} />);
    await user.click(screen.getByRole("button", { name: "Select Passkey" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onContinue).toHaveBeenCalledWith("passkey", "");
    await waitFor(() => {
      expect(screen.getByText("Waiting for passkey")).toBeInTheDocument();
    });
  });

  it("opens the wallet list from Connect Wallet", async () => {
    const user = userEvent.setup();
    render(<FamilyWallet defaultOpen />);
    await user.click(screen.getByRole("button", { name: "Connect Wallet" }));
    await waitFor(() => {
      expect(screen.getByText("Metamask")).toBeInTheDocument();
    });
    expect(screen.getByText("Phantom")).toBeInTheDocument();
    expect(screen.getByText("I Don't Have a Wallet")).toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    render(<FamilyWallet defaultOpen />);
    expect(await axe(screen.getByRole("dialog"))).toHaveNoViolations();
  });
});
