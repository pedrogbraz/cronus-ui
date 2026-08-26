"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

export const CollapsibleContent = forwardRef<
  ComponentRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden text-sm text-fg-secondary data-[state=open]:animate-[cronus-collapsible-down_220ms_var(--ease-out-quart)] data-[state=closed]:animate-[cronus-collapsible-up_180ms_var(--ease-out-quart)]",
        className,
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";
