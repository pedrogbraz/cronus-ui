"use client";

import { cva } from "class-variance-authority";
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ComponentPropsWithoutRef, type Ref, useId, useRef, useState } from "react";
import { cn } from "../lib/cn.js";

/** Skiper 3 / 75 spring — keep bounce byte-stable. */
const SPRING = { type: "spring" as const, bounce: 0.16 };

export const exploreNavVariants = cva(
  "relative w-full max-w-[1024px] overflow-hidden bg-surface-base ring-1 ring-border",
);

export interface ExploreNavProduct {
  id: string;
  name: string;
  image: string;
  /** Small caption under the name (`New`, `Currently Viewing`, …). */
  badge?: string;
  price?: string;
  priceNote?: string;
}

export interface ExploreNavLink {
  id: string;
  label: string;
}

export interface ExploreNavLabels {
  explore: string;
  close: string;
  buy: string;
  overview: string;
  previousSlide: string;
  nextSlide: string;
  currentlyViewing: string;
}

const DEFAULT_LABELS: ExploreNavLabels = {
  explore: "Explore",
  close: "Close",
  buy: "Buy",
  overview: "Overview",
  previousSlide: "Previous slide",
  nextSlide: "Next slide",
  currentlyViewing: "Currently Viewing",
};

export interface ExploreNavProps
  extends Omit<
    ComponentPropsWithoutRef<"nav">,
    | "title"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
  > {
  ref?: Ref<HTMLElement>;
  /** Product family title shown in the collapsed bar and expanded heading. */
  title: string;
  products: ExploreNavProduct[];
  /** Chip links under Overview. */
  links?: ExploreNavLink[];
  /** Buy control. Renders as an anchor when set. */
  buyHref?: string;
  onBuy?: () => void;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Controlled selected product id. */
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectedIdChange?: (id: string) => void;
  labels?: Partial<ExploreNavLabels>;
}

/**
 * Apple product-page navbar (Skiper 75). A 55px bar morphs into a family
 * carousel with spring bounce 0.16: Explore becomes a Plus/X, Buy drops into
 * the body, products hover-lift, Overview chips stay selectable.
 */
