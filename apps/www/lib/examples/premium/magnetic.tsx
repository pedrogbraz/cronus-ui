"use client";

import { Button, Magnetic } from "@cronus-ui/ui";
import { ArrowRight, Share2 } from "lucide-react";
import { GithubGlyph, LinkedinGlyph } from "../../../components/brand-glyphs";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "magnetic-cta",
    title: "Magnetic call-to-action",
    description:
      "Wrap a hero CTA so it leans into the cursor before the pointer even lands. Pad the wrapper (`p-10`) to give the field room beyond the button — the attraction only acts where the wrapper is hovered. The pull is lerped straight onto the child's transform inside one rAF (zero re-renders) and the whole effect switches off under prefers-reduced-motion and on touch.",
    install: { registryItem: "magnetic" },
    code: `<Magnetic className="p-10">
  <Button size="lg" className="rounded-full px-8 shadow-glow">
    Começar agora
    <ArrowRight className="size-4" aria-hidden="true" />
  </Button>
</Magnetic>`,
    preview: (
      <Magnetic className="p-10">
        <Button size="lg" className="rounded-full px-8 shadow-glow">
          Começar agora
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </Magnetic>
    ),
  },
  {
    id: "icon-row",
    title: "Icon row",
    description:
      "A row of independently magnetic icon buttons — each has its own small field, so only the nearest icon drifts toward the pointer while its neighbours stay at rest. Keep `strength` low for chrome that should feel alive but not needy.",
    code: `<div className="flex items-center gap-1">
  {[
    { label: "GitHub", icon: GithubGlyph },
    { label: "LinkedIn", icon: LinkedinGlyph },
    { label: "Compartilhar", icon: Share2 },
  ].map(({ label, icon: Icon }) => (
    <Magnetic key={label} strength={0.25} radius={60} className="p-3">
      <Button variant="ghost" size="icon" aria-label={label} className="rounded-full">
        <Icon className="size-4" aria-hidden="true" />
      </Button>
    </Magnetic>
  ))}
</div>`,
    preview: (
      <div className="flex items-center gap-1">
        {[
          { label: "GitHub", icon: GithubGlyph },
          { label: "LinkedIn", icon: LinkedinGlyph },
          { label: "Compartilhar", icon: Share2 },
        ].map(({ label, icon: Icon }) => (
          <Magnetic key={label} strength={0.25} radius={60} className="p-3">
            <Button variant="ghost" size="icon" aria-label={label} className="rounded-full">
              <Icon className="size-4" aria-hidden="true" />
            </Button>
          </Magnetic>
        ))}
      </div>
    ),
  },
  {
    id: "field-tuning",
    title: "Strength & radius",
    description:
      "`strength` (0–1) scales how far the content chases the pointer; `radius` sets where the field dissolves back to zero — the falloff eases to nothing at the edge, so there is never a pop. Tune both per surface: subtle for dense UI, sticky for hero moments.",
    code: `<div className="flex flex-wrap items-end justify-center gap-8">
  <div className="flex flex-col items-center gap-2">
    <Magnetic strength={0.15} radius={80} className="p-8">
      <Button variant="outline" className="rounded-full">Sutil</Button>
    </Magnetic>
    <span className="font-mono text-xs text-fg-tertiary tabular-nums">strength 0.15 · radius 80</span>
  </div>
  <div className="flex flex-col items-center gap-2">
    <Magnetic strength={0.6} radius={160} className="p-8">
      <Button variant="outline" className="rounded-full">Grudento</Button>
    </Magnetic>
    <span className="font-mono text-xs text-fg-tertiary tabular-nums">strength 0.6 · radius 160</span>
  </div>
</div>`,
    preview: (
      <div className="flex flex-wrap items-end justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Magnetic strength={0.15} radius={80} className="p-8">
            <Button variant="outline" className="rounded-full">
              Sutil
            </Button>
          </Magnetic>
          <span className="font-mono text-xs text-fg-tertiary tabular-nums">
            strength 0.15 · radius 80
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Magnetic strength={0.6} radius={160} className="p-8">
            <Button variant="outline" className="rounded-full">
              Grudento
            </Button>
          </Magnetic>
          <span className="font-mono text-xs text-fg-tertiary tabular-nums">
            strength 0.6 · radius 160
          </span>
        </div>
      </div>
    ),
  },
];

/** Stacked list view for `/components/magnetic`; loaded on its own by the premium family. */
export default function MagneticExamples() {
  return <ExampleList examples={examples} />;
}
