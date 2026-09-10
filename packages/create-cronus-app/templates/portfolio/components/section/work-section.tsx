/* eslint-disable @next/next/no-img-element */

import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import { DATA } from "@/data/resume";

export default function WorkSection() {
  return (
    <div className="p-8 sm:p-12">
      <FadeIn>
        <div className="flex items-end justify-between mb-8">
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground">
            02 — Work Experience
          </p>
          <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">
            {DATA.work.length} roles
          </span>
        </div>
      </FadeIn>

      <Stagger className="flex flex-col" staggerDelay={0.07}>
        {DATA.work.map((job, i) => (
          <StaggerItem key={job.company + job.title}>
            <div className="group grid grid-cols-[48px_1fr] sm:grid-cols-[48px_1fr_160px] gap-4 sm:gap-6 py-6 border-b border-border/60 last:border-0 hover:bg-accent/20 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-lg transition-colors duration-150 cursor-default">
              <div className="flex flex-col items-center gap-2 pt-0.5">
                <span className="text-[10px] font-mono tabular-nums text-muted-foreground/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center flex-none">
                  {job.logoUrl ? (
                    <img
                      src={job.logoUrl}
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {job.company[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                  <a
                    href={job.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-foreground hover:underline underline-offset-4"
                  >
                    {job.company}
                  </a>
                  <span className="text-muted-foreground/40 text-xs">—</span>
                  <span className="text-xs text-muted-foreground">{job.title}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/40">
                    {job.location}
                  </span>

                  <span className="text-[10px] font-mono text-muted-foreground/40 sm:hidden ml-auto">
                    {job.start} – {job.end ?? "Now"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{job.description}</p>
              </div>

              <div className="hidden sm:flex flex-col items-end pt-0.5 gap-1">
                <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums text-right">
                  {job.start}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground/25">↓</span>
                <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums text-right">
                  {job.end ?? "Present"}
                </span>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
