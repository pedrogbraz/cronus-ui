"use client";

import {
  ChartTooltip,
  Grid,
  Line,
  LineChart,
  ProfitLossLegend,
  ProfitLossLegendHoverProvider,
  ProfitLossLine,
  profitLossColor,
  resolveProfitLossTooltipLabel,
  XAxis,
} from "@cronus-ui/ui/charts";
import { curveLinear } from "@visx/curve";
import { useState } from "react";
import { ChartFrame } from "./charts.frame";
import { PNL_DATES } from "./charts.sample-data";

export default function ProfitLossChartDemo() {
  const [legendHoveredIndex, setLegendHoveredIndex] = useState<number | null>(null);

  return (
    <ChartFrame label="Profit and loss line, split at zero.">
      <div className="flex w-full flex-col gap-2">
        <ProfitLossLegend
          align="center"
          hoveredIndex={legendHoveredIndex}
          onHoverChange={setLegendHoveredIndex}
        />
        <LineChart data={PNL_DATES}>
          <Grid highlightRowValues={[0]} horizontal />
          <Line
            curve={curveLinear}
            dataKey="pnl"
            fadeEdges={false}
            showHighlight={false}
            stroke="transparent"
            strokeWidth={0}
          />
          <ProfitLossLegendHoverProvider hoveredIndex={legendHoveredIndex}>
            <ProfitLossLine dataKey="pnl" />
          </ProfitLossLegendHoverProvider>
          <XAxis />
          <ChartTooltip
            indicatorColor={(point) => profitLossColor((point.pnl as number) ?? 0)}
            rows={(point) => {
              const value = (point.pnl as number) ?? 0;
              return [
                {
                  color: profitLossColor(value),
                  label: resolveProfitLossTooltipLabel(""),
                  value,
                },
              ];
            }}
          />
        </LineChart>
      </div>
    </ChartFrame>
  );
}
