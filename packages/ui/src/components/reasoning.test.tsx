import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "./reasoning.js";

function BasicReasoning({
  isStreaming = false,
  defaultOpen = true,
}: {
  isStreaming?: boolean;
  defaultOpen?: boolean;
}) {
  return (
    <Reasoning isStreaming={isStreaming} defaultOpen={defaultOpen}>
      <ReasoningTrigger />
      <ReasoningContent>Analyzed the request.</ReasoningContent>
    </Reasoning>
  );
}

describe("Reasoning", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders data-slot attributes", () => {
    const { container } = render(<BasicReasoning defaultOpen isStreaming />);

    expect(container.querySelector('[data-slot="reasoning"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="reasoning-trigger"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="reasoning-content"]')).toBeInTheDocument();
  });

  it("shows thinking label while streaming and toggles on click", async () => {
    render(<BasicReasoning isStreaming defaultOpen />);

    expect(screen.getByText("Thinking...")).toBeInTheDocument();
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Analyzed the request.")).toBeVisible();
  });

  it("does not auto-close a static defaultOpen panel that never streamed", async () => {
    vi.useFakeTimers();
    render(<BasicReasoning defaultOpen isStreaming={false} />);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Analyzed the request.")).toBeVisible();
  });

  it("auto-closes after streaming ends", async () => {
    vi.useFakeTimers();
    const { rerender } = render(<BasicReasoning isStreaming defaultOpen />);

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    rerender(<BasicReasoning isStreaming={false} defaultOpen />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("respects labels overrides", () => {
    render(
      <Reasoning isStreaming labels={{ thinking: "Pensando..." }}>
        <ReasoningTrigger />
        <ReasoningContent>ok</ReasoningContent>
      </Reasoning>,
    );

    expect(screen.getByText("Pensando...")).toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    const { container } = render(<BasicReasoning isStreaming defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
