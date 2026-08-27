import { CronusUIProvider } from "@cronus-ui/theme";
import { type ThemeName, themes } from "@cronus-ui/tokens";
import { Badge, Button, Input } from "@cronus-ui/ui";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, SectionGlow } from "../../components/showcase-ui";
import { DEFAULT_CONFIG, encodeConfigParam } from "../../lib/create/presets";
import type { DesignConfig } from "../../lib/create/types";
import { absoluteUrl } from "../../lib/site-url";
import { CopyCommand } from "./copy-command";

export const metadata: Metadata = {
  title: "Themes — Cronus UI",
  description:
    "The five built-in Cronus UI themes, plus shareable custom themes: design one in the Create Studio, share the permalink, and anyone applies it with `npx cronus-ui theme add`.",
};

/** `{ ...DEFAULT_CONFIG }` with a per-theme patch — the Studio config each card encodes. */
function studioConfig(style: string, patch: Partial<DesignConfig>): DesignConfig {
  return { ...DEFAULT_CONFIG, style, ...patch };
}

interface ThemeCard {
  name: ThemeName;
  label: string;
  tagline: string;
  /** Closest Create Studio recipe for this look — the card's remix/share payload. */
  studio: DesignConfig;
}

const CARDS: ThemeCard[] = [
  {
    name: "aurora",
    label: "Aurora",
    tagline: "The flagship theme — luminous sky blue over deep zinc surfaces.",
    studio: studioConfig("Aurora", { baseColor: "zinc", headingFont: "geist", bodyFont: "geist" }),
  },
  {
    name: "neutral",
    label: "Neutral",
    tagline: "Quiet monochrome — zero chroma, all contrast, dashboard-calm.",
    studio: studioConfig("Neutral", {
      brand: "blue",
      chart: "neutral",
      headingFont: "inter",
      bodyFont: "inter",
    }),
  },
  {
    name: "midnight",
    label: "Midnight",
    tagline: "Premium and atmospheric — deep indigo into violet on slate.",
    studio: studioConfig("Midnight", {
      baseColor: "slate",
      brand: "violet",
      headingFont: "geist",
      bodyFont: "geist",
    }),
  },
  {
    name: "sunset",
    label: "Sunset",
    tagline: "Energetic warmth — amber into rose over stone surfaces.",
    studio: studioConfig("Sunset", {
      baseColor: "stone",
      brand: "amber",
      chart: "warm",
      headingFont: "geist",
      bodyFont: "geist",
    }),
  },
  {
    name: "emerald",
    label: "Emerald",
    tagline: "Fresh green into teal — phosphor accents on near-black.",
    studio: studioConfig("Emerald", { brand: "emerald", headingFont: "geist", bodyFont: "geist" }),
  },
];

/** A non-preset example config so the "share a custom theme" chip is real and runnable. */
const EXAMPLE_STUDIO_CONFIG = studioConfig("Custom", {
  baseColor: "slate",
  brand: "teal",
  radius: 20,
});

/**
 * Representative swatches per theme, derived from each preset's own tokens —
 * the same primary-token pattern the Live theming lab uses, widened to a
 * six-chip palette strip.
 */
function paletteOf(name: ThemeName): { label: string; value: string }[] {
  const tokens = themes[name].dark;
  return [
    { label: "Primary", value: tokens.primary },
    { label: "Accent", value: tokens.accent },
    { label: "Surface", value: tokens.surfaceBase },
    { label: "Overlay", value: tokens.surfaceOverlay },
    { label: "Foreground", value: tokens.fg },
    { label: "Muted", value: tokens.fgMuted },
  ];
}

/**
 * One built-in theme card: palette strip, a live component strip rendered
 * inside a scoped (non-asRoot) <CronusUIProvider> — the provider wraps its
 * subtree in a `data-cronus-theme` div, so each card is themed independently of
 * the ambient site theme — plus the two distribution actions.
 */
