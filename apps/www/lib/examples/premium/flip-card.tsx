"use client";

import { Button, FlipCard, FlipCardBack, FlipCardFront } from "@cronus-ui/ui";
import { ArrowRight, Check, Github, Linkedin, RotateCw, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

/**
 * FlipCard (controlled): the card never self-flips — a Button below owns the
 * `flipped` state and toggles between an order summary (front) and its line-item
 * breakdown (back). Uses the vertical axis so it tumbles top-to-bottom.
 */
function FlipCardControlledDemo() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <FlipCard
        trigger="controlled"
        flipped={flipped}
        axis="vertical"
        aria-label="Detalhe do pedido"
        className="h-64 w-full max-w-xs"
      >
        <FlipCardFront className="justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
              Pedido #4821
            </span>
            <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success-strong">
              Pago
            </span>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-fg">R$ 297,00</p>
            <p className="mt-1 text-sm text-fg-secondary">Curso de Copywriting</p>
          </div>
          <p className="text-xs text-fg-tertiary">Toque em “Ver detalhes”.</p>
        </FlipCardFront>
        <FlipCardBack className="justify-between p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">Composição</p>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-fg-secondary">Subtotal</dt>
              <dd className="tabular-nums text-fg">R$ 320,00</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-fg-secondary">Cupom BEMVINDO</dt>
              <dd className="tabular-nums text-success">− R$ 23,00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 font-medium">
              <dt className="text-fg">Total</dt>
              <dd className="tabular-nums text-fg">R$ 297,00</dd>
            </div>
          </dl>
        </FlipCardBack>
      </FlipCard>
      <Button size="sm" variant="outline" onClick={() => setFlipped((value) => !value)}>
        <RotateCw aria-hidden="true" className="size-4" />
        {flipped ? "Ver resumo" : "Ver detalhes"}
      </Button>
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "hover",
    title: "Hover to flip",
    description:
      "The default trigger flips on pointer hover and keyboard focus, so it's fully operable without a mouse. The inactive face is `inert` — its content never double-reads to a screen reader. Hover the card to reveal the plan's benefits.",
    code: `<FlipCard aria-label="Plano Pro" className="h-72 w-full max-w-xs">
  <FlipCardFront className="justify-between p-6">
    <span className="grid size-11 place-items-center rounded-xl bg-surface-overlay text-fg">
      <Sparkles className="size-5" aria-hidden="true" />
    </span>
    <div>
      <h3 className="font-display text-lg font-semibold text-fg">Plano Pro</h3>
      <p className="mt-1 text-sm text-fg-secondary">
        Tudo o que você precisa para escalar a sua loja.
      </p>
    </div>
    <span className="text-xs font-medium text-fg-tertiary">Passe o mouse →</span>
  </FlipCardFront>
  <FlipCardBack className="justify-between p-6">
    <ul className="flex flex-col gap-2.5 text-sm text-fg-secondary">
      <li className="flex items-center gap-2">
        <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
        Repasses em D+2
      </li>
      <li className="flex items-center gap-2">
        <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
        Checkout sem marca
      </li>
      <li className="flex items-center gap-2">
        <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
        Suporte prioritário
      </li>
    </ul>
    <Button variant="primary" className="w-full">
      Assinar o Pro
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
  </FlipCardBack>
</FlipCard>`,
    preview: (
      <FlipCard aria-label="Plano Pro" className="h-72 w-full max-w-xs">
        <FlipCardFront className="justify-between p-6">
          <span className="grid size-11 place-items-center rounded-xl bg-surface-overlay text-fg">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-fg">Plano Pro</h3>
            <p className="mt-1 text-sm text-fg-secondary">
              Tudo o que você precisa para escalar a sua loja.
            </p>
          </div>
          <span className="text-xs font-medium text-fg-tertiary">Passe o mouse →</span>
        </FlipCardFront>
        <FlipCardBack className="justify-between p-6">
          <ul className="flex flex-col gap-2.5 text-sm text-fg-secondary">
            <li className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
              Repasses em D+2
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
              Checkout sem marca
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
              Suporte prioritário
            </li>
          </ul>
          <Button variant="primary" className="w-full">
            Assinar o Pro
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </FlipCardBack>
      </FlipCard>
    ),
  },
  {
    id: "click",
    title: "Click to flip",
    description:
      '`trigger="click"` turns the whole card into a single button — it toggles on click, Enter or Space and exposes `role="button"` + `aria-pressed`. Give it an `aria-label` so the control is named. Click to read the testimonial.',
    code: `<FlipCard
  trigger="click"
  aria-label="Ver depoimento de Ana Ribeiro"
  className="h-72 w-full max-w-xs"
>
  <FlipCardFront className="items-center justify-center gap-3 p-6 text-center">
    <span className="grid size-16 place-items-center rounded-full bg-surface-overlay text-lg font-semibold text-fg-secondary">
      AR
    </span>
    <div>
      <p className="font-display text-base font-semibold text-fg">Ana Ribeiro</p>
      <p className="text-sm text-fg-tertiary">Head of Design, Northwind</p>
    </div>
    <span className="text-xs text-fg-tertiary">Clique para ler</span>
  </FlipCardFront>
  <FlipCardBack className="items-center justify-center gap-4 p-6 text-center">
    <div className="flex gap-0.5 text-primary">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className="size-4 fill-current" aria-hidden="true" />
      ))}
    </div>
    <p className="text-sm leading-relaxed text-fg">
      “Shipped a polished, on-brand UI in a weekend. The theming alone paid for itself.”
    </p>
    <div className="flex items-center gap-3 text-fg-tertiary">
      <Github className="size-4" aria-hidden="true" />
      <Linkedin className="size-4" aria-hidden="true" />
    </div>
  </FlipCardBack>
</FlipCard>`,
    preview: (
      <FlipCard
        trigger="click"
        aria-label="Ver depoimento de Ana Ribeiro"
        className="h-72 w-full max-w-xs"
      >
        <FlipCardFront className="items-center justify-center gap-3 p-6 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-surface-overlay text-lg font-semibold text-fg-secondary">
            AR
          </span>
          <div>
            <p className="font-display text-base font-semibold text-fg">Ana Ribeiro</p>
            <p className="text-sm text-fg-tertiary">Head of Design, Northwind</p>
          </div>
          <span className="text-xs text-fg-tertiary">Clique para ler</span>
        </FlipCardFront>
        <FlipCardBack className="items-center justify-center gap-4 p-6 text-center">
          <div className="flex gap-0.5 text-primary">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className="size-4 fill-current" aria-hidden="true" />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-fg">
            “Shipped a polished, on-brand UI in a weekend. The theming alone paid for itself.”
          </p>
          <div className="flex items-center gap-3 text-fg-tertiary">
            <Github className="size-4" aria-hidden="true" />
            <Linkedin className="size-4" aria-hidden="true" />
          </div>
        </FlipCardBack>
      </FlipCard>
    ),
  },
  {
    id: "controlled",
    title: "Controlled",
    description:
      '`trigger="controlled"` never self-flips — you own the `flipped` prop and drive it from anywhere. Here a Button toggles between an order summary and its breakdown, tumbling on the vertical axis.',
    code: `function OrderCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <FlipCard
        trigger="controlled"
        flipped={flipped}
        axis="vertical"
        aria-label="Detalhe do pedido"
        className="h-64 w-full max-w-xs"
      >
        <FlipCardFront className="justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
              Pedido #4821
            </span>
            <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success-strong">
              Pago
            </span>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-fg">R$ 297,00</p>
            <p className="mt-1 text-sm text-fg-secondary">Curso de Copywriting</p>
          </div>
          <p className="text-xs text-fg-tertiary">Toque em “Ver detalhes”.</p>
        </FlipCardFront>
        <FlipCardBack className="justify-between p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">Composição</p>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-fg-secondary">Subtotal</dt>
              <dd className="tabular-nums text-fg">R$ 320,00</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-fg-secondary">Cupom BEMVINDO</dt>
              <dd className="tabular-nums text-success">− R$ 23,00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 font-medium">
              <dt className="text-fg">Total</dt>
              <dd className="tabular-nums text-fg">R$ 297,00</dd>
            </div>
          </dl>
        </FlipCardBack>
      </FlipCard>
      <Button size="sm" variant="outline" onClick={() => setFlipped((value) => !value)}>
        <RotateCw aria-hidden="true" className="size-4" />
        {flipped ? "Ver resumo" : "Ver detalhes"}
      </Button>
    </div>
  );
}`,
    preview: <FlipCardControlledDemo />,
  },
];

/** Stacked list view for `/components/flip-card`; loaded on its own by the premium family. */
export default function FlipCardExamples() {
  return <ExampleList examples={examples} />;
}
