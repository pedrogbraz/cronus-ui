import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface FlickerStyle extends CSSProperties {
  "--flicker-delay"?: string;
  "--flicker-duration"?: string;
}

export interface FlickeringGridProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Number of columns in the grid.
   * @default 16
   */
  columns?: number;
  /**
   * Number of rows in the grid.
   * @default 10
   */
  rows?: number;
}

const FLICKER_KEYFRAMES = "@keyframes cronus-flicker{0%,100%{opacity:0.08}50%{opacity:0.45}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * A grid of cells that independently flicker — a quiet digital texture for
 * empty states and hero backdrops. Timings are derived from the cell index so
 * SSR and the client paint the same field. Decorative and paused under
 * reduced motion (cells sit at a still, faint opacity).
 */
export function FlickeringGrid({
  ref,
  className,
  children,
  columns = 16,
  rows = 10,
  style,
  ...props
}: FlickeringGridProps) {
  const cols = Math.min(48, Math.max(2, Math.round(finiteOr(columns, 16))));
  const rowCount = Math.min(32, Math.max(2, Math.round(finiteOr(rows, 10))));
  const cells = cols * rowCount;

  return (
    <div
      ref={ref}
      data-slot="flickering-grid"
      className={cn("relative overflow-hidden", className)}
      style={style}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid motion-reduce:opacity-40"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
          gap: 2,
        }}
      >
        <style>{FLICKER_KEYFRAMES}</style>
        {Array.from({ length: cells }, (_, index) => {
          const cellStyle: FlickerStyle = {
            "--flicker-delay": `${(index * 37) % 1600}ms`,
            "--flicker-duration": `${1.4 + ((index * 11) % 18) / 10}s`,
          };
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional and never reorder.
              key={index}
              className="rounded-[1px] bg-fg [animation-delay:var(--flicker-delay)] [animation-duration:var(--flicker-duration)] [animation-iteration-count:infinite] [animation-name:cronus-flicker] motion-reduce:[animation-name:none]"
              style={cellStyle}
            />
          );
        })}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
FlickeringGrid.displayName = "FlickeringGrid";
