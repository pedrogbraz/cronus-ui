"use client";

import { GlassCard } from "@cronus-ui/ui";
import { Sparkles } from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "frosted-surface",
    title: "Frosted surface",
    description:
      "A frosted-glass panel over a quiet inset field — the backdrop-blur needs something behind it, not a rainbow.",
    code: `<div className="relative overflow-hidden rounded-2xl border border-border bg-surface-inset">
  <div className="relative p-6">
    <GlassCard className="flex flex-col gap-3 p-5">
      <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-fg">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <h3 className="font-display text-base font-semibold text-fg">Premium by default</h3>
      <p className="text-sm text-fg-secondary">
        Frosted blur ships out of the box — sit it on a surface, not a Midjourney wash.
      </p>
    </GlassCard>
  </div>
</div>`,
    preview: (
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-inset">
        <div className="relative p-6">
          <GlassCard className="flex flex-col gap-3 p-5">
            <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-fg">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <h3 className="font-display text-base font-semibold text-fg">Premium by default</h3>
            <p className="text-sm text-fg-secondary">
              Frosted blur ships out of the box — sit it on a surface, not a Midjourney wash.
            </p>
          </GlassCard>
        </div>
      </div>
    ),
  },
];

/** Stacked list view for `/components/glass-card`; loaded on its own by the premium family. */
export default function GlassCardExamples() {
  return <ExampleList examples={examples} />;
}
