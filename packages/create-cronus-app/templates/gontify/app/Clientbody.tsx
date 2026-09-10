"use client";

import ScrollToTop from "@/components/scrolltotop";
import Navbar from "@/components/sections/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Navbar />
      <div className="pt-14">{children}</div>
      <ScrollToTop />
    </TooltipProvider>
  );
}
