"use client";

import { cn } from "@cronus-ui/ui/cn";
import { useEffect, useRef, useState } from "react";
import type { PackApp } from "../lib/catalog";
import { previewEmbedUrl } from "../lib/origins";

const FRAME_WIDTH = 1440;
const FRAME_HEIGHT = 900;

/** Live thumbnail of a Pro pack app, painted from the OSS preview stage. */
export function PreviewThumb({ app, className }: { app: PackApp; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

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
      data-slot="pro-preview-thumb"
      data-cronus-theme={app.theme}
      data-cronus-mode={app.mode}
      className={cn(
        "relative aspect-[16/10] overflow-hidden bg-surface-base",
        app.mode === "dark" ? "dark" : undefined,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(var(--cronus-border)_1px,transparent_1px)] opacity-40 [background-size:16px_16px]"
      />
      {inView ? (
        <iframe
          src={previewEmbedUrl(app.slug)}
          title={`${app.name} live preview`}
          inert
          sandbox="allow-scripts allow-same-origin"
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
