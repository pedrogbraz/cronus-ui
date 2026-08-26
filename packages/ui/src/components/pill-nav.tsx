"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useId,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

export interface PillNavItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface PillNavProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  ref?: Ref<HTMLElement>;
  items: PillNavItem[];
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value when uncontrolled. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * A compact navigation row whose active item is marked by a sliding pill.
 * Keyboard: Left/Right (and Up/Down) move selection; Home/End jump. The
 * sliding thumb is decorative — selection is exposed as `aria-current`.
 */
export function PillNav({
  ref,
  className,
  items,
  value,
  defaultValue,
  onValueChange,
  ...props
}: PillNavProps) {
  const reduce = !!useReducedMotion();
  const layoutId = useId();
  const enabled = items.filter((item) => !item.disabled);
  const fallback = defaultValue ?? enabled[0]?.value;
  const [uncontrolled, setUncontrolled] = useState(fallback);
  const selected = value ?? uncontrolled;

  const select = (next: string) => {
    if (next === selected) return;
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const move = (from: string, direction: "next" | "prev" | "first" | "last") => {
    if (enabled.length === 0) return;
    const index = enabled.findIndex((item) => item.value === from);
    const current = index === -1 ? 0 : index;
    const last = enabled.length - 1;
    const nextIndex =
      direction === "first"
        ? 0
        : direction === "last"
          ? last
          : direction === "next"
            ? Math.min(last, current + 1)
            : Math.max(0, current - 1);
    const next = enabled[nextIndex];
    if (next) select(next.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>, current: string) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(current, "next");
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(current, "prev");
    } else if (event.key === "Home") {
      event.preventDefault();
      move(current, "first");
    } else if (event.key === "End") {
      event.preventDefault();
      move(current, "last");
    }
  };

  return (
    <nav
      ref={ref}
      data-slot="pill-nav"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface-inset p-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = item.value === selected;
        return (
          <button
            key={item.value}
            type="button"
            data-slot="pill-nav-item"
            disabled={item.disabled}
            aria-current={isActive ? "page" : undefined}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              "relative z-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-fg-secondary outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50",
              isActive && "text-fg",
            )}
            onClick={() => select(item.value)}
            onKeyDown={(event) => onKeyDown(event, item.value)}
          >
            {isActive ? (
              <motion.span
                layoutId={reduce ? undefined : layoutId}
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-surface-floating shadow-xs"
                transition={
                  reduce ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: 0.4 }
                }
              />
            ) : null}
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
PillNav.displayName = "PillNav";
