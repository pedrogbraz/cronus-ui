"use client";

import {
  ChartTooltip,
  LiveLine,
  LiveLineChart,
  type LiveLinePoint,
  LiveXAxis,
  LiveYAxis,
} from "@cronus-ui/ui/charts";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChartFrame } from "./charts.frame";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const LIVE_TIME = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function useLiveQuote(start: number, intervalMs: number) {
  const [data, setData] = useState<LiveLinePoint[]>([]);
  const [value, setValue] = useState(start);
  const priceRef = useRef(start);
  const driftRef = useRef(0);

  useEffect(() => {
    const nowSec = Date.now() / 1000;
    const seed: LiveLinePoint[] = [];
    let price = start;
    let drift = 0;
    for (let i = 30; i > 0; i--) {
      drift = drift * 0.92 + (Math.random() - 0.48) * 0.012;
      price = Math.max(1, price * (1 + drift));
      seed.push({
        time: nowSec - i * (intervalMs / 1000),
        value: Math.round(price * 100) / 100,
      });
    }
    priceRef.current = price;
    driftRef.current = drift;
    setData(seed);
    setValue(price);
  }, [start, intervalMs]);

  useEffect(() => {
    const id = window.setInterval(() => {
      driftRef.current = driftRef.current * 0.88 + (Math.random() - 0.48) * 0.008;
      driftRef.current *= 0.995;
      priceRef.current = Math.max(1, priceRef.current * (1 + driftRef.current));
      const next = Math.round(priceRef.current * 100) / 100;
      const nowSec = Date.now() / 1000;
      setData((prev) => [
        ...prev.filter((point) => point.time >= nowSec - 60),
        { time: nowSec, value: next },
      ]);
      setValue(next);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return { data, value };
}

export default function LiveLineChartDemo() {
  const { data, value } = useLiveQuote(142.5, 600);
  const formatUsd = useCallback((v: number) => USD.format(v), []);
  const formatTime = useCallback((ms: number) => LIVE_TIME.format(new Date(ms)), []);

  return (
    <ChartFrame label="Live line chart of a streaming quote, appending a point several times a second.">
      <LiveLineChart
        data={data}
        margin={{ top: 16, right: 88, bottom: 40, left: 56 }}
        style={{ height: 260 }}
        value={value}
        window={30}
      >
        <LiveLine dataKey="value" formatValue={formatUsd} stroke="var(--chart-line-primary)" />
        <ChartTooltip
          content={({ point }) => {
            const date = point.date instanceof Date ? point.date : new Date();
            const val = typeof point.value === "number" ? point.value : 0;
            return (
              <div className="px-3 py-2.5">
                <div className="mb-1.5 text-xs text-chart-tooltip-muted">
                  {LIVE_TIME.format(date)}
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-chart-tooltip-muted">Price</span>
                  <span className="font-medium tabular-nums text-chart-tooltip-foreground">
                    {formatUsd(val)}
                  </span>
                </div>
              </div>
            );
          }}
          showDatePill={false}
        />
        <LiveXAxis formatTime={formatTime} />
        <LiveYAxis formatValue={formatUsd} position="left" />
      </LiveLineChart>
    </ChartFrame>
  );
}
