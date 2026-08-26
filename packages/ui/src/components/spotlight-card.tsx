"use client";

import { forwardRef, type HTMLAttributes, useCallback, useRef } from "react";
import { cn } from "../lib/cn.js";

/**
 * A card with a pointer-following radial spotlight. The spotlight position is
 * written straight to the DOM via CSS custom properties (`--spot-x` / `--spot-y`)
 * inside a `requestAnimationFrame`, so moving the pointer never triggers a React
 * re-render — the gradient is recomputed by the compositor, not by React. Hover
 * opacity is toggled with a `data-` attribute (also CSS-driven). The whole effect
 * is suppressed under `prefers-reduced-motion: reduce`.
 */
export const SpotlightCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, onMouseMove, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const localRef = useRef<HTMLDivElement | null>(null);
    const frameRef = useRef<number | null>(null);

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        const node = localRef.current;
        if (node) {
          const clientX = event.clientX;
          const clientY = event.clientY;
          if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
          }
          frameRef.current = requestAnimationFrame(() => {
            frameRef.current = null;
            const current = localRef.current;
            if (!current) {
              return;
            }
            const rect = current.getBoundingClientRect();
            current.style.setProperty("--spot-x", `${clientX - rect.left}px`);
            current.style.setProperty("--spot-y", `${clientY - rect.top}px`);
          });
        }
        onMouseMove?.(event);
      },
      [onMouseMove],
    );

    const handleMouseEnter = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        localRef.current?.setAttribute("data-spotlight-hovered", "true");
        onMouseEnter?.(event);
      },
      [onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
        localRef.current?.removeAttribute("data-spotlight-hovered");
        onMouseLeave?.(event);
      },
      [onMouseLeave],
    );

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: pointer tracking drives a purely decorative spotlight; the card is not a control.
      <div
        ref={setRef}
        data-slot="spotlight-card"
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border bg-surface-raised p-6 text-fg",
          className,
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-data-[spotlight-hovered]:opacity-100 motion-reduce:hidden motion-reduce:transition-none"
          style={{
            background:
              "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklch, var(--kronus-primary) 14%, transparent), transparent 72%)",
          }}
        />
        <div className="relative">{children}</div>
      </div>
    );
  },
);
SpotlightCard.displayName = "SpotlightCard";
