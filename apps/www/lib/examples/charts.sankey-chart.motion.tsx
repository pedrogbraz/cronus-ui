"use client";

import { SankeyChart, SankeyLink, SankeyNode, SankeyTooltip } from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";
import { SANKEY_FLOW } from "./charts.sample-data";

export default function SankeyChartDemo() {
  return (
    <ChartFrame label="Sankey chart of acquisition flow.">
      <SankeyChart aspectRatio="16 / 9" data={SANKEY_FLOW} nodePadding={24} nodeWidth={16}>
        <SankeyLink />
        <SankeyNode labelOrientation="vertical" lineCap={4} />
        <SankeyTooltip />
      </SankeyChart>
    </ChartFrame>
  );
}
