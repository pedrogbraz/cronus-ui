"use client";

import { ArrowRight, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PRO_URL } from "../lib/site-url";

const STORAGE_KEY = "kronus-pro-banner-v1";

/**
 * Slim site-wide strip for Kronus Pro. Not in the primary nav — Magic UI-style
 * announcement, dismissible. See Pro leaves this origin for Kronus Pro.
 */
export function SiteAnnouncement() {
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

  if (pathname === "/" || pathname === "/pro" || !open) return null;

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore quota
    }
  }

  return (
    <section aria-label="Announcement" className="border-b border-border bg-surface-inset">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <p className="min-w-0 text-center text-xs text-fg-secondary sm:text-sm">
          Kronus Pro — mail, chat, and finance. Additive to OSS.{" "}
          <a
            href={PRO_URL}
            className="inline-flex items-center gap-1 font-medium text-fg outline-none hover:text-fg-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            See Pro
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="grid size-7 shrink-0 place-items-center rounded-md text-fg-tertiary outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
