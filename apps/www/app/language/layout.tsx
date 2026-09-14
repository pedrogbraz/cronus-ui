import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "../../components/home/site-footer";
import { SiteNav } from "../../components/site-nav";

export const metadata: Metadata = {
  title: "Language",
  description:
    "How .cronus works and how to run the native catalog. The kernel emits HTML, tokens, and motion. No JSX in source.",
};

export default function LanguageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteNav />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
