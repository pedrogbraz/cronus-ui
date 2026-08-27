import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react";
import { cn } from "../lib/cn.js";
import { Input } from "./input.js";

/**
 * A text field whose label begins in the placeholder position and floats up to a
 * compact caption on focus or when the field is filled.
 *
 * The float is driven **entirely by CSS** — the label reacts to the input's
 * `:placeholder-shown` and `:focus` states via Tailwind `peer-*` variants, so
 * there is no state, no `onChange` bookkeeping, and no React re-render while the
 * user types. The movement animates `transform` + `color` only (GPU-composited,
 * no layout thrash) with a soft spring easing; under
 * `prefers-reduced-motion: reduce` the transition collapses to an instant snap.
 *
 * Works with controlled and uncontrolled inputs alike (the state is read from the
 * DOM, not React), forwards its ref to the underlying `<input>`, and binds the
 * label via `id`/`htmlFor`. Helper text is wired through `aria-describedby`, and
 * the invalid state is fully token-driven (border, label, and helper turn to the
 * error color, and the helper is announced via `role="alert"`).
 */
export interface FloatingLabelInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  /** The label text. Sits in the placeholder position, then floats up when the field is focused or filled. */
  label: ReactNode;
  /** Optional caption rendered under the field and linked to the input via `aria-describedby`. Turns into an error message when `invalid`. */
  helperText?: ReactNode;
  /** Marks the field invalid — drives the error border/ring, error label color, and an announced (`role="alert"`) helper. */
  invalid?: boolean;
  /** Decorative content (usually an icon) pinned to the left; the label and input inset to make room. */
  startAdornment?: ReactNode;
  /** Content (icon or button) pinned to the right; the input insets to make room. */
  endAdornment?: ReactNode;
  /** Extra classes for the floating `<label>`. */
  labelClassName?: string;
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  (
    {
      className,
      labelClassName,
      label,
      helperText,
      invalid = false,
      startAdornment,
      endAdornment,
      id: idProp,
      disabled,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const id = idProp ?? reactId;
    const helperId = helperText ? `${id}-helper` : undefined;
    const describedBy = cn(ariaDescribedBy, helperId) || undefined;

    return (
      <div data-slot="floating-label-input" className={cn("w-full", className)}>
        <div className="relative">
          {startAdornment ? (
            <span
              aria-hidden="true"
              data-slot="floating-label-input-start"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-fg-tertiary [&_svg]:size-4"
            >
              {startAdornment}
            </span>
          ) : null}

          <Input
            ref={ref}
            id={id}
            invalid={invalid}
            disabled={disabled}
            placeholder=" "
            aria-describedby={describedBy}
            className={cn(
              "peer h-14 pt-4 placeholder:text-transparent",
              startAdornment && "pl-10",
              endAdornment && "pr-10",
            )}
            {...props}
          />

          <label
            htmlFor={id}
            data-slot="floating-label-input-label"
            className={cn(
              "pointer-events-none absolute top-1/2 z-10 origin-left select-none text-sm",
              startAdornment ? "left-10" : "left-3",
              // Smooth spring float — transform + color only (GPU-composited).
              "transition-[transform,color] duration-300 ease-[var(--ease-spring)]",
              "motion-reduce:transition-none motion-reduce:duration-0",
              // Floated (base — applies when filled, and re-asserted on focus below).
              "-translate-y-[1.6rem] scale-[0.8]",
              invalid ? "text-error-strong" : "text-fg-secondary",
              // Resting: empty and unfocused → sits in the placeholder position.
              "peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:scale-100 peer-placeholder-shown:text-fg-tertiary",
              // Focused: float back up and take the accent (or error) color.
              // `text-primary-strong` (AA-tuned): the raw `primary` fill reads
              // ~2:1 as this small label on white in the bright-accent light themes.
              "peer-focus:-translate-y-[1.6rem] peer-focus:scale-[0.8]",
              invalid ? "peer-focus:text-error-strong" : "peer-focus:text-primary-strong",
              // Disabled dimming mirrors the input.
              "peer-disabled:opacity-50",
              labelClassName,
            )}
          >
            {label}
          </label>

          {endAdornment ? (
            <span
              data-slot="floating-label-input-end"
              className="absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-fg-tertiary [&_svg]:size-4"
            >
              {endAdornment}
            </span>
          ) : null}
        </div>

        {helperText ? (
          <p
            id={helperId}
            data-slot="floating-label-input-helper"
            role={invalid ? "alert" : undefined}
            className={cn(
              "mt-1.5 px-1 text-xs",
              invalid ? "text-error-strong" : "text-fg-secondary",
            )}
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);
FloatingLabelInput.displayName = "FloatingLabelInput";
