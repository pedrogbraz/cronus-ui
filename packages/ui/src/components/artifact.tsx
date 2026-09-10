import { cva } from "class-variance-authority";
import { type LucideIcon, X } from "lucide-react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

export const artifactVariants = cva(
  "flex flex-col overflow-hidden rounded-lg border border-border bg-surface-base shadow-sm",
);

export const artifactHeaderVariants = cva(
  "flex items-center justify-between border-b border-border bg-surface-overlay/50 px-4 py-3",
);

export const artifactTitleVariants = cva("text-sm font-medium text-fg");

export const artifactDescriptionVariants = cva("text-sm text-fg-tertiary");

export const artifactActionsVariants = cva("flex items-center gap-1");

export const artifactContentVariants = cva("flex-1 overflow-auto p-4");

export const artifactCloseVariants = cva("text-fg-tertiary hover:text-fg");

export const artifactActionVariants = cva("text-fg-tertiary hover:text-fg");

export interface ArtifactProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Artifact({ className, ref, ...props }: ArtifactProps) {
  return (
    <div ref={ref} data-slot="artifact" className={cn(artifactVariants(), className)} {...props} />
  );
}

export interface ArtifactHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function ArtifactHeader({ className, ref, ...props }: ArtifactHeaderProps) {
  return (
    <div
      ref={ref}
      data-slot="artifact-header"
      className={cn(artifactHeaderVariants(), className)}
      {...props}
    />
  );
}

export interface ArtifactCloseLabels {
  close: string;
}

export interface ArtifactCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  labels?: Partial<ArtifactCloseLabels>;
  variant?: "ghost" | "outline" | "primary" | "secondary" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon" | "icon-sm";
}

const DEFAULT_CLOSE_LABELS: ArtifactCloseLabels = {
  close: "Close",
};

export function ArtifactClose({
  className,
  children,
  size = "icon-sm",
  variant = "ghost",
  labels: labelsProp,
  ref,
  ...props
}: ArtifactCloseProps) {
  const labels = { ...DEFAULT_CLOSE_LABELS, ...labelsProp };

  return (
    <Button
      ref={ref}
      data-slot="artifact-close"
      className={cn(artifactCloseVariants(), className)}
      size={size}
      type="button"
      variant={variant}
      aria-label={labels.close}
      {...props}
    >
      {children ?? <X className="size-4" aria-hidden />}
    </Button>
  );
}

export interface ArtifactTitleProps extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

export function ArtifactTitle({ className, ref, ...props }: ArtifactTitleProps) {
  return (
    <p
      ref={ref}
      data-slot="artifact-title"
      className={cn(artifactTitleVariants(), className)}
      {...props}
    />
  );
}

export interface ArtifactDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

export function ArtifactDescription({ className, ref, ...props }: ArtifactDescriptionProps) {
  return (
    <p
      ref={ref}
      data-slot="artifact-description"
      className={cn(artifactDescriptionVariants(), className)}
      {...props}
    />
  );
}

export interface ArtifactActionsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function ArtifactActions({ className, ref, ...props }: ArtifactActionsProps) {
  return (
    <div
      ref={ref}
      data-slot="artifact-actions"
      className={cn(artifactActionsVariants(), className)}
      {...props}
    />
  );
}

export interface ArtifactActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  tooltip?: string;
  label?: string;
  icon?: LucideIcon;
  variant?: "ghost" | "outline" | "primary" | "secondary" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon" | "icon-sm";
  children?: ReactNode;
}

export function ArtifactAction({
  tooltip,
  label,
  icon: Icon,
  children,
  className,
  size = "icon-sm",
  variant = "ghost",
  ref,
  ...props
}: ArtifactActionProps) {
  const button = (
    <Button
      ref={ref}
      data-slot="artifact-action"
      className={cn(artifactActionVariants(), className)}
      size={size}
      type="button"
      variant={variant}
      aria-label={label || tooltip}
      {...props}
    >
      {Icon ? <Icon className="size-4" aria-hidden /> : children}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

export interface ArtifactContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function ArtifactContent({ className, ref, ...props }: ArtifactContentProps) {
  return (
    <div
      ref={ref}
      data-slot="artifact-content"
      className={cn(artifactContentVariants(), className)}
      {...props}
    />
  );
}
