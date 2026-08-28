"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ButtonHTMLAttributes, forwardRef, type ReactNode, useState } from "react";
import { cn } from "../lib/cn.js";
import { springSnappy } from "./motion-presets.js";

/** A single speed-dial action revealed when the FAB is expanded. */
export interface FabAction {
  /** The glyph shown inside the round action button. */
  icon: ReactNode;
  /** Accessible name for the action (also shown as an optional text chip). */
  label: string;
  /** Invoked when the action is activated. */
  onClick?: () => void;
}

export interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The main glyph shown inside the floating button. */
  icon: ReactNode;
  /** Accessible name for the main button — wired to `aria-label`. */
  label: string;
  /**
   * Optional speed-dial actions. When provided, clicking the FAB toggles an
   * expanded vertical stack of smaller round buttons rendered above it.
   */
  actions?: FabAction[];
}

/**
 * A floating action button: a prominent, round, solid-primary button that
 * surfaces the primary action of a view. Positioning is left to the consumer —
 * the component renders a `relative inline-flex` wrapper, so add e.g.
 * `className="fixed bottom-6 right-6"` to pin it.
 *
 * When {@link FabProps.actions} are supplied it becomes a speed-dial: clicking
 * the FAB toggles a vertical stack of smaller round action buttons above it,
 * each with its own accessible name and an optional text chip. The main button
 * exposes `aria-expanded` and rotates its glyph ~45° while open. Motion is
 * staggered and honours `prefers-reduced-motion`.
 */
export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  ({ icon, label, actions, className, onClick, ...props }, ref) => {
    const reducedMotion = useReducedMotion();
    const [open, setOpen] = useState(false);
    const hasActions = !!actions && actions.length > 0;

    return (
      <div data-slot="fab" className={cn("relative inline-flex", className)}>
        {hasActions && (
          <AnimatePresence>
            {open && (
              <motion.ul
                data-slot="fab-actions"
                className="absolute bottom-full right-0 mb-3 flex list-none flex-col items-end gap-3"
                initial={reducedMotion ? false : "hidden"}
                animate="visible"
                exit={reducedMotion ? undefined : "hidden"}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                }}
              >
                {actions.map((action) => (
                  <motion.li
                    key={action.label}
                    className="flex items-center gap-2"
                    variants={{
                      hidden: { opacity: 0, y: 8, scale: 0.8 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    transition={springSnappy}
                  >
                    <span className="rounded-md bg-surface-overlay px-2 py-1 text-xs font-medium text-fg shadow-xs">
                      {action.label}
                    </span>
                    <button
                      type="button"
                      aria-label={action.label}
                      onClick={action.onClick}
                      className="inline-flex size-11 items-center justify-center rounded-full bg-surface-raised text-fg shadow-md outline-none transition-[transform,box-shadow] duration-150 ease-[var(--ease-out-quart)] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base active:scale-95 [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:pointer-events-none"
                    >
                      {action.icon}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
        <button
          ref={ref}
          type="button"
          aria-label={label}
          aria-expanded={hasActions ? open : undefined}
          onClick={(event) => {
            if (hasActions) setOpen((prev) => !prev);
            onClick?.(event);
          }}
          className="inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md outline-none transition-[transform,box-shadow,opacity] duration-150 ease-[var(--ease-out-quart)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base active:scale-95 [&_svg]:size-6 [&_svg]:shrink-0 [&_svg]:pointer-events-none"
          {...props}
        >
          <motion.span
            className="inline-flex"
            animate={reducedMotion ? undefined : { rotate: hasActions && open ? 45 : 0 }}
            transition={springSnappy}
          >
            {icon}
          </motion.span>
        </button>
      </div>
    );
  },
);
Fab.displayName = "Fab";
