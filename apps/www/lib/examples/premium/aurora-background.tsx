"use client";

import { AuroraBackground, Button } from "@cronus-ui/ui";
import { ArrowRight } from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "animated-backdrop",
    title: "Animated backdrop",
    description:
      "Soft primary blobs drift behind centered hero content. Colour lives on the CTA; the headline stays on `text-fg`.",
    code: `<AuroraBackground className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl">
  <div className="flex max-w-lg flex-col items-center gap-4 px-6 py-12 text-center">
    <h3 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl text-fg">
      Ship something beautiful
    </h3>
    <p className="text-balance text-sm text-fg-secondary">
      Accessible, token-driven React components with premium motion baked in.
    </p>
    <Button variant="primary" size="lg">
      Get started
      <ArrowRight aria-hidden="true" />
    </Button>
  </div>
</AuroraBackground>`,
    preview: (
      <AuroraBackground className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl">
        <div className="flex max-w-lg flex-col items-center gap-4 px-6 py-12 text-center">
          <h3 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl text-fg">
            Ship something beautiful
          </h3>
          <p className="text-balance text-sm text-fg-secondary">
            Accessible, token-driven React components with premium motion baked in.
          </p>
          <Button variant="primary" size="lg">
            Get started
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </AuroraBackground>
    ),
  },
];

/** Stacked list view for `/components/aurora-background`; loaded on its own by the premium family. */
export default function AuroraBackgroundExamples() {
  return <ExampleList examples={examples} />;
}
