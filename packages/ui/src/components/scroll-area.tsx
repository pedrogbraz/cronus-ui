"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

export interface ScrollAreaProps extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  /**
   * Accessible name for the scrollable viewport. Supply this when the content
   * warrants a distinct name (e.g. "Release notes"); the viewport is always
   * keyboard-focusable so it can be scrolled with the arrow keys regardless.
   */
  "aria-label"?: string;
}

export const ScrollArea = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, "aria-label": ariaLabel, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {/*
       * The viewport is the element that actually scrolls, so it must be
       * keyboard-focusable (tabIndex={0}) for arrow-key scrolling — this clears
       * axe's `scrollable-region-focusable`. Promote it to a named `region`
       * landmark only when an aria-label is supplied, so we never leave an
       * unnamed region behind.
       */}
      <ScrollAreaPrimitive.Viewport
        role={ariaLabel ? "region" : undefined}
        aria-label={ariaLabel}
        tabIndex={0}
        className="size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = "ScrollArea";

export const ScrollBar = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      data-slot="scroll-bar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-s border-s-transparent p-px",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-px",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = "ScrollBar";
