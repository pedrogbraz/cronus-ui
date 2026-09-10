"use client";

import { ArrowRight, CalendarCheck, Rocket, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";
import { FadeIn } from "@/components/fade-in";
import StatsCount from "@/components/ui/statscount";
import { cn } from "@/lib/utils";

export interface HowItWorksStep {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  detail: string;
}

export interface HowItWorksStat {
  label: string;
  value: number;
  suffix: string;
}

interface HowItWorksProps {
  heading?: string;
  headingAccent?: string;
  description?: string;
  steps?: HowItWorksStep[];
  stats?: HowItWorksStat[];
  className?: string;
}

const defaultSteps: HowItWorksStep[] = [
  {
    number: "01",
    icon: CalendarCheck,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    title: "Schedule a kickoff",
    description:
      "Book a 30-minute call with our team. We'll scope your use case, configure your workspace, and have you ready to deploy before the call ends.",
    detail: "Usually takes less than 30 minutes",
  },
  {
    number: "02",
    icon: Zap,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10 border-yellow-500/20",
    title: "Real-time collaboration",
    description:
      "Invite your team, connect your tools, and start building together. Our AI surfaces the right context at every step so nothing falls through the cracks.",
    detail: "Works with your existing stack",
  },
  {
    number: "03",
    icon: Rocket,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    title: "Launch and scale",
    description:
      "Go live with confidence. Auto-scaling infrastructure handles any volume, and our support team is ready to help you grow efficiently.",
    detail: "Zero-downtime deployments",
  },
  {
    number: "04",
    icon: Users,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Grow with your team",
    description:
      "Add members, expand permissions, and unlock advanced workflows as your team scales. Enterprise plans include dedicated onboarding and SLAs.",
    detail: "Unlimited team members on Enterprise",
  },
];

const defaultStats: HowItWorksStat[] = [
  { label: "Teams onboarded", value: 2500, suffix: "+" },
  { label: "Avg. time to first deploy", value: 5, suffix: " min" },
  { label: "Uptime SLA", value: 99.9, suffix: "%" },
];

function StepConnector() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <div className="flex items-center gap-1 text-border">
        <div className="h-px w-8 bg-border" />
        <ArrowRight className="size-3.5 text-muted-foreground/50" />
      </div>
    </div>
  );
}

export default function HowItWorks({
  heading = "Your platform, configured",
  headingAccent = "and ready to grow with you.",
  description = "From first login to full production , designed to be up and running in minutes, not months.",
  steps = defaultSteps,
  stats = defaultStats,
  className,
}: HowItWorksProps) {
  const [activeStep, setActiveStep] = React.useState<number | null>(null);

  return (
    <section id="how-it-works" className={cn("border-t border-border pt-20 px-5", className)}>
      <div className="mx-auto w-full max-w-7xl">
        <FadeIn>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {heading}
            <br />
            <span className="text-muted-foreground">{headingAccent}</span>
          </h2>
          <p className="mb-16 max-w-xl text-base text-muted-foreground">{description}</p>
        </FadeIn>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;
            return (
              <React.Fragment key={step.number}>
                <FadeIn delay={i * 0.1}>
                  <motion.div
                    onHoverStart={() => setActiveStep(i)}
                    onHoverEnd={() => setActiveStep(null)}
                    animate={{
                      scale: activeStep === null ? 1 : isActive ? 1.02 : 0.98,
                      opacity: activeStep === null ? 1 : isActive ? 1 : 0.55,
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex-1 flex flex-col gap-5 rounded-2xl border p-6 transition-colors duration-200 cursor-default h-full",
                      isActive ? "border-foreground/20 bg-card shadow-sm" : "border-border bg-card",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-xl border",
                          step.iconBg,
                        )}
                      >
                        <Icon className={cn("size-5", step.iconColor)} />
                      </div>
                      <span className="font-mono text-xs font-medium text-muted-foreground/50">
                        {step.number}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold tracking-tight text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-muted-foreground">{step.detail}</span>
                    </div>
                  </motion.div>
                </FadeIn>
                {i < steps.length - 1 && <StepConnector />}
              </React.Fragment>
            );
          })}
        </div>

        <FadeIn delay={0.4}>
          <StatsCount stats={stats} title="Used by teams, built for speed" />
        </FadeIn>
      </div>
    </section>
  );
}
