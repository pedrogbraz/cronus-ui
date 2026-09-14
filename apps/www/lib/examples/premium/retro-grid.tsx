"use client";

import { RetroGrid } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "floor",
    title: "Perspective floor",
    description:
      "A receding grid floor that scrolls toward the horizon. Reduced-motion visitors keep the floor, without the scroll.",
    code: `<RetroGrid className="grid min-h-64 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Horizon</p>
</RetroGrid>`,
    preview: (
      <RetroGrid className="grid min-h-64 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <p className="font-display text-2xl text-fg">Horizon</p>
      </RetroGrid>
    ),
  },
];

/** Stacked list view for `/components/retro-grid`; loaded on its own by the premium family. */
export default function RetroGridExamples() {
  return <ExampleList examples={examples} />;
}
