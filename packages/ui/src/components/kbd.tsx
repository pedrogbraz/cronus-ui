import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Kbd}. */
export type KbdProps = HTMLAttributes<HTMLElement>;

export const Kbd = forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => {
  return (
    <kbd
      ref={ref}
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-md border border-border bg-surface-overlay px-1.5 font-mono text-[0.7rem] font-medium text-fg-secondary",
        className,
      )}
      {...props}
    />
  );
});
Kbd.displayName = "Kbd";
