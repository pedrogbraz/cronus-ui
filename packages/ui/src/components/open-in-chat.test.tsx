import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInScira,
  OpenInSeparator,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from "./open-in-chat.js";

function BasicOpenIn() {
  return (
    <OpenIn query="explain radix menus">
      <OpenInTrigger />
      <OpenInContent>
        <OpenInChatGPT />
        <OpenInClaude />
        <OpenInT3 />
        <OpenInScira />
        <OpenInv0 />
        <OpenInSeparator />
        <OpenInCursor />
      </OpenInContent>
    </OpenIn>
  );
}

describe("OpenIn", () => {
  it("opens a menu of chat providers from the trigger", async () => {
    const user = userEvent.setup();
    render(<BasicOpenIn />);

    await user.click(screen.getByRole("button", { name: /open in chat/i }));
    const menu = await screen.findByRole("menu");

    expect(within(menu).getByRole("menuitem", { name: /open in chatgpt/i })).toHaveAttribute(
      "href",
      expect.stringContaining("chatgpt.com"),
    );
    expect(within(menu).getByRole("menuitem", { name: /open in claude/i })).toHaveAttribute(
      "href",
      expect.stringContaining("claude.ai"),
    );
    expect(within(menu).getByRole("menuitem", { name: /open in cursor/i })).toHaveAttribute(
      "href",
      expect.stringContaining("cursor.com"),
    );
  });

  it("embeds the query in provider URLs", async () => {
    const user = userEvent.setup();
    render(<BasicOpenIn />);

    await user.click(screen.getByRole("button", { name: /open in chat/i }));
    const chatgpt = await screen.findByRole("menuitem", { name: /open in chatgpt/i });
    const href = chatgpt.getAttribute("href") ?? "";
    expect(href).toContain("prompt=explain+radix+menus");
  });

  it("has no axe violations when closed", async () => {
    const { container } = render(<BasicOpenIn />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
