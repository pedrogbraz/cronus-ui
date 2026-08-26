import { ArrowRight, Check, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, SectionGlow } from "../../components/showcase-ui";
import { CommandChip } from "../../components/templates/command-chip";
import { TemplateThumb } from "../../components/templates/template-thumb";
import { PRO_URL } from "../../lib/site-url";
import {
  appearanceLabel,
  isProTemplate,
  type TemplateCatalogEntry,
  templatesOssOfKind,
  templatesPro,
} from "../../lib/templates/catalog";

export const metadata: Metadata = {
  title: "Templates — Cronus UI",
  description:
    "Scaffold a themed product in one command. Live previews of composed apps — click through to the full site, or Open Preview for the real stage.",
};

export default function TemplatesPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-16">
      <SectionGlow />

      <header className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Eyebrow>Templates</Eyebrow>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl font-normal tracking-[-0.025em] text-fg sm:text-5xl sm:tracking-[-0.03em]">
                Start from a real app
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-fg-secondary">
                Live previews of composed Cronus blocks — themed, scrollable, the same stack install
                writes. Open a card, then Open Preview for the full site.
              </p>
            </div>
            <div className="inline-flex max-w-full items-center gap-3 overflow-hidden rounded-xl border border-border bg-surface-raised px-4 py-2.5 font-mono text-sm text-fg-secondary shadow-xs">
              <span className="text-fg-tertiary" aria-hidden="true">
                $
              </span>
              <span className="truncate">bunx create-cronus-app my-app --template saas</span>
            </div>
          </div>
        </div>
      </header>

      <TemplateGrid
        heading="Generated products"
        description="Default base plus compose: every page is installed blocks stacked in a main. This is the product loop."
        templates={templatesOssOfKind("product")}
      />

      <TemplateGrid
        heading="Pro pack"
        description="Mail, chat, and finance — extra composed apps. Everything above stays free. Pro only adds."
        templates={templatesPro()}
        href={PRO_URL}
        hrefLabel="What's in Pro"
      />

      <TemplateGrid
        heading="Landing pages"
        description="Named marketing looks composed from the same blocks as landing — swap the stack, keep the upgrade path. Click a card to open the live site."
        templates={templatesOssOfKind("landing")}
      />

      <TemplateGrid
        heading="Starters"
        description="Bundled directories when you want a smaller surface and will add pieces yourself."
        templates={templatesOssOfKind("starter")}
      />

      <p className="mx-auto max-w-7xl px-4 text-sm text-fg-tertiary sm:px-6 lg:px-8">
        Every template prompts for (or accepts) <code className="text-fg-secondary">--theme</code>{" "}
        and <code className="text-fg-secondary">--mode</code>, bakes your pick into the app, and
        ships a <code className="text-fg-secondary">cronus-ui.json</code> so the registry CLI works
        from the first commit.
      </p>

      <section aria-label="Keep building" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-raised p-8">
          <SectionGlow />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow>Keep building</Eyebrow>
              <h2 className="mt-3 font-display text-2xl font-normal tracking-[-0.02em] text-fg">
                Grow the app after you scaffold
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-fg-secondary">
                Add a route with <code className="text-fg">cronus-ui add-page</code>, switch presets
                with <code className="text-fg">theme set</code>, or pull a single primitive with{" "}
                <code className="text-fg">add</code>. Upstream fixes land through{" "}
                <code className="text-fg">upgrade</code> without wiping local edits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs/cli"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-inset px-4 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Sparkles className="size-4 text-fg-tertiary" aria-hidden="true" />
                CLI docs
              </Link>
              <Link
                href="/blocks"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-inset px-4 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
              >
                Browse blocks
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TemplateGrid({
  heading,
  description,
  templates,
  href,
  hrefLabel,
}: {
  heading: string;
  description: string;
  templates: TemplateCatalogEntry[];
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <section aria-label={heading} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex max-w-2xl flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-[-0.02em] text-fg">
            {heading}
          </h2>
          <p className="mt-2 text-sm leading-6 text-fg-secondary">{description}</p>
        </div>
        {href && hrefLabel ? (
          <Link
            href={href}
            className="shrink-0 text-sm font-medium text-fg outline-none hover:text-fg-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            {hrefLabel}
            <ArrowRight className="ms-1 inline size-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {templates.map((template) => (
          <article
            key={template.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong"
          >
            <div className="relative border-b border-border/60">
              <TemplateThumb entry={template} />
              <Link
                href={`/templates/${template.slug}`}
                className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="sr-only">View {template.name} template</span>
              </Link>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-raised/90 to-transparent px-4 py-3 opacity-0 transition-opacity duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-100"
              >
                <span className="text-xs font-medium text-fg">View template</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-6">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-normal tracking-[-0.02em] text-fg">
                    <Link
                      href={`/templates/${template.slug}`}
                      className="rounded outline-none hover:text-fg-secondary focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {template.name}
                    </Link>
                  </h3>
                  <span
                    className={
                      isProTemplate(template) || template.recommended
                        ? "shrink-0 rounded-full border border-border bg-surface-overlay px-2.5 py-0.5 text-xs font-medium text-fg"
                        : "shrink-0 rounded-full border border-border bg-surface-inset px-2.5 py-0.5 text-xs font-medium text-fg-tertiary"
                    }
                  >
                    {template.tagline}
                  </span>
                </div>
                <p className="mt-1 text-xs text-fg-tertiary">{appearanceLabel(template)}</p>
                <p className="mt-2 text-sm leading-6 text-fg-secondary">{template.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
                  What's inside
                </h4>
                <ul className="mt-3 flex flex-col gap-2">
                  {template.inside.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-fg-secondary">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-fg-tertiary"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <CommandChip command={template.command} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
