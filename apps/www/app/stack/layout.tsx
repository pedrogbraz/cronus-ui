import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "../../components/site-nav";

export const metadata: Metadata = {
  title: "Stack Builder — Cronus UI",
  description:
    "Compose your app stack layer by layer. The Cronus Stack Builder validates every choice live and hands you a runnable default scaffold command plus a Kickoff prompt for your coding agent.",
};

export default function StackLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteNav />
      {children}
    </div>
  );
}
