import { Badge } from "@kronus-ui/ui/badge";
import { Button } from "@kronus-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kronus-ui/ui/card";
import { Check, Sparkles } from "lucide-react";

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/ month",
    description: "Everything you need to launch your first project.",
    features: ["Up to 3 projects", "Community support", "1 GB storage", "Basic analytics"],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    description: "For growing teams that need more power and polish.",
    features: [
      "Unlimited projects",
      "Priority support",
      "50 GB storage",
      "Advanced analytics",
      "Custom domains",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "Dedicated infrastructure and support at scale.",
    features: ["Everything in Pro", "SSO & SAML", "Dedicated success manager", "99.99% uptime SLA"],
    cta: "Contact sales",
    featured: false,
  },
] as const;

/** Three pricing tiers with a featured middle card. */
export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Pricing</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          Start for free and scale as you grow. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] items-start gap-6">
        {PRICING_TIERS.map((tier) => (
          <Card
            key={tier.name}
            className={
              tier.featured
                ? "relative border-primary shadow-glow lg:-translate-y-3"
                : "border-border"
            }
          >
            {tier.featured ? (
              <Badge
                variant="primary"
                className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1.5"
              >
                <Sparkles aria-hidden="true" className="size-3.5" />
                Most popular
              </Badge>
            ) : null}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight text-fg">
                  {tier.price}
                </span>
                {tier.cadence ? (
                  <span className="text-sm text-fg-tertiary">{tier.cadence}</span>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-fg-secondary">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15">
                      <Check aria-hidden="true" className="size-3 text-primary" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={tier.featured ? "primary" : "outline"} className="w-full">
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
