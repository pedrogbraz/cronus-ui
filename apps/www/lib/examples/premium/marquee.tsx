"use client";

import { Card, CardContent, Marquee } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

// ── Marquee demo data ─────────────────────────────────────────────────
const marqueeBrands = ["stripe", "vercel", "linear", "notion", "supabase", "raycast"];

const testimonials = [
  {
    quote: "We shipped a polished, on-brand UI in a weekend. The theming alone paid for itself.",
    name: "Ana Ribeiro",
    role: "Head of Design, Northwind",
    initials: "AR",
  },
  {
    quote:
      "Every component is accessible out of the box — our axe audit went green on the first pass.",
    name: "Marcus Lee",
    role: "Staff Engineer, Atlas",
    initials: "ML",
  },
  {
    quote:
      "The motion is tasteful and respects reduced-motion. It feels premium without trying hard.",
    name: "Priya Nair",
    role: "Product Lead, Lumen",
    initials: "PN",
  },
  {
    quote:
      "Drop-in registry, zero lock-in. We own the code and still get updates when we want them.",
    name: "Tomás Costa",
    role: "Founder, Brava",
    initials: "TC",
  },
];

export const examples: Example[] = [
  {
    id: "logo-ticker",
    title: "Logo ticker",
    description:
      "A seamless, constant-velocity strip for a wall of customer logos. The edges fade into the background and the scroll pauses on hover. Reduced-motion visitors get a single static, fully-legible row.",
    install: {
      registryItem: "marquee",
      dependencies: ["motion"],
    },
    code: `<Marquee pauseOnHover speed={32} className="py-2">
  {["stripe", "vercel", "linear", "notion", "supabase", "raycast"].map((brand) => (
    <span
      key={brand}
      className="mx-8 text-2xl font-semibold tracking-tight text-fg-secondary"
    >
      {brand}
    </span>
  ))}
</Marquee>`,
    preview: (
      <Marquee pauseOnHover speed={32} motionPreference="always" className="w-full py-2">
        {marqueeBrands.map((brand) => (
          <span
            key={brand}
            className="mx-8 text-2xl font-semibold tracking-tight text-fg-secondary"
          >
            {brand}
          </span>
        ))}
      </Marquee>
    ),
  },
  {
    id: "testimonials",
    title: "Testimonial wall",
    description:
      "Two rows scrolling in opposite directions for a lively social-proof band. Each card is full content; hovering anywhere pauses both rows so a quote can be read.",
    install: {
      registryItem: "marquee",
      dependencies: ["motion"],
    },
    code: `<div className="flex flex-col gap-4">
  <Marquee pauseOnHover speed={24}>
    {testimonials.map((t) => (
      <Card key={t.name} className="mx-3 w-80 shrink-0">
        <CardContent className="flex flex-col gap-4 pt-6">
          <p className="text-sm leading-relaxed text-fg">"{t.quote}"</p>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-surface-overlay text-xs font-medium text-fg-secondary">
              {t.initials}
            </span>
            <div className="text-sm">
              <p className="font-medium text-fg">{t.name}</p>
              <p className="text-fg-tertiary">{t.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </Marquee>
  <Marquee pauseOnHover direction="right" speed={24}>
    {testimonials.map((t) => ( /* …same card… */ ))}
  </Marquee>
</div>`,
    preview: (
      <div className="flex w-full flex-col gap-4">
        {(["left", "right"] as const).map((direction) => (
          <Marquee
            key={direction}
            pauseOnHover
            direction={direction}
            speed={24}
            motionPreference="always"
            className="w-full"
          >
            {testimonials.map((t) => (
              <Card key={`${direction}-${t.name}`} className="mx-3 w-80 shrink-0">
                <CardContent className="flex flex-col gap-4 pt-6">
                  <p className="text-sm leading-relaxed text-fg">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-surface-overlay text-xs font-medium text-fg-secondary">
                      {t.initials}
                    </span>
                    <div className="text-sm">
                      <p className="font-medium text-fg">{t.name}</p>
                      <p className="text-fg-tertiary">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Marquee>
        ))}
      </div>
    ),
  },
];

/** Stacked list view for `/components/marquee`; loaded on its own by the premium family. */
export default function MarqueeExamples() {
  return <ExampleList examples={examples} />;
}
