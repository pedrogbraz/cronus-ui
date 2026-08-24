"use client";

import { Avatar, AvatarFallback } from "@cooud-ui/ui/avatar";
import { Badge } from "@cooud-ui/ui/badge";
import { Button } from "@cooud-ui/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cooud-ui/ui/card";
import { Input } from "@cooud-ui/ui/input";
import { Label } from "@cooud-ui/ui/label";
import { Metric, MetricDelta, MetricLabel, MetricValue } from "@cooud-ui/ui/metric";
import { Separator } from "@cooud-ui/ui/separator";
import { Slider } from "@cooud-ui/ui/slider";
import { Switch } from "@cooud-ui/ui/switch";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CATEGORIES, COMPONENT_COUNT } from "../../lib/components-index";
import { Eyebrow, PreviewFrame, SectionGlow } from "../showcase-ui";

/**
 * A single collage tile: a tiny uppercase caption above a dotted-grid
 * `PreviewFrame` that renders a live cluster of real Cooud UI components.
 * `h-full` + `flex-1` keep every tile flush to its grid row height.
 */
function Tile({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
        {caption}
      </span>
      <PreviewFrame className="flex-1">{children}</PreviewFrame>
    </div>
  );
}

/** One aurora theme swatch — a token-driven color dot. */
function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <span
      role="img"
      title={label}
      aria-label={label}
      className={`size-7 rounded-full border border-border/60 shadow-xs ${className}`}
    />
  );
}

export function ComponentShowcase() {
  return (
    <section id="components" className="relative scroll-mt-20 border-t border-border/60">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-3">
          <Eyebrow>Component library</Eyebrow>
          <h2 className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl">
            {COMPONENT_COUNT} components, fully documented
          </h2>
          <p className="max-w-2xl text-fg-secondary">
            Buttons to charts, forms to overlays — every one live-previewed, accessible, and
            token-driven.
          </p>
        </div>

        {/* The live collage — real, interactive components */}
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* 1 · Buttons */}
          <Tile caption="Buttons">
            <div className="flex w-full flex-wrap items-center justify-center gap-2">
              <Button size="sm" variant="gradient">
                Gradient
              </Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
            </div>
          </Tile>

          {/* 2 · Badges & status */}
          <Tile caption="Badges">
            <div className="flex w-full flex-wrap items-center justify-center gap-2">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Stable</Badge>
              <Badge variant="warning">Beta</Badge>
              <Badge variant="info">New</Badge>
              <Badge variant="outline">Draft</Badge>
            </div>
          </Tile>

          {/* 3 · Form controls */}
          <Tile caption="Controls">
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="showcase-email">Email</Label>
                <Input id="showcase-email" type="email" placeholder="you@cooud.com" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showcase-notify">Notifications</Label>
                <Switch id="showcase-notify" defaultChecked aria-label="Notifications" />
              </div>
              <Slider aria-label="Preview value" defaultValue={[64]} max={100} step={1} />
            </div>
          </Tile>

          {/* 4 · Data — metric + avatar group */}
          <Tile caption="Data">
            <div className="flex w-full flex-col gap-5">
              <Metric>
                <MetricLabel>Themes shipped</MetricLabel>
                <MetricValue>12,480</MetricValue>
                <MetricDelta trend="up">+24%</MetricDelta>
              </Metric>
              <div className="flex -space-x-2">
                {["AK", "MR", "JD", "SL"].map((initials) => (
                  <Avatar key={initials} className="size-9 border-2 border-surface-inset shadow-xs">
                    <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <span className="grid size-9 place-items-center rounded-full border-2 border-surface-inset bg-surface-overlay text-xs font-medium text-fg-secondary">
                  +9k
                </span>
              </div>
            </div>
          </Tile>

          {/* 5 · Card */}
          <Tile caption="Card">
            <Card className="w-full border-border bg-surface-raised shadow-xs">
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>Everything to ship a themeable product.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="gradient" className="w-full">
                  Start building
                  <ArrowRight aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </Tile>

          {/* 6 · Theme swatches */}
          <Tile caption="Theming">
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Swatch className="bg-gradient-primary" label="Aurora gradient" />
                <Swatch className="bg-primary" label="Primary" />
                <Swatch className="bg-success" label="Success" />
                <Swatch className="bg-warning" label="Warning" />
                <Swatch className="bg-info" label="Info" />
                <Swatch className="bg-error" label="Error" />
              </div>
              <Separator />
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="outline">Aurora</Badge>
                <Badge variant="outline">Neutral</Badge>
                <Badge variant="outline">Your brand</Badge>
              </div>
            </div>
          </Tile>
        </div>

        {/* Category pills — one per component group */}
        <div className="mt-10 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/components#${category.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3.5 py-1.5 text-sm text-fg-secondary outline-none transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              {category.name}
              <span className="text-fg-tertiary">{category.items.length}</span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button asChild variant="gradient" size="lg">
            <Link href="/components">
              Explore all components
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
