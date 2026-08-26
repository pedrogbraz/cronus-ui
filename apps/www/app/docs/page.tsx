import { Badge } from "@cronus-ui/ui";
import {
  DocCallout,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  PrimaryLink,
  SecondaryLink,
} from "../../components/docs/documentation";
import { CHANGELOG_ENTRIES, INSTALL_OPTIONS } from "../../lib/docs";

const foundations = [
  {
    title: "Tokens",
    description:
      "@cronus-ui/tokens owns semantic colors, radius, fonts, chart colors, CSS variables, and Tailwind v4 mappings.",
  },
  {
    title: "Theme provider",
    description:
      "@cronus-ui/theme applies presets and runtime overrides with CSS variables, so theme changes do not require component rewrites.",
  },
  {
    title: "Component catalog",
    description:
      "@cronus-ui/ui ships accessible primitives and composed patterns built with variants, focus states, and data-slot markers.",
  },
  {
    title: "Registry",
    description:
      "The CLI copies source-owned components into an app, resolves dependencies, and rewrites imports to local aliases.",
  },
] as const;

export default function DocsOverviewPage() {
  const latest =
    CHANGELOG_ENTRIES.find((entry) => entry.status === "Released") ?? CHANGELOG_ENTRIES[0];

  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Build production interfaces with Cronus UI"
        description="Cronus UI is a product UI system. One command composes a themed SaaS from validated blocks. Catalog, registry, and Create studio are the pieces."
      >
        <PrimaryLink href="/docs/getting-started">Get started</PrimaryLink>
        <SecondaryLink href="/create">Open Create</SecondaryLink>
      </DocsHeader>

      <DocsSection
        title="Project contract"
        description="The library is designed around semantic tokens, accessible primitives, and source-owned registry output."
      >
        <DocsGrid columns={2}>
          {foundations.map((item) => (
            <DocsCard key={item.title} title={item.title} description={item.description} />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Choose your path"
        description="Scaffold a SaaS with one command. Create Studio, Stack Builder, and the CLI remain for theme, stack, and existing apps."
      >
        <DocsGrid>
          {INSTALL_OPTIONS.map((option) => (
            <DocsCard
              key={option.title}
              title={option.title}
              description={option.description}
              href={option.href}
              action={option.action}
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection title="Current release">
        {/* Flat ledger row rather than a card: the hairline carries the break,
            matching the changelog timeline. */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{latest.version}</Badge>
            <Badge variant="secondary">{latest.status}</Badge>
            <span className="text-sm tabular-nums text-fg-tertiary">{latest.date}</span>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] text-fg">
            {latest.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-fg-secondary">{latest.summary}</p>
        </div>
      </DocsSection>

      <DocCallout title="Release discipline" tone="success">
        New components should land with docs, registry metadata, accessibility notes, and a
        changelog entry before they are considered ready for app adoption.
      </DocCallout>
    </div>
  );
}
