import { ArrowUpRight, Github } from "lucide-react";
import { GITHUB_URL, OSS_URL } from "../lib/origins";
import { KronusMark } from "./brand/kronus-mark";

const LINKS = [
  { label: "Pack", href: "#pack" },
  { label: "Pricing", href: "#pricing" },
  { label: "License", href: "#license" },
  { label: "FAQ", href: "#faq" },
  { label: "Open source", href: OSS_URL },
] as const;

export function ProFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface-inset/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <KronusMark className="h-4 w-8 text-fg" />
            <span className="font-display text-lg font-semibold text-fg">Kronus Pro</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-fg-secondary">
            The additive pack on top of the Kronus product UI system. OSS stays complete. You only
            gain.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="w-fit rounded-md text-sm text-fg-secondary outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border/60 px-4 py-6 text-sm text-fg-tertiary sm:flex-row sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} Kronus UI — not billed yet.</span>
        <a
          href={GITHUB_URL}
          className="inline-flex items-center gap-1.5 rounded-md text-fg-secondary outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Github className="size-4" aria-hidden="true" /> pedrogbraz/kronus-ui
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
