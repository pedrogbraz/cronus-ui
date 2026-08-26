import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface SparkleStyle extends CSSProperties {
  "--sparkle-delay"?: string;
  "--sparkle-duration"?: string;
}

export interface SparklesTextProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  /**
   * Number of sparkles around the text. Clamped to `2–12`.
   * @default 4
   */
  count?: number;
}

const SPARKLE_KEYFRAMES =
  "@keyframes kronus-sparkle{0%,100%{transform:scale(0);opacity:0}40%{transform:scale(1);opacity:1}70%{transform:scale(0.6);opacity:0.6}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

const SLOTS: Array<{ top: string; start: string }> = [
  { top: "0%", start: "8%" },
  { top: "10%", start: "88%" },
  { top: "85%", start: "18%" },
  { top: "78%", start: "78%" },
  { top: "-8%", start: "48%" },
  { top: "50%", start: "-6%" },
  { top: "52%", start: "96%" },
  { top: "100%", start: "52%" },
];

/**
 * Twinkling sparkles around a phrase. The text itself is unchanged and
 * selectable; sparkles are decorative (`aria-hidden`) and suppressed under
 * reduced motion.
 */
export function SparklesText({ ref, className, children, count = 4, ...props }: SparklesTextProps) {
  const sparkleCount = Math.min(8, Math.max(2, Math.round(finiteOr(count, 4))));

  return (
    <span
      ref={ref}
      data-slot="sparkles-text"
      className={cn("relative inline-block", className)}
      {...props}
    >
      <style>{SPARKLE_KEYFRAMES}</style>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-visible motion-reduce:hidden"
      >
        {Array.from({ length: sparkleCount }, (_, index) => {
          const slot = SLOTS[index % SLOTS.length] ?? SLOTS[0];
          const sparkleStyle: SparkleStyle = {
            top: slot?.top,
            insetInlineStart: slot?.start,
            "--sparkle-delay": `${(index * 0.35) % 1.6}s`,
            "--sparkle-duration": `${1.4 + (index % 3) * 0.25}s`,
          };
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: sparkles are positional and never reorder.
              key={index}
              className="absolute size-2 text-primary [animation-delay:var(--sparkle-delay)] [animation-duration:var(--sparkle-duration)] [animation-iteration-count:infinite] [animation-name:kronus-sparkle]"
              style={sparkleStyle}
            >
              <svg viewBox="0 0 16 16" className="size-full fill-current" aria-hidden="true">
                <path d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z" />
              </svg>
            </span>
          );
        })}
      </span>
      <span className="relative">{children}</span>
    </span>
  );
}
SparklesText.displayName = "SparklesText";
