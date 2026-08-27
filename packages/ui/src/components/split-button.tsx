import type { VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { forwardRef, type HTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { Button, type buttonVariants } from "./button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";
import { Spinner } from "./spinner.js";

/** A single secondary action rendered inside the split button's dropdown menu. */
export interface SplitButtonItem {
  /** Stable identity for the row; falls back to the array index when omitted. */
  id?: string;
  /** Visible menu label. */
  label: ReactNode;
  /** Optional leading icon (a `lucide-react` element is auto-sized to 16px). */
  icon?: ReactNode;
  /** Invoked when the row is chosen (click, Enter, or Space). */
  onSelect?: () => void;
  /** Paints the row in the destructive/error tone (e.g. Delete). */
  destructive?: boolean;
  /** Disables the row — it becomes unfocusable and dimmed. */
  disabled?: boolean;
}

type SplitButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type SplitButtonSize = "sm" | "md" | "lg";

export interface SplitButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** The primary action's label. */
  children: ReactNode;
  /** Fires when the primary (left) segment is clicked. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Optional leading icon for the primary segment (replaced by a spinner while `loading`). */
  icon?: ReactNode;
  /** Declarative secondary actions. Ignored when a custom `menu` slot is supplied. */
  items?: SplitButtonItem[];
  /**
   * Escape hatch for fully custom menu content (compose `DropdownMenuItem`,
   * `DropdownMenuSeparator`, `DropdownMenuLabel`, …). Takes precedence over `items`.
   */
  menu?: ReactNode;
  /** Visual style, shared by both segments — mirrors `Button`'s variants. */
  variant?: SplitButtonVariant;
  /** Control height/density, shared by both segments. */
  size?: SplitButtonSize;
  /** Disables both segments. */
  disabled?: boolean;
  /** Shows a spinner in the primary segment and disables the control. */
  loading?: boolean;
  /** Accessible name for the icon-only menu trigger. */
  menuLabel?: string;
  /** Horizontal alignment of the menu relative to the trigger. */
  align?: "start" | "center" | "end";
  /** Gap in px between the trigger and the opened menu. */
  sideOffset?: number;
  /** Class applied to the dropdown menu surface. */
  contentClassName?: string;
  /** Uncontrolled initial open state of the menu. */
  defaultOpen?: boolean;
  /** Controlled open state of the menu. */
  open?: boolean;
  /** Notified whenever the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * A split button: a primary action fused to a smaller menu trigger inside one
 * seamless segmented control. The menu is a Radix dropdown (proper roving-tabindex
 * keyboard nav, type-ahead, focus return, and portal), so the whole control is
 * keyboard-operable — Tab reaches each segment, Enter/Space fire the primary, and
 * ArrowDown/Enter open the menu. The two segments share `Button`'s variants/sizes;
 * inner corners and borders are collapsed and a single hairline seam is drawn with
 * `currentColor`, so the fusion reads cleanly across every variant. The chevron's
 * flip is CSS-only and is disabled under `prefers-reduced-motion: reduce`; there
 * are no timers or animation frames to clean up.
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      className,
      children,
      onClick,
      icon,
      items,
      menu,
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      menuLabel = "More actions",
      align = "end",
      sideOffset = 6,
      contentClassName,
      defaultOpen,
      open,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      // biome-ignore lint/a11y/useSemanticElements: this bundles two related actions into one segmented control, not form fields — role="group" is the correct generic grouping.
      <div
        ref={ref}
        role="group"
        data-slot="split-button"
        data-variant={variant}
        className={cn("isolate inline-flex items-stretch", className)}
        {...props}
      >
        <Button
          type="button"
          variant={variant}
          size={size}
          disabled={isDisabled}
          onClick={onClick}
          className="relative rounded-r-none border-r-0 focus-visible:z-10"
        >
          {loading ? <Spinner size="sm" aria-hidden /> : icon}
          {children}
        </Button>

        <DropdownMenu
          defaultOpen={defaultOpen}
          open={open}
          onOpenChange={onOpenChange}
          modal={false}
        >
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant={variant}
              size={size}
              disabled={isDisabled}
              aria-label={menuLabel}
              className={cn(
                "relative aspect-square rounded-l-none border-l-0 px-0 focus-visible:z-10",
                // hairline seam between the two segments (currentColor, tint-agnostic)
                "before:pointer-events-none before:absolute before:inset-y-2 before:left-0 before:w-px before:bg-current/15 before:content-['']",
                // chevron flips open; motion-reduce keeps it static
                "[&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-[var(--ease-out-quart)] data-[state=open]:[&>svg]:rotate-180 motion-reduce:[&>svg]:transition-none",
              )}
            >
              <ChevronDown aria-hidden />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align={align}
            sideOffset={sideOffset}
            className={cn("min-w-[10rem]", contentClassName)}
          >
            {menu ??
              items?.map((item, index) => (
                <DropdownMenuItem
                  key={item.id ?? index}
                  disabled={item.disabled}
                  onSelect={item.onSelect}
                  data-destructive={item.destructive ? "" : undefined}
                  className={cn(
                    item.destructive &&
                      "text-error-strong focus:bg-error/10 focus:text-error-strong [&_svg]:text-error-strong",
                  )}
                >
                  {item.icon}
                  {item.label}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
);
SplitButton.displayName = "SplitButton";
