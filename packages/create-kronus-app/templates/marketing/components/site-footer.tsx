import { Separator } from "@kronus-ui/ui/separator";
import { Sparkles } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Waitlist", href: "#waitlist" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "Guides", href: "#guides" },
      { label: "Support", href: "#support" },
    ],
  },
] as const;

/** Brand block, link columns, and the legal bottom bar. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-base px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <span className="font-display text-lg font-semibold text-fg">__APP_NAME__</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-fg-secondary">
              Built with Kronus UI — themeable, accessible React components for teams who ship
              polished products fast.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-medium text-fg">{column.heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-fg-secondary transition-colors hover:text-fg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-fg-tertiary">
            © {new Date().getFullYear()} __APP_NAME__. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              className="text-sm text-fg-secondary transition-colors hover:text-fg"
            >
              Privacy
            </a>
            <a href="#terms" className="text-sm text-fg-secondary transition-colors hover:text-fg">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
