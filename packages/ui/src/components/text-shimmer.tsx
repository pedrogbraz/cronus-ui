"use client";

import { motion, useReducedMotion } from "motion/react";
import { type CSSProperties, type ElementType, type JSX, memo, useMemo } from "react";
import { cn } from "../lib/cn.js";

export type TextShimmerProps = {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
};

function TextShimmerComponent({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const reduceMotion = useReducedMotion();
  const MotionComponent = useMemo(
    () => motion.create(Component as keyof JSX.IntrinsicElements),
    [Component],
  );

  const dynamicSpread = useMemo(() => (children?.length ?? 0) * spread, [children, spread]);

  return (
    <MotionComponent
      data-slot="text-shimmer"
      animate={reduceMotion ? undefined : { backgroundPosition: "0% center" }}
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,transparent_calc(50%-var(--spread)),var(--cronus-surface-base),transparent_calc(50%+var(--spread)))]",
        className,
      )}
      initial={reduceMotion ? false : { backgroundPosition: "100% center" }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage:
            "var(--bg), linear-gradient(var(--cronus-fg-tertiary), var(--cronus-fg-tertiary))",
        } as CSSProperties
      }
      transition={
        reduceMotion
          ? undefined
          : {
              repeat: Number.POSITIVE_INFINITY,
              duration,
              ease: "linear",
            }
      }
    >
      {children}
    </MotionComponent>
  );
}

export const TextShimmer = memo(TextShimmerComponent);
TextShimmer.displayName = "TextShimmer";
