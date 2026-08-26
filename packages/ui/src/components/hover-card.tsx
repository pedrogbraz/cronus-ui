"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = forwardRef<
  ComponentRef<typeof HoverCardPrimitive.Content>,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-64 rounded-lg border border-border bg-surface-floating p-3 text-fg shadow-lg outline-none data-[state=open]:animate-[cronus-pop-in_180ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-pop-out_140ms_var(--ease-out-quart)_both]",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
});
HoverCardContent.displayName = "HoverCardContent";
