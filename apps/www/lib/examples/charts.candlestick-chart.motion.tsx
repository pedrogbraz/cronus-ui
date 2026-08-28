"use client";

import { Candlestick, CandlestickChart, ChartTooltip, XAxis } from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";
import { OHLC_DATES } from "./charts.sample-data";

export default function CandlestickChartDemo() {
  return (
    <ChartFrame label="Candlestick chart of open, high, low, and close prices.">
      <CandlestickChart
        data={OHLC_DATES}
        margin={{ top: 16, right: 16, bottom: 40, left: 16 }}
        style={{ height: 320 }}
      >
        <Candlestick fadedOpacity={0.25} />
        <ChartTooltip />
        <XAxis />
      </CandlestickChart>
    </ChartFrame>
  );
}
