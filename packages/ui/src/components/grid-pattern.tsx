import { type HTMLAttributes, type Ref, useId } from "react";
import { cn } from "../lib/cn.js";

export interface GridPatternProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Cell size, in pixels.
   * @default 24
   */
  size?: number;
  /**
   * Stroke width of the grid lines, in pixels.
   * @default 1
   */
  strokeWidth?: number;
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * A faint SVG grid that sits behind content. Colour inherits `currentColor`.
 * Decorative (`aria-hidden`) with no motion of its own.
 */
export function GridPattern({
  ref,
  className,
  children,
  size = 24,
  strokeWidth = 1,
  ...props
}: GridPatternProps) {
  const patternId = useId();
  const cell = Math.max(4, finiteOr(size, 24));
  const stroke = Math.max(0.25, finiteOr(strokeWidth, 1));

  return (
    <div
      ref={ref}
      data-slot="grid-pattern"
      className={cn("relative overflow-hidden text-border", className)}
      {...props}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
        <defs>
          <pattern id={patternId} width={cell} height={cell} patternUnits="userSpaceOnUse">
            <path
              d={`M ${cell} 0 L 0 0 0 ${cell}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
GridPattern.displayName = "GridPattern";
