import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn.js";

type UsageMeterTone = "auto" | "primary" | "success" | "warning" | "error";
type UsageMeterVariant = "linear" | "circular";

// Token-driven tone classes. Linear uses a `bg-*` fill; circular strokes via
// `currentColor`, so it pairs a matching `text-*` class (mirrors Spinner).
const toneStyles: Record<Exclude<UsageMeterTone, "auto">, { fill: string; stroke: string }> = {
  primary: { fill: "bg-primary", stroke: "text-primary" },
  success: { fill: "bg-success", stroke: "text-success" },
  warning: { fill: "bg-warning", stroke: "text-warning" },
  error: { fill: "bg-error", stroke: "text-error" },
};

/**
 * Resolve the ratio (0–1) defensively: a non-finite `value`/`max` or a
 * `max <= 0` collapses to 0 so the meter renders an empty track instead of
 * `NaN`/`Infinity` widths. The ratio is clamped to 0–1 so values over `max`
 * cap the bar at 100%.
 */
function resolveRatio(value: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, value / max));
}

// `tone: "auto"` maps the usage ratio to a severity color:
// ≤75% primary, 75–90% warning, >90% error.
function toneForRatio(ratio: number): Exclude<UsageMeterTone, "auto"> {
  if (ratio > 0.9) {
    return "error";
  }
  if (ratio > 0.75) {
    return "warning";
  }
  return "primary";
}

// Pinned to en-US on purpose. A bare `toLocaleString()` reads the ambient
// locale, which differs between the server (Node) and the browser (the
// visitor's), so the same meter renders two different strings and React
// reports a hydration mismatch. A published component must be deterministic;
// apps that want localized digits pass `formatValue`.
const VALUE_FORMATTER = new Intl.NumberFormat("en-US");

function defaultFormatValue(value: number, max: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const safeMax = Number.isFinite(max) ? max : 0;
  return `${VALUE_FORMATTER.format(safeValue)} / ${VALUE_FORMATTER.format(safeMax)}`;
}

export interface UsageMeterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Current usage. */
  value: number;
  /** The quota / limit the usage is measured against. */
  max: number;
  /** Optional label shown beside (linear) or below (circular) the meter. */
  label?: ReactNode;
  /** Unit suffix appended to the value readout, e.g. "tokens". */
  unit?: string;
  /** Layout: a horizontal bar or an SVG ring. */
  variant?: UsageMeterVariant;
  /** Color. `auto` derives severity from the usage ratio; others are explicit. */
  tone?: UsageMeterTone;
  /** Override the `value / max` readout. */
  formatValue?: (value: number, max: number) => string;
  /** Whether to render the textual value/percentage readout. */
  showValue?: boolean;
  /** Diameter of the ring in px (circular variant only). */
  size?: number;
}

