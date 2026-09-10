import * as ProgressPrimitive from "@radix-ui/react-progress";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Progress}. */
export type ProgressProps = ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>;

/**
 * A determinate/indeterminate progress bar. The Radix Root is the
 * `role="progressbar"` element, so `aria-label`/`aria-labelledby` (and any
 * other prop) spread straight onto it — always pass one describing what the
 * bar measures (e.g. "Upload progress") so the progressbar has an accessible
 * name and satisfies `aria-progressbar-name` (WCAG 4.1.2).
 */
export const Progress = forwardRef<ComponentRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, value ?? 0));
    return (
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        value={value}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-surface-overlay",
          className,
        )}
        // `aria-label`/`aria-labelledby` arrive via `...props` and land on the
        // `role="progressbar"` element (Radix Root), giving the bar its name.
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-primary transition-transform duration-300 ease-[var(--ease-out-quart)]"
          style={{ transform: `translateX(-${100 - pct}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = "Progress";
