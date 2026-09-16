"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Reveal } from "@cronus-ui/ui";
import { Sparkles } from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "scroll-reveal",
    title: "Scroll reveal",
    description:
      "Wrap any content to fade and slide it into view as it enters the viewport. The reveal fires once, then settles. Scroll it into frame to see it animate.",
    code: `<Reveal>
  <Card className="w-full">
    <CardHeader>
      <span className="mb-1 grid size-11 place-items-center rounded-xl bg-surface-overlay text-fg">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <CardTitle className="text-2xl">Reveal as you scroll</CardTitle>
      <CardDescription className="text-base">
        This card fades and slides into view the moment it enters the viewport. Give it room
        so the entrance is unmistakable.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-5 text-sm text-fg-secondary">
      <p className="leading-relaxed">
        Wrap any block — a hero, a pricing tier, a feature grid — and it arrives with intent
        instead of popping in. Reveals fire a single time, so the section settles instead of
        replaying as you scroll past.
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-display text-2xl font-semibold text-fg">Fade</p>
          <p className="mt-1 text-xs text-fg-tertiary">opacity 0 → 1</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-display text-2xl font-semibold text-fg">Slide</p>
          <p className="mt-1 text-xs text-fg-tertiary">y 24 → 0</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-display text-2xl font-semibold text-fg">Once</p>
          <p className="mt-1 text-xs text-fg-tertiary">no replay</p>
        </div>
      </div>
    </CardContent>
  </Card>
</Reveal>`,
    preview: (
      <Reveal>
        <Card className="w-full">
          <CardHeader>
            <span className="mb-1 grid size-11 place-items-center rounded-xl bg-surface-overlay text-fg">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <CardTitle className="text-2xl">Reveal as you scroll</CardTitle>
            <CardDescription className="text-base">
              This card fades and slides into view the moment it enters the viewport. Give it room
              so the entrance is unmistakable.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 text-sm text-fg-secondary">
            <p className="leading-relaxed">
              Wrap any block — a hero, a pricing tier, a feature grid — and it arrives with intent
              instead of popping in. Reveals fire a single time, so the section settles instead of
              replaying as you scroll past.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-surface-raised p-4">
                <p className="font-display text-2xl font-semibold text-fg">Fade</p>
                <p className="mt-1 text-xs text-fg-tertiary">opacity 0 → 1</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-raised p-4">
                <p className="font-display text-2xl font-semibold text-fg">Slide</p>
                <p className="mt-1 text-xs text-fg-tertiary">y 24 → 0</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-raised p-4">
                <p className="font-display text-2xl font-semibold text-fg">Once</p>
                <p className="mt-1 text-xs text-fg-tertiary">no replay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    ),
  },
];

/** Stacked list view for `/components/reveal`; loaded on its own by the premium family. */
export default function RevealExamples() {
  return <ExampleList examples={examples} />;
}
