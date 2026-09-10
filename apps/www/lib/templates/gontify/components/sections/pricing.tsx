// @ts-nocheck
"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { FadeIn, Stagger, StaggerItem } from "../fade-in";

export interface PricingPlan {
  name: string;
  monthly: number | null;
  annual: number | null;
  description: string;
  highlight?: boolean;
  features: string[];
  cta: string;
  href: string;
}

interface PricingProps {
  heading?: string;
  disclaimer?: string;
  plans?: PricingPlan[];
  className?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    description: "Perfect for indie hackers and early exploration.",
    features: [
      "5,000 AI requests/mo",
      "3 integrations",
      "Community support",
      "1 workspace",
      "Basic analytics",
    ],
    cta: "Start for free",
    href: "#",
  },
  {
    name: "Pro",
    monthly: 49,
    annual: 39,
    description: "Built for growing teams shipping fast.",
    highlight: true,
    features: [
      "100,000 AI requests/mo",
      "Unlimited integrations",
      "Priority support",
      "10 workspaces",
      "Advanced analytics",
      "Custom AI agents",
      "Full API access",
    ],
    cta: "Start free trial",
    href: "#",
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    description: "For orgs with scale, security, and compliance needs.",
    features: [
      "Unlimited requests",
      "Dedicated infra",
      "24/7 SLA support",
      "Unlimited workspaces",
      "SOC 2 / HIPAA",
      "Custom SLA",
      "SSO & SCIM",
    ],
    cta: "Contact sales",
    href: "#contact",
  },
];

export default function Pricing({
  heading = "Simple, transparent pricing.",
  disclaimer = "All plans include a 14-day free trial · No credit card required · Cancel anytime",
  plans = defaultPlans,
  className,
}: PricingProps) {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className={cn("border-t border-border py-24 px-5", className)}>
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="mb-10 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
          <div className="mb-10 flex items-center gap-3">
            <span
              className={cn(
                "text-sm transition-colors",
                !annual ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setAnnual(!annual)}
              className={cn(
                "relative h-6 w-11 rounded-full border border-border transition-colors",
                annual ? "bg-foreground" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-5 rounded-full transition-transform",
                  annual ? "translate-x-5 bg-background" : "bg-foreground/30",
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm transition-colors",
                annual ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              Annual <span className="font-semibold text-emerald-500">–20%</span>
            </span>
          </div>
        </FadeIn>

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-6 transition-all",
                  plan.highlight
                    ? "scale-[1.02] border-foreground bg-foreground text-background shadow-2xl"
                    : "border-border bg-card hover:border-foreground/20",
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-foreground/20 bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <p
                    className={cn(
                      "font-mono text-[11px] uppercase tracking-widest",
                      plan.highlight ? "text-background/60" : "text-muted-foreground",
                    )}
                  >
                    {plan.name}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight">
                      {plan.monthly === null
                        ? "Custom"
                        : plan.monthly === 0
                          ? "Free"
                          : `$${annual ? plan.annual : plan.monthly}`}
                    </span>
                    {plan.monthly !== null && plan.monthly > 0 && (
                      <span
                        className={cn(
                          "text-sm",
                          plan.highlight ? "text-background/60" : "text-muted-foreground",
                        )}
                      >
                        /mo
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-sm",
                      plan.highlight ? "text-background/70" : "text-muted-foreground",
                    )}
                  >
                    {plan.description}
                  </p>
                </div>
                <div
                  className={cn("mb-6 h-px", plan.highlight ? "bg-background/20" : "bg-border")}
                />
                <ul className="mb-6 flex flex-1 flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                          plan.highlight ? "bg-background/20" : "bg-muted",
                        )}
                      >
                        <Check className="size-2.5" strokeWidth={3} />
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          plan.highlight ? "text-background/90" : "text-muted-foreground",
                        )}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={cn(
                    "w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all",
                    plan.highlight
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/85",
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn delay={0.2}>
          <p className="mt-8 text-center text-xs text-muted-foreground">{disclaimer}</p>
        </FadeIn>
      </div>
    </section>
  );
}
