import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Terminal, type TerminalLine } from "./terminal.js";

const SCRIPT: TerminalLine[] = [
  { type: "input", text: "npm create kronus@latest", delay: 0 },
  { type: "output", text: "Project ready in 1.2s", delay: 0 },
];

function screenPane(container: HTMLElement): HTMLElement | null {
  return container.querySelector('[data-slot="terminal-screen"]');
}

afterEach(() => {
  vi.useRealTimers();
});

describe("Terminal", () => {
  it("renders the finished transcript instantly when motion is off", () => {
    const { container } = render(<Terminal lines={SCRIPT} title="zsh" motionPreference="never" />);

    const pane = screenPane(container);
    expect(pane?.textContent).toContain("npm create kronus@latest");
    expect(pane?.textContent).toContain("Project ready in 1.2s");
    expect(screen.getByText("zsh")).toBeInTheDocument();
    // The prompt is rendered for input lines only.
    expect(container.querySelectorAll('[data-slot="terminal-prompt"]')).toHaveLength(2);
    // No cursor in the static state.
    expect(container.querySelector('[data-slot="terminal-cursor"]')).toBeNull();
    expect(container.querySelector('[data-slot="terminal"]')).toHaveAttribute(
      "data-state",
      "static",
    );
  });

  it("exposes the complete transcript to assistive tech before any animation runs", () => {
    vi.useFakeTimers();
    const { container } = render(<Terminal lines={SCRIPT} motionPreference="always" />);

    const transcript = container.querySelector('[data-slot="terminal-transcript"]');
    expect(transcript?.textContent).toBe("$ npm create kronus@latest\nProject ready in 1.2s");
    // …while the visual pane hasn't typed anything yet.
    expect(screenPane(container)?.textContent).not.toContain("npm");
  });

  it("types input lines char-by-char with a cursor, then reveals the output", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Terminal
        lines={[
          { type: "input", text: "hi", delay: 0 },
          { type: "output", text: "done", delay: 0 },
        ]}
        typingSpeed={10}
        motionPreference="always"
      />,
    );

    const pane = screenPane(container);
    // The active input line blinks its block cursor while it types.
    expect(container.querySelector('[data-slot="terminal-cursor"]')).not.toBeNull();

    act(() => vi.advanceTimersByTime(0));
    expect(pane?.textContent).toContain("h");
    expect(pane?.textContent).not.toContain("hi");

    act(() => vi.advanceTimersByTime(10));
    expect(pane?.textContent).toContain("hi");

    act(() => vi.advanceTimersByTime(50));
    expect(pane?.textContent).toContain("done");
    expect(container.querySelector('[data-slot="terminal"]')).toHaveAttribute("data-state", "done");
    // The cursor rests once the script has finished.
    expect(container.querySelector('[data-slot="terminal-cursor"]')).toBeNull();
  });

  it("restarts the script from the top when loop is set", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Terminal
        lines={[{ type: "input", text: "a", delay: 20 }]}
        typingSpeed={5}
        loop
        loopDelay={50}
        motionPreference="always"
      />,
    );

    // t=20: the line is typed; the loop rest is scheduled for t=70.
    const pane = screenPane(container);
    act(() => vi.advanceTimersByTime(30));
    expect(pane?.textContent).toContain("a");

    // t=70: the screen resets (typing restarts at t=90 after the line delay).
    act(() => vi.advanceTimersByTime(40));
    expect(pane?.textContent).not.toContain("a");
    act(() => vi.advanceTimersByTime(20));
    expect(pane?.textContent).toContain("a");
  });

  it("copies the joined input commands without the prompt", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <Terminal
        lines={[
          { type: "input", text: "npm i @kronus-ui/ui" },
          { type: "output", text: "added 1 package" },
          { type: "input", text: "npm run dev" },
        ]}
        motionPreference="never"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Copy commands" }));
    expect(writeText).toHaveBeenCalledWith("npm i @kronus-ui/ui\nnpm run dev");
  });

  it("hides the copy button when the script has no input lines", () => {
    render(
      <Terminal lines={[{ type: "output", text: "read-only log" }]} motionPreference="never" />,
    );
    expect(screen.queryByRole("button", { name: "Copy commands" })).toBeNull();
  });

  it("renders without the chrome bar but keeps the copy button reachable", () => {
    const { container } = render(
      <Terminal lines={SCRIPT} chrome={false} motionPreference="never" />,
    );
    expect(container.querySelector('[data-slot="terminal-chrome"]')).toBeNull();
    expect(screen.getByRole("button", { name: "Copy commands" })).toBeInTheDocument();
  });

  it("names the focusable body region after the title", () => {
    render(<Terminal lines={SCRIPT} title="deploy.sh" motionPreference="never" />);
    const region = screen.getByRole("region", { name: "Terminal, deploy.sh" });
    expect(region).toHaveAttribute("tabindex", "0");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Terminal lines={SCRIPT} title="zsh" motionPreference="never" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
