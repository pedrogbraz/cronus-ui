"use client";

import { Meteors } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "field",
    title: "Shooting stars",
    description:
      "Shooting stars fall diagonally from the top and burst as they leave the bottom. Positions are derived from the meteor index, so server and client paint the same field.",
    code: `<Meteors className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Launch window</p>
</Meteors>`,
    preview: (
      <Meteors className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <p className="font-display text-2xl text-fg">Launch window</p>
      </Meteors>
    ),
  },
];

/** Stacked list view for `/components/meteors`; loaded on its own by the premium family. */
export default function MeteorsExamples() {
  return <ExampleList examples={examples} />;
}
