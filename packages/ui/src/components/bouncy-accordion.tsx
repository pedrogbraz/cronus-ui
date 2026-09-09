"use client";

import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import { type ComponentPropsWithoutRef, type ReactNode, type Ref, useState } from "react";
import { cn } from "../lib/cn.js";

/** Bouncy open/close — more bounce than skiper 3's 0.16 so the gap reads. */
const SPRING = { type: "spring" as const, bounce: 0.32, duration: 0.55 };

const RADIUS = 20;
const COLLAPSED_HEIGHT = 45;
const OPEN_MARGIN = 10;

export const bouncyAccordionVariants = cva("flex w-full max-w-[300px] flex-col items-center");

export interface BouncyAccordionItem {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface BouncyAccordionLabels {
  /** Hint drawn above the stack. */
  hint: string;
}

export interface BouncyAccordionProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "defaultValue" | "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
  > {
  ref?: Ref<HTMLDivElement>;
  items: BouncyAccordionItem[];
  /** Controlled open item. `null` collapses all. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string | null) => void;
  labels?: Partial<BouncyAccordionLabels>;
}

const DEFAULT_LABELS: BouncyAccordionLabels = {
  hint: "Click on items to expand & collapse",
};

function stackRadius(
  index: number,
  expandedIndex: number | null,
  total: number,
): [number, number, number, number] {
  if (index === expandedIndex) return [RADIUS, RADIUS, RADIUS, RADIUS];
  let start = index;
  while (start > 0 && start - 1 !== expandedIndex) start -= 1;
  let end = index;
  while (end < total - 1 && end + 1 !== expandedIndex) end += 1;
  const first = index === start;
  const last = index === end;
  return [first ? RADIUS : 0, first ? RADIUS : 0, last ? RADIUS : 0, last ? RADIUS : 0];
}

/**
 * Stacked accordion (Skiper 103). Collapsed rows share a 20px outer radius;
 * the open row springs into its own 20px card with a 10px gap. Single-open,
 * click again to collapse.
 */
export function BouncyAccordion({
  ref,
  items,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  labels: labelsProp,
  className,
  ...props
}: BouncyAccordionProps) {
  const reduce = !!useReducedMotion();
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue ?? null);
  const openId = valueProp !== undefined ? valueProp : uncontrolled;
  const expandedIndex = items.findIndex((item) => item.id === openId);

  const select = (id: string) => {
    const next = id === openId ? null : id;
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const transition = reduce ? { duration: 0 } : SPRING;

  return (
    <div
      ref={ref}
      data-slot="bouncy-accordion"
      className={cn(bouncyAccordionVariants(), className)}
      {...props}
    >
      {labels.hint ? (
        <p className="relative mb-20 max-w-[18ch] text-center text-xs uppercase leading-tight text-fg-tertiary after:absolute after:inset-x-0 after:top-full after:mx-auto after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:to-fg after:content-['']">
          {labels.hint}
        </p>
      ) : null}
      <ul className="w-full">
        {items.map((item, index) => {
          const open = item.id === openId;
          const [tl, tr, br, bl] = stackRadius(
            index,
            expandedIndex === -1 ? null : expandedIndex,
            items.length,
          );
          return (
            <motion.li
              key={item.id}
              initial={false}
              animate={{
                height: open ? "auto" : COLLAPSED_HEIGHT,
                marginBlock: open ? OPEN_MARGIN : 0,
                borderTopLeftRadius: tl,
                borderTopRightRadius: tr,
                borderBottomRightRadius: br,
                borderBottomLeftRadius: bl,
              }}
              transition={transition}
              className="relative overflow-hidden bg-surface-base hover:bg-surface-raised"
            >
              <button
                type="button"
                data-slot="bouncy-accordion-trigger"
                aria-expanded={open}
                className="flex w-full cursor-pointer flex-col px-2 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
                onClick={() => select(item.id)}
              >
                <span className="flex h-[45px] items-center gap-2 ps-3">
                  {item.icon ? (
                    <span className="grid size-6 shrink-0 scale-[0.85] place-items-center rounded-md bg-surface-overlay text-fg shadow-xs [&_svg]:size-4">
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="text-sm tracking-tight text-fg/75">{item.title}</span>
                </span>
                <span className="px-3 py-2 text-sm text-fg-tertiary">{item.description}</span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
