"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Highlighter,
  Input,
  Label,
  Marquee,
  Meteors,
  RetroGrid,
  Separator,
  TypingText,
} from "@kronus-ui/ui";
import {
  ArrowRight,
  BarChart3,
  Check,
  Github,
  Hexagon,
  Layers,
  Linkedin,
  Lock,
  Menu,
  Palette,
  Send,
  Sparkles,
  Twitter,
  Workflow,
  Zap,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────
   1. HERO
   ────────────────────────────────────────────────────────────────── */

function HeroBlock() {
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
          <Button variant="primary" size="lg">
            Start free trial
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="outline" size="lg">
            Book a demo
          </Button>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex -space-x-2">
            {["AK", "MR", "JD", "SL"].map((initials) => (
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

const heroCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
} from "@kronus-ui/ui";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroBlock() {
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
          <Button variant="primary" size="lg">
            Start free trial
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="outline" size="lg">
            Book a demo
          </Button>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex -space-x-2">
            {["AK", "MR", "JD", "SL"].map((initials) => (
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
}`;

function SplitHeroBlock() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <div>
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Design systems in minutes
          </Badge>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.04] tracking-tight text-fg sm:text-6xl">
            Build the product surface before the backlog catches up.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-secondary">
            Compose accessible primitives, tokenized themes, and production-ready sections without
            re-solving every interaction from scratch.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg">
              Start building
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg">
              View templates
            </Button>
          </div>
        </div>

        <Card className="border-border bg-surface-raised/85 shadow-glow backdrop-blur">
          <CardHeader>
            <CardTitle>Release quality</CardTitle>
            <CardDescription>Everything tokenized before handoff.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              ["Components", "52 ready"],
              ["Themes", "Aurora + Neutral"],
              ["Coverage", "A11y pass"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-inset px-4 py-3"
              >
                <span className="text-sm text-fg-secondary">{label}</span>
                <span className="text-sm font-medium text-fg">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

const splitHeroCode = `import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kronus-ui/ui";
import { ArrowRight, Sparkles } from "lucide-react";

export function SplitHeroBlock() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <div>
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Design systems in minutes
          </Badge>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.04] tracking-tight text-fg sm:text-6xl">
            Build the product surface before the backlog catches up.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-secondary">
            Compose accessible primitives, tokenized themes, and production-ready sections without
            re-solving every interaction from scratch.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg">Start building <ArrowRight aria-hidden="true" /></Button>
            <Button variant="outline" size="lg">View templates</Button>
          </div>
        </div>

        <Card className="border-border bg-surface-raised/85 shadow-glow backdrop-blur">
          <CardHeader>
            <CardTitle>Release quality</CardTitle>
            <CardDescription>Everything tokenized before handoff.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              ["Components", "52 ready"],
              ["Themes", "Aurora + Neutral"],
              ["Coverage", "A11y pass"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-border bg-surface-inset px-4 py-3">
                <span className="text-sm text-fg-secondary">{label}</span>
                <span className="text-sm font-medium text-fg">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}`;

function CompactHeroBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface-raised p-8 text-center shadow-lg sm:p-12">
        <Badge variant="primary">New registry</Badge>
        <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
          Copy polished product sections into any React app.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-fg-secondary">
          Blocks inherit your theme, radius, color scale, and typography automatically.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="lg">
            Browse blocks
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="lg">
            Read docs
          </Button>
        </div>
        <div className="mx-auto mt-9 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {["Accessible", "Themeable", "Composable"].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-xl bg-surface-inset px-3 py-2"
            >
              <Check className="size-4 text-primary" aria-hidden="true" />
              <span className="text-sm text-fg-secondary">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AtmosphereHeroBlock() {
  return (
    <RetroGrid className="relative overflow-hidden">
      <Meteors className="px-6 py-24 sm:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="primary" className="gap-1.5">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Now in public beta
          </Badge>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] text-fg sm:text-6xl">
            Ship products your team is <Highlighter>proud of</Highlighter>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-fg-secondary">
            A product UI system: compose the app, theme it live, and keep the copy-in you can{" "}
            <TypingText className="font-medium text-fg" text={["upgrade.", "restyle.", "ship."]} />
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button variant="primary" size="lg">
              Start free trial
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg">
              Book a demo
            </Button>
          </div>
        </div>
      </Meteors>
    </RetroGrid>
  );
}

const atmosphereHeroCode = `import {
  Badge,
  Button,
  Highlighter,
  Meteors,
  RetroGrid,
  TypingText,
} from "@kronus-ui/ui";
import { ArrowRight, Sparkles } from "lucide-react";

export function AtmosphereHeroBlock() {
  return (
    <RetroGrid className="relative overflow-hidden">
      <Meteors className="px-6 py-24 sm:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="primary" className="gap-1.5">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Now in public beta
          </Badge>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] text-fg sm:text-6xl">
            Ship products your team is <Highlighter>proud of</Highlighter>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-fg-secondary">
            A product UI system: compose the app, theme it live, and keep the copy-in you can{" "}
            <TypingText className="font-medium text-fg" text={["upgrade.", "restyle.", "ship."]} />
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button variant="primary" size="lg">
              Start free trial
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg">
              Book a demo
            </Button>
          </div>
        </div>
      </Meteors>
    </RetroGrid>
  );
}`;

const compactHeroCode = `import { Badge, Button } from "@kronus-ui/ui";
import { ArrowRight, Check } from "lucide-react";

export function CompactHeroBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface-raised p-8 text-center shadow-lg sm:p-12">
        <Badge variant="primary">New registry</Badge>
        <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
          Copy polished product sections into any React app.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-fg-secondary">
          Blocks inherit your theme, radius, color scale, and typography automatically.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="lg">Browse blocks <ArrowRight aria-hidden="true" /></Button>
          <Button variant="ghost" size="lg">Read docs</Button>
        </div>
        <div className="mx-auto mt-9 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {["Accessible", "Themeable", "Composable"].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-xl bg-surface-inset px-3 py-2">
              <Check className="size-4 text-primary" aria-hidden="true" />
              <span className="text-sm text-fg-secondary">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   2. PRICING
   ────────────────────────────────────────────────────────────────── */

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

function PricingBlock() {
  return (
    <section className="px-6 py-20">
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

const pricingCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kronus-ui/ui";
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

export function PricingBlock() {
  return (
    <section className="px-6 py-20">
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
              <Badge variant="primary" className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1.5">
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
}`;

function PricingToggleBlock() {
  const tiers = [
    {
      name: "Launch",
      price: "$19",
      description: "For focused teams shipping one product.",
      features: ["Unlimited blocks", "Theme presets", "Email support"],
    },
    {
      name: "Scale",
      price: "$59",
      description: "For teams running multiple surfaces.",
      features: ["Everything in Launch", "Private registry", "Priority support"],
    },
  ] as const;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Plans</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Pick the pace that matches your team.
        </h2>
        <div className="mx-auto mt-6 inline-flex rounded-full border border-border bg-surface-inset p-1">
          <Button variant="secondary" size="sm" className="rounded-full">
            Monthly
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Annual - save 20%
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-6">
        {tiers.map((tier, index) => (
          <Card
            key={tier.name}
            className={index === 1 ? "border-primary shadow-glow" : "border-border"}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-fg">{tier.price}</span>
                <span className="text-sm text-fg-tertiary">/ month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-fg-secondary">
                    <Check className="size-4 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={index === 1 ? "primary" : "outline"} className="w-full">
                Choose {tier.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

const pricingToggleCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kronus-ui/ui";
import { Check } from "lucide-react";

export function PricingToggleBlock() {
  const tiers = [
    {
      name: "Launch",
      price: "$19",
      description: "For focused teams shipping one product.",
      features: ["Unlimited blocks", "Theme presets", "Email support"],
    },
    {
      name: "Scale",
      price: "$59",
      description: "For teams running multiple surfaces.",
      features: ["Everything in Launch", "Private registry", "Priority support"],
    },
  ] as const;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Plans</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Pick the pace that matches your team.
        </h2>
        <div className="mx-auto mt-6 inline-flex rounded-full border border-border bg-surface-inset p-1">
          <Button variant="secondary" size="sm" className="rounded-full">
            Monthly
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Annual - save 20%
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-6">
        {tiers.map((tier, index) => (
          <Card
            key={tier.name}
            className={index === 1 ? "border-primary shadow-glow" : "border-border"}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-fg">{tier.price}</span>
                <span className="text-sm text-fg-tertiary">/ month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-fg-secondary">
                    <Check className="size-4 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={index === 1 ? "primary" : "outline"} className="w-full">
                Choose {tier.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

function UsagePricingBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface-raised p-6 shadow-lg sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <Badge variant="primary">Usage based</Badge>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
              Start small, pay only when your product grows.
            </h2>
            <p className="mt-4 max-w-2xl text-fg-secondary">
              A pricing layout for APIs, infrastructure, and usage-metered products.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["10k events", "5 seats", "99.9% SLA"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border bg-surface-inset px-4 py-3 text-sm text-fg-secondary"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-primary bg-surface-floating shadow-glow">
            <CardHeader>
              <CardTitle>Growth</CardTitle>
              <CardDescription>Best for teams validating scale.</CardDescription>
              <div className="mt-2">
                <span className="font-display text-4xl font-semibold text-fg">$0.08</span>
                <span className="text-sm text-fg-tertiary"> / 1k events</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {["Unlimited projects", "Realtime analytics", "Priority queues"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-fg-secondary">
                  <Check className="size-4 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="primary" className="w-full">
                Estimate usage
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

const usagePricingCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kronus-ui/ui";
import { Check } from "lucide-react";

export function UsagePricingBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-surface-raised p-6 shadow-lg sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <Badge variant="primary">Usage based</Badge>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
              Start small, pay only when your product grows.
            </h2>
            <p className="mt-4 max-w-2xl text-fg-secondary">
              A pricing layout for APIs, infrastructure, and usage-metered products.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["10k events", "5 seats", "99.9% SLA"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border bg-surface-inset px-4 py-3 text-sm text-fg-secondary"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-primary bg-surface-floating shadow-glow">
            <CardHeader>
              <CardTitle>Growth</CardTitle>
              <CardDescription>Best for teams validating scale.</CardDescription>
              <div className="mt-2">
                <span className="font-display text-4xl font-semibold text-fg">$0.08</span>
                <span className="text-sm text-fg-tertiary"> / 1k events</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {["Unlimited projects", "Realtime analytics", "Priority queues"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-fg-secondary">
                  <Check className="size-4 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="primary" className="w-full">
                Estimate usage
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   3. FEATURE GRID
   ────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Optimized rendering and zero-runtime styling keep every interaction instant.",
  },
  {
    icon: Palette,
    title: "Themeable by design",
    description: "Swap a palette and every surface, border, and gradient updates live.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description: "SOC 2 compliant infrastructure with end-to-end encryption on every request.",
  },
  {
    icon: Layers,
    title: "Composable primitives",
    description: "Build complex layouts from small, predictable, accessible building blocks.",
  },
  {
    icon: BarChart3,
    title: "Insightful analytics",
    description: "Understand how people use your product with real-time usage dashboards.",
  },
  {
    icon: Workflow,
    title: "Automate anything",
    description: "Connect your favorite tools and wire up workflows without writing glue code.",
  },
] as const;

function FeatureGridBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Features</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          A thoughtfully crafted set of tools that scales from your first prototype to production.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-border">
            <CardHeader>
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <feature.icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

const featureGridCode = `import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kronus-ui/ui";
import {
  BarChart3,
  Layers,
  Lock,
  Palette,
  Workflow,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Optimized rendering and zero-runtime styling keep every interaction instant.",
  },
  {
    icon: Palette,
    title: "Themeable by design",
    description: "Swap a palette and every surface, border, and gradient updates live.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description: "SOC 2 compliant infrastructure with end-to-end encryption on every request.",
  },
  {
    icon: Layers,
    title: "Composable primitives",
    description: "Build complex layouts from small, predictable, accessible building blocks.",
  },
  {
    icon: BarChart3,
    title: "Insightful analytics",
    description: "Understand how people use your product with real-time usage dashboards.",
  },
  {
    icon: Workflow,
    title: "Automate anything",
    description: "Connect your favorite tools and wire up workflows without writing glue code.",
  },
] as const;

export function FeatureGridBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Features</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          A thoughtfully crafted set of tools that scales from your first prototype to production.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-border">
            <CardHeader>
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <feature.icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

function BentoFeatureBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Platform</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          A bento grid for product capabilities.
        </h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-6">
        {FEATURES.slice(0, 4).map((feature, index) => (
          <Card
            key={feature.title}
            className={[
              "border-border bg-surface-raised",
              index === 0 ? "md:col-span-4 md:row-span-2" : "md:col-span-2",
              index === 3 ? "md:col-span-3" : "",
            ].join(" ")}
          >
            <CardHeader>
              <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <feature.icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        <Card className="border-primary bg-gradient-primary text-primary-foreground shadow-glow md:col-span-3">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Production ready</CardTitle>
            <CardDescription className="text-primary-foreground/75">
              Compose, theme, and ship from one registry.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}

const bentoFeatureCode = `import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@kronus-ui/ui";
import { BarChart3, Layers, Lock, Palette, Workflow, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Optimized rendering and zero-runtime styling keep every interaction instant.",
  },
  {
    icon: Palette,
    title: "Themeable by design",
    description: "Swap a palette and every surface, border, and gradient updates live.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description: "SOC 2 compliant infrastructure with end-to-end encryption on every request.",
  },
  {
    icon: Layers,
    title: "Composable primitives",
    description: "Build complex layouts from small, predictable, accessible building blocks.",
  },
  {
    icon: BarChart3,
    title: "Insightful analytics",
    description: "Understand how people use your product with real-time usage dashboards.",
  },
  {
    icon: Workflow,
    title: "Automate anything",
    description: "Connect your favorite tools and wire up workflows without writing glue code.",
  },
] as const;

export function BentoFeatureBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Platform</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          A bento grid for product capabilities.
        </h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-6">
        {FEATURES.slice(0, 4).map((feature, index) => (
          <Card
            key={feature.title}
            className={[
              "border-border bg-surface-raised",
              index === 0 ? "md:col-span-4 md:row-span-2" : "md:col-span-2",
              index === 3 ? "md:col-span-3" : "",
            ].join(" ")}
          >
            <CardHeader>
              <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <feature.icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        <Card className="border-primary bg-gradient-primary text-primary-foreground shadow-glow md:col-span-3">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Production ready</CardTitle>
            <CardDescription className="text-primary-foreground/75">
              Compose, theme, and ship from one registry.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   4. CTA
   ────────────────────────────────────────────────────────────────── */

function CtaBlock() {
  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-primary px-8 py-16 text-center shadow-glow sm:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
            Ready to build something great?
          </h2>
          <p className="mt-4 text-balance text-lg text-primary-foreground/80">
            Join thousands of teams shipping faster. Drop your email and we&apos;ll send you a free
            starter kit.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex-1 text-left">
              <Label htmlFor="cta-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="cta-email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
                className="h-11 border-transparent bg-surface-base text-fg placeholder:text-fg-tertiary"
              />
            </div>
            <Button type="submit" variant="secondary" size="lg">
              Subscribe
              <Send aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-4 text-sm text-primary-foreground/70">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

const ctaCode = `"use client";

import { Button, Input, Label } from "@kronus-ui/ui";
import { Send } from "lucide-react";

export function CtaBlock() {
  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-primary px-8 py-16 text-center shadow-glow sm:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
            Ready to build something great?
          </h2>
          <p className="mt-4 text-balance text-lg text-primary-foreground/80">
            Join thousands of teams shipping faster. Drop your email and we'll send you a
            free starter kit.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex-1 text-left">
              <Label htmlFor="cta-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="cta-email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
                className="h-11 border-transparent bg-surface-base text-fg placeholder:text-fg-tertiary"
              />
            </div>
            <Button type="submit" variant="secondary" size="lg">
              Subscribe
              <Send aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-4 text-sm text-primary-foreground/70">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}`;

function CtaBannerBlock() {
  return (
    <section className="relative overflow-hidden bg-gradient-primary px-6 py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-24 -top-24 size-72 rounded-full bg-primary-foreground/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -end-20 size-80 rounded-full bg-primary-foreground/10 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-start">
        <div className="max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
            Ship your next launch on Kronus.
          </h2>
          <p className="mt-3 text-balance text-lg text-primary-foreground/80">
            Every block, theme, and primitive wired together — production-ready from day one.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button variant="secondary" size="lg">
            Start free trial
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Talk to sales
          </Button>
        </div>
      </div>
    </section>
  );
}

const ctaBannerCode = `import { Button } from "@kronus-ui/ui";
import { ArrowRight } from "lucide-react";

export function CtaBannerBlock() {
  return (
    <section className="relative overflow-hidden bg-gradient-primary px-6 py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-24 -top-24 size-72 rounded-full bg-primary-foreground/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -end-20 size-80 rounded-full bg-primary-foreground/10 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-start">
        <div className="max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
            Ship your next launch on Kronus.
          </h2>
          <p className="mt-3 text-balance text-lg text-primary-foreground/80">
            Every block, theme, and primitive wired together — production-ready from day one.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button variant="secondary" size="lg">
            Start free trial
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Talk to sales
          </Button>
        </div>
      </div>
    </section>
  );
}`;

function CtaSplitVisualBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-2xl border border-border bg-surface-raised p-8 shadow-lg sm:p-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Badge variant="primary">Get started</Badge>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Your product surface, themed and shipped this week.
          </h2>
          <p className="mt-4 max-w-md text-fg-secondary">
            Assemble the screens your customers see every day from blocks that already speak your
            brand.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {[
              "50+ production-ready blocks",
              "Dark and light themes included",
              "Accessible and RTL-safe by default",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-fg-secondary">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success/15">
                  <Check aria-hidden="true" className="size-3 text-success" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg">
              Start building
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="lg">
              Explore blocks
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-primary opacity-20 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-overlay shadow-lg">
            <div className="flex items-center gap-1.5 border-b border-border bg-surface-inset px-4 py-3">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-error/60" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-warning/60" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-success/60" />
              <span className="ms-3 text-xs text-fg-tertiary">app.kronus.com/overview</span>
            </div>
            <div className="flex flex-col gap-5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-fg-tertiary">Monthly recurring revenue</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-fg">$48,210</p>
                </div>
                <Badge variant="success">+18.2%</Badge>
              </div>
              <div aria-hidden="true" className="flex h-24 items-end gap-1.5">
                {[35, 55, 42, 70, 52, 80, 64, 92, 76, 100].map((height) => (
                  <div
                    key={height}
                    className="flex-1 rounded-t-sm bg-primary/70"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-surface-inset px-3.5 py-3">
                  <p className="text-xs text-fg-tertiary">Active customers</p>
                  <p className="mt-1 text-sm font-semibold text-fg">2,847</p>
                </div>
                <div className="rounded-xl border border-border bg-surface-inset px-3.5 py-3">
                  <p className="text-xs text-fg-tertiary">Net revenue churn</p>
                  <p className="mt-1 text-sm font-semibold text-fg">0.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ctaSplitVisualCode = `import { Badge, Button } from "@kronus-ui/ui";
import { ArrowRight, Check } from "lucide-react";

export function CtaSplitVisualBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-2xl border border-border bg-surface-raised p-8 shadow-lg sm:p-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Badge variant="primary">Get started</Badge>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Your product surface, themed and shipped this week.
          </h2>
          <p className="mt-4 max-w-md text-fg-secondary">
            Assemble the screens your customers see every day from blocks that already speak your
            brand.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {[
              "50+ production-ready blocks",
              "Dark and light themes included",
              "Accessible and RTL-safe by default",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-fg-secondary">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success/15">
                  <Check aria-hidden="true" className="size-3 text-success" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg">
              Start building
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="lg">
              Explore blocks
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-primary opacity-20 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-overlay shadow-lg">
            <div className="flex items-center gap-1.5 border-b border-border bg-surface-inset px-4 py-3">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-error/60" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-warning/60" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-success/60" />
              <span className="ms-3 text-xs text-fg-tertiary">app.kronus.com/overview</span>
            </div>
            <div className="flex flex-col gap-5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-fg-tertiary">Monthly recurring revenue</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-fg">$48,210</p>
                </div>
                <Badge variant="success">+18.2%</Badge>
              </div>
              <div aria-hidden="true" className="flex h-24 items-end gap-1.5">
                {[35, 55, 42, 70, 52, 80, 64, 92, 76, 100].map((height) => (
                  <div
                    key={height}
                    className="flex-1 rounded-t-sm bg-primary/70"
                    style={{ height: \`\${height}%\` }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-surface-inset px-3.5 py-3">
                  <p className="text-xs text-fg-tertiary">Active customers</p>
                  <p className="mt-1 text-sm font-semibold text-fg">2,847</p>
                </div>
                <div className="rounded-xl border border-border bg-surface-inset px-3.5 py-3">
                  <p className="text-xs text-fg-tertiary">Net revenue churn</p>
                  <p className="mt-1 text-sm font-semibold text-fg">0.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   5. TESTIMONIALS
   ────────────────────────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    quote:
      "Kronus let us replace a tangle of one-off components with one themeable system. Our redesign shipped weeks early.",
    name: "Amara Okafor",
    role: "VP Design, Northwind",
    initials: "AO",
    img: "https://i.pravatar.cc/96?img=5",
  },
  {
    quote:
      "Every surface inherits our brand the moment we change a token. It's the closest thing to magic our team has shipped.",
    name: "Marco Rossi",
    role: "Staff Engineer, Lumen",
    initials: "MR",
    img: "https://i.pravatar.cc/96?img=12",
  },
  {
    quote:
      "Accessibility used to be an afterthought. Now it's the default — we pass audits without a scramble before launch.",
    name: "Priya Nair",
    role: "Head of Product, Cobalt",
    initials: "PN",
    img: "https://i.pravatar.cc/96?img=32",
  },
  {
    quote:
      "We onboarded three new engineers in a day. The blocks read like documentation you can paste straight into the app.",
    name: "Jonas Berg",
    role: "Engineering Lead, Fathom",
    initials: "JB",
    img: "https://i.pravatar.cc/96?img=68",
  },
  {
    quote:
      "The marquee, the cards, the gradients — it all feels premium out of the box. Our marketing site looks bespoke.",
    name: "Sofia Lindqvist",
    role: "Founder, Driftwood",
    initials: "SL",
    img: "https://i.pravatar.cc/96?img=47",
  },
  {
    quote:
      "Kronus is the first design system our designers and engineers actually agree on. That alone paid for itself.",
    name: "David Chen",
    role: "CTO, Parallel",
    initials: "DC",
    img: "https://i.pravatar.cc/96?img=15",
  },
] as const;

const TESTIMONIAL_AVATARS = [
  { src: "https://i.pravatar.cc/96?img=5", alt: "Amara Okafor", fallback: "AO" },
  { src: "https://i.pravatar.cc/96?img=12", alt: "Marco Rossi", fallback: "MR" },
  { src: "https://i.pravatar.cc/96?img=32", alt: "Priya Nair", fallback: "PN" },
  { src: "https://i.pravatar.cc/96?img=68", alt: "Jonas Berg", fallback: "JB" },
  { src: "https://i.pravatar.cc/96?img=47", alt: "Sofia Lindqvist", fallback: "SL" },
];

function TestimonialsHeader() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <Badge variant="secondary" className="gap-1.5">
        <Sparkles aria-hidden="true" className="size-3.5" />
        Loved by teams
      </Badge>
      <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        Loved by modern product teams
      </h2>
      <p className="mt-4 text-balance text-fg-secondary">
        From seed-stage startups to public companies — teams ship faster when every surface is
        accessible, themeable, and consistent.
      </p>
      <div className="mt-7 flex items-center gap-3">
        <AvatarGroup avatars={TESTIMONIAL_AVATARS} aria-label="Teams using Kronus" />
        <p className="text-sm text-fg-tertiary">
          Join <span className="font-medium text-fg">4,000+</span> teams shipping with Kronus
        </p>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[number] }) {
  return (
    <Card className="w-80 shrink-0 border-border bg-surface-raised">
      <CardContent className="flex flex-col gap-5 pt-6">
        <p className="text-sm leading-6 text-fg-secondary">“{testimonial.quote}”</p>
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={testimonial.img} alt={testimonial.name} />
            <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
              {testimonial.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">{testimonial.name}</p>
            <p className="truncate text-xs text-fg-tertiary">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TestimonialsBlock() {
  return (
    <section className="px-6 py-20">
      <TestimonialsHeader />
      <div className="mt-14">
        <Marquee pauseOnHover gap="1.5rem">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

const testimonialsCode = `import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  Marquee,
} from "@kronus-ui/ui";
import { Sparkles } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Kronus let us replace a tangle of one-off components with one themeable system. Our redesign shipped weeks early.",
    name: "Amara Okafor",
    role: "VP Design, Northwind",
    initials: "AO",
    img: "https://i.pravatar.cc/96?img=5",
  },
  {
    quote:
      "Every surface inherits our brand the moment we change a token. It's the closest thing to magic our team has shipped.",
    name: "Marco Rossi",
    role: "Staff Engineer, Lumen",
    initials: "MR",
    img: "https://i.pravatar.cc/96?img=12",
  },
  {
    quote:
      "Accessibility used to be an afterthought. Now it's the default — we pass audits without a scramble before launch.",
    name: "Priya Nair",
    role: "Head of Product, Cobalt",
    initials: "PN",
    img: "https://i.pravatar.cc/96?img=32",
  },
  {
    quote:
      "We onboarded three new engineers in a day. The blocks read like documentation you can paste straight into the app.",
    name: "Jonas Berg",
    role: "Engineering Lead, Fathom",
    initials: "JB",
    img: "https://i.pravatar.cc/96?img=68",
  },
  {
    quote:
      "The marquee, the cards, the gradients — it all feels premium out of the box. Our marketing site looks bespoke.",
    name: "Sofia Lindqvist",
    role: "Founder, Driftwood",
    initials: "SL",
    img: "https://i.pravatar.cc/96?img=47",
  },
  {
    quote:
      "Kronus is the first design system our designers and engineers actually agree on. That alone paid for itself.",
    name: "David Chen",
    role: "CTO, Parallel",
    initials: "DC",
    img: "https://i.pravatar.cc/96?img=15",
  },
];

const TESTIMONIAL_AVATARS = [
  { src: "https://i.pravatar.cc/96?img=5", alt: "Amara Okafor", fallback: "AO" },
  { src: "https://i.pravatar.cc/96?img=12", alt: "Marco Rossi", fallback: "MR" },
  { src: "https://i.pravatar.cc/96?img=32", alt: "Priya Nair", fallback: "PN" },
  { src: "https://i.pravatar.cc/96?img=68", alt: "Jonas Berg", fallback: "JB" },
  { src: "https://i.pravatar.cc/96?img=47", alt: "Sofia Lindqvist", fallback: "SL" },
];

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[number] }) {
  return (
    <Card className="w-80 shrink-0 border-border bg-surface-raised">
      <CardContent className="flex flex-col gap-5 pt-6">
        <p className="text-sm leading-6 text-fg-secondary">“{testimonial.quote}”</p>
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={testimonial.img} alt={testimonial.name} />
            <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
              {testimonial.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">{testimonial.name}</p>
            <p className="truncate text-xs text-fg-tertiary">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialsBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Loved by teams
        </Badge>
        <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Loved by modern product teams
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          From seed-stage startups to public companies — teams ship faster when every surface is
          accessible, themeable, and consistent.
        </p>
        <div className="mt-7 flex items-center gap-3">
          <AvatarGroup avatars={TESTIMONIAL_AVATARS} aria-label="Teams using Kronus" />
          <p className="text-sm text-fg-tertiary">
            Join <span className="font-medium text-fg">4,000+</span> teams shipping with Kronus
          </p>
        </div>
      </div>
      <div className="mt-14">
        <Marquee pauseOnHover gap="1.5rem">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}`;

function TestimonialsGridBlock() {
  return (
    <section className="px-6 py-20">
      <TestimonialsHeader />
      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <Card key={testimonial.name} className="border-border">
            <CardContent className="flex h-full flex-col gap-5 pt-6">
              <p className="text-sm leading-6 text-fg-secondary">“{testimonial.quote}”</p>
              <div className="mt-auto flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage src={testimonial.img} alt={testimonial.name} />
                  <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{testimonial.name}</p>
                  <p className="truncate text-xs text-fg-tertiary">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

const testimonialsGridCode = `import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  Badge,
  Card,
  CardContent,
} from "@kronus-ui/ui";
import { Sparkles } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Kronus let us replace a tangle of one-off components with one themeable system. Our redesign shipped weeks early.",
    name: "Amara Okafor",
    role: "VP Design, Northwind",
    initials: "AO",
    img: "https://i.pravatar.cc/96?img=5",
  },
  {
    quote:
      "Every surface inherits our brand the moment we change a token. It's the closest thing to magic our team has shipped.",
    name: "Marco Rossi",
    role: "Staff Engineer, Lumen",
    initials: "MR",
    img: "https://i.pravatar.cc/96?img=12",
  },
  {
    quote:
      "Accessibility used to be an afterthought. Now it's the default — we pass audits without a scramble before launch.",
    name: "Priya Nair",
    role: "Head of Product, Cobalt",
    initials: "PN",
    img: "https://i.pravatar.cc/96?img=32",
  },
  {
    quote:
      "We onboarded three new engineers in a day. The blocks read like documentation you can paste straight into the app.",
    name: "Jonas Berg",
    role: "Engineering Lead, Fathom",
    initials: "JB",
    img: "https://i.pravatar.cc/96?img=68",
  },
  {
    quote:
      "The marquee, the cards, the gradients — it all feels premium out of the box. Our marketing site looks bespoke.",
    name: "Sofia Lindqvist",
    role: "Founder, Driftwood",
    initials: "SL",
    img: "https://i.pravatar.cc/96?img=47",
  },
  {
    quote:
      "Kronus is the first design system our designers and engineers actually agree on. That alone paid for itself.",
    name: "David Chen",
    role: "CTO, Parallel",
    initials: "DC",
    img: "https://i.pravatar.cc/96?img=15",
  },
];

const TESTIMONIAL_AVATARS = [
  { src: "https://i.pravatar.cc/96?img=5", alt: "Amara Okafor", fallback: "AO" },
  { src: "https://i.pravatar.cc/96?img=12", alt: "Marco Rossi", fallback: "MR" },
  { src: "https://i.pravatar.cc/96?img=32", alt: "Priya Nair", fallback: "PN" },
  { src: "https://i.pravatar.cc/96?img=68", alt: "Jonas Berg", fallback: "JB" },
  { src: "https://i.pravatar.cc/96?img=47", alt: "Sofia Lindqvist", fallback: "SL" },
];

export function TestimonialsGridBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Loved by teams
        </Badge>
        <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Loved by modern product teams
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          From seed-stage startups to public companies — teams ship faster when every surface is
          accessible, themeable, and consistent.
        </p>
        <div className="mt-7 flex items-center gap-3">
          <AvatarGroup avatars={TESTIMONIAL_AVATARS} aria-label="Teams using Kronus" />
          <p className="text-sm text-fg-tertiary">
            Join <span className="font-medium text-fg">4,000+</span> teams shipping with Kronus
          </p>
        </div>
      </div>
      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <Card key={testimonial.name} className="border-border">
            <CardContent className="flex h-full flex-col gap-5 pt-6">
              <p className="text-sm leading-6 text-fg-secondary">“{testimonial.quote}”</p>
              <div className="mt-auto flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage src={testimonial.img} alt={testimonial.name} />
                  <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{testimonial.name}</p>
                  <p className="truncate text-xs text-fg-tertiary">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   6. FAQ
   ────────────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    question: "What exactly do I get with Kronus?",
    answer:
      "A themeable component library plus a registry of copy-paste product sections. Add what you need with the CLI and everything inherits your tokens, radius, and color scale automatically.",
  },
  {
    question: "Do the components work with my existing stack?",
    answer:
      "Yes. Components are framework-agnostic React built on accessible primitives and Tailwind, so they drop into Next.js, Remix, Vite, or any modern React setup.",
  },
  {
    question: "How do themes work?",
    answer:
      "Themes are driven entirely by CSS tokens. Swap a palette and every surface, border, and gradient updates live — no per-component overrides and no rebuild required.",
  },
  {
    question: "Is everything accessible out of the box?",
    answer:
      "Accessibility is the default, not an add-on. Focus management, keyboard interaction, and ARIA semantics are built in and verified, so you pass audits without a last-minute scramble.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Plans are month-to-month with no lock-in, and anything you've already added to your codebase is yours to keep.",
  },
] as const;

function FaqBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">FAQ</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          Everything you need to know about the product and billing. Can&apos;t find an answer?
          Reach out to our team.
        </p>
      </div>

      <Accordion type="single" collapsible className="mx-auto mt-12 max-w-2xl">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

const faqCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
} from "@kronus-ui/ui";

const FAQ_ITEMS = [
  {
    question: "What exactly do I get with Kronus?",
    answer:
      "A themeable component library plus a registry of copy-paste product sections. Add what you need with the CLI and everything inherits your tokens, radius, and color scale automatically.",
  },
  {
    question: "Do the components work with my existing stack?",
    answer:
      "Yes. Components are framework-agnostic React built on accessible primitives and Tailwind, so they drop into Next.js, Remix, Vite, or any modern React setup.",
  },
  {
    question: "How do themes work?",
    answer:
      "Themes are driven entirely by CSS tokens. Swap a palette and every surface, border, and gradient updates live — no per-component overrides and no rebuild required.",
  },
  {
    question: "Is everything accessible out of the box?",
    answer:
      "Accessibility is the default, not an add-on. Focus management, keyboard interaction, and ARIA semantics are built in and verified, so you pass audits without a last-minute scramble.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Plans are month-to-month with no lock-in, and anything you've already added to your codebase is yours to keep.",
  },
];

export function FaqBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">FAQ</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          Everything you need to know about the product and billing. Can't find an answer?
          Reach out to our team.
        </p>
      </div>

      <Accordion type="single" collapsible className="mx-auto mt-12 max-w-2xl">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}`;

function FaqSplitBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div>
          <Badge variant="secondary">FAQ</Badge>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
            Frequently asked questions
          </h2>
          <p className="mt-4 max-w-md text-fg-secondary">
            Answers to the questions we hear most. We keep this short so you can get back to
            building.
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-surface-inset p-5">
            <p className="text-sm font-medium text-fg">Still have questions?</p>
            <p className="mt-1 text-sm text-fg-secondary">
              Our team usually replies within a few hours.
            </p>
            <Button variant="outline" className="mt-4">
              Contact support
            </Button>
          </div>
        </div>

        <Accordion type="single" collapsible>
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

const faqSplitCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
} from "@kronus-ui/ui";

const FAQ_ITEMS = [
  {
    question: "What exactly do I get with Kronus?",
    answer:
      "A themeable component library plus a registry of copy-paste product sections. Add what you need with the CLI and everything inherits your tokens, radius, and color scale automatically.",
  },
  {
    question: "Do the components work with my existing stack?",
    answer:
      "Yes. Components are framework-agnostic React built on accessible primitives and Tailwind, so they drop into Next.js, Remix, Vite, or any modern React setup.",
  },
  {
    question: "How do themes work?",
    answer:
      "Themes are driven entirely by CSS tokens. Swap a palette and every surface, border, and gradient updates live — no per-component overrides and no rebuild required.",
  },
  {
    question: "Is everything accessible out of the box?",
    answer:
      "Accessibility is the default, not an add-on. Focus management, keyboard interaction, and ARIA semantics are built in and verified, so you pass audits without a last-minute scramble.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Plans are month-to-month with no lock-in, and anything you've already added to your codebase is yours to keep.",
  },
];

export function FaqSplitBlock() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div>
          <Badge variant="secondary">FAQ</Badge>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
            Frequently asked questions
          </h2>
          <p className="mt-4 max-w-md text-fg-secondary">
            Answers to the questions we hear most. We keep this short so you can get back to
            building.
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-surface-inset p-5">
            <p className="text-sm font-medium text-fg">Still have questions?</p>
            <p className="mt-1 text-sm text-fg-secondary">
              Our team usually replies within a few hours.
            </p>
            <Button variant="outline" className="mt-4">
              Contact support
            </Button>
          </div>
        </div>

        <Accordion type="single" collapsible>
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   7. FOOTER
   ────────────────────────────────────────────────────────────────── */

/* @kronus:data footer-links */
const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Blocks", href: "#blocks" },
      { label: "Changelog", href: "#changelog" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Customers", href: "#customers" },
      { label: "Brand", href: "#brand" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "Guides", href: "#guides" },
      { label: "API reference", href: "#api" },
      { label: "Community", href: "#community" },
      { label: "Support", href: "#support" },
    ],
  },
] as const;
/* @kronus:data-end */

function FooterBlock() {
  return (
    <footer className="border-t border-border bg-surface-base px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Hexagon aria-hidden="true" className="size-5" />
              </span>
              <span className="font-display text-lg font-semibold text-fg">Kronus</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-fg-secondary">
              The themeable component library and block registry for teams who ship polished
              products fast.
            </p>
            <div className="mt-5 flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="GitHub">
                <Github aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Twitter">
                <Twitter aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="LinkedIn">
                <Linkedin aria-hidden="true" />
              </Button>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-medium text-fg">{column.heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-fg-secondary transition-colors hover:text-fg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-surface-raised p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <p className="font-display text-lg font-semibold text-fg">Stay in the loop</p>
            <p className="mt-1 text-sm text-fg-secondary">
              Product updates and new blocks, a few times a month.
            </p>
          </div>
          <form
            className="mt-4 flex max-w-sm flex-col gap-3 sm:mt-0 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex-1">
              <Label htmlFor="footer-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="footer-email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <Button type="submit" variant="primary">
              Subscribe
              <Send aria-hidden="true" />
            </Button>
          </form>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-fg-tertiary">© 2026 Kronus. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              className="text-sm text-fg-secondary transition-colors hover:text-fg"
            >
              Privacy
            </a>
            <a href="#terms" className="text-sm text-fg-secondary transition-colors hover:text-fg">
              Terms
            </a>
            <a href="#status" className="text-sm text-fg-secondary transition-colors hover:text-fg">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerCode = `"use client";

import { Button, Input, Label, Separator } from "@kronus-ui/ui";
import { Github, Hexagon, Linkedin, Send, Twitter } from "lucide-react";

/* @kronus:data footer-links */
const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Blocks", href: "#blocks" },
      { label: "Changelog", href: "#changelog" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Customers", href: "#customers" },
      { label: "Brand", href: "#brand" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "Guides", href: "#guides" },
      { label: "API reference", href: "#api" },
      { label: "Community", href: "#community" },
      { label: "Support", href: "#support" },
    ],
  },
];
/* @kronus:data-end */

export function FooterBlock() {
  return (
    <footer className="border-t border-border bg-surface-base px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Hexagon aria-hidden="true" className="size-5" />
              </span>
              <span className="font-display text-lg font-semibold text-fg">Kronus</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-fg-secondary">
              The themeable component library and block registry for teams who ship polished
              products fast.
            </p>
            <div className="mt-5 flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="GitHub">
                <Github aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Twitter">
                <Twitter aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="LinkedIn">
                <Linkedin aria-hidden="true" />
              </Button>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-medium text-fg">{column.heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-fg-secondary transition-colors hover:text-fg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-surface-raised p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <p className="font-display text-lg font-semibold text-fg">Stay in the loop</p>
            <p className="mt-1 text-sm text-fg-secondary">
              Product updates and new blocks, a few times a month.
            </p>
          </div>
          <form
            className="mt-4 flex max-w-sm flex-col gap-3 sm:mt-0 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex-1">
              <Label htmlFor="footer-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="footer-email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <Button type="submit" variant="primary">
              Subscribe
              <Send aria-hidden="true" />
            </Button>
          </form>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-fg-tertiary">© 2026 Kronus. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              className="text-sm text-fg-secondary transition-colors hover:text-fg"
            >
              Privacy
            </a>
            <a href="#terms" className="text-sm text-fg-secondary transition-colors hover:text-fg">
              Terms
            </a>
            <a href="#status" className="text-sm text-fg-secondary transition-colors hover:text-fg">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}`;

const FOOTER_MEGA_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Blocks", href: "#blocks" },
      { label: "Themes", href: "#themes" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "API reference", href: "#api" },
      { label: "CLI", href: "#cli" },
      { label: "Open source", href: "#open-source" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Customers", href: "#customers" },
      { label: "Press kit", href: "#press" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Guides", href: "#guides" },
      { label: "Templates", href: "#templates" },
      { label: "Community", href: "#community" },
      { label: "Support", href: "#support" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Security", href: "#security" },
      { label: "DPA", href: "#dpa" },
    ],
  },
] as const;

function FooterMegaBlock() {
  return (
    <footer className="border-t border-border bg-surface-base px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Hexagon aria-hidden="true" className="size-5" />
              </span>
              <span className="font-display text-lg font-semibold text-fg">Kronus</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-fg-secondary">
              Product updates, new blocks, and launch guides — a few times a month.
            </p>
          </div>
          <form
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex-1">
              <Label htmlFor="footer-mega-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="footer-mega-email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <Button type="submit" variant="primary">
              Subscribe
              <Send aria-hidden="true" />
            </Button>
          </form>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {FOOTER_MEGA_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-medium text-fg">{column.heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-fg-secondary transition-colors hover:text-fg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col-reverse items-center justify-between gap-6 lg:flex-row">
          <p className="text-sm text-fg-tertiary">© 2026 Kronus Labs, Inc. All rights reserved.</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <a
              href="#status"
              className="inline-flex items-center gap-2 text-sm font-medium text-success-strong transition-colors hover:text-fg"
            >
              <span aria-hidden="true" className="size-2 rounded-full bg-success" />
              All systems operational
            </a>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="GitHub">
                <Github aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Twitter">
                <Twitter aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="LinkedIn">
                <Linkedin aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerMegaCode = `"use client";

import { Button, Input, Label, Separator } from "@kronus-ui/ui";
import { Github, Hexagon, Linkedin, Send, Twitter } from "lucide-react";

const FOOTER_MEGA_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Blocks", href: "#blocks" },
      { label: "Themes", href: "#themes" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "API reference", href: "#api" },
      { label: "CLI", href: "#cli" },
      { label: "Open source", href: "#open-source" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Customers", href: "#customers" },
      { label: "Press kit", href: "#press" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Guides", href: "#guides" },
      { label: "Templates", href: "#templates" },
      { label: "Community", href: "#community" },
      { label: "Support", href: "#support" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Security", href: "#security" },
      { label: "DPA", href: "#dpa" },
    ],
  },
];

export function FooterMegaBlock() {
  return (
    <footer className="border-t border-border bg-surface-base px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Hexagon aria-hidden="true" className="size-5" />
              </span>
              <span className="font-display text-lg font-semibold text-fg">Kronus</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-fg-secondary">
              Product updates, new blocks, and launch guides — a few times a month.
            </p>
          </div>
          <form
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex-1">
              <Label htmlFor="footer-mega-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="footer-mega-email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <Button type="submit" variant="primary">
              Subscribe
              <Send aria-hidden="true" />
            </Button>
          </form>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {FOOTER_MEGA_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-medium text-fg">{column.heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-fg-secondary transition-colors hover:text-fg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col-reverse items-center justify-between gap-6 lg:flex-row">
          <p className="text-sm text-fg-tertiary">© 2026 Kronus Labs, Inc. All rights reserved.</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <a
              href="#status"
              className="inline-flex items-center gap-2 text-sm font-medium text-success-strong transition-colors hover:text-fg"
            >
              <span aria-hidden="true" className="size-2 rounded-full bg-success" />
              All systems operational
            </a>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="GitHub">
                <Github aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Twitter">
                <Twitter aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="LinkedIn">
                <Linkedin aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}`;

const FOOTER_MINIMAL_LINKS = [
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Support", href: "#support" },
] as const;

function FooterMinimalBlock() {
  return (
    <footer className="border-t border-border bg-surface-base px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Hexagon aria-hidden="true" className="size-4" />
          </span>
          <span className="font-display text-base font-semibold text-fg">Kronus</span>
        </div>

        <div className="flex items-center gap-6">
          {FOOTER_MINIMAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-fg-secondary transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-sm text-fg-tertiary">© 2026 Kronus. All rights reserved.</p>
      </div>
    </footer>
  );
}

const footerMinimalCode = `import { Hexagon } from "lucide-react";

const FOOTER_MINIMAL_LINKS = [
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Support", href: "#support" },
];

export function FooterMinimalBlock() {
  return (
    <footer className="border-t border-border bg-surface-base px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Hexagon aria-hidden="true" className="size-4" />
          </span>
          <span className="font-display text-base font-semibold text-fg">Kronus</span>
        </div>

        <div className="flex items-center gap-6">
          {FOOTER_MINIMAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-fg-secondary transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-sm text-fg-tertiary">© 2026 Kronus. All rights reserved.</p>
      </div>
    </footer>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   8. NAVBAR
   ────────────────────────────────────────────────────────────────── */

/* @kronus:data navbar-links */
const NAVBAR_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
] as const;
/* @kronus:data-end */

function NavbarBlock() {
  return (
    <section className="px-6 py-8">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-border bg-surface-raised/80 px-4 py-2 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Hexagon aria-hidden="true" className="size-4" />
          </span>
          <span className="font-display text-base font-semibold text-fg">Kronus</span>
          <Badge variant="secondary" className="ml-0.5">
            Beta
          </Badge>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {NAVBAR_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-fg-secondary transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button variant="primary" size="sm">
            Get started
          </Button>
          <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </nav>
    </section>
  );
}

const navbarCode = `import { Badge, Button } from "@kronus-ui/ui";
import { Hexagon, Menu } from "lucide-react";

/* @kronus:data navbar-links */
const NAVBAR_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
];
/* @kronus:data-end */

export function NavbarBlock() {
  return (
    <section className="px-6 py-8">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-border bg-surface-raised/80 px-4 py-2 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Hexagon aria-hidden="true" className="size-4" />
          </span>
          <span className="font-display text-base font-semibold text-fg">Kronus</span>
          <Badge variant="secondary" className="ml-0.5">
            Beta
          </Badge>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {NAVBAR_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-fg-secondary transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button variant="primary" size="sm">
            Get started
          </Button>
          <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </nav>
    </section>
  );
}`;

function NavbarCenteredBlock() {
  return (
    <section className="px-6 py-8">
      <nav className="mx-auto grid max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full border border-border bg-surface-overlay/70 px-5 py-2.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Hexagon aria-hidden="true" className="size-4" />
          </span>
          <span className="font-display text-base font-semibold text-fg">Kronus</span>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {NAVBAR_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-fg-secondary transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <Button variant="primary" size="sm" className="hidden sm:inline-flex">
            Get started
          </Button>
          <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </nav>
    </section>
  );
}

const navbarCenteredCode = `import { Button } from "@kronus-ui/ui";
import { Hexagon, Menu } from "lucide-react";

const NAVBAR_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
];

export function NavbarCenteredBlock() {
  return (
    <section className="px-6 py-8">
      <nav className="mx-auto grid max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full border border-border bg-surface-overlay/70 px-5 py-2.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Hexagon aria-hidden="true" className="size-4" />
          </span>
          <span className="font-display text-base font-semibold text-fg">Kronus</span>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {NAVBAR_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-fg-secondary transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <Button variant="primary" size="sm" className="hidden sm:inline-flex">
            Get started
          </Button>
          <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </nav>
    </section>
  );
}`;

function NavbarAnnouncementBlock() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-xs">
        <div className="flex items-center justify-center gap-3 border-b border-border bg-surface-inset px-4 py-2">
          <Badge variant="primary" className="hidden gap-1.5 sm:inline-flex">
            <Sparkles aria-hidden="true" className="size-3.5" />
            New
          </Badge>
          <p className="truncate text-sm text-fg-secondary">
            Kronus 2.0 is live — 40 new blocks and a refreshed theme engine.
          </p>
          <a
            href="#changelog"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary-strong transition-colors hover:text-fg"
          >
            Read more
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>

        <nav className="flex items-center justify-between gap-4 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Hexagon aria-hidden="true" className="size-4" />
            </span>
            <span className="font-display text-base font-semibold text-fg">Kronus</span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {NAVBAR_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-fg-secondary transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign in
            </Button>
            <Button variant="primary" size="sm">
              Get started
            </Button>
            <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </nav>
      </div>
    </section>
  );
}

const navbarAnnouncementCode = `import { Badge, Button } from "@kronus-ui/ui";
import { ArrowRight, Hexagon, Menu, Sparkles } from "lucide-react";

const NAVBAR_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
];

export function NavbarAnnouncementBlock() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-xs">
        <div className="flex items-center justify-center gap-3 border-b border-border bg-surface-inset px-4 py-2">
          <Badge variant="primary" className="hidden gap-1.5 sm:inline-flex">
            <Sparkles aria-hidden="true" className="size-3.5" />
            New
          </Badge>
          <p className="truncate text-sm text-fg-secondary">
            Kronus 2.0 is live — 40 new blocks and a refreshed theme engine.
          </p>
          <a
            href="#changelog"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary-strong transition-colors hover:text-fg"
          >
            Read more
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>

        <nav className="flex items-center justify-between gap-4 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Hexagon aria-hidden="true" className="size-4" />
            </span>
            <span className="font-display text-base font-semibold text-fg">Kronus</span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {NAVBAR_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-fg-secondary transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign in
            </Button>
            <Button variant="primary" size="sm">
              Get started
            </Button>
            <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </nav>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────
   Export map
   ────────────────────────────────────────────────────────────────── */

export const marketingBlocks: BlockContentMap = {
  hero: {
    preview: <HeroBlock />,
    code: heroCode,
    variants: [
      {
        id: "centered",
        name: "Centered launch",
        description: "Classic centered SaaS hero with trust proof and two CTAs.",
        appearance: "dark",
        preview: <HeroBlock />,
        code: heroCode,
      },
      {
        id: "split",
        name: "Split dashboard",
        description: "Two-column hero with a compact product-quality panel.",
        appearance: "dark",
        preview: <SplitHeroBlock />,
        code: splitHeroCode,
      },
      {
        id: "compact",
        name: "Compact registry",
        description: "Contained hero card for docs, registries and template libraries.",
        appearance: "light",
        preview: <CompactHeroBlock />,
        code: compactHeroCode,
      },
      {
        id: "atmosphere",
        name: "Atmosphere",
        description:
          "Centered launch hero over a receding grid floor, shooting stars, and a typing headline.",
        appearance: "dark",
        preview: <AtmosphereHeroBlock />,
        code: atmosphereHeroCode,
      },
    ],
  },
  pricing: {
    preview: <PricingBlock />,
    code: pricingCode,
    variants: [
      {
        id: "tiers",
        name: "Three tiers",
        description: "A responsive three-plan grid with a highlighted popular tier.",
        appearance: "dark",
        preview: <PricingBlock />,
        code: pricingCode,
      },
      {
        id: "toggle",
        name: "Plan toggle",
        description: "Two-plan pricing with a monthly/annual segmented control.",
        appearance: "light",
        preview: <PricingToggleBlock />,
        code: pricingToggleCode,
      },
      {
        id: "usage",
        name: "Usage based",
        description: "A metered pricing layout for API, infra and event-based products.",
        appearance: "dark",
        preview: <UsagePricingBlock />,
        code: usagePricingCode,
      },
    ],
  },
  "feature-grid": {
    preview: <FeatureGridBlock />,
    code: featureGridCode,
    variants: [
      {
        id: "cards",
        name: "Card grid",
        description: "Six balanced feature cards for broad capability overviews.",
        appearance: "dark",
        preview: <FeatureGridBlock />,
        code: featureGridCode,
      },
      {
        id: "bento",
        name: "Bento grid",
        description: "Editorial bento layout for showcasing a platform narrative.",
        appearance: "light",
        preview: <BentoFeatureBlock />,
        code: bentoFeatureCode,
      },
    ],
  },
  cta: {
    preview: <CtaBlock />,
    code: ctaCode,
    variants: [
      {
        id: "classic",
        name: "Gradient panel",
        description: "Contained gradient panel with an email-capture form and dotted texture.",
        appearance: "dark",
        preview: <CtaBlock />,
        code: ctaCode,
      },
      {
        id: "banner",
        name: "Gradient banner",
        description: "Full-width gradient band with a display headline and dual CTAs.",
        appearance: "dark",
        preview: <CtaBannerBlock />,
        code: ctaBannerCode,
      },
      {
        id: "split-visual",
        name: "Split with visual",
        description: "Copy and checkmark bullets beside a token-built product mock panel.",
        appearance: "light",
        preview: <CtaSplitVisualBlock />,
        code: ctaSplitVisualCode,
      },
    ],
  },
  testimonials: {
    preview: <TestimonialsBlock />,
    code: testimonialsCode,
    variants: [
      {
        id: "marquee",
        name: "Marquee wall",
        description: "A scrolling, pause-on-hover wall of testimonials with avatar social proof.",
        appearance: "dark",
        preview: <TestimonialsBlock />,
        code: testimonialsCode,
      },
      {
        id: "grid",
        name: "Card grid",
        description: "A static responsive grid of testimonial cards for dense social proof.",
        appearance: "light",
        preview: <TestimonialsGridBlock />,
        code: testimonialsGridCode,
      },
    ],
  },
  faq: {
    preview: <FaqBlock />,
    code: faqCode,
    variants: [
      {
        id: "accordion",
        name: "Centered accordion",
        description: "A centered, width-constrained accordion of common questions and answers.",
        appearance: "dark",
        preview: <FaqBlock />,
        code: faqCode,
      },
      {
        id: "split",
        name: "Split with support",
        description: "A two-column layout pairing the questions with a contact-support panel.",
        appearance: "light",
        preview: <FaqSplitBlock />,
        code: faqSplitCode,
      },
    ],
  },
  footer: {
    preview: <FooterBlock />,
    code: footerCode,
    variants: [
      {
        id: "classic",
        name: "Columns with newsletter",
        description: "Brand column, three link columns and a newsletter panel.",
        appearance: "dark",
        preview: <FooterBlock />,
        code: footerCode,
      },
      {
        id: "mega",
        name: "Mega",
        description: "Five link columns, newsletter, social icons and a live-status legal row.",
        appearance: "dark",
        preview: <FooterMegaBlock />,
        code: footerMegaCode,
      },
      {
        id: "minimal",
        name: "Minimal",
        description: "A single-row footer with logo, three links and copyright.",
        appearance: "light",
        preview: <FooterMinimalBlock />,
        code: footerMinimalCode,
      },
    ],
  },
  navbar: {
    preview: <NavbarBlock />,
    code: navbarCode,
    variants: [
      {
        id: "classic",
        name: "Pill with actions",
        description: "Rounded navbar with brand badge, primary links and sign-in actions.",
        appearance: "dark",
        preview: <NavbarBlock />,
        code: navbarCode,
      },
      {
        id: "centered",
        name: "Centered pill",
        description: "Floating pill navbar with centered links on a blurred overlay surface.",
        appearance: "light",
        preview: <NavbarCenteredBlock />,
        code: navbarCenteredCode,
      },
      {
        id: "with-announcement",
        name: "With announcement",
        description: "Announcement bar with a badge and link above the navigation row.",
        appearance: "dark",
        preview: <NavbarAnnouncementBlock />,
        code: navbarAnnouncementCode,
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function MarketingGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(marketingBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function MarketingView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(marketingBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
