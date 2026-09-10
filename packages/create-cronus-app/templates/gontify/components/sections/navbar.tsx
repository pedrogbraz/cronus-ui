"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { ShinyButton } from "@/components/ui/shiny-button";
import { navLinks } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface NavbarProps {
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export default function Navbar({
  signInHref = "/login",
  ctaText = "Get started",
  ctaHref = "#pricing",
  className,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent",
        className,
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-[11px] font-black text-background transition-transform group-hover:scale-105">
            {siteConfig.name.charAt(0).toUpperCase()}
          </span>
          <span className="text-sm font-bold tracking-tight">{siteConfig.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link
            href={signInHref}
            className="hidden rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <ShinyButton href={ctaHref} className="hidden sm:inline-flex">
            {ctaText}
          </ShinyButton>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-5 py-4 backdrop-blur-xl md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-2 border-t border-border pt-3">
            <Link
              href={signInHref}
              className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-medium"
            >
              Sign in
            </Link>
            <ShinyButton href={ctaHref} className="flex-1">
              {ctaText}
            </ShinyButton>
          </div>
        </div>
      )}
    </header>
  );
}
