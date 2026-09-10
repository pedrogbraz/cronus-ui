"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Accordion}. */
export type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

export const Accordion = AccordionPrimitive.Root;

/** Props for {@link AccordionItem}. */
export type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

export const AccordionItem = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      data-slot="accordion-item"
      className={cn("border-b border-border", className)}
      {...props}
    />
  );
});
AccordionItem.displayName = "AccordionItem";

/** Props for {@link AccordionTrigger}. */
export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

export const AccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between gap-4 py-4 text-sm font-medium text-fg outline-none transition-all hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-md disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-4 shrink-0 text-fg-tertiary transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

/** Props for {@link AccordionContent}. */
export type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;

export const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm text-fg-secondary data-[state=open]:animate-[cronus-accordion-down_220ms_var(--ease-out-quart)] data-[state=closed]:animate-[cronus-accordion-up_180ms_var(--ease-out-quart)]",
        className,
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = "AccordionContent";
