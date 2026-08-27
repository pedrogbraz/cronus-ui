import { ArrowUpRight, Github } from "lucide-react";
import { GITHUB_URL, OSS_URL } from "../lib/origins";
import { CronusMark } from "./brand/cronus-mark";
import { SectionGlow } from "./showcase-ui";

const COLUMNS = [
  {
    title: "Pack",
    links: [
      { label: "Mail", href: "#pack" },
      { label: "Chat", href: "#pack" },
      { label: "Finance", href: "#pack" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "License",
    links: [
      { label: "Maker", href: "#pricing" },
      { label: "Studio", href: "#pricing" },
      { label: "Terms", href: "#license" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Open source",
    links: [
      { label: "Cronus UI", href: OSS_URL },
      { label: "Docs", href: `${OSS_URL}/docs` },
      { label: "Looks", href: `${OSS_URL}/#looks` },
      { label: "GitHub", href: GITHUB_URL },
    ],
  },
] as const;

export function ProFooter() {
  return (
    <footer className="relative bg-surface-inset/40">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <CronusMark className="h-4 w-8 text-fg" />
              <span className="font-display text-lg font-semibold text-fg">Cronus Pro</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-secondary">
              The additive pack on the Cronus product UI system. OSS stays complete. You only gain.
            </p>
            <div className="mt-5 inline-flex max-w-full items-center gap-3 overflow-hidden rounded-xl border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-fg-secondary shadow-xs">
              <span className="text-fg-tertiary" aria-hidden="true">
                $
              </span>
              <span className="truncate">bunx create-cronus-app my-app --template chat</span>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3 lg:gap-x-16"
          >
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
                  {col.title}
                </span>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="w-fit rounded-md text-sm text-fg-secondary outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-fg-tertiary sm:flex-row">
          <span>© {new Date().getFullYear()} Cronus UI — not billed yet.</span>
          <a
            href={GITHUB_URL}
            className="inline-flex items-center gap-1.5 rounded-md text-fg-secondary outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Github className="size-4" aria-hidden="true" /> pedrogbraz/cronus-ui
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
