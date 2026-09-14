"use client";

import { TiltCard } from "@cronus-ui/ui";
import { ArrowRight, User, Wifi, Zap } from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "glare-parallax",
    title: "Glare & parallax",
    description:
      "A real perspective transform that tilts toward the pointer, with a soft `glare` sheen and `parallax` lifting the content toward the viewer on hover. The pointer writes straight to CSS variables inside one rAF — no re-renders — and it flattens under prefers-reduced-motion.",
    code: `<TiltCard glare parallax maxTilt={14} className="w-full max-w-xs">
  <div className="flex flex-col gap-3">
    <span className="grid size-11 place-items-center rounded-xl bg-surface-overlay text-fg">
      <Zap className="size-5" aria-hidden="true" />
    </span>
    <h3 className="font-display text-lg font-semibold text-fg">Repasses instantâneos</h3>
    <p className="text-sm text-fg-secondary">
      O saldo entra no mesmo instante em que a venda é aprovada — sem lote noturno, sem espera.
    </p>
  </div>
</TiltCard>`,
    preview: (
      <TiltCard glare parallax maxTilt={14} className="w-full max-w-xs">
        <div className="flex flex-col gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-surface-overlay text-fg">
            <Zap className="size-5" aria-hidden="true" />
          </span>
          <h3 className="font-display text-lg font-semibold text-fg">Repasses instantâneos</h3>
          <p className="text-sm text-fg-secondary">
            O saldo entra no mesmo instante em que a venda é aprovada — sem lote noturno, sem
            espera.
          </p>
        </div>
      </TiltCard>
    ),
  },
  {
    id: "payment-card",
    title: "Payment card",
    description:
      "Push `maxTilt` and `scale` for a tactile, dramatic feel — a payment-card mockup that leans into the cursor. The surface is inverted fg, not a rainbow fill.",
    code: `<TiltCard
  glare
  parallax
  maxTilt={16}
  scale={1.05}
  className="w-full max-w-sm bg-fg text-fg-inverse"
>
  <div className="flex flex-col gap-6">
    <div className="flex items-start justify-between">
      <span className="font-display text-lg font-semibold">Cronus</span>
      <Wifi className="size-6 rotate-90 opacity-90" aria-hidden="true" />
    </div>
    <div className="h-9 w-12 rounded-md bg-fg-inverse/20 ring-1 ring-fg-inverse/15" aria-hidden="true" />
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xl tracking-[0.25em]">4242 4242 4242 4242</p>
      <div className="flex items-center justify-between text-xs uppercase tracking-wide opacity-90">
        <span>Pedro Gontijo</span>
        <span className="tabular-nums">12/29</span>
      </div>
    </div>
  </div>
</TiltCard>`,
    preview: (
      <TiltCard
        glare
        parallax
        maxTilt={16}
        scale={1.05}
        className="w-full max-w-sm bg-fg text-fg-inverse"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <span className="font-display text-lg font-semibold">Cronus</span>
            <Wifi className="size-6 rotate-90 opacity-90" aria-hidden="true" />
          </div>
          <div
            className="h-9 w-12 rounded-md bg-fg-inverse/20 ring-1 ring-fg-inverse/15"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xl tracking-[0.25em]">4242 4242 4242 4242</p>
            <div className="flex items-center justify-between text-xs uppercase tracking-wide opacity-90">
              <span>Pedro Gontijo</span>
              <span className="tabular-nums">12/29</span>
            </div>
          </div>
        </div>
      </TiltCard>
    ),
  },
  {
    id: "subtle",
    title: "Subtle",
    description:
      "Dial `maxTilt` and `scale` right down (and skip the glare) for a restrained lift that suits dense lists and rows — motion that's felt more than seen.",
    code: `<TiltCard maxTilt={6} scale={1.02} className="w-full max-w-xs">
  <div className="flex items-center gap-4">
    <span className="grid size-11 place-items-center rounded-full bg-surface-overlay text-fg-secondary">
      <User className="size-5" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-fg">Ana Ribeiro</p>
      <p className="truncate text-sm text-fg-tertiary">ana@cronus.app</p>
    </div>
    <ArrowRight className="ml-auto size-4 shrink-0 text-fg-tertiary" aria-hidden="true" />
  </div>
</TiltCard>`,
    preview: (
      <TiltCard maxTilt={6} scale={1.02} className="w-full max-w-xs">
        <div className="flex items-center gap-4">
          <span className="grid size-11 place-items-center rounded-full bg-surface-overlay text-fg-secondary">
            <User className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">Ana Ribeiro</p>
            <p className="truncate text-sm text-fg-tertiary">ana@cronus.app</p>
          </div>
          <ArrowRight className="ml-auto size-4 shrink-0 text-fg-tertiary" aria-hidden="true" />
        </div>
      </TiltCard>
    ),
  },
];

/** Stacked list view for `/components/tilt-card`; loaded on its own by the premium family. */
export default function TiltCardExamples() {
  return <ExampleList examples={examples} />;
}
