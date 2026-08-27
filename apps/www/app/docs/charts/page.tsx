import Link from "next/link";
import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocCallout,
  DocsHeader,
  DocsSection,
  DocsTextLink,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";
import { CATEGORIES } from "../../../lib/components-index";

const primitivesCode = `import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@cronus-ui/ui";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// The config maps each series key to a label and a theme token. The token is
// exposed to recharts children as a \`var(--color-<key>)\` custom property.
const chartConfig = {
  revenue: { label: "Revenue", color: "var(--cronus-primary)" },
  profit: { label: "Profit", color: "var(--cronus-info)" },
} satisfies ChartConfig;

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={chartData}>
        {/* recharts components compose inside the container and read colors via var(--color-*). */}
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}`;

const barChartCode = `const chartConfig = {
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
);`;

const donutChartCode = `const chartConfig = {
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
        <PieChart>
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
);`;

const radarChartCode = `const chartConfig = {
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
        <RadarChart data={chartData}>
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
);`;

const radialChartCode = `const chartConfig = {
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
        <RadialBarChart data={chartData} innerRadius={32} outerRadius={110}>
          <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="device" />} />
          <PolarGrid gridType="circle" radialLines={false} stroke="none" />
          <RadialBar dataKey="visitors" background cornerRadius={8} />
          <ChartLegend content={<ChartLegendContent nameKey="device" />} />
        </RadialBarChart>
      </ChartContainer>
    </div>
  </div>
);`;

const tooltipLegendCode = `// The tooltip and legend read their labels from the same ChartConfig the
// container was given — pass the provided content components and they resolve
// each series key to its config \`label\` (and color indicator) automatically.
<ChartContainer config={chartConfig} className="h-64 w-full">
  <BarChart accessibilityLayer data={chartData}>
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
  </BarChart>
</ChartContainer>`;

const codeSplitCode = `import dynamic from "next/dynamic";

// recharts is heavy and purely client-visual, so the chart render is split into
// its own client-only chunk and pulled in via next/dynamic (ssr: false). It
// never enters the first-load JS of routes that don't draw a chart.
const RevenueChart = dynamic(() => import("./revenue-chart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg border border-border bg-surface-inset/50" aria-hidden="true" />
  ),
});`;

const accessibleWrapperCode = `// recharts tags every sector with role="img" and no accessible name, so a screen
// reader would announce a pile of nameless images. Wrap the chart in a single
// role="img" with an aria-label summary, then hide the SVG subtree from a11y.
<div
  role="img"
  aria-label="Donut chart of traffic sources by visitors: Direct 4,200, Organic 3,100, Referral 1,900, Social 1,400, Email 800."
  className="h-64 w-full"
>
  <div aria-hidden="true" className="h-full w-full">
    <ChartContainer config={chartConfig} className="h-full w-full">
      {/* recharts subtree — hidden from assistive tech, summarized above. */}
    </ChartContainer>
  </div>
</div>`;

const CHART_ITEMS = CATEGORIES.find((category) => category.slug === "charts")?.items ?? [];

