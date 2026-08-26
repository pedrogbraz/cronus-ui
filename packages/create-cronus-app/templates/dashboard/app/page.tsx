import { Badge } from "@cronus-ui/ui/badge";
import { Card, CardContent } from "@cronus-ui/ui/card";
import { Metric, MetricDelta, MetricLabel, MetricValue } from "@cronus-ui/ui/metric";
import { Activity, DollarSign, TrendingDown, Users } from "lucide-react";
import { OrdersTable } from "../components/orders-table";
import { RevenueChart } from "../components/revenue-chart";

const KPIS = [
  {
    label: "Total revenue",
    value: "$84,210",
    delta: "+14.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Active users",
    value: "12,840",
    delta: "+6.8%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Conversion",
    value: "4.21%",
    delta: "+0.9%",
    trend: "up",
    icon: Activity,
  },
  {
    label: "Churn",
    value: "1.64%",
    delta: "-0.4%",
    trend: "down",
    icon: TrendingDown,
  },
] as const;

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">Overview</h1>
          <p className="text-sm text-fg-secondary">
            Performance across your workspace, last 7 months.
          </p>
        </div>
        <Badge variant="success">Live</Badge>
      </header>

      {/* KPI grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-4">
        {KPIS.map(({ label, value, delta, trend, icon: Icon }) => (
          <Card key={label} className="gap-4 py-5">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <MetricDelta trend={trend}>{delta}</MetricDelta>
              </div>
              <Metric className="gap-1.5">
                <MetricLabel>{label}</MetricLabel>
                <MetricValue className="text-3xl">{value}</MetricValue>
              </Metric>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + orders */}
      <RevenueChart />
      <OrdersTable />
    </div>
  );
}
