import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link GlassCard}. */
export type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="glass-card"
        className={cn(
          "relative rounded-2xl border border-border-soft bg-surface-raised/60 p-6 text-fg shadow-lg backdrop-blur-xl",
          className,
        )}
        {...props}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-border-strong to-transparent"
        />
        <div className="relative">{children}</div>
      </div>
    );
  },
);
GlassCard.displayName = "GlassCard";
