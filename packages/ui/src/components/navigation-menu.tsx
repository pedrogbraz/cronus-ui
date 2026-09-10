"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link NavigationMenu}. */
export type NavigationMenuProps = ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>;

export const NavigationMenu = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, children, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      data-slot="navigation-menu"
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
});
NavigationMenu.displayName = "NavigationMenu";

/** Props for {@link NavigationMenuList}. */
export type NavigationMenuListProps = ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>;

export const NavigationMenuList = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.List>,
  NavigationMenuListProps
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      data-slot="navigation-menu-list"
      className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  );
});
NavigationMenuList.displayName = "NavigationMenuList";

/** Props for {@link NavigationMenuItem}. */
export type NavigationMenuItemProps = ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>;

export const NavigationMenuItem = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Item>,
  NavigationMenuItemProps
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Item
      ref={ref}
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
});
NavigationMenuItem.displayName = "NavigationMenuItem";

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center gap-1 rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-fg-secondary transition-[background,color,box-shadow] duration-150 ease-[var(--ease-out-quart)] outline-none hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-surface-overlay data-[state=open]:text-fg data-[active]:bg-surface-overlay data-[active]:text-fg",
);

/** Props for {@link NavigationMenuTrigger}. */
export type NavigationMenuTriggerProps = ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Trigger
>;

export const NavigationMenuTrigger = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className="relative top-px size-3.5 text-fg-tertiary transition-transform duration-200 ease-[var(--ease-out-quart)] group-data-[state=open]:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  );
});
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

/** Props for {@link NavigationMenuContent}. */
export type NavigationMenuContentProps = ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Content
>;

export const NavigationMenuContent = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Content>,
  NavigationMenuContentProps
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      data-slot="navigation-menu-content"
      className={cn(
        "left-0 top-0 w-full p-1 transition-[transform,opacity] duration-200 ease-[var(--ease-out-quart)] md:absolute md:w-auto",
        "data-[motion=from-start]:-translate-x-12 data-[motion=from-start]:opacity-0",
        "data-[motion=from-end]:translate-x-12 data-[motion=from-end]:opacity-0",
        "data-[motion=to-start]:-translate-x-12 data-[motion=to-start]:opacity-0",
        "data-[motion=to-end]:translate-x-12 data-[motion=to-end]:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
NavigationMenuContent.displayName = "NavigationMenuContent";

/** Props for {@link NavigationMenuLink}. */
export type NavigationMenuLinkProps = ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>;

export const NavigationMenuLink = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Link>,
  NavigationMenuLinkProps
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      data-slot="navigation-menu-link"
      className={cn(
        "flex select-none flex-col gap-0.5 rounded-md px-3 py-2 text-sm leading-snug no-underline outline-none transition-colors duration-150 ease-[var(--ease-out-quart)] hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base data-[active]:bg-surface-overlay data-[active]:text-fg",
        className,
      )}
      {...props}
    />
  );
});
NavigationMenuLink.displayName = "NavigationMenuLink";

/** Props for {@link NavigationMenuIndicator}. */
export type NavigationMenuIndicatorProps = ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Indicator
>;

export const NavigationMenuIndicator = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
  NavigationMenuIndicatorProps
>(({ className, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-10 flex h-2 items-end justify-center overflow-hidden transition-opacity duration-200 ease-[var(--ease-out-quart)] data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm border-l border-t border-border bg-surface-floating shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
});
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

/** Props for {@link NavigationMenuViewport}. */
export type NavigationMenuViewportProps = ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Viewport
>;

export const NavigationMenuViewport = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  NavigationMenuViewportProps
>(({ className, ...props }, ref) => {
  return (
    <div className="absolute left-0 top-full flex w-max justify-center">
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        data-slot="navigation-menu-viewport"
        className={cn(
          "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full shrink-0 origin-top-center overflow-hidden rounded-lg border border-border bg-surface-floating text-fg shadow-lg transition-[width,height] duration-200 ease-[var(--ease-out-quart)] data-[state=closed]:opacity-0 md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
});
NavigationMenuViewport.displayName = "NavigationMenuViewport";

export { navigationMenuTriggerStyle };
