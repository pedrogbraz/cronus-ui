import { type HTMLAttributes, type Ref, useId } from "react";
import { cn } from "../lib/cn.js";

export interface NoiseProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Overlay opacity of the grain, `0–1`.
   * @default 0.08
   */
  opacity?: number;
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * A film-grain overlay generated with SVG `feTurbulence`. Sits above the
 * background and below content, purely decorative, with no animation of its
 * own — the grain is a still texture that reads as analog depth.
 */
export function Noise({ ref, className, children, opacity = 0.08, ...props }: NoiseProps) {
  const filterId = useId();
  const overlayOpacity = Math.min(1, Math.max(0, finiteOr(opacity, 0.08)));

  return (
    <div
      ref={ref}
      data-slot="noise"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
        style={{ opacity: overlayOpacity }}
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={4}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
Noise.displayName = "Noise";
