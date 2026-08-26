import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-surface-overlay text-fg border-border",
        // Solid fill (not a 15% tint) so the label clears WCAG AA on every
        // theme/mode: same-hue text on a pale primary tint reads <4.5:1 in the
        // bright-accent light themes, whereas primary-foreground on solid primary
        // is >=5:1 everywhere.
        primary: "bg-primary text-primary-foreground border-transparent",
        secondary: "bg-surface-overlay text-fg-secondary border-border",
        outline: "text-fg border-border",
        // Same-hue text on a 15% tint reads <4.5:1 in several themes, so the
        // label uses the AA-tuned `*-strong` text variant (the tint stays the raw
        // fill). See @cronus-ui/tokens CONTRACT.md.
        success: "bg-success/15 text-success-strong border-transparent",
        warning: "bg-warning/15 text-warning-strong border-transparent",
        destructive: "bg-error/15 text-error-strong border-transparent",
        // `error` is a deprecated alias of `destructive`; kept for backward
        // compatibility. Prefer `destructive` to match Button/Alert.
        error: "bg-error/15 text-error-strong border-transparent",
        info: "bg-info/15 text-info-strong border-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { badgeVariants };
