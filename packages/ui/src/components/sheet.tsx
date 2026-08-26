"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

const SheetOverlay = forwardRef<
  ComponentRef<typeof SheetPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <SheetPrimitive.Overlay
      ref={ref}
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-[cronus-overlay-in_300ms_var(--ease-out-quart)] data-[state=closed]:animate-[cronus-overlay-out_240ms_var(--ease-out-quart)]",
        className,
      )}
      {...props}
    />
  );
});
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-surface-floating p-6 text-fg shadow-lg border-border",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b w-full data-[state=open]:animate-[cronus-slide-in-top_320ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-slide-out-top_260ms_var(--ease-out-quart)_both]",
        bottom:
          "inset-x-0 bottom-0 border-t w-full data-[state=open]:animate-[cronus-slide-in-bottom_320ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-slide-out-bottom_260ms_var(--ease-out-quart)_both]",
        left: "inset-y-0 left-0 border-r h-full w-3/4 max-w-sm data-[state=open]:animate-[cronus-slide-in-left_320ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-slide-out-left_260ms_var(--ease-out-quart)_both]",
        right:
          "inset-y-0 right-0 border-l h-full w-3/4 max-w-sm data-[state=open]:animate-[cronus-slide-in-right_320ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-slide-out-right_260ms_var(--ease-out-quart)_both]",
      },
    },
    defaultVariants: { side: "right" },
  },
);

export interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  side?: "top" | "right" | "bottom" | "left";
}

export const SheetContent = forwardRef<
  ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ className, children, side = "right", ...props }, ref) => {
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        data-slot="sheet-content"
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          data-slot="sheet-close"
          className="absolute right-4 top-4 rounded-md text-fg-tertiary outline-none transition-opacity hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
});
SheetContent.displayName = "SheetContent";

export const SheetHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
      {...props}
    />
  );
};
SheetHeader.displayName = "SheetHeader";

export const SheetFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
};
SheetFooter.displayName = "SheetFooter";

export const SheetTitle = forwardRef<
  ComponentRef<typeof SheetPrimitive.Title>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <SheetPrimitive.Title
      ref={ref}
      data-slot="sheet-title"
      className={cn("font-display text-lg font-semibold text-fg", className)}
      {...props}
    />
  );
});
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = forwardRef<
  ComponentRef<typeof SheetPrimitive.Description>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <SheetPrimitive.Description
      ref={ref}
      data-slot="sheet-description"
      className={cn("text-sm text-fg-secondary", className)}
      {...props}
    />
  );
});
SheetDescription.displayName = "SheetDescription";

export { sheetVariants };
