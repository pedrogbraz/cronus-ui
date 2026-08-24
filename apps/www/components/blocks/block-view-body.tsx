"use client";

import { Check, ChevronRight, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ResolvedBlockVariation } from "../../lib/blocks/resolve";
import { CodeBlock } from "../docs/code-block";
import { Eyebrow } from "../showcase-ui";
import { BlockPreview } from "./block-preview";
import { InstallTabs } from "./install-tabs";

/**
 * Presentational single-variant block view. It receives the already resolved
 * variation (loaded from the lazily-imported family chunk), so the heavy
 * preview JSX lives in that chunk and this shared shell renders the docs,
 * install tabs, source and the sticky live preview pane.
 */
export function BlockViewBody({
  slug,
  resolved,
}: {
  slug: string;
  resolved: ResolvedBlockVariation;
}) {
  const { meta, variant: selectedVariant } = resolved;
  const markdown = `# ${meta.name} — ${selectedVariant.name}\n\n${selectedVariant.description}\n\n## Usage\n\n\`\`\`tsx\n${selectedVariant.code}\n\`\`\`\n`;
  const preview = <BlockPreview>{selectedVariant.preview}</BlockPreview>;

  return (
    <div className="2xl:grid 2xl:grid-cols-[minmax(28rem,38rem)_minmax(0,1fr)]">
      {/* Left — docs */}
      <div className="px-6 py-10 sm:px-10 lg:py-16">
        <div className="mx-auto max-w-3xl 2xl:max-w-xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-fg-tertiary"
          >
            <Link
              href="/blocks"
              className="rounded outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              Blocks
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <Link
              href={`/blocks/${slug}`}
              className="rounded outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              {meta.name}
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-fg-secondary">{selectedVariant.name}</span>
          </nav>

          <Eyebrow className="mt-8">{meta.category}</Eyebrow>
          <h1 className="mt-3 font-display text-5xl font-normal tracking-[-0.03em] text-fg">
            {selectedVariant.name}
          </h1>
          <p className="mt-4 text-lg text-fg-secondary">{selectedVariant.description}</p>

          <div className="mt-6">
            <CopyMarkdownButton markdown={markdown} />
          </div>
        </div>

        <div className="mx-auto mt-10 min-h-[34rem] max-w-7xl overflow-hidden rounded-2xl border border-border/60 2xl:hidden">
          {preview}
        </div>

        <div className="mx-auto max-w-3xl 2xl:max-w-xl">
          <section className="mt-14">
            <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">
              Installation
            </h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Install with the CLI, or add the packages and paste the source below.
            </p>

            <div className="mt-6">
              <h3 className="font-display text-base font-medium text-fg">CLI</h3>
              <p className="mt-1.5 text-sm text-fg-secondary">
                Add <span className="font-medium text-fg">{meta.name}</span> to your app with its
                source-owned dependencies.
              </p>
              <div className="mt-3">
                <CodeBlock code={`npx cooud-ui add ${slug}`} language="bash" />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-display text-base font-medium text-fg">Manual</h3>
              <p className="mt-1.5 text-sm text-fg-secondary">
                Install the Cooud UI packages, then paste the block below.
              </p>
              <div className="mt-3">
                <InstallTabs packages="@cooud-ui/ui @cooud-ui/tokens @cooud-ui/theme" />
              </div>
            </div>
          </section>

          <section className="mt-12 pb-8">
            <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">Usage</h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Copy the source for{" "}
              <span className="font-medium text-fg">{selectedVariant.name}</span>. Every class is a
              semantic token, so it re-themes with your app.
            </p>
            <div className="mt-4">
              <CodeBlock code={selectedVariant.code} expandable />
            </div>
          </section>
        </div>
      </div>

      {/* Right — sticky live preview */}
      <div className="hidden border-border/60 2xl:sticky 2xl:top-16 2xl:block 2xl:h-[calc(100vh-4rem)] 2xl:border-l">
        <div className="h-full">{preview}</div>
      </div>
    </div>
  );
}

function CopyMarkdownButton({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3.5 py-2 text-sm text-fg-secondary outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
    >
      {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      {copied ? "Copied" : "Copy as Markdown"}
    </button>
  );
}
