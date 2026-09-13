"use client";

import { NotificationCenter } from "@cronus-ui/ui/notification-center";
import { useEffect, useRef } from "react";

const FALLBACK_ITEMS = ["New comment", "Payout sent"];

/**
 * NotificationCenter does not forward `open` / `defaultOpen` to Popover.
 * Click the bell trigger once after mount. Item titles come from `items`.
 */
export function NotificationCenterFixture({
  items,
  title,
}: {
  items?: string[];
  title?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const labels = items && items.length > 0 ? items : FALLBACK_ITEMS;

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    const trigger = rootRef.current?.querySelector<HTMLButtonElement>(
      '[data-slot="notification-trigger"]',
    );
    trigger?.click();
  }, []);

  return (
    <div ref={rootRef}>
      <NotificationCenter
        title={typeof title === "string" ? title : "Notifications"}
        notifications={labels.map((item, index) => ({
          id: `n${index}`,
          title: item,
          read: index > 0,
        }))}
      />
    </div>
  );
}
