import { type HTMLAttributes, type Ref, useId } from "react";
import { cn } from "../lib/cn.js";

export interface DotPatternProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Gap between dots, in pixels.
   * @default 16
   */
  gap?: number;
  /**
   * Dot radius, in pixels.
   * @default 1
   */
  radius?: number;
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * A faint SVG dotted field that sits behind content. Colour inherits
 * `currentColor` (set `text-fg` / `text-primary` on the wrapper). Decorative
 * (`aria-hidden`) with no motion of its own.
 */
export function DotPattern({
  ref,
  className,
  children,
  gap = 16,
  radius = 1,
  ...props
}: DotPatternProps) {
  const patternId = useId();
  const cell = Math.max(4, finiteOr(gap, 16));
  const r = Math.max(0.25, finiteOr(radius, 1));

  return (
    <div
      ref={ref}
      data-slot="dot-pattern"
      className={cn("relative overflow-hidden text-fg", className)}
      {...props}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full opacity-[0.18]"
      >
        <defs>
          <pattern id={patternId} width={cell} height={cell} patternUnits="userSpaceOnUse">
            <circle cx={cell / 2} cy={cell / 2} r={r} fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
DotPattern.displayName = "DotPattern";
