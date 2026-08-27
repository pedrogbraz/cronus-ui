import { cn } from "@cronus-ui/ui";
import type { ReactNode } from "react";

/** One named image + hidden SVG subtree — same a11y contract as the existing chart demos. */
export function ChartFrame({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="img" aria-label={label} className={cn("w-full", className)}>
      <div aria-hidden="true" className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
