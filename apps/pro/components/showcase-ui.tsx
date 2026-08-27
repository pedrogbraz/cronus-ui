import { cn } from "@cronus-ui/ui/cn";
import type { ReactNode } from "react";

/** Short faded tick between sections — not a full-bleed bar. */
export function SectionGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 top-0 flex justify-center", className)}
    >
      <div className="h-px w-[min(12rem,32%)] bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-fg-tertiary",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-fg-tertiary" />
      {children}
    </span>
  );
}
