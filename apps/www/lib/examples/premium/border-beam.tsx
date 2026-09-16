"use client";

import { BorderBeam, Button } from "@cronus-ui/ui";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "featured-card",
    title: "Featured card",
    description:
      "A single light head continuously orbits the border like a comet — the calm way to say “this is the one”. It's one composited CSS animation (no JS, no re-renders) and is fully suppressed under prefers-reduced-motion.",
    code: `<BorderBeam duration={6} className="w-full max-w-xs">
  <div className="flex flex-col gap-4 rounded-2xl bg-surface-raised p-6">
    <div className="flex items-center justify-between">
      <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-fg">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-fg-secondary">
        Popular
      </span>
    </div>
    <div>
      <h3 className="font-display text-base font-semibold text-fg">Pro</h3>
      <p className="mt-1 text-sm text-fg-secondary">Tudo para escalar a sua loja.</p>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="font-display text-3xl font-semibold text-fg">R$ 79</span>
      <span className="text-sm text-fg-tertiary">/ mês</span>
    </div>
    <Button variant="primary" className="w-full">
      Assinar o Pro
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
  </div>
</BorderBeam>`,
    preview: (
      <BorderBeam duration={6} className="w-full max-w-xs">
        <div className="flex flex-col gap-4 rounded-2xl bg-surface-raised p-6">
          <div className="flex items-center justify-between">
            <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-fg">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-fg-secondary">
              Popular
            </span>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-fg">Pro</h3>
            <p className="mt-1 text-sm text-fg-secondary">Tudo para escalar a sua loja.</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold text-fg">R$ 79</span>
            <span className="text-sm text-fg-tertiary">/ mês</span>
          </div>
          <Button variant="primary" className="w-full">
            Assinar o Pro
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </BorderBeam>
    ),
  },
  {
    id: "prompt-bar",
    title: "Prompt bar",
    description:
      "The beam isn't only for cards — wrap an input to give an AI prompt bar a living, premium edge. A larger `size` reads as a longer comet trail.",
    code: `<BorderBeam size={80} duration={5} className="w-full max-w-md">
  <div className="flex items-center gap-3 rounded-2xl bg-surface-raised px-4 py-3">
    <Sparkles className="size-4 shrink-0 text-primary" aria-hidden="true" />
    <span className="flex-1 truncate text-sm text-fg-tertiary">
      Pergunte qualquer coisa ao Cronus…
    </span>
    <Button size="icon" variant="primary" aria-label="Enviar">
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
  </div>
</BorderBeam>`,
    preview: (
      <BorderBeam size={80} duration={5} className="w-full max-w-md">
        <div className="flex items-center gap-3 rounded-2xl bg-surface-raised px-4 py-3">
          <Sparkles className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="flex-1 truncate text-sm text-fg-tertiary">
            Pergunte qualquer coisa ao Cronus…
          </span>
          <Button size="icon" variant="primary" aria-label="Enviar">
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </BorderBeam>
    ),
  },
  {
    id: "custom-colours",
    title: "Custom colours & reverse",
    description:
      "Every knob rides a CSS variable: set `colorFrom`/`colorTo` for a token-bound head and `reverse` to orbit counter-clockwise. Here the trail is foreground fading out.",
    code: `<BorderBeam
  colorFrom="var(--cronus-fg)"
  colorTo="transparent"
  size={90}
  duration={5}
  reverse
  className="w-full max-w-xs"
>
  <div className="flex flex-col gap-3 rounded-2xl bg-surface-raised p-6">
    <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-fg">
      <ShieldCheck className="size-4" aria-hidden="true" />
    </span>
    <h3 className="font-display text-base font-semibold text-fg">Pagamentos protegidos</h3>
    <p className="text-sm text-fg-secondary">
      Antifraude e 3-D Secure em cada transação — o feixe reverso mantém o olhar na borda.
    </p>
  </div>
</BorderBeam>`,
    preview: (
      <BorderBeam
        colorFrom="var(--cronus-fg)"
        colorTo="transparent"
        size={90}
        duration={5}
        reverse
        className="w-full max-w-xs"
      >
        <div className="flex flex-col gap-3 rounded-2xl bg-surface-raised p-6">
          <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-fg">
            <ShieldCheck className="size-4" aria-hidden="true" />
          </span>
          <h3 className="font-display text-base font-semibold text-fg">Pagamentos protegidos</h3>
          <p className="text-sm text-fg-secondary">
            Antifraude e 3-D Secure em cada transação — o feixe reverso mantém o olhar na borda.
          </p>
        </div>
      </BorderBeam>
    ),
  },
];

/** Stacked list view for `/components/border-beam`; loaded on its own by the premium family. */
export default function BorderBeamExamples() {
  return <ExampleList examples={examples} />;
}
