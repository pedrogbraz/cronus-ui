/** Fixed demo series — no Date.now(), so SSR and the client print the same ticks. */

export const MONEY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const AREA_SEED = [
  16200, 14800, 17100, 15900, 18100, 17600, 16800, 19200, 18500, 17400, 20100, 19400, 18800, 21100,
  20500, 19800, 21600, 20900, 22100, 21400, 20800, 22600, 21900, 23200, 22400, 21800, 23800, 22900,
  24100, 23500,
];

const COST_SEED = [
  11500, 10800, 12100, 11200, 12800, 12400, 11900, 13200, 12600, 11800, 13600, 12900, 12500, 14100,
  13400, 13000, 14500, 13800, 14900, 14200, 13700, 15200, 14600, 15600, 14800, 14300, 15900, 15100,
  16200, 15500,
];

function labelForDay(index: number): { date: string; day: string } {
  const d = new Date(Date.UTC(2026, 6, 29 + index));
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
  return { date, day };
}

export const TIMESERIES = AREA_SEED.map((revenue, index) => {
  const { date, day } = labelForDay(index);
  return { date, day, revenue, costs: COST_SEED[index] ?? 0, units: 40 + (index % 12) * 3 };
});

export const MONTHS = [
  { month: "Jan", revenue: 12000, profit: 4500, desktop: 4000, mobile: 2400 },
  { month: "Feb", revenue: 15500, profit: 5200, desktop: 5000, mobile: 3000 },
  { month: "Mar", revenue: 11000, profit: 3800, desktop: 3500, mobile: 2800 },
  { month: "Apr", revenue: 18500, profit: 7100, desktop: 4200, mobile: 3200 },
  { month: "May", revenue: 16800, profit: 5400, desktop: 3800, mobile: 2600 },
  { month: "Jun", revenue: 21200, profit: 8800, desktop: 5500, mobile: 3800 },
];

export const CANDLES = [
  { date: "Aug 3", open: 142, high: 148, low: 139, close: 146 },
  { date: "Aug 4", open: 146, high: 151, low: 144, close: 149 },
  { date: "Aug 5", open: 149, high: 152, low: 141, close: 143 },
  { date: "Aug 6", open: 143, high: 147, low: 140, close: 141 },
  { date: "Aug 7", open: 141, high: 150, low: 140, close: 148 },
  { date: "Aug 10", open: 148, high: 156, low: 147, close: 155 },
  { date: "Aug 11", open: 155, high: 158, low: 149, close: 151 },
  { date: "Aug 12", open: 151, high: 154, low: 145, close: 147 },
  { date: "Aug 13", open: 147, high: 153, low: 146, close: 152 },
  { date: "Aug 14", open: 152, high: 160, low: 151, close: 158 },
];

export const FUNNEL = [
  { stage: "Visit", value: 8400, fill: "var(--color-visit)" },
  { stage: "Signup", value: 4200, fill: "var(--color-signup)" },
  { stage: "Activate", value: 2600, fill: "var(--color-activate)" },
  { stage: "Pay", value: 1100, fill: "var(--color-pay)" },
  { stage: "Retain", value: 640, fill: "var(--color-retain)" },
];

export const SCATTER = [
  { reach: 12, conv: 4.2, channel: "Search" },
  { reach: 28, conv: 6.1, channel: "Search" },
  { reach: 41, conv: 5.4, channel: "Search" },
  { reach: 55, conv: 8.8, channel: "Search" },
  { reach: 18, conv: 9.4, channel: "Social" },
  { reach: 33, conv: 11.2, channel: "Social" },
  { reach: 47, conv: 10.1, channel: "Social" },
  { reach: 62, conv: 14.6, channel: "Social" },
];

export const SANKEY = {
  nodes: [
    { name: "Direct" },
    { name: "Ads" },
    { name: "Site" },
    { name: "App" },
    { name: "Paid" },
    { name: "Churn" },
  ],
  links: [
    { source: 0, target: 2, value: 48 },
    { source: 1, target: 2, value: 32 },
    { source: 2, target: 3, value: 40 },
    { source: 2, target: 4, value: 24 },
    { source: 3, target: 4, value: 28 },
    { source: 3, target: 5, value: 12 },
    { source: 4, target: 5, value: 8 },
  ],
};

