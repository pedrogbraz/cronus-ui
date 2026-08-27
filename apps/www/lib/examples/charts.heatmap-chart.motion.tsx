"use client";

import {
  HEATMAP_DEFAULT_LEVEL_STYLES,
  HeatmapCells,
  HeatmapChart,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
} from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";
import { HEATMAP_WEEKS } from "./charts.sample-data";

export default function HeatmapChartDemo() {
  return (
    <ChartFrame label="Heatmap chart of daily contributions.">
      <HeatmapInteractionProvider>
        <HeatmapInteractionBoundary>
          <div className="flex w-full flex-col items-stretch gap-3">
            <HeatmapChart className="w-full" data={HEATMAP_WEEKS} layout="fluid">
              <HeatmapCells inactiveOpacity={1} inactiveScale={1} />
              <HeatmapXAxis />
              <HeatmapYAxis />
              <HeatmapTooltip instant />
            </HeatmapChart>
            <HeatmapLegend
              inactiveOpacity={1}
              inactiveScale={1}
              levelStyles={HEATMAP_DEFAULT_LEVEL_STYLES}
            />
          </div>
        </HeatmapInteractionBoundary>
      </HeatmapInteractionProvider>
    </ChartFrame>
  );
}
