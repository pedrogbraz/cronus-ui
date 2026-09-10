// @ts-nocheck
"use client";

import Image from "next/image";
import { Navbar } from "../components/navbar";
import ScrollToTop from "../components/scrolltotop";
import { SideBento } from "../components/side-bento";
import { TooltipProvider } from "../components/ui/tooltip";

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative bg-background">
        <SideBento />
        <div className="relative mx-auto max-w-5xl select-none">
          <Navbar />
          <Banner src="/templates/portfolio/banner.gif" />
          <div className="mx-auto min-h-screen max-w-5xl border-x border-border">{children}</div>
        </div>
        <ScrollToTop />
      </div>
    </TooltipProvider>
  );
}

function Banner({ src }: { src: string }) {
  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "2560 / 423" }}>
      <Image
        unoptimized
        src={src}
        alt="Banner"
        fill
        className="object-cover object-center"
        priority
      />
    </div>
  );
}
