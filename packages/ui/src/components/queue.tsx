import { cva } from "class-variance-authority";
import { ChevronDown, Paperclip } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  ImgHTMLAttributes,
  LiHTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";

export type QueueMessagePart = {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
};

export type QueueMessage = {
  id: string;
  parts: QueueMessagePart[];
};

export type QueueTodo = {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
};

export const queueVariants = cva(
  "flex flex-col gap-2 rounded-xl border border-border bg-surface-base px-3 pb-2 pt-2 shadow-xs",
);

export const queueItemVariants = cva(
  "group flex flex-col gap-1 rounded-md px-3 py-1 text-sm transition-colors hover:bg-surface-overlay",
);

export const queueItemIndicatorVariants = cva("mt-0.5 inline-block size-2.5 rounded-full border", {
  variants: {
    completed: {
      true: "border-fg-tertiary/20 bg-fg-tertiary/10",
      false: "border-fg-tertiary/50",
    },
  },
  defaultVariants: { completed: false },
});

export const queueItemContentVariants = cva("line-clamp-1 grow break-words", {
  variants: {
    completed: {
      true: "text-fg-tertiary/50 line-through",
      false: "text-fg-tertiary",
    },
  },
  defaultVariants: { completed: false },
});

export const queueItemDescriptionVariants = cva("ms-6 text-xs", {
  variants: {
    completed: {
      true: "text-fg-tertiary/40 line-through",
      false: "text-fg-tertiary",
    },
  },
  defaultVariants: { completed: false },
});

export const queueItemFileVariants = cva(
  "flex items-center gap-1 rounded border border-border bg-surface-overlay px-2 py-1 text-xs",
);

export const queueSectionTriggerVariants = cva(
  "group flex w-full items-center justify-between rounded-md bg-surface-overlay/40 px-3 py-2 text-start text-sm text-fg transition-colors hover:bg-surface-overlay outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
);

export interface QueueItemProps extends LiHTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>;
}

export function QueueItem({ className, ref, ...props }: QueueItemProps) {
  return (
    <li
      ref={ref}
      data-slot="queue-item"
      className={cn(queueItemVariants(), className)}
      {...props}
    />
  );
}

export interface QueueItemIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  completed?: boolean;
}

export function QueueItemIndicator({
  completed = false,
  className,
  ref,
  ...props
}: QueueItemIndicatorProps) {
  return (
    <span
      ref={ref}
      data-slot="queue-item-indicator"
      className={cn(queueItemIndicatorVariants({ completed }), className)}
      {...props}
    />
  );
}

export interface QueueItemContentProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  completed?: boolean;
}

export function QueueItemContent({
  completed = false,
  className,
  ref,
  ...props
}: QueueItemContentProps) {
  return (
    <span
      ref={ref}
      data-slot="queue-item-content"
      className={cn(queueItemContentVariants({ completed }), className)}
      {...props}
    />
  );
}

export interface QueueItemDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  completed?: boolean;
}

export function QueueItemDescription({
  completed = false,
  className,
  ref,
  ...props
}: QueueItemDescriptionProps) {
  return (
    <div
      ref={ref}
      data-slot="queue-item-description"
      className={cn(queueItemDescriptionVariants({ completed }), className)}
      {...props}
    />
  );
}

export interface QueueItemActionsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function QueueItemActions({ className, ref, ...props }: QueueItemActionsProps) {
  return (
    <div
      ref={ref}
      data-slot="queue-item-actions"
      className={cn("flex gap-1", className)}
      {...props}
    />
  );
}

export interface QueueItemActionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  ref?: Ref<HTMLButtonElement>;
}

export function QueueItemAction({ className, ref, ...props }: QueueItemActionProps) {
  return (
    <Button
      ref={ref}
      data-slot="queue-item-action"
      className={cn(
        "size-auto rounded p-1 text-fg-tertiary opacity-0 transition-opacity hover:bg-fg-tertiary/10 hover:text-fg group-hover:opacity-100 focus-visible:opacity-100",
        className,
      )}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    />
  );
}

export interface QueueItemAttachmentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function QueueItemAttachment({ className, ref, ...props }: QueueItemAttachmentProps) {
  return (
    <div
      ref={ref}
      data-slot="queue-item-attachment"
      className={cn("mt-1 flex flex-wrap gap-2", className)}
      {...props}
    />
  );
}

export interface QueueItemImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  ref?: Ref<HTMLImageElement>;
}

export function QueueItemImage({ className, ref, ...props }: QueueItemImageProps) {
  return (
    <img
      ref={ref}
      alt=""
      data-slot="queue-item-image"
      className={cn("size-8 rounded border border-border object-cover", className)}
      height={32}
      width={32}
      {...props}
    />
  );
}

export interface QueueItemFileProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
}

export function QueueItemFile({ children, className, ref, ...props }: QueueItemFileProps) {
  return (
    <span
      ref={ref}
      data-slot="queue-item-file"
      className={cn(queueItemFileVariants(), className)}
      {...props}
    >
      <Paperclip size={12} />
      <span className="max-w-[100px] truncate">{children}</span>
    </span>
  );
}

export interface QueueListProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function QueueList({ children, className, ref, ...props }: QueueListProps) {
  return (
    <div
      ref={ref}
      data-slot="queue-list"
      className={cn("mt-2 -mb-1 overflow-y-auto", className)}
      {...props}
    >
      <div className="max-h-40 pe-4">
        <ul>{children}</ul>
      </div>
    </div>
  );
}

export interface QueueSectionProps extends ComponentProps<typeof Collapsible> {
  /** Taki alias for `defaultOpen`. */
  defaultExpanded?: boolean;
}

export function QueueSection({
  className,
  defaultExpanded = true,
  defaultOpen,
  ...props
}: QueueSectionProps) {
  return (
    <Collapsible
      data-slot="queue-section"
      className={cn(className)}
      defaultOpen={defaultOpen ?? defaultExpanded}
      {...props}
    />
  );
}

export interface QueueSectionTriggerProps extends ComponentProps<typeof CollapsibleTrigger> {}

export function QueueSectionTrigger({ children, className, ...props }: QueueSectionTriggerProps) {
  return (
    <CollapsibleTrigger
      data-slot="queue-section-trigger"
      className={cn(queueSectionTriggerVariants(), className)}
      {...props}
    >
      {children}
    </CollapsibleTrigger>
  );
}

export interface QueueSectionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  count?: number;
  label: string;
  icon?: ReactNode;
}

export function QueueSectionLabel({
  count,
  label,
  icon,
  className,
  ref,
  ...props
}: QueueSectionLabelProps) {
  return (
    <span
      ref={ref}
      data-slot="queue-section-label"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    >
      <ChevronDown
        aria-hidden
        className="size-4 transition-transform group-data-[state=closed]:-rotate-90"
      />
      <span>{count == null ? label : `${count} ${label}`}</span>
      <span className="ms-auto inline-block">{icon}</span>
    </span>
  );
}

export interface QueueSectionContentProps extends ComponentProps<typeof CollapsibleContent> {}

export function QueueSectionContent({ className, ...props }: QueueSectionContentProps) {
  return (
    <CollapsibleContent data-slot="queue-section-content" className={cn(className)} {...props} />
  );
}

export interface QueueProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Queue({ className, ref, ...props }: QueueProps) {
  return <div ref={ref} data-slot="queue" className={cn(queueVariants(), className)} {...props} />;
}
