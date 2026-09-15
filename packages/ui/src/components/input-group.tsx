import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="input-group"
        className={cn(
          "flex h-10 w-full items-stretch overflow-hidden rounded-lg border border-border bg-surface-inset text-sm",
          "transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)]",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-surface-base",
          "has-[input[aria-invalid=true]]:border-error has-[input[aria-invalid=true]]:ring-2 has-[input[aria-invalid=true]]:ring-error/30",
          "[&_input]:h-full [&_input]:rounded-none [&_input]:border-0 [&_input]:bg-transparent [&_input]:shadow-none",
          "[&_input]:ring-0 [&_input]:focus-visible:ring-0 [&_input]:focus-visible:ring-offset-0",
          className,
        )}
        {...props}
      />
    );
  },
);
InputGroup.displayName = "InputGroup";

export interface InputGroupAddonProps extends HTMLAttributes<HTMLDivElement> {
  /** Which side the addon flanks. Affects the divider edge. Defaults to "start". */
  align?: "start" | "end";
}

export const InputGroupAddon = forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "start", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="input-group-addon"
        data-align={align}
        className={cn(
          "flex shrink-0 select-none items-center gap-1.5 whitespace-nowrap px-3 text-fg-tertiary",
          "[&_svg]:size-4 [&_svg]:shrink-0",
          align === "start" ? "border-e border-border" : "border-s border-border",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
InputGroupAddon.displayName = "InputGroupAddon";
