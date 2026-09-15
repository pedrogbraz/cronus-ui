"use client";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

/**
 * Carousel: a native scroll-snap gallery with prev/next, dots, and keyboard
 * support. Drag/swipe works on touch; the OS reduced-motion setting governs the
 * smooth scroll.
 */
function CarouselDemo() {
  const slides = [
    { id: "onboarding", n: 1, label: "Onboarding" },
    { id: "checkout", n: 2, label: "Checkout" },
    { id: "payout", n: 3, label: "Repasse" },
    { id: "insights", n: 4, label: "Insights" },
    { id: "growth", n: 5, label: "Growth" },
  ];
  return (
    <Carousel className="w-full max-w-sm" opts={{ align: "start" }}>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="flex h-40 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-surface-raised">
              <span className="font-display text-4xl font-semibold text-fg">{slide.n}</span>
              <span className="text-xs text-fg-tertiary">{slide.label}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-center gap-3">
        <CarouselPrevious />
        <CarouselDots />
        <CarouselNext />
      </div>
    </Carousel>
  );
}

export const examples: Example[] = [
  {
    id: "slides",
    title: "Slides",
    description:
      "Native scroll-snap gallery — swipe or drag on touch, prev/next + dots and full keyboard support on desktop, reduced-motion handled by the OS. Set `basis` on CarouselItem for multi-up views.",
    code: `<Carousel className="w-full max-w-sm" opts={{ align: "start" }}>
  <CarouselContent>
    {slides.map((slide) => (
      <CarouselItem key={slide.id}>
        <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-surface-raised">
          <span className="font-display text-4xl font-semibold text-fg">{slide.n}</span>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <div className="mt-4 flex items-center justify-center gap-3">
    <CarouselPrevious />
    <CarouselDots />
    <CarouselNext />
  </div>
</Carousel>`,
    preview: <CarouselDemo />,
  },
];

/** Stacked list view for `/components/carousel`; loaded on its own by the premium family. */
export default function CarouselExamples() {
  return <ExampleList examples={examples} />;
}
