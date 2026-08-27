"use client";

import {
  defaultPieColors,
  Legend,
  LegendItemComponent,
  LegendLabel,
  LegendMarker,
  LegendProgress,
  LegendValue,
  Ring,
  RingCenter,
  RingChart,
} from "@cronus-ui/ui/charts";
import { useState } from "react";
import { ChartFrame } from "./charts.frame";
import { RING_CHANNELS } from "./charts.sample-data";

const LEGEND = RING_CHANNELS.map((item, index) => ({
  label: item.label,
  value: item.value,
  maxValue: item.maxValue,
  color: defaultPieColors[index % defaultPieColors.length] ?? "var(--chart-1)",
}));

export default function RingChartDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
      <ChartFrame className="size-[280px] shrink-0" label="Ring chart of channel mix.">
        <RingChart
          data={RING_CHANNELS}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
          size={280}
          strokeWidth={14}
        >
          {RING_CHANNELS.map((item, index) => (
            <Ring index={index} key={item.label} />
          ))}
          <RingCenter defaultLabel="Channels" />
        </RingChart>
      </ChartFrame>
      <Legend
        className="min-w-[12rem]"
        hoveredIndex={hoveredIndex}
        items={LEGEND}
        onHoverChange={setHoveredIndex}
        title="Channels"
        titleClassName="text-sm"
      >
        <LegendItemComponent className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
          <LegendMarker />
          <LegendLabel />
          <LegendValue />
          <div className="col-span-full">
            <LegendProgress />
          </div>
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
