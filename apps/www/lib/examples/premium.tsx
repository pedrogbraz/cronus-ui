"use client";

import {
  AnimatedList,
  AnimatedNumber,
  AuroraBackground,
  BorderBeam,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardStack,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ClickSpark,
  Confetti,
  Dock,
  DotPattern,
  DynamicIsland,
  ExpandableTabs,
  FlickeringGrid,
  FlipCard,
  FlipCardBack,
  FlipCardFront,
  Frame,
  GlareHover,
  GlassCard,
  GradientBorder,
  GradientText,
  GridPattern,
  Highlighter,
  LightRays,
  LogoCarousel,
  Magnetic,
  Marquee,
  Meteors,
  MorphingPopover,
  MorphingPopoverBody,
  MorphingPopoverButton,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverFooter,
  MorphingPopoverTrigger,
  Noise,
  Orbit,
  OrbitItem,
  OrbitRing,
  Particles,
  PillNav,
  ProgressiveBlur,
  RetroGrid,
  Reveal,
  Ripple,
  ScrambleText,
  ScrollProgress,
  SegmentedControl,
  SegmentedControlItem,
  Shimmer,
  ShinyText,
  SparklesText,
  SpinningText,
  SpotlightCard,
  StarBorder,
  Terminal,
  TextEffect,
  TiltCard,
  TypingText,
  WordRotate,
} from "@kronus-ui/ui";
import {
  ArrowRight,
  Bell,
  Check,
  Copy,
  Gauge,
  Github,
  Home,
  Linkedin,
  MessageSquarePlus,
  Pencil,
  Plus,
  RotateCw,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  User,
  Wifi,
  Zap,
} from "lucide-react";
import { useId, useRef, useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

/* -------------------------------------------------------------------------- */
/*  Stateful demos                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Scroll progress scoped to a bounded box so it tracks the inner scroll
 * container — never the whole docs page. The bar pins to the top of the box and
 * the ring mirrors the same `target` ref.
 */
function ScrollProgressDemo() {
  const ref = useRef<HTMLElement>(null);
  return (
    <div className="flex w-full max-w-md items-start gap-4">
      {/* A <section> with an aria-label is a named, scrollable region; it must be
          keyboard-focusable (axe scrollable-region-focusable). */}
      <section
        ref={ref}
        aria-label="Release notes, scrollable"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-focusable (WCAG / axe scrollable-region-focusable)
        tabIndex={0}
        className="relative h-64 flex-1 overflow-y-auto rounded-lg border border-border bg-surface-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ScrollProgress target={ref} className="sticky top-0 z-10" />
        <div className="space-y-4 p-4">
          <h4 className="text-sm font-semibold text-fg">Release notes</h4>
          {Array.from({ length: 12 }).map((_, paragraph) => (
            <p
              // biome-ignore lint/suspicious/noArrayIndexKey: static, never-reordered filler text
              key={paragraph}
              className="text-sm text-fg-secondary"
            >
              Scroll this panel to advance the bar above and the ring beside it. Both read from the
              same container ref, so they stay perfectly in sync without tracking the page itself.
            </p>
          ))}
        </div>
      </section>
      <ScrollProgress variant="circle" target={ref} size={48} />
    </div>
  );
}

/**
 * Feedback popover: the trigger morphs into a small dialog with an accessible
 * textarea (labelled via a visually-bound `<label>`) and a footer that pairs a
 * Close with a submit. Submit is local-only — it flips to a thank-you state and
 * auto-closes, demonstrating controlled open state without leaving the demo
 * frame.
 */
function MorphingPopoverFeedbackDemo() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const fieldId = useId();

  return (
    <MorphingPopover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setSent(false);
      }}
      reducedMotion="never"
      className="flex min-h-[15rem] w-full items-start justify-center pt-8"
    >
      <MorphingPopoverTrigger>
        <MessageSquarePlus aria-hidden="true" className="size-4" />
        Feedback
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Send feedback" className="w-[22rem]">
        {sent ? (
          <MorphingPopoverBody className="items-center gap-1 py-10 text-center">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <p className="text-sm font-medium text-fg">Thanks for the note!</p>
            <p className="text-xs text-fg-tertiary">We read every message.</p>
          </MorphingPopoverBody>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setNote("");
              window.setTimeout(() => setOpen(false), 1200);
            }}
          >
            <label htmlFor={fieldId} className="sr-only">
              Your feedback
            </label>
            <textarea
              id={fieldId}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="Add feedback"
              className="block w-full resize-none bg-transparent px-4 pt-4 text-sm text-fg outline-none placeholder:text-fg-tertiary"
            />
            <MorphingPopoverFooter className="justify-between border-t-0 px-3 pb-3 pt-1">
              <MorphingPopoverClose />
              <Button type="submit" size="sm" variant="outline" disabled={note.trim().length === 0}>
                Submit
              </Button>
            </MorphingPopoverFooter>
          </form>
        )}
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

/**
 * Quick-actions menu: the trigger morphs into a compact menu of
 * {@link MorphingPopoverButton} rows with leading lucide icons. Each row closes
 * the surface on activation via the local `setOpen`.
 */
function MorphingPopoverQuickActionsDemo() {
  const [open, setOpen] = useState(false);
  const actions = [
    { id: "edit", label: "Edit", icon: Pencil },
    { id: "duplicate", label: "Duplicate", icon: Copy },
    { id: "share", label: "Share", icon: Share2 },
  ];

  return (
    <MorphingPopover
      open={open}
      onOpenChange={setOpen}
      reducedMotion="never"
      className="flex min-h-[15rem] w-full items-start justify-center pt-8"
    >
      <MorphingPopoverTrigger>
        Actions
        <ArrowRight aria-hidden="true" className="size-4" />
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Quick actions" className="w-56">
        <MorphingPopoverBody className="gap-0.5 p-1.5">
          {actions.map(({ id, label, icon: Icon }) => (
            <MorphingPopoverButton key={id} onClick={() => setOpen(false)}>
              <Icon aria-hidden="true" />
              {label}
            </MorphingPopoverButton>
          ))}
          <div className="my-1 h-px bg-border" />
          <MorphingPopoverButton
            onClick={() => setOpen(false)}
            className="text-fg-secondary hover:text-fg"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </MorphingPopoverButton>
        </MorphingPopoverBody>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

const heroLogos = [
  {
    id: "next",
    label: "Next.js",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 180 180"
        className="block size-16 shrink-0 sm:size-20"
        fill="none"
      >
        <circle cx="90" cy="90" r="87" fill="#050505" stroke="white" strokeWidth="6" />
        <path
          d="M149.5 157.5 69.1 54H54v72h12.1V69.4l73.9 95.4c3.3-2.2 6.5-4.7 9.5-7.3Z"
          fill="white"
        />
        <rect x="115" y="54" width="12" height="72" fill="white" />
      </svg>
    ),
  },
  {
    id: "bmw",
    label: "BMW",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 80 80"
        className="block size-16 shrink-0 sm:size-20"
        fill="none"
      >
        <circle cx="40" cy="40" r="38" fill="white" />
        <circle cx="40" cy="40" r="33" fill="#111111" />
        <circle cx="40" cy="40" r="22" fill="white" />
        <path d="M40 18a22 22 0 0 1 22 22H40V18Z" fill="#009ADA" />
        <path d="M18 40a22 22 0 0 1 22-22v22H18Z" fill="white" />
        <path d="M40 40h22a22 22 0 0 1-22 22V40Z" fill="white" />
        <path d="M18 40h22v22a22 22 0 0 1-22-22Z" fill="#009ADA" />
        <circle cx="40" cy="40" r="22" stroke="#111111" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "typescript",
    label: "TypeScript",
    node: (
      <span className="grid size-16 place-items-center rounded-md bg-[#3178c6] text-3xl font-black text-white sm:size-20 sm:text-4xl">
        TS
      </span>
    ),
  },
  {
    id: "stripe",
    label: "Stripe",
    node: (
      <span className="text-4xl font-black tracking-tight text-[#635bff] sm:text-5xl">stripe</span>
    ),
  },
  {
    id: "spiral",
    label: "Spiral",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 96 96"
        className="block size-20 shrink-0 sm:size-24"
        fill="none"
      >
        <path
          d="M72.5 20.5C59.5 10.6 39.5 12.8 28 25.8 16.2 39.2 18.6 59.5 32.7 69.3c9.3 6.5 23 6.3 31.5-1.4 8.7-7.9 9.2-20.7 1.3-28.6-7.3-7.2-19.2-7.2-26.5 0"
          stroke="#96f3cc"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.5 75.5C36.5 85.4 56.5 83.2 68 70.2 79.8 56.8 77.4 36.5 63.3 26.7c-9.3-6.5-23-6.3-31.5 1.4-8.7 7.9-9.2 20.7-1.3 28.6 7.3 7.2 19.2 7.2 26.5 0"
          stroke="#00d6a3"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Apple",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 814 1000"
        className="block h-16 w-14 shrink-0 fill-white sm:h-20 sm:w-16"
      >
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
      </svg>
    ),
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    node: (
      <svg
        aria-hidden="true"
        fill="none"
        viewBox="0 0 54 33"
        className="block h-12 w-20 shrink-0 sm:h-14 sm:w-24"
      >
        <path
          fill="#38bdf8"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2Z"
        />
      </svg>
    ),
  },
  {
    id: "vercel",
    label: "Vercel",
    node: (
      <span className="block h-0 w-0 shrink-0 border-x-[34px] border-b-[58px] border-x-transparent border-b-fg sm:border-x-[42px] sm:border-b-[72px]" />
    ),
  },
];

// ── Marquee demo data ─────────────────────────────────────────────────
const marqueeBrands = ["stripe", "vercel", "linear", "notion", "supabase", "raycast"];

