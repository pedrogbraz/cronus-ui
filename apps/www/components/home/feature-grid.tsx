import {
  Accessibility,
  Blocks,
  Layers,
  type LucideIcon,
  Palette,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import type { ReactNode } from "react";
import { Eyebrow, SectionGlow } from "../showcase-ui";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: ReactNode;
}

const FEATURES: Feature[] = [
  {
    icon: Palette,
    title: "Token-driven",
    body: "Every component reads semantic tokens. Change one and the whole app re-themes live — no re-render.",
  },
  {
    icon: Accessibility,
    title: "Accessible by default",
    body: "WCAG-minded, axe-tested, full keyboard + focus-visible rings on every interactive element.",
  },
  {
    icon: TerminalSquare,
    title: "Own your code",
    body: (
      <>
        <code className="rounded bg-surface-overlay px-1 py-0.5 font-mono text-[0.85em] text-fg">
          npx cooud-ui add &lt;component&gt;
        </code>{" "}
        copies real source into your repo. No black-box lock-in.
      </>
    ),
  },
  {
    icon: Blocks,
    title: "Blocks, not just primitives",
    body: "Full, composable sections — marketing, dashboards, auth — ready to drop in.",
  },
  {
    icon: Sparkles,
    title: "AI Kit included",
    body: (
      <>
        Ships an{" "}
        <code className="rounded bg-surface-overlay px-1 py-0.5 font-mono text-[0.85em] text-fg">
          AGENTS.md
        </code>{" "}
        doctrine + skills so your coding agent uses the system correctly from the first prompt.
      </>
    ),
  },
  {
    icon: Layers,
    title: "Five crafted themes",
    body: "Aurora, Neutral, Midnight, Sunset, Emerald — each a full, considered palette. Or make your own.",
  },
];

/**
 * "Why Cooud UI" feature grid — a premium, token-driven homepage section that
 * surfaces the six defining strengths of the design system.
 *
 * Everything is driven by semantic design tokens (surfaces, foregrounds,
 * borders, brand gradients) so the section re-themes live alongside the rest of
 * the site. Each card lifts on hover with a strengthened border, a raised
 * surface, an accent-shifted icon tile, and a faint aurora glow.
 *
 * Exported as a named component and takes no props.
 */
export function FeatureGrid() {
  return (
    <section className="relative border-t border-border/60">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-3">
          <Eyebrow>Why Cooud UI</Eyebrow>
          <h2 className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl">
            Everything you need to ship a themeable product
          </h2>
          <p className="max-w-2xl text-fg-secondary">
            Accessible, own-your-code components and full blocks — wired to one semantic token
            system, with an AI Kit that teaches your agent the rules.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, body }: Feature) {
  return (
    <div className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-surface-raised p-6 shadow-xs transition-[transform,background-color,border-color] duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:border-border-strong hover:bg-surface-overlay">
      <div className="relative grid size-10 place-items-center rounded-xl border border-border bg-surface-inset text-fg-tertiary transition-colors duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:text-fg">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <h3 className="relative text-base font-medium text-fg">{title}</h3>
      <p className="relative text-sm leading-relaxed text-fg-secondary">{body}</p>
    </div>
  );
}
