"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Metric,
  MetricLabel,
  MetricValue,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Textarea,
} from "@cronus-ui/ui";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Briefcase,
  Coffee,
  CreditCard,
  PiggyBank,
  Plane,
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LiftCard } from "./lift-card";

/* ──────────────────────────────────────────────────────────────────────────
 * Lazy chart cards
 *
 * The three recharts-backed cards live in their own client-only chunk and are
 * pulled in via `next/dynamic` (`ssr: false`). recharts is heavy and purely
 * client-visual, so this keeps it out of `/create`'s first-load JS; the cards
 * stream in after hydration behind aspect-matched skeletons (no layout shift,
 * identical visual once mounted).
 * ────────────────────────────────────────────────────────────────────────── */

function ChartCardSkeleton({ aspect }: { aspect: string }) {
  return (
    <div
      className={`rounded-2xl border border-border-soft bg-surface-raised p-6 shadow-sm ${liquid}`}
      aria-hidden="true"
    >
      <div className="mb-1.5 h-5 w-40 animate-pulse rounded-md bg-surface-inset" />
      <div className="mb-5 h-3.5 w-52 max-w-full animate-pulse rounded bg-surface-inset/70" />
      <div className={`${aspect} w-full animate-pulse rounded-xl bg-surface-inset/60`} />
    </div>
  );
}

const ActivityCard = dynamic(
  () => import("./preview-dashboard-charts").then((m) => m.ActivityCard),
  { ssr: false, loading: () => <ChartCardSkeleton aspect="aspect-[16/9]" /> },
);

const RevenueCard = dynamic(() => import("./preview-dashboard-charts").then((m) => m.RevenueCard), {
  ssr: false,
  loading: () => <ChartCardSkeleton aspect="aspect-[16/7]" />,
});

const SpendingCard = dynamic(
  () => import("./preview-dashboard-charts").then((m) => m.SpendingCard),
  { ssr: false, loading: () => <ChartCardSkeleton aspect="aspect-[16/7]" /> },
);

/* ──────────────────────────────────────────────────────────────────────────
 * Shared helpers
 * ────────────────────────────────────────────────────────────────────────── */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/* ──────────────────────────────────────────────────────────────────────────
 * Shared surface — every dashboard card sits on the same premium surface as the
 * redesigned controls: a soft hairline border, raised background, and a fluid
 * lift on hover. Token-driven so it re-themes (radius/border/shadow) live.
 *
 * The hover LIFT is driven by a `motion/react` spring (see {@link LiftCard}) so
 * it glides up with natural momentum and settles cleanly instead of the dry,
 * fixed-duration CSS ease it used to use. The border + shadow change stay CSS
 * (`hover:`) — those animate fine and the lift spring lives on the wrapper, so
 * CSS and motion never fight over the transform.
 * ────────────────────────────────────────────────────────────────────────── */

const surfaceCard =
  "rounded-2xl border-border-soft bg-surface-raised shadow-sm transition-[background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border hover:shadow-lg motion-reduce:transition-none";

/**
 * The studio re-themes the live tokens on every control change; preview
 * surfaces tween their colors (300ms, house ease) so re-theming feels liquid
 * instead of snapping. Colors only — hover lift/shadow keep their own motion.
 */
const liquid =
  "transition-colors duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";

/* ──────────────────────────────────────────────────────────────────────────
 * 0. Brand spotlight — a large, brand-filled hero so swapping the brand color
 *    reads instantly across the preview (primary gradient surface + accent
 *    chips + brand-tinted CTAs).
 * ────────────────────────────────────────────────────────────────────────── */

