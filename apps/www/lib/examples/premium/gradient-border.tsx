"use client";

import { GradientBorder } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "with-glow",
    title: "With glow",
    description: "Pass `glow` to add a quiet shadow that draws the eye to a featured surface.",
    code: `<GradientBorder glow innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
  <h3 className="font-display text-base font-semibold text-fg">Pro plan</h3>
  <p className="text-sm text-fg-secondary">
    The hairline ring draws the eye to your highest-value surface.
  </p>
  <div className="flex items-baseline gap-1">
    <span className="font-display text-2xl font-semibold text-fg">$29</span>
    <span className="text-sm text-fg-tertiary">/ month</span>
  </div>
</GradientBorder>`,
    preview: (
      <GradientBorder glow innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
        <h3 className="font-display text-base font-semibold text-fg">Pro plan</h3>
        <p className="text-sm text-fg-secondary">
          The hairline ring draws the eye to your highest-value surface.
        </p>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-2xl font-semibold text-fg">$29</span>
          <span className="text-sm text-fg-tertiary">/ month</span>
        </div>
      </GradientBorder>
    ),
  },
  {
    id: "flat",
    title: "Flat",
    description: "Omit `glow` for the same primary hairline, kept calm for secondary surfaces.",
    code: `<GradientBorder innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
  <h3 className="font-display text-base font-semibold text-fg">Starter plan</h3>
  <p className="text-sm text-fg-secondary">
    The same primary hairline, kept calm and flat for secondary surfaces.
  </p>
  <div className="flex items-baseline gap-1">
    <span className="font-display text-2xl font-semibold text-fg">$0</span>
    <span className="text-sm text-fg-tertiary">/ forever</span>
  </div>
</GradientBorder>`,
    preview: (
      <GradientBorder innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
        <h3 className="font-display text-base font-semibold text-fg">Starter plan</h3>
        <p className="text-sm text-fg-secondary">
          The same primary hairline, kept calm and flat for secondary surfaces.
        </p>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-2xl font-semibold text-fg">$0</span>
          <span className="text-sm text-fg-tertiary">/ forever</span>
        </div>
      </GradientBorder>
    ),
  },
];

/** Stacked list view for `/components/gradient-border`; loaded on its own by the premium family. */
export default function GradientBorderExamples() {
  return <ExampleList examples={examples} />;
}
