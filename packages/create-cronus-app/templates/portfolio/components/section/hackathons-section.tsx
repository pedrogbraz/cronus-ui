/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import { DATA } from "@/data/resume";

export default function HackathonsSection() {
  return (
    <div className="p-8 sm:p-12">
      <FadeIn>
        <div className="flex items-end justify-between mb-8">
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground">
            06 — Community
          </p>
          <span className="text-[10px] font-mono text-muted-foreground/40">
            {DATA.community.length} highlights
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={0.04}>
        <div className="grid grid-cols-[24px_1fr_auto] gap-3 sm:gap-6 pb-3 border-b border-border mb-1">
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/30">
            #
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/30">
            Moment
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/30 text-right">
            Year
          </span>
        </div>
      </FadeIn>

      <Stagger className="flex flex-col" staggerDelay={0.04} initialDelay={0.06}>
        {DATA.community.map((h, i) => (
          <StaggerItem key={h.title + h.dates}>
            <div className="group grid grid-cols-[24px_1fr_auto] gap-3 sm:gap-6 py-4 border-b border-border/40 last:border-0 hover:bg-accent/20 -mx-3 px-3 rounded-lg transition-colors duration-150">
              <span className="text-[10px] font-mono tabular-nums text-muted-foreground/25 mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  {h.image && (
                    <div className="w-5 h-5 rounded overflow-hidden border border-border flex-none bg-muted shrink-0">
                      <img
                        src={h.image}
                        alt={h.title}
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground leading-tight">
                    {h.title}
                  </span>
                  {(h as any).win && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-foreground text-background leading-none">
                      {(h as any).win}
                    </span>
                  )}
                </div>
                {h.location && (
                  <p className="text-[10px] font-mono text-muted-foreground/50 mb-1">
                    {h.location}
                  </p>
                )}

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    i < 3 ? "max-h-50" : "max-h-0 group-hover:max-h-50"
                  }`}
                >
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {h.description}
                  </p>
                  {h.links.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {h.links.map((l, li) => (
                        <Link key={li} href={l.href} target="_blank" rel="noopener noreferrer">
                          <span className="text-[10px] font-mono px-2 py-0.5 border border-border rounded text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                            {l.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono text-muted-foreground/35 tabular-nums text-right mt-0.5 whitespace-nowrap">
                {h.dates.match(/\d{4}/)?.[0] ?? ""}
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
