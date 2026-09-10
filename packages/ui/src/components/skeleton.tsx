import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Skeleton}. */
export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        aria-hidden
        className={cn("animate-pulse rounded-md bg-surface-overlay", className)}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";
