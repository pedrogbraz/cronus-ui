import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./conversation.js";

describe("Conversation", () => {
  it("exposes a log landmark for the transcript", () => {
    render(
      <Conversation>
        <ConversationContent>
          <p>Hello</p>
          <p>How can I help?</p>
        </ConversationContent>
      </Conversation>,
    );

    expect(screen.getByRole("log")).toHaveAttribute("data-slot", "conversation-content");
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("How can I help?")).toBeInTheDocument();
  });

  it("renders the empty state defaults", () => {
    render(
      <Conversation>
        <ConversationContent>
          <ConversationEmptyState />
        </ConversationContent>
      </Conversation>,
    );

    expect(screen.getByText("No messages yet")).toBeInTheDocument();
    expect(screen.getByText("Start a conversation to see messages here")).toBeInTheDocument();
  });

  it("allows empty-state labels to be overridden", () => {
    render(
      <ConversationEmptyState
        labels={{ title: "Inbox zero", description: "Nothing waiting for you" }}
      />,
    );

    expect(screen.getByText("Inbox zero")).toBeInTheDocument();
    expect(screen.getByText("Nothing waiting for you")).toBeInTheDocument();
  });

  it("shows a scroll-to-bottom control when the transcript is not pinned", async () => {
    const user = userEvent.setup();

    function TallConversation() {
      return (
        <Conversation className="h-40">
          <ConversationContent className="h-40">
            {Array.from({ length: 20 }, (_, index) => `Message ${index + 1}`).map((text) => (
              <p key={text}>{text}</p>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      );
    }

    render(<TallConversation />);

    const content = screen.getByText("Message 1").closest('[data-slot="conversation-content"]');
    expect(content).toBeTruthy();

    // Force a non-bottom scroll position so the button mounts.
    if (content) {
      Object.defineProperty(content, "scrollHeight", { configurable: true, value: 800 });
      Object.defineProperty(content, "clientHeight", { configurable: true, value: 160 });
      Object.defineProperty(content, "scrollTop", { configurable: true, writable: true, value: 0 });
      content.dispatchEvent(new Event("scroll", { bubbles: true }));
    }

    const button = await screen.findByRole("button", { name: "Scroll to bottom" });
    expect(button).toHaveAttribute("data-slot", "conversation-scroll-button");
    await user.click(button);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Conversation>
        <ConversationContent>
          <ConversationEmptyState />
        </ConversationContent>
      </Conversation>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
