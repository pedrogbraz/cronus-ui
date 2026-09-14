"use client";

import { Lightbox } from "@cronus-ui/ui/lightbox";

const FALLBACK_ITEMS = ["First image", "Second image"];

const PIXEL =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#888"/></svg>',
  );

/** Image `{src, alt}` objects cannot round-trip through emit — alts come from `items`. */
export function LightboxFixture({ items }: { items?: string[] }) {
  const labels = items && items.length > 0 ? items : FALLBACK_ITEMS;
  return (
    <Lightbox
      open
      images={labels.map((alt) => ({
        src: PIXEL,
        alt,
      }))}
    />
  );
}
