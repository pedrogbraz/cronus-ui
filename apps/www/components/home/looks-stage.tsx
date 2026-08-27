"use client";

import { useTheme } from "@cronus-ui/theme";
import { type LookName, lookLabels, lookNames } from "@cronus-ui/tokens";
import { Badge, Button, cn, Input, Label } from "@cronus-ui/ui";
import { useState } from "react";
import { Eyebrow, SectionGlow } from "../showcase-ui";

const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

/**
 * One specimen restyles across Default, Brutalist, and Glass on the page
 * theme. Look is orthogonal to theme and mode.
 */
export function LooksStage() {
  const { mode } = useTheme();
  const [look, setLook] = useState<LookName>("default");
  const isGlass = look === "glass";

  return (
    <section id="looks" className="relative scroll-mt-20">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>Looks</Eyebrow>
          <h2 className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl">
            One system. Three materials.
          </h2>
          <p className="max-w-2xl text-fg-secondary">
            Default, Brutalist, and Glass sit on the same tokens. Switch the look — radius, border,
            shadow, and surface follow. Theme and mode stay independent.
          </p>
        </div>

        <fieldset className="mt-8 flex flex-wrap items-center gap-1 border-0 p-0">
          <legend className="sr-only">Looks</legend>
          {lookNames.map((name) => {
            const active = look === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setLook(name)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm outline-none transition-colors duration-150",
                  EASE,
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border border-border-strong bg-surface-overlay font-medium text-fg"
                    : "text-fg-tertiary hover:text-fg",
                )}
              >
                {lookLabels[name]}
              </button>
            );
          })}
        </fieldset>

        <div
          data-slot="look-stage"
          data-cronus-look={look}
          {...(isGlass ? { "data-cronus-mode": mode } : {})}
          className={cn("mt-6 rounded-3xl", isGlass && "overflow-hidden p-6 sm:p-10 text-fg")}
        >
          <div
            data-slot="card"
            className={cn(
              "relative p-6 sm:p-8",
              isGlass
                ? "rounded-3xl border text-fg backdrop-blur-[40px] backdrop-saturate-150"
                : "rounded-2xl border border-border bg-surface-raised",
            )}
          >
            <div className="relative flex flex-wrap items-center gap-2">
              <Badge variant="outline">{lookLabels[look]}</Badge>
              <Badge variant="success">Stable</Badge>
            </div>
            <h3 className="relative mt-5 font-display text-2xl tracking-[-0.02em] text-fg">
              The same tokens. Different material.
            </h3>
            <p className="relative mt-3 max-w-xl text-sm leading-6 text-fg-secondary">
              Radius, border, shadow, and surface follow the look. Buttons stay solid primary and
              outline — the catalog, not a second skin.
            </p>
            <div className="relative mt-6 flex flex-wrap items-center gap-3">
              <Button>Get started</Button>
              <Button variant="outline">View documentation</Button>
            </div>
            <div className="relative mt-8 grid gap-3 border-t border-border/50 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="looks-email">Work email</Label>
                <Input id="looks-email" placeholder="you@cronus.dev" />
              </div>
              <Button variant="outline">Subscribe</Button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-fg-tertiary">
          Apply with <code className="text-fg-secondary">data-cronus-look=&quot;{look}&quot;</code>{" "}
          on any subtree — the docs chrome stays Default.
        </p>
      </div>
    </section>
  );
}
