"use client";

import { useTheme } from "@kronus-ui/theme";
import { type ThemeName, themeNames } from "@kronus-ui/tokens";
import { Badge } from "@kronus-ui/ui/badge";
import { cn } from "@kronus-ui/ui/cn";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@kronus-ui/ui/sheet";
import { Check, Github, Menu, Moon, Palette, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PRO_URL } from "../lib/site-url";
import { KronusMark } from "./brand/kronus-mark";
import { CommandSearch } from "./docs/command-search";
import { ComponentNavList } from "./docs/docs-sidebar";
import { DocumentationNavList } from "./docs/documentation-nav";
import { SiteAnnouncement } from "./site-announcement";

/** Primary chrome — short on purpose. Pro lives in the announcement + nudge. */
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

const GITHUB_URL = "https://github.com/pedrogbraz/kronus-ui";

/** Friendly Title Case label for each theme preset. */
const themeLabels: Record<ThemeName, string> = {
  aurora: "Aurora",
  neutral: "Neutral",
  midnight: "Midnight",
  sunset: "Sunset",
  emerald: "Emerald",
};

/** A representative swatch per theme, derived from each preset's `primary` token. */
const themeSwatches: Record<ThemeName, string> = {
  aurora: "oklch(0.685 0.169 237.3)",
  neutral: "oklch(0.62 0 0)",
  midnight: "oklch(0.55 0.205 280)",
  sunset: "oklch(0.78 0.16 65)",
  emerald: "oklch(0.74 0.16 160)",
};

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

/**
 * Theme-preset selector — a lightweight custom popover (button + a menu of the 5
 * presets with swatches) that re-themes the whole site live via `setTheme`.
 *
 * Deliberately NOT the Radix dropdown-menu: this control lives in the shared site
 * header, so pulling `@radix-ui/react-dropdown-menu` into it would tax the First
 * Load JS of EVERY route. A ~30-line native popover (outside-click + Escape to
 * close) keeps the shared bundle within budget while preserving the UX.
 */
function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change theme (current: ${themeLabels[theme]})`}
        onClick={() => setOpen((value) => !value)}
        className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring aria-expanded:bg-surface-overlay aria-expanded:text-fg"
      >
        <span className="relative grid size-[18px] place-items-center">
          <Palette className="size-[18px]" aria-hidden="true" />
          <span
            className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full ring-2 ring-surface-base"
            style={{ backgroundColor: themeSwatches[theme] }}
            aria-hidden="true"
          />
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Theme"
          aria-orientation="vertical"
          className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-surface-floating p-1 shadow-lg"
        >
          <p className="px-2.5 py-1.5 text-xs font-medium text-fg-tertiary" aria-hidden="true">
            Theme
          </p>
          {themeNames.map((name) => {
            const active = theme === name;
            return (
              <button
                key={name}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(name);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-surface-overlay text-fg"
                    : "text-fg-secondary hover:bg-surface-overlay hover:text-fg",
                )}
              >
                <span
                  className="size-3.5 shrink-0 rounded-full shadow-xs ring-1 ring-inset ring-border"
                  style={{ backgroundColor: themeSwatches[name] }}
                  aria-hidden="true"
                />
                {themeLabels[name]}
                {active ? (
                  <Check className="ml-auto size-4 text-primary" aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function SiteNav() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 overflow-x-clip border-b border-border bg-surface-base/70 backdrop-blur-xl">
      <SiteAnnouncement />
      <nav
        className="relative z-10 mx-auto flex h-16 w-full min-w-0 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Left — logo + wordmark + version */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
        >
          <KronusMark className="h-5 w-10 text-fg transition-opacity group-hover:opacity-90" />
          <span className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-fg">Kronus UI</span>
            <Badge variant="secondary" className="hidden px-1.5 py-0 text-[10px] sm:inline-flex">
              v0.5.0
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

        {/* Right — search + github + mode toggle + mobile menu */}
        <div className="flex shrink-0 items-center gap-2">
          <CommandSearch />

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="View Kronus UI on GitHub"
            className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Github className="size-[18px]" aria-hidden="true" />
          </a>

          {/* Theme preset selector */}
          <ThemeSelect />

          {/* Light / dark mode toggle */}
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
                <li>
                  <a
                    href={PRO_URL}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Pro
                  </a>
                </li>
              </ul>

              <nav aria-label="Documentation" className="mt-6 text-sm">
                <DocumentationNavList onNavigate={() => setMobileOpen(false)} />
              </nav>

              <nav aria-label="Components" className="mt-6 text-sm">
                <ComponentNavList onNavigate={() => setMobileOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
