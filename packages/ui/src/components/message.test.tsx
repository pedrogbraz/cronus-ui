import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Message, MessageAvatar, MessageContent } from "./message.js";

describe("Message", () => {
  it("marks the speaker via data-from", () => {
    const { rerender } = render(
      <Message from="user">
        <MessageContent>Hello</MessageContent>
      </Message>,
    );
    expect(document.querySelector('[data-slot="message"]')).toHaveAttribute("data-from", "user");
    expect(screen.getByText("Hello")).toBeInTheDocument();

    rerender(
      <Message from="assistant">
        <MessageContent>Hi there</MessageContent>
      </Message>,
    );
    expect(document.querySelector('[data-slot="message"]')).toHaveAttribute(
      "data-from",
      "assistant",
    );
  });

  it("renders avatar fallback initials from the name", () => {
    render(<MessageAvatar src="/avatar.png" name="Ada Lovelace" />);
    expect(screen.getByText("Ad")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="message-avatar"]')).toBeInTheDocument();
  });

  it("falls back to labels.me when name is omitted", () => {
    render(<MessageAvatar src="/avatar.png" labels={{ me: "YO" }} />);
    expect(screen.getByText("YO")).toBeInTheDocument();
  });

  it("applies the flat content variant class path", () => {
    render(
      <Message from="user">
        <MessageContent variant="flat">Flat bubble</MessageContent>
      </Message>,
    );
    expect(screen.getByText("Flat bubble")).toHaveAttribute("data-slot", "message-content");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Message from="assistant">
        <MessageAvatar src="/a.png" name="Bot" />
        <MessageContent>Reply body</MessageContent>
      </Message>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
