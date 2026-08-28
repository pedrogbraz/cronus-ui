"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { forwardRef, type HTMLAttributes, type ReactNode, useCallback, useState } from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";

/**
 * Dismissible announcement / promo bar — a full-width horizontal strip pinned
 * to the top of a page or section (the "Top Banner" of a billing SDK). Renders
 * an optional leading icon, the message (a `title` + optional `description`, or
 * free-form `children`), an optional right-aligned `action` (a CTA Button or
 * link), and — when `dismissible` — a trailing close button.
 *
 * Colour strategy mirrors {@link Alert}: semantic variants tint the surface
 * wash + border + icon while the body text stays on `fg`/`fg-secondary` (which
 * meet AA against every surface), so contrast is safe across themes/modes
 * without low-chroma coloured body text. The `brand` variant is the exception:
 * it's a solid `bg-primary` promo fill carrying `primary-foreground` text, and
 * everything inside (icon, action, close) inherits that foreground.
 */
const bannerVariants = cva(
  "flex w-full items-center gap-x-3 gap-y-1 border-b px-4 py-2.5 text-sm [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-surface-overlay text-fg border-border [&>svg]:text-fg-secondary",
        // Solid primary promo fill; icon/action/close inherit the foreground.
        brand:
          "bg-primary text-primary-foreground border-transparent [&>svg]:text-primary-foreground",
        info: "bg-info/10 text-fg border-info/30 [&>svg]:text-info",
        success: "bg-success/10 text-fg border-success/30 [&>svg]:text-success",
        warning: "bg-warning/10 text-fg border-warning/30 [&>svg]:text-warning",
        error: "bg-error/10 text-fg border-error/30 [&>svg]:text-error",
      },
      align: {
        start: "text-left",
        // Centre the message block; the action + close are still pinned to the
        // far right via `ml-auto`, so "centre" balances the message in the gap.
        center: "text-center",
      },
    },
    defaultVariants: { variant: "default", align: "center" },
  },
);

export interface BannerProps
  extends Omit<HTMLAttributes<HTMLElement>, "title">,
    VariantProps<typeof bannerVariants> {
  /** Headline text. Pair with `description`, or omit and pass `children`. */
  title?: ReactNode;
  /** Optional secondary line shown after the title. */
  description?: ReactNode;
  /** Leading glyph rendered before the message (e.g. a lucide icon). */
  icon?: ReactNode;
  /** Right-aligned call to action (a {@link Button}, link, etc.). */
  action?: ReactNode;
  /** Render a trailing close button. Defaults to `true`. */
  dismissible?: boolean;
  /** Fired after the banner is dismissed (controlled or not). */
  onDismiss?: () => void;
  /** Controlled visibility. When provided, the component is fully controlled. */
  open?: boolean;
  /** Initial visibility for the uncontrolled case. Defaults to `true`. */
  defaultOpen?: boolean;
  /** Accessible label for the announcement region. Defaults to "Announcement". */
  label?: string;
  /** Free-form message body, used when `title`/`description` are not supplied. */
  children?: ReactNode;
}

/**
 * Collapse + fade used on dismiss. Honours `prefers-reduced-motion`: opted-out
 * users get an instant unmount (the variant resolves to a no-op below).
 */
const COLLAPSE = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
} as const;

export const Banner = forwardRef<HTMLElement, BannerProps>(
  (
    {
      className,
      variant,
      align,
      title,
      description,
      icon,
      action,
      dismissible = true,
      onDismiss,
      open: openProp,
      defaultOpen = true,
      label = "Announcement",
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const isOpen = isControlled ? openProp : uncontrolledOpen;
    const prefersReducedMotion = useReducedMotion();

    const handleDismiss = useCallback(() => {
      if (!isControlled) {
        setUncontrolledOpen(false);
      }
      onDismiss?.();
    }, [isControlled, onDismiss]);

    // Brand fill wants action/close on the primary foreground; tinted variants
    // keep the muted-foreground treatment from the shared Button styles.
    const onBrand = variant === "brand";

    return (
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            // The collapse wrapper owns overflow so the height tween clips cleanly;
            // the visual bar (border/padding/colour) lives on the inner element.
            initial={prefersReducedMotion ? false : COLLAPSE.initial}
            animate={prefersReducedMotion ? undefined : COLLAPSE.animate}
            exit={prefersReducedMotion ? undefined : COLLAPSE.exit}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <section
              ref={ref}
              aria-label={label}
              data-slot="banner"
              className={cn(bannerVariants({ variant, align }), className)}
              {...props}
            >
              {icon}

              <div
                data-slot="banner-content"
                className={cn(
                  "flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5",
                  align === "center" && "justify-center",
                )}
              >
                {title ? (
                  <span data-slot="banner-title" className="font-medium">
                    {title}
                  </span>
                ) : null}
                {description ? (
                  <span
                    data-slot="banner-description"
                    className={cn(onBrand ? "text-primary-foreground/85" : "text-fg-secondary")}
                  >
                    {description}
                  </span>
                ) : null}
                {children}
              </div>

              {action ? (
                <div data-slot="banner-action" className="ml-auto flex shrink-0 items-center gap-2">
                  {action}
                </div>
              ) : null}

              {dismissible ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Dismiss"
                  data-slot="banner-dismiss"
                  onClick={handleDismiss}
                  className={cn(
                    "shrink-0",
                    // Without an `action`, the close button absorbs the auto margin
                    // so it still sits flush right.
                    !action && "ml-auto",
                    onBrand &&
                      "text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground",
                  )}
                >
                  <X aria-hidden="true" />
                </Button>
              ) : null}
            </section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  },
);
Banner.displayName = "Banner";

export { bannerVariants };