export const UsageMeter = forwardRef<HTMLDivElement, UsageMeterProps>(
  (
    {
      className,
      value,
      max,
      label,
      unit,
      variant = "linear",
      tone = "auto",
      formatValue,
      showValue = true,
      size = 96,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const ratio = resolveRatio(value, max);
    const percent = Math.round(ratio * 100);
    const resolvedTone = tone === "auto" ? toneForRatio(ratio) : tone;
    const styles = toneStyles[resolvedTone];

    const readout = (formatValue ?? defaultFormatValue)(value, max);
    const valueText = unit ? `${readout} ${unit}` : readout;

    // Prefer an explicit aria-label, then the label, then the value readout so
    // assistive tech always announces something meaningful.
    const accessibleLabel =
      ariaLabel ?? (typeof label === "string" ? label : undefined) ?? valueText;

    const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
    const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), safeMax) : 0;

    const meterAria = {
      role: "meter" as const,
      "aria-valuenow": safeValue,
      "aria-valuemin": 0,
      "aria-valuemax": safeMax,
      "aria-valuetext": `${percent}%`,
      "aria-label": accessibleLabel,
    };

    if (variant === "circular") {
      return (
        <UsageMeterCircularImpl
          ref={ref}
          className={className}
          label={label}
          percent={percent}
          valueText={showValue ? valueText : undefined}
          showValue={showValue}
          stroke={styles.stroke}
          ratio={ratio}
          size={size}
          meterAria={meterAria}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        data-slot="usage-meter"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {(label != null || showValue) && (
          <div className="flex items-baseline justify-between gap-2 text-sm">
            {label != null ? (
              <span data-slot="usage-meter-label" className="font-medium text-fg">
                {label}
              </span>
            ) : (
              <span />
            )}
            {showValue && (
              <span
                data-slot="usage-meter-value"
                className="flex items-baseline gap-2 tabular-nums text-fg-secondary"
              >
                <span>{valueText}</span>
                <span className="text-fg-tertiary">{percent}%</span>
              </span>
            )}
          </div>
        )}
        <div
          data-slot="usage-meter-track"
          {...meterAria}
          className="relative h-2 w-full overflow-hidden rounded-full bg-surface-overlay"
        >
          <div
            data-slot="usage-meter-fill"
            className={cn(
              "h-full rounded-full transition-[width] duration-500 ease-[var(--ease-out-quart)]",
              styles.fill,
            )}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>
    );
  },
);
UsageMeter.displayName = "UsageMeter";

interface CircularImplProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label?: ReactNode;
  percent: number;
  valueText?: string;
  showValue: boolean;
  stroke: string;
  ratio: number;
  size: number;
  meterAria: {
    role: "meter";
    "aria-valuenow": number;
    "aria-valuemin": number;
    "aria-valuemax": number;
    "aria-valuetext": string;
    "aria-label": string;
  };
}

const UsageMeterCircularImpl = forwardRef<HTMLDivElement, CircularImplProps>(
  (
    { className, label, percent, valueText, showValue, stroke, ratio, size, meterAria, ...props },
    ref,
  ) => {
    // Geometry: a 12.5%-of-size stroke reads well at the ~96px default. The
    // radius leaves room for the stroke so it isn't clipped by the viewBox.
    const strokeWidth = Math.max(2, Math.round(size * 0.1));
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - ratio);

    return (
      <div
        ref={ref}
        data-slot="usage-meter"
        className={cn("inline-flex flex-col items-center gap-2", className)}
        {...props}
      >
        <div
          data-slot="usage-meter-ring"
          {...meterAria}
          className="relative inline-flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            // Rotate so the ring fills clockwise from 12 o'clock.
            className={cn("-rotate-90", stroke)}
            aria-hidden="true"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-surface-overlay"
            />
            <circle
              data-slot="usage-meter-ring-progress"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-[stroke-dashoffset] duration-500 ease-[var(--ease-out-quart)]"
            />
          </svg>
          {showValue && (
            <span
              data-slot="usage-meter-value"
              className="absolute inset-0 flex items-center justify-center font-display text-lg font-semibold tabular-nums text-fg"
            >
              {percent}%
            </span>
          )}
        </div>
        {label != null && (
          <div data-slot="usage-meter-label" className="text-center text-sm font-medium text-fg">
            {label}
          </div>
        )}
        {showValue && valueText && (
          <div className="text-center text-xs tabular-nums text-fg-secondary">{valueText}</div>
        )}
      </div>
    );
  },
);
UsageMeterCircularImpl.displayName = "UsageMeterCircularImpl";

/** Thin wrapper that always renders the linear variant. */
export const UsageMeterLinear = forwardRef<HTMLDivElement, Omit<UsageMeterProps, "variant">>(
  (props, ref) => <UsageMeter ref={ref} variant="linear" {...props} />,
);
UsageMeterLinear.displayName = "UsageMeterLinear";

/** Thin wrapper that always renders the circular variant. */
export const UsageMeterCircular = forwardRef<HTMLDivElement, Omit<UsageMeterProps, "variant">>(
  (props, ref) => <UsageMeter ref={ref} variant="circular" {...props} />,
);
UsageMeterCircular.displayName = "UsageMeterCircular";
