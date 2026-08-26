import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface StarBorderStyle extends CSSProperties {
  "--star-duration"?: string;
}

export interface StarBorderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Seconds for one sparkle lap around the perimeter.
   * @default 6
   */
  duration?: number;
}

const STAR_KEYFRAMES =
  "@keyframes cronus-star-border{from{offset-distance:0%}to{offset-distance:100%}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Two sparkle heads that chase each other around a card's border. Distinct
 * from `BorderBeam` (a comet trail): these are discrete twinkles, not a
 * continuous beam. Decorative and hidden under reduced motion.
 */
export function StarBorder({
  ref,
  className,
  children,
  duration = 6,
  style,
  ...props
}: StarBorderProps) {
  const cycle = Math.max(2, finiteOr(duration, 6));
  const starStyle: StarBorderStyle = { "--star-duration": `${cycle}s` };

  return (
    <div
      ref={ref}
      data-slot="star-border"
      className={cn("relative rounded-2xl", className)}
      style={{ ...starStyle, ...style }}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] motion-reduce:hidden"
      >
        <style>{STAR_KEYFRAMES}</style>
        {[0, 50].map((phase) => (
          <span
            key={phase}
            className="absolute size-1.5 rounded-full bg-primary shadow-glow [animation-duration:var(--star-duration)] [animation-iteration-count:infinite] [animation-name:cronus-star-border] [animation-timing-function:linear] [offset-path:rect(0_auto_auto_0_round_12px)]"
            style={{ animationDelay: `-${(phase / 100) * cycle}s` }}
          />
        ))}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
StarBorder.displayName = "StarBorder";
