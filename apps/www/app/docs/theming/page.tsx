import { Button } from "@cronus-ui/ui";
import { ArrowRight, Palette } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocCallout,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";
import { STYLE_PRESETS } from "../../../lib/create/presets";

const providerCode = `import "@cronus-ui/tokens/styles.css";
import { CronusUIProvider } from "@cronus-ui/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CronusUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
          {children}
        </CronusUIProvider>
      </body>
    </html>
  );
}`;

const themeScriptCode = `import { CronusThemeScript, CronusUIProvider } from "@cronus-ui/theme";

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the script mutates <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <CronusThemeScript
          storageKey="theme"
          defaultThemeName="aurora"
          defaultModeName="dark"
        />
      </head>
      <body>
        <CronusUIProvider asRoot storageKey="theme">
          {children}
        </CronusUIProvider>
      </body>
    </html>
  );
}`;

const overridesCode = `import { useTheme } from "@cronus-ui/theme";

export function BrandThemeControls() {
  const { setOverrides } = useTheme();

  return (
    <button
      type="button"
      onClick={() =>
        setOverrides({
          radius: "16px",
          primary: "oklch(0.685 0.169 237.3)",
          chart1: "oklch(0.685 0.169 237.3)",
          fontDisplay: "Inter, sans-serif"
        })
      }
    >
      Apply brand theme
    </button>
  );
}`;

const lookCode = `<div data-cronus-look="glass" data-cronus-theme="midnight" data-cronus-mode="dark">
  {/* Look + mode on the same node. Palette is still midnight. */}
</div>`;

const layers = [
  {
    title: "Semantic tokens",
    description: "Components consume surface, foreground, border, ring, primary, and chart tokens.",
  },
  {
    title: "Preset bundles",
    description:
      "A preset combines mode, base color, brand color, chart palette, fonts, and radius.",
  },
  {
    title: "Looks",
    description:
      "Material language — default, brutalist, glass — via data-cronus-look. Orthogonal to palette. Docs chrome stays default.",
  },
  {
    title: "Runtime overrides",
    description:
      "Apps can override tokens at runtime without recompiling Tailwind or changing component code.",
  },
] as const;

export default function ThemingPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Theming"
        title="Theme the whole system through tokens"
        description="Cronus UI treats theme as a design-system object: color ramps, brand accents, chart colors, typography, and radius move together."
      >
        <PrimaryLink href="/create">Build a preset</PrimaryLink>
        <PrimaryLink href="/docs/design">DESIGN.md</PrimaryLink>
      </DocsHeader>

      {/* Live Create Studio callout — a quick path to the interactive preset builder.
          Flattened out of its tinted card: the header rule above already separates
          it, so the row needs no box and no decorative gradient. The button is a
          genuine primary action, which is where colour still earns its keep. */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-inset text-fg-tertiary"
          >
            <Palette className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-lg font-medium text-fg">
              Prefer to play? Try Create Studio
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-fg-secondary">
              Pick a preset, tune colors and type, and watch the preview re-theme in real time —
              then copy the CSS overrides.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/create">
            Open Create Studio
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <DocsSection title="Theme layers">
        <DocsGrid>
          {layers.map((layer) => (
            <DocsCard key={layer.title} title={layer.title} description={layer.description} />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Looks"
        description="Material language on top of the palette. Default, brutalist, and glass share the same components. The docs chrome stays default — set the attribute on the product subtree."
      >
        <CodeBlock code={lookCode} language="tsx" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Try the live stage on the homepage. Theme and look compose: glass + midnight is valid,
          brutalist + sunset is valid.
        </p>
      </DocsSection>

      <DocsSection
        title="Provider"
        description="Import tokens once, then wrap the app in the provider at the framework root."
      >
        <CodeBlock code={providerCode} language="tsx" expandable />
      </DocsSection>

      <DocsSection
        title="Avoiding a flash of the wrong theme"
        description="The provider restores a saved theme from localStorage after first paint, so a returning visitor can briefly see the default theme. Render CronusThemeScript in the document head to apply the saved theme before paint."
      >
        <CodeBlock code={themeScriptCode} language="tsx" expandable />
        <DocCallout title="Pass the same storageKey to both">
          The script and <InlineCode>CronusUIProvider</InlineCode> must share the same{" "}
          <InlineCode>storageKey</InlineCode>. Add <InlineCode>suppressHydrationWarning</InlineCode>{" "}
          to <InlineCode>&lt;html&gt;</InlineCode> because the script changes its attributes before
          hydration. Under a strict CSP, forward a <InlineCode>nonce</InlineCode> to{" "}
          <InlineCode>CronusThemeScript</InlineCode>.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="Runtime overrides"
        description="Use runtime overrides for brand portals, per-tenant styling, previews, or Create-generated presets."
      >
        <CodeBlock code={overridesCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          The Create studio exports the same values as preset JSON and CSS variables, so teams can
          store a design system and reapply it later.
        </p>
      </DocsSection>

      <DocsSection
        title="Preset catalog"
        description="These are the cohesive presets available in Create today."
      >
        <DocsGrid columns={2}>
          {STYLE_PRESETS.map((preset) => (
            <DocsCard
              key={preset.id}
              title={preset.name}
              description={preset.description}
              badge={`${preset.config.mode} / ${preset.config.radius}px`}
            >
              <p className="text-xs uppercase tracking-widest text-fg-tertiary">
                <InlineCode>{preset.config.baseColor}</InlineCode>{" "}
                <InlineCode>{preset.config.brand}</InlineCode>{" "}
                <InlineCode>{preset.config.chart}</InlineCode>
              </p>
            </DocsCard>
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Design tool handoff"
        description="The token source also compiles to design-tool formats — generated and drift-checked alongside tokens.json, and shipped with @cronus-ui/tokens."
      >
        <DocsGrid columns={2}>
          <DocsCard
            title="W3C DTCG tokens"
            description="Every theme and mode in the Design Tokens Community Group format, grouped cronus.{theme}.{mode}.{token}, for pipelines like Style Dictionary or Tokens Studio. Colors stay as the source oklch() strings; shadows are structured shadow objects; font stacks are family arrays."
            badge="tokens.dtcg.json"
          >
            <p className="text-xs text-fg-tertiary">
              <InlineCode>@cronus-ui/tokens/tokens.dtcg.json</InlineCode>
            </p>
          </DocsCard>
          <DocsCard
            title="Figma Variables"
            description="One Cronus UI collection with ten {theme}-{mode} modes for Figma Variables plugins or the REST API. Colors are converted to sRGB hex (gamut-clamped, self-checked at build time); radius is a px FLOAT; fonts and shadows are STRING values."
            badge="figma-variables.json"
          >
            <p className="text-xs text-fg-tertiary">
              <InlineCode>@cronus-ui/tokens/figma-variables.json</InlineCode>
            </p>
          </DocsCard>
        </DocsGrid>
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Gradients are intentionally not in either file — the{" "}
          <InlineCode>bg-gradient-*</InlineCode> utilities derive from{" "}
          <InlineCode>primary</InlineCode>/<InlineCode>accent</InlineCode> at runtime, so they
          re-theme on their own.
        </p>
      </DocsSection>
    </div>
  );
}
