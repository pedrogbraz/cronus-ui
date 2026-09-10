"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Switch}. */
export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

export const Switch = forwardRef<ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        data-slot="switch"
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-fg-tertiary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none data-[state=checked]:bg-primary aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/30",
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb className="pointer-events-none block size-4 rounded-full bg-primary-foreground shadow-sm ring-0 transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
      </SwitchPrimitive.Root>
    );
  },
);
Switch.displayName = "Switch";
