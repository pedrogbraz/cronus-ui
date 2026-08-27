"use client";

import type { ComponentProps, HTMLAttributes } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Scatter,
  usePlotArea,
  useXAxisScale,
  useYAxisScale,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "../lib/cn.js";
import { ChartContainer, ChartCursor, ChartTooltip, ChartTooltipContent } from "./chart.js";

export interface CandlestickPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps extends HTMLAttributes<HTMLDivElement> {
  data: CandlestickPoint[];
}

function ohlcDomain(data: readonly CandlestickPoint[]): [number, number] {
  const first = data[0];
  if (!first) return [0, 1];
  let min = first.low;
  let max = first.high;
  for (const point of data) {
    if (point.low < min) min = point.low;
    if (point.high > max) max = point.high;
  }
  const pad = Math.max(2, (max - min) * 0.08);
  return [min - pad, max + pad];
}

/** Recharts 3 calls Scatter `shape` as a function, so this cannot use hooks. */
function CandleHit({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx == null || cy == null) return null;
  return <rect x={cx - 8} y={cy - 24} width={16} height={48} fill="transparent" />;
}

function CloseTooltip(props: ComponentProps<typeof ChartTooltipContent>) {
  return (
    <ChartTooltipContent
      {...props}
      payload={props.payload?.filter((item) => String(item.dataKey) === "close")}
    />
  );
}

function CandleMarks({ data }: { data: CandlestickPoint[] }) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const plot = usePlotArea();
  if (!xScale || !yScale || data.length === 0) return null;

  const step = plot && data.length > 0 ? plot.width / data.length : 16;
  const bodyW = Math.max(4, Math.min(12, step * 0.5));

  return (
    <g data-slot="candlestick-marks">
      {data.map((point) => {
        const cx = xScale(point.date, { position: "middle" });
        const yHigh = yScale(point.high);
        const yLow = yScale(point.low);
        const yOpen = yScale(point.open);
        const yClose = yScale(point.close);
        if (
          cx == null ||
          yHigh == null ||
          yLow == null ||
          yOpen == null ||
          yClose == null ||
          !Number.isFinite(cx) ||
          !Number.isFinite(yHigh) ||
          !Number.isFinite(yLow) ||
          !Number.isFinite(yOpen) ||
          !Number.isFinite(yClose)
        ) {
          return null;
        }
        const up = point.close >= point.open;
        const color = up ? "var(--cronus-success)" : "var(--cronus-error)";
        const bodyTop = Math.min(yOpen, yClose);
        const bodyH = Math.max(2, Math.abs(yClose - yOpen));
        return (
          <g key={point.date}>
            <line x1={cx} x2={cx} y1={yHigh} y2={yLow} stroke={color} strokeWidth={1} />
            <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={color} rx={1} />
          </g>
        );
      })}
    </g>
  );
}

export function CandlestickChart({ data, className, ...props }: CandlestickChartProps) {
  return (
    <div data-slot="candlestick-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer
        config={{ close: { label: "Close", color: "var(--cronus-chart-1)" } }}
        className="h-full w-full"
      >
        <ComposedChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={12} minTickGap={24} />
          <YAxis hide domain={ohlcDomain(data)} />
          <ChartTooltip
            cursor={<ChartCursor labelKey="date" showAxisLabel={false} />}
            content={<CloseTooltip />}
          />
          <Scatter dataKey="close" shape={CandleHit} legendType="none" isAnimationActive={false} />
          <CandleMarks data={data} />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
