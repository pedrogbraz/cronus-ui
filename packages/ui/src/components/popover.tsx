"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Popover}. */
export type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root>;

export function Popover({ modal = false, ...props }: PopoverProps) {
  return <PopoverPrimitive.Root modal={modal} {...props} />;
}

/** Props for {@link PopoverTrigger}. */
export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;
export const PopoverTrigger = PopoverPrimitive.Trigger;

/** Props for {@link PopoverAnchor}. */
export type PopoverAnchorProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>;
export const PopoverAnchor = PopoverPrimitive.Anchor;

/** Props for {@link PopoverContent}. */
export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>;

export const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-lg border border-border bg-surface-floating p-3 text-fg shadow-lg outline-none data-[state=open]:animate-[cronus-pop-in_180ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-pop-out_140ms_var(--ease-out-quart)_both]",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = "PopoverContent";
