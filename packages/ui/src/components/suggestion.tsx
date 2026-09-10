import { cva } from "class-variance-authority";
import type { HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";
import { Button, type ButtonProps } from "./button.js";

export const suggestionVariants = cva("rounded-full px-4");

export interface SuggestionsLabels {
  suggestions: string;
}

const DEFAULT_LABELS: SuggestionsLabels = {
  suggestions: "Suggestions",
};

export interface SuggestionsProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  labels?: Partial<SuggestionsLabels>;
}

export function Suggestions({
  className,
  children,
  ref,
  labels,
  "aria-label": ariaLabel,
  ...props
}: SuggestionsProps) {
  const regionLabel = ariaLabel ?? labels?.suggestions ?? DEFAULT_LABELS.suggestions;
  return (
    <section
      ref={ref}
      data-slot="suggestions"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region is intentionally focusable so keyboard users can scroll it.
      tabIndex={0}
      aria-label={regionLabel}
      className="w-full overflow-x-auto whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
      {...props}
    >
      <div className={cn("flex w-max flex-nowrap items-center gap-2", className)}>{children}</div>
    </section>
  );
}

export interface SuggestionProps extends Omit<ButtonProps, "onClick"> {
  suggestion: string;
  onClick?: (suggestion: string) => void;
}

export function Suggestion({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ref,
  ...props
}: SuggestionProps & { ref?: Ref<HTMLButtonElement> }) {
  return (
    <Button
      ref={ref}
      data-slot="suggestion"
      type="button"
      variant={variant}
      size={size}
      className={cn(suggestionVariants(), className)}
      onClick={() => onClick?.(suggestion)}
      {...props}
    >
      {children ?? suggestion}
    </Button>
  );
}
