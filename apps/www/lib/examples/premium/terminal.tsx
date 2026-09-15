"use client";

import { Terminal } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "install-session",
    title: "Install session",
    description:
      "A scripted install session: commands type in char-by-char behind the prompt with a blinking block cursor, outputs fade in after a beat of execution time, and loop replays it. The copy button copies just the joined commands. Reduced-motion visitors get the finished transcript instantly.",
    install: {
      registryItem: "terminal",
    },
    code: `<Terminal
  title="zsh"
  loop
  lines={[
    { type: "input", text: "npx cronus-ui add terminal" },
    { type: "output", text: "✔ 1 component installed" },
    { type: "output", text: "  src/components/ui/terminal.tsx" },
    { type: "input", text: "bun run dev" },
    { type: "output", text: "ready in 312 ms" },
  ]}
/>`,
    preview: (
      <Terminal
        title="zsh"
        loop
        motionPreference="always"
        className="w-full max-w-xl"
        lines={[
          { type: "input", text: "npx cronus-ui add terminal" },
          { type: "output", text: "✔ 1 component installed" },
          { type: "output", text: "  src/components/ui/terminal.tsx" },
          { type: "input", text: "bun run dev" },
          { type: "output", text: "ready in 312 ms" },
        ]}
      />
    ),
  },
  {
    id: "static-log",
    title: "Static, chrome-less log",
    description:
      "Without the traffic-light bar the copy button floats over the corner, and motionPreference of never renders the finished transcript with no animation — exactly what reduced-motion visitors see.",
    install: {
      registryItem: "terminal",
    },
    code: `<Terminal
  chrome={false}
  motionPreference="never"
  lines={[
    { type: "input", text: "cronus deploy --prod" },
    { type: "output", text: "Build completed in 8.2s" },
    { type: "output", text: "Deployed to https://app.cronus.com" },
  ]}
/>`,
    preview: (
      <Terminal
        chrome={false}
        motionPreference="never"
        className="w-full max-w-xl"
        lines={[
          { type: "input", text: "cronus deploy --prod" },
          { type: "output", text: "Build completed in 8.2s" },
          { type: "output", text: "Deployed to https://app.cronus.com" },
        ]}
      />
    ),
  },
];

/** Stacked list view for `/components/terminal`; loaded on its own by the premium family. */
export default function TerminalExamples() {
  return <ExampleList examples={examples} />;
}
