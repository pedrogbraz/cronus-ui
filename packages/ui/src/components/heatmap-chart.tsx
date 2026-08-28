import { cn } from "../lib/cn.js";
import { Heatmap, type HeatmapProps } from "./heatmap.js";

export interface HeatmapChartProps extends HeatmapProps {}

/** Chart-catalog alias of Heatmap. The Motion heatmap lives at `@cronus-ui/ui/charts`. */
export function HeatmapChart({ className, ...props }: HeatmapChartProps) {
  return (
    <div data-slot="heatmap-chart" className={cn("w-full", className)}>
      <Heatmap {...props} />
    </div>
  );
}
