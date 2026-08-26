"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useId,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

export interface CardStackItem {
  /** Stable identity used as the React key and the accessible name fallback. */
  id: string;
  /** Visible card body. */
  content: ReactNode;
}

export interface CardStackProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  ref?: Ref<HTMLElement>;
  items: CardStackItem[];
  /**
   * Accessible name for the stack. Defaults to `"Card stack"`.
   */
  labels?: {
    region?: string;
    next?: string;
  };
}

/**
 * A fanned stack of cards. Click or press ArrowRight / Space on the front
 * card to cycle it to the back. Reduced-motion visitors keep the same
 * stacking, without the slide.
 */
export function CardStack({ ref, className, items, labels, ...props }: CardStackProps) {
  const reduce = !!useReducedMotion();
  const labelId = useId();
  const [order, setOrder] = useState(() => items.map((item) => item.id));
  const regionLabel = labels?.region ?? "Card stack";
  const nextLabel = labels?.next ?? "Show next card";

  const cycle = useCallback(() => {
    setOrder((current) => {
      if (current.length < 2) return current;
      const [first, ...rest] = current;
      return first === undefined ? current : [...rest, first];
    });
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
        event.preventDefault();
        cycle();
      }
    },
    [cycle],
  );

  const lookup = new Map(items.map((item) => [item.id, item]));
  const visible = order
    .map((id) => lookup.get(id))
    .filter((item): item is CardStackItem => item !== undefined);

  return (
    <section
      ref={ref}
      data-slot="card-stack"
      aria-labelledby={labelId}
      className={cn("relative isolate h-56 w-full max-w-sm", className)}
      {...props}
    >
      <span id={labelId} className="sr-only">
        {regionLabel}
      </span>
      {visible.map((item, index) => {
        const isFront = index === 0;
        const depth = Math.min(index, 3);
        return (
          <motion.div
            key={item.id}
            data-slot="card-stack-item"
            layout={!reduce}
            role={isFront ? "button" : undefined}
            tabIndex={isFront ? 0 : -1}
            aria-label={isFront ? nextLabel : undefined}
            aria-hidden={isFront ? undefined : true}
            className={cn(
              "absolute inset-0 rounded-2xl border border-border bg-surface-raised p-5 shadow-sm outline-none",
              isFront &&
                "z-10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
            )}
            style={{
              translate: `${depth * 10}px ${depth * 10}px`,
              zIndex: visible.length - index,
              transformOrigin: "top center",
            }}
            animate={
              reduce ? undefined : { scale: 1 - depth * 0.04, rotate: isFront ? 0 : depth * -1.5 }
            }
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={isFront ? cycle : undefined}
            onKeyDown={isFront ? onKeyDown : undefined}
          >
            {item.content}
          </motion.div>
        );
      })}
    </section>
  );
}
CardStack.displayName = "CardStack";
