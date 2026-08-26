import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/**
 * Inline callout / banner. NOT the modal alert-dialog.
 *
 * Layout follows the shadcn pattern: a CSS grid where an optional leading
 * icon occupies the first column and the title/description stack in the
 * second. When no icon is rendered the content spans the full width.
 *
 * Colour strategy: the body text stays on `fg`/`fg-secondary` (which already
 * meet AA against every surface) while the semantic token only tints the
 * surface wash, the border and the icon. This keeps contrast safe across
 * themes/modes without relying on low-chroma coloured body text.
 */
const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[--spacing(6)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-surface-overlay text-fg border-border [&>svg]:text-fg-secondary",
        info: "bg-info/10 text-fg border-info/30 [&>svg]:text-info",
        success: "bg-success/10 text-fg border-success/30 [&>svg]:text-success",
        warning: "bg-warning/10 text-fg border-warning/30 [&>svg]:text-warning",
        // `destructive` keeps the conventional shadcn name but maps to the
        // Kronus `error` token (mirrors button.tsx's destructive variant).
        destructive: "bg-error/10 text-fg border-error/30 [&>svg]:text-error",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, role, ...props }, ref) => {
    // Urgent variants announce assertively; informational ones are polite.
    const resolvedRole = role ?? (variant === "destructive" ? "alert" : "status");
    return (
      <div
        ref={ref}
        data-slot="alert"
        role={resolvedRole}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
Alert.displayName = "Alert";

export const AlertTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-title"
        className={cn(
          "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight text-fg",
          className,
        )}
        {...props}
      />
    );
  },
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-fg-secondary [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export { alertVariants };
