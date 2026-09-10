"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link MenubarMenu}. */
export type MenubarMenuProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Menu>;
export const MenubarMenu = MenubarPrimitive.Menu;

/** Props for {@link MenubarGroup}. */
export type MenubarGroupProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Group>;
export const MenubarGroup = MenubarPrimitive.Group;

/** Props for {@link MenubarPortal}. */
export type MenubarPortalProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Portal>;
export const MenubarPortal = MenubarPrimitive.Portal;

/** Props for {@link MenubarSub}. */
export type MenubarSubProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Sub>;
export const MenubarSub = MenubarPrimitive.Sub;

/** Props for {@link MenubarRadioGroup}. */
export type MenubarRadioGroupProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioGroup>;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

/** Props for {@link Menubar}. */
export type MenubarProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>;

export const Menubar = forwardRef<ComponentRef<typeof MenubarPrimitive.Root>, MenubarProps>(
  ({ className, ...props }, ref) => {
    return (
      <MenubarPrimitive.Root
        ref={ref}
        data-slot="menubar"
        className={cn(
          "flex items-center gap-1 rounded-md border border-border bg-surface-floating p-1 shadow-xs",
          className,
        )}
        {...props}
      />
    );
  },
);
Menubar.displayName = "Menubar";

/** Props for {@link MenubarTrigger}. */
export type MenubarTriggerProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>;

export const MenubarTrigger = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Trigger>,
  MenubarTriggerProps
>(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Trigger
      ref={ref}
      data-slot="menubar-trigger"
      className={cn(
        "flex cursor-default select-none items-center rounded-md px-3 py-1 text-sm font-medium outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[state=open]:bg-surface-overlay data-[state=open]:text-fg",
        className,
      )}
      {...props}
    />
  );
});
MenubarTrigger.displayName = "MenubarTrigger";

/** Props for {@link MenubarSubTrigger}. */
export type MenubarSubTriggerProps = ComponentPropsWithoutRef<
  typeof MenubarPrimitive.SubTrigger
> & {
  inset?: boolean;
};

export const MenubarSubTrigger = forwardRef<
  ComponentRef<typeof MenubarPrimitive.SubTrigger>,
  MenubarSubTriggerProps
>(({ className, inset, children, ...props }, ref) => {
  return (
    <MenubarPrimitive.SubTrigger
      ref={ref}
      data-slot="menubar-sub-trigger"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[state=open]:bg-surface-overlay data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        inset && "ps-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ms-auto" />
    </MenubarPrimitive.SubTrigger>
  );
});
MenubarSubTrigger.displayName = "MenubarSubTrigger";

/** Props for {@link MenubarSubContent}. */
export type MenubarSubContentProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>;

export const MenubarSubContent = forwardRef<
  ComponentRef<typeof MenubarPrimitive.SubContent>,
  MenubarSubContentProps
>(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.SubContent
      ref={ref}
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface-floating p-1 text-fg shadow-lg data-[state=open]:animate-[cronus-pop-in_180ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-pop-out_140ms_var(--ease-out-quart)_both]",
        className,
      )}
      {...props}
    />
  );
});
MenubarSubContent.displayName = "MenubarSubContent";

/** Props for {@link MenubarContent}. */
export type MenubarContentProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>;

export const MenubarContent = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Content>,
  MenubarContentProps
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-lg border border-border bg-surface-floating p-1 text-fg shadow-lg data-[state=open]:animate-[cronus-pop-in_180ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-pop-out_140ms_var(--ease-out-quart)_both]",
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
});
MenubarContent.displayName = "MenubarContent";

/** Props for {@link MenubarItem}. */
export type MenubarItemProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
};

export const MenubarItem = forwardRef<ComponentRef<typeof MenubarPrimitive.Item>, MenubarItemProps>(
  ({ className, inset, ...props }, ref) => {
    return (
      <MenubarPrimitive.Item
        ref={ref}
        data-slot="menubar-item"
        className={cn(
          "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
          inset && "ps-8",
          className,
        )}
        {...props}
      />
    );
  },
);
MenubarItem.displayName = "MenubarItem";

/** Props for {@link MenubarCheckboxItem}. */
export type MenubarCheckboxItemProps = ComponentPropsWithoutRef<
  typeof MenubarPrimitive.CheckboxItem
>;

export const MenubarCheckboxItem = forwardRef<
  ComponentRef<typeof MenubarPrimitive.CheckboxItem>,
  MenubarCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => {
  return (
    <MenubarPrimitive.CheckboxItem
      ref={ref}
      data-slot="menubar-checkbox-item"
      checked={checked}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md py-1.5 pe-2 ps-8 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Check className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
});
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

/** Props for {@link MenubarRadioItem}. */
export type MenubarRadioItemProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>;

export const MenubarRadioItem = forwardRef<
  ComponentRef<typeof MenubarPrimitive.RadioItem>,
  MenubarRadioItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <MenubarPrimitive.RadioItem
      ref={ref}
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md py-1.5 pe-2 ps-8 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
});
MenubarRadioItem.displayName = "MenubarRadioItem";

/** Props for {@link MenubarLabel}. */
export type MenubarLabelProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
};

export const MenubarLabel = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Label>,
  MenubarLabelProps
>(({ className, inset, ...props }, ref) => {
  return (
    <MenubarPrimitive.Label
      ref={ref}
      data-slot="menubar-label"
      className={cn("px-2 py-1.5 text-xs text-fg-tertiary", inset && "ps-8", className)}
      {...props}
    />
  );
});
MenubarLabel.displayName = "MenubarLabel";

/** Props for {@link MenubarSeparator}. */
export type MenubarSeparatorProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>;

export const MenubarSeparator = forwardRef<
  ComponentRef<typeof MenubarPrimitive.Separator>,
  MenubarSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Separator
      ref={ref}
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
});
MenubarSeparator.displayName = "MenubarSeparator";

/** Props for {@link MenubarShortcut}. */
export type MenubarShortcutProps = HTMLAttributes<HTMLSpanElement>;

export const MenubarShortcut = ({ className, ...props }: MenubarShortcutProps) => {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn("ms-auto text-xs tracking-widest text-fg-tertiary", className)}
      {...props}
    />
  );
};
MenubarShortcut.displayName = "MenubarShortcut";
