"use client";

import { useTheme } from "@cronus-ui/theme";
import { Badge } from "@cronus-ui/ui/badge";
import { cn } from "@cronus-ui/ui/cn";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { OSS_URL } from "../lib/origins";
import { CronusMark } from "./brand/cronus-mark";

const NAV = [
  { label: "Pack", href: "#pack" },
  { label: "Pricing", href: "#pricing" },
  { label: "License", href: "#license" },
  { label: "FAQ", href: "#faq" },
] as const;

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

export function ProHeader() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";

  return (
    <header className="sticky top-0 z-50 overflow-x-clip border-b border-border bg-surface-base/70 backdrop-blur-xl">
      <nav
        className="relative z-10 mx-auto flex h-16 w-full min-w-0 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
        >
          <CronusMark className="h-5 w-10 text-fg transition-opacity group-hover:opacity-90" />
          <span className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-fg">Cronus Pro</span>
            <Badge variant="secondary" className="hidden px-1.5 py-0 text-[10px] sm:inline-flex">
              Additive
            </Badge>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center rounded-lg px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={OSS_URL}
            className="hidden items-center gap-1 rounded-lg px-3 py-2 text-sm text-fg-secondary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
          >
            Open source
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground outline-none transition-opacity duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Get Pro
          </a>
          <button
            type="button"
            onClick={toggleMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="grid size-9 place-items-center rounded-lg text-fg-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ModeIcon isDark={isDark} />
          </button>
        </div>
      </nav>
    </header>
  );
}
