"use client";

import { SpotlightCard } from "@cronus-ui/ui";
import { Gauge } from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "hover-spotlight",
    title: "Hover spotlight",
    description:
      "A radial spotlight tracks your cursor across the card — hover anywhere over it to bring the surface to life.",
    code: `<SpotlightCard className="flex flex-col gap-3 p-5">
  <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-primary">
    <Gauge className="size-4" aria-hidden="true" />
  </span>
  <h3 className="font-display text-base font-semibold text-fg">Accessible core</h3>
  <p className="text-sm text-fg-secondary">
    Radix primitives and focus-visible rings ship on by default.
  </p>
</SpotlightCard>`,
    preview: (
      <SpotlightCard className="flex flex-col gap-3 p-5">
        <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-primary">
          <Gauge className="size-4" aria-hidden="true" />
        </span>
        <h3 className="font-display text-base font-semibold text-fg">Accessible core</h3>
        <p className="text-sm text-fg-secondary">
          Radix primitives and focus-visible rings ship on by default.
        </p>
      </SpotlightCard>
    ),
  },
];

/** Stacked list view for `/components/spotlight-card`; loaded on its own by the premium family. */
export default function SpotlightCardExamples() {
  return <ExampleList examples={examples} />;
}
