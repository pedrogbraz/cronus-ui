"use client";

import { CopyButton } from "@cronus-ui/ui/copy-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { useState } from "react";
import { COMPONENT_COUNT } from "../../lib/components-index";
import { SectionGlow } from "../showcase-ui";

const count = new Intl.NumberFormat("en-US");

const SNIPPETS = [
  {
    id: "bun",
    label: "bun",
    language: "bash",
    code: `# Scaffold a themed SaaS
bunx create-cronus-app my-app --template saas
cd my-app
bun run dev`,
  },
  {
    id: "react",
    label: "React",
    language: "tsx",
    code: `import { CronusUIProvider } from "@cronus-ui/theme";
import { Button } from "@cronus-ui/ui/button";

export function App() {
  return (
    <CronusUIProvider defaultThemeName="aurora">
      <Button>Get started</Button>
    </CronusUIProvider>
  );
}`,
  },
  {
    id: "add",
    label: "add",
    language: "bash",
    code: `# Copy primitives into your repo
npx cronus-ui add button card data-table

# Grow a composed route
npx cronus-ui add-page --route /faq --blocks faq,cta --nav FAQ`,
  },
  {
    id: "upgrade",
    label: "upgrade",
    language: "bash",
    code: `# See what would change
npx cronus-ui upgrade --all --dry-run

# Apply — 3-way merge, local edits kept
npx cronus-ui upgrade --all`,
  },
] as const;

const theme: PrismTheme = {
  plain: { color: "var(--cronus-fg)", backgroundColor: "transparent" },
  styles: [
    { types: ["comment"], style: { color: "var(--cronus-fg-tertiary)", fontStyle: "italic" } },
    { types: ["keyword", "tag", "operator"], style: { color: "var(--cronus-syntax-keyword)" } },
    { types: ["function", "class-name"], style: { color: "var(--cronus-syntax-fn)" } },
    { types: ["string", "attr-value"], style: { color: "var(--cronus-syntax-string)" } },
    { types: ["attr-name", "property"], style: { color: "var(--cronus-syntax-attr)" } },
    { types: ["number"], style: { color: "var(--cronus-syntax-number)" } },
    { types: ["plain", "punctuation"], style: { color: "var(--cronus-fg-secondary)" } },
  ],
};

const MINI = [
  { value: count.format(COMPONENT_COUNT), label: "components" },
  { value: "5", label: "themes" },
  { value: "3", label: "looks" },
] as const;

function Corner({ className }: { className: string }) {
  return <span aria-hidden="true" className={`pointer-events-none absolute size-3 ${className}`} />;
}

export function DeveloperCli({ displayClassName }: { displayClassName?: string }) {
  const [active, setActive] = useState<(typeof SNIPPETS)[number]["id"]>("react");
  const snippet = SNIPPETS.find((item) => item.id === active) ?? SNIPPETS[0];
  if (!snippet) {
    throw new Error("Missing CLI snippet");
  }

  return (
    <section id="cli" aria-labelledby="cli-heading" className="relative py-20 sm:py-28">
      <SectionGlow />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="text-sm text-fg-tertiary">For builders</p>
          <h2
            id="cli-heading"
            className={`mt-3 text-4xl font-normal leading-[1.1] tracking-[-0.03em] text-fg sm:text-5xl ${displayClassName ?? "font-display"}`}
          >
            <span className="block">One CLI.</span>
            <span className="block text-fg-secondary">Every surface.</span>
          </h2>
          <p className="mt-5 max-w-md text-fg-secondary">
            Scaffold a SaaS, add a page, set a theme, upgrade without wiping edits — the same
            tokens, the same contract.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground outline-none transition-opacity duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Get started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/docs/cli"
              className="inline-flex items-center rounded-full border border-border bg-surface-raised px-5 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
            >
              Read docs
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4">
            {MINI.map((item) => (
              <div key={item.label}>
                <dd className="text-xl text-fg">{item.value}</dd>
                <dt className="text-xs text-fg-tertiary">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative px-3 py-3">
          <Corner className="left-0 top-0 border-l border-t border-border-strong" />
          <Corner className="right-0 top-0 border-r border-t border-border-strong" />
          <Corner className="bottom-0 left-0 border-b border-l border-border-strong" />
          <Corner className="bottom-0 right-0 border-b border-r border-border-strong" />

          <div className="overflow-hidden rounded-2xl border border-border bg-surface-inset shadow-lg">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-error/80" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-warning/80" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-success/80" />
              <span className="ms-auto">
                <CopyButton
                  value={snippet.code}
                  copyLabel="Copy snippet"
                  className="text-fg-tertiary"
                />
              </span>
            </div>
            <Highlight code={snippet.code} language={snippet.language} theme={theme}>
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <section
                  // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable code region
                  tabIndex={0}
                  aria-label={`${snippet.label} sample`}
                  className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <pre
                    className={`${className} min-h-[16rem] p-5 font-mono text-[0.8rem] leading-relaxed`}
                    style={{ ...style, background: "transparent" }}
                  >
                    {tokens.map((line, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: prism lines are positional
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: prism tokens are positional
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                </section>
              )}
            </Highlight>
          </div>

          <fieldset className="mt-4 flex flex-wrap gap-1.5 border-0 p-0">
            <legend className="sr-only">Snippet language</legend>
            {SNIPPETS.map((item) => {
              const selected = item.id === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(item.id)}
                  className={
                    selected
                      ? "rounded-full bg-surface-overlay px-3 py-1.5 text-sm font-medium text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      : "rounded-full px-3 py-1.5 text-sm text-fg-secondary outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </fieldset>
        </div>
      </div>
    </section>
  );
}
