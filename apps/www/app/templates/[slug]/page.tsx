import { Check, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow } from "../../../components/showcase-ui";
import { CommandChip } from "../../../components/templates/command-chip";
import { TemplateDetail } from "../../../components/templates/template-detail";
import { PRO_URL } from "../../../lib/site-url";
import {
  appearanceLabel,
  getTemplate,
  isProTemplate,
  TEMPLATE_SLUGS,
} from "../../../lib/templates/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getTemplate(slug);
  return {
    title: entry ? `${entry.name} — Cronus UI Templates` : "Templates — Cronus UI",
    description: entry?.description,
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getTemplate(slug);
  if (!entry) notFound();

  return (
    <div className="pb-16">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-fg-tertiary"
          >
            <Link
              href="/templates"
              className="rounded outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              Templates
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-fg-secondary">{entry.name}</span>
          </nav>

          <Eyebrow className="mt-8">
            {isProTemplate(entry) ? "Pro pack" : entry.kind === "landing" ? "Landing" : entry.kind}
          </Eyebrow>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-4xl font-normal tracking-[-0.025em] text-fg sm:text-5xl sm:tracking-[-0.03em]">
                  {entry.name}
                </h1>
                <span
                  className={
                    entry.recommended
                      ? "rounded-full border border-border bg-surface-overlay px-2.5 py-0.5 text-xs font-medium text-fg"
                      : "rounded-full border border-border bg-surface-inset px-2.5 py-0.5 text-xs font-medium text-fg-tertiary"
                  }
                >
                  {entry.tagline}
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-lg text-fg-secondary">{entry.description}</p>
              {isProTemplate(entry) ? (
                <p className="mt-3 text-sm text-fg-tertiary">
                  Additive to OSS.{" "}
                  <a
                    href={PRO_URL}
                    className="text-fg-secondary underline underline-offset-4 hover:text-fg"
                  >
                    See what Pro adds
                  </a>
                  .
                </p>
              ) : null}
            </div>
            <p className="text-sm text-fg-tertiary">{appearanceLabel(entry)}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TemplateDetail entry={entry} />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface-raised p-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
            What's inside
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {entry.inside.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-fg-secondary">
                <Check className="mt-0.5 size-4 shrink-0 text-fg-tertiary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <CommandChip command={entry.command} />
          </div>
        </div>
      </section>
    </div>
  );
}
