import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "./prompt-input.js";

describe("PromptInput", () => {
  it("types text and submits the form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>,
    );

    const textarea = screen.getByPlaceholderText("What would you like to know?");
    await user.type(textarea, "Hello Cronus");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const [message] = onSubmit.mock.calls[0]!;
    expect(message.text).toBe("Hello Cronus");
  });

  it("submits on Enter without Shift", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>,
    );

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Send me{Enter}");
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it("rejects dropped files that do not match accept", () => {
    const onError = vi.fn();

    const { container } = render(
      <PromptInput accept="image/png,.png" onError={onError} onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
      </PromptInput>,
    );

    const form = container.querySelector('[data-slot="prompt-input"]');
    expect(form).toBeTruthy();

    const file = new File(["plain"], "notes.txt", { type: "text/plain" });
    const files = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
      [Symbol.iterator]: function* () {
        yield file;
      },
    } as unknown as FileList;

    const drop = new Event("drop", { bubbles: true, cancelable: true });
    Object.defineProperty(drop, "dataTransfer", {
      value: { types: ["Files"], files },
    });
    form?.dispatchEvent(drop);

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "accept" }));
  });

  it("does not submit when status is streaming", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit status="streaming" />
        </PromptInputFooter>
      </PromptInput>,
    );

    const stop = screen.getByRole("button", { name: "Stop" });
    expect(stop).toHaveAttribute("type", "button");
    await user.click(stop);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
