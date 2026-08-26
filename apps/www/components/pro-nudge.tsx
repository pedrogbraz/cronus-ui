"use client";

import { ArrowRight, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PRO_URL } from "../lib/site-url";

const STORAGE_KEY = "cronus-pro-nudge-v1";

/**
 * Corner card for Cronus Pro (HeroUI-style). Desktop only, dismissible, hidden
 * on the Pro origin. Not in the primary nav.
 */
export function ProNudge() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // private mode
    }
    setOpen(true);
  }, []);

  if (pathname !== "/" || !open) return null;

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore quota
    }
  }

  return (
    <aside
      aria-label="Cronus Pro"
      className="pointer-events-none fixed bottom-4 left-4 z-40 hidden w-[18.5rem] md:block"
    >
      <div className="pointer-events-auto overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-lg">
        <div className="relative border-b border-border bg-surface-inset px-4 py-6">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss Pro notice"
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-md text-fg-tertiary outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
          <p className="font-display text-lg font-normal tracking-[-0.02em] text-fg">Pro</p>
          <p className="mt-1 text-xs text-fg-tertiary">Now in the pack</p>
        </div>
        <div className="p-4">
          <p className="text-sm leading-6 text-fg-secondary">
            Mail, chat, and finance — extra composed apps. Looks and SaaS stay free.
          </p>
          <a
            href={PRO_URL}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-inset px-3 py-2 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
          >
            See Pro
            <ArrowRight className="size-3.5 text-fg-tertiary" aria-hidden="true" />
          </a>
        </div>
      </div>
    </aside>
  );
}
