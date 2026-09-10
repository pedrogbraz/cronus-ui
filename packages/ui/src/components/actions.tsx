import { cva } from "class-variance-authority";
import type { HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";
import { Button, type ButtonProps } from "./button.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

export const actionVariants = cva("relative text-fg-tertiary hover:text-fg");

export interface ActionsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Actions({ className, ref, ...props }: ActionsProps) {
  return (
    <div
      ref={ref}
      data-slot="actions"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

export interface ActionProps extends ButtonProps {
  tooltip?: string;
  label?: string;
}

export function Action({
  tooltip,
  children,
  label,
  className,
  variant = "ghost",
  size = "icon-sm",
  ref,
  "aria-label": ariaLabel,
  ...props
}: ActionProps & { ref?: Ref<HTMLButtonElement> }) {
  const accessibleName = ariaLabel ?? label ?? tooltip;
  const button = (
    <Button
      ref={ref}
      data-slot="action"
      type="button"
      variant={variant}
      size={size}
      aria-label={accessibleName}
      className={cn(actionVariants(), className)}
      {...props}
    >
      {children}
    </Button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
