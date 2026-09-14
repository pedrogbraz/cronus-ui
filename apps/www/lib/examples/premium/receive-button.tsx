"use client";

import { ReceiveButton } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "family",
    title: "Family receive",
    description:
      "The sky pill morphs into a confirmation card. Receive, Cancel, the close X, Escape, or the blurred backdrop all collapse it back. The CTA keeps its layoutId so it flies into the dialog.",
    code: `<ReceiveButton />`,
    preview: (
      <div className="flex w-full justify-center overflow-hidden rounded-3xl">
        <ReceiveButton />
      </div>
    ),
  },
];

/** Stacked list view for `/components/receive-button`; loaded on its own by the premium family. */
export default function ReceiveButtonExamples() {
  return <ExampleList examples={examples} />;
}
