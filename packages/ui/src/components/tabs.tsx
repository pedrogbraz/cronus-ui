"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Tabs}. */
export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

export const Tabs = forwardRef<ComponentRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, ...props }, ref) => {
    return (
      <TabsPrimitive.Root
        ref={ref}
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    );
  },
);
Tabs.displayName = "Tabs";

/** Props for {@link TabsList}. */
export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

export const TabsList = forwardRef<ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, ...props }, ref) => {
    return (
      <TabsPrimitive.List
        ref={ref}
        data-slot="tabs-list"
        className={cn(
          "inline-flex h-10 w-fit items-center justify-center gap-1 rounded-lg bg-surface-inset p-1 text-fg-secondary",
          className,
        )}
        {...props}
      />
    );
  },
);
TabsList.displayName = "TabsList";

/** Props for {@link TabsTrigger}. */
export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

export const TabsTrigger = forwardRef<ComponentRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, ...props }, ref) => {
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        data-slot="tabs-trigger"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none data-[state=active]:bg-surface-floating data-[state=active]:text-fg data-[state=active]:shadow-xs [&_svg]:size-4",
          className,
        )}
        {...props}
      />
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

/** Props for {@link TabsContent}. */
export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

export const TabsContent = forwardRef<ComponentRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <TabsPrimitive.Content
        ref={ref}
        data-slot="tabs-content"
        className={cn("flex-1 outline-none", className)}
        {...props}
      />
    );
  },
);
TabsContent.displayName = "TabsContent";