function SpotlightCard() {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-primary-strong text-white">
      <div
        className="pointer-events-none absolute -top-20 -right-16 -z-10 size-56 rounded-full bg-white/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-12 -z-10 size-52 rounded-full bg-black/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background:radial-gradient(120%_140%_at_85%_-10%,rgba(255,255,255,0.18),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-7 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2.5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-white/20 backdrop-blur-sm">
              <Sparkles className="size-3" aria-hidden="true" />
              Cronus balance
            </span>
            <span className="font-display text-4xl font-medium leading-none tracking-[-0.025em] tabular-nums sm:text-5xl sm:tracking-[-0.03em]">
              {usd.format(128450)}
            </span>
            <span className="text-sm text-white/70">Available across 3 accounts</span>
          </div>
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/20 backdrop-blur-sm">
            <Wallet className="size-5" aria-hidden="true" />
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[color-mix(in_oklch,var(--cronus-primary),black_35%)] shadow-sm transition-[transform,opacity] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-90 active:scale-[0.98]"
          >
            <Send className="size-4" aria-hidden="true" />
            Send payout
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-[background-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-white/20 active:scale-[0.98]"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add funds
          </button>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-sm font-medium text-white/90 ring-1 ring-inset ring-white/15">
            <TrendingUp className="size-4" aria-hidden="true" />
            +12.4%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Contribution / activity chart → lazy (preview-dashboard-charts.tsx)
 * 2. Payout threshold
 * ────────────────────────────────────────────────────────────────────────── */

const PAYOUT_MIN = 50;
const PAYOUT_MAX = 5000;

function PayoutCard() {
  const [currency, setCurrency] = useState<string | null>("usd");
  const [amount, setAmount] = useState<number>(1250);

  return (
    <LiftCard>
      <Card className={surfaceCard}>
        <CardHeader>
          <CardTitle className="font-display text-base">Payout threshold</CardTitle>
          <CardDescription>Auto-withdraw once your balance clears this amount.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="payout-currency">Preferred currency</Label>
            <Select value={currency ?? ""} onValueChange={setCurrency}>
              <SelectTrigger id="payout-currency" className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD — US Dollar</SelectItem>
                <SelectItem value="eur">EUR — Euro</SelectItem>
                <SelectItem value="brl">BRL — Brazilian Real</SelectItem>
                <SelectItem value="gbp">GBP — British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* The slider itself carries the feedback while it is engaged, so the
              live value stays achromatic — no decorative tint on the amount. */}
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <Label htmlFor="payout-amount">Trigger at</Label>
              <Metric className="items-end gap-0">
                <MetricValue className="text-2xl tracking-[-0.02em]">
                  {usd.format(amount)}
                </MetricValue>
              </Metric>
            </div>
            <Slider
              id="payout-amount"
              min={PAYOUT_MIN}
              max={PAYOUT_MAX}
              step={50}
              value={[amount]}
              onValueChange={(v) => setAmount(v[0] ?? PAYOUT_MIN)}
              aria-label="Payout threshold amount"
            />
            <div className="flex justify-between text-xs text-fg-tertiary tabular-nums">
              <span>{usd.format(PAYOUT_MIN)}</span>
              <span>{usd.format(PAYOUT_MAX)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="payout-notes">Notes</Label>
            <Textarea
              id="payout-notes"
              rows={2}
              placeholder="Add an internal note for your finance team…"
              defaultValue="Route to operating account ending 4821."
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-border-soft pt-5">
          <Button variant="primary" className="w-full">
            Save threshold
          </Button>
        </CardFooter>
      </Card>
    </LiftCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Savings targets
 * ────────────────────────────────────────────────────────────────────────── */

interface Goal {
  id: string;
  label: string;
  saved: number;
  target: number;
  icon: typeof PiggyBank;
}

const goals: Goal[] = [
  { id: "g1", label: "Emergency fund", saved: 8400, target: 12000, icon: PiggyBank },
  { id: "g2", label: "Office relocation", saved: 21300, target: 45000, icon: Briefcase },
];

function SavingsCard() {
  return (
    <LiftCard>
      <Card className={surfaceCard}>
        <CardHeader>
          <CardTitle className="font-display text-base">Savings targets</CardTitle>
          <CardDescription>Progress toward your quarterly goals</CardDescription>
          <CardAction>
            <Badge variant="primary" className="gap-1">
              <Plus className="size-3" aria-hidden="true" />
              New goal
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {goals.map((goal) => {
            const pct = Math.round((goal.saved / goal.target) * 100);
            const Icon = goal.icon;
            return (
              <div
                key={goal.id}
                className={`flex flex-col gap-3 border-t border-border pt-5 ${liquid}`}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-surface-overlay text-fg-secondary ring-1 ring-inset ring-border-soft">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-fg">{goal.label}</span>
                    <span className="text-xs text-fg-tertiary">of {usd.format(goal.target)}</span>
                  </div>
                  <Metric className="items-end gap-0">
                    <MetricValue className="text-xl tracking-[-0.02em]">
                      {usd.format(goal.saved)}
                    </MetricValue>
                  </Metric>
                </div>
                <Progress value={pct} aria-label={`${goal.label} progress`} />
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-success">{pct}% achieved</span>
                  <span className="text-fg-tertiary tabular-nums">
                    {usd.format(goal.target - goal.saved)} to go
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </LiftCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Buy investment
 * ────────────────────────────────────────────────────────────────────────── */

const SHARE_PRICE = 184.62;

function InvestCard() {
  const [amount, setAmount] = useState<string>("2500");
  const [orderType, setOrderType] = useState<string | null>("market");

  const estimatedShares = useMemo(() => {
    const value = Number.parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0) {
      return 0;
    }
    return value / SHARE_PRICE;
  }, [amount]);

  return (
    <LiftCard>
      <Card className={surfaceCard}>
        <CardHeader>
          <CardTitle className="font-display text-base">Buy investment</CardTitle>
          <CardDescription>Cronus Growth Index — CGX</CardDescription>
          <CardAction>
            <Badge variant="success" className="gap-1">
              <TrendingUp className="size-3" aria-hidden="true" />
              +2.4%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invest-amount">Amount</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-fg-tertiary">
                $
              </span>
              <Input
                id="invest-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 tabular-nums"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="invest-order">Order type</Label>
            <Select value={orderType ?? ""} onValueChange={setOrderType}>
              <SelectTrigger id="invest-order" className="w-full">
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market order</SelectItem>
                <SelectItem value="limit">Limit order</SelectItem>
                <SelectItem value="recurring">Recurring buy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-fg-secondary">
            Executes immediately at the best available price. Settlement in 2 business days.
          </p>

          <div
            className={`flex items-center justify-between border-t border-border pt-4 ${liquid}`}
          >
            <span className="text-sm text-fg-secondary">Estimated shares</span>
            <span className="font-display text-sm font-semibold text-fg tabular-nums">
              {estimatedShares.toFixed(4)} @ {usdCents.format(SHARE_PRICE)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border-soft pt-5">
          <Button variant="primary" className="w-full">
            Review order
          </Button>
        </CardFooter>
      </Card>
    </LiftCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 5. Recent transactions
 * ────────────────────────────────────────────────────────────────────────── */

interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  icon: typeof Coffee;
}

const transactions: Transaction[] = [
  {
    id: "t1",
    name: "Stripe payout",
    category: "Income",
    date: "Jun 21",
    amount: 4820.0,
    icon: Banknote,
  },
  {
    id: "t2",
    name: "Figma",
    category: "Software",
    date: "Jun 20",
    amount: -45.0,
    icon: CreditCard,
  },
  {
    id: "t3",
    name: "Blue Bottle Coffee",
    category: "Meals",
    date: "Jun 19",
    amount: -18.4,
    icon: Coffee,
  },
  {
    id: "t4",
    name: "Delta Air Lines",
    category: "Travel",
    date: "Jun 18",
    amount: -612.3,
    icon: Plane,
  },
  {
    id: "t5",
    name: "Acme Corp invoice",
    category: "Income",
    date: "Jun 17",
    amount: 2150.0,
    icon: ShoppingBag,
  },
];

function TransactionsCard() {
  return (
    <LiftCard>
      <Card className={`gap-0 py-0 ${surfaceCard}`}>
        <CardHeader className="px-6 py-5">
          <CardTitle className="font-display text-base">Recent transactions</CardTitle>
          <CardDescription>Across all connected accounts</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </CardAction>
        </CardHeader>
        <Separator className="bg-border-soft" />
        <ul className="flex flex-col p-1.5">
          {transactions.map((tx) => {
            const income = tx.amount > 0;
            const Icon = tx.icon;
            return (
              <li
                key={tx.id}
                className="flex items-center gap-3.5 rounded-xl px-4 py-3 transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-surface-inset/60"
              >
                <span
                  className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full ${
                    income
                      ? "bg-success/10 text-success"
                      : "bg-surface-overlay text-fg-secondary ring-1 ring-inset ring-border-soft"
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-fg">{tx.name}</span>
                  <span className="truncate text-xs text-fg-tertiary">{tx.category}</span>
                </div>
                <span className="text-xs text-fg-tertiary tabular-nums">{tx.date}</span>
                <span
                  className={`flex items-center gap-0.5 text-sm font-semibold tabular-nums ${
                    income ? "text-success" : "text-error"
                  }`}
                >
                  {income ? (
                    <ArrowDownLeft className="size-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  )}
                  {income ? "+" : "−"}
                  {usdCents.format(Math.abs(tx.amount))}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
    </LiftCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 6. Stat row
 * ────────────────────────────────────────────────────────────────────────── */

const stats = [
  {
    label: "Net revenue",
    value: "$48,290",
    delta: "+12.4%",
    trend: "up" as const,
    icon: Wallet,
  },
  {
    label: "Active users",
    value: "9,184",
    delta: "+5.2%",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "Churn rate",
    value: "1.92%",
    delta: "-0.3%",
    trend: "down" as const,
    icon: TrendingDown,
  },
];

function StatRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, delta, trend, icon: Icon }) => (
        <LiftCard key={label} className="h-full">
          <Card className={`group h-full gap-0 py-0 ${surfaceCard}`}>
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-surface-overlay text-fg-secondary ring-1 ring-inset ring-border-soft transition-colors duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:text-fg">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    trend === "down"
                      ? "bg-error/10 text-error-strong"
                      : "bg-success/10 text-success-strong"
                  }`}
                >
                  {trend === "down" ? (
                    <TrendingDown className="size-3.5" aria-hidden="true" />
                  ) : (
                    <TrendingUp className="size-3.5" aria-hidden="true" />
                  )}
                  {delta}
                </span>
              </div>
              <Metric className="gap-1.5">
                <MetricLabel className="normal-case tracking-normal text-fg-tertiary">
                  {label}
                </MetricLabel>
                <MetricValue className="text-[1.75rem] leading-none tracking-[-0.025em]">
                  {value}
                </MetricValue>
              </Metric>
            </CardContent>
          </Card>
        </LiftCard>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 7. Team / recent activity
 * ────────────────────────────────────────────────────────────────────────── */

interface Member {
  id: string;
  name: string;
  handle: string;
  role: string;
  roleVariant: "primary" | "info" | "secondary";
  avatar?: string;
  initials: string;
}

const members: Member[] = [
  {
    id: "m1",
    name: "Mara Castillo",
    handle: "@mara",
    role: "Owner",
    roleVariant: "primary",
    avatar: "https://i.pravatar.cc/96?img=12",
    initials: "MC",
  },
  {
    id: "m2",
    name: "Devon Lane",
    handle: "@devon",
    role: "Admin",
    roleVariant: "info",
    avatar: "https://i.pravatar.cc/96?img=33",
    initials: "DL",
  },
  {
    id: "m3",
    name: "Priya Sharma",
    handle: "@priya",
    role: "Member",
    roleVariant: "secondary",
    initials: "PS",
  },
  {
    id: "m4",
    name: "Tobias Funke",
    handle: "@tobias",
    role: "Member",
    roleVariant: "secondary",
    avatar: "https://i.pravatar.cc/96?img=68",
    initials: "TF",
  },
];

function TeamCard() {
  return (
    <LiftCard>
      <Card className={`gap-0 py-0 ${surfaceCard}`}>
        <CardHeader className="px-6 py-5">
          <CardTitle className="font-display text-base">Team</CardTitle>
          <CardDescription>4 people in this workspace</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm">
              <Users className="size-4" aria-hidden="true" />
              Invite
            </Button>
          </CardAction>
        </CardHeader>
        <Separator className="bg-border-soft" />
        <ul className="flex flex-col p-1.5">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3 transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-surface-inset/60"
            >
              <Avatar className="size-9 ring-1 ring-inset ring-border-soft">
                {member.avatar ? <AvatarImage src={member.avatar} alt={member.name} /> : null}
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-fg">{member.name}</span>
                <span className="truncate text-xs text-fg-tertiary">{member.handle}</span>
              </div>
              <Badge variant={member.roleVariant}>{member.role}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </LiftCard>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 8a. Revenue area chart  → lazy (preview-dashboard-charts.tsx)
 * 8b. Spending breakdown  → lazy (preview-dashboard-charts.tsx)
 * ────────────────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────────────────
 * Dashboard
 * ────────────────────────────────────────────────────────────────────────── */

export function PreviewDashboard() {
  return (
    <div className="flex w-full flex-col gap-5">
      <SpotlightCard />
      <StatRow />
      <div className="w-full columns-1 gap-5 2xl:columns-2 [&>*]:mb-5 [&>*]:break-inside-avoid">
        <ActivityCard />
        <PayoutCard />
        <RevenueCard />
        <SavingsCard />
        <TransactionsCard />
        <InvestCard />
        <SpendingCard />
        <TeamCard />
      </div>
    </div>
  );
}
