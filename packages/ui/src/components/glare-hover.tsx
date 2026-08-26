"use client";

import {
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type Ref,
  useCallback,
  useRef,
} from "react";
import { cn } from "../lib/cn.js";

export interface GlareHoverProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/**
 * A diagonal glare that tracks the pointer across a surface. Position is
 * written to CSS variables inside `requestAnimationFrame` so pointer motion
 * never re-renders React. Decorative and suppressed under reduced motion
 * and on coarse pointers.
 */
export function GlareHover({
  ref,
  className,
  children,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props
}: GlareHoverProps) {
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
    (event: ReactMouseEvent<HTMLDivElement>) => {
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
          if (!current) return;
          const rect = current.getBoundingClientRect();
          const x = ((clientX - rect.left) / rect.width) * 100;
          const y = ((clientY - rect.top) / rect.height) * 100;
          current.style.setProperty("--glare-x", `${x}%`);
          current.style.setProperty("--glare-y", `${y}%`);
        });
      }
      onMouseMove?.(event);
    },
    [onMouseMove],
  );

  const handleMouseEnter = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      localRef.current?.setAttribute("data-glare-hovered", "true");
      onMouseEnter?.(event);
    },
    [onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      localRef.current?.removeAttribute("data-glare-hovered");
      onMouseLeave?.(event);
    },
    [onMouseLeave],
  );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: pointer tracking drives a decorative glare; the surface is not a control.
    <div
      ref={setRef}
      data-slot="glare-hover"
      className={cn("group/glare relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-data-[glare-hovered]/glare:opacity-100 motion-reduce:hidden motion-reduce:transition-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 32%, color-mix(in oklch, var(--cronus-fg) 18%, transparent) 50%, transparent 68%)",
          backgroundSize: "220% 220%",
          backgroundPosition: "var(--glare-x, 50%) var(--glare-y, 50%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
GlareHover.displayName = "GlareHover";
