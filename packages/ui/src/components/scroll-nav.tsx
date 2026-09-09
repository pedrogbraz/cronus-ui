"use client";

import { cva } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  type RefObject,
  useEffect,
  useId,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/** Skiper 60 indicator spring — same bounce as skiper 3 / 75. */
const SPRING = { type: "spring" as const, bounce: 0.16 };

export const scrollNavVariants = cva("min-h-screen p-4 lg:p-12");

export interface ScrollNavTerm {
  id: string;
  title: string;
  content: ReactNode;
}

export interface ScrollNavLabels {
  /** Accessible name for the sticky section list. */
  nav: string;
}

export interface ScrollNavProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "title" | "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
  > {
  ref?: Ref<HTMLDivElement>;
  /**
   * Page heading.
   * @default "Terms & Conditions"
   */
  title?: string;
  terms: ScrollNavTerm[];
  /**
   * Scroll container. When set, the spy observes this box instead of the
   * viewport — needed when the nav lives inside a nested scroller (docs preview).
   */
  viewportRef?: RefObject<HTMLElement | null>;
  labels?: Partial<ScrollNavLabels>;
}

const DEFAULT_LABELS: ScrollNavLabels = {
  nav: "Sections",
};

/**
 * Sticky sidebar that tracks the section in view (Skiper 60). Active item
 * gets a 2px fg bar that springs between rows; inactive titles sit at 50%
 * opacity. Click a row to jump. Sidebar is `md+` only, matching Skiper.
 */
export function ScrollNav({
  ref,
  title = "Terms & Conditions",
  terms,
  viewportRef,
  labels: labelsProp,
  className,
  ...props
}: ScrollNavProps) {
  const reduce = !!useReducedMotion();
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const layoutId = useId();
  const [activeId, setActiveId] = useState(terms[0]?.id);

  useEffect(() => {
    if (terms.length === 0) return;
    const root = viewportRef?.current ?? null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.id;
        if (id) setActiveId(id);
      },
      { root, rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    for (const term of terms) {
      const node = document.getElementById(term.id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [terms, viewportRef]);

  const jump = (id: string) => {
    setActiveId(id);
    const node = document.getElementById(id);
    if (!node) return;
    const root = viewportRef?.current;
    if (root) {
      const top =
        node.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 8;
      root.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div ref={ref} data-slot="scroll-nav" className={cn(scrollNavVariants(), className)} {...props}>
      <h1 className="font-display pt-10 text-3xl tracking-[-0.03em] text-fg md:text-5xl lg:pt-0">
        {title}
      </h1>
      <div className="relative mb-[50vh] flex flex-col gap-12 py-10 md:flex-row md:py-20">
        <nav aria-label={labels.nav} className="sticky top-24 h-fit w-full max-w-[300px]">
          <ul className="space-y-4 border-s border-border">
            {terms.map((term) => {
              const isActive = term.id === activeId;
              return (
                <li key={term.id} className="relative cursor-pointer ps-3">
                  <a
                    href={`#${term.id}`}
                    className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
                    aria-current={isActive ? "location" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      jump(term.id);
                    }}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId={reduce ? undefined : `${layoutId}-indicator`}
                        className="absolute start-[-1.5px] top-1/2 inline-block h-5 w-[2px] -translate-y-1/2 rounded-full bg-fg"
                        transition={reduce ? { duration: 0 } : SPRING}
                      />
                    ) : null}
                    <p
                      className={cn(
                        "text-fg transition-opacity duration-200",
                        isActive ? "opacity-100" : "opacity-50",
                      )}
                    >
                      {term.title}
                    </p>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex flex-1 flex-col gap-10 md:gap-[60px]">
          {terms.map((term) => (
            <section key={term.id} id={term.id} className="scroll-mt-24 space-y-4 md:space-y-6">
              <h2 className="font-display text-xl tracking-[-0.02em] text-fg lg:text-3xl">
                {term.title}
              </h2>
              <div className="text-fg-tertiary lg:text-lg">{term.content}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
