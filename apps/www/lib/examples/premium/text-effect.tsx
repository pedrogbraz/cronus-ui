"use client";

import { Button, TextEffect } from "@cronus-ui/ui";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

function TextEffectDemo() {
  const [runId, setRunId] = useState(0);
  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <div key={runId} className="flex flex-col gap-2">
        <TextEffect
          as="h3"
          per="char"
          preset="blur"
          trigger="mount"
          reducedMotion="never"
          className="font-display text-3xl font-semibold text-fg"
        >
          Ship premium by default
        </TextEffect>
        <TextEffect
          as="p"
          per="word"
          preset="slide"
          trigger="mount"
          delay={0.35}
          reducedMotion="never"
          className="text-sm text-fg-secondary"
        >
          Every surface arrives with intent.
        </TextEffect>
      </div>
      <Button size="sm" variant="outline" onClick={() => setRunId((n) => n + 1)}>
        <RotateCw aria-hidden="true" className="size-4" />
        Replay
      </Button>
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "headline",
    title: "Headline",
    description:
      "Staggers words or characters in with a fade, blur, or slide — on scroll-into-view or on mount. The full string stays in the a11y tree via aria-label, so screen readers read it once.",
    code: `<TextEffect as="h3" per="char" preset="blur" className="font-display text-3xl font-semibold text-fg">
  Ship premium by default
</TextEffect>`,
    preview: <TextEffectDemo />,
  },
];

/** Stacked list view for `/components/text-effect`; loaded on its own by the premium family. */
export default function TextEffectExamples() {
  return <ExampleList examples={examples} />;
}
