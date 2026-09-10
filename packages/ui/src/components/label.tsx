import * as LabelPrimitive from "@radix-ui/react-label";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Label}. */
export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

export const Label = forwardRef<ComponentRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <LabelPrimitive.Root
        ref={ref}
        data-slot="label"
        className={cn(
          "text-sm font-medium text-fg leading-none select-none",
          "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    );
  },
);
Label.displayName = "Label";
