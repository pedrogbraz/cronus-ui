"use client";

import { WordsPreloader } from "@cronus-ui/ui";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

function AfterPage({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="flex h-full flex-col bg-black text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <p className="text-sm tracking-[-0.02em]">Cronus</p>
        <nav className="flex items-center gap-5 text-sm text-white/60">
          <span>Product</span>
          <span>Docs</span>
          <button
            type="button"
            onClick={onReplay}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Replay
          </button>
        </nav>
      </header>
      <main className="flex flex-1 flex-col justify-center px-6 py-12">
        <p className="text-sm text-white/50">Product UI system</p>
        <h2 className="mt-3 max-w-xl font-display text-4xl tracking-[-0.03em] text-white">
          Ship the interface, not another kit.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">
          Compose of apps, a live theme, and an authorship contract. The catalog is the means.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black">
            Get started
          </span>
          <span className="inline-flex items-center rounded-full border border-white/20 px-5 py-2.5 text-sm text-white">
            Browse components
          </span>
        </div>
      </main>
      <div className="grid grid-cols-3 border-t border-white/10 text-sm">
        <div className="px-6 py-5">
          <p className="text-white/50">Components</p>
          <p className="mt-1 text-white">182</p>
        </div>
        <div className="border-s border-white/10 px-6 py-5">
          <p className="text-white/50">Blocks</p>
          <p className="mt-1 text-white">74</p>
        </div>
        <div className="border-s border-white/10 px-6 py-5">
          <p className="text-white/50">Templates</p>
          <p className="mt-1 text-white">20</p>
        </div>
      </div>
    </div>
  );
}

function WordsPreloaderDemo() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(() => setShow(false), 2500);
    return () => window.clearTimeout(timer);
  }, [show]);

  return (
    <div className="relative h-[36rem] w-full overflow-hidden rounded-xl border border-border">
      <AfterPage onReplay={() => setShow(true)} />
      <AnimatePresence>
        {show ? <WordsPreloader key="words" layout="contained" /> : null}
      </AnimatePresence>
    </div>
  );
}

export const preloadersExamples: ExampleMap = {
  "words-preloader": [
    {
      id: "greetings",
      title: "Word greetings",
      description:
        "The page sits underneath. After the greetings, the curved lip flattens and the panel slides up to reveal it — same as a real load. Replay from the nav.",
      code: `const [show, setShow] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setShow(false), 2500);
  return () => clearTimeout(timer);
}, []);

return (
  <main className="relative">
    <AnimatePresence>
      {show ? <WordsPreloader /> : null}
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
