"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@cronus-ui/ui";
import { type ChartPageDoc, componentAnchor, getChartDocs } from "../../lib/charts-docs";
import type { PropsDoc } from "../../lib/props.generated";
import { CodeBlock } from "./code-block";
import { PropsTable } from "./props-table";

const PACKAGE_MANAGERS = [
  { id: "bun", label: "bun", command: (packages: string) => `bun add ${packages}` },
  { id: "pnpm", label: "pnpm", command: (packages: string) => `pnpm add ${packages}` },
  { id: "npm", label: "npm", command: (packages: string) => `npm install ${packages}` },
  { id: "yarn", label: "yarn", command: (packages: string) => `yarn add ${packages}` },
] as const;

function toPropsDoc(doc: ChartPageDoc["components"][number]): PropsDoc {
  return {
    interfaceName: `${doc.name}Props`,
    props: doc.props.map((prop) => ({
      name: prop.name,
      type: prop.type,
      required: prop.required ?? false,
      description: prop.description,
      default: prop.default,
    })),
  };
}

function SectionHeading({
  id,
  title,
  description,
  level = 2,
}: {
  id: string;
  title: string;
  description?: string;
  level?: 2 | 3;
}) {
  const className =
    level === 2
      ? "font-display text-xl font-medium tracking-[-0.02em] text-fg"
      : "font-display text-lg font-medium tracking-[-0.02em] text-fg";
  const Tag = level === 2 ? "h2" : "h3";

  return (
    <>
      <Tag id={id} className={`${className} scroll-mt-24`}>
        {title}
      </Tag>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-fg-secondary">{description}</p>
      ) : null}
    </>
  );
}

export function ChartInstallation({ slug, defaultName }: { slug: string; defaultName: string }) {
  const doc = getChartDocs(slug);
  if (!doc) return null;

  const motionImport = `import { ${doc.motionImports.join(", ")} } from "@cronus-ui/ui/charts";`;
  const defaultImport = `import { ${defaultName} } from "@cronus-ui/ui";`;

  return (
    <section id="installation" className="mt-16 scroll-mt-24">
      <SectionHeading
        id="installation-heading"
        title="Installation"
        description="Default is a ready-made wrapper from the registry. Motion is the composable engine at @cronus-ui/ui/charts (peer visx + motion)."
      />
      <Tabs defaultValue="default" className="mt-4 gap-4">
        <TabsList aria-label="Chart engine" className="w-fit">
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="motion">Motion</TabsTrigger>
        </TabsList>
        <TabsContent value="default" className="mt-0 space-y-3">
          <CodeBlock code={`npx cronus-ui add ${slug}`} language="bash" />
          <CodeBlock code={defaultImport} />
        </TabsContent>
        <TabsContent value="motion" className="mt-0 space-y-3">
          <CodeBlock code={motionImport} />
          <p className="text-sm text-fg-secondary">
            Motion charts are already in <code className="font-mono text-fg">@cronus-ui/ui</code>.
            Install the visx / d3 peers listed under Dependencies.
          </p>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export function ChartReference({ slug }: { slug: string }) {
  const doc = getChartDocs(slug);
  if (!doc) return null;

  return (
    <div className="mt-16 flex flex-col gap-16">
      <section id="usage" className="scroll-mt-24">
        <SectionHeading title="Usage" id="usage-heading" description={doc.usageNote} />
        <Tabs defaultValue="motion" className="mt-4 gap-4">
          <TabsList aria-label="Usage engine" className="w-fit">
            <TabsTrigger value="motion">Motion</TabsTrigger>
            <TabsTrigger value="default">Default</TabsTrigger>
          </TabsList>
          <TabsContent value="motion" className="mt-0">
            <CodeBlock code={doc.motionUsage} expandable />
          </TabsContent>
          <TabsContent value="default" className="mt-0">
            <CodeBlock code={doc.defaultUsage} expandable />
          </TabsContent>
        </Tabs>
      </section>

      <section id="components" className="scroll-mt-24">
        <SectionHeading
          title="Components"
          id="components-heading"
          description="Motion API — compose these under the chart root. Default wrapper props are in Default API below."
        />
        <div className="mt-8 flex flex-col gap-10">
          {doc.components.map((component) => (
            <div key={component.name} id={componentAnchor(component.name)} className="scroll-mt-24">
              <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-fg">
                {component.name}
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm text-fg-secondary">{component.description}</p>
              <div className="mt-4">
                <PropsTable docs={[toPropsDoc(component)]} hideHeading />
              </div>
            </div>
          ))}
        </div>
      </section>

      {(doc.extraSections ?? []).map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <SectionHeading
            title={section.title}
            id={`${section.id}-heading`}
            description={section.description}
          />
          {section.code ? (
            <div className="mt-4">
              <CodeBlock code={section.code} expandable />
            </div>
          ) : null}
        </section>
      ))}

      <section id="data-format" className="scroll-mt-24">
        <SectionHeading
          title="Data format"
          id="data-format-heading"
          description={doc.dataFormatNote}
        />
        <div className="mt-4">
          <CodeBlock code={doc.dataFormat} language="ts" expandable />
        </div>
      </section>

      <section id="theming" className="scroll-mt-24">
        <SectionHeading title="Theming" id="theming-heading" />
        <p className="mt-3 max-w-2xl text-sm leading-6 text-fg-secondary">{doc.theming}</p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-fg-secondary">
          Full token reference:{" "}
          <a href="/docs/theming" className="text-fg underline-offset-4 hover:underline">
            Theming
          </a>
          .
        </p>
      </section>

      <section id="dependencies" className="scroll-mt-24">
        <SectionHeading
          title="Dependencies"
          id="dependencies-heading"
          description="Default needs the recharts peer. Motion needs visx (and sometimes d3) as optional peers — install only what this chart uses."
        />
        <div className="mt-4">
          <Tabs defaultValue="bun" className="gap-3">
            <TabsList aria-label="Package manager" className="w-fit overflow-x-auto">
              {PACKAGE_MANAGERS.map((manager) => (
                <TabsTrigger key={manager.id} value={manager.id}>
                  {manager.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {PACKAGE_MANAGERS.map((manager) => (
              <TabsContent key={manager.id} value={manager.id} className="mt-0 space-y-3">
                <CodeBlock code={manager.command("recharts")} language="bash" />
                <CodeBlock code={manager.command(doc.dependencies.join(" "))} language="bash" />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
}
