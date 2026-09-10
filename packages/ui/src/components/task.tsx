import { cva } from "class-variance-authority";
import { ChevronRight, type LucideIcon, Search } from "lucide-react";
import type { ComponentProps, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";

export const taskItemFileVariants = cva(
  "inline-flex items-center gap-1 rounded-md border border-border bg-surface-overlay px-1.5 py-0.5 text-xs text-fg",
);

export const taskItemVariants = cva("text-sm text-fg-tertiary");

export const taskContentVariants = cva(
  "text-fg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2",
);

export interface TaskItemFileProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function TaskItemFile({ children, className, ref, ...props }: TaskItemFileProps) {
  return (
    <div
      ref={ref}
      data-slot="task-item-file"
      className={cn(taskItemFileVariants(), className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TaskItemProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function TaskItem({ children, className, ref, ...props }: TaskItemProps) {
  return (
    <div ref={ref} data-slot="task-item" className={cn(taskItemVariants(), className)} {...props}>
      {children}
    </div>
  );
}

export interface TaskProps extends ComponentProps<typeof Collapsible> {}

export function Task({ defaultOpen = true, className, ...props }: TaskProps) {
  return (
    <Collapsible data-slot="task" className={cn(className)} defaultOpen={defaultOpen} {...props} />
  );
}

export interface TaskTriggerProps extends ComponentProps<typeof CollapsibleTrigger> {
  title: string;
  icon?: LucideIcon;
}

export function TaskTrigger({
  children,
  className,
  title,
  icon: Icon = Search,
  ...props
}: TaskTriggerProps) {
  return (
    <CollapsibleTrigger
      data-slot="task-trigger"
      className={cn(
        "group rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
        className,
      )}
      {...props}
    >
      {children ?? (
        <div className="flex w-full cursor-pointer items-center gap-2 text-sm text-fg-tertiary transition-colors hover:text-fg">
          <div className="relative size-4">
            <ChevronRight
              aria-hidden
              className={cn(
                "absolute start-0 top-0 size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                "group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-100",
              )}
            />
            <Icon
              className={cn(
                "size-4 transition-transform group-hover:scale-0 group-focus-visible:scale-0",
                "group-data-[state=open]:scale-0",
              )}
            />
          </div>
          <p className="text-sm">{title}</p>
        </div>
      )}
    </CollapsibleTrigger>
  );
}

export interface TaskContentProps extends ComponentProps<typeof CollapsibleContent> {}

export function TaskContent({ children, className, ...props }: TaskContentProps) {
  return (
    <CollapsibleContent
      data-slot="task-content"
      className={cn(taskContentVariants(), className)}
      {...props}
    >
      <div className="mt-2 space-y-2 border-s-2 border-border ps-4">{children}</div>
    </CollapsibleContent>
  );
}
