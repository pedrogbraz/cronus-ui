"use client";

import { useTheme } from "@cooud-ui/theme";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Slider,
  Switch,
} from "@cooud-ui/ui";
import { ArrowRight, BookOpen, Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { COMPONENT_COUNT } from "../lib/components-index";

const INSTALL_COMMAND = "npx cooud-ui add button";

/** Pull a px number out of a `radius` override (or fall back to the default). */
function parseRadius(radius: string | undefined): number {
  if (!radius) return 14;
  const n = Number.parseInt(radius, 10);
  return Number.isNaN(n) ? 14 : n;
}

export function Hero() {
  const [copied, setCopied] = useState(false);
  const { theme, overrides, setTheme, setOverrides } = useTheme();

  const isAurora = theme === "aurora";
  const radius = parseRadius(overrides.radius);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard may be unavailable — ignore.
    }
  }

  return (
    <section id="top" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      {/* Aurora glow — single animated blur layer.
          `transform-gpu` + `will-change-transform` keep the drift on the
          compositor; `motion-reduce:animate-none` parks it for reduced-motion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[28rem] transform-gpu bg-gradient-aurora opacity-25 blur-3xl animate-aurora [will-change:transform] motion-reduce:animate-none"
      />
      {/* Faint dotted grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--cooud-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.4,
        }}
      />

      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised/60 px-3 py-1 text-xs text-fg-secondary backdrop-blur">
          <span aria-hidden="true" className="size-2 rounded-full bg-fg-tertiary" />
          {COMPONENT_COUNT} components · 5 crafted themes
        </div>

        {/* Headline */}
        <h1 className="mt-6 max-w-4xl text-balance font-display text-5xl leading-[1.04] tracking-[-0.03em] text-fg sm:text-7xl">
          The design system that <span className="text-fg-secondary">themes itself</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-balance text-lg text-fg-secondary">
          Accessible, themeable, token-driven React components. One source of truth re-themes your
          entire app live — swap a palette and every surface, border, and gradient follows.
        </p>

        {/* Install command chip */}
        <div className="mt-8 inline-flex h-11 items-center gap-3 rounded-xl border border-border bg-surface-inset px-4 font-mono text-sm shadow-xs">
          <span className="text-fg-tertiary" aria-hidden="true">
            $
          </span>
          <span className="text-fg">npx cooud-ui add button</span>
          <button
            type="button"
            onClick={copyCommand}
            aria-label={copied ? "Copied to clipboard" : "Copy install command"}
            className="grid size-7 place-items-center rounded-md text-fg-tertiary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? (
              <Check className="size-4 text-success" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild variant="gradient" size="lg">
            <a href="/create">
              Create a system
              <ArrowRight aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/docs/installation">
              <BookOpen aria-hidden="true" />
              Read docs
            </a>
          </Button>
        </div>

        {/* Floating component preview cluster */}
        <div className="relative mt-20 w-full max-w-5xl">
          {/* secondary aurora behind the cluster — static; promoted to its own
              composited layer so the heavy blur is painted once, not on every
              repaint of the aurora drift above it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-8 -z-10 h-72 transform-gpu bg-gradient-aurora opacity-20 blur-3xl [contain:paint]"
          />

          <div className="grid grid-cols-1 items-start gap-6 text-left md:grid-cols-12">
            {/* Pricing-style card */}
            <div className="md:col-span-5">
              <Card className="h-full border-border bg-surface-raised/80 shadow-lg backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pro</CardTitle>
                    <Badge variant="primary">
                      <Sparkles aria-hidden="true" />
                      Popular
                    </Badge>
                  </div>
                  <CardDescription>Everything to ship a themeable product.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-baseline gap-1">
                  <span className="font-display text-4xl tracking-[-0.025em] text-fg">$0</span>
                  <span className="text-sm text-fg-tertiary">/ forever</span>
                </CardContent>
                <CardFooter>
                  <Button variant="gradient" className="w-full">
                    Start building
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Center stack — controls & buttons */}
            <div className="flex flex-col gap-6 md:col-span-4">
              <div className="rounded-2xl border border-border bg-surface-raised/80 p-4 shadow-xs backdrop-blur">
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="gradient">
                    Gradient
                  </Button>
                  <Button size="sm" variant="outline">
                    Outline
                  </Button>
                  <Button size="sm" variant="ghost">
                    Ghost
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge variant="success">Stable</Badge>
                  <Badge variant="warning">Beta</Badge>
                  <Badge variant="info">New</Badge>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised/80 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hero-dark">Aurora mode</Label>
                  <Switch
                    id="hero-dark"
                    checked={isAurora}
                    onCheckedChange={(next) => setTheme(next ? "aurora" : "neutral")}
                    aria-label="Toggle aurora mode"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="hero-radius">Corner radius</Label>
                  <Slider
                    id="hero-radius"
                    value={[radius]}
                    onValueChange={([next]) => setOverrides({ ...overrides, radius: `${next}px` })}
                    max={28}
                    step={1}
                    aria-label="Corner radius"
                  />
                </div>
              </div>
            </div>

            {/* Right stack — avatars & metric */}
            <div className="flex flex-col gap-6 md:col-span-3">
              <div className="rounded-2xl border border-border bg-surface-raised/80 p-4 shadow-lg backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wider text-fg-tertiary">
                  Trusted by
                </p>
                <div className="mt-3 flex -space-x-2">
                  {["AK", "MR", "JD", "SL"].map((initials) => (
                    <Avatar
                      key={initials}
                      className="size-9 border-2 border-surface-raised shadow-xs"
                    >
                      <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <span className="grid size-9 place-items-center rounded-full border-2 border-surface-raised bg-surface-overlay text-xs font-medium text-fg-secondary">
                    +9k
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface-raised/80 p-4 shadow-xs backdrop-blur">
                <Metric>
                  <MetricLabel>Themes shipped</MetricLabel>
                  <MetricValue>12,480</MetricValue>
                  <MetricDelta trend="up">+24% this week</MetricDelta>
                </Metric>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
