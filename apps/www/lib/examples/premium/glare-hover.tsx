"use client";

import { GlareHover } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "glare",
    title: "Pointer glare",
    description:
      "A diagonal glare tracks the pointer. Position is written to CSS variables, so pointer motion never re-renders React.",
    code: `<GlareHover className="rounded-2xl border border-border bg-surface-raised p-8">
  <p className="font-display text-xl text-fg">Hover the surface</p>
</GlareHover>`,
    preview: (
      <GlareHover className="w-full max-w-sm rounded-2xl border border-border bg-surface-raised p-8">
        <p className="font-display text-xl text-fg">Hover the surface</p>
      </GlareHover>
    ),
  },
];

/** Stacked list view for `/components/glare-hover`; loaded on its own by the premium family. */
export default function GlareHoverExamples() {
  return <ExampleList examples={examples} />;
}
