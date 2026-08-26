import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface RetroGridStyle extends CSSProperties {
  "--retro-duration"?: string;
}

export interface RetroGridProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Seconds for one floor-scroll cycle.
   * @default 8
   */
  duration?: number;
  /**
   * Perspective tilt of the floor, in degrees.
   * @default 60
   */
  angle?: number;
}

const RETRO_KEYFRAMES =
  "@keyframes cronus-retro-grid{from{transform:translateY(0)}to{transform:translateY(var(--retro-cell,48px))}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * A receding perspective grid floor — the synthwave stage behind a hero.
 * Scrolls slowly toward the horizon and is fully suppressed under
 * `prefers-reduced-motion: reduce` (the floor still renders, it just stops
 * moving).
 */
export function RetroGrid({
  ref,
  className,
  children,
  duration = 8,
  angle = 60,
  style,
  ...props
}: RetroGridProps) {
  const cycle = Math.max(1, finiteOr(duration, 8));
  const tilt = finiteOr(angle, 60);
  const gridStyle: RetroGridStyle = {
    "--retro-duration": `${cycle}s`,
    perspective: "240px",
  };

  return (
    <div
      ref={ref}
      data-slot="retro-grid"
      className={cn("relative overflow-hidden", className)}
      style={{ ...gridStyle, ...style }}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_70%,transparent)]"
      >
        <style>{RETRO_KEYFRAMES}</style>
        <div
          className="absolute inset-x-0 -bottom-1/2 h-[200%] origin-[50%_0%] motion-reduce:[animation-name:none]"
          style={{ transform: `rotateX(${tilt}deg)` }}
        >
          <div
            className="absolute inset-0 [animation-duration:var(--retro-duration)] [animation-iteration-count:infinite] [animation-name:cronus-retro-grid] [animation-timing-function:linear] motion-reduce:[animation-name:none]"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklch, var(--cronus-border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--cronus-border) 70%, transparent) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
RetroGrid.displayName = "RetroGrid";
