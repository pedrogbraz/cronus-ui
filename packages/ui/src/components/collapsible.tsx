"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Collapsible}. */
export type CollapsibleProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>;
export const Collapsible = CollapsiblePrimitive.Root;

/** Props for {@link CollapsibleTrigger}. */
export type CollapsibleTriggerProps = ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleTrigger
>;
export const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

/** Props for {@link CollapsibleContent}. */
export type CollapsibleContentProps = ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleContent
>;

export const CollapsibleContent = forwardRef<
  ComponentRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  CollapsibleContentProps
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
