import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface MeteorStyle extends CSSProperties {
  "--meteor-delay"?: string;
  "--meteor-duration"?: string;
  "--meteor-travel"?: string;
  "--meteor-angle"?: string;
}

export interface MeteorsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Number of shooting stars. Clamped to `1–60`.
   * @default 20
   */
  count?: number;
}

/**
 * Travel is along the meteor's local X after `--meteor-angle`. The animation
 * must set `rotate(...)` itself — a class `-rotate-45` is overwritten by
 * `@keyframes { transform }` and the streak then slides sideways as a
 * horizontal dash.
 */
const METEOR_KEYFRAMES =
  "@keyframes cronus-meteor{0%{transform:rotate(var(--meteor-angle)) translate3d(0,0,0);opacity:0}7%{opacity:1}78%{opacity:1;transform:rotate(var(--meteor-angle)) translate3d(calc(var(--meteor-travel)*0.86),0,0)}88%{opacity:0.55;transform:rotate(var(--meteor-angle)) translate3d(var(--meteor-travel),0,0) scale(1.85)}100%{transform:rotate(var(--meteor-angle)) translate3d(var(--meteor-travel),0,0) scale(0.12);opacity:0}}";

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
          // Spawn along the top / upper-right so travel at ~125° (down-left)
          // crosses the field and exits through the bottom.
          const meteorStyle: MeteorStyle = {
            insetBlockStart: `${-14 + ((index * 17) % 32)}%`,
            insetInlineStart: `${8 + ((index * 43) % 92)}%`,
            "--meteor-delay": `${((index * 13) % 80) / 10}s`,
            "--meteor-duration": `${1.8 + ((index * 7) % 22) / 10}s`,
            "--meteor-travel": `${340 + ((index * 29) % 220)}px`,
            "--meteor-angle": `${122 + ((index * 11) % 16)}deg`,
          };
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: meteors are positional and never reorder.
              key={index}
              className="absolute h-px w-16 origin-left [animation-delay:var(--meteor-delay)] [animation-duration:var(--meteor-duration)] [animation-iteration-count:infinite] [animation-name:cronus-meteor] [animation-timing-function:linear]"
              style={{
                ...meteorStyle,
                background:
                  "linear-gradient(to right, transparent, color-mix(in oklch, var(--cronus-fg) 85%, transparent))",
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
