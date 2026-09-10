"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Slider}. */
export type SliderProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

/**
 * A single- or multi-thumb range slider. Each focusable thumb is the actual
 * `role="slider"` input, so pass `aria-label`/`aria-labelledby` describing what
 * the slider controls (e.g. "Volume") to give every thumb an accessible name
 * and satisfy `aria-input-field-name` (WCAG 4.1.2). Multi-thumb (range) sliders
 * derive a unique per-thumb name by suffixing the label with its 1-based index.
 */
export const Slider = forwardRef<ComponentRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...props }, ref) => {
    const provided = props.value ?? props.defaultValue;
    const values = provided?.length ? provided : [props.min ?? 0];

    // The thumb is the actual `role="slider"` input, so we name it explicitly to
    // satisfy `aria-input-field-name` (WCAG 4.1.2). The label props are pulled OUT
    // of the spread: Radix's Root renders a role-less <span>, where `aria-label`
    // would trip axe `aria-prohibited-attr` (serious, WCAG 4.1.2). For multi-thumb
    // sliders each thumb gets an index suffix so the names stay unique.
    const multipleThumbs = values.length > 1;

    return (
      <SliderPrimitive.Root
        ref={ref}
        data-slot="slider"
        className={cn(
          "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-surface-overlay">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            // biome-ignore lint/suspicious/noArrayIndexKey: thumb count is positional and stable
            key={index}
            aria-label={
              ariaLabel ? (multipleThumbs ? `${ariaLabel} (${index + 1})` : ariaLabel) : undefined
            }
            aria-labelledby={ariaLabel ? undefined : ariaLabelledby}
            className="block size-4 rounded-full border border-primary bg-surface-base shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = "Slider";
