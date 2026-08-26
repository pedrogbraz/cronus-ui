import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { DynamicIsland } from "./dynamic-island.js";

const views = [
  { id: "idle", label: "Idle", content: <span>Idle</span> },
  { id: "playing", label: "Playing", content: <span>Now playing</span> },
];

describe("DynamicIsland", () => {
  it("switches views from the tablist", async () => {
    const user = userEvent.setup();
    render(<DynamicIsland views={views} defaultValue="idle" />);
    expect(screen.getByText("Idle")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Playing" }));
    expect(screen.getByText("Now playing")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<DynamicIsland views={views} defaultValue="idle" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
