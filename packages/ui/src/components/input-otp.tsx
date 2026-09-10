"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type HTMLAttributes,
  useContext,
} from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link InputOTP}. */
export type InputOTPProps = ComponentPropsWithoutRef<typeof OTPInput>;

/**
 * A segmented one-time-passcode field. The visible slots are decorative; a
 * single hidden `<input autocomplete="one-time-code">` holds the real value and
 * receives keyboard input.
 *
 * That input is the only labelable control, so it always needs an accessible
 * name. Pass `aria-label` (or `aria-labelledby`) to describe the specific code
 * being entered; when neither is provided it falls back to a generic
 * `"One-time passcode"` so the field is never nameless.
 */
export const InputOTP = forwardRef<ComponentRef<typeof OTPInput>, InputOTPProps>(
  (
    {
      className,
      containerClassName,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    return (
      <OTPInput
        ref={ref}
        data-slot="input-otp"
        // The input is the only labelable node, so guarantee a name: honor an
        // explicit label, else fall back so axe never sees a nameless control.
        aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? "One-time passcode")}
        aria-labelledby={ariaLabelledBy}
        containerClassName={cn(
          "flex items-center gap-2 has-[:disabled]:opacity-50",
          containerClassName,
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    );
  },
);
InputOTP.displayName = "InputOTP";

/** Props for {@link InputOTPGroup}. */
export type InputOTPGroupProps = HTMLAttributes<HTMLDivElement>;

export const InputOTPGroup = forwardRef<HTMLDivElement, InputOTPGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="input-otp-group"
        className={cn("flex items-center", className)}
        {...props}
      />
    );
  },
);
InputOTPGroup.displayName = "InputOTPGroup";

/** Props for {@link InputOTPSlot}. */
export type InputOTPSlotProps = HTMLAttributes<HTMLDivElement> & { index: number };

export const InputOTPSlot = forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const inputOTPContext = useContext(OTPInputContext);
    const slot = inputOTPContext?.slots[index];
    const char = slot?.char;
    const hasFakeCaret = slot?.hasFakeCaret;
    const isActive = slot?.isActive;

    return (
      <div
        ref={ref}
        data-slot="input-otp-slot"
        data-active={isActive}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center border-y border-r border-border text-sm transition-all first:rounded-l-lg first:border-l last:rounded-r-lg data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring",
          className,
        )}
        {...props}
      >
        {char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-px animate-caret-blink bg-fg duration-1000" />
          </div>
        )}
      </div>
    );
  },
);
InputOTPSlot.displayName = "InputOTPSlot";

/** Props for {@link InputOTPSeparator}. */
export type InputOTPSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const InputOTPSeparator = forwardRef<HTMLDivElement, InputOTPSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="input-otp-separator"
        aria-hidden="true"
        className={cn("flex items-center text-fg-muted", className)}
        {...props}
      >
        <Minus className="size-4" />
      </div>
    );
  },
);
InputOTPSeparator.displayName = "InputOTPSeparator";
