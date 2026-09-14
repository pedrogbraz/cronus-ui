"use client";

import { TokenSwap } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "aave",
    title: "Aave swap",
    description:
      "Type an amount: digits fade in, the USD readout grows, Max morphs Use → Using, and the receive side rolls. Over the 111.82 ETH balance, the USD row becomes Not Enough ETH. Clear resets.",
    code: `<TokenSwap />`,
    preview: (
      <div className="flex w-full justify-center overflow-hidden rounded-3xl">
        <TokenSwap />
      </div>
    ),
  },
];

/** Stacked list view for `/components/token-swap`; loaded on its own by the premium family. */
export default function TokenSwapExamples() {
  return <ExampleList examples={examples} />;
}
