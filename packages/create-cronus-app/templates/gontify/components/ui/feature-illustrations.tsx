"use client";

import { Bot, CheckCircle2, Circle, Link2, Shield, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

function useLoop(ms: number) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}

const INFERENCE_STEPS = [
  { label: "Request received", latency: null },
  { label: "Model inference", latency: "183ms" },
  { label: "Response streamed", latency: "312ms" },
];

const INTEGRATIONS = [
  { name: "Slack", color: "bg-violet-500" },
  { name: "GitHub", color: "bg-foreground" },
  { name: "Notion", color: "bg-orange-400" },
  { name: "Stripe", color: "bg-indigo-500" },
  { name: "Linear", color: "bg-blue-500" },
  { name: "Figma", color: "bg-pink-500" },
];

const BAR_TARGETS = [55, 72, 48, 88, 65, 95, 78];
const INITIAL_BARS = BAR_TARGETS.map(() => 0);

const AGENT_STEPS = ["Trigger event", "Fetch context", "Run LLM chain", "Execute action", "Done ✓"];

const REGION_DELAYS = [0.3, 1.1, 0.7, 1.6, 0.0];

export function InferenceIllustration() {
  const loop = useLoop(4000);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const resetId = setTimeout(() => setStep(0), 0);
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 2000),
    ];
    return () => {
      clearTimeout(resetId);
      timers.forEach(clearTimeout);
    };
  }, [loop]);

  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
        <Zap className="size-3 text-yellow-500" />
        POST /v1/infer
      </div>
      <div className="flex flex-col gap-1.5">
        {INFERENCE_STEPS.map((s, i) => (
          <motion.div
            key={s.label}
            animate={{ opacity: step >= i ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5"
          >
            <AnimatePresence mode="wait">
              {step >= i ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div key="circle" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Circle className="size-3.5 shrink-0 text-border" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="flex-1 text-xs text-foreground">{s.label}</span>
            {s.latency && step >= i && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-500"
              >
                {s.latency}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
        <span className="text-[11px] text-muted-foreground">P99 latency</span>
        <motion.span
          key={step}
          animate={{ opacity: step === 3 ? 1 : 0.3 }}
          className="font-mono text-sm font-bold text-foreground"
        >
          312ms
        </motion.span>
      </div>
    </div>
  );
}

export function IntegrationsIllustration() {
  const loop = useLoop(5000);
  const [connected, setConnected] = React.useState<number[]>([]);

  React.useEffect(() => {
    const resetId = setTimeout(() => setConnected([]), 0);
    const timers = INTEGRATIONS.map((_, i) =>
      setTimeout(() => setConnected((prev) => [...prev, i]), 400 + i * 350),
    );
    return () => {
      clearTimeout(resetId);
      timers.forEach(clearTimeout);
    };
  }, [loop]);

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5">
      <div className="grid grid-cols-3 gap-2">
        {INTEGRATIONS.map((int, i) => (
          <motion.div
            key={int.name}
            animate={{
              opacity: connected.includes(i) ? 1 : 0.25,
              scale: connected.includes(i) ? 1 : 0.95,
            }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-muted/40 py-3"
          >
            <div className={cn("size-5 rounded-md", int.color)} />
            <span className="text-[10px] text-muted-foreground">{int.name}</span>
            {connected.includes(i) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="size-1.5 rounded-full bg-emerald-500"
              />
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <Link2 className="size-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Connected</span>
        </div>
        <motion.span
          animate={{ opacity: 1 }}
          className="font-mono text-sm font-bold text-foreground"
        >
          {connected.length}/200+
        </motion.span>
      </div>
    </div>
  );
}

export function SecurityIllustration() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="flex items-center justify-center">
        <div className="relative flex size-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
          <Shield className="size-7 text-emerald-500" />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl border border-emerald-500/40"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {["SOC 2 Type II", "End-to-end encryption", "RBAC & audit logs", "SSO / SCIM"].map(
          (item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
              <span className="text-xs text-foreground">{item}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export function AnalyticsIllustration() {
  const loop = useLoop(4500);
  const [bars, setBars] = React.useState(INITIAL_BARS);

  React.useEffect(() => {
    const resetId = setTimeout(() => setBars(INITIAL_BARS), 0);
    const timers = BAR_TARGETS.map((target, i) =>
      setTimeout(
        () => {
          setBars((prev) => {
            const next = [...prev];
            next[i] = target;
            return next;
          });
        },
        200 + i * 120,
      ),
    );
    return () => {
      clearTimeout(resetId);
      timers.forEach(clearTimeout);
    };
  }, [loop]);

  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="flex items-end gap-1.5 h-16">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: `${h}%` }}
            initial={{ height: "0%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 rounded-sm bg-foreground/20"
            style={{ minHeight: 2 }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Anomalies", val: "0", color: "text-emerald-500" },
          { label: "Pipelines", val: "24", color: "text-foreground" },
          { label: "Alerts", val: "3", color: "text-yellow-500" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-border bg-muted/40 px-2 py-2 text-center"
          >
            <p className={cn("text-base font-black", m.color)}>{m.val}</p>
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgentsIllustration() {
  const loop = useLoop(5500);
  const [activeStep, setActiveStep] = React.useState(-1);

  React.useEffect(() => {
    const resetId = setTimeout(() => setActiveStep(-1), 0);
    const timers = AGENT_STEPS.map((_, i) => setTimeout(() => setActiveStep(i), 600 + i * 700));
    return () => {
      clearTimeout(resetId);
      timers.forEach(clearTimeout);
    };
  }, [loop]);

  return (
    <div className="flex h-full flex-col justify-center gap-2 p-5">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2">
        <Bot className="size-3.5 text-violet-500" />
        <span className="font-mono text-[11px] text-muted-foreground">agent:deploy-pipeline</span>
      </div>
      <div className="flex flex-col gap-1">
        {AGENT_STEPS.map((step, i) => (
          <motion.div
            key={step}
            animate={{ opacity: activeStep >= i ? 1 : 0.2 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 rounded-md px-2 py-1.5"
            style={{ background: activeStep === i ? "hsl(var(--muted))" : "transparent" }}
          >
            <motion.div
              animate={{ scale: activeStep === i ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                activeStep > i
                  ? "bg-emerald-500"
                  : activeStep === i
                    ? "bg-violet-500"
                    : "bg-border",
              )}
            />
            <span className="text-xs text-foreground">{step}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function EdgeIllustration() {
  const regions = [
    { name: "US East", x: 22, y: 42, active: true },
    { name: "EU West", x: 48, y: 32, active: true },
    { name: "AP SE", x: 78, y: 55, active: true },
    { name: "US West", x: 10, y: 50, active: false },
    { name: "SA East", x: 30, y: 72, active: false },
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="relative h-24 w-full rounded-xl border border-border bg-muted/30 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        {regions.map((r, idx) => (
          <div key={r.name} className="absolute" style={{ left: `${r.x}%`, top: `${r.y}%` }}>
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: REGION_DELAYS[idx] }}
              className={cn(
                "absolute -inset-2 rounded-full",
                r.active ? "bg-emerald-500/20" : "bg-muted-foreground/10",
              )}
            />
            <div
              className={cn(
                "size-2 rounded-full",
                r.active ? "bg-emerald-500" : "bg-muted-foreground/40",
              )}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Active PoPs</span>
        <span className="font-mono text-sm font-bold text-foreground">200+</span>
      </div>
    </div>
  );
}
