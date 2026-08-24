"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { cn } from "../lib/cn.js";
import { Input } from "./input.js";

/**
 * Estimate password strength from length and character-class variety.
 * Pure helper — no side effects — so it can be unit-tested in isolation.
 */
export function getPasswordStrength(value: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
} {
  if (!value) return { score: 0, label: "Weak" };

  let variety = 0;
  if (/[a-z]/.test(value)) variety += 1;
  if (/[A-Z]/.test(value)) variety += 1;
  if (/[0-9]/.test(value)) variety += 1;
  if (/[^A-Za-z0-9]/.test(value)) variety += 1;

  let points = 0;
  if (value.length >= 8) points += 1;
  if (value.length >= 12) points += 1;
  points += variety >= 3 ? 2 : variety >= 2 ? 1 : 0;

  const score = (Math.min(points, 4) || 1) as 0 | 1 | 2 | 3 | 4;
  const label = (["Weak", "Weak", "Fair", "Good", "Strong"] as const)[score];
  return { score, label };
}

const SEGMENT_COLORS = ["bg-error", "bg-error", "bg-warning", "bg-warning", "bg-success"] as const;

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
  /** Show a 4-segment strength meter + label below the field. */
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, value, defaultValue, onChange, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const [internalValue, setInternalValue] = useState(
      defaultValue != null ? String(defaultValue) : "",
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const strength = getPasswordStrength(currentValue);

    return (
      <div data-slot="password-input" className={cn("w-full", className)}>
        <div className="relative">
          <Input
            ref={ref}
            type={visible ? "text" : "password"}
            className="pr-10"
            value={value}
            defaultValue={defaultValue}
            onChange={(event) => {
              if (!isControlled) setInternalValue(event.target.value);
              onChange?.(event);
            }}
            {...props}
          />
          <button
            type="button"
            data-slot="password-input-toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className={cn(
              "absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-fg-tertiary",
              "transition-colors hover:text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              "disabled:opacity-50 disabled:pointer-events-none [&_svg]:size-4",
            )}
            disabled={props.disabled}
          >
            {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </div>
        {showStrength && (
          <div data-slot="password-input-strength" className="mt-2 flex items-center gap-2">
            <div className="flex flex-1 gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((segment) => (
                <div
                  key={segment}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    segment < strength.score
                      ? SEGMENT_COLORS[strength.score]
                      : "bg-surface-overlay",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-fg-tertiary">{strength.label}</span>
          </div>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
