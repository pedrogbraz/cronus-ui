import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TokenSwap } from "./token-swap.js";

describe("TokenSwap", () => {
  it("renders the from/to assets and the amount field", () => {
    render(<TokenSwap />);
    expect(screen.getByRole("heading", { name: "Ethereum" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Aave" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Amount" })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='token-swap']")).toBeInTheDocument();
  });

  it("animates the USD readout when an amount is typed", async () => {
    const user = userEvent.setup();
    render(<TokenSwap />);
    await user.type(screen.getByRole("textbox", { name: "Amount" }), "5");
    expect(screen.getByText("$17,229.30")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "54.35" })).toBeInTheDocument();
  });

  it("fills the balance on Max and morphs Use → Using", async () => {
    const user = userEvent.setup();
    render(<TokenSwap />);
    await user.click(screen.getByRole("button", { name: "Use Max" }));
    expect(screen.getByRole("textbox", { name: "Amount" })).toHaveValue("111.82");
    expect(screen.getByRole("button", { name: "Using Max" })).toBeInTheDocument();
    expect(screen.getByText("$385,316.07")).toBeInTheDocument();
  });

  it("swaps the USD row for an over-balance error", async () => {
    const user = userEvent.setup();
    render(<TokenSwap />);
    await user.type(screen.getByRole("textbox", { name: "Amount" }), "200");
    expect(screen.getByText("Not Enough ETH")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Using Max" })).toBeInTheDocument();
  });

  it("clears the amount", async () => {
    const user = userEvent.setup();
    render(<TokenSwap />);
    await user.type(screen.getByRole("textbox", { name: "Amount" }), "5");
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("textbox", { name: "Amount" })).toHaveValue("");
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TokenSwap />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
