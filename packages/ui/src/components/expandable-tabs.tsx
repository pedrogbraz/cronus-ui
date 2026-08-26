"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type HTMLAttributes, type ReactNode, type Ref, useState } from "react";
import { cn } from "../lib/cn.js";

export interface ExpandableTab {
  value: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
}

export interface ExpandableTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  ref?: Ref<HTMLDivElement>;
  items: ExpandableTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Icon tabs where the active item expands to reveal its label. A tablist with
 * roving tabindex; the label collapse/expand is decorative and skipped under
 * reduced motion (the active label just stays visible).
 */
export function ExpandableTabs({
  ref,
  className,
  items,
  value,
  defaultValue,
  onValueChange,
  ...props
}: ExpandableTabsProps) {
  const reduce = !!useReducedMotion();
  const enabled = items.filter((item) => !item.disabled);
  const fallback = defaultValue ?? enabled[0]?.value;
  const [uncontrolled, setUncontrolled] = useState(fallback);
  const selected = value ?? uncontrolled;

  const select = (next: string) => {
    if (next === selected) return;
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <div
      ref={ref}
      data-slot="expandable-tabs"
      role="tablist"
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
            role="tab"
            data-slot="expandable-tabs-item"
            aria-selected={isActive}
            disabled={item.disabled}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium text-fg-secondary outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50",
              isActive && "bg-surface-floating text-fg shadow-xs",
            )}
            onClick={() => select(item.value)}
          >
            <span className="grid size-4 place-items-center [&_svg]:size-4" aria-hidden="true">
              {item.icon}
            </span>
            <AnimatePresence initial={false}>
              {isActive ? (
                <motion.span
                  key="label"
                  initial={reduce ? false : { width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 1 } : { width: 0, opacity: 0 }}
                  transition={
                    reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                  }
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              ) : (
                <span className="sr-only">{item.label}</span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
ExpandableTabs.displayName = "ExpandableTabs";
