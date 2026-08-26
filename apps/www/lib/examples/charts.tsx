"use client";

import dynamic from "next/dynamic";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

/* -------------------------------------------------------------------------- */
/*  Chart demo (lazy)                                                         */
/* -------------------------------------------------------------------------- */

/**
 * recharts is heavy and purely client-visual, so the live BarChart is split into
 * its own client-only chunk and pulled in via `next/dynamic` (`ssr: false`).
 * recharts therefore never enters the first-load JS of routes that don't render
 * a chart, and even on a chart slug it streams in after hydration behind a
 * height-matched skeleton (no layout shift, same visual once mounted).
 */
function ChartSkeleton() {
  return (
    <div
      className="h-64 w-full animate-pulse rounded-lg border border-border bg-surface-inset/50"
      aria-hidden="true"
    />
  );
}

const BarChartDemo = dynamic(() => import("./charts.bar-chart"), {
  ssr: false,
  loading: ChartSkeleton,
});

const PieChartDemo = dynamic(() => import("./charts.pie-chart"), {
  ssr: false,
  loading: ChartSkeleton,
});

const RadarChartDemo = dynamic(() => import("./charts.radar-chart"), {
  ssr: false,
  loading: ChartSkeleton,
});

const RadialChartDemo = dynamic(() => import("./charts.radial-chart"), {
  ssr: false,
  loading: ChartSkeleton,
});

/* -------------------------------------------------------------------------- */
/*  Examples                                                                  */
/* -------------------------------------------------------------------------- */

