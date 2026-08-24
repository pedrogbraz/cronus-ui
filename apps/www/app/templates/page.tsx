import { CopyButton } from "@cooud-ui/ui";
import {
  ArrowRight,
  Check,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, SectionGlow } from "../../components/showcase-ui";

export const metadata: Metadata = {
  title: "Templates — Cooud UI",
  description:
    "Complete Next.js starters built with Cooud UI: a single-page starter, a multi-page dashboard, and a marketing landing site. Scaffold any of them with one command.",
};

interface TemplateEntry {
  slug: "default" | "dashboard" | "marketing";
  name: string;
  tagline: string;
  description: string;
  icon: typeof LayoutTemplate;
  /** What the scaffolded app ships with. */
  inside: string[];
  /** The exact command shown in the card (and written to the clipboard). */
  command: string;
}

const TEMPLATES: TemplateEntry[] = [
  {
    slug: "default",
    name: "Default",
    tagline: "Single-page starter",
    description:
      "The smallest useful app: one page wired with the theme provider, anti-flash script, and a sample of metrics, a table, and cards to build from.",
    icon: LayoutTemplate,
    inside: [
      "One page: metric cards, orders table, invite card",
      "CooudUIProvider + anti-flash CooudThemeScript",
      "Tailwind v4 + token CSS pre-wired",
      "cooud-ui.json so `npx cooud-ui add` just works",
    ],
    command: "bunx create-cooud-app my-app",
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    tagline: "Multi-page app shell",
    description:
      "A real application skeleton: an icon-collapsible sidebar shell with route-aware nav, a KPI + chart + data-table overview, and a settings page of forms.",
    icon: LayoutDashboard,
    inside: [
      "AppShell + Sidebar chrome with light/dark toggle",
      "Overview: KPI metrics, revenue chart, orders DataTable",
      "Settings: profile, workspace & notification forms",
      "recharts + @tanstack/react-table patterns included",
    ],
    command: "bunx create-cooud-app my-app --template dashboard",
  },
  {
    slug: "marketing",
    name: "Marketing",
    tagline: "Landing site",
    description:
      "A complete landing page composed from real blocks: hero, feature grid, pricing, testimonials, FAQ, and a waitlist capture with a joined state.",
    icon: Megaphone,
    inside: [
      "Sticky header, hero & feature grid",
      "Pricing tiers with a featured card",
      "Testimonials grid + FAQ accordion",
      "Waitlist CTA (the only client island) + footer",
    ],
    command: "bunx create-cooud-app my-app --template marketing",
  },
];

/** The exact command, as a flat divided row with a copy action. */
function CommandChip({ command }: { command: string }) {
  return (
    <div className="flex items-center gap-2 border-t border-border pt-4">
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg-secondary">
        <span className="select-none text-fg-tertiary">$ </span>
        {command}
      </code>
      <CopyButton
        value={command}
        size="icon-sm"
        className="shrink-0 text-fg-tertiary transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg"
        copyLabel="Copy scaffold command"
      />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <SectionGlow />

      {/* Header */}
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Eyebrow>Templates</Eyebrow>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl font-normal tracking-[-0.025em] text-fg sm:text-5xl sm:tracking-[-0.03em]">
                Start from a real app
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-fg-secondary">
                Complete Next.js starters composed from the same components and blocks in this
                showcase. Pick a template, pick a theme, and you're editing product code in under a
                minute.
              </p>
            </div>
            <div className="inline-flex max-w-full items-center gap-3 overflow-hidden rounded-xl border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-fg-secondary shadow-xs">
              <span className="text-fg-tertiary" aria-hidden="true">
                $
              </span>
              <span className="truncate">bunx create-cooud-app my-app</span>
            </div>
          </div>
        </div>
      </header>

      {/* Template cards */}
      <section
        aria-label="Available templates"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {TEMPLATES.map((template) => (
            <article
              key={template.slug}
              className="flex flex-col rounded-2xl border border-border bg-surface-raised transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong"
            >
              {/* Thumbnail strip */}
              <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-t-2xl border-b border-border/60 bg-surface-inset">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(var(--cooud-border)_1px,transparent_1px)] opacity-40 [background-size:16px_16px]"
                />
                <template.icon className="relative size-7 text-fg-tertiary" aria-hidden="true" />
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-xl font-normal tracking-[-0.02em] text-fg">
                      {template.name}
                    </h2>
                    <span className="shrink-0 rounded-full border border-border bg-surface-inset px-2.5 py-0.5 text-xs font-medium text-fg-tertiary">
                      {template.tagline}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-fg-secondary">{template.description}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
                    What's inside
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {template.inside.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-fg-secondary">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-fg-tertiary"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <CommandChip command={template.command} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-fg-tertiary">
          Every template prompts for (or accepts) <code className="text-fg-secondary">--theme</code>{" "}
          and <code className="text-fg-secondary">--mode</code>, bakes your pick into the app, and
          ships a <code className="text-fg-secondary">cooud-ui.json</code> so the registry CLI works
          from the first commit.
        </p>
      </section>

      {/* Keep building */}
      <section aria-label="Keep building" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-raised p-8">
          <SectionGlow />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow>Keep building</Eyebrow>
              <h2 className="mt-3 font-display text-2xl font-normal tracking-[-0.02em] text-fg">
                Grow the app after you scaffold
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-fg-secondary">
                Templates are a starting point — pull in any component from the registry, or paste
                whole sections from the block gallery the same way these starters were built.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/components"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-inset px-4 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Sparkles className="size-4 text-fg-tertiary" aria-hidden="true" />
                Browse components
              </Link>
              <Link
                href="/blocks"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-inset px-4 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
              >
                Browse blocks
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
