import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Cronus Audit",
};

export default function AuditLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* The app reserves a scrollbar gutter on `html` so modals do not shift the
          page. Here that gutter is a measurement bug: it costs 10px on a platform
          with classic scrollbars and 0 on one with overlay scrollbars, and the
          audit compares geometry across exactly that boundary.
          The requirement is only that the scrollbar take no layout width — NOT
          that the page stop scrolling. `overflow: hidden` would also pin the
          document to the viewport height, and parity.pixel.spec.ts falls back to
          a fullPage capture for regions taller than the viewport, which needs a
          document that can grow. */}
      <style>
        {"html{scrollbar-gutter:auto;scrollbar-width:none}html::-webkit-scrollbar{display:none}"}
      </style>
      {children}
    </>
  );
}
