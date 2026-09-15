"use client";

import { AnimatedList } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "stagger",
    title: "Staggered list",
    description:
      "Children enter with a short rise and fade. Pass the item body, not an li — the component wraps each child.",
    code: `<AnimatedList className="w-full max-w-sm">
  <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
    Deploy finished
  </div>
  <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
    Invite accepted
  </div>
  <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
    Invoice paid
  </div>
</AnimatedList>`,
    preview: (
      <AnimatedList className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
          Deploy finished
        </div>
        <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
          Invite accepted
        </div>
        <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
          Invoice paid
        </div>
      </AnimatedList>
    ),
  },
];

/** Stacked list view for `/components/animated-list`; loaded on its own by the premium family. */
export default function AnimatedListExamples() {
  return <ExampleList examples={examples} />;
}
