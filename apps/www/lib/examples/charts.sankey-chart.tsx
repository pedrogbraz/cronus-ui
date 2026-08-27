"use client";

import { SankeyChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { SANKEY } from "./charts.sample-data";

export default function SankeyChartDemo() {
  return (
    <ChartFrame className="h-64" label="Sankey chart of acquisition flow.">
      <SankeyChart className="h-full" data={SANKEY} />
    </ChartFrame>
  );
}
