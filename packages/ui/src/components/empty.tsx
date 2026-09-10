import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Empty}. */
export type EmptyProps = HTMLAttributes<HTMLDivElement>;

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="empty"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface-inset/40 px-6 py-12 text-center",
        className,
      )}
      {...props}
    />
  );
});
Empty.displayName = "Empty";

/** Props for {@link EmptyIcon}. */
export type EmptyIconProps = HTMLAttributes<HTMLDivElement>;

export const EmptyIcon = forwardRef<HTMLDivElement, EmptyIconProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-icon"
        className={cn(
          "flex size-11 items-center justify-center rounded-full bg-surface-overlay text-fg-tertiary [&_svg]:size-5",
          className,
        )}
        {...props}
      />
    );
  },
);
EmptyIcon.displayName = "EmptyIcon";

/** Props for {@link EmptyTitle}. */
export type EmptyTitleProps = HTMLAttributes<HTMLDivElement>;

export const EmptyTitle = forwardRef<HTMLDivElement, EmptyTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-title"
        className={cn("font-display text-sm font-semibold text-fg", className)}
        {...props}
      />
    );
  },
);
EmptyTitle.displayName = "EmptyTitle";

/** Props for {@link EmptyDescription}. */
export type EmptyDescriptionProps = HTMLAttributes<HTMLDivElement>;

export const EmptyDescription = forwardRef<HTMLDivElement, EmptyDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-description"
        className={cn("max-w-sm text-sm text-fg-secondary", className)}
        {...props}
      />
    );
  },
);
EmptyDescription.displayName = "EmptyDescription";

/** Props for {@link EmptyContent}. */
export type EmptyContentProps = HTMLAttributes<HTMLDivElement>;

export const EmptyContent = forwardRef<HTMLDivElement, EmptyContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="empty-content"
        className={cn("mt-1 flex items-center gap-2", className)}
        {...props}
      />
    );
  },
);
EmptyContent.displayName = "EmptyContent";
