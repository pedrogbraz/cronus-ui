"use client";

import { cn } from "../../lib/cn.js";
import { useLegendItem } from "./legend-context.js";

export interface LegendProgressProps {
  /** Track class name */
  trackClassName?: string;
  /** Indicator class name */
  indicatorClassName?: string;
  /** Track height. Default: "h-1.5" */
  height?: string;
}

export function LegendProgress({
  trackClassName = "",
  indicatorClassName = "",
  height = "h-1.5",
}: LegendProgressProps) {
  const { item } = useLegendItem();

  if (!item.maxValue) {
    return null;
  }

  // Note: item.color must remain inline style as it's dynamic data
  const pct = Math.min(100, Math.max(0, (item.value / item.maxValue) * 100));
  return (
    <div
      aria-valuemax={item.maxValue}
      aria-valuenow={item.value}
      className={cn("w-full overflow-hidden rounded-full bg-legend-track", height, trackClassName)}
      role="progressbar"
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", indicatorClassName)}
        style={{ backgroundColor: item.color, width: `${pct}%` }}
      />
    </div>
  );
}

LegendProgress.displayName = "LegendProgress";