const testimonials = [
  {
    quote: "We shipped a polished, on-brand UI in a weekend. The theming alone paid for itself.",
    name: "Ana Ribeiro",
    role: "Head of Design, Northwind",
    initials: "AR",
  },
  {
    quote:
      "Every component is accessible out of the box — our axe audit went green on the first pass.",
    name: "Marcus Lee",
    role: "Staff Engineer, Atlas",
    initials: "ML",
  },
  {
    quote:
      "The motion is tasteful and respects reduced-motion. It feels premium without trying hard.",
    name: "Priya Nair",
    role: "Product Lead, Lumen",
    initials: "PN",
  },
  {
    quote:
      "Drop-in registry, zero lock-in. We own the code and still get updates when we want them.",
    name: "Tomás Costa",
    role: "Founder, Brava",
    initials: "TC",
  },
];

const orbitInnerTools = [
  { label: "Search", icon: Search },
  { label: "Alerts", icon: Bell },
  { label: "Settings", icon: Settings },
];

const orbitOuterTools = [
  { label: "GitHub", icon: Github },
  { label: "Security", icon: ShieldCheck },
  { label: "Chat", icon: MessageSquarePlus },
  { label: "Uptime", icon: Wifi },
  { label: "Favorites", icon: Star },
];

const orbitOnCall = [
  { name: "Ana Ribeiro", initials: "AR" },
  { name: "Marcus Lee", initials: "ML" },
  { name: "Priya Nair", initials: "PN" },
  { name: "Tom Costa", initials: "TC" },
];

/**
 * AnimatedNumber: a revenue tile whose value springs to each new total. Click
 * "Nova venda" to add a sale and watch it count up (reduced-motion snaps).
 */
function AnimatedNumberDemo() {
  const [total, setTotal] = useState(12480);
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-1 p-6 text-center">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Receita do mês
          </span>
          <AnimatedNumber
            value={total}
            locale="pt-BR"
            formatOptions={{ style: "currency", currency: "BRL" }}
            reducedMotion="never"
            className="font-display text-4xl font-semibold text-fg"
          />
        </CardContent>
      </Card>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setTotal((t) => t + 200 + Math.round(Math.random() * 1800))}
      >
        <Plus aria-hidden="true" className="size-4" />
        Nova venda
      </Button>
    </div>
  );
}

/**
 * Carousel: a native scroll-snap gallery with prev/next, dots, and keyboard
 * support. Drag/swipe works on touch; the OS reduced-motion setting governs the
 * smooth scroll.
 */
function CarouselDemo() {
  const slides = [
    { id: "onboarding", n: 1, label: "Onboarding" },
    { id: "checkout", n: 2, label: "Checkout" },
    { id: "payout", n: 3, label: "Repasse" },
    { id: "insights", n: 4, label: "Insights" },
    { id: "growth", n: 5, label: "Growth" },
  ];
  return (
    <Carousel className="w-full max-w-sm" opts={{ align: "start" }}>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="flex h-40 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-surface-raised">
              <span className="font-display text-4xl font-semibold text-fg">{slide.n}</span>
              <span className="text-xs text-fg-tertiary">{slide.label}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-center gap-3">
        <CarouselPrevious />
        <CarouselDots />
        <CarouselNext />
      </div>
    </Carousel>
  );
}

/**
 * SegmentedControl: a period filter whose thumb slides between options. The
 * selected value is mirrored below to show the controlled state.
 */
function SegmentedControlDemo() {
  const [period, setPeriod] = useState("30d");
  const labels: Record<string, string> = {
    "7d": "7 dias",
    "30d": "30 dias",
    "12m": "12 meses",
  };
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <SegmentedControl
        value={period}
        onValueChange={setPeriod}
        reducedMotion="never"
        aria-label="Período"
      >
        <SegmentedControlItem value="7d">7 dias</SegmentedControlItem>
        <SegmentedControlItem value="30d">30 dias</SegmentedControlItem>
        <SegmentedControlItem value="12m">12 meses</SegmentedControlItem>
      </SegmentedControl>
      <p className="text-sm text-fg-secondary">
        Período: <span className="font-medium text-fg">{labels[period]}</span>
      </p>
    </div>
  );
}

/**
 * TextEffect: staggers a headline in by character (blur) and a subtitle by word
 * (slide). "Replay" remounts the block so the mount-triggered animation runs
 * again.
 */
function TextEffectDemo() {
  const [runId, setRunId] = useState(0);
  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <div key={runId} className="flex flex-col gap-2">
        <TextEffect
          as="h3"
          per="char"
          preset="blur"
          trigger="mount"
          reducedMotion="never"
          className="font-display text-3xl font-semibold text-fg"
        >
          Ship premium by default
        </TextEffect>
        <TextEffect
          as="p"
          per="word"
          preset="slide"
          trigger="mount"
          delay={0.35}
          reducedMotion="never"
          className="text-sm text-fg-secondary"
        >
          Every surface arrives with intent.
        </TextEffect>
      </div>
      <Button size="sm" variant="outline" onClick={() => setRunId((n) => n + 1)}>
        <RotateCw aria-hidden="true" className="size-4" />
        Replay
      </Button>
    </div>
  );
}

/**
 * FlipCard (controlled): the card never self-flips — a Button below owns the
 * `flipped` state and toggles between an order summary (front) and its line-item
 * breakdown (back). Uses the vertical axis so it tumbles top-to-bottom.
 */
function FlipCardControlledDemo() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <FlipCard
        trigger="controlled"
        flipped={flipped}
        axis="vertical"
        aria-label="Detalhe do pedido"
        className="h-64 w-full max-w-xs"
      >
        <FlipCardFront className="justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
              Pedido #4821
            </span>
            <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success-strong">
              Pago
            </span>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-fg">R$ 297,00</p>
            <p className="mt-1 text-sm text-fg-secondary">Curso de Copywriting</p>
          </div>
          <p className="text-xs text-fg-tertiary">Toque em “Ver detalhes”.</p>
        </FlipCardFront>
        <FlipCardBack className="justify-between p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">Composição</p>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-fg-secondary">Subtotal</dt>
              <dd className="tabular-nums text-fg">R$ 320,00</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-fg-secondary">Cupom BEMVINDO</dt>
              <dd className="tabular-nums text-success">− R$ 23,00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 font-medium">
              <dt className="text-fg">Total</dt>
              <dd className="tabular-nums text-fg">R$ 297,00</dd>
            </div>
          </dl>
        </FlipCardBack>
      </FlipCard>
      <Button size="sm" variant="outline" onClick={() => setFlipped((value) => !value)}>
        <RotateCw aria-hidden="true" className="size-4" />
        {flipped ? "Ver resumo" : "Ver detalhes"}
      </Button>
    </div>
  );
}

