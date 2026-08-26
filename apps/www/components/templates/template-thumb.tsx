"use client";

import { cn } from "@kronus-ui/ui";
import { useEffect, useRef, useState } from "react";
import {
  hasLivePreview,
  previewPath,
  type TemplateCatalogEntry,
} from "../../lib/templates/catalog";

/** Desktop canvas the iframe paints at, then we scale to the card. */
const FRAME_WIDTH = 1440;
const FRAME_HEIGHT = 900;

/**
 * Live thumbnail of a composed template. Mounts the preview iframe only when
 * the card is near the viewport so the gallery does not boot 18 stages at once.
 */
export function TemplateThumb({
  entry,
  className,
}: {
  entry: TemplateCatalogEntry;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const live = hasLivePreview(entry);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([item]) => {
        if (item?.isIntersecting) setInView(true);
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const width = node.clientWidth;
      if (width > 0) setScale(width / FRAME_WIDTH);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      data-slot="template-thumb"
      data-kronus-theme={entry.theme}
      data-kronus-mode={entry.mode}
      className={cn(
        "relative aspect-[16/10] overflow-hidden bg-surface-base",
        entry.mode === "dark" ? "dark" : undefined,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(var(--kronus-border)_1px,transparent_1px)] opacity-40 [background-size:16px_16px]"
      />
      {live && inView ? (
        <iframe
          src={previewPath(entry.slug, true)}
          title={`${entry.name} live preview`}
          tabIndex={-1}
          loading="lazy"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: `scale(${scale ?? 0.25})`,
          }}
        />
      ) : null}
    </div>
  );
}
