import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface RippleStyle extends CSSProperties {
  "--ripple-duration"?: string;
  "--ripple-delay"?: string;
  "--ripple-opacity"?: string;
}

export interface RippleProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Number of concentric rings. Clamped to `1–16`.
   * @default 8
   */
  count?: number;
  /**
   * Seconds for one expansion cycle.
   * @default 8
   */
  duration?: number;
}

const RIPPLE_KEYFRAMES =
  "@keyframes kronus-ripple{from{transform:scale(0);opacity:var(--ripple-opacity,0.35)}to{transform:scale(1);opacity:0}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Concentric rings that expand from the centre of a surface and fade out —
 * a living pulse behind a hero, CTA or empty state. The rings are purely
 * decorative (`aria-hidden`) and are suppressed under
 * `prefers-reduced-motion: reduce`.
 */
export function Ripple({
  ref,
  className,
  children,
  count = 8,
  duration = 8,
  style,
  ...props
}: RippleProps) {
  const ringCount = Math.min(16, Math.max(1, Math.round(finiteOr(count, 8))));
  const cycle = Math.max(0.5, finiteOr(duration, 8));

  return (
    <div
      ref={ref}
      data-slot="ripple"
      className={cn("relative overflow-hidden", className)}
      style={style}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 motion-reduce:hidden">
        <style>{RIPPLE_KEYFRAMES}</style>
        {Array.from({ length: ringCount }, (_, index) => {
          const ringStyle: RippleStyle = {
            "--ripple-duration": `${cycle}s`,
            "--ripple-delay": `${(index * cycle) / ringCount}s`,
            "--ripple-opacity": "0.35",
          };
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: rings are positional and never reorder.
              key={index}
              className="absolute start-1/2 top-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 [animation-delay:var(--ripple-delay)] [animation-duration:var(--ripple-duration)] [animation-iteration-count:infinite] [animation-name:kronus-ripple] [animation-timing-function:ease-out]"
              style={ringStyle}
            />
          );
        })}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
Ripple.displayName = "Ripple";
