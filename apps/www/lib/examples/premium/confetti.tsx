"use client";

import { Button, Confetti } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "burst",
    title: "Burst",
    description:
      "Click anywhere on the wrapper to fire a burst from the pointer. A no-op under reduced motion.",
    code: `<Confetti className="grid min-h-40 place-items-center rounded-2xl border border-border bg-surface-raised">
  <Button>Celebrate</Button>
</Confetti>`,
    preview: (
      <Confetti className="grid min-h-40 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <Button>Celebrate</Button>
      </Confetti>
    ),
  },
];

/** Stacked list view for `/components/confetti`; loaded on its own by the premium family. */
export default function ConfettiExamples() {
  return <ExampleList examples={examples} />;
}
