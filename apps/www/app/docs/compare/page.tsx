import type { Metadata } from "next";
import {
  DocsHeader,
  DocsSection,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";

export const metadata: Metadata = {
  title: "Kronus UI compared",
  description:
    "How Kronus UI sits next to shadcn/ui, HeroUI, and Aceternity: distribution, live theming, product generation, source ownership, AI, a11y gates, and the registry protocol.",
};

const rows = [
  {
    dimension: "Distribution",
    kronus: "npm package (@kronus-ui/ui) and copy-in via the CLI",
    shadcn: "Copy-in",
    heroui: "Installed package",
    aceternity: "Copy-in (some via shadcn CLI namespace)",
  },
  {
    dimension: "Live theming",
    kronus: "5 themes × light/dark, CSS variables, no re-render",
    shadcn: "Utility classes you restyle",
    heroui: "Built-in look",
    aceternity: "Tailwind / Motion, not a token runtime",
  },
  {
    dimension: "Product generation",
    kronus: "compose templates store, landing, saas; upgrade without losing edits",
    shadcn: "You assemble",
    heroui: "No",
    aceternity: "Marketing templates and sections, not a composed app",
  },
  {
    dimension: "Source ownership",
    kronus: "CLI copy-in + 3-way upgrade, incl. composed pages",
    shadcn: "Copy-in",
    heroui: "Package lock-in",
    aceternity: "Copy-in, no 3-way upgrade",
  },
  {
    dimension: "AI",
    kronus: "AI Kit + MCP that composes apps, adds pages, installs, and themes",
    shadcn: "Official MCP",
    heroui: "MCP + llms.txt",
    aceternity: "Copy-prompt on components, not compose/add-page/theme",
  },
  {
    dimension: "A11y gates",
    kronus: "axe on catalog routes, contrast across 10 theme × mode combos, mechanical contract",
    shadcn: "Radix primitives",
    heroui: "React Aria",
    aceternity: "Marketing-first, no CI contract",
  },
  {
    dimension: "Registry protocol",
    kronus: "Speaks the shadcn spec at /r/*",
    shadcn: "Is the spec",
    heroui: "Separate",
    aceternity: "Some items via @aceternity on the shadcn CLI; separate library",
  },
] as const;

const whereEachWins = [
  {
    title: "shadcn/ui",
    body: "Wins the ecosystem and the default path for coding agents. If the job is “add a dialog the way every agent already knows,” shadcn is that protocol.",
  },
  {
    title: "HeroUI",
    body: "Wins beauty out of the box. An installed look, React Aria primitives, and a distinctive visual default with no token work required.",
  },
  {
    title: "Aceternity",
    body: "Wins motion and landing-page effects. Copy-paste React + Tailwind + Motion marketing sections — not a live token runtime, and not compose of a multi-page app.",
  },
  {
    title: "Kronus UI",
    body: "Wins theme-as-system, compose, a mechanical contract, and dual distribution. Not a shadcn fork — it speaks the spec, then layers a live theme, product generation, and 3-way upgrade of source and composed pages.",
  },
] as const;

export default function ComparePage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Kronus UI compared"
        description="Kronus UI next to shadcn/ui, HeroUI, and Aceternity. It speaks the shadcn registry spec — it is not a fork. The layer above is the product: live theming, compose, a mechanical contract, and npm plus copy-in."
      >
        <PrimaryLink href="/docs/getting-started">Get started</PrimaryLink>
      </DocsHeader>

      <DocsSection
        title="Side by side"
        description="Facts about distribution, theming, generation, ownership, AI, accessibility gates, and the registry protocol. No download counts."
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
            <caption className="border-b border-border px-4 py-3 text-left text-sm text-fg-secondary">
              Kronus UI, shadcn/ui, HeroUI, and Aceternity compared on distribution, theming,
              product generation, source ownership, AI, accessibility gates, and registry protocol.
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface-raised text-xs uppercase tracking-wider text-fg-tertiary">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Dimension
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium text-fg">
                  Kronus UI
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  shadcn/ui
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  HeroUI
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Aceternity
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.dimension} className="border-b border-border last:border-b-0">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-4 py-3 align-top font-medium text-fg"
                  >
                    {row.dimension}
                  </th>
                  <td className="px-4 py-3 align-top text-fg">{row.kronus}</td>
                  <td className="px-4 py-3 align-top text-fg">{row.shadcn}</td>
                  <td className="px-4 py-3 align-top text-fg">{row.heroui}</td>
                  <td className="px-4 py-3 align-top text-fg">{row.aceternity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          The registry is served at <InlineCode>/r/&lt;name&gt;.json</InlineCode> with the index at{" "}
          <InlineCode>/r/registry.json</InlineCode>, so a shadcn-compatible CLI can install Kronus
          items without forking either tool.
        </p>
      </DocsSection>

      <DocsSection
        title="Where each wins"
        description="None of the four is better in every way. Pick the layer you actually need."
      >
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {whereEachWins.map((item) => (
            <div key={item.title} className="border-t border-border pt-6">
              <h3 className="font-display text-base font-medium text-fg">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-fg-secondary">{item.body}</p>
            </div>
          ))}
        </div>
      </DocsSection>
    </div>
  );
}
