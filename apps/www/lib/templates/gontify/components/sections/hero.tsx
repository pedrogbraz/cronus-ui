// @ts-nocheck
"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { Announcement } from "../ui/announcement";
import { ColumnLines } from "../ui/column-lines";
import { ShinyButton } from "../ui/shiny-button";

interface HeroProps {
  announcementBadge?: string;
  announcementText?: string;
  announcementHref?: string;
  headline?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  className?: string;
}

const chartBars = [38, 60, 44, 78, 56, 88, 72, 95, 68, 100, 82, 86];

const events = [
  { label: "Agent deployed", time: "2m ago", color: "bg-emerald-500" },
  { label: "Integration sync", time: "14m ago", color: "bg-blue-400" },
  { label: "Alert resolved", time: "1h ago", color: "bg-yellow-400" },
  { label: "Model updated", time: "3h ago", color: "bg-violet-400" },
];

const metrics = [
  { label: "Active agents", val: "12", trend: "+3 today" },
  { label: "Avg latency", val: "312ms", trend: "↓ 18%" },
];

export default function Hero({
  announcementBadge = "New",
  announcementText = "Autonomous agents , now in GA",
  announcementHref = "#",
  headline = "Intelligence at scale.",
  description = "The AI-native platform that turns raw data into decision-ready intelligence. Build, automate, and scale , without limits.",
  primaryCtaText = "Start for free",
  primaryCtaHref = "#pricing",
  secondaryCtaText = "See how it works",
  secondaryCtaHref = "#features",
  className,
}: HeroProps) {
  return (
    <ColumnLines
      columnWidth={80}
      columnCount={16}
      radialFadeStart={25}
      radialFadeEnd={65}
      noiseOpacity={0.04}
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center px-5",
        className,
      )}
    >
      <div className="mx-auto pt-16 flex max-w-3xl flex-col items-center gap-7 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Announcement badge={announcementBadge} href={announcementHref}>
            {announcementText}
          </Announcement>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-120 text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <ShinyButton href={primaryCtaHref} className="gap-2 px-7 py-3 text-sm">
            {primaryCtaText} <ArrowRight className="size-4" />
          </ShinyButton>
          <Link
            href={secondaryCtaHref}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-7 py-3 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-accent"
          >
            {secondaryCtaText}
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mx-auto mt-20 w-full max-w-5xl"
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-red-400/70" />
              <div className="size-3 rounded-full bg-yellow-400/70" />
              <div className="size-3 rounded-full bg-emerald-400/70" />
            </div>
            <div className="mx-auto rounded-md border border-border bg-background px-3 py-0.5 font-mono text-[11px] text-muted-foreground">
              app.yourdomain.com/dashboard
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 p-6">
            <div className="col-span-2 flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  AI Requests · Last 30 days
                </p>
                <div className="flex h-24 items-end gap-1">
                  {chartBars.map((h, i) => (
                    <div
                      key={i}
                      className="relative flex-1 overflow-hidden rounded-sm bg-foreground/10"
                      style={{ height: `${h}%` }}
                    >
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-sm bg-foreground/40"
                        style={{ height: `${h * 0.6}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">84,291 requests</span>
                  <span className="text-xs font-semibold text-emerald-500">↑ 23%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-border bg-background/60 p-4"
                  >
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">{m.val}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-emerald-500">{m.trend}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-1 flex-col rounded-xl border border-border bg-background/60 p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Recent events
                </p>
                <div className="flex flex-col gap-3">
                  {events.map((e, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className={`size-1.5 shrink-0 rounded-full ${e.color}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{e.label}</p>
                        <p className="text-[10px] text-muted-foreground">{e.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Uptime
                </p>
                <p className="text-2xl font-bold text-foreground">99.9%</p>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-5 flex-1 rounded-sm ${i === 14 ? "bg-yellow-400/60" : "bg-emerald-500/60"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </ColumnLines>
  );
}
