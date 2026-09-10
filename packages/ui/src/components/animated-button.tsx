"use client";

import { motion, useReducedMotion } from "motion/react";
import { forwardRef } from "react";
import { cn } from "../lib/cn.js";
import { type ButtonProps, buttonVariants } from "./button.js";
import { springSnappy } from "./motion-presets.js";

export interface AnimatedButtonProps extends ButtonProps {}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant,
      size,
      type,
      // drop asChild — not supported here
      asChild: _asChild,
      // omit handlers that clash with motion's prop signatures
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      ...props
    },
    ref,
  ) => {
    const reduce = !!useReducedMotion();
    return (
      <motion.button
        ref={ref}
        data-slot="animated-button"
        type={type ?? "button"}
        transition={reduce ? { duration: 0 } : springSnappy}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
        whileHover={reduce ? undefined : { y: -1 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
      />
    );
  },
);
AnimatedButton.displayName = "AnimatedButton";