export default function ChartsPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Charts"
        description="Each named chart has Default and Motion previews, plus Installation, Usage, the Motion subcomponent API, data format, theming, and peer dependencies. ChartContainer stays the low-level recharts escape hatch."
      >
        <PrimaryLink href="/components?category=charts">All chart components</PrimaryLink>
        <PrimaryLink href="/components/chart">Chart primitive</PrimaryLink>
      </DocsHeader>

      <DocsSection
        title="Catalog"
        description="Each type is its own component — find them under Components → Charts. Open a page for live Default/Motion examples, then the composable Motion API (children, props, data shape, tokens)."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHART_ITEMS.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/components/${item.slug}`}
                className="block rounded-xl border border-border bg-surface-raised p-4 outline-none hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="font-medium text-fg">{item.name}</p>
                <p className="mt-1 text-sm text-fg-secondary">{item.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection
        title="The chart primitives"
        description="A chart is a recharts graph composed inside ChartContainer. You give the container a ChartConfig — a map from each series key to a label and a color, usually a var(--cronus-*) token. The container exposes those colors to its recharts children as var(--color-<key>) custom properties, so series, tooltips, and legends all recolor together when the theme changes."
      >
        <CodeBlock code={primitivesCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          recharts is a peer dependency, imported directly alongside{" "}
          <InlineCode>@cronus-ui/ui</InlineCode>. The container ships{" "}
          <InlineCode>ChartTooltip</InlineCode>, <InlineCode>ChartTooltipContent</InlineCode>,{" "}
          <InlineCode>ChartLegend</InlineCode>, and <InlineCode>ChartLegendContent</InlineCode>{" "}
          alongside it. See the{" "}
          <DocsTextLink href="/components/chart">Chart component</DocsTextLink> for the full API.
        </p>
      </DocsSection>

      <DocsSection
        title="A bar chart"
        description="Compose a recharts BarChart inside ChartContainer. The ChartConfig maps each series to a theme token, exposed to the bars as var(--color-revenue) and var(--color-profit). CartesianGrid, XAxis, and the tooltip all live inside the same container."
      >
        <CodeBlock code={barChartCode} language="tsx" expandable />
      </DocsSection>

      <DocsSection
        title="Donut, radar & radial"
        description="The same ChartContainer + ChartConfig pattern drives every recharts chart family. Swap the recharts subtree for a PieChart, RadarChart, or RadialBarChart — each slice or shape reads its fill from a var(--color-<key>) token. These three demos wrap the chart in the accessible role='img' summary described below."
      >
        <p className="mb-3 text-sm font-medium text-fg">Donut chart</p>
        <CodeBlock code={donutChartCode} language="tsx" expandable />
        <p className="mb-3 mt-8 text-sm font-medium text-fg">Radar chart</p>
        <CodeBlock code={radarChartCode} language="tsx" expandable />
        <p className="mb-3 mt-8 text-sm font-medium text-fg">Radial bar gauge</p>
        <CodeBlock code={radialChartCode} language="tsx" expandable />
      </DocsSection>

      <DocsSection
        title="Tooltip & legend"
        description="ChartTooltip and ChartLegend are recharts' Tooltip and Legend with Cronus-styled content. Pass the provided content components and they read each series' label and color indicator straight from the ChartConfig, so you never duplicate the series metadata."
      >
        <CodeBlock code={tooltipLegendCode} language="tsx" expandable />
        <DocCallout title="The config is the single source of truth">
          Both <InlineCode>ChartTooltipContent</InlineCode> and{" "}
          <InlineCode>ChartLegendContent</InlineCode> resolve a series key to its{" "}
          <InlineCode>label</InlineCode> in the config. Use <InlineCode>nameKey</InlineCode> when
          the legend or tooltip should key off a data field (like <InlineCode>source</InlineCode> or{" "}
          <InlineCode>device</InlineCode>) instead of the series <InlineCode>dataKey</InlineCode>.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="Accessibility & code-splitting"
        description="recharts tags every sector with role='img' and no accessible name, so a screen reader hears a run of nameless images. The demos wrap each chart in a single role='img' element carrying an aria-label that summarizes the data, then mark the recharts SVG subtree aria-hidden so it isn't announced."
      >
        <CodeBlock code={accessibleWrapperCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          recharts is heavy and purely client-visual, so the demos load it through{" "}
          <InlineCode>next/dynamic</InlineCode> with <InlineCode>ssr: false</InlineCode>. The chart
          stays out of the first-load JS of any route that doesn&apos;t draw one, streaming in
          behind a height-matched skeleton so there&apos;s no layout shift.
        </p>
        <CodeBlock code={codeSplitCode} language="tsx" expandable />
        <DocCallout title="Summarize the data, hide the SVG" tone="success">
          Put the numbers a sighted user reads into the wrapper&apos;s{" "}
          <InlineCode>aria-label</InlineCode> and mark the chart subtree{" "}
          <InlineCode>aria-hidden=&quot;true&quot;</InlineCode>. For interactive charts, set{" "}
          <InlineCode>rootTabIndex={"{-1}"}</InlineCode> on the recharts root (for example{" "}
          <InlineCode>&lt;Pie&gt;</InlineCode>) so the hidden subtree stays out of the tab order.
        </DocCallout>
      </DocsSection>
    </div>
  );
}
