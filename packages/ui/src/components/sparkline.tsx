import { forwardRef, type SVGAttributes, useId } from "react";
import { cn } from "../lib/cn.js";

type SparklineTone = "primary" | "success" | "warning" | "error" | "info" | "fg";
type SparklineType = "line" | "bar";

// Token-driven tone classes. Each sets `currentColor` via a Tailwind `text-*`
// utility (mapped to a `--kronus-*` var), so the SVG strokes/fills inherit the
// themed color through `stroke="currentColor"` / `fill="currentColor"`.
const toneStyles: Record<SparklineTone, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-info",
  fg: "text-fg",
};

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, "type"> {
  /** The series to plot. Order is preserved; values map left→right. */
  data: number[];
  /** Intrinsic width of the SVG in px. */
  width?: number;
  /** Intrinsic height of the SVG in px. */
  height?: number;
  /** Render a connected line or evenly spaced bars. */
  type?: SparklineType;
  /** Color, mapped to a token via `currentColor`. */
  tone?: SparklineTone;
  /** For `type="line"`, fill a soft token-tinted gradient under the line. */
  area?: boolean;
  /** Stroke width of the line (line type only). */
  strokeWidth?: number;
}

/**
 * Keep only finite numbers so a `NaN`/`Infinity` in the series cannot produce
 * `NaN` SVG coordinates (which silently break the whole path).
 */
function sanitize(data: number[]): number[] {
  return data.filter((value) => Number.isFinite(value));
}

/**
 * Scale a value to a Y coordinate inside the box. SVG Y grows downward, so the
 * max sits at `pad` (top) and the min at `height - pad` (bottom). When every
 * value is equal (`min === max`) the line collapses to a flat midline instead
 * of dividing by zero.
 */
function scaleY(value: number, min: number, max: number, height: number, pad: number): number {
  const span = max - min;
  const usable = height - pad * 2;
  if (span === 0) {
    return height / 2;
  }
  return pad + (1 - (value - min) / span) * usable;
}

export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(
  (
    {
      className,
      data,
      width = 96,
      height = 28,
      type = "line",
      tone = "primary",
      area = false,
      strokeWidth = 1.5,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const points = sanitize(data);
    const count = points.length;
    const gradientId = useId();

    // Default summary keeps assistive tech informed without exposing the raw
    // series; callers can override with a richer `aria-label`.
    const label = ariaLabel ?? `Trend, ${count} ${count === 1 ? "point" : "points"}`;

    // Inset the geometry so a thick stroke / rounded bar cap is not clipped at
    // the box edge.
    const pad = Math.max(strokeWidth, 1);
    const min = count > 0 ? Math.min(...points) : 0;
    const max = count > 0 ? Math.max(...points) : 0;

    const rootProps = {
      ref,
      "data-slot": "sparkline",
      "data-tone": tone,
      role: "img" as const,
      "aria-label": label,
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: "none",
      fill: "none",
      className: cn("inline-block overflow-visible align-middle", toneStyles[tone], className),
      ...props,
    };

    if (type === "bar") {
      // Evenly spaced bars with a small gap; each bar height is scaled to the
      // box. A flat series renders thin baseline ticks so the slot stays legible.
      const span = max - min;
      const slot = count > 0 ? width / count : width;
      const gap = Math.min(slot * 0.3, 4);
      const barWidth = Math.max(slot - gap, 0.5);
      const radius = Math.min(barWidth / 2, 2);
      const usable = height - pad * 2;

      return (
        <svg {...rootProps}>
          <title>{label}</title>
          <g fill="currentColor">
            {points.map((value, index) => {
              const ratio = span === 0 ? 0 : (value - min) / span;
              // Floor at 1px so even the smallest value stays visible.
              const barHeight = Math.max(ratio * usable, 1);
              const x = index * slot + gap / 2;
              const y = height - pad - barHeight;
              return (
                <rect
                  // Index keys are stable: bars are positional and never reordered.
                  // biome-ignore lint/suspicious/noArrayIndexKey: positional series
                  key={index}
                  data-slot="sparkline-bar"
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={radius}
                />
              );
            })}
          </g>
        </svg>
      );
    }

    // Line: map each value to a point. A single point renders a flat midline
    // segment so the component never collapses to nothing.
    const step = count > 1 ? (width - pad * 2) / (count - 1) : 0;
    const coords = points.map((value, index) => {
      const x = count > 1 ? pad + index * step : width / 2;
      const y = scaleY(value, min, max, height, pad);
      return [x, y] as const;
    });

    const linePath =
      coords.length === 1
        ? // Draw a short horizontal stub centered on the lone point.
          `M ${pad} ${coords[0]?.[1]} L ${width - pad} ${coords[0]?.[1]}`
        : coords.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

    // Close the path down to the baseline and back for the area fill.
    const baseline = height - pad;
    const areaPath =
      coords.length === 1
        ? `M ${pad} ${coords[0]?.[1]} L ${width - pad} ${coords[0]?.[1]} L ${width - pad} ${baseline} L ${pad} ${baseline} Z`
        : `${linePath} L ${coords.at(-1)?.[0]} ${baseline} L ${coords[0]?.[0]} ${baseline} Z`;

    return (
      <svg {...rootProps}>
        <title>{label}</title>
        <g>
          {count > 0 && area && (
            <>
              <defs>
                {/* Vertical token-tinted gradient: ~18% of the tone color at the
                    top fading to transparent at the baseline. `color-mix` keeps
                    it driven by `currentColor`, so it re-themes with the tone. */}
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="color-mix(in oklch, currentColor 18%, transparent)"
                  />
                  <stop
                    offset="100%"
                    stopColor="color-mix(in oklch, currentColor 0%, transparent)"
                  />
                </linearGradient>
              </defs>
              <path data-slot="sparkline-area" d={areaPath} fill={`url(#${gradientId})`} />
            </>
          )}
          {count > 0 && (
            <path
              data-slot="sparkline-line"
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </g>
      </svg>
    );
  },
);
Sparkline.displayName = "Sparkline";
