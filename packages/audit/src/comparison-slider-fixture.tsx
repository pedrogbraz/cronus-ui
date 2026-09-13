"use client";

import { ComparisonSlider } from "@cronus-ui/ui/comparison-slider";

const FALLBACK_ITEMS = ["Before", "After"];

/** Before/after nodes cannot round-trip through emit — labels come from `items`. */
export function ComparisonSliderFixture({
  items,
  "aria-label": ariaLabel,
}: {
  items?: string[];
  "aria-label"?: string;
}) {
  const labels = items && items.length >= 2 ? items : FALLBACK_ITEMS;
  return (
    <ComparisonSlider
      aria-label={ariaLabel}
      before={
        <div className="flex size-full items-center justify-center bg-surface-overlay text-sm text-fg">
          {labels[0]}
        </div>
      }
      after={
        <div className="flex size-full items-center justify-center bg-surface-raised text-sm text-fg">
          {labels[1]}
        </div>
      }
    />
  );
}
