"use client";

import { type HTMLAttributes, useEffect, useRef, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { cn } from "../lib/cn.js";
import { ChartContainer, ChartCursor, ChartTooltip, ChartTooltipContent } from "./chart.js";

export interface LiveLinePoint {
  tick: number;
  value: number;
}

export interface LiveLineChartProps extends HTMLAttributes<HTMLDivElement> {
  data: LiveLinePoint[];
  interval?: number;
  maxPoints?: number;
}

export function LiveLineChart({
  data,
  interval = 1000,
  maxPoints = 24,
  className,
  ...props
}: LiveLineChartProps) {
  const [points, setPoints] = useState(data);
  const visible = useRef(true);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      if (!visible.current) return;
      setPoints((prev) => {
        const last = prev.at(-1);
        const next: LiveLinePoint = {
          tick: (last?.tick ?? 0) + 1,
          value: Math.max(0, (last?.value ?? 50) + (Math.random() - 0.48) * 8),
        };
        return [...prev.slice(-(maxPoints - 1)), next];
      });
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, maxPoints]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const root = document.querySelector("[data-slot='live-line-chart']");
    if (!root) return;
    const io = new IntersectionObserver((entries) => {
      visible.current = entries.some((entry) => entry.isIntersecting);
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div data-slot="live-line-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer
        config={{ value: { label: "Value", color: "var(--cronus-chart-1)" } }}
        className="h-full w-full"
      >
        <LineChart accessibilityLayer data={points} margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey="tick" tickLine={false} axisLine={false} tickMargin={12} />
          <ChartTooltip
            cursor={<ChartCursor labelKey="tick" />}
            content={<ChartTooltipContent />}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
