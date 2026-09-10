"use client";

import { cn } from "@cronus-ui/ui";
import ClientBody from "./portfolio/app/Clientbody";
import Page from "./portfolio/app/page";
import "./preview-tokens.css";

export function PortfolioStage({ className }: { className?: string }) {
  return (
    <div
      data-slot="template-stage"
      data-template="portfolio"
      data-template-stage="portfolio"
      className={cn("min-h-svh bg-background text-foreground", className)}
    >
      <ClientBody>
        <Page />
      </ClientBody>
    </div>
  );
}