export const SANKEY_FLOW = {
  nodes: [
    { name: "Organic Search", category: "source" as const },
    { name: "Paid Search", category: "source" as const },
    { name: "Paid Social", category: "source" as const },
    { name: "Email", category: "source" as const },
    { name: "Referral", category: "source" as const },
    { name: "Direct", category: "source" as const },
    { name: "Blog", category: "landing" as const },
    { name: "Pricing", category: "landing" as const },
    { name: "Product", category: "landing" as const },
    { name: "Docs", category: "landing" as const },
    { name: "Homepage", category: "landing" as const },
    { name: "Converted", category: "outcome" as const },
    { name: "Engaged", category: "outcome" as const },
    { name: "Bounced", category: "outcome" as const },
  ],
  links: [
    { source: 0, target: 6, value: 4200 },
    { source: 0, target: 9, value: 2800 },
    { source: 0, target: 7, value: 1500 },
    { source: 1, target: 7, value: 3100 },
    { source: 1, target: 8, value: 2200 },
    { source: 1, target: 6, value: 800 },
    { source: 2, target: 6, value: 2800 },
    { source: 2, target: 10, value: 1900 },
    { source: 2, target: 8, value: 600 },
    { source: 3, target: 7, value: 2100 },
    { source: 3, target: 8, value: 1400 },
    { source: 3, target: 6, value: 900 },
    { source: 4, target: 6, value: 1800 },
    { source: 4, target: 9, value: 1200 },
    { source: 4, target: 7, value: 700 },
    { source: 5, target: 10, value: 3500 },
    { source: 5, target: 7, value: 1800 },
    { source: 5, target: 8, value: 1100 },
    { source: 6, target: 11, value: 2100 },
    { source: 6, target: 12, value: 4800 },
    { source: 6, target: 13, value: 3600 },
    { source: 7, target: 11, value: 4500 },
    { source: 7, target: 12, value: 3200 },
    { source: 7, target: 13, value: 1500 },
    { source: 8, target: 11, value: 2800 },
    { source: 8, target: 12, value: 1900 },
    { source: 8, target: 13, value: 600 },
    { source: 9, target: 11, value: 800 },
    { source: 9, target: 12, value: 2400 },
    { source: 9, target: 13, value: 800 },
    { source: 10, target: 11, value: 1200 },
    { source: 10, target: 12, value: 1800 },
    { source: 10, target: 13, value: 2400 },
  ],
};

export const PL_LINE = [
  { month: "Jan", pnl: 420 },
  { month: "Feb", pnl: -180 },
  { month: "Mar", pnl: 260 },
  { month: "Apr", pnl: 510 },
  { month: "May", pnl: -90 },
  { month: "Jun", pnl: 340 },
  { month: "Jul", pnl: 680 },
  { month: "Aug", pnl: -220 },
];

export const LIVE_SEED = TIMESERIES.slice(0, 18).map((row, index) => ({
  tick: index + 1,
  value: Math.round(row.revenue / 100),
}));

export const RADAR_METRICS_TABLE = [
  { metric: "Speed", current: 80, target: 90 },
  { metric: "Reliability", current: 70, target: 85 },
  { metric: "Comfort", current: 60, target: 75 },
  { metric: "Safety", current: 90, target: 95 },
  { metric: "Efficiency", current: 75, target: 80 },
];

export const HEATMAP_DAYS = Array.from({ length: 84 }, (_, index) => {
  const d = new Date(Date.UTC(2026, 5, 1 + index));
  const date = d.toISOString().slice(0, 10);
  const value = (index * 7 + 3) % 12;
  return { date, value };
});

/** visx time scale needs Date objects — fixed UTC so SSR matches the client. */
export const AREA_DATES = AREA_SEED.map((desktop, index) => ({
  date: new Date(Date.UTC(2024, 0, 1 + index, 12, 0, 0)),
  desktop,
  costs: COST_SEED[index] ?? 0,
  revenue: desktop,
}));

export const LINE_DATES = AREA_SEED.map((users, index) => ({
  date: new Date(Date.UTC(2024, 0, 1 + index, 12, 0, 0)),
  users: Math.round(users / 12),
  pageviews: Math.round((COST_SEED[index] ?? 0) / 4),
  costs: COST_SEED[index] ?? 0,
}));

/** 30 UTC days in January — dense enough for bars + a smooth line/area. */
const COMPOSED_START = Date.UTC(2024, 0, 1, 12, 0, 0);
const COMPOSED_DAY = 86_400_000;

export const COMPOSED_DATES = Array.from({ length: 30 }, (_, index) => {
  const t = index / 29;
  const swing = Math.sin(t * Math.PI * 2);
  return {
    date: new Date(COMPOSED_START + index * COMPOSED_DAY),
    units: Math.round(46 + 14 * Math.sin(t * Math.PI * 2 + 0.35) + 6 * Math.sin(index / 14)),
    revenue: Math.round(96 + 11 * swing + 5 * Math.sin(index / 17) + index * 0.55),
    runRate: Math.round(82 + 9 * Math.sin(t * Math.PI * 2 + 1.9) + 5 * Math.cos(index / 16)),
  };
});

