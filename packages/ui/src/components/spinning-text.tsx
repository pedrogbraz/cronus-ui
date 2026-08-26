import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface SpinningTextStyle extends CSSProperties {
  "--spin-duration"?: string;
  "--spin-radius"?: string;
}

export interface SpinningTextProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  ref?: Ref<HTMLDivElement>;
  /** The phrase laid out around the circle. */
  children: string;
  /**
   * Radius of the circle, in pixels.
   * @default 48
   */
  radius?: number;
  /**
   * Seconds for one full revolution.
   * @default 16
   */
  duration?: number;
  /** Spin counter-clockwise. @default false */
  reverse?: boolean;
}

const SPIN_KEYFRAMES =
  "@keyframes cronus-spinning-text{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";

const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function segmentGraphemes(text: string): string[] {
  if (graphemeSegmenter) {
    return Array.from(graphemeSegmenter.segment(text), (segment) => segment.segment);
  }
  return Array.from(text);
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Lays a phrase around a circle and slowly rotates it. Assistive tech reads
 * the original string once (`sr-only`); the orbiting letters are
 * `aria-hidden`. Reduced-motion visitors still see the circle, it just does
 * not spin.
 */
export function SpinningText({
  ref,
  className,
  children,
  radius = 48,
  duration = 16,
  reverse = false,
  style,
  ...props
}: SpinningTextProps) {
  const glyphs = segmentGraphemes(children);
  const r = Math.max(12, finiteOr(radius, 48));
  const cycle = Math.max(2, finiteOr(duration, 16));
  const spinStyle: SpinningTextStyle = {
    "--spin-duration": `${cycle}s`,
    "--spin-radius": `${r}px`,
    width: r * 2,
    height: r * 2,
  };

  return (
    <div
      ref={ref}
      data-slot="spinning-text"
      className={cn("relative inline-grid place-items-center", className)}
      style={{ ...spinStyle, ...style }}
      {...props}
    >
      <span className="sr-only">{children}</span>
      <style>{SPIN_KEYFRAMES}</style>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 [animation-duration:var(--spin-duration)] [animation-iteration-count:infinite] [animation-name:cronus-spinning-text] [animation-timing-function:linear] motion-reduce:[animation-name:none]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {glyphs.map((glyph, index) => {
          const angle = glyphs.length === 0 ? 0 : (index / glyphs.length) * 360;
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: glyph order is the string itself.
              key={`${glyph}-${index}`}
              className="absolute start-1/2 top-1/2 origin-[0_0] text-xs font-medium uppercase tracking-widest text-fg-secondary"
              style={{
                transform: `rotate(${angle}deg) translateY(calc(var(--spin-radius) * -1))`,
              }}
            >
              {glyph === " " ? "\u00a0" : glyph}
            </span>
          );
        })}
      </div>
    </div>
  );
}
SpinningText.displayName = "SpinningText";
