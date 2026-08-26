import { ArrowUpRight, Github } from "lucide-react";
import { PRO_URL } from "../../lib/site-url";
import { KronusMark } from "../brand/kronus-mark";

interface FooterLink {
  label: string;
  href: string;
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Templates", href: "/templates" },
      { label: "Pro", href: PRO_URL },
      { label: "Components", href: "/components" },
      { label: "Blocks", href: "/docs/blocks" },
      { label: "Themes", href: "/themes" },
      { label: "Live theming", href: "/#theming" },
      { label: "Stack Builder", href: "/stack" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Create Studio", href: "/create" },
      { label: "Compare", href: "/docs/compare" },
      { label: "Changelog", href: "/changelog" },
      { label: "Sponsor", href: "/sponsor" },
      { label: "GitHub", href: "https://github.com/pedrogbraz/kronus-ui" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Create a SaaS app", href: "/docs/getting-started" },
      { label: "Compare", href: "/docs/compare" },
      { label: "Theming", href: "/#theming" },
      { label: "AI Kit", href: "/docs" },
    ],
  },
];

/** The homepage footer — brand block, link columns, and a bottom bar. */
export function SiteFooter() {
  return (
    <footer id="cli" className="border-t border-border/60 bg-surface-inset/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <KronusMark className="h-4 w-8 text-fg" />
              <span className="font-display text-lg font-semibold text-fg">Kronus UI</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-secondary">
              The Kronus product UI system — compose a SaaS from source you can upgrade, as an npm
              package or a copy-paste registry you own.
            </p>
            <div className="mt-5 inline-flex max-w-full items-center gap-3 overflow-hidden rounded-xl border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-fg-secondary shadow-xs">
              <span className="text-fg-tertiary" aria-hidden="true">
                $
              </span>
              <span className="truncate">npx create-kronus-app my-app --template saas</span>
            </div>
          </div>

          {/* Link columns */}
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
          <span>© {new Date().getFullYear()} Kronus UI — built with itself.</span>
          <a
            href="https://github.com/pedrogbraz/kronus-ui"
            className="inline-flex items-center gap-1.5 rounded-md text-fg-secondary outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Github className="size-4" aria-hidden="true" /> pedrogbraz/kronus-ui
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