export function ExploreNav({
  ref,
  title,
  products,
  links = [],
  buyHref,
  onBuy,
  defaultExpanded = false,
  expanded: expandedProp,
  onExpandedChange,
  selectedId: selectedProp,
  defaultSelectedId,
  onSelectedIdChange,
  labels: labelsProp,
  className,
  ...props
}: ExploreNavProps) {
  const reduce = !!useReducedMotion();
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const layoutId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const expanded = expandedProp ?? uncontrolledExpanded;
  const setExpanded = (next: boolean) => {
    if (expandedProp === undefined) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  };

  const fallbackId = defaultSelectedId ?? products[0]?.id;
  const [uncontrolledSelected, setUncontrolledSelected] = useState(fallbackId);
  const selectedId = selectedProp ?? uncontrolledSelected;
  const selected = products.find((product) => product.id === selectedId) ?? products[0];

  const selectProduct = (id: string) => {
    if (selectedProp === undefined) setUncontrolledSelected(id);
    onSelectedIdChange?.(id);
  };

  const [linkId, setLinkId] = useState(links[0]?.id);
  const [overviewOpen, setOverviewOpen] = useState(true);

  const scrollBy = (direction: 1 | -1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const delta = Math.max(120, node.clientWidth * 0.4) * direction;
    node.scrollBy({ left: delta, behavior: reduce ? "auto" : "smooth" });
  };

  const transition = reduce ? { duration: 0 } : SPRING;
  const buyCollapsedClass =
    "relative inline-flex h-6.5 cursor-pointer items-center rounded-full px-3 text-xs tracking-[0.035em] text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base bg-[#0071e3]"; // contract-ok: Apple Buy fill the component paints
  const buyExpandedClass =
    "relative inline-flex h-11 cursor-pointer items-center rounded-full px-4 text-lg tracking-[0.035em] text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base bg-[#0071e3]"; // contract-ok: Apple Buy fill the component paints

  return (
    <motion.nav
      ref={ref}
      layout={!reduce}
      data-slot="explore-nav"
      aria-label={title}
      className={cn(exploreNavVariants(), className)}
      initial={false}
      animate={{
        borderRadius: expanded ? 28 : 18,
        height: expanded ? "auto" : 55,
      }}
      transition={transition}
      style={{ paddingBlock: 12, backdropFilter: "blur(20px)" }}
      {...props}
    >
      <div className="flex h-8 w-full items-center justify-between px-4">
        <div>
          <AnimatePresence initial={false}>
            {expanded ? null : (
              <motion.h2
                key="title"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={transition}
                className="text-xl font-medium tracking-[0.012em] text-fg"
              >
                {title}
              </motion.h2>
            )}
          </AnimatePresence>
        </div>
        <div className="flex h-8 items-center gap-2">
          <motion.button
            type="button"
            layout={!reduce}
            aria-expanded={expanded}
            aria-label={expanded ? labels.close : labels.explore}
            className={cn(
              "inline-flex cursor-pointer items-center justify-center overflow-hidden border text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
              expanded
                ? "border-transparent bg-fg text-fg-inverse"
                : "border-border bg-transparent text-fg",
            )}
            animate={{
              width: expanded ? 42 : 72,
              height: expanded ? 42 : 28,
              borderRadius: expanded ? 38 : 28,
            }}
            transition={transition}
            onClick={() => setExpanded(!expanded)}
          >
            <AnimatePresence initial={false} mode="wait">
              {expanded ? (
                <motion.span
                  key="close"
                  initial={reduce ? false : { opacity: 0, filter: "blur(4px)", scale: 0.5 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, filter: "blur(4px)", scale: 0.5 }}
                  className="flex rotate-45 items-center justify-center"
                >
                  <Plus className="size-6" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="explore"
                  initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, filter: "blur(4px)" }}
                >
                  {labels.explore}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <AnimatePresence initial={false}>
            {expanded ? null : (
              <motion.span
                key="buy-collapsed"
                layoutId={`${layoutId}-buy`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={transition}
              >
                {buyHref ? (
                  <a href={buyHref} className={buyCollapsedClass}>
                    {labels.buy}
                  </a>
                ) : (
                  <button type="button" className={buyCollapsedClass} onClick={onBuy}>
                    {labels.buy}
                  </button>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="body"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={transition}
            className="h-full px-8 pt-5 lg:px-14"
          >
            <div className="relative mb-10 h-40 border-b border-border">
              <div
                ref={scrollerRef}
                className="flex h-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {products.map((product) => {
                  const isActive = product.id === selected?.id;
                  return (
                    <motion.button
                      key={product.id}
                      type="button"
                      data-slot="explore-nav-product"
                      aria-current={isActive ? "true" : undefined}
                      className="flex min-w-[22%] shrink-0 snap-start flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base md:min-w-[12%]"
                      whileHover={reduce ? undefined : { y: -8 }}
                      transition={SPRING}
                      onClick={() => selectProduct(product.id)}
                    >
                      <img src={product.image} alt="" className="h-18 object-contain" />
                      <p className="pt-3 text-sm font-medium text-fg">{product.name}</p>
                      {isActive ? (
                        <p className="text-xs text-fg-tertiary">{labels.currentlyViewing}</p>
                      ) : product.badge ? (
                        <p className="text-xs text-warning-strong">{product.badge}</p>
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>
              <button
                type="button"
                aria-label={labels.previousSlide}
                className="absolute start-0 top-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base active:scale-95 rtl:translate-x-1/2"
                onClick={() => scrollBy(-1)}
              >
                <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={labels.nextSlide}
                className="absolute end-0 top-1/2 z-10 flex size-10 translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base active:scale-95 rtl:-translate-x-1/2"
                onClick={() => scrollBy(1)}
              >
                <ChevronRight className="size-5 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>

            <div className="flex w-full flex-col justify-between gap-3 lg:flex-row">
              <h2 className="text-3xl font-medium leading-[1.21] tracking-[-0.02em] text-fg lg:text-[40px]">
                {selected?.name ?? title}
              </h2>
              <div className="flex w-full items-center justify-between gap-6 lg:w-fit">
                {selected?.price ? (
                  <div className="text-sm text-fg lg:text-end">
                    <p className="font-medium">{selected.price}</p>
                    {selected.priceNote ? (
                      <p className="text-fg-tertiary">{selected.priceNote}</p>
                    ) : null}
                  </div>
                ) : null}
                {buyHref ? (
                  <a href={buyHref} className={buyExpandedClass}>
                    {labels.buy}
                  </a>
                ) : (
                  <button type="button" className={buyExpandedClass} onClick={onBuy}>
                    {labels.buy}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 p-2 lg:p-5">
              <button
                type="button"
                aria-expanded={overviewOpen}
                className="flex items-center gap-2 text-fg-tertiary outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base lg:text-xl"
                onClick={() => setOverviewOpen((open) => !open)}
              >
                {labels.overview}
                <ChevronDown
                  className={cn("size-4 transition-transform", overviewOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {overviewOpen && links.length > 0 ? (
                  <motion.div
                    key="links"
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={reduce ? undefined : { opacity: 0, height: 0 }}
                    transition={transition}
                    className="mt-5 flex max-w-xl flex-wrap gap-2 overflow-hidden lg:mt-6"
                  >
                    {links.map((link) => {
                      const isActive = link.id === linkId;
                      return (
                        <button
                          key={link.id}
                          type="button"
                          className={cn(
                            "me-4 cursor-pointer rounded-full px-5 py-2 text-center font-medium capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base lg:text-lg",
                            isActive
                              ? "bg-fg text-fg-inverse"
                              : "text-fg hover:bg-fg hover:text-fg-inverse",
                          )}
                          onClick={() => setLinkId(link.id)}
                        >
                          {link.label}
                        </button>
                      );
                    })}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
}
