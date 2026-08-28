"use client";

import { Avatar, AvatarFallback } from "@cronus-ui/ui/avatar";
import { Badge } from "@cronus-ui/ui/badge";
import { Button } from "@cronus-ui/ui/button";
import { cn } from "@cronus-ui/ui/cn";
import { Input } from "@cronus-ui/ui/input";
import { Label } from "@cronus-ui/ui/label";
import { Metric, MetricDelta, MetricLabel, MetricValue } from "@cronus-ui/ui/metric";
import { Switch } from "@cronus-ui/ui/switch";
import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Catalog card stages — the same 16/10 scaled-screenshot treatment as
 * TemplateThumb. Scenes are composed at a desktop canvas with real Cronus
 * primitives (and token-painted charts/tables), then scaled to the card so
 * /components and /blocks read as product surfaces, not empty dotted tiles.
 * Intersection-observed so the galleries do not mount every miniature at once.
 */

const FRAME_WIDTH = 800;
const FRAME_HEIGHT = 500;

function ScaledStage({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([item]) => {
        if (item?.isIntersecting) setInView(true);
      },
      { rootMargin: "280px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const width = node.clientWidth;
      if (width > 0) setScale(width / FRAME_WIDTH);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      data-slot="catalog-thumb"
      aria-hidden="true"
      className="relative aspect-[16/10] overflow-hidden bg-surface-base"
    >
      <div className="absolute inset-0 bg-[radial-gradient(var(--cronus-border)_1px,transparent_1px)] opacity-40 [background-size:16px_16px]" />
      {inView ? (
        <div
          inert
          className="pointer-events-none absolute left-0 top-0 flex origin-top-left select-none"
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: `scale(${scale ?? 0.3})`,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function Fill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-surface-base",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Mark({ className }: { className?: string }) {
  return <span className={cn("inline-block size-6 rounded-md bg-primary", className)} />;
}

function Glow() {
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-24 h-56 bg-gradient-primary opacity-20 blur-3xl" />
  );
}

function Dots() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(var(--cronus-border)_1px,transparent_1px)] opacity-30 [background-size:22px_22px]" />
  );
}

function Avatars({ extra }: { extra?: string }) {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {["AK", "MR", "JD", "SL"].map((initials) => (
          <Avatar key={initials} className="size-8 border-2 border-surface-base">
            <AvatarFallback className="bg-surface-overlay text-[10px] text-fg-secondary">
              {initials}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {extra ? <span className="ms-3 text-sm text-fg-tertiary">{extra}</span> : null}
    </div>
  );
}

function MarketingNav({ cta = "Sign in" }: { cta?: string }) {
  return (
    <div className="relative z-[1] flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2">
        <Mark />
        <span className="text-sm font-medium text-fg">Cronus</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-fg-secondary">
        <span>Product</span>
        <span>Pricing</span>
        <span>Docs</span>
      </div>
      <Button size="sm" tabIndex={-1} type="button">
        {cta}
      </Button>
    </div>
  );
}

function AppShell({ children, active = "Overview" }: { children: ReactNode; active?: string }) {
  const items = ["Overview", "Revenue", "Customers", "Settings"];
  return (
    <Fill className="flex-row">
      <aside className="flex w-44 shrink-0 flex-col gap-0.5 border-e border-border bg-surface-raised p-3">
        <div className="mb-3 flex items-center gap-2 px-1 py-1">
          <Mark className="size-5" />
          <span className="text-sm font-medium text-fg">Cronus</span>
        </div>
        {items.map((item) => (
          <div
            key={item}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm",
              item === active ? "bg-surface-overlay text-fg" : "text-fg-secondary",
            )}
          >
            {item}
          </div>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col bg-surface-base">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-5">
          <span className="text-sm font-medium text-fg">{active}</span>
          <Avatar className="size-7">
            <AvatarFallback className="bg-surface-overlay text-[10px]">AK</AvatarFallback>
          </Avatar>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden p-5">{children}</div>
      </div>
    </Fill>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Input readOnly tabIndex={-1} placeholder={placeholder} type={type} />
    </div>
  );
}

function Bar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-surface-overlay", className)}>
      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}

function seed(slug: string): number {
  let value = 0;
  for (let i = 0; i < slug.length; i += 1) value = (value * 33 + slug.charCodeAt(i)) | 0;
  return Math.abs(value);
}

function range(count: number): number[] {
  return Array.from({ length: count }, (_, slot) => slot);
}

const SPARK_BASE = [42, 68, 55, 86, 48, 72, 91, 38, 64, 77, 58, 81];
const CANDLE_BASE = [40, 62, 48, 78, 55, 70, 44, 86, 60, 72];
const OTP_DIGITS = ["4", "8", "1", "", "", ""];

function SparkBars({ seedValue = 3, className }: { seedValue?: number; className?: string }) {
  return (
    <div className={cn("flex h-full w-full items-end gap-1.5", className)}>
      {range(SPARK_BASE.length).map((slot) => {
        const value = Math.max(22, ((SPARK_BASE[slot] ?? 40) + seedValue * (slot + 3)) % 92);
        return (
          <span
            key={`bar-${seedValue}-${slot}`}
            className="flex-1 rounded-sm"
            style={{
              height: `${value}%`,
              background: `var(--cronus-chart-${(slot % 5) + 1})`,
              opacity: 0.88,
            }}
          />
        );
      })}
    </div>
  );
}

function SparkLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 72" className={cn("h-full w-full", className)} aria-hidden="true">
      <path
        d="M0 56 C20 56 24 18 44 24 C64 30 68 10 88 16 C108 22 112 44 132 30 C152 16 164 8 188 12 C212 16 220 6 240 14"
        fill="none"
        stroke="var(--cronus-chart-2)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M0 56 C20 56 24 18 44 24 C64 30 68 10 88 16 C108 22 112 44 132 30 C152 16 164 8 188 12 C212 16 220 6 240 14 V72 H0 Z"
        fill="var(--cronus-chart-2)"
        opacity="0.16"
      />
    </svg>
  );
}

function Donut() {
  return (
    <div className="relative size-36">
      <div
        className="size-36 rounded-full"
        style={{
          background:
            "conic-gradient(var(--cronus-chart-1) 0 38%, var(--cronus-chart-2) 38% 64%, var(--cronus-chart-3) 64% 82%, var(--cronus-chart-4) 82% 100%)",
        }}
      />
      <div className="absolute inset-7 rounded-full bg-surface-raised" />
    </div>
  );
}

function Kpi({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-raised p-4">
      <Metric>
        <MetricLabel>{label}</MetricLabel>
        <MetricValue className="text-xl">{value}</MetricValue>
        <MetricDelta trend="up">{delta}</MetricDelta>
      </Metric>
    </div>
  );
}

function DataRows() {
  const rows = [
    ["Acme Corp", "Pro", "$2,400"],
    ["Northwind", "Team", "$890"],
    ["Globex", "Pro", "$2,400"],
    ["Initech", "Starter", "$49"],
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-raised">
      <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr] border-b border-border bg-surface-overlay px-4 py-2 text-xs font-medium text-fg-tertiary">
        <span>Customer</span>
        <span>Plan</span>
        <span className="text-end">MRR</span>
      </div>
      {rows.map(([name, plan, mrr]) => (
        <div
          key={name}
          className="grid grid-cols-[1.4fr_0.8fr_0.7fr] items-center border-b border-border-soft px-4 py-2.5 last:border-b-0"
        >
          <span className="text-sm text-fg">{name}</span>
          <Badge variant="outline">{plan}</Badge>
          <span className="text-end text-sm tabular-nums text-fg-secondary">{mrr}</span>
        </div>
      ))}
    </div>
  );
}

