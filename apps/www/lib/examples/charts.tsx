"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { Example, ExampleMap } from "./types";

function ChartSkeleton() {
  return (
    <div
      className="h-64 w-full animate-pulse rounded-lg border border-border bg-surface-inset/50"
      aria-hidden="true"
    />
  );
}

const dyn = (loader: () => Promise<{ default: ComponentType }>) =>
  dynamic(loader, { ssr: false, loading: ChartSkeleton });

const AreaChartDemo = dyn(() => import("./charts.area-chart"));
const AreaChartMotionDemo = dyn(() => import("./charts.area-chart.motion"));
const LineChartDemo = dyn(() => import("./charts.line-chart"));
const LineChartMotionDemo = dyn(() => import("./charts.line-chart.motion"));
const LiveLineChartDemo = dyn(() => import("./charts.live-line-chart"));
const LiveLineChartMotionDemo = dyn(() => import("./charts.live-line-chart.motion"));
const BarChartDemo = dyn(() => import("./charts.bar-chart"));
const StackedBarChartDemo = dyn(() => import("./charts.stacked-bar-chart"));
const BarChartMotionDemo = dyn(() => import("./charts.bar-chart.motion"));
const StackedBarChartMotionDemo = dyn(() => import("./charts.stacked-bar-chart.motion"));
const ComposedChartDemo = dyn(() => import("./charts.composed-chart"));
const ComposedChartMotionDemo = dyn(() => import("./charts.composed-chart.motion"));
const CandlestickChartDemo = dyn(() => import("./charts.candlestick-chart"));
const CandlestickChartMotionDemo = dyn(() => import("./charts.candlestick-chart.motion"));
const FunnelChartDemo = dyn(() => import("./charts.funnel-chart"));
const FunnelChartMotionDemo = dyn(() => import("./charts.funnel-chart.motion"));
const GaugeChartDemo = dyn(() => import("./charts.gauge-chart"));
const GaugeChartMotionDemo = dyn(() => import("./charts.gauge-chart.motion"));
const CatalogPieDemo = dyn(() => import("./charts.catalog-pie"));
const PieChartMotionDemo = dyn(() => import("./charts.pie-chart.motion"));
const RingChartDemo = dyn(() => import("./charts.ring-chart"));
const RingChartMotionDemo = dyn(() => import("./charts.ring-chart.motion"));
const RadarChartDemo = dyn(() => import("./charts.radar-chart"));
const RadarChartMotionDemo = dyn(() => import("./charts.radar-chart.motion"));
const RadialChartDemo = dyn(() => import("./charts.radial-chart"));
const ScatterChartDemo = dyn(() => import("./charts.scatter-chart"));
const ScatterChartMotionDemo = dyn(() => import("./charts.scatter-chart.motion"));
const SankeyChartDemo = dyn(() => import("./charts.sankey-chart"));
const SankeyChartMotionDemo = dyn(() => import("./charts.sankey-chart.motion"));
const ProfitLossChartDemo = dyn(() => import("./charts.profit-loss-chart"));
const ProfitLossChartMotionDemo = dyn(() => import("./charts.profit-loss-chart.motion"));
const ChoroplethChartDemo = dyn(() => import("./charts.choropleth-chart"));
const ChoroplethChartMotionDemo = dyn(() => import("./charts.choropleth-chart.motion"));
const SunburstChartDemo = dyn(() => import("./charts.sunburst-chart"));
const SunburstChartMotionDemo = dyn(() => import("./charts.sunburst-chart.motion"));
const HeatmapChartDemo = dyn(() => import("./charts.heatmap-chart"));
const HeatmapChartMotionDemo = dyn(() => import("./charts.heatmap-chart.motion"));
const PiePrimitiveDemo = dyn(() => import("./charts.pie-chart"));

function pair(
  defaultTitle: string,
  defaultDescription: string,
  defaultCode: string,
  defaultPreview: Example["preview"],
  motionDescription: string,
  motionCode: string,
  motionPreview: Example["preview"],
): Example[] {
  return [
    {
      id: "default",
      title: defaultTitle,
      description: defaultDescription,
      code: defaultCode,
      preview: defaultPreview,
    },
    {
      id: "motion",
      title: "Motion",
      description: motionDescription,
      code: motionCode,
      preview: motionPreview,
    },
  ];
}

