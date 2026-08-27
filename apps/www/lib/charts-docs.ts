/**
 * Extra documentation for named charts: Installation, Usage, Motion
 * subcomponents, data format, theming, and peer dependencies.
 *
 * Default wrappers stay on the generated Props table (`lib/props.generated.ts`).
 * This catalog documents the composable Motion API at `@cronus-ui/ui/charts`.
 */

export interface ChartPropRow {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description?: string;
}

export interface ChartComponentDoc {
  name: string;
  description: string;
  props: ChartPropRow[];
}

export interface ChartExtraSection {
  id: string;
  title: string;
  description: string;
  code?: string;
}

export interface ChartPageDoc {
  slug: string;
  motionImports: string[];
  defaultUsage: string;
  motionUsage: string;
  usageNote?: string;
  components: ChartComponentDoc[];
  extraSections?: ChartExtraSection[];
  dataFormat: string;
  dataFormatNote?: string;
  theming: string;
  dependencies: string[];
}

function p(
  name: string,
  type: string,
  description: string,
  opts?: { required?: boolean; default?: string },
): ChartPropRow {
  return {
    name,
    type,
    description,
    required: opts?.required,
    default: opts?.default,
  };
}

const MARGIN = "`Partial<{ top, right, bottom, left }>`";

const SERIES_THEMING =
  "Motion charts read `--chart-*` aliases that map onto Cronus semantic tokens (`--cronus-chart-1`…`--cronus-chart-5`, `--cronus-border`, `--cronus-fg`, surfaces). Override the aliases or the tokens — never palette scales (`bg-zinc-900`). Default wrappers use `ChartConfig` with `var(--cronus-chart-*)` / `var(--cronus-primary)`.";

const SCALE_THEMING = `${SERIES_THEMING} Sequential bins use \`--chart-scale-01\`…\`--chart-scale-05\` (01 = lowest). Empty regions typically use \`var(--muted)\` or a mix of \`--cronus-surface-base\`.`;

const GRID: ChartComponentDoc = {
  name: "Grid",
  description: "Plot-area grid lines. Horizontal by default; optional shimmer while loading.",
  props: [
    p("horizontal", "boolean", "Show horizontal lines.", { default: "true" }),
    p("vertical", "boolean", "Show vertical lines.", { default: "false" }),
    p("numTicksRows", "number", "Horizontal line count.", { default: "5" }),
    p("numTicksColumns", "number", "Vertical line count.", { default: "10" }),
    p("stroke", "string", "Line color while ready.", { default: "var(--chart-grid)" }),
    p("strokeDasharray", "string", "Dash pattern.", { default: '"4,4"' }),
    p("shimmer", "boolean", "Animate a band across horizontal lines.", { default: "false" }),
    p("highlightRowValues", "number[]", "Rows drawn with alternate styling (e.g. zero)."),
  ],
};

const X_AXIS: ChartComponentDoc = {
  name: "XAxis",
  description: "Time-axis labels that fade when the crosshair passes.",
  props: [
    p("numTicks", "number", "Tick labels to show, including first and last.", { default: "5" }),
    p("tickerHalfWidth", "number", "Fade radius around the date pill.", { default: "50" }),
    p(
      "tickMode",
      '"data" | "domain"',
      "`data` snaps labels to rows (crosshair-aligned). `domain` spaces ticks evenly.",
      { default: '"data"' },
    ),
  ],
};

const Y_AXIS: ChartComponentDoc = {
  name: "YAxis",
  description: "Value labels on the left or right. Pair `yAxisId` with series for dual axes.",
  props: [
    p("yAxisId", "string | number", "Scale group id.", { default: '"left"' }),
    p("orientation", '"left" | "right"', "Which side to render.", { default: '"left"' }),
    p("numTicks", "number", "Approximate tick count.", { default: "5" }),
    p("formatLargeNumbers", "boolean", 'Format 1000 as "1k".', { default: "true" }),
    p(
      "formatValue",
      "(value: number) => string",
      "Custom tick formatter. Overrides formatLargeNumbers.",
    ),
  ],
};

const CHART_TOOLTIP: ChartComponentDoc = {
  name: "ChartTooltip",
  description:
    "Motion tooltip: crosshair, series dots, floating panel, optional date pill. This is not the recharts ChartTooltip from `@cronus-ui/ui`.",
  props: [
    p("showDatePill", "boolean", "Animated date ticker on the x-axis.", { default: "true" }),
    p("showCrosshair", "boolean", "Vertical crosshair.", { default: "true" }),
    p("showDots", "boolean", "Dots on series at the hovered x.", { default: "true" }),
    p("dotVariant", '"dot" | "ring"', "Filled circle or ring.", { default: '"dot"' }),
    p("indicatorColor", "string | (point) => string", "Crosshair and dot color."),
    p("indicatorDasharray", "string", "Dash pattern for the crosshair."),
    p("indicatorFadeEdges", '"both" | "top" | "bottom" | "none"', "Vertical crosshair fade.", {
      default: '"both"',
    }),
    p("matchCrosshair", "boolean", "Panel uses the crosshair spring when true.", {
      default: "false",
    }),
    p("damping", "number", "Panel follow when matchCrosshair is false. 0 = instant.", {
      default: "20",
    }),
    p("content", "(props) => ReactNode", "Custom tooltip renderer."),
    p("rows", "(point) => TooltipRow[]", "Custom row generator."),
  ],
};

const BACKGROUND: ChartComponentDoc = {
  name: "Background",
  description: "Pattern fill for the plot area when you omit Grid, or as a texture behind series.",
  props: [
    p("pattern", 'PatternPresetId | "none"', "Pattern preset. `none` renders nothing."),
    p("color", "string", "Pattern stroke color.", { default: "var(--chart-grid)" }),
    p("opacity", "number", "Pattern fill opacity.", { default: "1" }),
    p("fadeHorizontal", "boolean", "Fade at left/right edges.", { default: "true" }),
  ],
};

const LEGEND: ChartComponentDoc = {
  name: "Legend",
  description:
    "Composable side legend. Map `LegendItem` (marker, label, value, optional progress) over `items`. Share `hoveredIndex` with the chart for bidirectional highlight.",
  props: [
    p("items", "LegendItemData[]", "Label, value, color, optional maxValue.", { required: true }),
    p("hoveredIndex", "number | null", "Controlled hover."),
    p("onHoverChange", "(index: number | null) => void", "Hover callback."),
    p("title", "string", "Heading above the list."),
    p("children", "ReactElement", "A single LegendItem template, cloned per item.", {
      required: true,
    }),
  ],
};

function timeSeriesRoot(name: string, extra: ChartPropRow[] = []): ChartComponentDoc {
  return {
    name,
    description: "Root that sizes the SVG, provides scales, and hosts series children.",
    props: [
      p("data", "Record<string, unknown>[]", "Rows with a date (or x) field and numeric series.", {
        required: true,
      }),
      p("xDataKey", "string", "Key for the x-axis.", { default: '"date"' }),
      p("margin", MARGIN, "Plot margins.", {
        default: "{ top: 40, right: 40, bottom: 40, left: 40 }",
      }),
      p("animationDuration", "number", "Clip-reveal duration in ms.", { default: "1100" }),
      p("aspectRatio", "string", "CSS aspect ratio.", { default: '"2 / 1"' }),
      p("status", '"loading" | "ready"', "Loading ↔ ready choreography.", { default: '"ready"' }),
      p("xDomain", "[Date, Date]", "Visible x-range for brush zoom."),
      p("className", "string", "Container class."),
      ...extra,
    ],
  };
}

const AREA: ChartComponentDoc = {
  name: "Area",
  description: "Filled series with an optional stroke, edge fade, markers, and a dashed tail.",
  props: [
    p("dataKey", "string", "Y-value key.", { required: true }),
    p("yAxisId", "string | number", "Scale group for dual axes.", { default: '"left"' }),
    p("fill", "string", "Gradient start color.", { default: "var(--chart-line-primary)" }),
    p("fillOpacity", "number", "Opacity at the top of the fill.", { default: "0.4" }),
    p("stroke", "string", "Line color.", { default: "same as fill" }),
    p("strokeWidth", "number", "Line width.", { default: "2" }),
    p("curve", "CurveFactory", "d3 curve.", { default: "curveMonotoneX" }),
    p("fadeEdges", 'boolean | "left" | "right"', "Fade fill/stroke at chart edges.", {
      default: "false",
    }),
    p("showMarkers", "boolean", "Ring markers at each point.", { default: "false" }),
    p("dashFromIndex", "number", "Index from which the stroke becomes dashed."),
  ],
};

