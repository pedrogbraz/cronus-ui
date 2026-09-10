// @ts-nocheck
"use client";

import {
  ArrowRight,
  BarChart2,
  Bot,
  CheckCircle2,
  Circle,
  Link2,
  type LucideIcon,
  Shield,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { FadeIn } from "../fade-in";

function useLoop(ms: number) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}

function InferenceViz() {
  const loop = useLoop(3800);
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const t = [
      setTimeout(() => setStep(0), 0),
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => setStep(3), 1900),
    ];
    return () => t.forEach(clearTimeout);
  }, [loop]);

  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 font-mono text-sm text-muted-foreground">
        <Zap className="size-4 text-yellow-500" />
        POST /v1/infer
      </div>
      <div className="flex flex-col gap-2">
        {[
          { label: "Request received", ms: null },
          { label: "Model inference", ms: "183ms" },
          { label: "Response streamed", ms: "312ms" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            animate={{ opacity: step >= i ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <AnimatePresence mode="wait">
              {step >= i ? (
                <motion.div
                  key="y"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                </motion.div>
              ) : (
                <Circle className="size-4 shrink-0 text-border" />
              )}
            </AnimatePresence>
            <span className="flex-1 text-sm text-foreground">{s.label}</span>
            {s.ms && step >= i && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-500"
              >
                {s.ms}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-4 py-3">
        <span className="text-sm text-muted-foreground">P99 latency</span>
        <motion.span
          animate={{ opacity: step === 3 ? 1 : 0.3 }}
          className="font-mono text-xl font-bold text-foreground"
        >
          312ms
        </motion.span>
      </div>
    </div>
  );
}

function IntegrationsViz() {
  const loop = useLoop(4500);
  const [connected, setConnected] = React.useState<number[]>([]);
  const items = React.useMemo(
    () => [
      { name: "Slack", color: "bg-violet-500" },
      { name: "GitHub", color: "bg-zinc-700 dark:bg-zinc-300" },
      { name: "Notion", color: "bg-orange-400" },
      { name: "Stripe", color: "bg-indigo-500" },
      { name: "Linear", color: "bg-blue-500" },
      { name: "Figma", color: "bg-pink-500" },
      { name: "Jira", color: "bg-blue-400" },
      { name: "Resend", color: "bg-foreground" },
    ],
    [],
  );
  React.useEffect(() => {
    const resetId = setTimeout(() => setConnected([]), 0);
    const timeouts = items.map((_, i) =>
      setTimeout(() => setConnected((p) => [...p, i]), 300 + i * 280),
    );
    return () => {
      clearTimeout(resetId);
      timeouts.forEach(clearTimeout);
    };
  }, [loop, items]);

  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="grid grid-cols-4 gap-2">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            animate={{
              opacity: connected.includes(i) ? 1 : 0.2,
              scale: connected.includes(i) ? 1 : 0.92,
            }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-muted/30 py-3"
          >
            <div className={cn("size-5 rounded-md", item.color)} />
            <span className="text-[10px] text-muted-foreground">{item.name}</span>
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
      <div className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Link2 className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Connected</span>
        </div>
        <span className="font-mono text-xl font-bold text-foreground">
          {connected.length}
          <span className="text-sm font-normal text-muted-foreground">/200+</span>
        </span>
      </div>
    </div>
  );
}

function SecurityViz() {
  return (
    <div className="flex h-full min-h-80 flex-col items-center justify-center gap-5 p-6">
      <div className="relative flex size-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
        <Shield className="size-8 text-emerald-500" />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl border border-emerald-500/30"
        />
        <motion.div
          animate={{ scale: [1, 1.9, 1], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-0 rounded-2xl border border-emerald-500/20"
        />
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {["SOC 2 Type II", "End-to-end encryption", "RBAC & audit logs", "SSO / SCIM"].map(
          (item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5"
            >
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
              <span className="text-xs text-foreground">{item}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function AnalyticsViz() {
  const loop = useLoop(4000);
  const targets = React.useMemo(() => [42, 68, 38, 82, 55, 91, 74, 96, 62, 100, 78, 88], []);
  const [bars, setBars] = React.useState(targets.map(() => 0));
  React.useEffect(() => {
    const resetId = setTimeout(() => setBars(targets.map(() => 0)), 0);
    const timeouts = targets.map((target, i) =>
      setTimeout(
        () =>
          setBars((p) => {
            const n = [...p];
            n[i] = target;
            return n;
          }),
        150 + i * 100,
      ),
    );
    return () => {
      clearTimeout(resetId);
      timeouts.forEach(clearTimeout);
    };
  }, [loop, targets]);

  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="flex h-24 items-end gap-1.5">
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
            className="rounded-xl border border-border bg-muted/30 px-3 py-3 text-center"
          >
            <p className={cn("text-xl font-bold", m.color)}>{m.val}</p>
            <p className="text-[11px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentsViz() {
  const loop = useLoop(5000);
  const [activeStep, setActiveStep] = React.useState(-1);
  const steps = React.useMemo(
    () => [
      "Trigger: new data",
      "Fetch context",
      "Run LLM chain",
      "Execute action",
      "Emit result ✓",
    ],
    [],
  );
  React.useEffect(() => {
    const timeouts = steps.map((_, i) => setTimeout(() => setActiveStep(i), 500 + i * 700));
    timeouts.unshift(setTimeout(() => setActiveStep(-1), 0));
    return () => timeouts.forEach(clearTimeout);
  }, [loop, steps]);

  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2.5">
        <Bot className="size-4 text-violet-500" />
        <span className="font-mono text-sm text-muted-foreground">agent:deploy-pipeline</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            animate={{ opacity: activeStep >= i ? 1 : 0.2 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
              activeStep === i && "bg-muted",
            )}
          >
            <motion.div
              animate={{ scale: activeStep === i ? [1, 1.4, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "size-2 shrink-0 rounded-full",
                activeStep > i
                  ? "bg-emerald-500"
                  : activeStep === i
                    ? "bg-violet-500"
                    : "bg-border",
              )}
            />
            <span className="text-sm text-foreground">{step}</span>
            {activeStep > i && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EdgeViz() {
  const pops = [
    { x: 20, y: 40 },
    { x: 48, y: 28 },
    { x: 76, y: 52 },
    { x: 12, y: 62 },
    { x: 60, y: 70 },
    { x: 88, y: 35 },
  ];
  return (
    <div className="flex h-full min-h-80 flex-col justify-center gap-4 p-6">
      <div className="relative h-32 w-full overflow-hidden rounded-xl border border-border bg-muted/20">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {pops.map((p, i) => (
          <div key={i} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
              className="absolute -inset-2 rounded-full bg-emerald-500/20"
            />
            <div className="size-2.5 rounded-full bg-emerald-500" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-4 py-3">
        <span className="text-sm text-muted-foreground">Active PoPs worldwide</span>
        <span className="font-mono text-xl font-bold text-foreground">200+</span>
      </div>
    </div>
  );
}

export interface Feature {
  title: string;
  description: string;
  viz: React.ComponentType;
  icon: LucideIcon;
  iconColor: string;
  badge: string;
  span?: string;
}

const defaultFeatures: Feature[] = [
  {
    title: "Real-Time AI Inference",
    description:
      "Deploy and run models at sub-500ms P99 latency with auto-scaling infrastructure. Zero cold starts, zero ops overhead , ever.",
    viz: InferenceViz,
    icon: Zap,
    iconColor: "text-yellow-500",
    badge: "< 500ms",
    span: "lg:col-span-2",
  },
  {
    title: "Enterprise-Grade Security",
    description:
      "SOC 2 Type II certified. End-to-end encryption, role-based access, full audit logs, and SSO built in from day one.",
    viz: SecurityViz,
    icon: Shield,
    iconColor: "text-emerald-500",
    badge: "SOC 2",
  },
  {
    title: "Intelligent Analytics",
    description:
      "Actionable insights from every data pipeline. Custom dashboards, anomaly detection, and real-time alerting , all without SQL.",
    viz: AnalyticsViz,
    icon: BarChart2,
    iconColor: "text-violet-500",
    badge: "Real-time",
  },
  {
    title: "Universal Integrations",
    description:
      "Connect to 200+ tools , Slack, Notion, GitHub, Salesforce , with a single OAuth click. Your stack, fully connected in minutes.",
    viz: IntegrationsViz,
    icon: Link2,
    iconColor: "text-blue-500",
    badge: "200+ apps",
    span: "lg:col-span-2",
  },
  {
    title: "Autonomous Agents",
    description:
      "Create multi-step AI agents that execute complex workflows across your entire stack , no code, no infrastructure, no limits.",
    viz: AgentsViz,
    icon: Bot,
    iconColor: "text-orange-500",
    badge: "No-code",
  },
  {
    title: "Global Edge Network",
    description:
      "200+ PoPs worldwide. Intelligent traffic routing, instant failover, and results delivered close to your users , always.",
    viz: EdgeViz,
    icon: Zap,
    iconColor: "text-emerald-500",
    badge: "200+ PoPs",
  },
];

interface FeaturesProps {
  heading?: string;
  headingAccent?: string;
  description?: string;
  features?: Feature[];
  className?: string;
}

export default function Features({
  heading = "Everything you need.",
  headingAccent = "Nothing you don't.",
  description = "One platform to build, ship, and scale AI-powered products. Every primitive you need, none of the overhead you don't.",
  features = defaultFeatures,
  className,
}: FeaturesProps) {
  return (
    <section id="features" className={cn("border-t border-border py-28 px-5", className)}>
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {heading}
            <br />
            <span className="text-muted-foreground">{headingAccent}</span>
          </h2>
          <p className="mb-16 max-w-xl text-base text-muted-foreground">{description}</p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:auto-rows-fr">
          {features.map((feat, i) => {
            const Viz = feat.viz;
            const Icon = feat.icon;
            return (
              <FadeIn key={feat.title} delay={i * 0.05}>
                <div
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-sm",
                    feat.span,
                  )}
                >
                  <div className="flex flex-col justify-between gap-4 p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted">
                        <Icon className={cn("size-4", feat.iconColor)} />
                      </div>
                      <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        {feat.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-foreground">
                        {feat.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {feat.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more <ArrowRight className="size-3" />
                    </div>
                  </div>
                  <div className="mt-auto min-h-80 border-t border-border bg-muted/20">
                    <Viz />
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
