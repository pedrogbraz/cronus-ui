"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";
import { buttonVariants } from "./button.js";

/** Props for {@link AlertDialog}. */
export type AlertDialogProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>;
export const AlertDialog = AlertDialogPrimitive.Root;

/** Props for {@link AlertDialogTrigger}. */
export type AlertDialogTriggerProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogOverlay = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-[cronus-overlay-in_200ms_var(--ease-out-quart)] data-[state=closed]:animate-[cronus-overlay-out_160ms_var(--ease-out-quart)]",
        className,
      )}
      {...props}
    />
  );
});
AlertDialogOverlay.displayName = "AlertDialogOverlay";

/** Props for {@link AlertDialogContent}. */
export type AlertDialogContentProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>;

export const AlertDialogContent = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        data-slot="alert-dialog-content"
        className={cn(
          "fixed inset-0 z-50 m-auto grid h-fit w-full max-w-lg gap-4 rounded-xl border border-border bg-surface-floating p-6 text-fg shadow-lg data-[state=open]:animate-[cronus-pop-in_200ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-pop-out_160ms_var(--ease-out-quart)_both]",
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

/** Props for {@link AlertDialogHeader}. */
export type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export const AlertDialogHeader = ({ className, ...props }: AlertDialogHeaderProps) => {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-1.5 text-center sm:text-start", className)}
      {...props}
    />
  );
};
AlertDialogHeader.displayName = "AlertDialogHeader";

/** Props for {@link AlertDialogFooter}. */
export type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement>;

export const AlertDialogFooter = ({ className, ...props }: AlertDialogFooterProps) => {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
};
AlertDialogFooter.displayName = "AlertDialogFooter";

/** Props for {@link AlertDialogTitle}. */
export type AlertDialogTitleProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>;

export const AlertDialogTitle = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Title>,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      data-slot="alert-dialog-title"
      className={cn("font-display text-lg font-semibold text-fg", className)}
      {...props}
    />
  );
});
AlertDialogTitle.displayName = "AlertDialogTitle";

/** Props for {@link AlertDialogDescription}. */
export type AlertDialogDescriptionProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Description
>;

export const AlertDialogDescription = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      data-slot="alert-dialog-description"
      className={cn("text-sm text-fg-secondary", className)}
      {...props}
    />
  );
});
AlertDialogDescription.displayName = "AlertDialogDescription";

/** Props for {@link AlertDialogAction}. */
export type AlertDialogActionProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>;

export const AlertDialogAction = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      data-slot="alert-dialog-action"
      className={cn(buttonVariants({ variant: "primary" }), className)}
      {...props}
    />
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

/** Props for {@link AlertDialogCancel}. */
export type AlertDialogCancelProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>;

export const AlertDialogCancel = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";
