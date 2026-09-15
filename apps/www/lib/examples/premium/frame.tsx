"use client";

import { Frame } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "browser",
    title: "Browser chrome",
    description:
      "Wrap a screenshot or mockup in browser chrome — traffic-light dots plus an address bar fed by `url`. Anything you nest becomes the framed content.",
    code: `<Frame url="cronus.app/dashboard">
  <div className="space-y-2 p-6">
    <h3 className="font-display text-lg font-semibold text-fg">Faturamento</h3>
    <p className="text-sm text-fg-secondary">R$ 128.940 nos últimos 30 dias.</p>
    <p className="text-sm text-fg-secondary">+18% vs. o período anterior.</p>
  </div>
</Frame>`,
    preview: (
      <Frame url="cronus.app/dashboard" className="w-full max-w-md">
        <div className="space-y-2 p-6">
          <h3 className="font-display text-lg font-semibold text-fg">Faturamento</h3>
          <p className="text-sm text-fg-secondary">R$ 128.940 nos últimos 30 dias.</p>
          <p className="text-sm text-fg-secondary">+18% vs. o período anterior.</p>
        </div>
      </Frame>
    ),
  },
  {
    id: "window",
    title: "Window chrome",
    description:
      "The `window` variant drops the address bar for a plain title bar — handy for desktop-app mockups.",
    code: `<Frame variant="window">
  <div className="space-y-2 p-6">
    <h3 className="font-display text-lg font-semibold text-fg">Preferências</h3>
    <p className="text-sm text-fg-secondary">Tema, notificações e atalhos.</p>
  </div>
</Frame>`,
    preview: (
      <Frame variant="window" className="w-full max-w-md">
        <div className="space-y-2 p-6">
          <h3 className="font-display text-lg font-semibold text-fg">Preferências</h3>
          <p className="text-sm text-fg-secondary">Tema, notificações e atalhos.</p>
        </div>
      </Frame>
    ),
  },
];

/** Stacked list view for `/components/frame`; loaded on its own by the premium family. */
export default function FrameExamples() {
  return <ExampleList examples={examples} />;
}
