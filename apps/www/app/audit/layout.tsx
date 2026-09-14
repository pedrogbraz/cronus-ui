import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Cronus Audit",
};

export default function AuditLayout({ children }: { children: ReactNode }) {
  return children;
}
