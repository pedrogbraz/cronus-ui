"use client";

import { CronusUIProvider, useTheme } from "@cronus-ui/theme";
import type { ThemeName } from "@cronus-ui/tokens";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  cn,
  Input,
  Label,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Slider,
  Switch,
} from "@cronus-ui/ui";
import { Check, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Eyebrow, SectionGlow } from "../showcase-ui";

/** The five shipped presets, each with a fixed swatch derived from its `primary`. */
const THEMES = [
  { name: "aurora", label: "Aurora", swatch: "oklch(0.685 0.169 237.3)" },
  { name: "neutral", label: "Neutral", swatch: "oklch(0.62 0 0)" },
  { name: "midnight", label: "Midnight", swatch: "oklch(0.55 0.205 280)" },
  { name: "sunset", label: "Sunset", swatch: "oklch(0.78 0.16 65)" },
  { name: "emerald", label: "Emerald", swatch: "oklch(0.74 0.16 160)" },
] as const;

/** Static bar heights for the preview chart (percent) — stable across renders. */
const BARS = [38, 62, 45, 78, 56, 90, 68];

/**
 * Signature section. Theme chips recolor the catalog inside the pane.
 * Light/dark is the landing mode — the glass samples the page. A nested
 * opposite mode puts light type on dark glass (or a solid plate on light).
 */
export function LiveTheming() {
  const { mode: chromeMode, toggleMode } = useTheme();
  const [theme, setTheme] = useState<ThemeName>("aurora");
  const [radius, setRadius] = useState(14);
  const isDark = chromeMode === "dark";

  return (
    <section id="theming" className="relative scroll-mt-20">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>Live theming</Eyebrow>
          <h2 className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl">
            One palette. The whole product follows.
          </h2>
          <p className="max-w-2xl text-fg-secondary">
            Pick a theme — every surface, border, gradient and shadow in the preview re-themes
            instantly. No re-render, no rebuild. This is the whole idea.
          </p>
        </div>

        {/* Controls stay on Neutral chrome so they follow the page light/dark. */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {THEMES.map((t) => {
              const active = theme === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setTheme(t.name)}
                  aria-pressed={active}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium outline-none transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-border-strong bg-surface-overlay text-fg shadow-xs"
                      : "border-border bg-surface-raised text-fg-secondary hover:border-border-strong hover:text-fg",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-4 rounded-full ring-1 ring-inset ring-border transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)]",
                      active ? "scale-100" : "scale-90 group-hover:scale-100",
                    )}
                    style={{ background: t.swatch }}
                  />
                  {t.label}
                  {active ? <Check className="size-3.5 text-fg" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>

          <span aria-hidden="true" className="hidden h-6 w-px bg-border sm:block" />

          <button
            type="button"
            onClick={toggleMode}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-sm font-medium text-fg-secondary outline-none transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <Moon className="size-4" aria-hidden="true" />
            ) : (
              <Sun className="size-4" aria-hidden="true" />
            )}
            {isDark ? "Dark" : "Light"}
          </button>

          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-surface-raised px-3.5 py-1.5 text-sm text-fg-secondary">
            <span className="whitespace-nowrap">Radius</span>
            <Slider
              value={[radius]}
              onValueChange={([next]) => setRadius(next ?? 14)}
              max={28}
              step={1}
              aria-label="Corner radius"
              className="w-28"
            />
            <span className="w-10 text-right font-mono text-xs tabular-nums text-fg-tertiary">
              {radius}px
            </span>
          </div>
        </div>

        {/* Pane is Neutral chrome glass — theme/mode of the page. The
            nested provider re-themes only the catalog inside. */}
        <div
          data-slot="theme-stage"
          data-cronus-look="glass"
          data-cronus-mode={chromeMode}
          className="mt-8 text-fg"
        >
          <div
            data-slot="card"
            className="relative rounded-2xl border text-fg backdrop-blur-[40px] backdrop-saturate-150"
          >
            <CronusUIProvider
              defaultThemeName={theme}
              defaultModeName={chromeMode}
              overrides={{ radius: `${radius}px` }}
              key={`${theme}-${chromeMode}`}
              className="text-fg"
            >
              <div className="relative flex items-center justify-between border-b border-border/50 px-4 py-3 sm:px-6">
                <span className="font-mono text-xs text-fg-secondary">app.cronus.dev</span>
                <Badge variant="outline" className="capitalize">
                  {theme}
                </Badge>
              </div>

              <div className="relative grid gap-x-6 gap-y-5 px-4 pb-5 sm:px-6 sm:pb-6 lg:grid-cols-3">
                <div className="flex flex-col gap-4 pt-5 lg:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <Metric>
                      <MetricLabel>Monthly revenue</MetricLabel>
                      <MetricValue>$248,900</MetricValue>
                      <MetricDelta trend="up">+18.2% vs last month</MetricDelta>
                    </Metric>
                    <div className="flex gap-2">
                      <Badge variant="success">Live</Badge>
                      <Badge variant="info" className="capitalize">
                        {theme}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex h-28 items-end gap-2">
                    {BARS.map((h, i) => (
                      <div
                        key={h}
                        className={cn(
                          "flex-1 rounded-t-md transition-[height] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                          i === BARS.length - 1 ? "bg-primary" : "bg-primary/20",
                        )}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-border/50 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-5">
                  <div>
                    <p className="text-sm font-medium text-fg">Your team</p>
                    <div className="mt-3 flex -space-x-2">
                      {["AK", "MR", "JD", "SL"].map((initials) => (
                        <Avatar key={initials} className="size-8 border-2 border-border/60">
                          <AvatarFallback className="bg-surface-overlay/70 text-[11px] text-fg-secondary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      <span className="grid size-8 place-items-center rounded-full border-2 border-border/60 bg-surface-overlay/70 text-[11px] font-medium text-fg-secondary">
                        +9k
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="w-full">
                      Deploy
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Invite
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-border/50 pt-5 lg:col-span-3">
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="theming-email">Work email</Label>
                      <Input id="theming-email" placeholder="you@cronus.dev" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="theming-notify" defaultChecked aria-label="Notifications" />
                      <Label htmlFor="theming-notify" className="text-fg-secondary">
                        Notify me
                      </Label>
                    </div>
                    <Button size="md">Subscribe</Button>
                  </div>
                </div>
              </div>
            </CronusUIProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
