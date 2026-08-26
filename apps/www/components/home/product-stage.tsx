"use client";

import { Avatar, AvatarFallback } from "@kronus-ui/ui/avatar";
import { Badge } from "@kronus-ui/ui/badge";
import { Button } from "@kronus-ui/ui/button";
import { Input } from "@kronus-ui/ui/input";
import { Label } from "@kronus-ui/ui/label";
import { Metric, MetricDelta, MetricLabel, MetricValue } from "@kronus-ui/ui/metric";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kronus-ui/ui/tabs";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Eyebrow, SectionGlow } from "../showcase-ui";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const BARS = [44, 61, 38, 80, 55, 92, 70];

function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-base shadow-lg">
      <div className="flex items-center gap-2 border-b border-border bg-surface-inset px-4 py-2.5">
        <span aria-hidden="true" className="size-2 rounded-full bg-fg-tertiary/50" />
        <span aria-hidden="true" className="size-2 rounded-full bg-fg-tertiary/50" />
        <span aria-hidden="true" className="size-2 rounded-full bg-fg-tertiary/50" />
        <p className="ms-2 font-mono text-[11px] text-fg-tertiary">{title}</p>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <Frame title="app.kronus.dev/overview">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <Metric>
            <MetricLabel>Revenue</MetricLabel>
            <MetricValue>{money.format(48290)}</MetricValue>
            <MetricDelta trend="up">+9.4%</MetricDelta>
          </Metric>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <Metric>
            <MetricLabel>Active seats</MetricLabel>
            <MetricValue>128</MetricValue>
            <MetricDelta trend="up">+12</MetricDelta>
          </Metric>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <Metric>
            <MetricLabel>Upgrade rate</MetricLabel>
            <MetricValue>64%</MetricValue>
            <MetricDelta trend="down">−1.1%</MetricDelta>
          </Metric>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4 lg:col-span-2">
          <p className="text-xs font-medium text-fg-tertiary">Weekly activation</p>
          <div className="mt-4 flex h-28 items-end gap-2">
            {BARS.map((height, index) => (
              <div
                key={height}
                className="flex-1 rounded-sm bg-primary/40"
                style={{ height: `${height}%` }}
              >
                <span className="sr-only">
                  Week {index + 1}: {height} percent
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="text-xs font-medium text-fg-tertiary">Team</p>
          <ul className="mt-3 flex flex-col gap-2">
            {["Maya Chen", "Amina Ruiz", "Jonah Kole"].map((name) => (
              <li key={name} className="flex items-center gap-2 text-sm text-fg">
                <Avatar className="size-6">
                  <AvatarFallback className="text-[9px]">{name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

function AuthPreview() {
  return (
    <Frame title="app.kronus.dev/login">
      <div className="mx-auto max-w-sm">
        <h3 className="font-display text-2xl font-normal tracking-[-0.02em] text-fg">
          Welcome back
        </h3>
        <p className="mt-1 text-sm text-fg-secondary">Sign in to the composed SaaS.</p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stage-email">Work email</Label>
            <Input
              id="stage-email"
              type="email"
              autoComplete="email"
              placeholder="you@kronus.dev"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stage-password">Password</Label>
            <Input id="stage-password" type="password" autoComplete="current-password" />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Continue
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-fg-tertiary">Preview only — nothing is sent.</p>
      </div>
    </Frame>
  );
}

function BillingPreview() {
  return (
    <Frame title="app.kronus.dev/billing">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="flex flex-col rounded-xl border border-border bg-surface-raised p-5">
          <p className="text-sm font-medium text-fg">Free</p>
          <p className="mt-3 font-display text-4xl font-normal tracking-[-0.03em] text-fg">
            {money.format(0)}
          </p>
          <p className="mt-1 text-sm text-fg-tertiary">The engine. Forever.</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-fg-secondary">
            {["Tokens, looks, SaaS", "Compose + upgrade", "AI Kit"].map((row) => (
              <li key={row} className="flex items-center gap-2">
                <Check className="size-3.5 text-fg" aria-hidden="true" />
                {row}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-6">
            Stay on OSS
          </Button>
        </article>
        <article className="flex flex-col rounded-xl border border-border-strong bg-surface-raised p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-fg">Team</p>
            <Badge variant="primary">Recommended</Badge>
          </div>
          <p className="mt-3 font-display text-4xl font-normal tracking-[-0.03em] text-fg">
            {money.format(24)}
            <span className="ms-1 text-base text-fg-tertiary">/ seat</span>
          </p>
          <p className="mt-1 text-sm text-fg-tertiary">A demo plan in the composed app.</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-fg-secondary">
            {["Everything in Free", "Priority queue (demo)", "Shared workspace"].map((row) => (
              <li key={row} className="flex items-center gap-2">
                <Check className="size-3.5 text-fg" aria-hidden="true" />
                {row}
              </li>
            ))}
          </ul>
          <Button variant="primary" className="mt-6">
            Upgrade demo
          </Button>
        </article>
      </div>
    </Frame>
  );
}

/**
 * Tabbed live surfaces — the landing proof that Kronus is a product system,
 * not a sticker sheet of buttons.
 */
export function ProductStage() {
  return (
    <section aria-labelledby="stage-heading" className="relative border-t border-border/60">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>Live product</Eyebrow>
          <h2
            id="stage-heading"
            className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl"
          >
            The catalog, running as an app
          </h2>
          <p className="max-w-2xl text-fg-secondary">
            Dashboard, auth, billing — real Kronus components, not screenshots. This is what compose
            writes.
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="mt-10">
          <TabsList aria-label="Product previews">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
            <DashboardPreview />
          </TabsContent>
          <TabsContent value="auth" className="mt-6">
            <AuthPreview />
          </TabsContent>
          <TabsContent value="billing" className="mt-6">
            <BillingPreview />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
