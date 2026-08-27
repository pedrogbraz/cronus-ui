import { designMarkdown } from "@cronus-ui/tokens";
import type { Metadata } from "next";
import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocsHeader,
  DocsSection,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";

export const metadata: Metadata = {
  title: "DESIGN.md",
  description:
    "Visual taste for agents: Aurora is generated product, Neutral is docs chrome, looks are material. One primary fill. Hairline elevation.",
};

export default function DesignDocsPage() {
  const compact = designMarkdown({ format: "compact" });
  const extended = designMarkdown({ format: "extended" });

  return (
    <>
      <DocsHeader
        eyebrow="Taste"
        title="DESIGN.md"
        description="Visual rules an agent can follow: Aurora is generated product, Neutral is docs chrome, looks are material. One primary fill. Hairline elevation. No hex on components."
      >
        <PrimaryLink href="/llms/docs/design.md">Raw extended markdown</PrimaryLink>
        <PrimaryLink href="/llms/design.compact.md">Compact (prompt)</PrimaryLink>
        <PrimaryLink href="/themes">Themes</PrimaryLink>
      </DocsHeader>

      <DocsSection
        title="How to use it"
        description="Paste compact into a system prompt. Keep extended at the repo root (create-cronus-app and compose emit both). MCP get_design_context returns the same bytes."
      >
        <p className="max-w-3xl text-sm leading-6 text-fg-secondary">
          This is not a gallery of other brands. Values come from{" "}
          <InlineCode>@cronus-ui/tokens</InlineCode>, so the file cannot drift from the runtime
          theme.
        </p>
      </DocsSection>

      <DocsSection title="Compact" description="Fits a system prompt. Theme Aurora, look Default.">
        <CodeBlock code={compact} language="markdown" />
      </DocsSection>

      <DocsSection
        title="Extended"
        description="The repo file. Switch theme or look via MCP arguments."
      >
        <CodeBlock code={extended} language="markdown" expandable />
      </DocsSection>
    </>
  );
}
