import { forwardRef, type HTMLAttributes, type LabelHTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Field}. */
export type FieldProps = HTMLAttributes<HTMLDivElement>;

export const Field = forwardRef<HTMLDivElement, FieldProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
});
Field.displayName = "Field";

/** Props for {@link FieldLabel}. */
export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: reusable label primitive; consumers associate a control via htmlFor.
      <label
        ref={ref}
        data-slot="field-label"
        className={cn("text-sm font-medium text-fg leading-none select-none", className)}
        {...props}
      />
    );
  },
);
FieldLabel.displayName = "FieldLabel";

/** Props for {@link FieldDescription}. */
export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-slot="field-description"
        className={cn("text-xs text-fg-secondary", className)}
        {...props}
      />
    );
  },
);
FieldDescription.displayName = "FieldDescription";

/** Props for {@link FieldError}. */
export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement>;

export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        data-slot="field-error"
        role="alert"
        className={cn("text-xs text-error-strong", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);
FieldError.displayName = "FieldError";
