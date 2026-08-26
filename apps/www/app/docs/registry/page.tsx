import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
} from "../../../components/docs/documentation";
import { absoluteUrl } from "../../../lib/site-url";

const registryFlow = [
  {
    title: "Generate",
    description:
      "The registry is generated from real @cronus-ui/ui component sources, keeping docs, packages, and copy-paste output aligned.",
  },
  {
    title: "Resolve",
    description:
      "When you add a component, registry dependencies are expanded so required primitives come with it.",
  },
  {
    title: "Rewrite",
    description:
      "Imports are rewritten to your configured aliases, such as @/components/ui and @/lib/cn.",
  },
  {
    title: "Diff",
    description: "The diff command exposes local drift before teams upgrade copied components.",
  },
] as const;

const buildCommand = `bun run -F cronus-ui registry
pnpm dlx cronus-ui@latest list --registry ./registry
pnpm dlx cronus-ui@latest add button card --registry ./registry`;

const shadcnAddCommand = `npx shadcn@latest add ${absoluteUrl("/r/button.json")}`;

const registryItem = `{
  "name": "button",
  "type": "registry:ui",
  "files": ["components/ui/button.tsx"],
  "dependencies": ["@radix-ui/react-slot", "class-variance-authority"],
  "registryDependencies": []
}`;

export default function RegistryPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Registry"
        title="Own the code without forking the design system"
        description="The registry turns package source into copyable component files, preserving dependencies and local aliases for every app."
      />

      <DocsSection title="Flow">
        <DocsGrid columns={2}>
          {registryFlow.map((step) => (
            <DocsCard key={step.title} title={step.title} description={step.description} />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Local registry"
        description="Use a local registry path when developing or testing component changes before publishing."
      >
        <CodeBlock code={buildCommand} language="bash" />
      </DocsSection>

      <DocsSection
        title="Use with the shadcn CLI"
        description="The registry also speaks the shadcn registry spec, so any shadcn-compatible tool can install Cronus UI without the cronus-ui CLI."
      >
        <CodeBlock code={shadcnAddCommand} language="bash" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Every item is served at <InlineCode>/r/&lt;name&gt;.json</InlineCode>, with the full index
          at <InlineCode>/r/registry.json</InlineCode>. Registry dependencies resolve back to this
          registry automatically, and imports are rewritten to your{" "}
          <InlineCode>components.json</InlineCode> aliases.
        </p>
      </DocsSection>

      <DocsSection
        title="Registry item shape"
        description="Each item records files, npm dependencies, and other registry items required by the component."
      >
        <CodeBlock code={registryItem} language="json" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          The CLI reads <InlineCode>cronus-ui.json</InlineCode> before writing files, so copied
          components follow the receiving app's folder structure.
        </p>
      </DocsSection>
    </div>
  );
}
