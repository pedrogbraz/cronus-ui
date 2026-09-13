import { CodeBlock } from "../../components/docs/code-block";
import {
  DocsHeader,
  DocsSection,
  DocsTextLink,
  InlineCode,
  PrimaryLink,
} from "../../components/docs/documentation";
import { KernelPreview } from "../../components/language/kernel-preview";
import {
  CRONUS_CATALOG_FAMILIES,
  CRONUS_CATALOG_ORIGIN,
  CRONUS_CATALOG_RUN,
  CRONUS_CATALOG_SOURCE,
} from "../../lib/cronus-language";

export default function LanguagePage() {
  const dedicated = CRONUS_CATALOG_FAMILIES.filter((item) => item.kind === "dedicated").length;
  const interact = CRONUS_CATALOG_FAMILIES.filter((item) => item.kind === "interact").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <DocsHeader
        eyebrow="Language"
        title=".cronus catalog"
        description="The same widget families as the React catalog, declared in Cronus. The kernel emits HTML, --cronus-* tokens, and motion. There is no JSX, CVA, or Radix in the source."
      >
        <PrimaryLink href={`${CRONUS_CATALOG_ORIGIN}/kit`}>Open live kit</PrimaryLink>
        <DocsTextLink href="/components">React catalog</DocsTextLink>
      </DocsHeader>

      <DocsSection
        title="Live kernel"
        description={`${CRONUS_CATALOG_FAMILIES.length} families on this shelf — ${dedicated} dedicated CONTRACT ports, ${interact} native interact. Charts and FX stay off this page until they have their own renderer.`}
      >
        <KernelPreview />
      </DocsSection>

      <DocsSection
        title="Declare, don't paste HTML"
        description="A component names a family. The kernel picks the renderer. style:primary without button+ is still the legacy Obsidian button."
      >
        <CodeBlock code={CRONUS_CATALOG_SOURCE} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Run the catalog from the kernel repo. Default port is <InlineCode>5311</InlineCode>.
        </p>
        <CodeBlock code={CRONUS_CATALOG_RUN} language="bash" expandable />
      </DocsSection>

      <DocsSection
        title="Families on the shelf"
        description="Dedicated means a CONTRACT HTML module (button, input, dialog…). Interact means native HTML in the kernel, not a data-slot stub."
      >
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CRONUS_CATALOG_FAMILIES.map((item) => (
            <li
              key={item.family}
              className="flex items-center justify-between rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm"
            >
              <span className="font-mono text-fg">{item.family}</span>
              <span className="text-xs text-fg-tertiary">
                {item.kind === "dedicated" ? "Dedicated" : "Interact"}
              </span>
            </li>
          ))}
        </ul>
      </DocsSection>
    </div>
  );
}