const LINE: ChartComponentDoc = {
  name: "Line",
  description: "Stroked series with optional edge fade, markers, loading pulse, and a dashed tail.",
  props: [
    p("dataKey", "string", "Y-value key.", { required: true }),
    p("yAxisId", "string | number", "Scale group for dual axes.", { default: '"left"' }),
    p("stroke", "string", "Line color.", { default: "var(--chart-line-primary)" }),
    p("strokeWidth", "number", "Line width.", { default: "2.5" }),
    p("curve", "CurveFactory", "d3 curve.", { default: "curveNatural" }),
    p("fadeEdges", 'boolean | "left" | "right"', "Fade the stroke at chart edges.", {
      default: "false",
    }),
    p("dashFromIndex", "number", "Index from which the stroke becomes dashed."),
    p("showMarkers", "boolean", "Point markers.", { default: "false" }),
  ],
};

const VISX_CARTESIAN = [
  "@visx/curve",
  "@visx/responsive",
  "@visx/scale",
  "@visx/shape",
  "motion",
  "react-use-measure",
];

const DATE_ROWS = `type Point = {
  date: Date;
  revenue: number;
  costs: number;
};

const data: Point[] = [
  { date: new Date("2026-01-01"), revenue: 12000, costs: 8500 },
  { date: new Date("2026-01-02"), revenue: 13500, costs: 9200 },
];`;