export const OHLC_DATES = [
  { date: new Date(Date.UTC(2024, 0, 1, 12, 0, 0)), open: 100, high: 108, low: 96, close: 104 },
  { date: new Date(Date.UTC(2024, 0, 2, 12, 0, 0)), open: 104, high: 112, low: 101, close: 109 },
  { date: new Date(Date.UTC(2024, 0, 3, 12, 0, 0)), open: 109, high: 115, low: 105, close: 108 },
  { date: new Date(Date.UTC(2024, 0, 4, 12, 0, 0)), open: 108, high: 114, low: 102, close: 110 },
  { date: new Date(Date.UTC(2024, 0, 5, 12, 0, 0)), open: 110, high: 118, low: 108, close: 115 },
  { date: new Date(Date.UTC(2024, 0, 6, 12, 0, 0)), open: 115, high: 120, low: 111, close: 113 },
  { date: new Date(Date.UTC(2024, 0, 7, 12, 0, 0)), open: 113, high: 119, low: 110, close: 117 },
  { date: new Date(Date.UTC(2024, 0, 8, 12, 0, 0)), open: 117, high: 124, low: 115, close: 121 },
  { date: new Date(Date.UTC(2024, 0, 9, 12, 0, 0)), open: 121, high: 126, low: 118, close: 120 },
  { date: new Date(Date.UTC(2024, 0, 10, 12, 0, 0)), open: 120, high: 128, low: 117, close: 125 },
];

export const SCATTER_DATES = Array.from({ length: 24 }, (_, i) => ({
  date: new Date(2023, i, 1),
  sessions: Math.floor(140 + Math.sin(i / 3) * 90 + ((i * 11) % 40)),
  conversions: Math.floor(70 + Math.cos(i / 2.5) * 55 + ((i * 7) % 35)),
}));

export const PNL_DATES = [
  { date: new Date("2024-01-01T00:00:00.000Z"), pnl: 420 },
  { date: new Date("2024-01-05T00:00:00.000Z"), pnl: 180 },
  { date: new Date("2024-01-10T00:00:00.000Z"), pnl: -240 },
  { date: new Date("2024-01-15T00:00:00.000Z"), pnl: -90 },
  { date: new Date("2024-01-20T00:00:00.000Z"), pnl: 310 },
  { date: new Date("2024-01-25T00:00:00.000Z"), pnl: 520 },
];

const LIVE_T0 = Date.UTC(2026, 7, 1, 12, 0, 0) / 1000;
export const LIVE_STREAM = Array.from({ length: 24 }, (_, i) => ({
  time: LIVE_T0 + i,
  value: 50 + Math.sin(i / 3) * 20,
}));

export const PIE_TRAFFIC = [
  { label: "Direct", value: 320 },
  { label: "Organic", value: 280 },
  { label: "Referral", value: 190 },
  { label: "Social", value: 140 },
];

export const RING_CHANNELS = [
  { label: "Email", value: 42, maxValue: 100 },
  { label: "Social", value: 28, maxValue: 100 },
  { label: "Direct", value: 18, maxValue: 100 },
  { label: "Other", value: 12, maxValue: 100 },
];

export const RADAR_METRICS = [
  { key: "speed", label: "Speed" },
  { key: "reliability", label: "Reliability" },
  { key: "comfort", label: "Comfort" },
  { key: "safety", label: "Safety" },
  { key: "efficiency", label: "Efficiency" },
];

export const RADAR_ROWS = [
  {
    label: "Current",
    values: { speed: 80, reliability: 70, comfort: 60, safety: 90, efficiency: 75 },
  },
  {
    label: "Target",
    values: { speed: 90, reliability: 85, comfort: 75, safety: 95, efficiency: 80 },
  },
];

export const FUNNEL_STAGES = [
  { label: "Visitors", value: 12400, displayValue: "12.4k" },
  { label: "Leads", value: 6800, displayValue: "6.8k" },
  { label: "Qualified", value: 3200, displayValue: "3.2k" },
  { label: "Proposals", value: 1500, displayValue: "1.5k" },
  { label: "Closed", value: 620, displayValue: "620" },
];

export const SUNBURST_TREE = {
  name: "Revenue",
  children: [
    {
      name: "Product",
      children: [
        { name: "Enterprise", value: 198 },
        { name: "Pro", value: 145 },
        { name: "Starter", value: 95 },
      ],
    },
    {
      name: "Services",
      children: [
        { name: "Consulting", value: 160 },
        { name: "Support", value: 90 },
        { name: "Training", value: 55 },
      ],
    },
    {
      name: "Partners",
      children: [
        { name: "Referrals", value: 120 },
        { name: "Affiliates", value: 75 },
      ],
    },
  ],
};

export const HEATMAP_WEEKS = Array.from({ length: 53 }, (_, week) => ({
  bin: week,
  bins: Array.from({ length: 7 }, (_, day) => {
    const date = new Date(Date.UTC(2024, 0, 1 + week * 7 + day, 12, 0, 0));
    const count = (week * 3 + day * 5) % 5;
    return { bin: day, count, date };
  }),
}));
