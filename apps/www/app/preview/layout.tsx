import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Chrome-free shell — the composed stage is the page. */
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return children;
}