export const chartsExamples: ExampleMap = {
  chart: [
    {
      id: "container",
      title: "ChartContainer",
      description:
        "Low-level recharts primitive. Named charts ship a Default example and a Motion example (clip-reveal, crosshair, date pill).",
      code: `import {
  ChartContainer,
  ChartCursor,
  ChartTooltip,
  ChartTooltipContent,
} from "@cronus-ui/ui";`,
      preview: <PiePrimitiveDemo />,
    },
    {
      id: "radial-chart",
      title: "Radial bar (primitive)",
      description:
        "Compose RadialBarChart yourself inside ChartContainer when a named chart is too opinionated.",
      code: `<RadialBarChart data={chartData} innerRadius={32} outerRadius={110}>
  <RadialBar dataKey="visitors" background cornerRadius={8} />
</RadialBarChart>`,
      preview: <RadialChartDemo />,
    },
  ],
  "area-chart": pair(
    "Default",
    "Cronus ready-made AreaChart — series prop, recharts, token fills.",
    `<AreaChart
  data={TIMESERIES}
  series={[
    { key: "revenue", label: "Revenue" },
    { key: "costs", label: "Costs" },
  ]}
/>`,
    <AreaChartDemo />,
    "Clip-reveal, crosshair, date pill, cursor on hover. Import from @cronus-ui/ui/charts.",
    `import { AreaChart, Area, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<AreaChart data={data} animationDuration={1100}>
  <Grid horizontal />
  <Area dataKey="revenue" fadeEdges fill="var(--chart-line-primary)" fillOpacity={0.3} />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
    <AreaChartMotionDemo />,
  ),
  "line-chart": pair(
    "Default",
    "Cronus ready-made LineChart — same series API as AreaChart, without the fill.",
    `<LineChart data={TIMESERIES} series={[{ key: "revenue", label: "Revenue" }, { key: "costs", label: "Costs" }]} />`,
    <LineChartDemo />,
    "Hover cursor, crosshair, animated tooltip. Import from @cronus-ui/ui/charts.",
    `import { LineChart, Line, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
    <LineChartMotionDemo />,
  ),
  "live-line-chart": pair(
    "Default",
    "Cronus streaming line. Pauses off-screen and under prefers-reduced-motion.",
    `<LiveLineChart data={LIVE_SEED} />`,
    <LiveLineChartDemo />,
    "Streaming quote with a live tip, dollar axes, and a sliding 30-second window.",
    `import { LiveLineChart, LiveLine, LiveXAxis, LiveYAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<LiveLineChart data={points} value={latest} window={30}>
  <LiveLine dataKey="value" formatValue={(v) => usd.format(v)} />
  <LiveXAxis />
  <LiveYAxis formatValue={(v) => usd.format(v)} position="left" />
  <ChartTooltip showDatePill={false} />
</LiveLineChart>`,
    <LiveLineChartMotionDemo />,
  ),
  "bar-chart": [
    {
      id: "default",
      title: "Default",
      description: "Cronus grouped columns. Pass stacked for a stacked series.",
      code: `<BarChart data={MONTHS} series={[{ key: "revenue", label: "Revenue" }, { key: "profit", label: "Profit" }]} />`,
      preview: <BarChartDemo />,
    },
    {
      id: "stacked",
      title: "Stacked",
      description: "Desktop and mobile on one column.",
      code: `<BarChart data={MONTHS} stacked series={[{ key: "desktop", label: "Desktop" }, { key: "mobile", label: "Mobile" }]} />`,
      preview: <StackedBarChartDemo />,
    },
    {
      id: "motion",
      title: "Motion",
      description: "Grouped revenue and profit — hover dims the rest.",
      code: `import { BarChart, Bar, BarXAxis, Grid, ChartTooltip } from "@cronus-ui/ui/charts";

<BarChart data={data} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="revenue" fill="var(--chart-line-primary)" lineCap="round" />
  <Bar dataKey="profit" fill="var(--chart-line-secondary)" lineCap="round" />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      preview: <BarChartMotionDemo />,
    },
    {
      id: "motion-stacked",
      title: "Motion stacked",
      description: "Stacked desktop and mobile with a gap between segments.",
      code: `<BarChart data={data} stacked stackGap={3} xDataKey="month">
  <Bar dataKey="desktop" fill="var(--chart-line-primary)" lineCap={4} stackGap={3} />
  <Bar dataKey="mobile" fill="var(--chart-line-secondary)" lineCap={4} stackGap={3} />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      preview: <StackedBarChartMotionDemo />,
    },
  ],
  "composed-chart": pair(
    "Default",
    "Cronus mix of area, bar, and line on one time axis.",
    `<ComposedChart data={TIMESERIES} series={[
  { key: "costs", label: "Run rate", type: "area" },
  { key: "units", label: "Units", type: "bar" },
  { key: "revenue", label: "Revenue", type: "line" },
]} />`,
    <ComposedChartDemo />,
    "Daily units as bars, run-rate as area, revenue as a smooth line — clip-reveal and a date pill.",
    `import { ComposedChart, SeriesBar, Area, Line, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";
import { curveCatmullRom } from "@visx/curve";

const smooth = curveCatmullRom.alpha(0.42);

<ComposedChart data={data} aspectRatio="2 / 1" barGap={0} maxBarSize={32}>
  <Grid horizontal />
  <Area curve={smooth} dataKey="runRate" fill="var(--chart-4)" fillOpacity={0.32} />
  <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <Line curve={smooth} dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} />
  <ChartTooltip />
  <XAxis numTicks={8} />
</ComposedChart>`,
    <ComposedChartMotionDemo />,
  ),
  "candlestick-chart": pair(
    "Default",
    "Cronus OHLC candles. Success for up days, error for down.",
    `<CandlestickChart data={CANDLES} />`,
    <CandlestickChartDemo />,
    "OHLC candles with crosshair and date pill.",
    `import { CandlestickChart, Candlestick, Grid, XAxis, YAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<CandlestickChart data={data}>
  <Grid horizontal vertical />
  <Candlestick />
  <XAxis />
  <YAxis />
  <ChartTooltip />
</CandlestickChart>`,
    <CandlestickChartMotionDemo />,
  ),
  "funnel-chart": pair(
    "Default",
    "Cronus stage drop-off from visit to retain.",
    `<FunnelChart data={[{ stage: "Visit", value: 8400, key: "visit" }]} />`,
    <FunnelChartDemo />,
    "Stage funnel with hover labels.",
    `import { FunnelChart } from "@cronus-ui/ui/charts";

<FunnelChart data={[{ label: "Visitors", value: 12000 }]} />`,
    <FunnelChartMotionDemo />,
  ),
  "gauge-chart": pair(
    "Default",
    "Cronus radial score with the value in the hub.",
    `<GaugeChart value={72} label="Health" />`,
    <GaugeChartDemo />,
    "Notched arc with the score in the hub.",
    `import { Gauge } from "@cronus-ui/ui/charts";

<Gauge value={72} centerValue={72} totalNotches={40} defaultLabel="Score" />`,
    <GaugeChartMotionDemo />,
  ),
  "pie-chart": pair(
    "Default",
    "Cronus full pie with token slices.",
    `<PieChart data={rows} series={series} />`,
    <CatalogPieDemo />,
    "Composable slices with a side legend — hover a slice or a row to highlight both.",
    `import { PieChart, PieSlice, Legend, LegendItemComponent, LegendMarker, LegendLabel, LegendValue } from "@cronus-ui/ui/charts";

<div className="flex items-center gap-12">
  <PieChart data={rows} size={280} hoveredIndex={hovered} onHoverChange={setHovered}>
    {rows.map((item, i) => <PieSlice index={i} key={item.label} />)}
  </PieChart>
  <Legend items={legend} hoveredIndex={hovered} onHoverChange={setHovered} title="Traffic">
    <LegendItemComponent className="flex items-center gap-3">
      <LegendMarker />
      <LegendLabel className="flex-1" />
      <LegendValue />
    </LegendItemComponent>
  </Legend>
</div>`,
    <PieChartMotionDemo />,
  ),
  "ring-chart": pair(
    "Default",
    "Cronus donut with a hub total.",
    `<RingChart data={rows} series={series} centerLabel="Visitors" />`,
    <RingChartDemo />,
    "Composable ring segments with a hub total.",
    `import { RingChart, Ring, RingCenter } from "@cronus-ui/ui/charts";

<RingChart data={rows} size={280} strokeWidth={14}>
  {rows.map((item, i) => <Ring index={i} key={item.label} />)}
  <RingCenter defaultLabel="Channels" />
</RingChart>`,
    <RingChartMotionDemo />,
  ),
  "radar-chart": pair(
    "Default",
    "Cronus polar comparison across metrics.",
    `<RadarChart data={rows} series={[{ key: "current", label: "Current" }, { key: "target", label: "Target" }]} />`,
    <RadarChartDemo />,
    "Layered radar with grid, axis, and area.",
    `import { RadarChart, RadarGrid, RadarAxis, RadarLabels, RadarArea } from "@cronus-ui/ui/charts";

<RadarChart data={rows} metrics={metrics} size={320}>
  <RadarGrid />
  <RadarAxis />
  <RadarLabels />
  <RadarArea index={0} />
</RadarChart>`,
    <RadarChartMotionDemo />,
  ),
  "scatter-chart": pair(
    "Default",
    "Cronus reach versus conversion for two channels.",
    `<ScatterChart series={[{ key: "Search", label: "Search", data: search }]} />`,
    <ScatterChartDemo />,
    "Offset rings, hover dim, clip-reveal enter. Two series from the chart ramp.",
    `import { ScatterChart, Scatter, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<ScatterChart data={data}>
  <Grid horizontal />
  <Scatter dataKey="sessions" />
  <Scatter dataKey="conversions" />
  <XAxis />
  <ChartTooltip />
</ScatterChart>`,
    <ScatterChartMotionDemo />,
  ),
  "sankey-chart": pair(
    "Default",
    "Cronus flow between nodes.",
    `<SankeyChart data={SANKEY} />`,
    <SankeyChartDemo />,
    "Flow chart with hoverable links and nodes.",
    `import { SankeyChart, SankeyLink, SankeyNode, SankeyTooltip } from "@cronus-ui/ui/charts";

<SankeyChart data={data}>
  <SankeyLink />
  <SankeyNode />
  <SankeyTooltip />
</SankeyChart>`,
    <SankeyChartMotionDemo />,
  ),
  "profit-loss-chart": pair(
    "Default",
    "Cronus series split at zero.",
    `<ProfitLossChart data={PL_LINE} />`,
    <ProfitLossChartDemo />,
    "Sign-colored segments split at zero.",
    `import { LineChart, Grid, ProfitLossLine, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<LineChart data={data}>
  <Grid highlightRowValues={[0]} horizontal />
  <ProfitLossLine dataKey="pnl" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
    <ProfitLossChartMotionDemo />,
  ),
  "choropleth-chart": pair(
    "Default",
    "Cronus region intensity grid. Pass your own regions; a demo grid ships for docs.",
    `<ChoroplethChart data={CHOROPLETH_DEMO} />`,
    <ChoroplethChartDemo />,
    "World map with zoom and a country tooltip.",
    `import { ChoroplethChart, ChoroplethFeatureComponent, ChoroplethTooltip } from "@cronus-ui/ui/charts";

<ChoroplethChart data={world} aspectRatio="16 / 9" zoomEnabled>
  <ChoroplethFeatureComponent fill="var(--chart-scale-03)" stroke="var(--chart-background)" />
  <ChoroplethTooltip />
</ChoroplethChart>`,
    <ChoroplethChartMotionDemo />,
  ),
  "sunburst-chart": pair(
    "Default",
    "Cronus two-level hierarchical rings.",
    `<SunburstChart data={[{ name: "Product", value: 48, children: [{ name: "App", value: 28 }] }]} />`,
    <SunburstChartDemo />,
    "Hierarchical rings with hover grow and labels.",
    `import { SunburstChart, SunburstSegment, SunburstCenter, SunburstLabels, buildArcs } from "@cronus-ui/ui/charts";

<SunburstChart data={tree} size={360}>
  {arcs.map((arc) => <SunburstSegment index={arc.arcIndex} key={arc.id} />)}
  <SunburstCenter />
  <SunburstLabels />
</SunburstChart>`,
    <SunburstChartMotionDemo />,
  ),
  "heatmap-chart": pair(
    "Default",
    "Cronus calendar heatmap (same primitive as Heatmap).",
    `<HeatmapChart data={DAYS} />`,
    <HeatmapChartDemo />,
    "Calendar heatmap with legend and tooltip.",
    `import { HeatmapChart, HeatmapCells, HeatmapXAxis, HeatmapYAxis, HeatmapTooltip } from "@cronus-ui/ui/charts";

<HeatmapChart data={weeks} layout="fluid">
  <HeatmapCells />
  <HeatmapXAxis />
  <HeatmapYAxis />
  <HeatmapTooltip />
</HeatmapChart>`,
    <HeatmapChartMotionDemo />,
  ),
};

export default function ChartsExamples({ slug }: { slug: string }) {
  return <ExampleList examples={chartsExamples[slug] ?? []} />;
}
