"use client";

import { Button } from "@cooud-ui/ui/button";
import { ArrowRight, Check, Copy, PackagePlus, Sparkles, Terminal } from "lucide-react";
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
      {/* Part 1 — three ways in */}
      <section className="relative border-t border-border/60">
        <SectionGlow />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-3">
            <Eyebrow>Get started</Eyebrow>
            <h2 className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl">
              Three ways in — all take a minute
            </h2>
            <p className="max-w-2xl text-fg-secondary">
              Scaffold a fresh app, generate a resolved stack, or drop components into the app you
              already have.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 gap-4 lg:grid-cols-3">
            <PathCard
              icon={<PackagePlus className="size-5" aria-hidden="true" />}
              title="Start fresh"
              description="A Next.js app pre-wired with Cooud UI, a theme, and the AI Kit."
              command="npx create-cooud-app my-app"
            />
            <PathCard
              icon={<Sparkles className="size-5" aria-hidden="true" />}
              title="Generate a stack"
              description="Resolve your framework, AI tools, MCP, docs, and handoff files from Stack Builder."
              command="bun create cooud-stack@latest my-app"
            />
            <PathCard
              icon={<Terminal className="size-5" aria-hidden="true" />}
              title="Add to your app"
              description="Install from the registry — the real source lands in your repo, yours to edit."
              command="npx cooud-ui add button card dialog"
            />
          </div>
        </div>
      </section>

      {/* Part 2 — final CTA band */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-raised px-6 py-14 text-center shadow-lg sm:px-12">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-aurora opacity-[0.10] blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--cooud-border)_1px,transparent_1px)] opacity-40 [background-size:22px_22px]"
            />

            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-overlay/60 px-3 py-1 text-xs font-medium text-fg-secondary backdrop-blur">
              <Sparkles className="size-3.5 text-fg-tertiary" aria-hidden="true" />
              Aurora, by default
            </span>

            <h2 className="mt-5 font-display text-3xl tracking-[-0.025em] sm:text-4xl">
              Create a design system in minutes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-fg-secondary">
              Pick a theme, tune your tokens, and ship accessible, on-brand components across every
              surface — no design debt, no lock-in.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="gradient" size="lg">
                <Link href="/create">
                  Create a system
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
