"use client";

import { forwardRef, type HTMLAttributes, useCallback, useEffect, useRef } from "react";
import { cn } from "../lib/cn.js";

/**
 * A card that tilts in 3D toward the pointer. The pointer position is mapped to a
 * pair of rotations and written straight to the DOM via CSS custom properties
 * (`--tilt-rx` / `--tilt-ry`, plus `--tilt-gx` / `--tilt-gy` for the glare) inside
 * a single `requestAnimationFrame` — moving the pointer therefore never triggers a
 * React re-render; the compositor recomputes the transform. A short
 * `transition-transform` smooths the follow and eases the card back to flat on
 * leave. Hover zoom and the glare sheen are toggled with a `data-tilting`
 * attribute (CSS-driven). Unlike `SpotlightCard` (a flat radial glow), this is a
 * real perspective transform with optional depth parallax.
 *
 * Performance: no state updates on `mousemove`; the pending frame is cancelled on
 * every move, on leave, and on unmount. Accessibility: the effect is purely
 * decorative — the card is not a control, keeps its natural focus/reading order,
 * and is fully neutralised under `prefers-reduced-motion: reduce` (the transform
 * is forced to `none` and the glare is hidden).
 */
export interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum rotation, in degrees, reached on each axis at the card's edges. Higher feels more dramatic. @default 12 */
  maxTilt?: number;
  /** Render a soft pointer-following glare sheen across the surface. @default false */
  glare?: boolean;
  /** Uniform zoom applied while the pointer is over the card (`1` = none). @default 1.03 */
  scale?: number;
  /** Lift the content toward the viewer on hover for a layered parallax depth effect. @default false */
  parallax?: boolean;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      maxTilt = 12,
      glare = false,
      scale = 1.03,
      parallax = false,
      className,
      style,
      children,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
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
        if (node && !prefersReducedMotion()) {
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
            // Normalise pointer to 0..1 within the card, then clamp so a fast
            // pointer that overshoots the bounds can't exceed maxTilt.
            const px = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
            const py = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
            current.style.setProperty("--tilt-ry", `${(px - 0.5) * 2 * maxTilt}deg`);
            current.style.setProperty("--tilt-rx", `${(0.5 - py) * 2 * maxTilt}deg`);
            current.style.setProperty("--tilt-gx", `${px * 100}%`);
            current.style.setProperty("--tilt-gy", `${py * 100}%`);
          });
        }
        onMouseMove?.(event);
      },
      [maxTilt, onMouseMove],
    );

    const handleMouseEnter = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        const node = localRef.current;
        if (node && !prefersReducedMotion()) {
          node.style.setProperty("--tilt-scale", String(scale));
          node.setAttribute("data-tilting", "true");
        }
        onMouseEnter?.(event);
      },
      [scale, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
        const node = localRef.current;
        if (node) {
          node.style.setProperty("--tilt-rx", "0deg");
          node.style.setProperty("--tilt-ry", "0deg");
          node.style.setProperty("--tilt-scale", "1");
          node.removeAttribute("data-tilting");
        }
        onMouseLeave?.(event);
      },
      [onMouseLeave],
    );

    // Cancel any in-flight frame if the card unmounts mid-tilt.
    useEffect(
      () => () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }
      },
      [],
    );

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: pointer tracking drives a purely decorative 3D tilt; the card itself is not a control.
      <div
        ref={setRef}
        data-slot="tilt-card"
        className={cn(
          "group relative rounded-2xl border border-border bg-surface-raised p-6 text-fg shadow-sm",
          "[transform-style:preserve-3d] transition-[transform,box-shadow] duration-150 ease-out will-change-transform",
          "group-data-[tilting]:shadow-lg data-[tilting]:shadow-lg",
          "motion-reduce:transition-none motion-reduce:!transform-none",
          className,
        )}
        style={{
          transform:
            "perspective(1000px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg)) scale(var(--tilt-scale, 1))",
          ...style,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {glare ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-300 group-data-[tilting]:opacity-100 motion-reduce:hidden motion-reduce:transition-none"
            style={{
              background:
                "radial-gradient(600px circle at var(--tilt-gx, 50%) var(--tilt-gy, 50%), color-mix(in oklch, var(--cronus-fg) 16%, transparent), transparent 60%)",
            }}
          />
        ) : null}
        <div
          className={cn(
            "relative",
            parallax &&
              "[transform:translateZ(0)] transition-transform duration-150 ease-out group-data-[tilting]:[transform:translateZ(42px)] motion-reduce:!transform-none",
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
TiltCard.displayName = "TiltCard";