export const CHART_DOCS: Record<string, ChartPageDoc> = {
  "area-chart": {
    slug: "area-chart",
    motionImports: ["AreaChart", "Area", "Grid", "XAxis", "ChartTooltip"],
    defaultUsage: `import { AreaChart } from "@cronus-ui/ui";

<AreaChart
  data={data}
  xKey="date"
  series={[
    { key: "revenue", label: "Revenue" },
    { key: "costs", label: "Costs" },
  ]}
/>`,
    motionUsage: `import { AreaChart, Area, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<AreaChart data={data} animationDuration={1100}>
  <Grid horizontal />
  <Area dataKey="revenue" fadeEdges fill="var(--chart-line-primary)" fillOpacity={0.3} />
  <Area dataKey="costs" fadeEdges fill="var(--chart-line-secondary)" fillOpacity={0.3} />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
    usageNote:
      "Default is a ready-made series wrapper. Motion is composable: drop Area, Grid, axes, tooltip, PatternArea, ChartBrush, or markers as children. ChartTooltip from `@cronus-ui/ui/charts` is not the recharts tooltip.",
    components: [
      timeSeriesRoot("AreaChart", [
        p("yDomainTween", "boolean", "Animate the y-domain on status/domain changes.", {
          default: "true",
        }),
      ]),
      AREA,
      {
        name: "PatternArea",
        description:
          "Filled area using an SVG pattern (`url(#id)`). Define PatternLines (or another visx pattern) as a child, then pair with an Area that has fillOpacity={0} for the stroke.",
        props: [
          p("dataKey", "string", "Y-value key.", { required: true }),
          p("fill", "string", "Pattern URL, e.g. url(#hatch).", { required: true }),
          p("curve", "CurveFactory", "d3 curve.", { default: "curveMonotoneX" }),
        ],
      },
      GRID,
      BACKGROUND,
      Y_AXIS,
      X_AXIS,
      CHART_TOOLTIP,
    ],
    extraSections: [
      {
        id: "pattern-fills",
        title: "Pattern fills",
        description:
          "Declare a visx pattern as a child of AreaChart, paint PatternArea with url(#id), and keep a transparent Area for the stroke line.",
        code: `import { AreaChart, Area, PatternArea, PatternLines, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<AreaChart data={data}>
  <PatternLines id="hatch" height={6} width={6} stroke="var(--chart-1)" strokeWidth={1} orientation={["diagonal"]} />
  <PatternArea dataKey="revenue" fill="url(#hatch)" />
  <Area dataKey="revenue" fillOpacity={0} stroke="var(--chart-1)" />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
      },
      {
        id: "brush-zoom",
        title: "Brush zoom",
        description:
          "Wrap the main chart in ChartBrushLayout. Render a simplified strip in brushStrip with ChartBrush. Pass xDomain and xDomainSlotCount to the main AreaChart so the visible window follows the selection.",
        code: `import { AreaChart, Area, ChartBrush, ChartBrushLayout, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<ChartBrushLayout data={data} enabled height={72} brushStrip={(layout) => (
  <AreaChart data={data} animationDuration={0} status="ready">
    <Area dataKey="revenue" fillOpacity={0.15} animate={false} />
    <ChartBrush initialSelection={layout.brushSelection ?? undefined} onSelectionChange={layout.onBrushSelectionChange} />
  </AreaChart>
)}>
  {(layout) => (
    <AreaChart data={data} xDomain={layout.xDomain} xDomainSlotCount={layout.xDomainSlotCount} tweenYDomainOnXDomainChange>
      <Grid horizontal />
      <Area dataKey="revenue" />
      <XAxis />
      <ChartTooltip />
    </AreaChart>
  )}
</ChartBrushLayout>`,
      },
      {
        id: "loading",
        title: "Loading",
        description:
          'Keep one chart instance and flip `status` between `"loading"` and `"ready"`. Grid shimmer and series pulse/sweep stay in sync. `loadingLabel` draws a centered shimmer caption.',
        code: `<AreaChart data={data} status={ready ? "ready" : "loading"} loadingLabel="Loading">
  <Grid horizontal shimmer />
  <Area dataKey="revenue" />
  <XAxis />
</AreaChart>`,
      },
    ],
    dataFormat: DATE_ROWS,
    dataFormatNote: "`xDataKey` defaults to `date`. Values must be numbers.",
    theming: SERIES_THEMING,
    dependencies: [...VISX_CARTESIAN, "@visx/gradient", "@visx/pattern", "@visx/brush"],
  },

  "line-chart": {
    slug: "line-chart",
    motionImports: ["LineChart", "Line", "Grid", "XAxis", "ChartTooltip"],
    defaultUsage: `import { LineChart } from "@cronus-ui/ui";

<LineChart
  data={data}
  series={[
    { key: "users", label: "Users" },
    { key: "pageviews", label: "Pageviews" },
  ]}
/>`,
    motionUsage: `import { LineChart, Line, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
    usageNote:
      "Same composable shell as AreaChart. Add YAxis with matching yAxisId for biaxial charts, ProjectionLine for a forecast, or ProfitLossLine for a sign-split series.",
    components: [
      timeSeriesRoot("LineChart"),
      LINE,
      GRID,
      BACKGROUND,
      Y_AXIS,
      X_AXIS,
      CHART_TOOLTIP,
    ],
    extraSections: [
      {
        id: "dual-y-axis",
        title: "Dual Y axes",
        description:
          "Give each series a yAxisId and render two YAxis children with matching ids and opposite orientations.",
        code: `<LineChart data={data}>
  <Line dataKey="users" yAxisId="left" stroke="var(--chart-1)" />
  <Line dataKey="revenue" yAxisId="right" stroke="var(--chart-2)" />
  <YAxis yAxisId="left" orientation="left" />
  <YAxis yAxisId="right" orientation="right" formatValue={(n) => MONEY.format(n)} />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
      },
      {
        id: "dashed-tail",
        title: "Dashed tail",
        description:
          "Use dashFromIndex to project incomplete periods — solid through yesterday, dashed through today.",
        code: `<Line dataKey="users" dashFromIndex={data.length - 2} dashArray="6,4" />`,
      },
      {
        id: "projection",
        title: "Projection",
        description:
          "ProjectionLine draws a forecast from the last real point. Pair with SeriesMarkers or a custom tooltip row for the projected value.",
        code: `import { LineChart, Line, ProjectionLine, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" />
  <ProjectionLine dataKey="forecast" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
      },
    ],
    dataFormat: DATE_ROWS.replace("revenue", "users").replace("costs", "pageviews"),
    theming: SERIES_THEMING,
    dependencies: [...VISX_CARTESIAN, "@visx/gradient"],
  },

  "live-line-chart": {
    slug: "live-line-chart",
    motionImports: ["LiveLineChart", "LiveLine", "LiveXAxis", "LiveYAxis", "Grid", "ChartTooltip"],
    defaultUsage: `import { LiveLineChart } from "@cronus-ui/ui";

<LiveLineChart data={points} interval={1000} maxPoints={24} />`,
    motionUsage: `import { LiveLineChart, LiveLine, LiveXAxis, LiveYAxis, Grid, ChartTooltip } from "@cronus-ui/ui/charts";

<LiveLineChart data={points} value={points.at(-1)?.value ?? 0} window={30}>
  <Grid horizontal />
  <LiveLine dataKey="value" formatValue={formatUsd} />
  <LiveXAxis />
  <LiveYAxis formatValue={formatUsd} position="right" />
  <ChartTooltip />
</LiveLineChart>`,
    usageNote:
      "Motion timestamps are unix seconds (`Date.now() / 1000`). The visible window is `window` seconds ending at now. `paused` freezes the scroll.",
    components: [
      {
        name: "LiveLineChart",
        description: "Streaming time window. Interpolates `value` toward the latest sample.",
        props: [
          p("data", "LiveLinePoint[]", "{ time: unixSeconds, value } samples.", { required: true }),
          p("value", "number", "Latest value (lerped).", { required: true }),
          p("dataKey", "string", "Value field in context data.", { default: '"value"' }),
          p("window", "number", "Visible window in seconds.", { default: "30" }),
          p(
            "nowOffsetUnits",
            "number",
            "Leading offset in X-tick units. 0 = now at the right edge.",
            {
              default: "0",
            },
          ),
          p("lerpSpeed", "number", "Interpolation 0–1.", { default: "0.08" }),
          p("paused", "boolean", "Freeze scrolling.", { default: "false" }),
          p("margin", MARGIN, "Plot margins.", {
            default: "{ top: 16, right: 80, bottom: 40, left: 56 }",
          }),
        ],
      },
      {
        name: "LiveLine",
        description: "The streaming path, gradient fill, live dot, and value badge.",
        props: [
          p("dataKey", "string", "Y-value key.", { required: true }),
          p("stroke", "string", "Line color.", { default: "var(--chart-line-primary)" }),
          p("fill", "boolean", "Gradient under the curve.", { default: "true" }),
          p("pulse", "boolean", "Pulsing live dot.", { default: "true" }),
          p("badge", "boolean", "Value pill at the live tip.", { default: "true" }),
          p("formatValue", "(v: number) => string", "Badge formatter."),
          p("momentumColors", "{ up, down, flat }", "Override stroke from recent slope."),
        ],
      },
      {
        name: "LiveXAxis",
        description: "HH:MM:SS labels (local time, en-US) that fade under the crosshair.",
        props: [p("numTicks", "number", "Time labels.", { default: "5" })],
      },
      {
        name: "LiveYAxis",
        description: "Value ticks with a nice-step picker.",
        props: [
          p("position", '"left" | "right"', "Side.", { default: '"left"' }),
          p("formatValue", "(v: number) => string", "Tick formatter."),
          p("minGap", "number", "Minimum pixel gap between labels.", { default: "36" }),
        ],
      },
      GRID,
      CHART_TOOLTIP,
    ],
    extraSections: [
      {
        id: "time-window",
        title: "Time window",
        description:
          "`window` is seconds of history. `nowOffsetUnits` pulls “now” left so the live tip is not clipped by the right margin.",
        code: `<LiveLineChart data={points} value={last} window={30} nowOffsetUnits={0.4}>
  <LiveLine dataKey="value" />
  <LiveXAxis />
</LiveLineChart>`,
      },
      {
        id: "momentum",
        title: "Momentum colors",
        description: "Pass momentumColors so the stroke, fill, and live dot follow recent slope.",
        code: `<LiveLine
  dataKey="value"
  momentumColors={{
    up: "var(--cronus-success)",
    down: "var(--cronus-danger)",
    flat: "var(--chart-line-primary)",
  }}
/>`,
      },
    ],
    dataFormat: `type LiveLinePoint = { time: number; value: number };

const points: LiveLinePoint[] = [
  { time: Date.now() / 1000 - 8, value: 184.2 },
  { time: Date.now() / 1000 - 4, value: 184.9 },
  { time: Date.now() / 1000, value: 185.1 },
];`,
    dataFormatNote: "`time` is unix seconds, not milliseconds and not Date objects.",
    theming: `${SERIES_THEMING} The live badge uses \`--chart-tooltip-background\` / \`--chart-tooltip-foreground\`.`,
    dependencies: [...VISX_CARTESIAN, "d3-array"],
  },

  "bar-chart": {
    slug: "bar-chart",
    motionImports: ["BarChart", "Bar", "BarXAxis", "Grid", "ChartTooltip"],
    defaultUsage: `import { BarChart } from "@cronus-ui/ui";

<BarChart
  data={data}
  xKey="month"
  stacked={false}
  series={[
    { key: "revenue", label: "Revenue" },
    { key: "profit", label: "Profit" },
  ]}
/>`,
    motionUsage: `import { BarChart, Bar, BarXAxis, Grid, ChartTooltip } from "@cronus-ui/ui/charts";

<BarChart data={data} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="revenue" fill="var(--chart-line-primary)" lineCap="round" />
  <Bar dataKey="profit" fill="var(--chart-line-secondary)" lineCap="round" />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
    usageNote:
      'Grouped is the default. `stacked` + `stackGap` stacks segments. `orientation="horizontal"` swaps axes (use BarYAxis). Hover dims other columns via fadedOpacity (0.22).',
    components: [
      {
        name: "BarChart",
        description: "Categorical root: grouped or stacked, vertical or horizontal.",
        props: [
          p("data", "Record<string, unknown>[]", "Rows with a category key and numeric series.", {
            required: true,
          }),
          p("xDataKey", "string", "Category key.", { default: '"name"' }),
          p("orientation", '"vertical" | "horizontal"', "Bar direction.", {
            default: '"vertical"',
          }),
          p("stacked", "boolean", "Stack series instead of grouping.", { default: "false" }),
          p("stackGap", "number", "Gap between stacked segments in px.", { default: "0" }),
          p("barGap", "number", "Gap between groups as a fraction of band width.", {
            default: "0.2",
          }),
          p("barWidth", "number", "Fixed bar width in px. Auto-sizes when omitted."),
          p("aspectRatio", "string", "CSS aspect ratio.", { default: '"2 / 1"' }),
          p("squareSnap", "{ squareGap, groupGap?, fit? }", "Tooltip snap when using BarSquares."),
        ],
      },
      {
        name: "Bar",
        description: "One series of columns. Round caps, hover dim, optional 3D perspective trim.",
        props: [
          p("dataKey", "string", "Value key.", { required: true }),
          p("fill", "string", "Solid color, gradient, or pattern url.", {
            default: "var(--chart-line-primary)",
          }),
          p("lineCap", '"round" | "butt" | number', "End cap or custom radius.", {
            default: '"round"',
          }),
          p("animationType", '"grow" | "fade"', "Enter animation.", { default: '"grow"' }),
          p("fadedOpacity", "number", "Opacity when another bar is hovered.", { default: "0.22" }),
          p("stackGap", "number", "Gap between stacked segments in px.", { default: "0" }),
          p("perspective", "boolean", "Trim the front face to meet BarDepthBack.", {
            default: "false",
          }),
        ],
      },
      {
        name: "BarSquares",
        description:
          "Shape variant: a vertical stack of discrete squares instead of a continuous Bar. Grouped vertical charts only.",
        props: [
          p("dataKey", "string", "Value key.", { required: true }),
          p("squareGap", "number", "Gap between squares in px.", { default: "3" }),
          p("squareRadius", "number", "Corner radius as a fraction of size (0–0.5).", {
            default: "0.25",
          }),
          p("useGradient", "boolean", "Bar-spanning gradient from gradientStops.", {
            default: "false",
          }),
          p("patternPreset", "PatternPresetId", "Pattern when fill is a pattern url."),
        ],
      },
      {
        name: "BarXAxis",
        description: "Category labels for vertical charts. Fades under the hover ticker.",
        props: [
          p("tickerHalfWidth", "number", "Fade radius.", { default: "50" }),
          p("maxLabels", "number", "Cap on labels for dense data.", { default: "12" }),
        ],
      },
      {
        name: "BarYAxis",
        description: "Category labels for horizontal charts.",
        props: [
          p("showAllLabels", "boolean", "Do not skip labels.", { default: "true" }),
          p("maxLabels", "number", "Cap on labels.", { default: "20" }),
        ],
      },
      GRID,
      BACKGROUND,
      CHART_TOOLTIP,
    ],
    extraSections: [
      {
        id: "stacked-bars",
        title: "Stacked",
        description:
          "Set stacked on the root and stackGap on each Bar. lineCap as a number keeps a consistent radius on segments.",
        code: `<BarChart data={data} xDataKey="month" stacked>
  <Bar dataKey="desktop" fill="var(--chart-line-primary)" lineCap={4} stackGap={3} />
  <Bar dataKey="mobile" fill="var(--chart-line-secondary)" lineCap={4} stackGap={3} />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
      },
      {
        id: "orientation",
        title: "Horizontal",
        description:
          'orientation="horizontal" draws bars from the left. Use BarYAxis for category labels.',
        code: `<BarChart data={data} xDataKey="month" orientation="horizontal">
  <Bar dataKey="revenue" lineCap="round" />
  <BarYAxis />
  <ChartTooltip />
</BarChart>`,
      },
    ],
    dataFormat: `const data = [
  { month: "Jan", revenue: 12000, profit: 4500 },
  { month: "Feb", revenue: 15500, profit: 5200 },
];`,
    theming: SERIES_THEMING,
    dependencies: [...VISX_CARTESIAN, "@visx/gradient", "@visx/pattern"],
  },

  "composed-chart": {
    slug: "composed-chart",
    motionImports: ["ComposedChart", "Area", "SeriesBar", "Line", "Grid", "XAxis", "ChartTooltip"],
    defaultUsage: `import { ComposedChart } from "@cronus-ui/ui";

<ComposedChart
  data={data}
  series={[
    { key: "runRate", label: "Run rate", type: "area" },
    { key: "units", label: "Units", type: "bar" },
    { key: "revenue", label: "Revenue", type: "line" },
  ]}
/>`,
    motionUsage: `import { ComposedChart, Area, SeriesBar, Line, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";
import { curveCatmullRom } from "@visx/curve";

<ComposedChart data={data}>
  <Grid horizontal />
  <Area dataKey="runRate" fill="var(--chart-2)" fillOpacity={0.25} />
  <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <Line dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} curve={curveCatmullRom} />
  <XAxis />
  <ChartTooltip />
</ComposedChart>`,
    components: [
      timeSeriesRoot("ComposedChart", [
        p("barSize", "number", "Target bar width in px."),
        p("maxBarSize", "number", "Maximum bar width in px."),
        p("barGap", "number", "Gap between grouped SeriesBar series.", { default: "4" }),
        p("stacked", "boolean", "Stack SeriesBar segments (line/area are not stacked).", {
          default: "false",
        }),
      ]),
      AREA,
      {
        name: "SeriesBar",
        description: "Time-aligned columns inside ComposedChart (not the categorical Bar).",
        props: [
          p("dataKey", "string", "Value key.", { required: true }),
          p("fill", "string", "Fill color.", { default: "var(--chart-line-primary)" }),
          p("radius", "number", "Top corner radius.", { default: "0" }),
          p("fadedOpacity", "number", "Opacity when another x is hovered.", { default: "0.3" }),
        ],
      },
      LINE,
      GRID,
      X_AXIS,
      CHART_TOOLTIP,
    ],
    extraSections: [
      {
        id: "mixing-series",
        title: "Mixing series",
        description:
          "Child order is paint order. Put Area first, SeriesBar next, Line on top. Tooltip rows follow registered series.",
        code: `<ComposedChart data={data} barSize={18}>
  <Area dataKey="runRate" fillOpacity={0.25} />
  <SeriesBar dataKey="units" radius={4} />
  <Line dataKey="revenue" strokeWidth={2.5} />
  <XAxis />
  <ChartTooltip />
</ComposedChart>`,
      },
    ],
    dataFormat: `const data = [
  { date: new Date("2026-01-01"), runRate: 420, units: 36, revenue: 18400 },
  { date: new Date("2026-01-02"), runRate: 438, units: 41, revenue: 19200 },
];`,
    theming: SERIES_THEMING,
    dependencies: [...VISX_CARTESIAN, "@visx/gradient"],
  },

  "candlestick-chart": {
    slug: "candlestick-chart",
    motionImports: ["CandlestickChart", "Candlestick", "Grid", "XAxis", "ChartTooltip"],
    defaultUsage: `import { CandlestickChart } from "@cronus-ui/ui";

<CandlestickChart data={ohlc} />`,
    motionUsage: `import { CandlestickChart, Candlestick, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<CandlestickChart data={ohlc}>
  <Grid horizontal />
  <Candlestick />
  <XAxis />
  <ChartTooltip />
</CandlestickChart>`,
    components: [
      {
        name: "CandlestickChart",
        description: "OHLC time-series root. Y domain is high/low across the window.",
        props: [
          p("data", "OHLCDataPoint[]", "Rows with date, open, high, low, close.", {
            required: true,
          }),
          p("xDataKey", "string", "Time key.", { default: '"date"' }),
          p("animationDuration", "number", "Enter duration in ms.", { default: "1500" }),
          p("aspectRatio", "string", "CSS aspect ratio.", { default: '"2 / 1"' }),
        ],
      },
      {
        name: "Candlestick",
        description: "Wick + body. Positive (close ≥ open) vs negative fills. Hover dims others.",
        props: [
          p("positiveFill", "string", "Up-candle fill (color or url(#id)).", {
            default: "var(--color-emerald-500)",
          }),
          p("negativeFill", "string", "Down-candle fill.", { default: "var(--color-red-500)" }),
          p("bodyPatternPositive", "string", "Optional pattern URL over the up body."),
          p("fadedOpacity", "number", "Opacity when another candle is hovered.", {
            default: "0.3",
          }),
        ],
      },
      GRID,
      BACKGROUND,
      X_AXIS,
      CHART_TOOLTIP,
    ],
    extraSections: [
      {
        id: "styling-candles",
        title: "Styling candles",
        description:
          "Override positiveFill / negativeFill with tokens or gradients. Use ChartTooltip rows to print OHLC, and indicatorColor to match the hovered candle.",
        code: `<Candlestick
  positiveFill="var(--cronus-success)"
  negativeFill="var(--cronus-danger)"
/>
<ChartTooltip
  indicatorColor={(point) =>
    Number(point.close) >= Number(point.open) ? "var(--cronus-success)" : "var(--cronus-danger)"
  }
/>`,
      },
    ],
    dataFormat: `type OHLCDataPoint = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
};`,
    theming: `${SERIES_THEMING} Candle direction uses success/danger colors, not the chart-1…5 ramp.`,
    dependencies: [...VISX_CARTESIAN],
  },

  "funnel-chart": {
    slug: "funnel-chart",
    motionImports: ["FunnelChart"],
    defaultUsage: `import { FunnelChart } from "@cronus-ui/ui";

<FunnelChart data={stages} />`,
    motionUsage: `import { FunnelChart } from "@cronus-ui/ui/charts";

<FunnelChart
  data={stages}
  color="var(--chart-1)"
  layers={3}
  showPercentage
  showValues
  showLabels
/>`,
    components: [
      {
        name: "FunnelChart",
        description:
          "Stage drop-off with halo layers, hover, optional patterns, and a banded grid.",
        props: [
          p("data", "FunnelStage[]", "label, value, optional displayValue / color / gradient.", {
            required: true,
          }),
          p("orientation", '"horizontal" | "vertical"', "Layout.", { default: '"horizontal"' }),
          p("color", "string", "Default segment color.", { default: "var(--chart-1)" }),
          p("layers", "number", "Halo rings behind the innermost fill.", { default: "3" }),
          p("gap", "number", "Gap between segments in px.", { default: "4" }),
          p("edges", '"curved" | "straight"', "Segment edge style.", { default: '"curved"' }),
          p("showPercentage", "boolean", "Show conversion %.", { default: "true" }),
          p("showValues", "boolean", "Show values.", { default: "true" }),
          p("hoveredIndex", "number | null", "Controlled hover."),
          p("renderPattern", "(id, color) => ReactNode", "visx pattern per segment."),
          p("grid", "boolean | GridConfig", "Banded background + gap lines."),
        ],
      },
    ],
    extraSections: [
      {
        id: "funnel-customization",
        title: "Layers, edges, patterns",
        description:
          'layers draws concentric halos. edges="straight" is a trapezoid. renderPattern fills the innermost ring with a visx pattern while halos stay solid.',
        code: `<FunnelChart
  data={stages}
  layers={3}
  edges="curved"
  labelLayout="grouped"
  renderPattern={(id, color) => (
    <PatternLines id={id} height={6} width={6} stroke={color} strokeWidth={1} orientation={["diagonal"]} />
  )}
/>`,
      },
    ],
    dataFormat: `type FunnelStage = {
  label: string;
  value: number;
  displayValue?: string;
  color?: string;
  gradient?: { offset: string | number; color: string }[];
};

const stages: FunnelStage[] = [
  { label: "Visit", value: 10000, displayValue: "10k" },
  { label: "Signup", value: 4200, displayValue: "4.2k" },
  { label: "Paid", value: 980, displayValue: "980" },
];`,
    theming: SERIES_THEMING,
    dependencies: ["motion", "@visx/pattern"],
  },

  "gauge-chart": {
    slug: "gauge-chart",
    motionImports: ["Gauge"],
    defaultUsage: `import { GaugeChart } from "@cronus-ui/ui";

<GaugeChart value={72} label="Score" max={100} />`,
    motionUsage: `import { Gauge } from "@cronus-ui/ui/charts";

<Gauge value={72} centerValue={72} defaultLabel="Score" totalNotches={32} />`,
    usageNote:
      'Motion exports `Gauge` (not GaugeChart). orientation="linear" is a horizontal notch track.',
    components: [
      {
        name: "Gauge",
        description: "Notched arc or linear track. Optional center statistic.",
        props: [
          p("value", "number", "Fill level 0–100.", { required: true }),
          p("orientation", '"arc" | "linear"', "Arc (default) or horizontal track.", {
            default: '"arc"',
          }),
          p("totalNotches", "number", "Notch count."),
          p("spacing", "number", "Fraction of the track reserved for gaps."),
          p("useGradient", "boolean", "Interpolate active notches along activeGradient."),
          p("centerValue", "number", "Center statistic. Omit to hide the label block."),
          p("defaultLabel", "string", "Label under the value."),
          p("prefix", "string", "Prefix before the number (e.g. $)."),
          p("suffix", "string", "Suffix after the number (e.g. %)."),
          p(
            "labelPlacement",
            "GaugeLabelPlacement",
            "Linear gauges only. Arc always overlays center.",
          ),
        ],
      },
    ],
    extraSections: [
      {
        id: "linear-gauge",
        title: "Linear gauge",
        description:
          'orientation="linear" draws a horizontal notch track. labelPlacement puts the statistic start/center/end.',
        code: `<Gauge orientation="linear" value={64} centerValue={64} defaultLabel="Capacity" labelPlacement="end" />`,
      },
    ],
    dataFormat: `// No data array — pass a 0–100 value.
<Gauge value={72} centerValue={72} defaultLabel="Score" />`,
    theming: `${SERIES_THEMING} Active notches use the chart ramp / primary; inactive notches use a muted mix of \`--chart-grid\`.`,
    dependencies: ["motion", "@visx/responsive"],
  },

  "pie-chart": {
    slug: "pie-chart",
    motionImports: [
      "PieChart",
      "PieSlice",
      "Legend",
      "LegendItem",
      "LegendMarker",
      "LegendLabel",
      "LegendValue",
    ],
    defaultUsage: `import { PieChart } from "@cronus-ui/ui";

<PieChart
  data={slices}
  series={slices.map((s) => ({ key: s.source, label: s.source }))}
/>`,
    motionUsage: `import { PieChart, PieSlice, Legend, LegendItem, LegendMarker, LegendLabel, LegendValue } from "@cronus-ui/ui/charts";

const [hovered, setHovered] = useState<number | null>(null);

<div className="flex items-center gap-8">
  <PieChart data={slices} hoveredIndex={hovered} onHoverChange={setHovered}>
    {slices.map((_, i) => <PieSlice index={i} key={i} />)}
  </PieChart>
  <Legend items={items} hoveredIndex={hovered} onHoverChange={setHovered}>
    <LegendItem>
      <LegendMarker />
      <LegendLabel />
      <LegendValue />
    </LegendItem>
  </Legend>
</div>`,
    usageNote:
      "Share hoveredIndex between PieChart and Legend so hover highlights the matching slice and row.",
    components: [
      {
        name: "PieChart",
        description: "Full pie. Pads the SVG by hoverOffset so translated slices are not clipped.",
        props: [
          p("data", "PieData[]", "label, value, optional color/fill.", { required: true }),
          p("size", "number", "Pixel size. Falls back to parent width."),
          p("innerRadius", "number", "Donut hole. 0 is a solid pie.", { default: "0" }),
          p("padAngle", "number", "Gap between slices in radians.", { default: "0" }),
          p("cornerRadius", "number", "Rounded slice edges.", { default: "0" }),
          p("hoveredIndex", "number | null", "Controlled hover."),
          p("hoverOffset", "number", "Translate/grow distance and SVG padding.", { default: "10" }),
        ],
      },
      {
        name: "PieSlice",
        description: "One slice. Hover translate (default), grow, or none.",
        props: [
          p("index", "number", "Index in data.", { required: true }),
          p("color", "string", "Override. Falls back to data.color or --chart-1…5."),
          p("fill", "string", "Pattern/gradient url."),
          p("hoverEffect", '"translate" | "grow" | "none"', "Hover motion.", {
            default: '"translate"',
          }),
          p("showGlow", "boolean", "Glow on hover.", { default: "true" }),
        ],
      },
      {
        name: "PieCenter",
        description: "Hub statistic. Swaps to the hovered slice label/value.",
        props: [
          p("defaultLabel", "string", "Label when nothing is hovered.", { default: '"Total"' }),
          p("prefix", "string", "Prefix before the number."),
          p("children", "(ctx) => ReactNode", "Custom hub renderer."),
        ],
      },
      LEGEND,
    ],
    extraSections: [
      {
        id: "legend-hover",
        title: "Legend hover",
        description:
          "Controlled hoveredIndex is bidirectional: legend rows fade unselected slices, and slice hover highlights the matching row.",
        code: `const [hovered, setHovered] = useState<number | null>(null);

<PieChart data={slices} hoveredIndex={hovered} onHoverChange={setHovered}>
  {slices.map((_, i) => <PieSlice index={i} key={i} />)}
</PieChart>`,
      },
    ],
    dataFormat: `type PieData = { label: string; value: number; color?: string; fill?: string };

const slices: PieData[] = [
  { label: "Direct", value: 4200 },
  { label: "Organic", value: 3100 },
  { label: "Referral", value: 1900 },
];`,
    theming: `${SERIES_THEMING} defaultPieColors cycles \`--chart-1\`…\`--chart-5\`.`,
    dependencies: ["@visx/shape", "@visx/responsive", "d3-shape", "motion"],
  },

  "ring-chart": {
    slug: "ring-chart",
    motionImports: [
      "RingChart",
      "Ring",
      "RingCenter",
      "Legend",
      "LegendItem",
      "LegendMarker",
      "LegendLabel",
      "LegendValue",
    ],
    defaultUsage: `import { RingChart } from "@cronus-ui/ui";

<RingChart data={rings} series={series} centerLabel="Total" />`,
    motionUsage: `import { RingChart, Ring, RingCenter, Legend, LegendItem, LegendMarker, LegendLabel } from "@cronus-ui/ui/charts";

<RingChart data={rings} hoveredIndex={hovered} onHoverChange={setHovered}>
  {rings.map((_, i) => <Ring index={i} key={i} />)}
  <RingCenter defaultLabel="Total" />
</RingChart>`,
    components: [
      {
        name: "RingChart",
        description: "Concentric progress rings. Each datum has value / maxValue.",
        props: [
          p("data", "RingData[]", "label, value, maxValue, optional color.", { required: true }),
          p("strokeWidth", "number", "Ring thickness.", { default: "12" }),
          p("ringGap", "number", "Gap between rings.", { default: "6" }),
          p("baseInnerRadius", "number", "Innermost inner radius.", { default: "60" }),
          p("hoveredIndex", "number | null", "Controlled hover."),
        ],
      },
      {
        name: "Ring",
        description: "One progress arc. Hover scales the ring; others dim.",
        props: [
          p("index", "number", "Index in data.", { required: true }),
          p("color", "string", "Override color."),
          p("lineCap", '"round" | "butt"', "Arc end cap.", { default: '"round"' }),
          p("showGlow", "boolean", "Glow on hover.", { default: "true" }),
        ],
      },
      {
        name: "RingCenter",
        description: "Hub total / hovered value.",
        props: [
          p("defaultLabel", "string", "Label when nothing is hovered.", { default: '"Total"' }),
          p("prefix", "string", "Prefix before the number."),
          p("children", "(ctx) => ReactNode", "Custom hub renderer."),
        ],
      },
      LEGEND,
    ],
    extraSections: [
      {
        id: "ring-hover",
        title: "Hover + legend",
        description: "Same bidirectional hoveredIndex pattern as PieChart.",
      },
    ],
    dataFormat: `type RingData = { label: string; value: number; maxValue: number; color?: string };

const rings: RingData[] = [
  { label: "Storage", value: 68, maxValue: 100 },
  { label: "Bandwidth", value: 42, maxValue: 100 },
];`,
    theming: `${SERIES_THEMING} Track background is \`--border\`. defaultRingColors cycles \`--chart-1\`…\`--chart-5\`.`,
    dependencies: ["@visx/shape", "@visx/responsive", "motion"],
  },

  "radar-chart": {
    slug: "radar-chart",
    motionImports: ["RadarChart", "RadarGrid", "RadarAxis", "RadarLabels", "RadarArea"],
    defaultUsage: `import { RadarChart } from "@cronus-ui/ui";

<RadarChart
  data={rows}
  angleKey="metric"
  series={[
    { key: "current", label: "Current" },
    { key: "target", label: "Target" },
  ]}
/>`,
    motionUsage: `import { RadarChart, RadarGrid, RadarAxis, RadarLabels, RadarArea } from "@cronus-ui/ui/charts";

<RadarChart data={series} metrics={metrics}>
  <RadarGrid />
  <RadarAxis />
  <RadarLabels />
  {series.map((_, i) => <RadarArea index={i} key={i} />)}
</RadarChart>`,
    components: [
      {
        name: "RadarChart",
        description: "Polar comparison. `data` is one polygon per series; `metrics` are the axes.",
        props: [
          p("data", "RadarData[]", "label, values map, optional color.", { required: true }),
          p("metrics", "RadarMetric[]", "Axes: { key, label }.", { required: true }),
          p("levels", "number", "Concentric grid circles.", { default: "5" }),
          p("margin", "number", "Padding around the chart.", { default: "60" }),
          p("hoveredIndex", "number | null", "Controlled hover."),
        ],
      },
      {
        name: "RadarGrid",
        description: "Concentric circles and optional level labels.",
        props: [
          p("showLabels", "boolean", "Level values.", { default: "true" }),
          p("stroke", "string", "Grid stroke.", { default: "var(--border)" }),
        ],
      },
      {
        name: "RadarAxis",
        description: "Spokes from center to each metric.",
        props: [p("stroke", "string", "Spoke color.", { default: "var(--border)" })],
      },
      {
        name: "RadarLabels",
        description: "Metric names around the rim.",
        props: [
          p("offset", "number", "Distance from the edge.", { default: "24" }),
          p("interactive", "boolean", "Hover on labels.", { default: "false" }),
        ],
      },
      {
        name: "RadarArea",
        description: "One filled polygon. Hover thickens the stroke and glows.",
        props: [
          p("index", "number", "Index in data.", { required: true }),
          p("color", "string", "Override color."),
          p("showPoints", "boolean", "Vertex dots.", { default: "true" }),
          p("showGlow", "boolean", "Glow on hover.", { default: "true" }),
        ],
      },
    ],
    extraSections: [
      {
        id: "radar-hover",
        title: "Controlled hover",
        description:
          "hoveredIndex / onHoverChange dim the other polygons. Pair with a Legend using the same index.",
      },
    ],
    dataFormat: `type RadarMetric = { key: string; label: string };
type RadarData = { label: string; color?: string; values: Record<string, number> };

const metrics: RadarMetric[] = [
  { key: "speed", label: "Speed" },
  { key: "reliability", label: "Reliability" },
];
const series: RadarData[] = [
  { label: "Current", values: { speed: 86, reliability: 72 } },
  { label: "Target", values: { speed: 95, reliability: 90 } },
];`,
    dataFormatNote: "Values are typically 0–100.",
    theming: `${SERIES_THEMING} defaultRadarColors cycles \`--chart-1\`…\`--chart-5\`. Grid/axis use \`--border\`.`,
    dependencies: ["@visx/shape", "@visx/responsive", "@visx/scale", "motion"],
  },

  "scatter-chart": {
    slug: "scatter-chart",
    motionImports: ["ScatterChart", "Scatter", "Grid", "XAxis", "YAxis", "ChartTooltip"],
    defaultUsage: `import { ScatterChart } from "@cronus-ui/ui";

<ScatterChart
  series={[{ key: "a", label: "Series A", data: points }]}
/>`,
    motionUsage: `import { ScatterChart, Scatter, Grid, XAxis, YAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<ScatterChart data={data}>
  <Grid horizontal vertical />
  <Scatter dataKey="alpha" />
  <Scatter dataKey="beta" />
  <XAxis />
  <YAxis />
  <ChartTooltip />
</ScatterChart>`,
    components: [
      timeSeriesRoot("ScatterChart"),
      {
        name: "Scatter",
        description: "One series of points. Optional y-gradient, hover fade, ring style.",
        props: [
          p("dataKey", "string", "Y-value key.", { required: true }),
          p("fill", "string", "Point fill. Defaults to --chart-1…5 by series order."),
          p("radius", "number", "Point radius.", { default: "5" }),
          p("yGradient", "boolean | { from, to }", "Color by vertical position."),
          p("fadeOnHover", "boolean", "Dim inactive points.", { default: "true" }),
        ],
      },
      GRID,
      X_AXIS,
      Y_AXIS,
      CHART_TOOLTIP,
    ],
    extraSections: [
      {
        id: "y-gradient",
        title: "Y gradient",
        description:
          "yGradient colors each dot by its vertical position. Default stops are danger (low) → success (high).",
        code: `<Scatter dataKey="score" yGradient />
<Scatter dataKey="score" yGradient={{ from: "var(--cronus-danger)", to: "var(--cronus-success)" }} />`,
      },
    ],
    dataFormat: `const data = [
  { date: new Date("2025-01-01"), alpha: 12, beta: 18 },
  { date: new Date("2025-02-01"), alpha: 19, beta: 14 },
];`,
    theming: SERIES_THEMING,
    dependencies: [...VISX_CARTESIAN],
  },

  "sankey-chart": {
    slug: "sankey-chart",
    motionImports: ["SankeyChart", "SankeyNode", "SankeyLink", "SankeyTooltip"],
    defaultUsage: `import { SankeyChart } from "@cronus-ui/ui";

<SankeyChart data={{ nodes, links }} />`,
    motionUsage: `import { SankeyChart, SankeyNode, SankeyLink, SankeyTooltip } from "@cronus-ui/ui/charts";

<SankeyChart data={{ nodes, links }}>
  <SankeyLink />
  <SankeyNode />
  <SankeyTooltip />
</SankeyChart>`,
    components: [
      {
        name: "SankeyChart",
        description: "Flow diagram. Hover a node to isolate connected links.",
        props: [
          p("data", "SankeyData", "{ nodes, links }.", { required: true }),
          p("nodeWidth", "number", "Node width in px.", { default: "16" }),
          p("nodePadding", "number", "Vertical gap between nodes.", { default: "24" }),
          p("aspectRatio", "string", "CSS aspect ratio.", { default: '"2 / 1"' }),
          p("hoveredNodeIndex", "number | null", "Controlled node hover."),
        ],
      },
      {
        name: "SankeyNode",
        description: "Rectangles + labels. Hover dims unrelated nodes.",
        props: [
          p("fill", "string", "Solid fill. Default cycles --chart-1…5."),
          p("lineCap", "number", "Corner radius.", { default: "4" }),
          p("fadedOpacity", "number", "Opacity when another node is hovered.", { default: "0.4" }),
          p("labelOrientation", '"horizontal" | "vertical"', "Outside label direction.", {
            default: '"horizontal"',
          }),
          p("getNodeColor", "(node, index) => string", "Custom node color."),
        ],
      },
      {
        name: "SankeyLink",
        description: "Flows between nodes. Gradient from source to target by default.",
        props: [
          p("useGradient", "boolean", "Source → target gradient.", { default: "true" }),
          p("strokeOpacity", "number", "Link opacity.", { default: "0.5" }),
          p("fadedOpacity", "number", "Opacity when another link is hovered.", { default: "0.1" }),
          p("getLinkPattern", "(link, index) => string | null", "Pattern id for a link."),
        ],
      },
      {
        name: "SankeyTooltip",
        description: "Node or link tooltip that follows the pointer.",
        props: [
          p("nodeContent", "(props) => ReactNode", "Custom node tooltip."),
          p("linkContent", "(props) => ReactNode", "Custom link tooltip."),
          p("formatValue", "(value: number) => string", "Value formatter."),
        ],
      },
    ],
    extraSections: [
      {
        id: "sankey-hover",
        title: "Hover",
        description:
          "Hovering a node highlights connected links and dims the rest. hoveredNodeIndex can be driven from a legend of sources.",
      },
      {
        id: "label-orientation",
        title: "Label orientation",
        description:
          'labelOrientation="vertical" rotates outside labels along the node edge — useful when names are long.',
        code: `<SankeyNode labelOrientation="vertical" />`,
      },
    ],
    dataFormat: `type SankeyData = {
  nodes: { name: string; category?: "source" | "landing" | "outcome" }[];
  links: { source: number; target: number; value: number }[];
};

const data: SankeyData = {
  nodes: [{ name: "Ads" }, { name: "Site" }, { name: "Paid" }],
  links: [
    { source: 0, target: 1, value: 120 },
    { source: 1, target: 2, value: 40 },
  ],
};`,
    dataFormatNote: "`source` / `target` are indices into `nodes`.",
    theming: SERIES_THEMING,
    dependencies: ["@visx/sankey", "@visx/responsive", "d3-sankey", "motion"],
  },

  "profit-loss-chart": {
    slug: "profit-loss-chart",
    motionImports: [
      "LineChart",
      "ProfitLossLine",
      "ProfitLossLegend",
      "Grid",
      "XAxis",
      "ChartTooltip",
    ],
    defaultUsage: `import { ProfitLossChart } from "@cronus-ui/ui";

<ProfitLossChart data={points} />`,
    motionUsage: `import { LineChart, ProfitLossLine, ProfitLossLegend, Grid, XAxis, ChartTooltip } from "@cronus-ui/ui/charts";

<LineChart data={data}>
  <Grid highlightRowValues={[0]} horizontal />
  <ProfitLossLine dataKey="pnl" />
  <XAxis />
  <ChartTooltip />
</LineChart>
<ProfitLossLegend />`,
    usageNote:
      "Motion is a LineChart child, not a root. The series is split at zero into positive/negative path segments.",
    components: [
      {
        name: "ProfitLossLine",
        description: "Sign-colored segments on a LineChart.",
        props: [
          p("dataKey", "string", "Value key.", { required: true }),
          p("positiveColor", "string", "Stroke when value ≥ 0.", {
            default: "var(--color-emerald-500)",
          }),
          p("negativeColor", "string", "Stroke when value < 0.", {
            default: "var(--color-red-500)",
          }),
          p("curve", "CurveFactory", "d3 curve.", { default: "curveLinear" }),
          p("fadeEdges", 'boolean | "left" | "right"', "Fade at chart edges.", {
            default: "false",
          }),
        ],
      },
      {
        name: "ProfitLossLegend",
        description: "Profit / Loss swatches. Share hoveredIndex to dim the opposite sign.",
        props: [
          p("hoveredIndex", "number | null", "0 = profit, 1 = loss."),
          p("align", '"start" | "center" | "end"', "Horizontal alignment.", { default: '"start"' }),
        ],
      },
      GRID,
      X_AXIS,
      CHART_TOOLTIP,
    ],
    extraSections: [
      {
        id: "zero-line",
        title: "Zero line",
        description: "Highlight the baseline with Grid highlightRowValues={[0]}.",
        code: `<Grid highlightRowValues={[0]} horizontal />`,
      },
    ],
    dataFormat: `const data = [
  { date: new Date("2026-01-01"), pnl: 420 },
  { date: new Date("2026-01-02"), pnl: -180 },
];`,
    theming: `${SERIES_THEMING} Sign colors default to emerald/red. Pass positiveColor / negativeColor with \`var(--cronus-success)\` / \`var(--cronus-danger)\` to stay on semantic tokens.`,
    dependencies: [...VISX_CARTESIAN],
  },

  "choropleth-chart": {
    slug: "choropleth-chart",
    motionImports: [
      "ChoroplethChart",
      "ChoroplethFeatureComponent",
      "ChoroplethGraticule",
      "ChoroplethTooltip",
    ],
    defaultUsage: `import { ChoroplethChart, CHOROPLETH_DEMO } from "@cronus-ui/ui";

<ChoroplethChart data={CHOROPLETH_DEMO} />`,
    motionUsage: `import {
  ChoroplethChart,
  ChoroplethFeatureComponent,
  ChoroplethGraticule,
  ChoroplethTooltip,
} from "@cronus-ui/ui/charts";

<ChoroplethChart data={world} aspectRatio="16 / 9" zoomEnabled>
  <ChoroplethGraticule />
  <ChoroplethFeatureComponent
    fill="var(--chart-scale-03)"
    stroke="var(--chart-background)"
    strokeWidth={0.5}
  />
  <ChoroplethTooltip />
</ChoroplethChart>`,
    usageNote:
      "Motion expects a GeoJSON FeatureCollection (Polygon / MultiPolygon). Default is a region grid (`ChoroplethRegion[]`), not a map. Fetch world GeoJSON at runtime — there is no bundled topology.",
    components: [
      {
        name: "ChoroplethChart",
        description: "Mercator projection, optional zoom/pan, context for children.",
        props: [
          p("data", "FeatureCollection", "GeoJSON features.", { required: true }),
          p("margin", MARGIN, "Plot margins.", {
            default: "{ top: 0, right: 0, bottom: 0, left: 0 }",
          }),
          p("animationDuration", "number", "Enter duration in ms.", { default: "800" }),
          p("aspectRatio", "string", "CSS aspect ratio.", { default: '"16 / 9"' }),
          p("scale", "number", "Projection scale. Auto from width when omitted."),
          p("center", "[number, number]", "Center [longitude, latitude].", { default: "[0, 20]" }),
          p("zoomEnabled", "boolean", "Zoom and pan.", { default: "false" }),
          p("zoomMin", "number", "Minimum zoom scale.", { default: "0.5" }),
          p("zoomMax", "number", "Maximum zoom scale.", { default: "4" }),
        ],
      },
      {
        name: "ChoroplethFeatureComponent",
        description: "Country/region paths with hover dim and optional pattern fills.",
        props: [
          p("fill", "string", "Solid fill for every feature (overrides getFeatureColor)."),
          p("stroke", "string", "Border color.", { default: "var(--chart-background)" }),
          p("strokeWidth", "number", "Border width.", { default: "0.5" }),
          p("fadedOpacity", "number", "Opacity when another feature is hovered.", {
            default: "0.4",
          }),
          p("getFeatureColor", "(feature, index) => string", "Per-feature fill."),
          p("patterns", "ReactNode", "visx pattern definitions."),
          p("getFeaturePattern", "(feature, index) => string | null", "Pattern id for a feature."),
        ],
      },
      {
        name: "ChoroplethGraticule",
        description: "Latitude / longitude grid.",
        props: [
          p("stroke", "string", "Line color.", { default: "rgba(255,255,255,0.1)" }),
          p("strokeWidth", "number", "Line width.", { default: "0.5" }),
          p("step", "[number, number]", "Step [longitude, latitude] in degrees.", {
            default: "[10, 10]",
          }),
        ],
      },
      {
        name: "ChoroplethTooltip",
        description: "Pointer-following tooltip. Defaults to properties.name.",
        props: [
          p("content", "(props) => ReactNode", "Custom renderer."),
          p("getFeatureName", "(feature, index) => string", "Name getter."),
          p("getFeatureValue", "(feature, index) => number", "Value getter."),
          p("valueLabel", "string", "Label for the value row.", { default: '"Value"' }),
          p("formatValue", "(value: number) => string", "Value formatter."),
        ],
      },
    ],
    extraSections: [
      {
        id: "zoom",
        title: "Zoom",
        description:
          "zoomEnabled turns on wheel/drag. useChoroplethZoom() exposes the visx Zoom instance so you can render +/- buttons outside the SVG.",
        code: `const { zoom } = useChoroplethZoom();
<Button onClick={() => zoom?.scale({ scaleX: 1.2, scaleY: 1.2 })}>+</Button>`,
      },
      {
        id: "feature-color",
        title: "Color by value",
        description:
          "Pass getFeatureColor to bin regions onto --chart-scale-01…05. Keep stroke on --chart-background so borders stay visible.",
        code: `<ChoroplethFeatureComponent
  stroke="var(--chart-background)"
  strokeWidth={0.5}
  getFeatureColor={(feature) => {
    const value = Number(feature.properties.value ?? 0);
    if (value > 80) return "var(--chart-scale-05)";
    if (value > 40) return "var(--chart-scale-03)";
    return "var(--chart-scale-01)";
  }}
/>`,
      },
    ],
    dataFormat: `import type { FeatureCollection, Geometry } from "geojson";

interface FeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: Geometry;
    properties: { name?: string; id?: string | number; [key: string]: unknown };
  }>;
}

// Default wrapper (not Motion) uses a region list instead:
type ChoroplethRegion = { id: string; name: string; value: number };`,
    dataFormatNote:
      "Load GeoJSON yourself (for example a world FeatureCollection). Convert TopoJSON with topojson-client if that is your source format — it is not a Cronus dependency.",
    theming: SCALE_THEMING,
    dependencies: ["@visx/geo", "@visx/responsive", "@visx/zoom", "d3-geo", "motion"],
  },

  "sunburst-chart": {
    slug: "sunburst-chart",
    motionImports: [
      "SunburstChart",
      "SunburstSegment",
      "SunburstCenter",
      "SunburstLabels",
      "buildArcs",
    ],
    defaultUsage: `import { SunburstChart } from "@cronus-ui/ui";

<SunburstChart data={[{ name: "Product", value: 48, children: [{ name: "App", value: 28 }] }]} />`,
    motionUsage: `import { SunburstChart, SunburstSegment, SunburstCenter, SunburstLabels, buildArcs } from "@cronus-ui/ui/charts";

const { arcs } = buildArcs(tree);

<SunburstChart data={tree} size={360}>
  {arcs.map((arc) => <SunburstSegment index={arc.arcIndex} key={arc.id} />)}
  <SunburstCenter />
  <SunburstLabels />
</SunburstChart>`,
    components: [
      {
        name: "SunburstChart",
        description: "Hierarchical rings with drill-down focus and hover grow.",
        props: [
          p("data", "SunburstNode", "Root node with nested children.", { required: true }),
          p("size", "number", "Pixel size.", { default: "520" }),
          p("focusId", "string", "Controlled drill-down node id."),
          p("onFocusChange", "(focusId: string) => void", "Focus callback."),
          p("hoveredIndex", "number | null", "Controlled hover (arc index)."),
          p("hoverPop", "number", "Grow distance on hover.", { default: "8" }),
        ],
      },
      {
        name: "SunburstSegment",
        description: "One arc. Click drills in; hover grows the ring.",
        props: [
          p("index", "number", "Index in the arcs array.", { required: true }),
          p("color", "string", "Override color."),
          p("fill", "string", "Pattern/gradient url."),
        ],
      },
      {
        name: "SunburstCenter",
        description: "Hub disc. Click zooms out to the parent focus.",
        props: [p("className", "string", "Circle class.")],
      },
      {
        name: "SunburstBreadcrumb",
        description: "Drill-down path. useSunburstBreadcrumbItems() returns items + zoomTo.",
        props: [
          p("children", "ReactNode", "Usually mapped buttons from useSunburstBreadcrumbItems.", {
            required: true,
          }),
        ],
      },
      {
        name: "SunburstLabels",
        description: "Arc labels with a halo stroke so they stay readable on any fill.",
        props: [
          p("fontSize", "number", "Label size.", { default: "11" }),
          p("fill", "string", "Label fill.", { default: "var(--chart-label)" }),
        ],
      },
      {
        name: "SunburstHint",
        description: "Hover trail (parent › child). Accepts a render prop.",
        props: [p("children", "ReactNode | ((ctx) => ReactNode)", "Custom hint.")],
      },
      LEGEND,
    ],
    extraSections: [
      {
        id: "drill-down",
        title: "Drill-down",
        description:
          "Click a segment to focus that node. SunburstCenter zooms out. Drive focusId yourself, or use SunburstBreadcrumb with useSunburstBreadcrumbItems().",
        code: `const { items, zoomTo } = useSunburstBreadcrumbItems();

<SunburstBreadcrumb>
  {items.map((item) => (
    <button key={item.id} type="button" onClick={() => zoomTo(item.id)}>
      {item.label}
    </button>
  ))}
</SunburstBreadcrumb>`,
      },
    ],
    dataFormat: `type SunburstNode = {
  name: string;
  value?: number;
  color?: string;
  fill?: string;
  children?: SunburstNode[];
};

const tree: SunburstNode = {
  name: "All",
  children: [
    { name: "Product", children: [{ name: "App", value: 28 }, { name: "API", value: 20 }] },
    { name: "Services", value: 18 },
  ],
};`,
    dataFormatNote: "Leaves need `value`. Parents can omit it — the layout sums children.",
    theming: `${SERIES_THEMING} defaultSunburstColors cycles \`--chart-1\`…\`--chart-5\`. Nested rings fade with depth.`,
    dependencies: ["motion"],
  },

  "heatmap-chart": {
    slug: "heatmap-chart",
    motionImports: [
      "HeatmapChart",
      "HeatmapCells",
      "HeatmapXAxis",
      "HeatmapYAxis",
      "HeatmapLegend",
      "HeatmapTooltip",
    ],
    defaultUsage: `import { HeatmapChart } from "@cronus-ui/ui";

<HeatmapChart data={days} />`,
    motionUsage: `import {
  HeatmapChart,
  HeatmapCells,
  HeatmapXAxis,
  HeatmapYAxis,
  HeatmapLegend,
  HeatmapTooltip,
} from "@cronus-ui/ui/charts";

<HeatmapChart data={weeks} layout="fluid">
  <HeatmapYAxis />
  <HeatmapCells />
  <HeatmapXAxis />
  <HeatmapLegend />
  <HeatmapTooltip />
</HeatmapChart>`,
    usageNote:
      "Default is the calendar Heatmap primitive (`{ date, value }[]` days). Motion is a week-column grid (`HeatmapColumn[]`) with cells, axes, legend, and tooltip as children.",
    components: [
      {
        name: "HeatmapChart",
        description:
          "Week columns × weekday rows. `fluid` hugs a GitHub-style grid; `fill` expands to the parent.",
        props: [
          p("data", "HeatmapColumn[]", "One column per week, bins inside.", { required: true }),
          p("layout", '"fluid" | "fill"', "Sizing mode.", { default: '"fluid"' }),
          p("binSize", "number", "Fixed cell size. 0 = square cells that fit.", { default: "0" }),
          p("gap", "number", "Gap between cells in px.", { default: "2" }),
          p("levelColors", "HeatmapLevelColors", "Five colors for Less → More."),
          p(
            "levelStyles",
            "HeatmapLevelStyles",
            "Per-level color + optional pattern. Wins over levelColors.",
          ),
          p("weekStartDay", "0 | 1 | … | 6", "First row. 0 = Sunday, 1 = Monday.", {
            default: "0",
          }),
          p("status", '"loading" | "ready"', "Loading shimmer.", { default: '"ready"' }),
        ],
      },
      {
        name: "HeatmapCells",
        description: "The cell grid. Hover dims other cells; legend hover dims other levels.",
        props: [
          p("cornerRadius", "number", "Cell radius.", { default: "2" }),
          p("inactiveOpacity", "number", "Opacity of non-hovered cells.", { default: "0.3" }),
          p("rowOpacity", "number | number[]", "Per-row opacity (e.g. fade weekends)."),
          p("hideGhostCells", "boolean", "Hide out-of-range bins.", { default: "true" }),
        ],
      },
      {
        name: "HeatmapXAxis",
        description: "Month labels along the top.",
        props: [p("className", "string", "Label class.")],
      },
      {
        name: "HeatmapYAxis",
        description: "Weekday labels. Default shows Mon / Wed / Fri.",
        props: [
          p("tickFilter", '"odd" | "even" | "all"', "Which rows to label.", { default: '"odd"' }),
          p("labelFormat", '"full" | "initial"', "Mon vs M.", { default: '"full"' }),
        ],
      },
      {
        name: "HeatmapLegend",
        description: "Less → More swatches or a gradient bar. Hover a level to isolate it.",
        props: [
          p("variant", '"swatches" | "gradient"', "Legend layout.", { default: '"swatches"' }),
          p("lessLabel", "string", "Start caption.", { default: '"Less"' }),
          p("moreLabel", "string", "End caption.", { default: '"More"' }),
        ],
      },
      {
        name: "HeatmapSeparator",
        description: "Vertical gaps between column groups (every N weeks, or by quarter).",
        props: [
          p("every", "number", "Gap before every Nth column."),
          p("groupBy", '"every" | "quarter"', "Grouping mode.", { default: '"every"' }),
        ],
      },
      {
        name: "HeatmapTooltip",
        description: "Contribution tooltip with show/hide delay to avoid flicker.",
        props: [
          p("formatLabel", "(count, date) => string", "Bottom line. Default: N contribution(s)."),
          p("showDelay", "number", "Delay before first show (ms)."),
          p("hideDelay", "number", "Grace period before hide (ms)."),
        ],
      },
    ],
    extraSections: [
      {
        id: "level-styles",
        title: "Level styles",
        description:
          "levelStyles sets a color (and optional pattern) per contribution level 0–4. Patterns use --chart-scale-pattern-color.",
        code: `<HeatmapChart
  data={weeks}
  levelStyles={[
    { color: "var(--chart-scale-01)" },
    { color: "var(--chart-scale-02)" },
    { color: "var(--chart-scale-03)" },
    { color: "var(--chart-scale-04)" },
    { color: "var(--chart-scale-05)" },
  ]}
>
  <HeatmapCells />
</HeatmapChart>`,
      },
    ],
    dataFormat: `type HeatmapBin = { count: number; bin: number; date: Date };
type HeatmapColumn = { bin: number; bins: HeatmapBin[] }; // bins[0] = week start day

// Default wrapper (not Motion):
type HeatmapDay = { date: string; value: number };`,
    theming: SCALE_THEMING,
    dependencies: ["@visx/heatmap", "@visx/responsive", "@visx/scale", "motion"],
  },
};

export function getChartDocs(slug: string): ChartPageDoc | undefined {
  return CHART_DOCS[slug];
}

export function isNamedChartSlug(slug: string): boolean {
  return slug in CHART_DOCS;
}

export interface ChartTocItem {
  id: string;
  title: string;
  children?: ChartTocItem[];
}

/** TOC entries for a named chart, inserted after live examples. */
export function chartDocsTocItems(slug: string): ChartTocItem[] {
  const doc = CHART_DOCS[slug];
  if (!doc) return [];

  const extras = (doc.extraSections ?? []).map((section) => ({
    id: section.id,
    title: section.title,
  }));

  return [
    { id: "installation", title: "Installation" },
    { id: "usage", title: "Usage" },
    {
      id: "components",
      title: "Components",
      children: doc.components.map((component) => ({
        id: componentAnchor(component.name),
        title: component.name,
      })),
    },
    ...extras,
    { id: "data-format", title: "Data format" },
    { id: "theming", title: "Theming" },
    { id: "dependencies", title: "Dependencies" },
  ];
}

export function componentAnchor(name: string): string {
  return `component-${name.replace(/[A-Z]/g, (char, index) => (index === 0 ? char.toLowerCase() : `-${char.toLowerCase()}`)).replace(/^-/, "")}`;
}
