import { Button } from "@cronus-ui/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

/** Sticky translucent header: brand, anchor nav, and the primary CTA. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-surface-base/70 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-fg">
            __APP_NAME__
          </span>
        </Link>

        <ul className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <Button variant="primary" size="sm" asChild>
          <a href="#waitlist">Join the waitlist</a>
        </Button>
      </nav>
    </header>
  );
}
