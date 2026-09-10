"use client";

import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import { type ComponentPropsWithoutRef, type Ref, useState } from "react";
import { cn } from "../lib/cn.js";

const springTransition = {
  type: "spring" as const,
  duration: 0.4,
  bounce: 0.2,
};

export const animatedCheckboxVariants = cva(
  "inline-flex cursor-pointer items-center gap-3 text-start select-none has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50",
);

export const animatedCheckboxBoxVariants = cva(
  "flex size-4.5 items-center justify-center rounded-sm border-[1.5px] outline-none transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-base",
  {
    variants: {
      checked: {
        true: "border-transparent bg-fg",
        false: "border-fg-tertiary/40 bg-transparent hover:border-fg-tertiary/60",
      },
    },
    defaultVariants: { checked: false },
  },
);

export interface AnimatedCheckboxProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "onChange" | "title" | "size"> {
  ref?: Ref<HTMLLabelElement>;
  /**
   * Visible label drawn next to the box.
   * @default "Implement Checkbox"
   */
  title?: string;
  /**
   * Initial checked state for uncontrolled usage.
   * @default false
   */
  defaultChecked?: boolean;
  /** Controlled checked state. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Called with the next checked value whenever the control toggles. */
  onCheckedChange?: (checked: boolean) => void;
}

export function AnimatedCheckbox({
  ref,
  title = "Implement Checkbox",
  defaultChecked = false,
  checked: checkedProp,
  onCheckedChange,
  className,
  disabled,
  ...props
}: AnimatedCheckboxProps) {
  const reduce = !!useReducedMotion();
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : uncontrolled;
  const initialChecked = checkedProp ?? defaultChecked;

  return (
    <label
      ref={ref}
      data-slot="animated-checkbox"
      className={cn(animatedCheckboxVariants(), className)}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        {...props}
        checked={isControlled ? checked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        disabled={disabled}
        onChange={(event) => {
          const next = event.target.checked;
          if (!isControlled) setUncontrolled(next);
          onCheckedChange?.(next);
        }}
      />
      <span className={animatedCheckboxBoxVariants({ checked })}>
        <svg viewBox="0 0 20 20" className="size-full text-fg-inverse" aria-hidden="true">
          <motion.path
            d="M 0 4.5 L 3.182 8 L 10 0"
            fill="transparent"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(5 6)"
            initial={
              reduce
                ? false
                : {
                    pathLength: initialChecked ? 1 : 0,
                    opacity: initialChecked ? 1 : 0,
                  }
            }
            animate={{
              pathLength: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    pathLength: { ease: "easeOut", duration: 0.3 },
                    opacity: { duration: 0 },
                  }
            }
          />
        </svg>
      </span>
      <span className="relative">
        <span
          className={cn(
            "text-base font-medium transition-colors duration-200",
            checked ? "text-fg-tertiary" : "text-fg",
          )}
        >
          {title}
        </span>
        <motion.div
          className="absolute start-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-fg-tertiary"
          initial={
            reduce
              ? false
              : {
                  width: initialChecked ? "100%" : 0,
                  opacity: initialChecked ? 1 : 0,
                }
          }
          animate={{
            width: checked ? "100%" : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={reduce ? { duration: 0 } : springTransition}
        />
      </span>
    </label>
  );
}
