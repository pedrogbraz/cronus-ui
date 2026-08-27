"use client";

import {
  Area,
  ChartTooltip,
  ComposedChart,
  Grid,
  Line,
  SeriesBar,
  XAxis,
} from "@cronus-ui/ui/charts";
import { curveCatmullRom } from "@visx/curve";
import { ChartFrame } from "./charts.frame";
import { COMPOSED_DATES } from "./charts.sample-data";

const SMOOTH = curveCatmullRom.alpha(0.42);

export default function ComposedChartDemo() {
  return (
    <ChartFrame label="Composed chart of daily units, run rate, and revenue for January.">
      <ComposedChart
        aspectRatio="2 / 1"
        barGap={0}
        data={COMPOSED_DATES}
        maxBarSize={32}
        xDataKey="date"
      >
        <Grid horizontal />
        <Area curve={SMOOTH} dataKey="runRate" fill="var(--chart-4)" fillOpacity={0.32} />
        <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
        <Line curve={SMOOTH} dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} />
        <ChartTooltip
          rows={(point) => [
            { color: "var(--chart-4)", label: "Run rate", value: Number(point.runRate ?? 0) },
            { color: "var(--chart-3)", label: "Units", value: Number(point.units ?? 0) },
            { color: "var(--chart-1)", label: "Revenue", value: Number(point.revenue ?? 0) },
          ]}
        />
        <XAxis numTicks={8} />
      </ComposedChart>
    </ChartFrame>
  );
}
