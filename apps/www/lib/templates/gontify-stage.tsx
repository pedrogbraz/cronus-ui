"use client";

import { cn } from "@cronus-ui/ui";
import ClientBody from "./gontify/app/Clientbody";
import Page from "./gontify/app/page";
import "./preview-tokens.css";

export function GontifyStage({ className }: { className?: string }) {
  return (
    <div
      data-slot="template-stage"
      data-template="gontify"
      data-template-stage="gontify"
      data-force-motion=""
      className={cn("dark min-h-svh bg-background text-foreground", className)}
    >
      <ClientBody>
        <Page />
      </ClientBody>
    </div>
  );
}
