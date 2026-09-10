"use client";

import { WordsPreloader } from "@cronus-ui/ui";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { CronusMark } from "../../components/brand/cronus-mark";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

function AfterPage({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="flex h-full flex-col bg-surface-base text-fg">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="text-sm tracking-[-0.02em]">Cronus</p>
        <nav className="flex items-center gap-5 text-sm text-fg-secondary">
          <span>Product</span>
          <span>Docs</span>
          <button
            type="button"
            onClick={onReplay}
            className="rounded-full border border-border bg-surface-raised px-3 py-1.5 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Replay
          </button>
        </nav>
      </header>
      <main className="flex flex-1 flex-col justify-center px-6 py-12">
        <p className="text-sm text-fg-tertiary">Product UI system</p>
        <h2 className="mt-3 max-w-xl font-display text-4xl tracking-[-0.03em] text-fg">
          Ship the interface, not another kit.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-6 text-fg-secondary">
          Compose of apps, a live theme, and an authorship contract. The catalog is the means.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            Get started
          </span>
          <span className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm text-fg">
            Browse components
          </span>
        </div>
      </main>
      <div className="grid grid-cols-3 border-t border-border text-sm">
        <div className="px-6 py-5">
          <p className="text-fg-tertiary">Components</p>
          <p className="mt-1 text-fg">182</p>
        </div>
        <div className="border-s border-border px-6 py-5">
          <p className="text-fg-tertiary">Blocks</p>
          <p className="mt-1 text-fg">74</p>
        </div>
        <div className="border-s border-border px-6 py-5">
          <p className="text-fg-tertiary">Templates</p>
          <p className="mt-1 text-fg">20</p>
        </div>
      </div>
    </div>
  );
}

function WordsPreloaderDemo() {
  const [show, setShow] = useState(true);

  return (
    <div className="relative h-[36rem] w-full overflow-hidden rounded-xl border border-border">
      <AfterPage onReplay={() => setShow(true)} />
      <AnimatePresence>
        {show ? (
          <WordsPreloader
            key="words"
            layout="contained"
            words={["The innovation of interfaces.", "One system. The whole product follows."]}
            end={<CronusMark title="Cronus" className="h-14 w-28 text-fg sm:h-16 sm:w-32" />}
            onComplete={() => setShow(false)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export const preloadersExamples: ExampleMap = {
  "words-preloader": [
    {
      id: "words",
      title: "Product words",
      description:
        "The page sits underneath. Each line clips up with SlideUpText, the mark lands, then the curved lip flattens and the panel slides up. Replay from the nav.",
      code: `const [show, setShow] = useState(true);

return (
  <main className="relative">
    <AnimatePresence>
      {show ? (
        <WordsPreloader
          end={<BrandMark className="h-16 w-32 text-fg" />}
          onComplete={() => setShow(false)}
        />
      ) : null}
    </AnimatePresence>
    <Page />
  </main>
);`,
      preview: <WordsPreloaderDemo />,
    },
  ],
};

export default function PreloadersExamples({ slug }: { slug: string }) {
  return <ExampleList examples={preloadersExamples[slug] ?? []} />;
}
