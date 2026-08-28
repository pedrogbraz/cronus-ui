"use client";

import { HeatmapChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { HEATMAP_DAYS } from "./charts.sample-data";

export default function HeatmapChartDemo() {
  return (
    <ChartFrame className="h-64" label="Calendar heatmap of daily activity.">
      <HeatmapChart data={HEATMAP_DAYS} />
    </ChartFrame>
  );
}