function ModalChrome({ children }: { children: ReactNode }) {
  return (
    <Fill>
      <div className="absolute inset-0 bg-surface-overlay/60" />
      <MarketingNav />
      <div className="relative z-[1] flex flex-1 items-start justify-center pt-8">
        <div className="w-[380px] rounded-2xl border border-border bg-surface-floating p-6 shadow-lg">
          {children}
        </div>
      </div>
    </Fill>
  );
}

function AuthCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  action: string;
}) {
  return (
    <Fill className="items-center justify-center">
      <Dots />
      <div className="relative z-[1] w-[360px] rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <Mark className="size-9 rounded-xl" />
          <p className="mt-3 font-display text-xl tracking-[-0.02em] text-fg">{title}</p>
          <p className="mt-1 text-sm text-fg-secondary">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-3">{children}</div>
        <Button tabIndex={-1} type="button" className="mt-4 w-full" size="lg">
          {action}
        </Button>
      </div>
    </Fill>
  );
}

function HeroScene({
  eyebrow = "Now in public beta",
  title = "Ship products your team is proud of",
  body = "A modern toolkit for building accessible, themeable interfaces.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <Fill>
      <Glow />
      <MarketingNav cta="Get started" />
      <div className="relative z-[1] flex flex-1 flex-col items-center justify-center px-16 pb-10 text-center">
        <Badge variant="primary">{eyebrow}</Badge>
        <h2 className="mt-5 max-w-xl text-balance font-display text-4xl tracking-[-0.03em] text-fg">
          {title}
        </h2>
        <p className="mt-3 max-w-md text-base text-fg-secondary">{body}</p>
        <div className="mt-6 flex items-center gap-3">
          <Button size="lg" tabIndex={-1} type="button">
            Start free trial
          </Button>
          <Button size="lg" variant="outline" tabIndex={-1} type="button">
            Book a demo
          </Button>
        </div>
        <div className="mt-8">
          <Avatars extra="Loved by 9,000+ builders" />
        </div>
      </div>
    </Fill>
  );
}

function PricingScene() {
  const tiers = [
    { name: "Starter", price: "$12", highlight: false },
    { name: "Pro", price: "$49", highlight: true },
    { name: "Team", price: "$99", highlight: false },
  ];
  return (
    <Fill>
      <Glow />
      <MarketingNav />
      <div className="relative z-[1] flex flex-1 items-center justify-center gap-4 px-10 pb-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "flex w-48 flex-col rounded-2xl border p-5",
              tier.highlight
                ? "border-border-strong bg-surface-raised shadow-sm"
                : "border-border bg-surface-base",
            )}
          >
            <span className="text-sm text-fg-secondary">{tier.name}</span>
            <span className="mt-2 font-display text-3xl tracking-[-0.03em] text-fg">
              {tier.price}
              <span className="ms-1 text-sm text-fg-tertiary">/mo</span>
            </span>
            <div className="mt-4 space-y-2">
              <div className="h-1.5 w-full rounded-full bg-surface-overlay" />
              <div className="h-1.5 w-4/5 rounded-full bg-surface-overlay" />
              <div className="h-1.5 w-3/5 rounded-full bg-surface-overlay" />
            </div>
            <Button
              tabIndex={-1}
              type="button"
              size="sm"
              variant={tier.highlight ? "primary" : "outline"}
              className="mt-5 w-full"
            >
              Choose
            </Button>
          </div>
        ))}
      </div>
    </Fill>
  );
}

function DashboardScene({ seedValue = 4 }: { seedValue?: number }) {
  return (
    <AppShell>
      <div className="flex h-full flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <Kpi label="Revenue" value="$48.2k" delta="+12.4%" />
          <Kpi label="Customers" value="1,284" delta="+8.1%" />
          <Kpi label="Conversion" value="3.6%" delta="+0.4%" />
        </div>
        <div className="min-h-0 flex-1 rounded-xl border border-border bg-surface-raised p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
            Monthly revenue
          </p>
          <SparkBars seedValue={seedValue} className="h-[9.5rem]" />
        </div>
      </div>
    </AppShell>
  );
}

