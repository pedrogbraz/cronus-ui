"use client";

import { ScrollProgress } from "@cronus-ui/ui/scroll-progress";
import { useLayoutEffect, useRef } from "react";

/** ScrollProgress tracks a target; `value` cannot be set as a prop. */
export function ScrollProgressFixture({
  value,
  "aria-label": ariaLabel,
}: {
  value?: number;
  "aria-label"?: string;
}) {
  const target = useRef<HTMLDivElement>(null);
  const percent = typeof value === "number" && Number.isFinite(value) ? value : 40;
  const ratio = Math.min(1, Math.max(0, percent / 100));

  useLayoutEffect(() => {
    const el = target.current;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable > 0) {
      el.scrollTop = scrollable * ratio;
    }
  }, [ratio]);

  return (
    <div className="w-72">
      <ScrollProgress target={target} aria-label={ariaLabel} />
      <div ref={target} className="mt-2 h-32 overflow-auto">
        <div className="h-[320px]" />
      </div>
    </div>
  );
}
