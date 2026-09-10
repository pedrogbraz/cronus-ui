import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link AuroraBackground}. */
export type AuroraBackgroundProps = HTMLAttributes<HTMLDivElement>;

export const AuroraBackground = forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="aurora-background"
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/3 start-1/4 size-2/3 rounded-full bg-gradient-aurora opacity-30 blur-3xl animate-aurora" />
          <div className="absolute -bottom-1/3 end-1/4 size-2/3 rounded-full bg-gradient-aurora opacity-30 blur-3xl animate-aurora [animation-delay:-6s]" />
          <div className="absolute start-1/2 top-1/4 size-1/2 -translate-x-1/2 rounded-full bg-gradient-aurora opacity-20 blur-3xl animate-aurora [animation-delay:-12s]" />
        </div>
        <div className="relative">{children}</div>
      </div>
    );
  },
);
AuroraBackground.displayName = "AuroraBackground";
