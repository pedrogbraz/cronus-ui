"use client";

import { CHOROPLETH_DEMO, ChoroplethChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";

export default function ChoroplethChartDemo() {
  return (
    <ChartFrame className="h-64" label="Choropleth chart of regional intensity.">
      <ChoroplethChart className="h-full" data={CHOROPLETH_DEMO} />
    </ChartFrame>
  );
}
