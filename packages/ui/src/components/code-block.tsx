import { forwardRef, type HTMLAttributes, useId, useMemo } from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";
import { CopyButton } from "./copy-button.js";

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Raw source to render and copy. */
  code: string;
  /** Language label rendered as a Badge in the header. */
  language?: string;
  /** File name rendered in the header. */
  filename?: string;
  /** Render a gutter with 1-based line numbers. Defaults to false. */
  showLineNumbers?: boolean;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ code, language, filename, showLineNumbers = false, className, ...props }, ref) => {
    const headingId = useId();
    const hasHeader = Boolean(filename || language);

    const lines = useMemo(
      () => (showLineNumbers ? code.replace(/\n$/, "").split("\n") : null),
      [code, showLineNumbers],
    );

    const regionLabel = filename
      ? `Code block, ${filename}`
      : language
        ? `Code block, ${language}`
        : "Code block";

    return (
      <div
        ref={ref}
        data-slot="code-block"
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-surface-raised text-fg",
          className,
        )}
        {...props}
      >
        {hasHeader ? (
          <div
            data-slot="code-block-header"
            className="flex items-center justify-between gap-3 border-b border-border bg-surface-overlay px-4 py-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              {filename ? (
                <span
                  id={headingId}
                  data-slot="code-block-filename"
                  className="truncate font-mono text-xs text-fg-secondary"
                >
                  {filename}
                </span>
              ) : null}
              {language ? (
                <Badge variant="secondary" data-slot="code-block-language">
                  {language}
                </Badge>
              ) : null}
            </div>
            <CopyButton value={code} size="icon-sm" className="-mr-1.5 shrink-0" />
          </div>
        ) : null}

        <div className="relative">
          {!hasHeader ? (
            <CopyButton
              value={code}
              size="icon-sm"
              className="absolute end-2 top-2 z-10 shrink-0 bg-surface-overlay/80 backdrop-blur-sm"
            />
          ) : null}
          {/*
            The horizontal-scroll container is keyboard-reachable so users who
            cannot swipe/drag can still scroll wide snippets (axe
            scrollable-region-focusable, WCAG 2.1.1). A focusable native section
            (region) + aria-label names it; the <pre> stays a plain code element.
          */}
          <section
            data-slot="code-block-scroll"
            // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region is intentionally focusable so keyboard users can scroll it.
            tabIndex={0}
            aria-label={regionLabel}
            aria-describedby={filename ? headingId : undefined}
            className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            <pre data-slot="code-block-pre" className="p-4 text-sm leading-relaxed">
              <code data-slot="code-block-code" className="block font-mono">
                {lines ? (
                  lines.map((line, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional and stable
                    <span key={index} data-slot="code-block-line" className="table-row">
                      <span
                        aria-hidden="true"
                        data-slot="code-block-line-number"
                        className="table-cell select-none pe-4 text-end text-fg-muted tabular-nums"
                      >
                        {index + 1}
                      </span>
                      <span className="table-cell whitespace-pre">{line || " "}</span>
                    </span>
                  ))
                ) : (
                  <span className="whitespace-pre">{code}</span>
                )}
              </code>
            </pre>
          </section>
        </div>
      </div>
    );
  },
);
CodeBlock.displayName = "CodeBlock";
