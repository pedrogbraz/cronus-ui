import { Badge } from "@cooud-ui/ui";
import { getComponentDisplayName, getComponentMeta } from "../../lib/components-index";
import { getExampleSections } from "../../lib/examples/sections";
import { COMPONENT_PROPS } from "../../lib/props.generated";
import { Eyebrow } from "../showcase-ui";
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
  const toc = [
    { id: "import", title: "Import" },
    ...sections,
    ...(hasProps ? [{ id: "props", title: "Props" }] : []),
  ];

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_13rem]">
      <article className="min-w-0 py-10">
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

        <section id="import" className="mt-10 scroll-mt-24">
          <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">Import</h2>
          <div className="mt-4 flex flex-col gap-3">
            <CodeBlock code={`import { ${meta.importName ?? meta.name} } from "@cooud-ui/ui";`} />
            <CodeBlock code={`npx cooud-ui add ${slug}`} language="bash" />
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-12">
          <ComponentExamples slug={slug} displayName={displayName} />
        </div>

        {hasProps && propsDocs ? (
          <section id="props" className="mt-16 scroll-mt-24">
            <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">
              API Reference
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-fg-tertiary">
              Generated from the component's exported types.
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
