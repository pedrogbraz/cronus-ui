"use client";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Metric,
  MetricDelta,
  MetricValue,
} from "@kronus-ui/ui";
import { ArrowRight } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { LiftCard } from "./lift-card";

/**
 * The three recharts-backed cards from the `/create` preview, isolated into a
 * single client-only chunk. `preview-dashboard.tsx` pulls each one in through
 * `next/dynamic` (`ssr: false`), so recharts no longer lands in `/create`'s
 * first-load JS — it streams in after hydration behind aspect-matched skeletons.
 * The card markup and chart config are byte-identical to the originals, so the
 * rendered visual is unchanged.
 */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/* Shared surface — mirrors the dashboard cards (soft hairline border, raised
 * background, fluid hover lift). Token-driven so it re-themes live. The lift is
 * a `motion/react` spring on the {@link LiftCard} wrapper so it glides and
 * settles cleanly; only the border + shadow change stays CSS (`hover:`). */
const surfaceCard =
  "rounded-2xl border-border-soft bg-surface-raised shadow-sm transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border hover:shadow-md";

/* 1. Contribution / activity chart */

const activityData = [
  { month: "Jan", contributions: 1840 },
  { month: "Feb", contributions: 2210 },
  { month: "Mar", contributions: 1960 },
  { month: "Apr", contributions: 2680 },
  { month: "May", contributions: 3120 },
  { month: "Jun", contributions: 3480 },
];

const activityConfig = {
  contributions: { label: "Contributions", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

export function ActivityCard() {
  return (
    <LiftCard>
      <Card className={surfaceCard}>
        <CardHeader>
          <CardTitle className="font-display text-base">Contribution activity</CardTitle>
          <CardDescription>Deposits across the last 6 months</CardDescription>
          <CardAction>
            <MetricDelta trend="up">+18.4%</MetricDelta>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChartContainer config={activityConfig} className="aspect-[16/9] w-full">
            <BarChart accessibilityLayer data={activityData} margin={{ left: 4, right: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="contributions" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="border-t border-border-soft pt-5">
          <Button variant="outline" className="w-full">
            View full report
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>
    </LiftCard>
  );
}

/* 8a. Revenue area chart */

const revenueData = [
  { day: "Mon", revenue: 4200 },
  { day: "Tue", revenue: 5100 },
  { day: "Wed", revenue: 4800 },
  { day: "Thu", revenue: 6300 },
  { day: "Fri", revenue: 7400 },
  { day: "Sat", revenue: 6900 },
  { day: "Sun", revenue: 8100 },
];

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

export function RevenueCard() {
  return (
    <LiftCard>
      <Card className={surfaceCard}>
        <CardHeader>
          <CardTitle className="font-display text-base">Weekly revenue</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
          <CardAction>
            <Metric className="items-end gap-0">
              <MetricValue className="text-xl">{usd.format(42800)}</MetricValue>
            </Metric>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="aspect-[16/7] w-full">
            <AreaChart accessibilityLayer data={revenueData} margin={{ left: 4, right: 4 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </LiftCard>
  );
}

/* 8b. Spending breakdown donut */

const spendData = [
  { category: "Payroll", value: 42, fill: "var(--color-chart-1)" },
  { category: "Software", value: 24, fill: "var(--color-chart-2)" },
  { category: "Marketing", value: 18, fill: "var(--color-chart-3)" },
  { category: "Travel", value: 16, fill: "var(--color-chart-4)" },
];

const spendConfig = {
  value: { label: "Share" },
  Payroll: { label: "Payroll", color: "var(--color-chart-1)" },
  Software: { label: "Software", color: "var(--color-chart-2)" },
  Marketing: { label: "Marketing", color: "var(--color-chart-3)" },
  Travel: { label: "Travel", color: "var(--color-chart-4)" },
} satisfies ChartConfig;

export function SpendingCard() {
  return (
    <LiftCard>
      <Card className={surfaceCard}>
        <CardHeader>
          <CardTitle className="font-display text-base">Spending breakdown</CardTitle>
          <CardDescription>This month by category</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 sm:flex-row">
          <ChartContainer config={spendConfig} className="aspect-square h-40 w-40 shrink-0">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent nameKey="category" hideLabel />}
              />
              <Pie
                data={spendData}
                dataKey="value"
                nameKey="category"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
                strokeWidth={2}
              >
                {spendData.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={entry.fill}
                    aria-hidden="true"
                    role="presentation"
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <ul className="flex w-full flex-col gap-1">
            {spendData.map((entry) => (
              <li
                key={entry.category}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-surface-inset/60"
              >
                <span
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: entry.fill }}
                  aria-hidden="true"
                />
                <span className="flex-1 text-fg-secondary">{entry.category}</span>
                <span className="font-medium text-fg tabular-nums">{entry.value}%</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </LiftCard>
  );
}
