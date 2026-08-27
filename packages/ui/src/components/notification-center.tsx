"use client";

import { Bell, BellOff } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn.js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import { ScrollArea } from "./scroll-area.js";

/** A single entry rendered inside the {@link NotificationCenter} inbox. */
export interface NotificationItem {
  /** Stable identity; echoed back to `onNotificationClick`. */
  id: string;
  /** Primary line — the headline of the notification. */
  title: ReactNode;
  /** Optional secondary line with extra context. */
  description?: ReactNode;
  /** Pre-formatted relative/absolute time label (e.g. "2m ago"). */
  timestamp?: string;
  /** When falsy the row is treated as unread (dot + wash + counted). */
  read?: boolean;
  /** Leading glyph; ignored when `avatar` is provided. */
  icon?: ReactNode;
  /** Leading avatar; takes precedence over `icon`. */
  avatar?: { src?: string; fallback: ReactNode };
}

/** Number of unread (`read !== true`) items in the list. */
function countUnread(notifications: readonly NotificationItem[]): number {
  let unread = 0;
  for (const item of notifications) {
    if (!item.read) unread += 1;
  }
  return unread;
}

/** Clamp the unread count into the trigger badge's "9+" display label. */
function formatUnread(count: number): string {
  return count > 9 ? "9+" : String(count);
}

/* -------------------------------------------------------------------------- */
/* Row                                                                        */
/* -------------------------------------------------------------------------- */

export interface NotificationRowProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "id" | "title" | "onClick" | "onSelect"> {
  notification: NotificationItem;
  /** Fired with the notification id when the row is activated. */
  onSelect?: (id: string) => void;
}

/**
 * A single, fully-interactive notification row. Rendered as a real `<button>`
 * so it is keyboard-focusable and announced as a control.
 */
export const NotificationRow = forwardRef<HTMLButtonElement, NotificationRowProps>(
  ({ className, notification, onSelect, ...props }, ref) => {
    const { id, title, description, timestamp, read, icon, avatar } = notification;
    return (
      <button
        ref={ref}
        type="button"
        data-slot="notification-row"
        data-unread={read ? undefined : ""}
        onClick={() => onSelect?.(id)}
        className={cn(
          "flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left outline-none transition-colors hover:bg-surface-overlay focus-visible:bg-surface-overlay focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          !read && "bg-surface-overlay/40",
          className,
        )}
        {...props}
      >
        {avatar ? (
          <Avatar className="size-9">
            {avatar.src ? <AvatarImage src={avatar.src} alt="" /> : null}
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ) : icon ? (
          <span
            data-slot="notification-icon"
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-overlay text-fg-secondary [&_svg]:size-4"
          >
            {icon}
          </span>
        ) : null}

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex min-w-0 items-start gap-2">
            <span className="min-w-0 flex-1 break-words text-sm font-medium text-fg">{title}</span>
            {read ? null : (
              <span
                data-slot="notification-unread-dot"
                aria-hidden="true"
                className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
              />
            )}
          </span>
          {description ? (
            <span className="min-w-0 break-words text-sm text-fg-secondary">{description}</span>
          ) : null}
          {timestamp ? <span className="text-xs text-fg-tertiary">{timestamp}</span> : null}
        </span>
      </button>
    );
  },
);
NotificationRow.displayName = "NotificationRow";

/* -------------------------------------------------------------------------- */
/* List                                                                       */
/* -------------------------------------------------------------------------- */

export interface NotificationListProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  notifications: readonly NotificationItem[];
  /** Fired with the notification id when a row is activated. */
  onSelect?: (id: string) => void;
  /** Replaces the built-in "You're all caught up" empty state. */
  emptyState?: ReactNode;
}

/**
 * The scrollable list body. Renders an accessible `list`/`listitem` structure,
 * or the empty state when there are no notifications.
 */
export const NotificationList = forwardRef<HTMLDivElement, NotificationListProps>(
  ({ className, notifications, onSelect, emptyState, ...props }, ref) => {
    if (notifications.length === 0) {
      return (
        <div
          ref={ref}
          data-slot="notification-empty"
          className={cn(
            "flex flex-col items-center justify-center gap-2 px-4 py-10 text-center",
            className,
          )}
          {...props}
        >
          {emptyState ?? (
            <>
              <BellOff aria-hidden="true" className="size-6 text-fg-muted" />
              <p className="text-sm text-fg-secondary">You're all caught up</p>
            </>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} data-slot="notification-list" className={cn(className)} {...props}>
        <ul className="flex flex-col">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationRow notification={notification} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
NotificationList.displayName = "NotificationList";

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */

export interface NotificationCenterProps
  extends Omit<ComponentPropsWithoutRef<typeof PopoverContent>, "onSelect" | "title"> {
  /** Items to display in the inbox. */
  notifications: readonly NotificationItem[];
  /** Fired when the "Mark all read" affordance is activated. */
  onMarkAllRead?: () => void;
  /** Fired with the notification id when a row is activated. */
  onNotificationClick?: (id: string) => void;
  /** Header heading text. */
  title?: ReactNode;
  /** Custom empty-state content (defaults to "You're all caught up"). */
  emptyState?: ReactNode;
  /** Optional footer rendered below the list (e.g. a "View all" link). */
  footer?: ReactNode;
  /** Class names for the popover panel. */
  className?: string;
}

/**
 * A bell-trigger notifications inbox built on {@link Popover}. The trigger is a
 * ghost icon button with an unread-count badge; the panel renders a header with
 * a "Mark all read" action, a scrollable list of notifications, an empty state,
 * and an optional footer slot.
 */
export const NotificationCenter = forwardRef<HTMLDivElement, NotificationCenterProps>(
  (
    {
      notifications,
      onMarkAllRead,
      onNotificationClick,
      title = "Notifications",
      emptyState,
      footer,
      align = "end",
      className,
      ...props
    },
    ref,
  ) => {
    const unreadCount = countUnread(notifications);
    const hasUnread = unreadCount > 0;
    const triggerLabel =
      unreadCount === 0 ? "Notifications" : `Notifications, ${unreadCount} unread`;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={triggerLabel}
            data-slot="notification-trigger"
            className="relative"
          >
            <Bell aria-hidden="true" />
            {hasUnread ? (
              <Badge
                aria-hidden="true"
                variant="primary"
                data-slot="notification-badge"
                className="-right-1 -top-1 pointer-events-none absolute flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.625rem] leading-none tabular-nums"
              >
                {formatUnread(unreadCount)}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          ref={ref}
          align={align}
          aria-label={typeof title === "string" ? title : "Notifications"}
          data-slot="notification-center"
          className={cn("w-80 p-0", className)}
          {...props}
        >
          <div className="flex items-center justify-between gap-2 border-border border-b px-3 py-2.5">
            <p className="font-display font-semibold text-fg text-sm">{title}</p>
            {hasUnread && onMarkAllRead ? (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={onMarkAllRead}
                className="h-auto px-0"
              >
                Mark all read
              </Button>
            ) : null}
          </div>

          <ScrollArea className="max-h-80">
            <div className="p-1">
              <NotificationList
                notifications={notifications}
                onSelect={onNotificationClick}
                emptyState={emptyState}
              />
            </div>
          </ScrollArea>

          {footer ? (
            <div data-slot="notification-footer" className="border-border border-t px-3 py-2.5">
              {footer}
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    );
  },
);
NotificationCenter.displayName = "NotificationCenter";
