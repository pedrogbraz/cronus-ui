import { Avatar, AvatarFallback } from "@kronus-ui/ui/avatar";
import { Badge } from "@kronus-ui/ui/badge";
import { Button } from "@kronus-ui/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const FOUNDER_INITIALS = ["AK", "MR", "JD", "SL"] as const;

/** Centered hero: announcement badge, display headline, CTAs, social proof. */
export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-80 bg-gradient-primary opacity-20 blur-3xl"
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Badge variant="primary" className="gap-1.5">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Now in public beta
        </Badge>

        <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl">
          Ship products your team is{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">proud of</span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-lg text-fg-secondary">
          A modern toolkit for building accessible, themeable interfaces — so you spend less time on
          plumbing and more time on the product your customers love.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button variant="primary" size="lg" asChild>
            <a href="#waitlist">
              Join the waitlist
              <ArrowRight aria-hidden="true" />
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#features">See what's inside</a>
          </Button>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex -space-x-2">
            {FOUNDER_INITIALS.map((initials) => (
              <Avatar key={initials} className="size-9 border-2 border-surface-base shadow-xs">
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-sm text-fg-tertiary">
            Loved by <span className="font-medium text-fg">9,000+</span> builders
          </p>
        </div>
      </div>
    </section>
  );
}
