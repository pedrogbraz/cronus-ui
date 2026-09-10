"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { VariantProps } from "class-variance-authority";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  createContext,
  forwardRef,
  useContext,
} from "react";
import { cn } from "../lib/cn.js";
import { toggleVariants } from "./toggle.js";

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
  variant: "default",
  size: "md",
});

/** Props for {@link ToggleGroup}. */
export type ToggleGroupProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>;

export const ToggleGroup = forwardRef<
  ComponentRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});
ToggleGroup.displayName = "ToggleGroup";

/** Props for {@link ToggleGroupItem}. */
export type ToggleGroupItemProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>;

export const ToggleGroupItem = forwardRef<
  ComponentRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, variant, size, ...props }, ref) => {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
        }),
        className,
      )}
      {...props}
    />
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";
