import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { NotificationCenter, type NotificationItem } from "./notification-center.js";

// Radix ScrollArea relies on ResizeObserver, which jsdom does not implement.
// Stub it at file scope (does NOT touch the shared setup).
beforeAll(() => {
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New comment",
    description: "Ana replied to your invoice",
    timestamp: "2m ago",
    read: false,
    avatar: { fallback: "AN" },
  },
  {
    id: "n2",
    title: "Payout sent",
    description: "R$ 1.200,00 is on its way",
    timestamp: "1h ago",
    read: false,
  },
  {
    id: "n3",
    title: "Welcome to Kronus",
    description: "Finish setting up your store",
    timestamp: "yesterday",
    read: true,
  },
];

function openPanel() {
  return screen.getByRole("button", { name: /notifications/i });
}

describe("NotificationCenter", () => {
  it("shows the unread count on the trigger and opens the panel", async () => {
    const user = userEvent.setup();
    render(<NotificationCenter notifications={notifications} />);

    const trigger = openPanel();
    // 2 of 3 are unread.
    expect(trigger).toHaveAccessibleName("Notifications, 2 unread");
    expect(within(trigger).getByText("2")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("clamps the unread badge to 9+ past nine", () => {
    const many: NotificationItem[] = Array.from({ length: 12 }, (_, i) => ({
      id: `m${i}`,
      title: `Item ${i}`,
      read: false,
    }));
    render(<NotificationCenter notifications={many} />);
    const trigger = screen.getByRole("button", { name: "Notifications, 12 unread" });
    expect(within(trigger).getByText("9+")).toBeInTheDocument();
  });

  it("renders each row's title and description", async () => {
    const user = userEvent.setup();
    render(<NotificationCenter notifications={notifications} />);
    await user.click(openPanel());

    const panel = await screen.findByRole("dialog");
    expect(within(panel).getByText("New comment")).toBeInTheDocument();
    expect(within(panel).getByText("Ana replied to your invoice")).toBeInTheDocument();
    expect(within(panel).getByText("Payout sent")).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /Welcome to Kronus/ })).toBeInTheDocument();
  });

  it("fires onNotificationClick with the row id", async () => {
    const onNotificationClick = vi.fn();
    const user = userEvent.setup();
    render(
      <NotificationCenter
        notifications={notifications}
        onNotificationClick={onNotificationClick}
      />,
    );
    await user.click(openPanel());
    const panel = await screen.findByRole("dialog");

    await user.click(within(panel).getByRole("button", { name: /New comment/ }));
    expect(onNotificationClick).toHaveBeenCalledExactlyOnceWith("n1");
  });

  it("fires onMarkAllRead from the header action", async () => {
    const onMarkAllRead = vi.fn();
    const user = userEvent.setup();
    render(<NotificationCenter notifications={notifications} onMarkAllRead={onMarkAllRead} />);
    await user.click(openPanel());
    const panel = await screen.findByRole("dialog");

    await user.click(within(panel).getByRole("button", { name: "Mark all read" }));
    expect(onMarkAllRead).toHaveBeenCalledOnce();
  });

  it("hides the badge and the mark-all action when everything is read", async () => {
    const user = userEvent.setup();
    const allRead = notifications.map((n) => ({ ...n, read: true }));
    render(<NotificationCenter notifications={allRead} onMarkAllRead={() => {}} />);

    const trigger = screen.getByRole("button", { name: "Notifications" });
    expect(trigger).toHaveAccessibleName("Notifications");
    await user.click(trigger);
    const panel = await screen.findByRole("dialog");
    expect(within(panel).queryByRole("button", { name: "Mark all read" })).not.toBeInTheDocument();
  });

  it("shows the empty state with no notifications", async () => {
    const user = userEvent.setup();
    render(<NotificationCenter notifications={[]} />);
    await user.click(openPanel());

    const panel = await screen.findByRole("dialog");
    expect(within(panel).getByText("You're all caught up")).toBeInTheDocument();
    expect(within(panel).queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("renders an optional footer slot", async () => {
    const user = userEvent.setup();
    render(
      <NotificationCenter
        notifications={notifications}
        footer={<button type="button">View all</button>}
      />,
    );
    await user.click(openPanel());
    const panel = await screen.findByRole("dialog");
    expect(within(panel).getByRole("button", { name: "View all" })).toBeInTheDocument();
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<NotificationCenter notifications={notifications} />);
    await user.click(openPanel());
    await screen.findByRole("dialog");
    // The panel portals to <body> outside any landmark; "region" is a
    // page-structure rule that does not apply to an isolated component mount.
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