function ThemeCardView({ card }: { card: ThemeCard }) {
  const token = encodeConfigParam(card.studio);
  const studioPath = `/create?c=${token}`;

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-border bg-surface-raised p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-medium text-fg">{card.label}</h3>
          <p className="mt-1 text-sm text-fg-secondary">{card.tagline}</p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 size-4 shrink-0 rounded-full shadow-xs ring-1 ring-inset ring-border"
          style={{ backgroundColor: themes[card.name].dark.primary }}
        />
      </div>

      <ul className="flex items-center gap-1.5" aria-label={`${card.label} palette`}>
        {paletteOf(card.name).map((swatch) => (
          <li key={swatch.label}>
            <span
              title={`${swatch.label}: ${swatch.value}`}
              className="block size-6 rounded-full shadow-xs ring-1 ring-inset ring-border"
              style={{ backgroundColor: swatch.value }}
            />
            <span className="sr-only">
              {swatch.label}: {swatch.value}
            </span>
          </li>
        ))}
      </ul>

      <CronusUIProvider
        defaultThemeName={card.name}
        defaultModeName="dark"
        className="overflow-hidden rounded-xl border border-border"
      >
        <div className="flex flex-wrap items-center gap-2.5 bg-surface-base p-4">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Badge variant="success">Live</Badge>
          <Input
            placeholder="you@cronus.dev"
            aria-label={`Input preview in the ${card.label} theme`}
            className="h-8 w-full min-w-0 flex-1 sm:w-36"
          />
        </div>
      </CronusUIProvider>

      <div className="mt-auto flex flex-col gap-3">
        <CopyCommand command={`npx cronus-ui theme add "${absoluteUrl(studioPath)}"`} />
        <Link
          href={studioPath}
          className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-primary-strong outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          Open in Create Studio
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

const SHARE_STEPS = [
  {
    title: "Design it",
    body: "Open the Create Studio and tune base, brand, charts, type, and radius. The URL keeps up as you go — that ?c= token is the whole theme.",
  },
  {
    title: "Share it",
    body: "Copy the /create?c=… permalink, or export the JSON config. No registry, no publish step — the link is the distribution format.",
  },
  {
    title: "Apply it",
    body: "Anyone runs theme add with your link: the CLI decodes it offline and writes a marked override block into their globals.css. Re-running replaces the block.",
  },
];

export default function ThemesPage() {
  const exampleCommand = `npx cronus-ui theme add "${absoluteUrl(
    `/create?c=${encodeConfigParam(EXAMPLE_STUDIO_CONFIG)}`,
  )}"`;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <header className="relative border-b border-border/60">
        <SectionGlow />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Eyebrow>Themes</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-normal tracking-[-0.025em] text-fg sm:text-5xl sm:tracking-[-0.03em]">
            Every look, one command away
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-fg-secondary">
            Five built-in presets ship with every install — and any theme you build in the Create
            Studio travels as a plain permalink. Paste it into{" "}
            <code className="rounded-md border border-border bg-surface-inset px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
              cronus-ui theme add
            </code>{" "}
            and the CLI materializes it in your app.
          </p>
        </div>
      </header>

      <section
        aria-labelledby="built-in-themes"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2
          id="built-in-themes"
          className="font-display text-2xl font-normal tracking-[-0.02em] text-fg"
        >
          The built-in presets
        </h2>
        <p className="mt-2 max-w-2xl text-fg-secondary">
          Switch between them any time with{" "}
          <code className="font-mono text-sm text-fg">npx cronus-ui theme set &lt;name&gt;</code>.
          Each card also carries its closest Create Studio recipe — copy the command to apply that
          remix, or open it in the Studio and make it yours.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {CARDS.map((card) => (
            <ThemeCardView key={card.name} card={card} />
          ))}
        </div>
      </section>

      <section aria-labelledby="custom-themes" className="relative border-t border-border/60">
        <SectionGlow />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Eyebrow>Custom themes</Eyebrow>
          <h2
            id="custom-themes"
            className="mt-3 font-display text-3xl font-normal tracking-[-0.025em] text-fg"
          >
            The Studio is the registry
          </h2>
          <p className="mt-4 max-w-2xl text-fg-secondary">
            A Create Studio theme is just a compact token in the URL. That makes every permalink a
            distribution channel: post it in your team chat, a README, or a design doc — applying it
            is one command.
          </p>

          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {SHARE_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised p-6"
              >
                <span aria-hidden="true" className="font-mono text-sm text-fg-tertiary">
                  {index + 1}
                </span>
                <h3 className="font-display text-base font-medium text-fg">{step.title}</h3>
                <p className="text-sm leading-relaxed text-fg-secondary">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex max-w-2xl flex-col gap-4">
            <p className="text-sm text-fg-secondary">
              Try it with a shared example — slate surfaces, a teal brand, 20px radius:
            </p>
            <CopyCommand command={exampleCommand} />
            <p className="text-sm text-fg-secondary">
              Exported a JSON config instead? The same command takes a file path:{" "}
              <code className="font-mono text-sm text-fg">
                npx cronus-ui theme add ./my-theme.json
              </code>
            </p>
            <Link
              href="/create"
              className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-primary-strong outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              Build your own in the Create Studio
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