function ChatScene() {
  return (
    <Fill className="bg-surface-raised">
      <header className="flex h-12 items-center gap-3 border-b border-border px-5">
        <Avatar className="size-7">
          <AvatarFallback className="bg-surface-overlay text-[10px]">AI</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-fg">Cronus assistant</span>
      </header>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="max-w-[70%] rounded-2xl rounded-es-md bg-surface-overlay px-4 py-2.5 text-sm text-fg">
          How do I theme a new product surface?
        </div>
        <div className="ms-auto max-w-[75%] rounded-2xl rounded-ee-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          Use semantic tokens and compose from primitives — never a palette scale.
        </div>
        <div className="max-w-[65%] rounded-2xl rounded-es-md bg-surface-overlay px-4 py-2.5 text-sm text-fg">
          Show me a login card next.
        </div>
      </div>
      <div className="border-t border-border p-4">
        <div className="flex h-11 items-center rounded-xl border border-border bg-surface-inset px-3 text-sm text-fg-tertiary">
          Ask anything…
        </div>
      </div>
    </Fill>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component scenes                                                          */
/* -------------------------------------------------------------------------- */

function componentScene(slug: string, categorySlug: string): ReactNode {
  switch (slug) {
    case "button":
      return <HeroScene />;
    case "animated-button":
      return (
        <HeroScene
          eyebrow="Motion"
          title="Actions with spring feedback"
          body="Press, release, settle — the same primary action, with a curve you can feel."
        />
      );
    case "toggle":
    case "toggle-group":
    case "button-group":
    case "segmented-control":
    case "expandable-tabs":
      return (
        <Fill>
          <MarketingNav />
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <p className="font-display text-2xl tracking-[-0.02em] text-fg">Billing period</p>
            <div className="inline-flex overflow-hidden rounded-xl border border-border bg-surface-raised p-1 shadow-xs">
              {["Monthly", "Yearly", "Usage"].map((label, index) => (
                <span
                  key={label}
                  className={cn(
                    "rounded-lg px-5 py-2 text-sm font-medium",
                    index === 1 ? "bg-primary text-primary-foreground" : "text-fg-secondary",
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="text-sm text-fg-tertiary">Yearly saves 20% on every plan.</p>
          </div>
        </Fill>
      );
    case "copy-button":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-xs">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="font-mono text-xs text-fg-tertiary">install.sh</span>
              <Button size="sm" variant="outline" tabIndex={-1} type="button">
                Copy
              </Button>
            </div>
            <pre className="px-4 py-5 font-mono text-sm text-fg-secondary">
              bunx create-cronus-app my-app
            </pre>
          </div>
        </Fill>
      );
    case "fab":
      return (
        <AppShell>
          <div className="relative h-full rounded-xl border border-dashed border-border bg-surface-inset">
            <span className="absolute bottom-5 end-5 grid size-14 place-items-center rounded-full bg-primary text-xl font-medium text-primary-foreground shadow-md">
              +
            </span>
          </div>
        </AppShell>
      );
    case "split-button":
      return (
        <AppShell>
          <div className="flex h-full flex-col rounded-xl border border-border bg-surface-raised">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="text-sm font-medium text-fg">Release notes</p>
              <div className="inline-flex overflow-hidden rounded-lg shadow-xs">
                <Button tabIndex={-1} type="button" size="sm" className="rounded-e-none">
                  Publish
                </Button>
                <Button
                  tabIndex={-1}
                  type="button"
                  size="sm"
                  className="rounded-s-none border-s border-primary-foreground/20 px-2.5"
                >
                  ▾
                </Button>
              </div>
            </div>
            <div className="flex-1 p-5">
              <p className="font-display text-2xl tracking-[-0.02em] text-fg">Ready to ship</p>
              <p className="mt-2 text-sm text-fg-secondary">
                Primary action fused to a dropdown of secondary actions.
              </p>
            </div>
          </div>
        </AppShell>
      );
    case "mode-toggle":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[380px] rounded-2xl border border-border bg-surface-raised p-6">
            <p className="font-display text-lg tracking-[-0.02em] text-fg">Appearance</p>
            <p className="mt-1 text-sm text-fg-secondary">Match the product to the room.</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {["Light", "Dark", "System"].map((mode, index) => (
                <div
                  key={mode}
                  className={cn(
                    "rounded-xl border px-3 py-4 text-center text-sm",
                    index === 2
                      ? "border-border-strong bg-surface-overlay text-fg"
                      : "border-border text-fg-secondary",
                  )}
                >
                  {mode}
                </div>
              ))}
            </div>
          </div>
        </Fill>
      );
    case "input":
    case "floating-label-input":
    case "label":
    case "form":
    case "field":
      return (
        <AuthCard title="Welcome back" subtitle="Sign in to your workspace" action="Sign in">
          <Field label="Email" placeholder="you@company.com" type="email" />
          <Field label="Password" placeholder="••••••••" type="password" />
        </AuthCard>
      );
    case "input-group":
      return (
        <AppShell active="Settings">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface-raised p-6">
            <p className="font-display text-lg tracking-[-0.02em] text-fg">Project URL</p>
            <p className="mt-1 mb-4 text-sm text-fg-secondary">The public hostname for this app.</p>
            <div className="flex overflow-hidden rounded-lg border border-border bg-surface-inset">
              <span className="border-e border-border px-3 py-2.5 text-sm text-fg-tertiary">
                https://
              </span>
              <span className="flex-1 px-3 py-2.5 text-sm text-fg">app.cronus.ui</span>
            </div>
            <Button tabIndex={-1} type="button" size="sm" className="mt-5">
              Save
            </Button>
          </div>
        </AppShell>
      );
    case "password-input":
      return (
        <AuthCard
          title="Create account"
          subtitle="A password with a strength meter"
          action="Continue"
        >
          <Field label="Email" placeholder="you@company.com" type="email" />
          <div className="flex flex-col gap-1.5">
            <Label>Password</Label>
            <div className="flex overflow-hidden rounded-lg border border-border bg-surface-inset">
              <span className="flex-1 px-3 py-2.5 text-sm tracking-widest text-fg-tertiary">
                ••••••••
              </span>
              <span className="grid w-10 place-items-center text-fg-muted">◉</span>
            </div>
            <Bar value={72} className="mt-1" />
          </div>
        </AuthCard>
      );
    case "textarea":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[480px] rounded-2xl border border-border bg-surface-raised p-6">
            <p className="mb-3 text-sm font-medium text-fg">Leave a note</p>
            <div className="h-28 rounded-lg border border-border bg-surface-inset px-3 py-2 text-sm text-fg-tertiary">
              Ship the catalog thumbs with a 16/10 stage…
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" tabIndex={-1} type="button">
                Comment
              </Button>
            </div>
          </div>
        </Fill>
      );
    case "checkbox":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[380px] rounded-2xl border border-border bg-surface-raised p-6">
            <p className="mb-4 font-display text-lg tracking-[-0.02em] text-fg">Onboarding</p>
            {(
              [
                { label: "Install the CLI", on: true },
                { label: "Pick a theme", on: true },
                { label: "Add a page", on: false },
              ] as const
            ).map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-2">
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded border text-[11px]",
                    item.on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border-strong bg-surface-inset",
                  )}
                >
                  {item.on ? "✓" : ""}
                </span>
                <span className="text-sm text-fg">{item.label}</span>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "radio-group":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[420px] space-y-3">
            {(
              [
                { name: "Starter", price: "$12 / month", selected: false },
                { name: "Pro", price: "$49 / month", selected: true },
              ] as const
            ).map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-5 py-4",
                  plan.selected
                    ? "border-border-strong bg-surface-raised"
                    : "border-border bg-surface-base",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "size-4 rounded-full border",
                      plan.selected ? "border-primary bg-primary" : "border-border-strong",
                    )}
                  />
                  <span className="text-sm font-medium text-fg">{plan.name}</span>
                </div>
                <span className="text-sm text-fg-secondary">{plan.price}</span>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "switch":
    case "notification-preferences":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[420px] rounded-2xl border border-border bg-surface-raised p-2">
            {(
              [
                { label: "Product updates", on: true },
                { label: "Weekly digest", on: true },
                { label: "Marketing", on: false },
              ] as const
            ).map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-fg">{item.label}</span>
                <Switch defaultChecked={item.on} tabIndex={-1} />
              </div>
            ))}
          </div>
        </Fill>
      );
    case "select":
    case "combobox":
    case "multi-select":
    case "autocomplete":
    case "tags-input":
    case "chip":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[420px] rounded-2xl border border-border bg-surface-raised p-6">
            <p className="mb-3 text-sm font-medium text-fg">Assign to</p>
            <div className="flex h-11 items-center justify-between rounded-lg border border-border bg-surface-inset px-3 text-sm text-fg-secondary">
              Ada Lovelace
              <span className="text-fg-muted">▾</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline">Design</Badge>
              <Badge variant="primary">Launch</Badge>
              <Badge variant="outline">+ Add</Badge>
            </div>
          </div>
        </Fill>
      );
    case "slider":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[440px] rounded-2xl border border-border bg-surface-raised p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-fg">Max spend</span>
              <span className="text-sm tabular-nums text-fg-secondary">$2,400</span>
            </div>
            <div className="mt-5 flex items-center">
              <span className="h-1.5 flex-1 rounded-full bg-primary" />
              <span className="size-4 -ms-1 rounded-full border border-border bg-surface-raised shadow-xs" />
              <span className="h-1.5 flex-1 rounded-full bg-surface-overlay" />
            </div>
          </div>
        </Fill>
      );
    case "progress":
    case "usage-meter":
    case "scroll-progress":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[440px] rounded-2xl border border-border bg-surface-raised p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-fg">Build minutes</span>
              <span className="text-sm tabular-nums text-fg-secondary">64%</span>
            </div>
            <Bar value={64} className="mt-4 h-2.5" />
            <p className="mt-2 text-xs text-fg-tertiary">8,192 of 12,800 minutes used</p>
          </div>
        </Fill>
      );
    case "badge":
    case "status-dot":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[480px] rounded-2xl border border-border bg-surface-raised p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl tracking-[-0.02em] text-fg">Release 2.4</p>
              <div className="flex gap-1.5">
                <Badge variant="primary">New</Badge>
                <Badge variant="success">Stable</Badge>
                <Badge variant="outline">Docs</Badge>
              </div>
            </div>
            <p className="mt-3 text-sm text-fg-secondary">
              Catalog thumbs, Hydra tags, and a locked docs shell.
            </p>
          </div>
        </Fill>
      );
    case "avatar":
    case "avatar-group":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="flex flex-col items-center gap-5">
            <Avatars />
            <p className="text-sm text-fg-secondary">The people shipping Cronus</p>
          </div>
        </Fill>
      );
    case "card":
    case "glass-card":
    case "spotlight-card":
    case "tilt-card":
    case "flip-card":
    case "gradient-border":
    case "star-border":
    case "border-beam":
    case "frame":
    case "glare-hover":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[380px] rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
            <p className="font-display text-xl tracking-[-0.02em] text-fg">Upgrade to Pro</p>
            <p className="mt-2 text-sm text-fg-secondary">
              Everything to ship a themeable product — extra composed apps on top.
            </p>
            <Button tabIndex={-1} type="button" className="mt-5 w-full">
              Start building
            </Button>
          </div>
        </Fill>
      );
    case "metric":
    case "animated-number":
      return (
        <Fill className="items-center justify-center p-10">
          <div className="grid w-full max-w-2xl grid-cols-3 gap-4">
            <Kpi label="Revenue" value="$48.2k" delta="+12.4%" />
            <Kpi label="Themes" value="12,480" delta="+24%" />
            <Kpi label="Uptime" value="99.99%" delta="+0.01%" />
          </div>
        </Fill>
      );
    case "sparkline":
    case "live-line-chart":
    case "line-chart":
    case "area-chart":
      return (
        <AppShell active="Revenue">
          <div className="flex h-full flex-col rounded-xl border border-border bg-surface-raised p-5">
            <div className="flex items-start justify-between">
              <Metric>
                <MetricLabel>Revenue</MetricLabel>
                <MetricValue>$48.2k</MetricValue>
              </Metric>
              <Badge variant="success">Live</Badge>
            </div>
            <SparkLine className="mt-4 h-48" />
          </div>
        </AppShell>
      );
    case "bar-chart":
    case "stacked-bar-chart":
    case "chart":
    case "composed-chart":
    case "profit-loss-chart":
      return <DashboardScene seedValue={seed(slug)} />;
    case "heatmap":
    case "heatmap-chart":
      return (
        <AppShell>
          <div className="flex h-full flex-col rounded-xl border border-border bg-surface-raised p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
              Activity
            </p>
            <div className="grid flex-1 grid-cols-12 grid-rows-5 gap-1.5">
              {range(60).map((cell) => (
                <span
                  key={`heat-${cell}`}
                  className="rounded-sm"
                  style={{
                    background: "var(--cronus-chart-2)",
                    opacity: ((cell * 7 + seed(slug)) % 90) / 100,
                  }}
                />
              ))}
            </div>
          </div>
        </AppShell>
      );
    case "pie-chart":
    case "ring-chart":
    case "gauge-chart":
    case "radar-chart":
    case "sunburst-chart":
      return (
        <Fill className="flex-row items-center justify-center gap-10 p-12">
          <Donut />
          <div className="space-y-3">
            {["Product", "Services", "Other"].map((label, index) => (
              <div key={label} className="flex items-center gap-2 text-sm text-fg-secondary">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: `var(--cronus-chart-${index + 1})` }}
                />
                {label}
              </div>
            ))}
          </div>
        </Fill>
      );
    case "candlestick-chart":
      return (
        <AppShell active="Revenue">
          <div className="flex h-full items-end gap-3 rounded-xl border border-border bg-surface-raised p-5">
            {range(CANDLE_BASE.length).map((slot) => {
              const value = CANDLE_BASE[slot] ?? 40;
              return (
                <div
                  key={`candle-${slot}`}
                  className="flex flex-1 flex-col items-center justify-end"
                  style={{ height: "100%" }}
                >
                  <span className="w-px flex-1 bg-border" />
                  <span
                    className="w-3 rounded-sm"
                    style={{
                      height: `${value}%`,
                      background:
                        slot % 3 === 0 ? "var(--cronus-chart-4)" : "var(--cronus-chart-1)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </AppShell>
      );
    case "funnel-chart":
      return (
        <Fill className="items-center justify-center gap-2 p-12">
          {["100%", "64%", "41%", "18%"].map((label, index) => (
            <div
              key={label}
              className="flex h-10 items-center justify-center rounded-md bg-primary text-xs font-medium text-primary-foreground"
              style={{ width: `${88 - index * 16}%`, opacity: 1 - index * 0.12 }}
            >
              {label}
            </div>
          ))}
        </Fill>
      );
    case "scatter-chart":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="relative h-64 w-full max-w-lg rounded-xl border border-border bg-surface-raised">
            {range(18).map((dot) => (
              <span
                key={`dot-${dot}`}
                className="absolute size-2.5 rounded-full"
                style={{
                  left: `${8 + ((dot * 17) % 84)}%`,
                  top: `${12 + ((dot * 29) % 70)}%`,
                  background: `var(--cronus-chart-${(dot % 5) + 1})`,
                }}
              />
            ))}
          </div>
        </Fill>
      );
    case "sankey-chart":
    case "choropleth-chart":
      return <DashboardScene seedValue={seed(slug)} />;
    case "table":
    case "data-table":
    case "description-list":
      return (
        <AppShell active="Customers">
          <DataRows />
        </AppShell>
      );
    case "skeleton":
    case "shimmer":
      return (
        <Fill className="justify-center gap-4 p-12">
          {[1, 2].map((row) => (
            <div key={row} className="flex items-center gap-4 rounded-2xl border border-border p-4">
              <span className="size-12 animate-pulse rounded-full bg-surface-overlay" />
              <div className="flex-1 space-y-2">
                <span className="block h-3 w-2/3 animate-pulse rounded-full bg-surface-overlay" />
                <span className="block h-3 w-1/2 animate-pulse rounded-full bg-surface-overlay" />
              </div>
            </div>
          ))}
        </Fill>
      );
    case "alert":
    case "banner":
    case "sonner":
    case "toast-stack":
      return (
        <Fill>
          <MarketingNav />
          <div className="mx-8 mt-4 flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4">
            <span className="mt-1 size-2.5 shrink-0 rounded-full bg-info" />
            <div>
              <p className="text-sm font-medium text-fg">Theme published</p>
              <p className="mt-0.5 text-sm text-fg-secondary">
                Neutral is live on production. Contrast checks passed.
              </p>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <p className="font-display text-3xl tracking-[-0.03em] text-fg">Your workspace</p>
          </div>
        </Fill>
      );
    case "spinner":
      return (
        <Fill className="items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="size-8 rounded-full border-2 border-border border-t-fg" />
            <span className="text-sm text-fg-secondary">Compiling registry…</span>
          </div>
        </Fill>
      );
    case "dialog":
    case "alert-dialog":
    case "confirmation-dialog":
    case "sheet":
    case "drawer":
      return (
        <ModalChrome>
          <p className="font-display text-lg tracking-[-0.02em] text-fg">Delete API key?</p>
          <p className="mt-2 text-sm text-fg-secondary">
            This key will stop working immediately. You cannot undo this.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button size="sm" variant="outline" tabIndex={-1} type="button">
              Cancel
            </Button>
            <Button size="sm" variant="destructive" tabIndex={-1} type="button">
              Delete
            </Button>
          </div>
        </ModalChrome>
      );
    case "tabs":
    case "accordion":
    case "collapsible":
    case "code-tabs":
      return (
        <Fill className="p-10">
          <div className="flex h-full flex-col rounded-2xl border border-border bg-surface-raised p-6">
            <div className="flex gap-6 border-b border-border">
              {["Overview", "Usage", "API"].map((tab, index) => (
                <span
                  key={tab}
                  className={cn(
                    "pb-2.5 text-sm",
                    index === 0 ? "border-b-2 border-fg font-medium text-fg" : "text-fg-tertiary",
                  )}
                >
                  {tab}
                </span>
              ))}
            </div>
            <p className="mt-5 font-display text-2xl tracking-[-0.02em] text-fg">Button</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-fg-secondary">
              Clickable action with variants, sizes and asChild. Themeable through tokens.
            </p>
          </div>
        </Fill>
      );
    case "breadcrumb":
    case "table-of-contents":
    case "navigation-menu":
      return (
        <Fill>
          <div className="flex h-12 items-center gap-2 border-b border-border px-8 text-sm text-fg-tertiary">
            Docs <span>/</span> Components <span>/</span>
            <span className="text-fg">Button</span>
          </div>
          <div className="flex flex-1 flex-col justify-center px-8">
            <p className="font-display text-3xl tracking-[-0.03em] text-fg">Button</p>
            <p className="mt-2 max-w-md text-fg-secondary">
              The primary action primitive — variants, sizes, asChild.
            </p>
          </div>
        </Fill>
      );
    case "pagination":
      return (
        <AppShell active="Customers">
          <DataRows />
          <div className="mt-4 flex justify-end gap-1">
            {[1, 2, 3].map((page) => (
              <span
                key={page}
                className={cn(
                  "grid size-8 place-items-center rounded-md text-sm",
                  page === 2
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-fg-secondary",
                )}
              >
                {page}
              </span>
            ))}
          </div>
        </AppShell>
      );
    case "sidebar":
    case "app-shell":
    case "resizable":
    case "toolbar":
      return <DashboardScene />;
    case "command":
      return (
        <Fill>
          <div className="absolute inset-0 bg-surface-overlay/50" />
          <div className="relative z-[1] mx-auto mt-16 w-[480px] overflow-hidden rounded-2xl border border-border bg-surface-floating shadow-lg">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm text-fg-tertiary">
              Search components…
            </div>
            <div className="p-2">
              {["Button", "Input", "Dialog"].map((item, index) => (
                <div
                  key={item}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    index === 0 ? "bg-surface-overlay text-fg" : "text-fg-secondary",
                  )}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Fill>
      );
    case "calendar":
    case "date-picker":
    case "date-range-picker":
    case "scheduler":
    case "time-picker":
    case "countdown":
      return (
        <Fill className="items-center justify-center p-10">
          <div className="w-[360px] rounded-2xl border border-border bg-surface-raised p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-fg">August 2026</span>
              <span className="text-fg-tertiary">‹ ›</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {range(35).map((day) => (
                <span
                  key={`day-${day}`}
                  className={cn(
                    "grid size-9 place-items-center rounded-md text-xs",
                    day === 18 ? "bg-primary text-primary-foreground" : "text-fg-secondary",
                  )}
                >
                  {day < 6 ? "" : day - 5}
                </span>
              ))}
            </div>
          </div>
        </Fill>
      );
    case "kbd":
      return (
        <Fill className="items-center justify-center">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-5 py-3 text-sm text-fg-secondary">
            Search
            <span className="ms-8 rounded-md border border-border bg-surface-overlay px-1.5 py-0.5 font-mono text-[11px]">
              ⌘K
            </span>
          </div>
        </Fill>
      );
    case "separator":
      return (
        <Fill className="items-center justify-center p-16">
          <div className="w-80">
            <p className="text-sm text-fg">Account</p>
            <span className="my-4 block h-px w-full bg-border" />
            <p className="text-sm text-fg-secondary">Billing</p>
          </div>
        </Fill>
      );
    case "empty":
      return (
        <AppShell>
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border">
            <span className="size-12 rounded-full border border-dashed border-border" />
            <p className="mt-3 font-display text-lg tracking-[-0.02em] text-fg">No customers yet</p>
            <p className="mt-1 text-sm text-fg-secondary">Invite the first one to get started.</p>
            <Button size="sm" tabIndex={-1} type="button" className="mt-4">
              Invite
            </Button>
          </div>
        </AppShell>
      );
    case "tooltip":
    case "hover-card":
    case "popover":
    case "morphing-popover":
      return (
        <Fill className="items-center justify-center">
          <div className="relative">
            <Button variant="outline" tabIndex={-1} type="button">
              Hover
            </Button>
            <span className="absolute -top-11 left-1/2 -translate-x-1/2 rounded-md border border-border bg-surface-floating px-3 py-1.5 text-xs text-fg shadow-xs">
              Opens the preview
            </span>
          </div>
        </Fill>
      );
    case "dropdown-menu":
    case "context-menu":
    case "menubar":
    case "notification-center":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-56 overflow-hidden rounded-xl border border-border bg-surface-floating py-1.5 shadow-md">
            <div className="mx-1.5 rounded-md bg-surface-overlay px-3 py-2 text-sm text-fg">
              Duplicate
            </div>
            <div className="px-4 py-2 text-sm text-fg-secondary">Rename</div>
            <div className="mx-3 my-1 h-px bg-border" />
            <div className="px-4 py-2 text-sm text-error">Delete</div>
          </div>
        </Fill>
      );
    case "marquee":
    case "logo-carousel":
      return (
        <Fill className="items-center justify-center">
          <div className="flex w-full items-center justify-center gap-4 px-8">
            {["Acme", "North", "Globex", "Umbrella", "Initech"].map((mark) => (
              <span
                key={mark}
                className="grid h-12 flex-1 place-items-center rounded-xl border border-border bg-surface-raised text-sm font-medium text-fg-tertiary"
              >
                {mark}
              </span>
            ))}
          </div>
        </Fill>
      );
    case "aurora-background":
    case "particles":
    case "meteors":
    case "light-rays":
    case "ripple":
    case "orbit":
    case "noise":
    case "dot-pattern":
    case "grid-pattern":
    case "retro-grid":
    case "flickering-grid":
    case "progressive-blur":
    case "confetti":
      return (
        <Fill className="items-center justify-center">
          <span className="absolute -left-8 top-6 size-56 rounded-full bg-primary/20 blur-3xl" />
          <span className="absolute right-0 top-20 size-40 rounded-full bg-info/15 blur-3xl" />
          <p className="relative font-display text-4xl tracking-[-0.03em] text-fg">Atmosphere</p>
        </Fill>
      );
    case "gradient-text":
    case "shiny-text":
    case "sparkles-text":
    case "highlighter":
    case "spinning-text":
    case "scramble-text":
    case "text-effect":
    case "typing-text":
    case "word-rotate":
      return (
        <Fill className="items-center justify-center">
          <p className="font-display text-5xl tracking-[-0.03em] text-fg">
            Build<span className="text-fg-muted">|</span>
          </p>
        </Fill>
      );
    case "terminal":
    case "code-block":
    case "json-viewer":
      return (
        <Fill className="p-10">
          <div className="flex h-full flex-col rounded-2xl border border-border bg-surface-inset">
            <div className="flex h-9 items-center gap-1.5 border-b border-border px-3">
              <span className="size-2 rounded-full bg-fg-muted" />
              <span className="size-2 rounded-full bg-fg-muted" />
              <span className="size-2 rounded-full bg-fg-muted" />
            </div>
            <pre className="flex-1 px-5 py-4 font-mono text-sm leading-7 text-fg-secondary">
              <span className="text-fg-tertiary">$</span> bunx create-cronus-app
              {"\n"}
              <span className="text-fg-tertiary">→</span> theme: neutral
              {"\n"}
              <span className="text-success-strong">✓</span> wrote cronus-ui.json
            </pre>
          </div>
        </Fill>
      );
    case "dock":
    case "pill-nav":
    case "dynamic-island":
      return (
        <Fill className="items-end justify-center pb-10">
          <div className="flex gap-2 rounded-full border border-border bg-surface-raised p-2 shadow-sm">
            {[0, 1, 2, 3, 4].map((item) => (
              <span
                key={item}
                className={cn(
                  "size-11 rounded-full",
                  item === 1 ? "bg-primary" : "bg-surface-overlay",
                )}
              />
            ))}
          </div>
        </Fill>
      );
    case "input-otp":
      return (
        <AuthCard title="Check your email" subtitle="Enter the 6-digit code" action="Verify">
          <div className="flex justify-center gap-2">
            {range(OTP_DIGITS.length).map((slot) => (
              <span
                key={`otp-${slot}`}
                className="grid size-11 place-items-center rounded-lg border border-border bg-surface-inset font-mono text-lg text-fg"
              >
                {OTP_DIGITS[slot]}
              </span>
            ))}
          </div>
        </AuthCard>
      );
    case "file-dropzone":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="flex h-48 w-full max-w-lg flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-inset">
            <span className="size-10 rounded-full border border-border bg-surface-raised" />
            <p className="mt-3 text-sm font-medium text-fg">Drop files here</p>
            <p className="text-xs text-fg-tertiary">PNG, JPG up to 8 MB</p>
          </div>
        </Fill>
      );
    case "number-input":
    case "currency-input":
    case "phone-input":
    case "credit-card-input":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[400px] rounded-2xl border border-border bg-surface-raised p-6">
            <Field label="Amount" placeholder="$2,400.00" />
          </div>
        </Fill>
      );
    case "stepper":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="flex w-full max-w-lg items-center gap-3">
            {["Account", "Plan", "Pay"].map((step, index) => (
              <div key={step} className="flex flex-1 items-center gap-3">
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-xs font-medium",
                    index < 2
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-fg-tertiary",
                  )}
                >
                  {index + 1}
                </span>
                <span className={cn("text-sm", index < 2 ? "text-fg" : "text-fg-tertiary")}>
                  {step}
                </span>
                {index < 2 ? <span className="h-px flex-1 bg-border" /> : null}
              </div>
            ))}
          </div>
        </Fill>
      );
    case "rating":
      return (
        <Fill className="items-center justify-center">
          <div className="flex gap-1 text-2xl text-fg">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span className="text-fg-muted">★</span>
          </div>
        </Fill>
      );
    case "color-picker":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="flex gap-3">
            {["bg-primary", "bg-success", "bg-warning", "bg-info", "bg-error"].map((tone) => (
              <span key={tone} className={cn("size-10 rounded-full border border-border", tone)} />
            ))}
          </div>
        </Fill>
      );
    case "signature-pad":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="flex h-40 w-full max-w-lg items-end rounded-2xl border border-border bg-surface-inset p-4">
            <svg viewBox="0 0 200 40" className="h-10 w-48" aria-hidden="true">
              <path
                d="M4 28 C30 8 40 36 70 18 C90 6 110 30 140 16 C160 8 180 22 196 14"
                fill="none"
                stroke="var(--cronus-fg)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </Fill>
      );
    case "masonry":
    case "carousel":
    case "card-stack":
    case "image-zoom":
    case "video-player":
    case "lightbox":
    case "comparison-slider":
    case "aspect-ratio":
      return (
        <Fill className="p-8">
          <div className="grid h-full grid-cols-3 grid-rows-2 gap-3">
            <div className="col-span-2 rounded-xl bg-surface-overlay" />
            <div className="rounded-xl bg-surface-overlay/70" />
            <div className="rounded-xl bg-surface-overlay/70" />
            <div className="col-span-2 rounded-xl bg-surface-overlay" />
          </div>
        </Fill>
      );
    case "timeline":
    case "tree-view":
    case "kanban":
    case "animated-list":
      return (
        <Fill className="p-8">
          <div className="grid h-full grid-cols-3 gap-3">
            {["Todo", "Doing", "Done"].map((col) => (
              <div key={col} className="rounded-xl border border-border bg-surface-raised p-3">
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
                  {col}
                </p>
                <div className="space-y-2">
                  <div className="h-14 rounded-lg bg-surface-overlay" />
                  <div className="h-14 rounded-lg bg-surface-overlay" />
                </div>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "rich-text-editor":
      return (
        <Fill className="p-10">
          <div className="flex h-full flex-col rounded-2xl border border-border bg-surface-raised">
            <div className="flex gap-1 border-b border-border px-3 py-2">
              {["B", "I", "U"].map((mark) => (
                <span
                  key={mark}
                  className="grid size-8 place-items-center rounded-md text-sm font-medium text-fg-secondary"
                >
                  {mark}
                </span>
              ))}
            </div>
            <p className="flex-1 px-5 py-4 text-sm leading-6 text-fg">
              Catalog cards should read as product screenshots — scaled, not empty.
            </p>
          </div>
        </Fill>
      );
    case "scroll-area":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="h-64 w-72 overflow-hidden rounded-2xl border border-border bg-surface-raised p-4">
            <div className="space-y-3">
              {range(8).map((row) => (
                <div key={`row-${row}`} className="h-8 rounded-md bg-surface-overlay" />
              ))}
            </div>
          </div>
        </Fill>
      );
    case "magnetic":
    case "click-spark":
      return (
        <Fill className="items-center justify-center">
          <Button size="lg" tabIndex={-1} type="button">
            Press me
          </Button>
        </Fill>
      );
    case "reveal":
      return (
        <Fill className="items-center justify-center">
          <p className="font-display text-4xl tracking-[-0.03em] text-fg">Revealed</p>
        </Fill>
      );
    default:
      return categoryScene(categorySlug, slug);
  }
}

function categoryScene(categorySlug: string, slug: string): ReactNode {
  switch (categorySlug) {
    case "buttons":
      return <HeroScene />;
    case "forms":
      return (
        <AuthCard title="Continue" subtitle="A composed form surface" action="Submit">
          <Field label="Email" placeholder="you@company.com" />
          <Field label="Name" placeholder="Ada Lovelace" />
        </AuthCard>
      );
    case "data-display":
      return (
        <AppShell>
          <DataRows />
        </AppShell>
      );
    case "feedback":
      return (
        <Fill className="items-center justify-center p-12">
          <div className="flex w-[420px] items-start gap-3 rounded-xl border border-border bg-surface-raised p-4">
            <span className="mt-1 size-2.5 rounded-full bg-success" />
            <div>
              <p className="text-sm font-medium text-fg">Saved</p>
              <p className="text-sm text-fg-secondary">Your changes are live.</p>
            </div>
          </div>
        </Fill>
      );
    case "overlays":
      return (
        <ModalChrome>
          <p className="font-display text-lg tracking-[-0.02em] text-fg">Confirm</p>
          <p className="mt-2 text-sm text-fg-secondary">This action applies immediately.</p>
          <div className="mt-5 flex justify-end gap-2">
            <Button size="sm" variant="outline" tabIndex={-1} type="button">
              Cancel
            </Button>
            <Button size="sm" tabIndex={-1} type="button">
              Confirm
            </Button>
          </div>
        </ModalChrome>
      );
    case "navigation":
      return <DashboardScene />;
    case "date-time":
      return componentScene("calendar", categorySlug);
    case "charts":
      return <DashboardScene seedValue={seed(slug)} />;
    case "premium":
      return (
        <Fill className="items-center justify-center">
          <span className="absolute inset-x-16 top-16 h-24 rounded-full bg-primary/20 blur-3xl" />
          <p className="relative font-display text-4xl tracking-[-0.03em] text-fg">Premium</p>
        </Fill>
      );
    default:
      return (
        <Fill className="items-center justify-center p-12">
          <div className="w-[360px] rounded-2xl border border-border bg-surface-raised p-6">
            <p className="font-display text-xl tracking-[-0.02em] text-fg">Component</p>
            <p className="mt-2 text-sm text-fg-secondary">A themeable Cronus primitive.</p>
            <Button tabIndex={-1} type="button" className="mt-5 w-full">
              Open
            </Button>
          </div>
        </Fill>
      );
  }
}

/* -------------------------------------------------------------------------- */
/*  Block scenes                                                              */
/* -------------------------------------------------------------------------- */

function blockScene(slug: string, categorySlug: string): ReactNode {
  switch (slug) {
    case "login":
      return (
        <AuthCard title="Welcome back" subtitle="Sign in to your Cronus workspace" action="Sign in">
          <Field label="Email" placeholder="you@company.com" type="email" />
          <Field label="Password" placeholder="••••••••" type="password" />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="outline" size="sm" tabIndex={-1} type="button">
              GitHub
            </Button>
            <Button variant="outline" size="sm" tabIndex={-1} type="button">
              Google
            </Button>
          </div>
        </AuthCard>
      );
    case "signup":
      return (
        <AuthCard
          title="Create account"
          subtitle="Start building in a minute"
          action="Create account"
        >
          <Field label="Email" placeholder="you@company.com" />
          <Field label="Password" placeholder="••••••••" type="password" />
        </AuthCard>
      );
    case "forgot-password":
    case "magic-link":
      return (
        <AuthCard title="Reset password" subtitle="We'll email a one-time link" action="Send link">
          <Field label="Email" placeholder="you@company.com" type="email" />
        </AuthCard>
      );
    case "otp":
      return componentScene("input-otp", "forms");
    case "hero":
    case "cta":
      return <HeroScene />;
    case "waitlist":
      return (
        <Fill>
          <Glow />
          <MarketingNav />
          <div className="relative z-[1] flex flex-1 flex-col items-center justify-center px-16 text-center">
            <Badge variant="primary">Join the list</Badge>
            <h2 className="mt-5 max-w-xl text-balance font-display text-4xl tracking-[-0.03em] text-fg">
              Get early access
            </h2>
            <p className="mt-3 max-w-md text-base text-fg-secondary">
              Be first in line when the next theme ships.
            </p>
            <div className="mt-6 flex w-full max-w-md gap-2">
              <Input readOnly tabIndex={-1} placeholder="you@company.com" className="flex-1" />
              <Button tabIndex={-1} type="button">
                Join
              </Button>
            </div>
          </div>
        </Fill>
      );
    case "pricing":
      return <PricingScene />;
    case "feature-matrix":
      return (
        <Fill>
          <MarketingNav />
          <div className="flex flex-1 items-center px-8 pb-6">
            <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface-raised">
              <div className="grid grid-cols-4 border-b border-border bg-surface-overlay px-4 py-2 text-xs font-medium text-fg-tertiary">
                <span>Feature</span>
                <span className="text-center">Starter</span>
                <span className="text-center">Pro</span>
                <span className="text-center">Team</span>
              </div>
              {["Themes", "Blocks", "SSO", "Audit log"].map((row, rowIndex) => (
                <div
                  key={row}
                  className="grid grid-cols-4 items-center border-b border-border-soft px-4 py-2.5 last:border-b-0"
                >
                  <span className="text-sm text-fg">{row}</span>
                  {["starter", "pro", "team"].map((plan, col) => (
                    <span
                      key={`${row}-${plan}`}
                      className={cn(
                        "text-center text-sm",
                        rowIndex > 1 && col === 0 ? "text-fg-muted" : "text-fg",
                      )}
                    >
                      {rowIndex > 1 && col === 0 ? "—" : "✓"}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Fill>
      );
    case "feature-grid":
      return (
        <Fill>
          <MarketingNav />
          <div className="grid flex-1 grid-cols-2 gap-4 p-8">
            {["Accessible", "Themeable", "Composable", "Typed"].map((title) => (
              <div key={title} className="rounded-2xl border border-border bg-surface-raised p-5">
                <span className="mb-3 block size-8 rounded-lg bg-surface-overlay" />
                <p className="font-display text-lg tracking-[-0.02em] text-fg">{title}</p>
                <p className="mt-1 text-sm text-fg-secondary">
                  Built on tokens, shipped with the contract.
                </p>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "navbar":
      return (
        <Fill>
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between rounded-full border border-border bg-surface-raised px-5 py-2.5 shadow-xs">
              <div className="flex items-center gap-2">
                <Mark className="size-5" />
                <span className="text-sm font-medium">Cronus</span>
              </div>
              <div className="flex gap-6 text-sm text-fg-secondary">
                <span>Product</span>
                <span>Pricing</span>
                <span>Docs</span>
              </div>
              <Button size="sm" tabIndex={-1} type="button">
                Sign in
              </Button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <p className="font-display text-4xl tracking-[-0.03em] text-fg">Contained navigation</p>
          </div>
        </Fill>
      );
    case "footer":
      return (
        <Fill className="justify-end">
          <div className="flex flex-1 items-center justify-center">
            <p className="font-display text-3xl tracking-[-0.03em] text-fg-muted">The product</p>
          </div>
          <div className="grid grid-cols-4 gap-6 border-t border-border px-10 py-8">
            <div>
              <Mark className="size-6" />
              <p className="mt-2 text-sm text-fg-secondary">Cronus UI</p>
            </div>
            {["Product", "Company", "Legal"].map((col) => (
              <div key={col} className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
                  {col}
                </p>
                <p className="text-sm text-fg-secondary">Overview</p>
                <p className="text-sm text-fg-secondary">Changelog</p>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "testimonials":
    case "reviews":
      return (
        <Fill className="items-center justify-center p-8">
          <div className="grid w-full grid-cols-2 gap-4">
            {(
              [
                { quote: "The catalog finally feels like a product.", name: "Ada L." },
                { quote: "We shipped the marketing site in a day.", name: "Grace H." },
              ] as const
            ).map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-border bg-surface-raised p-5"
              >
                <p className="text-sm leading-6 text-fg">{item.quote}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-surface-overlay text-[10px]">
                      {item.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-fg-secondary">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "faq":
      return (
        <Fill className="items-center justify-center p-10">
          <div className="w-full max-w-lg space-y-2">
            {[
              "Can I theme after install?",
              "Does this work with Next?",
              "How do upgrades land?",
            ].map((q, index) => (
              <div
                key={q}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-raised px-4 py-3"
              >
                <span className="text-sm text-fg">{q}</span>
                <span className="text-fg-muted">{index === 0 ? "–" : "+"}</span>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "dashboard":
    case "analytics":
    case "stats":
    case "usage-dashboard":
    case "app-shell-chrome":
      return <DashboardScene seedValue={seed(slug)} />;
    case "checkout":
    case "cart":
    case "billing":
    case "payment-method":
    case "manage-subscription":
    case "invoice":
      return (
        <Fill className="flex-row p-8">
          <div className="flex flex-1 flex-col gap-3 pe-6">
            <p className="font-display text-xl tracking-[-0.02em] text-fg">Checkout</p>
            <Field label="Card" placeholder="ACCT-000015" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry" placeholder="08 / 28" />
              <Field label="CVC" placeholder="123" />
            </div>
          </div>
          <div className="w-56 rounded-2xl border border-border bg-surface-raised p-4">
            <p className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
              Summary
            </p>
            <p className="mt-3 font-display text-2xl tracking-[-0.02em] text-fg">$49</p>
            <p className="text-sm text-fg-secondary">Pro · monthly</p>
            <Button tabIndex={-1} type="button" className="mt-5 w-full" size="sm">
              Pay
            </Button>
          </div>
        </Fill>
      );
    case "product-grid":
      return (
        <Fill className="p-6">
          <div className="grid h-full grid-cols-2 gap-3">
            {["Atlas tote", "Orbit lamp", "Nimbus chair", "Sol desk"].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-border bg-surface-raised"
              >
                <div className="h-24 bg-surface-overlay" />
                <div className="p-3">
                  <p className="text-sm text-fg">{item}</p>
                  <p className="text-xs text-fg-tertiary">$128</p>
                </div>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "product-detail":
      return (
        <Fill className="flex-row p-6">
          <div className="me-5 flex-1 rounded-2xl bg-surface-overlay" />
          <div className="flex w-64 flex-col justify-center">
            <Badge variant="outline">In stock</Badge>
            <p className="mt-3 font-display text-2xl tracking-[-0.02em] text-fg">Orbit lamp</p>
            <p className="mt-1 text-sm text-fg-secondary">$128</p>
            <Button tabIndex={-1} type="button" className="mt-5">
              Add to cart
            </Button>
          </div>
        </Fill>
      );
    case "chat-thread":
    case "ai-response":
    case "prompt-box":
      return <ChatScene />;
    case "email-welcome":
    case "email-receipt":
    case "email-verify":
      return (
        <Fill className="items-center justify-center bg-surface-inset p-8">
          <div className="w-[420px] rounded-2xl border border-border bg-surface-raised p-8 text-center">
            <Mark className="mx-auto size-9 rounded-xl" />
            <p className="mt-4 font-display text-2xl tracking-[-0.02em] text-fg">
              Welcome to Cronus
            </p>
            <p className="mt-2 text-sm text-fg-secondary">
              Your workspace is ready. Confirm the address to start shipping.
            </p>
            <Button tabIndex={-1} type="button" className="mt-5">
              Confirm email
            </Button>
          </div>
        </Fill>
      );
    case "not-found":
    case "error-state":
    case "maintenance":
      return (
        <Fill className="items-center justify-center">
          <p className="font-display text-6xl tracking-[-0.03em] text-fg">404</p>
          <p className="mt-2 text-sm text-fg-secondary">This page isn't in the registry.</p>
          <Button tabIndex={-1} type="button" className="mt-5" size="sm">
            Back home
          </Button>
        </Fill>
      );
    case "success-state":
      return (
        <Fill className="items-center justify-center">
          <span className="grid size-12 place-items-center rounded-full bg-success/15 text-sm font-medium text-success-strong">
            ✓
          </span>
          <p className="mt-4 font-display text-2xl tracking-[-0.02em] text-fg">You're in</p>
          <p className="mt-1 text-sm text-fg-secondary">The workspace is provisioned.</p>
        </Fill>
      );
    case "blog":
    case "blog-post":
    case "changelog":
    case "about":
      return (
        <Fill className="p-8">
          <p className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">Journal</p>
          <p className="mt-2 font-display text-3xl tracking-[-0.03em] text-fg">
            Why the catalog is the product
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-fg-secondary">
            Compose of apps, live theme, authorship contract. The tiles are the means.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="h-20 rounded-xl bg-surface-overlay" />
            <div className="h-20 rounded-xl bg-surface-overlay" />
            <div className="h-20 rounded-xl bg-surface-overlay" />
          </div>
        </Fill>
      );
    case "logo-cloud":
      return componentScene("logo-carousel", "premium");
    case "account-security":
    case "sessions":
    case "api-keys":
    case "settings":
    case "notification-preferences":
      return (
        <AppShell active="Settings">
          <div className="space-y-3">
            {["Two-factor authentication", "Active sessions", "API keys"].map((row) => (
              <div
                key={row}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-raised px-4 py-3"
              >
                <span className="text-sm text-fg">{row}</span>
                <Button size="sm" variant="outline" tabIndex={-1} type="button">
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </AppShell>
      );
    case "team":
    case "user-management":
      return (
        <AppShell active="Customers">
          <DataRows />
        </AppShell>
      );
    case "welcome":
    case "setup-wizard":
    case "setup-checklist":
      return componentScene("checkbox", "forms");
    case "post-card":
    case "comment-thread":
    case "profile-card":
    case "activity-feed":
      return (
        <Fill className="items-center justify-center p-10">
          <div className="w-[440px] rounded-2xl border border-border bg-surface-raised p-5">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-surface-overlay text-xs">AK</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-fg">Ada Khanna</p>
                <p className="text-xs text-fg-tertiary">Shipped the catalog thumbs</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-fg">
              Cards should look like a cropped product, not a name on a dotted grid.
            </p>
          </div>
        </Fill>
      );
    case "kanban-board":
      return componentScene("kanban", "data-display");
    case "audit-log":
    case "order-history":
    case "order-tracking":
    case "payouts":
      return (
        <AppShell>
          <DataRows />
        </AppShell>
      );
    case "page-header":
    case "filter-bar":
      return (
        <Fill className="p-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-3xl tracking-[-0.03em] text-fg">Customers</p>
              <p className="mt-1 text-sm text-fg-secondary">Everyone on a paid plan.</p>
            </div>
            <Button size="sm" tabIndex={-1} type="button">
              Invite
            </Button>
          </div>
          <div className="mt-6 flex gap-2">
            <div className="h-9 flex-1 rounded-lg border border-border bg-surface-inset" />
            <Button size="sm" variant="outline" tabIndex={-1} type="button">
              Filter
            </Button>
          </div>
        </Fill>
      );
    case "empty-state":
      return componentScene("empty", "data-display");
    case "status-page":
      return (
        <Fill className="p-10">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-success" />
            <p className="font-display text-2xl tracking-[-0.02em] text-fg">All systems go</p>
          </div>
          <div className="mt-6 space-y-3">
            {["API", "Registry", "Docs"].map((row) => (
              <div
                key={row}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
              >
                <span className="text-sm text-fg">{row}</span>
                <Badge variant="success">Operational</Badge>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "notification-panel":
      return (
        <Fill className="items-center justify-center p-10">
          <div className="w-[400px] overflow-hidden rounded-2xl border border-border bg-surface-floating shadow-sm">
            <div className="border-b border-border px-4 py-3 text-sm font-medium text-fg">
              Notifications
            </div>
            {["Theme published", "New comment", "Invoice paid"].map((item) => (
              <div key={item} className="border-b border-border-soft px-4 py-3 last:border-b-0">
                <p className="text-sm text-fg">{item}</p>
                <p className="text-xs text-fg-tertiary">2 hours ago</p>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "nps-survey":
    case "feedback-form":
    case "contact-form":
      return (
        <Fill className="items-center justify-center p-10">
          <div className="w-[440px] rounded-2xl border border-border bg-surface-raised p-6">
            <p className="font-display text-xl tracking-[-0.02em] text-fg">
              How likely are you to recommend us?
            </p>
            <div className="mt-5 flex gap-1.5">
              {range(10).map((score) => (
                <span
                  key={`nps-${score}`}
                  className={cn(
                    "grid h-9 flex-1 place-items-center rounded-md text-xs",
                    score === 8
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-fg-secondary",
                  )}
                >
                  {score + 1}
                </span>
              ))}
            </div>
          </div>
        </Fill>
      );
    case "integrations":
      return (
        <Fill className="p-8">
          <p className="mb-4 font-display text-xl tracking-[-0.02em] text-fg">Integrations</p>
          <div className="grid grid-cols-2 gap-3">
            {["GitHub", "Linear", "Vercel", "Stripe"].map((name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
              >
                <span className="text-sm text-fg">{name}</span>
                <Badge variant="outline">Connect</Badge>
              </div>
            ))}
          </div>
        </Fill>
      );
    case "cancel-flow":
      return (
        <ModalChrome>
          <p className="font-display text-lg tracking-[-0.02em] text-fg">Cancel Pro?</p>
          <p className="mt-2 text-sm text-fg-secondary">
            You'll keep access until the period ends on Aug 28.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button size="sm" variant="outline" tabIndex={-1} type="button">
              Keep plan
            </Button>
            <Button size="sm" variant="destructive" tabIndex={-1} type="button">
              Cancel
            </Button>
          </div>
        </ModalChrome>
      );
    default:
      switch (categorySlug) {
        case "auth":
          return blockScene("login", "auth");
        case "marketing":
          return <HeroScene />;
        case "dashboard":
        case "admin":
        case "application":
        case "shell":
          return <DashboardScene />;
        case "commerce":
        case "store":
          return blockScene("product-grid", "commerce");
        case "billing":
          return blockScene("checkout", "billing");
        case "ai":
          return <ChatScene />;
        case "email":
          return blockScene("email-welcome", "email");
        case "states":
          return blockScene("not-found", "states");
        default:
          return <HeroScene title="A composed section" body="Copy-paste UI from Cronus blocks." />;
      }
  }
}

export function ComponentCatalogThumb({
  slug,
  categorySlug,
}: {
  slug: string;
  categorySlug: string;
}) {
  return <ScaledStage>{componentScene(slug, categorySlug)}</ScaledStage>;
}

export function BlockCatalogThumb({ slug, categorySlug }: { slug: string; categorySlug: string }) {
  return <ScaledStage>{blockScene(slug, categorySlug)}</ScaledStage>;
}
