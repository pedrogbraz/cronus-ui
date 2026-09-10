// @ts-nocheck
"use client";

import { cn } from "../../lib/utils";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

interface KineticTestimonialsProps {
  rows: Testimonial[][];
  speeds?: string[];
  className?: string;
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="mx-3 flex h-[180px] w-[320px] shrink-0 flex-col justify-between rounded-2xl border border-border bg-card p-5">
      <p className="line-clamp-4 text-sm leading-relaxed text-foreground">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 border-t border-border pt-4">
        <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-muted">
          {item.avatar ? (
            <img src={item.avatar} alt={item.name} className="size-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
              {item.name.slice(0, 2)}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.role}</p>
        </div>
      </div>
    </div>
  );
}

function Row({
  items,
  speed,
  direction,
}: {
  items: Testimonial[];
  speed: string;
  direction: "left" | "right";
}) {
  const doubled = [...items, ...items];

  return (
    <div
      className="flex w-max"
      style={{
        animation: `marquee ${speed} linear infinite`,
        animationDirection: direction === "right" ? "reverse" : "normal",
      }}
    >
      {doubled.map((item, i) => (
        <TestimonialCard key={i} item={item} />
      ))}
    </div>
  );
}

export function KineticTestimonials({
  rows,
  speeds = ["30s", "30s"],
  className,
}: KineticTestimonialsProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="flex flex-col gap-4">
        {rows.map((row, idx) => (
          <div key={idx} className="relative overflow-hidden">
            <Row
              items={row}
              speed={speeds[idx] || "30s"}
              direction={idx % 2 === 0 ? "left" : "right"}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}
