import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemAttachment,
  QueueItemContent,
  QueueItemDescription,
  QueueItemFile,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "./queue.js";

function BasicQueue({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <Queue>
      <QueueSection defaultOpen={defaultOpen}>
        <QueueSectionTrigger>
          <QueueSectionLabel count={2} label="pending" />
        </QueueSectionTrigger>
        <QueueSectionContent>
          <QueueList>
            <QueueItem>
              <div className="flex items-center gap-2">
                <QueueItemIndicator />
                <QueueItemContent>Draft reply</QueueItemContent>
                <QueueItemActions>
                  <QueueItemAction aria-label="Remove">×</QueueItemAction>
                </QueueItemActions>
              </div>
              <QueueItemDescription>Waiting on review</QueueItemDescription>
              <QueueItemAttachment>
                <QueueItemFile>notes.txt</QueueItemFile>
              </QueueItemAttachment>
            </QueueItem>
            <QueueItem>
              <QueueItemIndicator completed />
              <QueueItemContent completed>Done item</QueueItemContent>
            </QueueItem>
          </QueueList>
        </QueueSectionContent>
      </QueueSection>
    </Queue>
  );
}

describe("Queue", () => {
  it("renders data-slot attributes", () => {
    const { container } = render(<BasicQueue />);

    expect(container.querySelector('[data-slot="queue"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="queue-section"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="queue-section-trigger"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="queue-section-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="queue-section-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="queue-list"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="queue-item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="queue-item-indicator"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="queue-item-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="queue-item-file"]')).toBeInTheDocument();
    expect(screen.getByText("2 pending")).toBeInTheDocument();
  });

  it("toggles section open and closed", async () => {
    render(<BasicQueue defaultOpen={false} />);
    const trigger = screen.getByRole("button");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Draft reply")).toBeVisible();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("fires item action clicks", async () => {
    const onClick = vi.fn();
    render(
      <Queue>
        <QueueItem>
          <QueueItemActions>
            <QueueItemAction aria-label="Remove" onClick={onClick} />
          </QueueItemActions>
        </QueueItem>
      </Queue>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations when open", async () => {
    const { container } = render(<BasicQueue />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
