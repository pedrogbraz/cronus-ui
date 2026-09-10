"use client";

import { cn } from "@/lib/utils";

interface Logo {
  name: string;
  icon?: React.ReactNode;
}

interface FlowingLogosProps {
  logos: Logo[];
  className?: string;
  speed?: string;
}

export function FlowingLogos({ logos, className, speed = "28s" }: FlowingLogosProps) {
  const doubled = [...logos, ...logos];

  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div
        className="flex shrink-0 items-center gap-14 pr-14"
        style={{ animation: `marquee ${speed} linear infinite` }}
      >
        {doubled.map((logo, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            {logo.icon && <span className="size-5">{logo.icon}</span>}
            <span className="text-base md:text-lg font-semibold tracking-tight">{logo.name}</span>
          </div>
        ))}
      </div>

      <div
        className="flex shrink-0 items-center gap-14 pr-14"
        aria-hidden
        style={{ animation: `marquee ${speed} linear infinite` }}
      >
        {doubled.map((logo, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            {logo.icon && <span className="size-5">{logo.icon}</span>}
            <span className="text-base md:text-lg font-semibold tracking-tight">{logo.name}</span>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-linear-to-l from-background to-transparent" />
    </div>
  );
}
