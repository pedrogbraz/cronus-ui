import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface ChoroplethRegion {
  id: string;
  name: string;
  value: number;
}

export const CHOROPLETH_DEMO: ChoroplethRegion[] = [
  { id: "nw", name: "Northwest", value: 42 },
  { id: "ne", name: "Northeast", value: 78 },
  { id: "w", name: "West", value: 31 },
  { id: "c", name: "Central", value: 95 },
  { id: "e", name: "East", value: 58 },
  { id: "sw", name: "Southwest", value: 22 },
  { id: "se", name: "Southeast", value: 67 },
];

export interface ChoroplethChartProps extends HTMLAttributes<HTMLDivElement> {
  data?: ChoroplethRegion[];
}

const CELLS: Record<string, string> = {
  nw: "M10 10 h 80 v 50 h -80 z",
  ne: "M100 10 h 80 v 50 h -80 z",
  w: "M10 70 h 50 v 50 h -50 z",
  c: "M70 70 h 50 v 50 h -50 z",
  e: "M130 70 h 50 v 50 h -50 z",
  sw: "M10 130 h 80 v 50 h -80 z",
  se: "M100 130 h 80 v 50 h -80 z",
};

export function ChoroplethChart({
  data = CHOROPLETH_DEMO,
  className,
  ...props
}: ChoroplethChartProps) {
  const max = data.reduce((acc, item) => Math.max(acc, item.value), 1);
  return (
    <div data-slot="choropleth-chart" className={cn("h-64 w-full", className)} {...props}>
      <svg viewBox="0 0 200 190" className="h-full w-full" aria-hidden="true">
        {data.map((region) => {
          const d = CELLS[region.id];
          if (!d) return null;
          const opacity = 0.15 + (region.value / max) * 0.85;
          return (
            <path
              key={region.id}
              d={d}
              className="fill-primary stroke-border"
              style={{ fillOpacity: opacity }}
            >
              <title>{`${region.name}: ${region.value}`}</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}
