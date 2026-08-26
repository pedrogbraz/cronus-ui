import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface HighlighterStyle extends CSSProperties {
  "--highlight-duration"?: string;
}

export interface HighlighterProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  /**
   * Seconds the marker takes to draw on.
   * @default 0.6
   */
  duration?: number;
}

const HIGHLIGHT_KEYFRAMES =
  "@keyframes cronus-highlighter{from{transform:scaleX(0)}to{transform:scaleX(1)}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * A marker stroke that draws in behind a phrase — the "we highlight the
 * important bit" treatment on a headline. The mark is decorative
 * (`aria-hidden`); the words themselves stay in the accessibility tree.
 * Reduced-motion visitors get the mark fully drawn with no animation.
 */
export function Highlighter({
  ref,
  className,
  children,
  duration = 0.6,
  style,
  ...props
}: HighlighterProps) {
  const cycle = Math.max(0.1, finiteOr(duration, 0.6));
  const highlightStyle: HighlighterStyle = { "--highlight-duration": `${cycle}s` };

  return (
    <span
      ref={ref}
      data-slot="highlighter"
      className={cn("relative inline whitespace-nowrap", className)}
      style={{ ...highlightStyle, ...style }}
      {...props}
    >
      <style>{HIGHLIGHT_KEYFRAMES}</style>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.08em] -z-10 h-[0.45em] origin-bottom-start rounded-sm bg-primary/25 [animation-duration:var(--highlight-duration)] [animation-fill-mode:forwards] [animation-name:cronus-highlighter] [animation-timing-function:cubic-bezier(.22,1,.36,1)] motion-reduce:[animation-name:none]"
      />
      {children}
    </span>
  );
}
Highlighter.displayName = "Highlighter";
