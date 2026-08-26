import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface MeteorStyle extends CSSProperties {
  "--meteor-delay"?: string;
  "--meteor-duration"?: string;
  "--meteor-travel"?: string;
}

export interface MeteorsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Number of shooting stars. Clamped to `1–60`.
   * @default 20
   */
  count?: number;
}

const METEOR_KEYFRAMES =
  "@keyframes cronus-meteor{0%{transform:translate3d(0,0,0);opacity:0}8%{opacity:1}to{transform:translate3d(var(--meteor-travel),var(--meteor-travel),0);opacity:0}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * A field of thin shooting-star trails that drift diagonally across a surface.
 * Positions and timings are derived from the meteor index (no `Math.random`),
 * so server and client paint the same field. Decorative and fully suppressed
 * under `prefers-reduced-motion: reduce`.
 */
export function Meteors({ ref, className, children, count = 20, style, ...props }: MeteorsProps) {
  const meteorCount = Math.min(60, Math.max(1, Math.round(finiteOr(count, 20))));

  return (
    <div
      ref={ref}
      data-slot="meteors"
      className={cn("relative overflow-hidden", className)}
      style={style}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 motion-reduce:hidden">
        <style>{METEOR_KEYFRAMES}</style>
        {Array.from({ length: meteorCount }, (_, index) => {
          const meteorStyle: MeteorStyle = {
            insetBlockStart: `${(index * 37) % 100}%`,
            insetInlineStart: `${(index * 53) % 100}%`,
            "--meteor-delay": `${((index * 13) % 80) / 10}s`,
            "--meteor-duration": `${2 + ((index * 7) % 20) / 10}s`,
            "--meteor-travel": "180px",
          };
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: meteors are positional and never reorder.
              key={index}
              className="absolute h-px w-14 -rotate-45 [animation-delay:var(--meteor-delay)] [animation-duration:var(--meteor-duration)] [animation-iteration-count:infinite] [animation-name:cronus-meteor] [animation-timing-function:linear]"
              style={{
                ...meteorStyle,
                background:
                  "linear-gradient(to right, color-mix(in oklch, var(--cronus-fg) 80%, transparent), transparent)",
              }}
            />
          );
        })}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
Meteors.displayName = "Meteors";