export const premiumExamples: ExampleMap = {
  "glass-card": [
    {
      id: "frosted-surface",
      title: "Frosted surface",
      description:
        "A frosted-glass panel floating over a colorful backdrop — the backdrop-blur is what reveals the depth, so always give it something vivid to sit on.",
      code: `<div className="relative overflow-hidden rounded-2xl">
  <AuroraBackground className="absolute inset-0" />
  <div className="relative p-6">
    <GlassCard className="flex flex-col gap-3 p-5">
      <span className="grid size-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <h3 className="font-display text-base font-semibold text-fg">Premium by default</h3>
      <p className="text-sm text-fg-secondary">
        Aurora gradients and frosted blur ship out of the box — no design debt to pay down.
      </p>
    </GlassCard>
  </div>
</div>`,
      preview: (
        <div className="relative overflow-hidden rounded-2xl">
          <AuroraBackground className="absolute inset-0" />
          <div className="relative p-6">
            <GlassCard className="flex flex-col gap-3 p-5">
              <span className="grid size-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <h3 className="font-display text-base font-semibold text-fg">Premium by default</h3>
              <p className="text-sm text-fg-secondary">
                Aurora gradients and frosted blur ship out of the box — no design debt to pay down.
              </p>
            </GlassCard>
          </div>
        </div>
      ),
    },
  ],
  "gradient-border": [
    {
      id: "with-glow",
      title: "With glow",
      description: "Pass `glow` to add an ambient shadow that draws the eye to a hero surface.",
      code: `<GradientBorder glow innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
  <h3 className="font-display text-base font-semibold text-fg">Pro plan</h3>
  <p className="text-sm text-fg-secondary">
    The glowing border draws the eye to your highest-value surface.
  </p>
  <div className="flex items-baseline gap-1">
    <span className="font-display text-2xl font-semibold text-fg">$29</span>
    <span className="text-sm text-fg-tertiary">/ month</span>
  </div>
</GradientBorder>`,
      preview: (
        <GradientBorder glow innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
          <h3 className="font-display text-base font-semibold text-fg">Pro plan</h3>
          <p className="text-sm text-fg-secondary">
            The glowing border draws the eye to your highest-value surface.
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-semibold text-fg">$29</span>
            <span className="text-sm text-fg-tertiary">/ month</span>
          </div>
        </GradientBorder>
      ),
    },
    {
      id: "flat",
      title: "Flat",
      description: "Omit `glow` for the same gradient ring, kept calm for secondary surfaces.",
      code: `<GradientBorder innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
  <h3 className="font-display text-base font-semibold text-fg">Starter plan</h3>
  <p className="text-sm text-fg-secondary">
    The same gradient ring, kept calm and flat for secondary surfaces.
  </p>
  <div className="flex items-baseline gap-1">
    <span className="font-display text-2xl font-semibold text-fg">$0</span>
    <span className="text-sm text-fg-tertiary">/ forever</span>
  </div>
</GradientBorder>`,
      preview: (
        <GradientBorder innerClassName="flex flex-col gap-3 bg-surface-raised p-5">
          <h3 className="font-display text-base font-semibold text-fg">Starter plan</h3>
          <p className="text-sm text-fg-secondary">
            The same gradient ring, kept calm and flat for secondary surfaces.
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-semibold text-fg">$0</span>
            <span className="text-sm text-fg-tertiary">/ forever</span>
          </div>
        </GradientBorder>
      ),
    },
  ],
  "gradient-text": [
    {
      id: "headline",
      title: "Headline",
      description:
        "Use `asChild` to clip your own heading element to the Aurora gradient — the typography stays yours, the fill is the brand's.",
      code: `<GradientText asChild>
  <h3 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
    Design that themes itself
  </h3>
</GradientText>`,
      preview: (
        <GradientText asChild>
          <h3 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Design that themes itself
          </h3>
        </GradientText>
      ),
    },
  ],
  "spotlight-card": [
    {
      id: "hover-spotlight",
      title: "Hover spotlight",
      description:
        "A radial spotlight tracks your cursor across the card — hover anywhere over it to bring the surface to life.",
      code: `<SpotlightCard className="flex flex-col gap-3 p-5">
  <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-primary">
    <Gauge className="size-4" aria-hidden="true" />
  </span>
  <h3 className="font-display text-base font-semibold text-fg">Accessible core</h3>
  <p className="text-sm text-fg-secondary">
    Radix primitives and focus-visible rings ship on by default.
  </p>
</SpotlightCard>`,
      preview: (
        <SpotlightCard className="flex flex-col gap-3 p-5">
          <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-primary">
            <Gauge className="size-4" aria-hidden="true" />
          </span>
          <h3 className="font-display text-base font-semibold text-fg">Accessible core</h3>
          <p className="text-sm text-fg-secondary">
            Radix primitives and focus-visible rings ship on by default.
          </p>
        </SpotlightCard>
      ),
    },
  ],
  "scroll-progress": [
    {
      id: "reading-bar",
      title: "Reading bar & ring",
      description:
        "Pass a `target` ref to scope progress to a scroll container instead of the page. The `bar` variant pins to the top of the box; the `circle` variant reads the same ref so a sticky reading bar and a progress ring stay in sync.",
      code: `function ScrollProgressDemo() {
  const ref = useRef<HTMLElement>(null);
  return (
    <div className="flex items-start gap-4">
      {/* A named <section> is a scrollable region; keep it keyboard-focusable. */}
      <section ref={ref} tabIndex={0} aria-label="Release notes, scrollable" className="relative h-64 overflow-y-auto rounded-lg border">
        <ScrollProgress target={ref} className="sticky top-0 z-10" />
        <div className="space-y-4 p-4">
          {/* …tall content… */}
        </div>
      </section>
      <ScrollProgress variant="circle" target={ref} size={48} />
    </div>
  );
}`,
      preview: <ScrollProgressDemo />,
    },
  ],
  "aurora-background": [
    {
      id: "animated-backdrop",
      title: "Animated backdrop",
      description:
        "An animated aurora gradient wrapping centered hero content — the brand's signature first impression.",
      code: `<AuroraBackground className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl">
  <div className="flex max-w-lg flex-col items-center gap-4 px-6 py-12 text-center">
    <GradientText asChild>
      <h3 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
        Ship something beautiful
      </h3>
    </GradientText>
    <p className="text-balance text-sm text-fg-secondary">
      Accessible, token-driven React components with premium motion baked in.
    </p>
    <Button variant="primary" size="lg">
      Get started
      <ArrowRight aria-hidden="true" />
    </Button>
  </div>
</AuroraBackground>`,
      preview: (
        <AuroraBackground className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl">
          <div className="flex max-w-lg flex-col items-center gap-4 px-6 py-12 text-center">
            <GradientText asChild>
              <h3 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                Ship something beautiful
              </h3>
            </GradientText>
            <p className="text-balance text-sm text-fg-secondary">
              Accessible, token-driven React components with premium motion baked in.
            </p>
            <Button variant="primary" size="lg">
              Get started
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </AuroraBackground>
      ),
    },
  ],
  "logo-carousel": [
    {
      id: "hero-lockup",
      title: "Hero lockup",
      description:
        "Large ghost logos that rotate in place for launch pages, waitlists and social-proof heroes. Each slot cross-fades upward with Motion, pauses on hover/focus and becomes static for reduced-motion users.",
      install: {
        registryItem: "logo-carousel",
        dependencies: ["motion"],
      },
      code: `const logos = [
  {
    id: "stripe",
    label: "Stripe",
    node: <span className="text-5xl font-black text-[#635bff]">stripe</span>,
  },
  {
    id: "bmw",
    label: "BMW",
    node: <span className="grid size-16 place-items-center rounded-full bg-white text-sm font-black text-black">BMW</span>,
  },
  {
    id: "typescript",
    label: "TypeScript",
    node: <span className="grid size-16 place-items-center rounded-md bg-[#3178c6] text-3xl font-black text-white">TS</span>,
  },
  {
    id: "next",
    label: "Next.js",
    node: <span className="grid size-16 place-items-center rounded-full border-2 border-fg text-3xl font-semibold">N</span>,
  },
];

<section className="flex flex-col items-center gap-8 py-12 text-center">
  <div className="space-y-2">
    <p className="font-display text-2xl font-semibold text-fg">
      The best teams are already here
    </p>
    <h3 className="font-display text-6xl font-semibold leading-none text-fg">
      Join Kronus UI
    </h3>
  </div>
  <LogoCarousel items={logos} columns={3} ariaLabel="Customer logos" />
</section>`,
      preview: (
        <section className="mx-auto flex min-h-[360px] w-full max-w-4xl flex-col items-center justify-center gap-8 py-8 text-center">
          <div className="space-y-2">
            <p className="font-display text-2xl font-semibold leading-tight text-fg sm:text-3xl">
              The best teams are already here
            </p>
            <h3 className="font-display text-6xl font-semibold leading-none text-fg sm:text-8xl">
              Join Kronus UI
            </h3>
          </div>
          <LogoCarousel
            items={heroLogos}
            columns={3}
            interval={1600}
            staggerDelay={0.12}
            motionPreference="always"
            ariaLabel="Customer logos"
          />
        </section>
      ),
    },
  ],
  marquee: [
    {
      id: "logo-ticker",
      title: "Logo ticker",
      description:
        "A seamless, constant-velocity strip for a wall of customer logos. The edges fade into the background and the scroll pauses on hover. Reduced-motion visitors get a single static, fully-legible row.",
      install: {
        registryItem: "marquee",
        dependencies: ["motion"],
      },
      code: `<Marquee pauseOnHover speed={32} className="py-2">
  {["stripe", "vercel", "linear", "notion", "supabase", "raycast"].map((brand) => (
    <span
      key={brand}
      className="mx-8 text-2xl font-semibold tracking-tight text-fg-secondary"
    >
      {brand}
    </span>
  ))}
</Marquee>`,
      preview: (
        <Marquee pauseOnHover speed={32} motionPreference="always" className="w-full py-2">
          {marqueeBrands.map((brand) => (
            <span
              key={brand}
              className="mx-8 text-2xl font-semibold tracking-tight text-fg-secondary"
            >
              {brand}
            </span>
          ))}
        </Marquee>
      ),
    },
    {
      id: "testimonials",
      title: "Testimonial wall",
      description:
        "Two rows scrolling in opposite directions for a lively social-proof band. Each card is full content; hovering anywhere pauses both rows so a quote can be read.",
      install: {
        registryItem: "marquee",
        dependencies: ["motion"],
      },
      code: `<div className="flex flex-col gap-4">
  <Marquee pauseOnHover speed={24}>
    {testimonials.map((t) => (
      <Card key={t.name} className="mx-3 w-80 shrink-0">
        <CardContent className="flex flex-col gap-4 pt-6">
          <p className="text-sm leading-relaxed text-fg">"{t.quote}"</p>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-surface-overlay text-xs font-medium text-fg-secondary">
              {t.initials}
            </span>
            <div className="text-sm">
              <p className="font-medium text-fg">{t.name}</p>
              <p className="text-fg-tertiary">{t.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </Marquee>
  <Marquee pauseOnHover direction="right" speed={24}>
    {testimonials.map((t) => ( /* …same card… */ ))}
  </Marquee>
</div>`,
      preview: (
        <div className="flex w-full flex-col gap-4">
          {(["left", "right"] as const).map((direction) => (
            <Marquee
              key={direction}
              pauseOnHover
              direction={direction}
              speed={24}
              motionPreference="always"
              className="w-full"
            >
              {testimonials.map((t) => (
                <Card key={`${direction}-${t.name}`} className="mx-3 w-80 shrink-0">
                  <CardContent className="flex flex-col gap-4 pt-6">
                    <p className="text-sm leading-relaxed text-fg">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-surface-overlay text-xs font-medium text-fg-secondary">
                        {t.initials}
                      </span>
                      <div className="text-sm">
                        <p className="font-medium text-fg">{t.name}</p>
                        <p className="text-fg-tertiary">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Marquee>
          ))}
        </div>
      ),
    },
  ],
  "morphing-popover": [
    {
      id: "feedback",
      title: "Feedback",
      description:
        "The trigger physically morphs into a small non-modal dialog instead of fading in beside it. Inside: an accessible, labelled textarea and a footer that pairs Close with a submit. Focus moves into the surface on open and returns to the trigger on close; Escape and outside-click both dismiss. Submit is local-only — it flips to a thank-you state and auto-closes. Honours reduced-motion.",
      install: {
        registryItem: "morphing-popover",
        dependencies: ["motion"],
      },
      code: `function FeedbackPopover() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const fieldId = useId();

  return (
    <MorphingPopover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setSent(false);
      }}
    >
      <MorphingPopoverTrigger>
        <MessageSquarePlus aria-hidden="true" className="size-4" />
        Feedback
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Send feedback" className="w-[22rem]">
        {sent ? (
          <MorphingPopoverBody className="items-center gap-1 py-10 text-center">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <p className="text-sm font-medium text-fg">Thanks for the note!</p>
            <p className="text-xs text-fg-tertiary">We read every message.</p>
          </MorphingPopoverBody>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setNote("");
              window.setTimeout(() => setOpen(false), 1200);
            }}
          >
            <label htmlFor={fieldId} className="sr-only">
              Your feedback
            </label>
            <textarea
              id={fieldId}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="Add feedback"
              className="block w-full resize-none bg-transparent px-4 pt-4 text-sm text-fg outline-none placeholder:text-fg-tertiary"
            />
            <MorphingPopoverFooter className="justify-between border-t-0 px-3 pb-3 pt-1">
              <MorphingPopoverClose />
              <Button type="submit" size="sm" variant="outline" disabled={note.trim().length === 0}>
                Submit
              </Button>
            </MorphingPopoverFooter>
          </form>
        )}
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}`,
      preview: <MorphingPopoverFeedbackDemo />,
    },
    {
      id: "quick-actions",
      title: "Quick actions",
      description:
        "A poppy menu: the trigger morphs into a compact list of MorphingPopoverButton rows with leading lucide icons. Each row closes the surface on activation. Full keyboard + screen-reader support comes from the dialog wiring (aria-haspopup/expanded/controls, focus trap-in/return).",
      install: {
        registryItem: "morphing-popover",
        dependencies: ["motion"],
      },
      code: `function QuickActions() {
  const [open, setOpen] = useState(false);
  const actions = [
    { id: "edit", label: "Edit", icon: Pencil },
    { id: "duplicate", label: "Duplicate", icon: Copy },
    { id: "share", label: "Share", icon: Share2 },
  ];

  return (
    <MorphingPopover open={open} onOpenChange={setOpen}>
      <MorphingPopoverTrigger>
        Actions
        <ArrowRight aria-hidden="true" className="size-4" />
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Quick actions" className="w-56">
        <MorphingPopoverBody className="gap-0.5 p-1.5">
          {actions.map(({ id, label, icon: Icon }) => (
            <MorphingPopoverButton key={id} onClick={() => setOpen(false)}>
              <Icon aria-hidden="true" />
              {label}
            </MorphingPopoverButton>
          ))}
          <div className="my-1 h-px bg-border" />
          <MorphingPopoverButton
            onClick={() => setOpen(false)}
            className="text-fg-secondary hover:text-fg"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </MorphingPopoverButton>
        </MorphingPopoverBody>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}`,
      preview: <MorphingPopoverQuickActionsDemo />,
    },
  ],
  shimmer: [
    {
      id: "loading-sheen",
      title: "Loading sheen",
      description:
        "Sized skeleton blocks with a sweeping sheen — give each Shimmer explicit height and width to match the content it stands in for.",
      code: `<div className="flex flex-col gap-3">
  <Shimmer className="h-8 w-48 rounded-lg" />
  <Shimmer className="h-4 w-full rounded-md" />
  <Shimmer className="h-4 w-3/4 rounded-md" />
  <Shimmer className="h-10 w-32 rounded-lg" />
</div>`,
      preview: (
        <div className="flex flex-col gap-3">
          <Shimmer className="h-8 w-48 rounded-lg" />
          <Shimmer className="h-4 w-full rounded-md" />
          <Shimmer className="h-4 w-3/4 rounded-md" />
          <Shimmer className="h-10 w-32 rounded-lg" />
        </div>
      ),
    },
  ],
  reveal: [
    {
      id: "scroll-reveal",
      title: "Scroll reveal",
      description:
        "Wrap any content to fade and slide it into view as it enters the viewport. The reveal fires once, then settles. Scroll it into frame to see it animate.",
      code: `<Reveal>
  <Card className="w-full">
    <CardHeader>
      <span className="mb-1 grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <CardTitle className="text-2xl">Reveal as you scroll</CardTitle>
      <CardDescription className="text-base">
        This card fades and slides into view the moment it enters the viewport. Give it room
        so the entrance is unmistakable.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-5 text-sm text-fg-secondary">
      <p className="leading-relaxed">
        Wrap any block — a hero, a pricing tier, a feature grid — and it arrives with intent
        instead of popping in. Reveals fire a single time, so the section settles instead of
        replaying as you scroll past.
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-display text-2xl font-semibold text-fg">Fade</p>
          <p className="mt-1 text-xs text-fg-tertiary">opacity 0 → 1</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-display text-2xl font-semibold text-fg">Slide</p>
          <p className="mt-1 text-xs text-fg-tertiary">y 24 → 0</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-display text-2xl font-semibold text-fg">Once</p>
          <p className="mt-1 text-xs text-fg-tertiary">no replay</p>
        </div>
      </div>
    </CardContent>
  </Card>
</Reveal>`,
      preview: (
        <Reveal>
          <Card className="w-full">
            <CardHeader>
              <span className="mb-1 grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="text-2xl">Reveal as you scroll</CardTitle>
              <CardDescription className="text-base">
                This card fades and slides into view the moment it enters the viewport. Give it room
                so the entrance is unmistakable.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 text-sm text-fg-secondary">
              <p className="leading-relaxed">
                Wrap any block — a hero, a pricing tier, a feature grid — and it arrives with intent
                instead of popping in. Reveals fire a single time, so the section settles instead of
                replaying as you scroll past.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-surface-raised p-4">
                  <p className="font-display text-2xl font-semibold text-fg">Fade</p>
                  <p className="mt-1 text-xs text-fg-tertiary">opacity 0 → 1</p>
                </div>
                <div className="rounded-xl border border-border bg-surface-raised p-4">
                  <p className="font-display text-2xl font-semibold text-fg">Slide</p>
                  <p className="mt-1 text-xs text-fg-tertiary">y 24 → 0</p>
                </div>
                <div className="rounded-xl border border-border bg-surface-raised p-4">
                  <p className="font-display text-2xl font-semibold text-fg">Once</p>
                  <p className="mt-1 text-xs text-fg-tertiary">no replay</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      ),
    },
  ],
  "animated-number": [
    {
      id: "count-up",
      title: "Count up",
      description:
        "Springs toward the target whenever it changes, so a balance or KPI counts up instead of snapping. Honours reduced-motion (snaps) and formats through Intl. Click to add a sale.",
      code: `function Revenue() {
  const [total, setTotal] = useState(12480);
  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatedNumber
        value={total}
        locale="pt-BR"
        formatOptions={{ style: "currency", currency: "BRL" }}
        className="font-display text-4xl font-semibold text-fg"
      />
      <Button size="sm" variant="outline" onClick={() => setTotal((t) => t + 850)}>
        Nova venda
      </Button>
    </div>
  );
}`,
      preview: <AnimatedNumberDemo />,
    },
  ],
  carousel: [
    {
      id: "slides",
      title: "Slides",
      description:
        "Native scroll-snap gallery — swipe or drag on touch, prev/next + dots and full keyboard support on desktop, reduced-motion handled by the OS. Set `basis` on CarouselItem for multi-up views.",
      code: `<Carousel className="w-full max-w-sm" opts={{ align: "start" }}>
  <CarouselContent>
    {slides.map((slide) => (
      <CarouselItem key={slide.id}>
        <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-surface-raised">
          <span className="font-display text-4xl font-semibold text-fg">{slide.n}</span>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <div className="mt-4 flex items-center justify-center gap-3">
    <CarouselPrevious />
    <CarouselDots />
    <CarouselNext />
  </div>
</Carousel>`,
      preview: <CarouselDemo />,
    },
  ],
  "segmented-control": [
    {
      id: "single-select",
      title: "Single select",
      description:
        "A thumb that slides between options via a shared layoutId — radiogroup semantics with full arrow-key navigation. Ideal for period filters and view toggles.",
      code: `<SegmentedControl defaultValue="30d" aria-label="Período">
  <SegmentedControlItem value="7d">7 dias</SegmentedControlItem>
  <SegmentedControlItem value="30d">30 dias</SegmentedControlItem>
  <SegmentedControlItem value="12m">12 meses</SegmentedControlItem>
</SegmentedControl>`,
      preview: <SegmentedControlDemo />,
    },
  ],
  "text-effect": [
    {
      id: "headline",
      title: "Headline",
      description:
        "Staggers words or characters in with a fade, blur, or slide — on scroll-into-view or on mount. The full string stays in the a11y tree via aria-label, so screen readers read it once.",
      code: `<TextEffect as="h3" per="char" preset="blur" className="font-display text-3xl font-semibold text-fg">
  Ship premium by default
</TextEffect>`,
      preview: <TextEffectDemo />,
    },
  ],
  frame: [
    {
      id: "browser",
      title: "Browser chrome",
      description:
        "Wrap a screenshot or mockup in browser chrome — traffic-light dots plus an address bar fed by `url`. Anything you nest becomes the framed content.",
      code: `<Frame url="kronus.app/dashboard">
  <div className="space-y-2 p-6">
    <h3 className="font-display text-lg font-semibold text-fg">Faturamento</h3>
    <p className="text-sm text-fg-secondary">R$ 128.940 nos últimos 30 dias.</p>
    <p className="text-sm text-fg-secondary">+18% vs. o período anterior.</p>
  </div>
</Frame>`,
      preview: (
        <Frame url="kronus.app/dashboard" className="w-full max-w-md">
          <div className="space-y-2 p-6">
            <h3 className="font-display text-lg font-semibold text-fg">Faturamento</h3>
            <p className="text-sm text-fg-secondary">R$ 128.940 nos últimos 30 dias.</p>
            <p className="text-sm text-fg-secondary">+18% vs. o período anterior.</p>
          </div>
        </Frame>
      ),
    },
    {
      id: "window",
      title: "Window chrome",
      description:
        "The `window` variant drops the address bar for a plain title bar — handy for desktop-app mockups.",
      code: `<Frame variant="window">
  <div className="space-y-2 p-6">
    <h3 className="font-display text-lg font-semibold text-fg">Preferências</h3>
    <p className="text-sm text-fg-secondary">Tema, notificações e atalhos.</p>
  </div>
</Frame>`,
      preview: (
        <Frame variant="window" className="w-full max-w-md">
          <div className="space-y-2 p-6">
            <h3 className="font-display text-lg font-semibold text-fg">Preferências</h3>
            <p className="text-sm text-fg-secondary">Tema, notificações e atalhos.</p>
          </div>
        </Frame>
      ),
    },
  ],
  dock: [
    {
      id: "app-dock",
      title: "App dock",
      description:
        "A macOS-style icon dock: items magnify as the pointer approaches and settle back on a spring. Each item is named for assistive tech via its `label`; reduced-motion visitors get a static bar.",
      code: `<Dock
  items={[
    { icon: <Home />, label: "Home" },
    { icon: <Search />, label: "Search" },
    { icon: <Bell />, label: "Notifications" },
    { icon: <User />, label: "Profile" },
    { icon: <Settings />, label: "Settings" },
  ]}
/>`,
      preview: (
        <div className="flex w-full justify-center p-6">
          <Dock
            items={[
              { icon: <Home />, label: "Home" },
              { icon: <Search />, label: "Search" },
              { icon: <Bell />, label: "Notifications" },
              { icon: <User />, label: "Profile" },
              { icon: <Settings />, label: "Settings" },
            ]}
          />
        </div>
      ),
    },
  ],
  "border-beam": [
    {
      id: "featured-card",
      title: "Featured card",
      description:
        "A single light head continuously orbits the border like a comet — the calm way to say “this is the one”. It's one composited CSS animation (no JS, no re-renders) and is fully suppressed under prefers-reduced-motion.",
      code: `<BorderBeam duration={6} className="w-full max-w-xs">
  <div className="flex flex-col gap-4 rounded-2xl bg-surface-raised p-6">
    <div className="flex items-center justify-between">
      <span className="grid size-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-fg-secondary">
        Popular
      </span>
    </div>
    <div>
      <h3 className="font-display text-base font-semibold text-fg">Pro</h3>
      <p className="mt-1 text-sm text-fg-secondary">Tudo para escalar a sua loja.</p>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="font-display text-3xl font-semibold text-fg">R$ 79</span>
      <span className="text-sm text-fg-tertiary">/ mês</span>
    </div>
    <Button variant="primary" className="w-full">
      Assinar o Pro
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
  </div>
</BorderBeam>`,
      preview: (
        <BorderBeam duration={6} className="w-full max-w-xs">
          <div className="flex flex-col gap-4 rounded-2xl bg-surface-raised p-6">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-fg-secondary">
                Popular
              </span>
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-fg">Pro</h3>
              <p className="mt-1 text-sm text-fg-secondary">Tudo para escalar a sua loja.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-semibold text-fg">R$ 79</span>
              <span className="text-sm text-fg-tertiary">/ mês</span>
            </div>
            <Button variant="primary" className="w-full">
              Assinar o Pro
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </BorderBeam>
      ),
    },
    {
      id: "prompt-bar",
      title: "Prompt bar",
      description:
        "The beam isn't only for cards — wrap an input to give an AI prompt bar a living, premium edge. A larger `size` reads as a longer comet trail.",
      code: `<BorderBeam size={80} duration={5} className="w-full max-w-md">
  <div className="flex items-center gap-3 rounded-2xl bg-surface-raised px-4 py-3">
    <Sparkles className="size-4 shrink-0 text-primary" aria-hidden="true" />
    <span className="flex-1 truncate text-sm text-fg-tertiary">
      Pergunte qualquer coisa ao Kronus…
    </span>
    <Button size="icon" variant="primary" aria-label="Enviar">
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
  </div>
</BorderBeam>`,
      preview: (
        <BorderBeam size={80} duration={5} className="w-full max-w-md">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-raised px-4 py-3">
            <Sparkles className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="flex-1 truncate text-sm text-fg-tertiary">
              Pergunte qualquer coisa ao Kronus…
            </span>
            <Button size="icon" variant="primary" aria-label="Enviar">
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </BorderBeam>
      ),
    },
    {
      id: "custom-colours",
      title: "Custom colours & reverse",
      description:
        "Every knob rides a CSS variable: set `colorFrom`/`colorTo` for a bespoke gradient head and `reverse` to orbit counter-clockwise. Here an amber→pink trail circles a security card.",
      code: `<BorderBeam
  colorFrom="#f59e0b"
  colorTo="#ec4899"
  size={90}
  duration={5}
  reverse
  className="w-full max-w-xs"
>
  <div className="flex flex-col gap-3 rounded-2xl bg-surface-raised p-6">
    <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-fg">
      <ShieldCheck className="size-4" aria-hidden="true" />
    </span>
    <h3 className="font-display text-base font-semibold text-fg">Pagamentos protegidos</h3>
    <p className="text-sm text-fg-secondary">
      Antifraude e 3-D Secure em cada transação — o feixe reverso mantém o olhar na borda.
    </p>
  </div>
</BorderBeam>`,
      preview: (
        <BorderBeam
          colorFrom="#f59e0b"
          colorTo="#ec4899"
          size={90}
          duration={5}
          reverse
          className="w-full max-w-xs"
        >
          <div className="flex flex-col gap-3 rounded-2xl bg-surface-raised p-6">
            <span className="grid size-9 place-items-center rounded-lg bg-surface-overlay text-fg">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <h3 className="font-display text-base font-semibold text-fg">Pagamentos protegidos</h3>
            <p className="text-sm text-fg-secondary">
              Antifraude e 3-D Secure em cada transação — o feixe reverso mantém o olhar na borda.
            </p>
          </div>
        </BorderBeam>
      ),
    },
  ],
  "flip-card": [
    {
      id: "hover",
      title: "Hover to flip",
      description:
        "The default trigger flips on pointer hover and keyboard focus, so it's fully operable without a mouse. The inactive face is `inert` — its content never double-reads to a screen reader. Hover the card to reveal the plan's benefits.",
      code: `<FlipCard aria-label="Plano Pro" className="h-72 w-full max-w-xs">
  <FlipCardFront className="justify-between p-6">
    <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
      <Sparkles className="size-5" aria-hidden="true" />
    </span>
    <div>
      <h3 className="font-display text-lg font-semibold text-fg">Plano Pro</h3>
      <p className="mt-1 text-sm text-fg-secondary">
        Tudo o que você precisa para escalar a sua loja.
      </p>
    </div>
    <span className="text-xs font-medium text-fg-tertiary">Passe o mouse →</span>
  </FlipCardFront>
  <FlipCardBack className="justify-between p-6">
    <ul className="flex flex-col gap-2.5 text-sm text-fg-secondary">
      <li className="flex items-center gap-2">
        <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
        Repasses em D+2
      </li>
      <li className="flex items-center gap-2">
        <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
        Checkout sem marca
      </li>
      <li className="flex items-center gap-2">
        <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
        Suporte prioritário
      </li>
    </ul>
    <Button variant="primary" className="w-full">
      Assinar o Pro
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
  </FlipCardBack>
</FlipCard>`,
      preview: (
        <FlipCard aria-label="Plano Pro" className="h-72 w-full max-w-xs">
          <FlipCardFront className="justify-between p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-fg">Plano Pro</h3>
              <p className="mt-1 text-sm text-fg-secondary">
                Tudo o que você precisa para escalar a sua loja.
              </p>
            </div>
            <span className="text-xs font-medium text-fg-tertiary">Passe o mouse →</span>
          </FlipCardFront>
          <FlipCardBack className="justify-between p-6">
            <ul className="flex flex-col gap-2.5 text-sm text-fg-secondary">
              <li className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                Repasses em D+2
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                Checkout sem marca
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                Suporte prioritário
              </li>
            </ul>
            <Button variant="primary" className="w-full">
              Assinar o Pro
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </FlipCardBack>
        </FlipCard>
      ),
    },
    {
      id: "click",
      title: "Click to flip",
      description:
        '`trigger="click"` turns the whole card into a single button — it toggles on click, Enter or Space and exposes `role="button"` + `aria-pressed`. Give it an `aria-label` so the control is named. Click to read the testimonial.',
      code: `<FlipCard
  trigger="click"
  aria-label="Ver depoimento de Ana Ribeiro"
  className="h-72 w-full max-w-xs"
>
  <FlipCardFront className="items-center justify-center gap-3 p-6 text-center">
    <span className="grid size-16 place-items-center rounded-full bg-surface-overlay text-lg font-semibold text-fg-secondary">
      AR
    </span>
    <div>
      <p className="font-display text-base font-semibold text-fg">Ana Ribeiro</p>
      <p className="text-sm text-fg-tertiary">Head of Design, Northwind</p>
    </div>
    <span className="text-xs text-fg-tertiary">Clique para ler</span>
  </FlipCardFront>
  <FlipCardBack className="items-center justify-center gap-4 p-6 text-center">
    <div className="flex gap-0.5 text-primary">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className="size-4 fill-current" aria-hidden="true" />
      ))}
    </div>
    <p className="text-sm leading-relaxed text-fg">
      “Shipped a polished, on-brand UI in a weekend. The theming alone paid for itself.”
    </p>
    <div className="flex items-center gap-3 text-fg-tertiary">
      <Github className="size-4" aria-hidden="true" />
      <Linkedin className="size-4" aria-hidden="true" />
    </div>
  </FlipCardBack>
</FlipCard>`,
      preview: (
        <FlipCard
          trigger="click"
          aria-label="Ver depoimento de Ana Ribeiro"
          className="h-72 w-full max-w-xs"
        >
          <FlipCardFront className="items-center justify-center gap-3 p-6 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-surface-overlay text-lg font-semibold text-fg-secondary">
              AR
            </span>
            <div>
              <p className="font-display text-base font-semibold text-fg">Ana Ribeiro</p>
              <p className="text-sm text-fg-tertiary">Head of Design, Northwind</p>
            </div>
            <span className="text-xs text-fg-tertiary">Clique para ler</span>
          </FlipCardFront>
          <FlipCardBack className="items-center justify-center gap-4 p-6 text-center">
            <div className="flex gap-0.5 text-primary">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="size-4 fill-current" aria-hidden="true" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-fg">
              “Shipped a polished, on-brand UI in a weekend. The theming alone paid for itself.”
            </p>
            <div className="flex items-center gap-3 text-fg-tertiary">
              <Github className="size-4" aria-hidden="true" />
              <Linkedin className="size-4" aria-hidden="true" />
            </div>
          </FlipCardBack>
        </FlipCard>
      ),
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        '`trigger="controlled"` never self-flips — you own the `flipped` prop and drive it from anywhere. Here a Button toggles between an order summary and its breakdown, tumbling on the vertical axis.',
      code: `function OrderCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <FlipCard
        trigger="controlled"
        flipped={flipped}
        axis="vertical"
        aria-label="Detalhe do pedido"
        className="h-64 w-full max-w-xs"
      >
        <FlipCardFront className="justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
              Pedido #4821
            </span>
            <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success-strong">
              Pago
            </span>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-fg">R$ 297,00</p>
            <p className="mt-1 text-sm text-fg-secondary">Curso de Copywriting</p>
          </div>
          <p className="text-xs text-fg-tertiary">Toque em “Ver detalhes”.</p>
        </FlipCardFront>
        <FlipCardBack className="justify-between p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">Composição</p>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-fg-secondary">Subtotal</dt>
              <dd className="tabular-nums text-fg">R$ 320,00</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-fg-secondary">Cupom BEMVINDO</dt>
              <dd className="tabular-nums text-success">− R$ 23,00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 font-medium">
              <dt className="text-fg">Total</dt>
              <dd className="tabular-nums text-fg">R$ 297,00</dd>
            </div>
          </dl>
        </FlipCardBack>
      </FlipCard>
      <Button size="sm" variant="outline" onClick={() => setFlipped((value) => !value)}>
        <RotateCw aria-hidden="true" className="size-4" />
        {flipped ? "Ver resumo" : "Ver detalhes"}
      </Button>
    </div>
  );
}`,
      preview: <FlipCardControlledDemo />,
    },
  ],
  "tilt-card": [
    {
      id: "glare-parallax",
      title: "Glare & parallax",
      description:
        "A real perspective transform that tilts toward the pointer, with a soft `glare` sheen and `parallax` lifting the content toward the viewer on hover. The pointer writes straight to CSS variables inside one rAF — no re-renders — and it flattens under prefers-reduced-motion.",
      code: `<TiltCard glare parallax maxTilt={14} className="w-full max-w-xs">
  <div className="flex flex-col gap-3">
    <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
      <Zap className="size-5" aria-hidden="true" />
    </span>
    <h3 className="font-display text-lg font-semibold text-fg">Repasses instantâneos</h3>
    <p className="text-sm text-fg-secondary">
      O saldo entra no mesmo instante em que a venda é aprovada — sem lote noturno, sem espera.
    </p>
  </div>
</TiltCard>`,
      preview: (
        <TiltCard glare parallax maxTilt={14} className="w-full max-w-xs">
          <div className="flex flex-col gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Zap className="size-5" aria-hidden="true" />
            </span>
            <h3 className="font-display text-lg font-semibold text-fg">Repasses instantâneos</h3>
            <p className="text-sm text-fg-secondary">
              O saldo entra no mesmo instante em que a venda é aprovada — sem lote noturno, sem
              espera.
            </p>
          </div>
        </TiltCard>
      ),
    },
    {
      id: "payment-card",
      title: "Payment card",
      description:
        "Push `maxTilt` and `scale` for a tactile, dramatic feel — perfect for a payment-card mockup that leans into the cursor. Override the surface via `className` to paint it with the brand gradient.",
      code: `<TiltCard
  glare
  parallax
  maxTilt={16}
  scale={1.05}
  className="w-full max-w-sm border-transparent bg-gradient-primary text-primary-foreground"
>
  <div className="flex flex-col gap-6">
    <div className="flex items-start justify-between">
      <span className="font-display text-lg font-semibold">Kronus</span>
      <Wifi className="size-6 rotate-90 opacity-90" aria-hidden="true" />
    </div>
    <div className="h-9 w-12 rounded-md bg-white/25 ring-1 ring-white/20" aria-hidden="true" />
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xl tracking-[0.25em]">4242 4242 4242 4242</p>
      <div className="flex items-center justify-between text-xs uppercase tracking-wide opacity-90">
        <span>Pedro Gontijo</span>
        <span className="tabular-nums">12/29</span>
      </div>
    </div>
  </div>
</TiltCard>`,
      preview: (
        <TiltCard
          glare
          parallax
          maxTilt={16}
          scale={1.05}
          className="w-full max-w-sm border-transparent bg-gradient-primary text-primary-foreground"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <span className="font-display text-lg font-semibold">Kronus</span>
              <Wifi className="size-6 rotate-90 opacity-90" aria-hidden="true" />
            </div>
            <div
              className="h-9 w-12 rounded-md bg-white/25 ring-1 ring-white/20"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-4">
              <p className="font-mono text-xl tracking-[0.25em]">4242 4242 4242 4242</p>
              <div className="flex items-center justify-between text-xs uppercase tracking-wide opacity-90">
                <span>Pedro Gontijo</span>
                <span className="tabular-nums">12/29</span>
              </div>
            </div>
          </div>
        </TiltCard>
      ),
    },
    {
      id: "subtle",
      title: "Subtle",
      description:
        "Dial `maxTilt` and `scale` right down (and skip the glare) for a restrained lift that suits dense lists and rows — motion that's felt more than seen.",
      code: `<TiltCard maxTilt={6} scale={1.02} className="w-full max-w-xs">
  <div className="flex items-center gap-4">
    <span className="grid size-11 place-items-center rounded-full bg-surface-overlay text-fg-secondary">
      <User className="size-5" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-fg">Ana Ribeiro</p>
      <p className="truncate text-sm text-fg-tertiary">ana@kronus.app</p>
    </div>
    <ArrowRight className="ml-auto size-4 shrink-0 text-fg-tertiary" aria-hidden="true" />
  </div>
</TiltCard>`,
      preview: (
        <TiltCard maxTilt={6} scale={1.02} className="w-full max-w-xs">
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-full bg-surface-overlay text-fg-secondary">
              <User className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-fg">Ana Ribeiro</p>
              <p className="truncate text-sm text-fg-tertiary">ana@kronus.app</p>
            </div>
            <ArrowRight className="ml-auto size-4 shrink-0 text-fg-tertiary" aria-hidden="true" />
          </div>
        </TiltCard>
      ),
    },
  ],
  magnetic: [
    {
      id: "magnetic-cta",
      title: "Magnetic call-to-action",
      description:
        "Wrap a hero CTA so it leans into the cursor before the pointer even lands. Pad the wrapper (`p-10`) to give the field room beyond the button — the attraction only acts where the wrapper is hovered. The pull is lerped straight onto the child's transform inside one rAF (zero re-renders) and the whole effect switches off under prefers-reduced-motion and on touch.",
      install: { registryItem: "magnetic" },
      code: `<Magnetic className="p-10">
  <Button size="lg" className="rounded-full px-8 shadow-glow">
    Começar agora
    <ArrowRight className="size-4" aria-hidden="true" />
  </Button>
</Magnetic>`,
      preview: (
        <Magnetic className="p-10">
          <Button size="lg" className="rounded-full px-8 shadow-glow">
            Começar agora
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </Magnetic>
      ),
    },
    {
      id: "icon-row",
      title: "Icon row",
      description:
        "A row of independently magnetic icon buttons — each has its own small field, so only the nearest icon drifts toward the pointer while its neighbours stay at rest. Keep `strength` low for chrome that should feel alive but not needy.",
      code: `<div className="flex items-center gap-1">
  {[
    { label: "GitHub", icon: Github },
    { label: "LinkedIn", icon: Linkedin },
    { label: "Compartilhar", icon: Share2 },
  ].map(({ label, icon: Icon }) => (
    <Magnetic key={label} strength={0.25} radius={60} className="p-3">
      <Button variant="ghost" size="icon" aria-label={label} className="rounded-full">
        <Icon className="size-4" aria-hidden="true" />
      </Button>
    </Magnetic>
  ))}
</div>`,
      preview: (
        <div className="flex items-center gap-1">
          {[
            { label: "GitHub", icon: Github },
            { label: "LinkedIn", icon: Linkedin },
            { label: "Compartilhar", icon: Share2 },
          ].map(({ label, icon: Icon }) => (
            <Magnetic key={label} strength={0.25} radius={60} className="p-3">
              <Button variant="ghost" size="icon" aria-label={label} className="rounded-full">
                <Icon className="size-4" aria-hidden="true" />
              </Button>
            </Magnetic>
          ))}
        </div>
      ),
    },
    {
      id: "field-tuning",
      title: "Strength & radius",
      description:
        "`strength` (0–1) scales how far the content chases the pointer; `radius` sets where the field dissolves back to zero — the falloff eases to nothing at the edge, so there is never a pop. Tune both per surface: subtle for dense UI, sticky for hero moments.",
      code: `<div className="flex flex-wrap items-end justify-center gap-8">
  <div className="flex flex-col items-center gap-2">
    <Magnetic strength={0.15} radius={80} className="p-8">
      <Button variant="outline" className="rounded-full">Sutil</Button>
    </Magnetic>
    <span className="font-mono text-xs text-fg-tertiary tabular-nums">strength 0.15 · radius 80</span>
  </div>
  <div className="flex flex-col items-center gap-2">
    <Magnetic strength={0.6} radius={160} className="p-8">
      <Button variant="outline" className="rounded-full">Grudento</Button>
    </Magnetic>
    <span className="font-mono text-xs text-fg-tertiary tabular-nums">strength 0.6 · radius 160</span>
  </div>
</div>`,
      preview: (
        <div className="flex flex-wrap items-end justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Magnetic strength={0.15} radius={80} className="p-8">
              <Button variant="outline" className="rounded-full">
                Sutil
              </Button>
            </Magnetic>
            <span className="font-mono text-xs text-fg-tertiary tabular-nums">
              strength 0.15 · radius 80
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Magnetic strength={0.6} radius={160} className="p-8">
              <Button variant="outline" className="rounded-full">
                Grudento
              </Button>
            </Magnetic>
            <span className="font-mono text-xs text-fg-tertiary tabular-nums">
              strength 0.6 · radius 160
            </span>
          </div>
        </div>
      ),
    },
  ],
  orbit: [
    {
      id: "constellation",
      title: "Integration constellation",
      description:
        "Two counter-rotating rings of tool chips around a product core — the classic integrations hero. One shared CSS keyframe drives everything (zero JS per frame): hovering the stage pauses both rings so any chip can be clicked, and reduced-motion visitors get the same layout statically placed, every chip upright.",
      install: {
        registryItem: "orbit",
      },
      code: `<Orbit aria-label="Tools orbiting the product core" className="size-80">
  <span className="grid size-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
    <Zap className="size-6" />
  </span>
  <OrbitRing radius={72} duration={22}>
    {innerTools.map(({ label, icon: Icon }) => (
      <OrbitItem key={label}>
        <span
          role="img"
          aria-label={label}
          className="grid size-10 place-items-center rounded-full border border-border bg-surface-raised text-fg-secondary shadow-sm"
        >
          <Icon className="size-4" />
        </span>
      </OrbitItem>
    ))}
  </OrbitRing>
  <OrbitRing radius={128} duration={36} reverse startAngle={36}>
    {outerTools.map(({ label, icon: Icon }) => ( /* …same chip… */ ))}
  </OrbitRing>
</Orbit>`,
      preview: (
        <Orbit aria-label="Tools orbiting the product core" className="size-80">
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Zap className="size-6" />
          </span>
          <OrbitRing radius={72} duration={22}>
            {orbitInnerTools.map(({ label, icon: Icon }) => (
              <OrbitItem key={label}>
                <span
                  role="img"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-border bg-surface-raised text-fg-secondary shadow-sm"
                >
                  <Icon className="size-4" />
                </span>
              </OrbitItem>
            ))}
          </OrbitRing>
          <OrbitRing radius={128} duration={36} reverse startAngle={36}>
            {orbitOuterTools.map(({ label, icon: Icon }) => (
              <OrbitItem key={label}>
                <span
                  role="img"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-border bg-surface-raised text-fg-secondary shadow-sm"
                >
                  <Icon className="size-4" />
                </span>
              </OrbitItem>
            ))}
          </OrbitRing>
        </Orbit>
      ),
    },
    {
      id: "team-halo",
      title: "Team halo",
      description:
        "A single guide-less ring puts faces around a live metric. `startAngle` rotates the whole formation off the 12 o'clock axis, and the built-in counter-rotation keeps every avatar upright for the full lap.",
      install: {
        registryItem: "orbit",
      },
      code: `<Orbit aria-label="Teammates on call" className="size-64">
  <div className="flex flex-col items-center">
    <span className="font-display text-3xl font-semibold tabular-nums text-fg">04</span>
    <span className="text-xs text-fg-tertiary">on call</span>
  </div>
  <OrbitRing radius={96} duration={30} guide={false} startAngle={45}>
    {team.map((member) => (
      <OrbitItem key={member.name}>
        <span
          title={member.name}
          className="grid size-9 place-items-center rounded-full border border-border bg-surface-overlay text-xs font-medium text-fg-secondary shadow-xs"
        >
          {member.initials}
        </span>
      </OrbitItem>
    ))}
  </OrbitRing>
</Orbit>`,
      preview: (
        <Orbit aria-label="Teammates on call" className="size-64">
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl font-semibold tabular-nums text-fg">04</span>
            <span className="text-xs text-fg-tertiary">on call</span>
          </div>
          <OrbitRing radius={96} duration={30} guide={false} startAngle={45}>
            {orbitOnCall.map((member) => (
              <OrbitItem key={member.name}>
                <span
                  title={member.name}
                  className="grid size-9 place-items-center rounded-full border border-border bg-surface-overlay text-xs font-medium text-fg-secondary shadow-xs"
                >
                  {member.initials}
                </span>
              </OrbitItem>
            ))}
          </OrbitRing>
        </Orbit>
      ),
    },
  ],
  terminal: [
    {
      id: "install-session",
      title: "Install session",
      description:
        "A scripted install session: commands type in char-by-char behind the prompt with a blinking block cursor, outputs fade in after a beat of execution time, and loop replays it. The copy button copies just the joined commands. Reduced-motion visitors get the finished transcript instantly.",
      install: {
        registryItem: "terminal",
      },
      code: `<Terminal
  title="zsh"
  loop
  lines={[
    { type: "input", text: "npx kronus-ui add terminal" },
    { type: "output", text: "✔ 1 component installed" },
    { type: "output", text: "  src/components/ui/terminal.tsx" },
    { type: "input", text: "bun run dev" },
    { type: "output", text: "ready in 312 ms" },
  ]}
/>`,
      preview: (
        <Terminal
          title="zsh"
          loop
          motionPreference="always"
          className="w-full max-w-xl"
          lines={[
            { type: "input", text: "npx kronus-ui add terminal" },
            { type: "output", text: "✔ 1 component installed" },
            { type: "output", text: "  src/components/ui/terminal.tsx" },
            { type: "input", text: "bun run dev" },
            { type: "output", text: "ready in 312 ms" },
          ]}
        />
      ),
    },
    {
      id: "static-log",
      title: "Static, chrome-less log",
      description:
        "Without the traffic-light bar the copy button floats over the corner, and motionPreference of never renders the finished transcript with no animation — exactly what reduced-motion visitors see.",
      install: {
        registryItem: "terminal",
      },
      code: `<Terminal
  chrome={false}
  motionPreference="never"
  lines={[
    { type: "input", text: "kronus deploy --prod" },
    { type: "output", text: "Build completed in 8.2s" },
    { type: "output", text: "Deployed to https://app.kronus.com" },
  ]}
/>`,
      preview: (
        <Terminal
          chrome={false}
          motionPreference="never"
          className="w-full max-w-xl"
          lines={[
            { type: "input", text: "kronus deploy --prod" },
            { type: "output", text: "Build completed in 8.2s" },
            { type: "output", text: "Deployed to https://app.kronus.com" },
          ]}
        />
      ),
    },
  ],
  ripple: [
    {
      id: "pulse",
      title: "Pulse",
      description:
        "Concentric rings expand from the centre and fade out. Reduced-motion visitors see the surface with no animation.",
      code: `<Ripple className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Now live</p>
</Ripple>`,
      preview: (
        <Ripple className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <p className="font-display text-2xl text-fg">Now live</p>
        </Ripple>
      ),
    },
  ],
  meteors: [
    {
      id: "field",
      title: "Shooting stars",
      description:
        "Thin trails drift diagonally across the surface. Positions are derived from the meteor index, so server and client paint the same field.",
      code: `<Meteors className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Launch window</p>
</Meteors>`,
      preview: (
        <Meteors className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <p className="font-display text-2xl text-fg">Launch window</p>
        </Meteors>
      ),
    },
  ],
  "dot-pattern": [
    {
      id: "field",
      title: "Dotted field",
      description: "A faint SVG dotted field. Colour inherits currentColor from the wrapper.",
      code: `<DotPattern className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Quiet texture</p>
</DotPattern>`,
      preview: (
        <DotPattern className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <p className="font-display text-2xl text-fg">Quiet texture</p>
        </DotPattern>
      ),
    },
  ],
  "grid-pattern": [
    {
      id: "field",
      title: "Grid field",
      description: "A faint SVG grid behind content. Colour inherits currentColor.",
      code: `<GridPattern className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Blueprint</p>
</GridPattern>`,
      preview: (
        <GridPattern className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <p className="font-display text-2xl text-fg">Blueprint</p>
        </GridPattern>
      ),
    },
  ],
  "retro-grid": [
    {
      id: "floor",
      title: "Perspective floor",
      description:
        "A receding grid floor that scrolls toward the horizon. Reduced-motion visitors keep the floor, without the scroll.",
      code: `<RetroGrid className="grid min-h-64 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Horizon</p>
</RetroGrid>`,
      preview: (
        <RetroGrid className="grid min-h-64 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <p className="font-display text-2xl text-fg">Horizon</p>
        </RetroGrid>
      ),
    },
  ],
  noise: [
    {
      id: "grain",
      title: "Film grain",
      description: "A still SVG turbulence overlay. No animation — analog depth, not flicker.",
      code: `<Noise className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Print</p>
</Noise>`,
      preview: (
        <Noise className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <p className="font-display text-2xl text-fg">Print</p>
        </Noise>
      ),
    },
  ],
  "light-rays": [
    {
      id: "shafts",
      title: "Light shafts",
      description:
        "A rotating conic gradient masked into volumetric shafts. Paused under reduced motion.",
      code: `<LightRays className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Dawn</p>
</LightRays>`,
      preview: (
        <LightRays className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <p className="font-display text-2xl text-fg">Dawn</p>
        </LightRays>
      ),
    },
  ],
  "progressive-blur": [
    {
      id: "edge",
      title: "Edge fade",
      description:
        "Stacked backdrop-blur that fades a scroll region into the chrome. Place it over overflowing content.",
      code: `<div className="relative h-48 w-full overflow-hidden rounded-2xl border border-border bg-surface-raised">
  <div className="h-full overflow-y-auto p-4 pb-16">
    <p className="text-sm text-fg-secondary">
      Scroll under the blur. The band is decorative and sits on the edge of the region.
    </p>
    <p className="mt-4 text-sm text-fg-secondary">More copy so the panel actually scrolls.</p>
    <p className="mt-4 text-sm text-fg-secondary">Keep going — the fade holds the last lines.</p>
    <p className="mt-4 text-sm text-fg-secondary">Last line of the stack.</p>
  </div>
  <ProgressiveBlur side="bottom" />
</div>`,
      preview: (
        <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-border bg-surface-raised">
          <div className="h-full overflow-y-auto p-4 pb-16">
            <p className="text-sm text-fg-secondary">
              Scroll under the blur. The band is decorative and sits on the edge of the region.
            </p>
            <p className="mt-4 text-sm text-fg-secondary">
              More copy so the panel actually scrolls.
            </p>
            <p className="mt-4 text-sm text-fg-secondary">
              Keep going — the fade holds the last lines.
            </p>
            <p className="mt-4 text-sm text-fg-secondary">Last line of the stack.</p>
          </div>
          <ProgressiveBlur side="bottom" />
        </div>
      ),
    },
  ],
  "flickering-grid": [
    {
      id: "signal",
      title: "Signal grid",
      description:
        "Cells flicker on independent, index-derived timings so SSR and the client match. Reduced-motion visitors get a still, faint grid.",
      code: `<FlickeringGrid className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Signal</p>
</FlickeringGrid>`,
      preview: (
        <FlickeringGrid className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <p className="font-display text-2xl text-fg">Signal</p>
        </FlickeringGrid>
      ),
    },
  ],
  "star-border": [
    {
      id: "twinkle",
      title: "Twinkle border",
      description:
        "Two sparkle heads chase each other around the perimeter. Distinct from BorderBeam, which is a comet trail.",
      code: `<StarBorder className="rounded-2xl border border-border bg-surface-raised p-8">
  <p className="font-display text-xl text-fg">Featured</p>
</StarBorder>`,
      preview: (
        <StarBorder className="w-full max-w-sm rounded-2xl border border-border bg-surface-raised p-8">
          <p className="font-display text-xl text-fg">Featured</p>
        </StarBorder>
      ),
    },
  ],
  "shiny-text": [
    {
      id: "sheen",
      title: "Sheen",
      description:
        "A metallic sheen sweeps across live text. Reduced-motion visitors see the resting fill.",
      code: `<ShinyText className="font-display text-4xl">Ship the surface</ShinyText>`,
      preview: <ShinyText className="font-display text-4xl">Ship the surface</ShinyText>,
    },
  ],
  highlighter: [
    {
      id: "mark",
      title: "Marker",
      description:
        "A marker stroke draws in behind a phrase. The words stay in the accessibility tree; the mark is decorative.",
      code: `<p className="font-display text-3xl text-fg">
  Build the <Highlighter>product surface</Highlighter> first.
</p>`,
      preview: (
        <p className="font-display text-3xl text-fg">
          Build the <Highlighter>product surface</Highlighter> first.
        </p>
      ),
    },
  ],
  "spinning-text": [
    {
      id: "orbit",
      title: "Orbit",
      description:
        "The phrase is laid out around a circle. Assistive tech reads the original string once.",
      code: `<SpinningText radius={56}>kronus ui · product · </SpinningText>`,
      preview: <SpinningText radius={56}>kronus ui · product · </SpinningText>,
    },
  ],
  "sparkles-text": [
    {
      id: "twinkle",
      title: "Sparkles",
      description: "Twinkling sparkles around a phrase. Hidden under reduced motion.",
      code: `<SparklesText className="font-display text-4xl text-fg">Launch</SparklesText>`,
      preview: <SparklesText className="font-display text-4xl text-fg">Launch</SparklesText>,
    },
  ],
  "typing-text": [
    {
      id: "typewriter",
      title: "Typewriter",
      description:
        "Types, pauses, deletes, and moves to the next phrase. Reduced-motion visitors see the first phrase in full.",
      code: `<TypingText
  className="font-display text-3xl text-fg"
  text={["Design systems.", "Product surfaces.", "Copy you can upgrade."]}
/>`,
      preview: (
        <TypingText
          className="font-display text-3xl text-fg"
          text={["Design systems.", "Product surfaces.", "Copy you can upgrade."]}
        />
      ),
    },
  ],
  "word-rotate": [
    {
      id: "cycle",
      title: "Word cycle",
      description:
        "Cycles through a list of words with a vertical swap. A polite live region announces the current word.",
      code: `<p className="font-display text-3xl text-fg">
  Ship <WordRotate words={["faster", "calmer", "on-brand"]} />.
</p>`,
      preview: (
        <p className="font-display text-3xl text-fg">
          Ship <WordRotate words={["faster", "calmer", "on-brand"]} />.
        </p>
      ),
    },
  ],
  "scramble-text": [
    {
      id: "decrypt",
      title: "Decrypt",
      description:
        "Random glyphs lock in left-to-right. Assistive tech gets the resolved phrase immediately.",
      code: `<ScrambleText className="font-display text-3xl text-fg">kronus-ui</ScrambleText>`,
      preview: <ScrambleText className="font-display text-3xl text-fg">kronus-ui</ScrambleText>,
    },
  ],
  "glare-hover": [
    {
      id: "glare",
      title: "Pointer glare",
      description:
        "A diagonal glare tracks the pointer. Position is written to CSS variables, so pointer motion never re-renders React.",
      code: `<GlareHover className="rounded-2xl border border-border bg-surface-raised p-8">
  <p className="font-display text-xl text-fg">Hover the surface</p>
</GlareHover>`,
      preview: (
        <GlareHover className="w-full max-w-sm rounded-2xl border border-border bg-surface-raised p-8">
          <p className="font-display text-xl text-fg">Hover the surface</p>
        </GlareHover>
      ),
    },
  ],
  "click-spark": [
    {
      id: "burst",
      title: "Click burst",
      description: "Click anywhere on the wrapper to emit sparks from the pointer.",
      code: `<ClickSpark className="grid min-h-40 place-items-center rounded-2xl border border-border bg-surface-raised">
  <Button>Click me</Button>
</ClickSpark>`,
      preview: (
        <ClickSpark className="grid min-h-40 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <Button>Click me</Button>
        </ClickSpark>
      ),
    },
  ],
  "animated-list": [
    {
      id: "stagger",
      title: "Staggered list",
      description:
        "Children enter with a short rise and fade. Pass the item body, not an li — the component wraps each child.",
      code: `<AnimatedList className="w-full max-w-sm">
  <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
    Deploy finished
  </div>
  <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
    Invite accepted
  </div>
  <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
    Invoice paid
  </div>
</AnimatedList>`,
      preview: (
        <AnimatedList className="w-full max-w-sm">
          <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
            Deploy finished
          </div>
          <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
            Invite accepted
          </div>
          <div className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-fg">
            Invoice paid
          </div>
        </AnimatedList>
      ),
    },
  ],
  "card-stack": [
    {
      id: "fan",
      title: "Fanned stack",
      description:
        "Click or press Space / ArrowRight on the front card to send it to the back. Labels can be localized.",
      code: `<CardStack
  items={[
    { id: "one", content: <p className="font-display text-lg">Northwind</p> },
    { id: "two", content: <p className="font-display text-lg">Contoso</p> },
    { id: "three", content: <p className="font-display text-lg">Adventure Works</p> },
  ]}
/>`,
      preview: (
        <CardStack
          items={[
            {
              id: "one",
              content: <p className="font-display text-lg text-fg">Northwind</p>,
            },
            {
              id: "two",
              content: <p className="font-display text-lg text-fg">Contoso</p>,
            },
            {
              id: "three",
              content: <p className="font-display text-lg text-fg">Adventure Works</p>,
            },
          ]}
        />
      ),
    },
  ],
  "pill-nav": [
    {
      id: "pills",
      title: "Sliding pill",
      description:
        "A compact nav row whose active item is marked by a sliding pill. Arrow keys move selection.",
      code: `<PillNav
  aria-label="Product sections"
  items={[
    { value: "overview", label: "Overview" },
    { value: "pricing", label: "Pricing" },
    { value: "docs", label: "Docs" },
  ]}
/>`,
      preview: (
        <PillNav
          aria-label="Product sections"
          items={[
            { value: "overview", label: "Overview" },
            { value: "pricing", label: "Pricing" },
            { value: "docs", label: "Docs" },
          ]}
        />
      ),
    },
  ],
  "expandable-tabs": [
    {
      id: "icons",
      title: "Expanding tabs",
      description:
        "Icon tabs where the active item expands to reveal its label. Inactive labels stay available to assistive tech.",
      code: `<ExpandableTabs
  items={[
    { value: "home", label: "Home", icon: <Home /> },
    { value: "search", label: "Search", icon: <Search /> },
    { value: "settings", label: "Settings", icon: <Settings /> },
  ]}
/>`,
      preview: (
        <ExpandableTabs
          items={[
            { value: "home", label: "Home", icon: <Home /> },
            { value: "search", label: "Search", icon: <Search /> },
            { value: "settings", label: "Settings", icon: <Settings /> },
          ]}
        />
      ),
    },
  ],
  "dynamic-island": [
    {
      id: "live",
      title: "Live activity",
      description:
        "A compact pill that morphs between views. The dots are a tablist; the shell resizes with a spring.",
      code: `<DynamicIsland
  views={[
    { id: "idle", label: "Idle", content: <span className="text-sm">Kronus</span> },
    {
      id: "now",
      label: "Now playing",
      content: <span className="text-sm">Shipping the surface</span>,
    },
  ]}
/>`,
      preview: (
        <DynamicIsland
          views={[
            { id: "idle", label: "Idle", content: <span className="text-sm">Kronus</span> },
            {
              id: "now",
              label: "Now playing",
              content: <span className="text-sm">Shipping the surface</span>,
            },
          ]}
        />
      ),
    },
  ],
  confetti: [
    {
      id: "burst",
      title: "Burst",
      description:
        "Click anywhere on the wrapper to fire a burst from the pointer. A no-op under reduced motion.",
      code: `<Confetti className="grid min-h-40 place-items-center rounded-2xl border border-border bg-surface-raised">
  <Button>Celebrate</Button>
</Confetti>`,
      preview: (
        <Confetti className="grid min-h-40 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <Button>Celebrate</Button>
        </Confetti>
      ),
    },
  ],
  particles: [
    {
      id: "field",
      title: "Drifting field",
      description: "A calm 2D particle field. Canvas-only, no WebGL. Undrawn under reduced motion.",
      code: `<Particles className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Atmosphere</p>
</Particles>`,
      preview: (
        <Particles className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
          <p className="font-display text-2xl text-fg">Atmosphere</p>
        </Particles>
      ),
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function PremiumExamples({ slug }: { slug: string }) {
  return <ExampleList examples={premiumExamples[slug] ?? []} />;
}
