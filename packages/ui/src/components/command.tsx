"use client";

import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";
import { cn } from "../lib/cn.js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog.js";

export const Command = forwardRef<
  ComponentRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => {
  return (
    <CommandPrimitive
      ref={ref}
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg bg-surface-floating text-fg",
        className,
      )}
      {...props}
    />
  );
});
Command.displayName = "Command";

export interface CommandDialogProps extends ComponentProps<typeof Dialog> {
  title?: string;
  description?: string;
}

export const CommandDialog = ({
  title = "Command Menu",
  description = "Search for a command to run...",
  children,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-border-soft bg-surface-floating/65 p-0 shadow-[0_28px_90px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl backdrop-saturate-150 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-fg/20 before:to-transparent">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command className="bg-transparent [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-fg-tertiary [&_[cmdk-input-wrapper]]:border-border/60 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:rounded-lg [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]_svg]:size-5 [&_[cmdk-item][data-selected=true]]:bg-fg/10">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};
CommandDialog.displayName = "CommandDialog";

export const CommandInput = forwardRef<
  ComponentRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center gap-2 border-b border-border px-3"
      cmdk-input-wrapper=""
    >
      <Search className="size-4 shrink-0 text-fg-tertiary" />
      <CommandPrimitive.Input
        ref={ref}
        data-slot="command-input"
        className={cn(
          "flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-fg-tertiary disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = "CommandInput";

export const CommandList = forwardRef<
  ComponentRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => {
  return (
    <CommandPrimitive.List
      ref={ref}
      data-slot="command-list"
      className={cn("max-h-80 scroll-py-1 overflow-y-auto overflow-x-hidden p-1", className)}
      {...props}
    />
  );
});
CommandList.displayName = "CommandList";

export const CommandEmpty = forwardRef<
  ComponentRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm text-fg-secondary", className)}
      {...props}
    />
  );
});
CommandEmpty.displayName = "CommandEmpty";

export const CommandGroup = forwardRef<
  ComponentRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => {
  return (
    <CommandPrimitive.Group
      ref={ref}
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-fg [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-fg-tertiary",
        className,
      )}
      {...props}
    />
  );
});
CommandGroup.displayName = "CommandGroup";

export const CommandItem = forwardRef<
  ComponentRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <CommandPrimitive.Item
      ref={ref}
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-surface-overlay data-[selected=true]:text-fg data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
});
CommandItem.displayName = "CommandItem";

export const CommandShortcut = ({ className, ...props }: ComponentProps<"span">) => {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("ms-auto text-xs tracking-widest text-fg-tertiary", className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export const CommandSeparator = forwardRef<
  ComponentRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => {
  return (
    <CommandPrimitive.Separator
      ref={ref}
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  );
});
CommandSeparator.displayName = "CommandSeparator";
