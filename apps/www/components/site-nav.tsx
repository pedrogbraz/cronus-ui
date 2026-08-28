"use client";

import { useTheme } from "@cronus-ui/theme";
import { Badge } from "@cronus-ui/ui/badge";
import { cn } from "@cronus-ui/ui/cn";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@cronus-ui/ui/sheet";
import { Github, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CronusMark } from "./brand/cronus-mark";
import { CommandSearch } from "./docs/command-search";
import { ComponentNavList } from "./docs/docs-sidebar";
import { DocumentationNavList } from "./docs/documentation-nav";

/** Primary chrome — short on purpose. */
const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/components" },
  { label: "Blocks", href: "/blocks" },
  { label: "Templates", href: "/templates" },
  { label: "Create", href: "/create" },
] as const;

const moreLinks = [
  { label: "Themes", href: "/themes" },
  { label: "Stack", href: "/stack" },
  { label: "Changelog", href: "/changelog" },
  { label: "Sponsor", href: "/sponsor" },
] as const;

const GITHUB_URL = "https://github.com/pedrogbraz/cronus-ui";

/** Sun ⇄ moon glyph that crossfades with the active color mode (motion-reduce safe). */
function ModeIcon({ isDark }: { isDark: boolean }) {
  return (
    <span className="relative block size-[18px]" aria-hidden="true">
      <Sun
        className={cn(
          "absolute inset-0 size-[18px] transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
          isDark
            ? "opacity-0 motion-safe:-rotate-90 motion-safe:scale-0"
            : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute inset-0 size-[18px] transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "opacity-0 motion-safe:rotate-90 motion-safe:scale-0",
        )}
      />
    </span>
  );
}

export function SiteNav() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";
  const [mobileOpen, setMobileOpen] = useState(false);
  const compactMobile = usePathname() === "/";
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const sync = () => {
      document.documentElement.style.setProperty("--site-header-height", `${node.offsetHeight}px`);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--site-header-height");
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface-base/70 backdrop-blur-xl"
      >
        <nav
          className="relative z-10 mx-auto flex h-16 w-full min-w-0 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
          aria-label="Primary"
        >
          {/* Left — logo + wordmark + version */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
          >
            <CronusMark className="h-5 w-10 text-fg transition-opacity group-hover:opacity-90" />
            <span className="flex items-center gap-2">
              <span className="font-display text-base font-semibold text-fg">Cronus UI</span>
              <Badge variant="secondary" className="hidden px-1.5 py-0 text-[10px] sm:inline-flex">
                v0.6.0
              </Badge>
            </span>
          </Link>

          {/* Center — nav links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right — search + github + light/dark + mobile menu */}
          <div className="flex shrink-0 items-center gap-2">
            <CommandSearch />

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View Cronus UI on GitHub"
              className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Github className="size-[18px]" aria-hidden="true" />
            </a>

            {/* Light / dark mode toggle — chrome stays Neutral. */}
            <button
              type="button"
              onClick={toggleMode}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ModeIcon isDark={isDark} />
            </button>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                aria-label="Open navigation menu"
                className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
              >
                <Menu className="size-[18px]" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 max-w-[85vw] gap-0 overflow-y-auto"
                aria-label="Navigation"
              >
                <SheetTitle>Menu</SheetTitle>

                <ul className="mt-4 flex flex-col gap-1">
                  {[...navLinks, ...moreLinks].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {compactMobile ? null : (
                  <>
                    <nav aria-label="Documentation" className="mt-6 text-sm">
                      <DocumentationNavList onNavigate={() => setMobileOpen(false)} />
                    </nav>

                    <nav aria-label="Components" className="mt-6 text-sm">
                      <ComponentNavList onNavigate={() => setMobileOpen(false)} />
                    </nav>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
      {/* Fixed header is out of flow. Spacer keeps page content below it.
        `position: sticky` dies when Radix RemoveScroll sets overflow:hidden
        on body (dialogs, command palette) — fixed does not. */}
      <div
        aria-hidden="true"
        className="w-full shrink-0"
        style={{ height: "var(--site-header-height, 4rem)" }}
      />
    </>
  );
}
