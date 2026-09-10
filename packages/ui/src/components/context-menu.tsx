"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link ContextMenu}. */
export type ContextMenuProps = ComponentProps<typeof ContextMenuPrimitive.Root>;

/** Non-modal by default — same scroll-lock trap as {@link DropdownMenu}. */
export function ContextMenu({ modal = false, ...props }: ContextMenuProps) {
  return <ContextMenuPrimitive.Root modal={modal} {...props} />;
}

/** Props for {@link ContextMenuTrigger}. */
export type ContextMenuTriggerProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

/** Props for {@link ContextMenuGroup}. */
export type ContextMenuGroupProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Group>;
export const ContextMenuGroup = ContextMenuPrimitive.Group;

/** Props for {@link ContextMenuPortal}. */
export type ContextMenuPortalProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Portal>;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;

/** Props for {@link ContextMenuSub}. */
export type ContextMenuSubProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Sub>;
export const ContextMenuSub = ContextMenuPrimitive.Sub;

/** Props for {@link ContextMenuRadioGroup}. */
export type ContextMenuRadioGroupProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.RadioGroup
>;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

/** Props for {@link ContextMenuSubTrigger}. */
export type ContextMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubTrigger
> & {
  inset?: boolean;
};

export const ContextMenuSubTrigger = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      data-slot="context-menu-sub-trigger"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[state=open]:bg-surface-overlay data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        inset && "ps-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ms-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
});
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

/** Props for {@link ContextMenuSubContent}. */
export type ContextMenuSubContentProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubContent
>;

export const ContextMenuSubContent = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuSubContentProps
>(({ className, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.SubContent
      ref={ref}
      data-slot="context-menu-sub-content"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface-floating p-1 text-fg shadow-lg data-[state=open]:animate-[cronus-pop-in_180ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-pop-out_140ms_var(--ease-out-quart)_both]",
        className,
      )}
      {...props}
    />
  );
});
ContextMenuSubContent.displayName = "ContextMenuSubContent";

/** Props for {@link ContextMenuContent}. */
export type ContextMenuContentProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>;

export const ContextMenuContent = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ className, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        data-slot="context-menu-content"
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface-floating p-1 text-fg shadow-lg data-[state=open]:animate-[cronus-pop-in_180ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-pop-out_140ms_var(--ease-out-quart)_both]",
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
});
ContextMenuContent.displayName = "ContextMenuContent";

/** Props for {@link ContextMenuItem}. */
export type ContextMenuItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
};

export const ContextMenuItem = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, inset, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      data-slot="context-menu-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        inset && "ps-8",
        className,
      )}
      {...props}
    />
  );
});
ContextMenuItem.displayName = "ContextMenuItem";

/** Props for {@link ContextMenuCheckboxItem}. */
export type ContextMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.CheckboxItem
>;

export const ContextMenuCheckboxItem = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      data-slot="context-menu-checkbox-item"
      checked={checked}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md py-1.5 pe-2 ps-8 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Check className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
});
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

/** Props for {@link ContextMenuRadioItem}. */
export type ContextMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.RadioItem
>;

export const ContextMenuRadioItem = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      data-slot="context-menu-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md py-1.5 pe-2 ps-8 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
});
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

/** Props for {@link ContextMenuLabel}. */
export type ContextMenuLabelProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
};

export const ContextMenuLabel = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Label>,
  ContextMenuLabelProps
>(({ className, inset, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      data-slot="context-menu-label"
      className={cn("px-2 py-1.5 text-xs text-fg-tertiary", inset && "ps-8", className)}
      {...props}
    />
  );
});
ContextMenuLabel.displayName = "ContextMenuLabel";

/** Props for {@link ContextMenuSeparator}. */
export type ContextMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Separator
>;

export const ContextMenuSeparator = forwardRef<
  ComponentRef<typeof ContextMenuPrimitive.Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
});
ContextMenuSeparator.displayName = "ContextMenuSeparator";

/** Props for {@link ContextMenuShortcut}. */
export type ContextMenuShortcutProps = HTMLAttributes<HTMLSpanElement>;

export const ContextMenuShortcut = ({ className, ...props }: ContextMenuShortcutProps) => {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn("ms-auto text-xs tracking-widest text-fg-tertiary", className)}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";
