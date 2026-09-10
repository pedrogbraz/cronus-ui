"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { ShinyButton } from "@/components/ui/shiny-button";
import { cn } from "@/lib/utils";
import { VercelCard } from "../ui/vercel-card";

interface CTAProps {
  headline?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaEmail?: string;
  disclaimer?: string;
  className?: string;
}

export default function CTA({
  headline = "Ready to build smarter?",
  description = "Join thousands of teams already using this platform to ship faster, automate more, and scale without limits.",
  primaryCtaText = "Start for free",
  primaryCtaHref = "#pricing",
  secondaryCtaText = "Talk to sales",
  secondaryCtaEmail = "sales@yourdomain.com",
  disclaimer = "No credit card required · 14-day free trial · Cancel anytime",
  className,
}: CTAProps) {
  return (
    <section id="contact" className={cn("border-t border-border py-24 px-5", className)}>
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <VercelCard className="w-full">
            <div className="relative z-10 flex flex-col items-center gap-8 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {headline}
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <ShinyButton href={primaryCtaHref} className="gap-2 px-7 py-3">
                  {primaryCtaText} <ArrowRight className="size-4" />
                </ShinyButton>
                <Link
                  href={`mailto:${secondaryCtaEmail}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-7 py-3 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-accent"
                >
                  {secondaryCtaText}
                </Link>
              </div>
              <p className="text-xs text-muted-foreground/50">{disclaimer}</p>
            </div>
          </VercelCard>
        </FadeIn>
      </div>
    </section>
  );
}
