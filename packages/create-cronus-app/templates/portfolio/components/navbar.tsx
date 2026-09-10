"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { DATA } from "@/data/resume";
import { SoundToggle } from "./sound-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const socials = Object.entries(DATA.contact.social).filter(([, s]) => s.navbar);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md shadow-sm"
          : "border-b border-border bg-background"
      }`}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 h-12">
        <a href="#" className="flex items-center gap-2 group">
          <span className="w-6 h-6 rounded bg-foreground text-background text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            {DATA.initials}
          </span>
          <span className="text-xs font-mono text-muted-foreground hidden sm:block tracking-wide">
            {DATA.name}
          </span>
        </a>

        <div className="flex items-center gap-1">
          <SoundToggle />
          {socials.map(([name, social]) => {
            const Icon = social.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
            return (
              <a
                key={name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={name}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            );
          })}
          <div className="w-px h-4 bg-border mx-1" />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
