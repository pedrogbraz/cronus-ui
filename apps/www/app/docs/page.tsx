import { Badge } from "@cronus-ui/ui";
import { CodeBlock } from "../../components/docs/code-block";
import {
  DocCallout,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  DocsTextLink,
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

const agentSurfaces = [
  {
    title: "llms.txt",
    description:
      "The agent catalog: site, docs, every component (with example counts), every block (with variant ids), OSS templates, packages, and MCP setup. Generated from the live indices — drop the URL in a prompt.",
    href: "/llms.txt",
    action: "Open /llms.txt",
    native: true,
  },
  {
    title: "llms-full.txt",
    description:
      "The same corpus inlined: every guide and component doc, plus block pages. Use when the agent needs APIs and examples in one fetch.",
    href: "/llms-full.txt",
    action: "Open /llms-full.txt",
    native: true,
  },
  {
    title: "MCP server",
    description:
      "Hosted Streamable HTTP at /mcp (read-only catalog) or npx -y cronus-ui-mcp over stdio (read + write). Snippets for Claude, Cursor, VS Code, Codex, Grok, v0, Lovable, Bolt.",
    href: "/docs/mcp",
    action: "Wire the MCP server",
    native: false,
  },
] as const;

const llmsFetchCode = `curl -s https://aicronus.com/llms.txt
# or, locally:  curl -s http://localhost:4747/llms.txt`;

export default function DocsOverviewPage() {
  const onMain = CHANGELOG_ENTRIES.find((entry) => entry.status === "In development");
  const latest = CHANGELOG_ENTRIES.find((entry) => entry.status === "Released");
  if (latest === undefined) {
    throw new Error("CHANGELOG_ENTRIES must include a Released entry");
  }

  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Build production interfaces with Cronus UI"
        description="Cronus UI is a product UI system. One command composes a themed SaaS from validated blocks. Catalog, registry, and Create studio are the pieces."
      >
        <PrimaryLink href="/docs/getting-started">Get started</PrimaryLink>
        <SecondaryLink href="/create">Open Create</SecondaryLink>
        <SecondaryLink href="/llms.txt" native>
          llms.txt
        </SecondaryLink>
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

      <DocsSection
        title="For coding agents"
        description="Fetch the live catalog, or wire the MCP server. Both read the committed indices — not a hand-written list."
      >
        <DocsGrid>
          {agentSurfaces.map((surface) => (
            <DocsCard
              key={surface.title}
              title={surface.title}
              description={surface.description}
              href={surface.href}
              action={surface.action}
              native={surface.native}
            />
          ))}
        </DocsGrid>
        <div className="mt-6">
          <CodeBlock code={llmsFetchCode} language="bash" />
        </div>
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Per-page markdown lives under{" "}
          <DocsTextLink href="/llms/components/button.md">/llms/components/button.md</DocsTextLink>{" "}
          and <DocsTextLink href="/llms/blocks/login.md">/llms/blocks/login.md</DocsTextLink>.
          Visual taste: <DocsTextLink href="/docs/design">DESIGN.md</DocsTextLink>.
        </p>
      </DocsSection>

      {onMain ? (
        <DocsSection title="On main">
          <div className="border-t border-border pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{onMain.version}</Badge>
              <Badge variant="secondary">{onMain.status}</Badge>
              <span className="text-sm tabular-nums text-fg-tertiary">{onMain.date}</span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] text-fg">
              {onMain.title}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-fg-secondary">{onMain.summary}</p>
            <p className="mt-3 text-sm text-fg-secondary">
              Full list on the <DocsTextLink href="/changelog">changelog</DocsTextLink>.
            </p>
          </div>
        </DocsSection>
      ) : null}

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
