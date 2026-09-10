"use client";

import Link from "next/link";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export interface FooterLinkGroup {
  label: string;
  items: { label: string; href: string }[];
}

interface FooterProps {
  tagline?: string;
  linkGroups?: FooterLinkGroup[];
  githubHref?: string;
  xHref?: string;
  className?: string;
}

const defaultLinkGroups: FooterLinkGroup[] = [
  {
    label: "Product",
    items: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    label: "Developers",
    items: [
      { label: "Docs", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "SDKs", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export default function Footer({
  tagline = "AI-native infrastructure for modern teams.",
  linkGroups = defaultLinkGroups,
  githubHref = "https://github.com/YOUR_ORG",
  xHref = "https://x.com/YOUR_HANDLE",
  className,
}: FooterProps) {
  return (
    <footer className={cn("border-t border-border px-5 py-16", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="group flex w-fit items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-[11px] font-black text-background transition-transform group-hover:scale-105">
                {siteConfig.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-bold tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="max-w-40 text-xs leading-relaxed text-muted-foreground">{tagline}</p>
            <div className="flex gap-2">
              <Link
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
              >
                <Icons.github className="size-3.5" />
              </Link>
              <Link
                href={xHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
              >
                <Icons.x className="size-3.5" />
              </Link>
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {group.label}
              </p>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-muted-foreground/40">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px] text-muted-foreground/40">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
