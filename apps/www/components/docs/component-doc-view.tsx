import { Badge } from "@cronus-ui/ui";
import { chartDocsTocItems, isNamedChartSlug } from "../../lib/charts-docs";
import { getComponentDisplayName, getComponentMeta } from "../../lib/components-index";
import { getExampleSections } from "../../lib/examples/sections";
import { COMPONENT_PROPS } from "../../lib/props.generated";
import { Eyebrow } from "../showcase-ui";
import { ChartInstallation, ChartReference } from "./chart-docs";
import { CodeBlock } from "./code-block";
import { ComponentExamples } from "./component-examples";
import { PropsTable } from "./props-table";
import { Toc } from "./toc";

export function ComponentDocView({ slug }: { slug: string }) {
  const meta = getComponentMeta(slug);

  if (!meta) {
    return <div className="py-20 text-fg-tertiary">Unknown component: {slug}</div>;
  }

  // TOC + section anchors come from lightweight metadata (no preview modules),
  // so the eager example *families* (recharts, forms, overlays…) are never
  // pulled into this route — only the one family chunk loads, lazily, below.
  const sections = getExampleSections(slug);
  const displayName = getComponentDisplayName(meta.name);
  // The Props/API tables are auto-generated from the component's `*Props` types
  // (see lib/props.generated.ts) so they can't drift from the source. Only add
  // the section + anchor when there's something to document.
  const propsDocs = COMPONENT_PROPS[slug];
  const hasProps = (propsDocs?.length ?? 0) > 0;
  const namedChart = isNamedChartSlug(slug);
  const toc = namedChart
    ? [
        ...sections,
        ...chartDocsTocItems(slug),
        ...(hasProps ? [{ id: "props", title: "Default API" }] : []),
      ]
    : [
        { id: "import", title: "Import" },
        ...sections,
        ...(hasProps ? [{ id: "props", title: "Props" }] : []),
      ];

  return (
    <div className="grid gap-10 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1fr)_13rem] xl:overflow-clip">
      <article className="min-h-0 min-w-0 py-10 xl:overflow-y-auto xl:overscroll-contain">
        <Eyebrow>{meta.category}</Eyebrow>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="font-display text-4xl font-normal tracking-[-0.025em] text-fg">
            {displayName}
          </h1>
          {meta.rsc ? (
            <Badge
              variant="outline"
              title="Zero client JS — renders in React Server Components"
              className="text-fg-secondary"
            >
              Server Component
            </Badge>
          ) : null}
        </div>
        <p className="mt-3 max-w-2xl text-lg text-fg-secondary">{meta.description}</p>

        {namedChart ? null : (
          <section id="import" className="mt-10 scroll-mt-24">
            <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">Import</h2>
            <div className="mt-4 flex flex-col gap-3">
              <CodeBlock
                code={`import { ${meta.importName ?? meta.name} } from "@cronus-ui/ui";`}
              />
              <CodeBlock code={`npx cronus-ui add ${slug}`} language="bash" />
            </div>
          </section>
        )}

        <div className={`${namedChart ? "mt-10" : "mt-12"} flex flex-col gap-12`}>
          <ComponentExamples slug={slug} displayName={displayName} />
        </div>

        {namedChart ? (
          <>
            <ChartInstallation slug={slug} defaultName={meta.importName ?? meta.name} />
            <ChartReference slug={slug} />
          </>
        ) : null}

        {hasProps && propsDocs ? (
          <section id="props" className="mt-16 scroll-mt-24">
            <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">
              {namedChart ? "Default API" : "API Reference"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-fg-tertiary">
              {namedChart
                ? "Generated from the Default wrapper's exported types. Motion subcomponents are documented above."
                : "Generated from the component's exported types."}
            </p>
            <div className="mt-6">
              <PropsTable docs={propsDocs} />
            </div>
          </section>
        ) : null}
      </article>

      <Toc items={toc} />
    </div>
  );
}