export const chartsExamples: ExampleMap = {
  chart: [
    {
      id: "bar-chart",
      title: "Bar chart",
      description:
        "A recharts BarChart composed inside ChartContainer. The ChartConfig maps each series to a theme token, exposed to bars as `var(--color-*)`.",
      code: `const chartConfig = {
  revenue: { label: "Revenue", color: "var(--cronus-primary)" },
  profit: { label: "Profit", color: "var(--cronus-info)" },
} satisfies ChartConfig;

const chartData = [
  { month: "Jan", revenue: 4200, profit: 1400 },
  { month: "Feb", revenue: 3800, profit: 1100 },
  { month: "Mar", revenue: 5200, profit: 1900 },
  { month: "Apr", revenue: 4900, profit: 1700 },
  { month: "May", revenue: 6100, profit: 2400 },
  { month: "Jun", revenue: 7300, profit: 3100 },
];

return (
  <ChartContainer config={chartConfig} className="h-64 w-full">
    <BarChart accessibilityLayer data={chartData}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip
        cursor={{ fill: "var(--cronus-fg)", fillOpacity: 0.05, radius: 8 }}
        content={<ChartTooltipContent />}
      />
      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
      <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
    </BarChart>
  </ChartContainer>
);`,
      preview: <BarChartDemo />,
    },
    {
      id: "pie-chart",
      title: "Donut chart",
      description:
        "A traffic-sources donut. Each slice maps to a theme token via the ChartConfig and renders through `Cell`, with a legend and tooltip wired to the same config.",
      code: `const chartConfig = {
  visitors: { label: "Visitors" },
  direct: { label: "Direct", color: "var(--cronus-chart-1)" },
  organic: { label: "Organic", color: "var(--cronus-chart-2)" },
  referral: { label: "Referral", color: "var(--cronus-chart-3)" },
  social: { label: "Social", color: "var(--cronus-chart-4)" },
  email: { label: "Email", color: "var(--cronus-chart-5)" },
} satisfies ChartConfig;

const chartData = [
  { source: "direct", visitors: 4200, fill: "var(--color-direct)" },
  { source: "organic", visitors: 3100, fill: "var(--color-organic)" },
  { source: "referral", visitors: 1900, fill: "var(--color-referral)" },
  { source: "social", visitors: 1400, fill: "var(--color-social)" },
  { source: "email", visitors: 800, fill: "var(--color-email)" },
];

return (
  // Data is exposed to assistive tech via the label; the SVG internals (recharts
  // tags each sector role="img" with no name) are hidden so they're not announced.
  <div
    role="img"
    aria-label="Donut chart of traffic sources by visitors: Direct 4,200, Organic 3,100, Referral 1,900, Social 1,400, Email 800."
    className="h-64 w-full"
  >
    <div aria-hidden="true" className="h-full w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <PieChart accessibilityLayer={false}>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="source"
            innerRadius={64}
            outerRadius={98}
            paddingAngle={3}
            cornerRadius={6}
            strokeWidth={0}
            rootTabIndex={-1}
          >
            {chartData.map((entry) => (
              <Cell key={entry.source} fill={entry.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                const { cx, cy } = viewBox;
                return (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={cx} y={cy} className="fill-fg font-semibold text-2xl">
                      11.4K
                    </tspan>
                    <tspan x={cx} y={(cy ?? 0) + 22} className="fill-fg-tertiary text-xs">
                      Visitors
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="source" />} />
        </PieChart>
      </ChartContainer>
    </div>
  </div>
);`,
      preview: <PieChartDemo />,
    },
    {
      id: "radar-chart",
      title: "Radar chart",
      description:
        "A two-series radar comparing Current vs Target across six metrics. Each Radar reads its fill and stroke from the config token, so themes recolor both shapes at once.",
      code: `const chartConfig = {
  current: { label: "Current", color: "var(--cronus-primary)" },
  target: { label: "Target", color: "var(--cronus-info)" },
} satisfies ChartConfig;

const chartData = [
  { metric: "Speed", current: 86, target: 95 },
  { metric: "Reliability", current: 72, target: 90 },
  { metric: "Coverage", current: 91, target: 88 },
  { metric: "Security", current: 78, target: 96 },
  { metric: "Usability", current: 84, target: 80 },
  { metric: "Support", current: 69, target: 85 },
];

return (
  <div
    role="img"
    aria-label="Radar chart comparing Current vs Target across six metrics — Speed 86/95, Reliability 72/90, Coverage 91/88, Security 78/96, Usability 84/80, Support 69/85."
    className="h-64 w-full"
  >
    <div aria-hidden="true" className="h-full w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <RadarChart accessibilityLayer={false} data={chartData}>
          <ChartTooltip content={<ChartTooltipContent />} />
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <Radar dataKey="current" fill="var(--color-current)" fillOpacity={0.6} stroke="var(--color-current)" />
          <Radar dataKey="target" fill="var(--color-target)" fillOpacity={0.15} stroke="var(--color-target)" />
          <ChartLegend content={<ChartLegendContent />} />
        </RadarChart>
      </ChartContainer>
    </div>
  </div>
);`,
      preview: <RadarChartDemo />,
    },
    {
      id: "radial-chart",
      title: "Radial bar gauge",
      description:
        "Visitors-by-device drawn as concentric radial bars with rounded ring caps. The tracked `background` ring and `cornerRadius` give each device a clean gauge read.",
      code: `const chartConfig = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop", color: "var(--cronus-chart-1)" },
  mobile: { label: "Mobile", color: "var(--cronus-chart-2)" },
  tablet: { label: "Tablet", color: "var(--cronus-chart-3)" },
  other: { label: "Other", color: "var(--cronus-chart-4)" },
} satisfies ChartConfig;

const chartData = [
  { device: "desktop", visitors: 5200, fill: "var(--color-desktop)" },
  { device: "mobile", visitors: 4100, fill: "var(--color-mobile)" },
  { device: "tablet", visitors: 1800, fill: "var(--color-tablet)" },
  { device: "other", visitors: 900, fill: "var(--color-other)" },
];

return (
  <div
    role="img"
    aria-label="Radial bar chart of visitors by device: Desktop 5,200, Mobile 4,100, Tablet 1,800, Other 900."
    className="h-64 w-full"
  >
    <div aria-hidden="true" className="h-full w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <RadialBarChart accessibilityLayer={false} data={chartData} innerRadius={32} outerRadius={110}>
          <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="device" />} />
          <PolarGrid gridType="circle" radialLines={false} stroke="none" />
          <RadialBar dataKey="visitors" background cornerRadius={8} />
          <ChartLegend content={<ChartLegendContent nameKey="device" />} />
        </RadialBarChart>
      </ChartContainer>
    </div>
  </div>
);`,
      preview: <RadialChartDemo />,
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function ChartsExamples({ slug }: { slug: string }) {
  return <ExampleList examples={chartsExamples[slug] ?? []} />;
}
