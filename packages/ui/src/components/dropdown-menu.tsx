"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link DropdownMenu}. */
export type DropdownMenuProps = ComponentProps<typeof DropdownMenuPrimitive.Root>;

/**
 * Non-modal by default. Radix's modal dropdown installs RemoveScroll on
 * `body`, which unsticks site chrome (`position: sticky` + `overflow-x: clip`)
 * and makes the navbar/sidebar jump. A menu is not a dialog — don't lock the page.
 */
export function DropdownMenu({ modal = false, ...props }: DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root modal={modal} {...props} />;
}

/** Props for {@link DropdownMenuTrigger}. */
export type DropdownMenuTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

/** Props for {@link DropdownMenuGroup}. */
export type DropdownMenuGroupProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/** Props for {@link DropdownMenuPortal}. */
export type DropdownMenuPortalProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Portal>;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

/** Props for {@link DropdownMenuSub}. */
export type DropdownMenuSubProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/** Props for {@link DropdownMenuRadioGroup}. */
export type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioGroup
>;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/** Props for {@link DropdownMenuSubTrigger}. */
export type DropdownMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean;
};

export const DropdownMenuSubTrigger = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[state=open]:bg-surface-overlay data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        inset && "ps-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ms-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

/** Props for {@link DropdownMenuSubContent}. */
export type DropdownMenuSubContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubContent
>;

export const DropdownMenuSubContent = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface-floating p-1 text-fg shadow-lg data-[state=open]:animate-[cronus-pop-in_180ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-pop-out_140ms_var(--ease-out-quart)_both]",
        className,
      )}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

/** Props for {@link DropdownMenuContent}. */
export type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;

export const DropdownMenuContent = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface-floating p-1 text-fg shadow-lg data-[state=open]:animate-[cronus-pop-in_180ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[cronus-pop-out_140ms_var(--ease-out-quart)_both]",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

/** Props for {@link DropdownMenuItem}. */
export type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
};

export const DropdownMenuItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        inset && "ps-8",
        className,
      )}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

/** Props for {@link DropdownMenuCheckboxItem}. */
export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
>;

export const DropdownMenuCheckboxItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md py-1.5 pe-2 ps-8 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

/** Props for {@link DropdownMenuRadioItem}. */
export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioItem
>;

export const DropdownMenuRadioItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md py-1.5 pe-2 ps-8 text-sm outline-none transition-colors focus:bg-surface-overlay focus:text-fg data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

/** Props for {@link DropdownMenuLabel}. */
export type DropdownMenuLabelProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
> & {
  inset?: boolean;
};

export const DropdownMenuLabel = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-xs text-fg-tertiary", inset && "ps-8", className)}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = "DropdownMenuLabel";

/** Props for {@link DropdownMenuSeparator}. */
export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

export const DropdownMenuSeparator = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

/** Props for {@link DropdownMenuShortcut}. */
export type DropdownMenuShortcutProps = HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuShortcut = ({ className, ...props }: DropdownMenuShortcutProps) => {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ms-auto text-xs tracking-widest text-fg-tertiary", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
