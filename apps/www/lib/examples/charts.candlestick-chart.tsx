"use client";

import { CandlestickChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { CANDLES } from "./charts.sample-data";

export default function CandlestickChartDemo() {
  return (
    <ChartFrame className="h-64" label="Candlestick chart of open, high, low, and close prices.">
      <CandlestickChart className="h-full" data={CANDLES} />
    </ChartFrame>
  );
}
