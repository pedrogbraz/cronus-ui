"use client";

import { motion, useReducedMotion } from "motion/react";
import { type HTMLAttributes, type ReactNode, type Ref, useState } from "react";
import { cn } from "../lib/cn.js";

export interface DynamicIslandView {
  id: string;
  /** Accessible name for this view. */
  label: string;
  content: ReactNode;
}

export interface DynamicIslandProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  ref?: Ref<HTMLDivElement>;
  views: DynamicIslandView[];
  /** Controlled active view id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
}

/**
 * A compact live-activity pill that morphs between views. The shell resizes
 * with a spring; inner content cross-fades. Views are a tablist so the
 * control is keyboard-operable. Reduced-motion visitors get an instant
 * resize instead of the morph.
 */
export function DynamicIsland({
  ref,
  className,
  views,
  value,
  defaultValue,
  onValueChange,
  ...props
}: DynamicIslandProps) {
  const reduce = !!useReducedMotion();
  const fallback = defaultValue ?? views[0]?.id;
  const [uncontrolled, setUncontrolled] = useState(fallback);
  const selected = value ?? uncontrolled;
  const active = views.find((view) => view.id === selected) ?? views[0];

  const select = (id: string) => {
    if (id === selected) return;
    if (value === undefined) setUncontrolled(id);
    onValueChange?.(id);
  };

  return (
    <div
      ref={ref}
      data-slot="dynamic-island"
      className={cn("inline-flex flex-col items-center gap-3", className)}
      {...props}
    >
      <motion.div
        layout={!reduce}
        data-slot="dynamic-island-shell"
        className="overflow-hidden rounded-full border border-border bg-surface-floating px-4 py-2 text-fg shadow-md"
        transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0.18, duration: 0.45 }}
      >
        <motion.div
          key={active?.id ?? "empty"}
          initial={reduce ? false : { opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={reduce ? { duration: 0 } : { duration: 0.2 }}
          className="flex items-center gap-3"
        >
          {active?.content}
        </motion.div>
      </motion.div>
      <div role="tablist" aria-label={active?.label} className="flex items-center gap-1">
        {views.map((view) => {
          const isActive = view.id === selected;
          return (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={view.label}
              data-slot="dynamic-island-trigger"
              className={cn(
                "size-2 rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
                isActive ? "bg-fg" : "bg-border hover:bg-border-strong",
              )}
              onClick={() => select(view.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
DynamicIsland.displayName = "DynamicIsland";
