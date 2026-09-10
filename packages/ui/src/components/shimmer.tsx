import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Shimmer}. */
export type ShimmerProps = HTMLAttributes<HTMLDivElement>;

export const Shimmer = forwardRef<HTMLDivElement, ShimmerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="shimmer"
        aria-hidden
        className={cn("relative overflow-hidden rounded-md bg-surface-overlay", className)}
        {...props}
      >
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-fg/10 to-transparent motion-reduce:hidden" />
        {children}
      </div>
    );
  },
);
Shimmer.displayName = "Shimmer";
