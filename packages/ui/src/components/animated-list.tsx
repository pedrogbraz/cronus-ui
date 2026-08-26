"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Children, type HTMLAttributes, isValidElement, type Ref } from "react";
import { cn } from "../lib/cn.js";

export interface AnimatedListProps extends HTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>;
  /**
   * Seconds between consecutive item reveals.
   * @default 0.08
   */
  stagger?: number;
  /**
   * How `prefers-reduced-motion` is honoured. Defaults to `"user"` (items
   * appear without the stagger). `"never"` always animates.
   * @default "user"
   */
  reducedMotion?: "user" | "always" | "never";
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Staggers its children in with a short rise + fade. Renders a `<ul>` and
 * wraps each child in an `<li>` — pass the item body (not an `<li>`), with a
 * stable `key`. Reduced-motion visitors get the items fully visible on first
 * paint.
 */
export function AnimatedList({
  ref,
  className,
  children,
  stagger = 0.08,
  reducedMotion = "user",
  ...props
}: AnimatedListProps) {
  const systemReduced = useReducedMotion();
  const reduce =
    reducedMotion === "never" ? false : reducedMotion === "always" ? true : !!systemReduced;
  const delay = Math.max(0, finiteOr(stagger, 0.08));
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <ul
      ref={ref}
      data-slot="animated-list"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <AnimatePresence initial={!reduce}>
        {items.map((child, index) => (
          <motion.li
            key={child.key ?? index}
            data-slot="animated-list-item"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={
              reduce
                ? { duration: 0 }
                : { delay: index * delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {child}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
AnimatedList.displayName = "AnimatedList";
