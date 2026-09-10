"use client";

import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../lib/cn.js";

/** Props for {@link Drawer}. */
export type DrawerProps = ComponentProps<typeof DrawerPrimitive.Root>;

export const Drawer = ({ shouldScaleBackground = true, ...props }: DrawerProps) => {
  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
};
Drawer.displayName = "Drawer";

/** Props for {@link DrawerTrigger}. */
export type DrawerTriggerProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>;
export const DrawerTrigger = DrawerPrimitive.Trigger;

/** Props for {@link DrawerPortal}. */
export type DrawerPortalProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Portal>;
export const DrawerPortal = DrawerPrimitive.Portal;

/** Props for {@link DrawerClose}. */
export type DrawerCloseProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>;
export const DrawerClose = DrawerPrimitive.Close;

/** Props for {@link DrawerOverlay}. */
export type DrawerOverlayProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>;

export const DrawerOverlay = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      data-slot="drawer-overlay"
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

/** Props for {@link DrawerContent}. */
export type DrawerContentProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>;

export const DrawerContent = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        data-slot="drawer-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-xl border border-border bg-surface-floating text-fg",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-border" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

/** Props for {@link DrawerHeader}. */
export type DrawerHeaderProps = ComponentProps<"div">;

export const DrawerHeader = ({ className, ...props }: DrawerHeaderProps) => {
  return (
    <div
      data-slot="drawer-header"
      className={cn("grid gap-1.5 p-4 text-center sm:text-start", className)}
      {...props}
    />
  );
};
DrawerHeader.displayName = "DrawerHeader";

/** Props for {@link DrawerFooter}. */
export type DrawerFooterProps = ComponentProps<"div">;

export const DrawerFooter = ({ className, ...props }: DrawerFooterProps) => {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
};
DrawerFooter.displayName = "DrawerFooter";

/** Props for {@link DrawerTitle}. */
export type DrawerTitleProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>;

export const DrawerTitle = forwardRef<ComponentRef<typeof DrawerPrimitive.Title>, DrawerTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <DrawerPrimitive.Title
        ref={ref}
        data-slot="drawer-title"
        className={cn("font-display text-lg font-semibold text-fg", className)}
        {...props}
      />
    );
  },
);
DrawerTitle.displayName = "DrawerTitle";

/** Props for {@link DrawerDescription}. */
export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>;

export const DrawerDescription = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitive.Description
      ref={ref}
      data-slot="drawer-description"
      className={cn("text-sm text-fg-secondary", className)}
      {...props}
    />
  );
});
DrawerDescription.displayName = "DrawerDescription";
