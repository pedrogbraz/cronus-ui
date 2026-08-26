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
import {
  STACK_BUILDER_METADATA,
  STACK_SCHEMA,
  STACK_SCHEMA_EXAMPLE,
  STACK_SCHEMA_FIELD_SUMMARY,
} from "../../../lib/stack/schema";

const outputCards = [
  {
    title: "Generator command",
    description: "A deterministic create-kronus-stack command generated from the resolved stack.",
  },
  {
    title: "KICKOFF.md",
    description:
      "An agent briefing that records the mission, stack truth, repo map, commands, guardrails, and definition of done.",
  },
  {
    title: "stack.json",
    description:
      "A machine-readable snapshot that pins the schema version, sanitized name, generator, and resolved category selections.",
  },
] as const;

const schemaJson = JSON.stringify(STACK_SCHEMA, null, 2);
const schemaExampleJson = JSON.stringify(STACK_SCHEMA_EXAMPLE, null, 2);

export default function StackBuilderDocsPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Stack Builder"
        title="Compose a stack, then export the truth"
        description="The Stack Builder lets you choose web, backend, runtime, data, auth, UI, AI, MCP, deploy, and tooling layers with live compatibility checks."
      >
        <PrimaryLink href={STACK_BUILDER_METADATA.route}>Open Stack Builder</PrimaryLink>
      </DocsHeader>

      <div className="mt-8">
        <DocCallout title={STACK_BUILDER_METADATA.statusLabel}>
          {STACK_BUILDER_METADATA.generatorTruth} The generated command,{" "}
          <InlineCode>KICKOFF.md</InlineCode>, and <InlineCode>stack.json</InlineCode> are emitted
          from the same resolved stack contract.
        </DocCallout>
      </div>

      <DocsSection
        title="What it produces"
        description="Every artifact is derived from the same resolved stack, so docs, setup intent, and agent instructions stay aligned."
      >
        <DocsGrid>
          {outputCards.map((card) => (
            <DocsCard key={card.title} title={card.title} description={card.description} />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Generator truth"
        description="The builder emits commands for the generator package that lives in this monorepo and is released with the rest of Kronus UI."
      >
        <div className="rounded-xl border border-border bg-surface-raised p-5 text-sm leading-6 text-fg-secondary">
          <p>
            Package: <InlineCode>{STACK_BUILDER_METADATA.generatorPackage}</InlineCode>
          </p>
          <p className="mt-2">
            Repo status:{" "}
            {STACK_BUILDER_METADATA.generatorPackageExistsInRepo
              ? "generator package is present"
              : "generator package is not present"}
          </p>
          <p className="mt-2">
            User-facing status: <InlineCode>{STACK_BUILDER_METADATA.statusLabel}</InlineCode>
          </p>
        </div>
      </DocsSection>

      <DocsSection
        title="stack.json fields"
        description="The snapshot schema is intentionally small: root metadata plus resolved category values."
      >
        <div className="grid gap-3">
          {STACK_SCHEMA_FIELD_SUMMARY.map((field) => (
            <div
              key={field.field}
              className="rounded-lg border border-border bg-surface-raised p-4 text-sm"
            >
              <p className="font-mono text-fg">{field.field}</p>
              <p className="mt-2 leading-6 text-fg-secondary">{field.description}</p>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection
        title="Example snapshot"
        description="This mirrors the shape emitted by the builder output panel."
      >
        <CodeBlock code={schemaExampleJson} language="json" expandable />
      </DocsSection>

      <DocsSection
        title="Schema artifact"
        description="The schema lives in source so docs and future generator validation can share one contract."
      >
        <CodeBlock code={schemaJson} language="json" expandable />
      </DocsSection>
    </div>
  );
}
