import { CodeBlock } from "../../components/docs/code-block";
import {
  Checklist,
  DocCallout,
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
  CRONUS_HOW_IT_WORKS,
  CRONUS_RULES,
} from "../../lib/cronus-language";

export default function LanguagePage() {
  const dedicated = CRONUS_CATALOG_FAMILIES.filter((item) => item.kind === "dedicated").length;
  const interact = CRONUS_CATALOG_FAMILIES.filter((item) => item.kind === "interact").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <DocsHeader
        eyebrow="Language"
        title=".cronus is the product"
        description="You declare app, theme, pages, and widgets in a .cronus file. The Rust kernel parses it and serves HTML, semantic tokens, and motion. There is no React in the running catalog — the React catalog on this site is the visual spec the kernel ports toward."
      >
        <PrimaryLink href={`${CRONUS_CATALOG_ORIGIN}/kit`} native>
          Open live kit
        </PrimaryLink>
        <DocsTextLink href="/components">React catalog</DocsTextLink>
      </DocsHeader>

      <DocsSection
        id="how-it-works"
        title="How it works"
        description="Three layers, no overlap. The file is the product. The kernel is the engine. The browser only receives HTML."
      >
        <ol className="grid gap-4 md:grid-cols-3">
          {CRONUS_HOW_IT_WORKS.map((item) => (
            <li key={item.step} className="rounded-xl border border-border bg-surface-raised p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
                Step {item.step}
              </p>
              <h3 className="mt-2 font-display text-lg tracking-[-0.02em] text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-fg-secondary">{item.body}</p>
            </li>
          ))}
        </ol>
      </DocsSection>

      <DocsSection
        id="run"
        title="How to run it"
        description="Two processes. The kernel catalog listens on IPv4 only — open 127.0.0.1, not localhost."
      >
        <DocCallout title="IPv4, not localhost">
          Brave and others resolve <InlineCode>localhost</InlineCode> to{" "}
          <InlineCode>::1</InlineCode>. The kernel binds <InlineCode>0.0.0.0:5311</InlineCode>. Use{" "}
          <InlineCode>http://127.0.0.1:5311/kit</InlineCode>. This page proxies that URL at{" "}
          <InlineCode>/language/kit</InlineCode> so the iframe is same-origin.
        </DocCallout>
        <div className="mt-6">
          <CodeBlock code={CRONUS_CATALOG_RUN} language="bash" expandable />
        </div>
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Default catalog port is <InlineCode>5311</InlineCode>. This docs site is{" "}
          <InlineCode>4747</InlineCode>. After <InlineCode>cronus run</InlineCode>, edit{" "}
          <InlineCode>app.cronus</InlineCode> and the kernel hot-reloads.
        </p>
      </DocsSection>

      <DocsSection
        id="declare"
        title="What you write"
        description="A component names a family. The kernel picks the renderer. Pages compose widgets with use, or dump the whole shelf with type:components."
      >
        <CodeBlock code={CRONUS_CATALOG_SOURCE} language="bash" expandable />
        <div className="mt-6">
          <Checklist items={CRONUS_RULES} />
        </div>
      </DocsSection>

      <DocsSection
        id="kit"
        title="Live kernel"
        description={`${CRONUS_CATALOG_FAMILIES.length} families on this shelf — ${dedicated} dedicated CONTRACT ports, ${interact} native interact. Charts and FX stay off this page until they have their own renderer.`}
      >
        <KernelPreview />
      </DocsSection>

      <DocsSection
        id="families"
        title="Families on the shelf"
        description="Dedicated is a CONTRACT HTML module in the kernel. Interact is native HTML without a dedicated module yet — still not a data-slot stub."
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
