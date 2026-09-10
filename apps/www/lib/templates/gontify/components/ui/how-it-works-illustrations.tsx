// @ts-nocheck
"use client";

import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Circle,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";

function useLoop(ms: number) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}

export function DeployIllustration() {
  const loop = useLoop(5000);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setStep(0), 0),
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2400),
      setTimeout(() => setStep(4), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [loop]);

  const lines = [
    { text: "$ npx nexus init my-app", color: "text-muted-foreground" },
    { text: "✓ Project scaffolded", color: "text-emerald-500" },
    { text: "✓ Agents configured", color: "text-emerald-500" },
    { text: "✓ Deployed to edge (3.1s)", color: "text-emerald-500" },
  ];

  return (
    <div className="flex h-full flex-col justify-center p-5">
      <div className="rounded-xl border border-border bg-background/80 p-4 font-mono text-xs">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: step >= i ? 1 : 0, x: step >= i ? 0 : -4 }}
            transition={{ duration: 0.3 }}
            className={cn("leading-6", line.color)}
          >
            {line.text}
            {step === i && i < lines.length - 1 && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-0.5 inline-block h-3.5 w-px bg-foreground align-middle"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function AlertIllustration() {
  const loop = useLoop(6000);
  const [sliderPct, setSliderPct] = React.useState(0);
  const [accepted, setAccepted] = React.useState(false);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const resetTimer = setTimeout(() => {
      setSliderPct(0);
      setAccepted(false);
    }, 0);

    const t = setTimeout(() => {
      const start = performance.now();
      const duration = 1600;
      const animate = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - p) ** 3;
        setSliderPct(eased * 100);
        if (p < 1) rafRef.current = requestAnimationFrame(animate);
        else setTimeout(() => setAccepted(true), 150);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 800);

    return () => {
      clearTimeout(resetTimer);
      clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loop]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
      <div className="flex size-10 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-lg">⚠️</span>
        </motion.div>
      </div>
      <p className="text-xs font-medium text-foreground">Latency spike detected</p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        p99 exceeded 800ms threshold on us-east-1 for 2 minutes.
      </p>
      <AnimatePresence mode="wait">
        {accepted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-xs font-medium text-white"
          >
            <CheckCircle2 className="size-3.5" /> Acknowledged
          </motion.div>
        ) : (
          <motion.div
            key="slider"
            className="relative h-9 w-full overflow-hidden rounded-xl bg-muted"
          >
            <div className="absolute inset-0 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <ArrowRight className="size-3" /> Slide to acknowledge
            </div>
            <div
              className="absolute left-0 top-0 h-full rounded-xl bg-emerald-400/20"
              style={{ width: `${sliderPct}%` }}
            />
            <div
              className="absolute top-1 flex h-7 w-9 items-center justify-center rounded-lg bg-emerald-500"
              style={{ left: `calc(${sliderPct}% - ${sliderPct * 0.36}px)` }}
            >
              <ArrowRight className="size-3 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ChecklistIllustration() {
  const loop = useLoop(7000);
  const ALL_TASKS = [
    "Connect data source",
    "Configure pipeline",
    "Set alert thresholds",
    "Deploy to production",
    "Enable monitoring",
  ];
  const allTasksLength = ALL_TASKS.length;
  const [completed, setCompleted] = React.useState(1);

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setCompleted(1), 0),
      ...[1400, 2800, 4200, 5600].map((delay) =>
        setTimeout(() => setCompleted((c) => Math.min(c + 1, allTasksLength)), delay),
      ),
    ];
    return () => timers.forEach(clearTimeout);
  }, [loop, allTasksLength]);

  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            animate={{ width: `${(completed / ALL_TASKS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full bg-emerald-500"
          />
        </div>
        <motion.span
          key={completed}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="whitespace-nowrap text-[10px] text-muted-foreground"
        >
          {completed}/{ALL_TASKS.length}
        </motion.span>
      </div>
      <div className="flex flex-col gap-2">
        {ALL_TASKS.slice(0, 4).map((task, i) => {
          const done = i < completed;
          return (
            <motion.div
              key={task}
              animate={{ opacity: done ? 1 : 0.4 }}
              className="flex items-center gap-2.5"
            >
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                  </motion.div>
                ) : (
                  <Circle className="size-3.5 shrink-0 text-border" />
                )}
              </AnimatePresence>
              <span
                className={cn(
                  "text-xs",
                  done
                    ? "text-foreground line-through decoration-muted-foreground/50"
                    : "text-muted-foreground",
                )}
              >
                {task}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function ContextMenuIllustration() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="overflow-hidden rounded-xl border border-border"
      >
        {[
          { icon: <Search className="size-3" />, label: "Edit pipeline" },
          {
            icon: <Sparkles className="size-3 text-emerald-500" />,
            label: "Generate with AI",
            special: true,
          },
          { icon: <BarChart2 className="size-3" />, label: "View analytics" },
          { icon: <RefreshCw className="size-3" />, label: "Re-run last" },
        ].map((row) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center gap-2 border-b border-border px-3.5 py-2.5 text-xs last:border-0",
              row.special
                ? "bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground",
            )}
          >
            {row.icon}
            {row.label}
            {row.special && <ChevronDown className="ml-auto size-3 -rotate-90" />}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
