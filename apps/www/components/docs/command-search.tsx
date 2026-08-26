"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Lightweight, always-rendered search affordance for the site nav.
 *
 * Only this trigger (a button + the ⌘/Ctrl-K listener) ships in the nav's
 * first-load JS. The cmdk-backed dialog and the full search index live in
 * `command-search-dialog`, pulled in via `next/dynamic` (`ssr: false`) **only
 * after the user signals intent** — clicking the button or pressing the
 * shortcut. We keep `mounted` latched so reopening is instant and the dialog's
 * own open/close (toggle + Esc) behaves exactly as before.
 */
const CommandSearchDialog = dynamic(() => import("./command-search-dialog"), {
  ssr: false,
});

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  // Latched once the user first opens the palette; gates the dynamic import so
  // cmdk + the nav index never load until intent.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setMounted(true);
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Search documentation"
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        className="inline-grid size-9 place-items-center rounded-lg border border-border bg-surface-inset text-xs text-fg-tertiary outline-none transition-colors hover:border-border-strong hover:text-fg-secondary focus-visible:ring-2 focus-visible:ring-ring 2xl:inline-flex 2xl:w-64 2xl:justify-start 2xl:gap-2 2xl:px-3"
      >
        <Search className="size-4 2xl:size-3.5" aria-hidden="true" />
        <span className="hidden 2xl:inline">Search documentation…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-fg-tertiary 2xl:inline">
          ⌘K
        </kbd>
      </button>

      {mounted ? <CommandSearchDialog open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
