"use client";

import { ArrowRight, Check, Copy, FilePlus, PackagePlus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { Eyebrow, SectionGlow } from "../showcase-ui";

/**
 * A command block with a monospace `$`-prefixed command and a copy button.
 * Copies to the clipboard and shows a brief "copied" state.
 */
function CommandBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    void navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="flex w-full min-w-0 max-w-full items-center gap-2 border-t border-border pt-4 font-mono text-sm">
      <span aria-hidden="true" className="select-none text-fg-tertiary">
        $
      </span>
      <code className="min-w-0 flex-1 truncate text-fg">{command}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied to clipboard" : `Copy "${command}"`}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-tertiary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? (
          <Check className="size-4 text-fg" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

interface PathCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  command: string;
}

/** One of the "get started" paths: an icon, copy, and a copyable command. */
function PathCard({ icon, title, description, command }: PathCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-2xl border border-border bg-surface-raised p-6 shadow-xs">
      <div className="flex min-w-0 items-start gap-4">
        <span
          aria-hidden="true"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-inset text-fg-tertiary"
        >
          {icon}
        </span>
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>
          <p className="text-sm text-fg-secondary">{description}</p>
        </div>
      </div>
      <div className="mt-auto min-w-0">
        <CommandBlock command={command} />
      </div>
    </div>
  );
}

export function GetStarted() {
  return (
    <>
      {/* Part 1 — product loop: create → add-page → upgrade */}
      <section className="relative border-t border-border/60">
        <SectionGlow />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-3">
            <Eyebrow>Get started</Eyebrow>
            <h2 className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl">
              Compose a product, add a page, keep it
            </h2>
            <p className="max-w-2xl text-fg-secondary">
              One command composes a themed SaaS from validated blocks. Add a page when you need
              another route. Upgrade pulls the next release without losing local edits.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 gap-4 lg:grid-cols-3">
            <PathCard
              icon={<PackagePlus className="size-5" aria-hidden="true" />}
              title="Start a SaaS"
              description="A Next.js app composed from validated blocks — auth, dashboard shell, billing — plus theme and AI Kit."
              command="npx create-cronus-app my-app --template saas"
            />
            <PathCard
              icon={<FilePlus className="size-5" aria-hidden="true" />}
              title="Grow a page"
              description="Install blocks, write the route, and update chrome nav — a composed page, not a hand-rolled layout."
              command="npx cronus-ui add-page --route /faq --blocks faq,cta --nav FAQ"
            />
            <PathCard
              icon={<RefreshCw className="size-5" aria-hidden="true" />}
              title="Keep it"
              description="Dry-run first. Upgrade 3-way-merges primitives and composed pages without wiping local edits."
              command="npx cronus-ui upgrade --all --dry-run"
            />
          </div>

          <p className="mt-6 max-w-3xl text-sm text-fg-tertiary">
            Already have a repo?{" "}
            <code className="font-mono text-[0.85em] text-fg-secondary">npx cronus-ui init</code>{" "}
            then add. Prefer a stack?{" "}
            <Link href="/stack" className="text-fg-secondary underline underline-offset-4">
              Stack Builder
            </Link>{" "}
            or{" "}
            <code className="font-mono text-[0.85em] text-fg-secondary">
              bun create cronus-stack@latest
            </code>
            .
          </p>
        </div>
      </section>

      {/* Part 2 — final CTA band */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-2xl border border-border bg-surface-raised px-6 py-14 text-center sm:px-12">
            <h2 className="font-display text-3xl tracking-[-0.025em] sm:text-4xl">
              Compose, then upgrade without losing edits
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-fg-secondary">
              Scaffold a themed SaaS, add pages as you grow, and pull the next release without
              wiping local work.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground outline-none transition-opacity duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
              >
                Get started
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center rounded-full border border-border bg-surface-raised px-5 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
              >
                Create Studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
