import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Card}. */
export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        "flex w-full min-w-0 flex-col gap-6 rounded-xl border border-border bg-surface-raised py-6 text-fg shadow-sm",
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

/** Props for {@link CardHeader}. */
export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(
          "grid min-w-0 auto-rows-min grid-cols-[minmax(0,1fr)_auto] items-start gap-1.5 px-4 sm:px-6",
          className,
        )}
        {...props}
      />
    );
  },
);
CardHeader.displayName = "CardHeader";

/** Props for {@link CardTitle}. */
export type CardTitleProps = HTMLAttributes<HTMLDivElement>;

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-title"
        className={cn(
          "min-w-0 break-words font-display font-semibold leading-none text-fg",
          className,
        )}
        {...props}
      />
    );
  },
);
CardTitle.displayName = "CardTitle";

/** Props for {@link CardDescription}. */
export type CardDescriptionProps = HTMLAttributes<HTMLDivElement>;

export const CardDescription = forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-description"
        className={cn("col-span-full text-sm text-fg-secondary", className)}
        {...props}
      />
    );
  },
);
CardDescription.displayName = "CardDescription";

/** Props for {@link CardAction}. */
export type CardActionProps = HTMLAttributes<HTMLDivElement>;

export const CardAction = forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-action"
        className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
        {...props}
      />
    );
  },
);
CardAction.displayName = "CardAction";

/** Props for {@link CardContent}. */
export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn("min-w-0 px-4 text-fg-secondary sm:px-6", className)}
        {...props}
      />
    );
  },
);
CardContent.displayName = "CardContent";

/** Props for {@link CardFooter}. */
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn("flex min-w-0 items-center gap-3 px-4 sm:px-6", className)}
        {...props}
      />
    );
  },
);
CardFooter.displayName = "CardFooter";
