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
          audit compares geometry across exactly that boundary. The panes scroll
          instead, which leaves the fixed-width canvases untouched. */}
      <style>{"html{scrollbar-gutter:auto;overflow:hidden}"}</style>
      {children}
    </>
  );
}
