"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type ButtonHTMLAttributes,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";

/**
 * Snap alignment for items inside the viewport. `"start"` lines each slide up
 * with the left edge (the default, classic gallery feel); `"center"` parks the
 * active slide in the middle of the viewport (good for peek-a-boo layouts where
 * neighbours are partially visible).
 */
export type CarouselAlign = "start" | "center";

export interface CarouselOptions {
  /** Where each slide snaps relative to the viewport. Defaults to `"start"`. */
  align?: CarouselAlign;
  /**
   * When the user scrolls past the last slide (or before the first), wrap around
   * to the other end instead of stopping. The prev/next buttons stay enabled at
   * the edges so they can perform the wrap. Defaults to `false`.
   */
  loop?: boolean;
}

interface CarouselContextValue {
  /** Ref attached to the scroll viewport ({@link CarouselContent}). */
  viewportRef: React.RefObject<HTMLDivElement | null>;
  /** Index of the slide currently nearest the snap point. */
  selectedIndex: number;
  /** Total number of {@link CarouselItem}s detected in the viewport. */
  itemCount: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  /** Registers/updates the live slide count from the viewport. */
  setItemCount: (count: number) => void;
  /**
   * Syncs the navigation target index after a manual swipe/drag/scroll so the
   * next prev/next button press steps from the slide the user actually landed
   * on (not a stale React state value).
   */
  setTargetIndex: (index: number) => void;
  opts: Required<CarouselOptions>;
  /** Stable id used to wire `aria-roledescription` regions together. */
  carouselId: string;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel(component: string): CarouselContextValue {
  const context = useContext(CarouselContext);
  if (context === null) {
    throw new Error(`<${component}> must be used within <Carousel>.`);
  }
  return context;
}

/**
 * Reads the per-item width (including the inter-item gap) from the viewport's
 * first real child. Falls back to the viewport's own client width when the
 * viewport is empty so callers never divide by zero.
 */
function getStep(viewport: HTMLDivElement): number {
  const first = viewport.firstElementChild as HTMLElement | null;
  if (!first) return viewport.clientWidth || 1;
  const second = first.nextElementSibling as HTMLElement | null;
  // Distance between two adjacent item left-edges captures width + flex gap.
  // `Math.abs` keeps the step positive in RTL, where the delta is negative.
  if (second) return Math.max(1, Math.abs(second.offsetLeft - first.offsetLeft));
  return Math.max(1, first.offsetWidth);
}

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, "onScroll"> {
  /** Tuning for snap alignment and looping. */
  opts?: CarouselOptions;
  children?: ReactNode;
}

/**
 * Root of the carousel. Owns the shared scroll state — selected index, whether
 * the viewport can scroll further in each direction, and the live slide count —
 * and exposes imperative scroll helpers through context. Dependency-free: the
 * actual sliding is native CSS scroll-snap on {@link CarouselContent}, so touch
 * drag, momentum and `prefers-reduced-motion` all come for free from the
 * browser (the OS reduce-motion setting overrides `scroll-smooth`, so no extra
 * work is needed to honour it).
 *
 * Renders a `role="region"` / `aria-roledescription="carousel"` wrapper and
 * wires ArrowLeft / ArrowRight on the region to scroll prev / next.
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ opts, className, children, onKeyDown, ...props }, ref) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const carouselId = useId();
    // Synchronously-tracked navigation target. Driven by prev/next (incremented
    // before the smooth scroll settles) and re-synced by manual swipes via
    // setTargetIndex, so rapid taps advance more than one slide.
    const targetIndexRef = useRef(0);
    // While a programmatic scroll (button/dot/keyboard) is in flight, ignore the
    // scroll observer's target re-sync — otherwise a rapid burst of taps reads a
    // mid-animation index and never accumulates past one slide.
    const navigatingRef = useRef(false);
    const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resolvedOpts = useMemo<Required<CarouselOptions>>(
      () => ({ align: opts?.align ?? "start", loop: opts?.loop ?? false }),
      [opts?.align, opts?.loop],
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    // Looping keeps both buttons live so the edge taps can wrap around.
    const exposedCanScrollPrev = resolvedOpts.loop ? itemCount > 1 : canScrollPrev;
    const exposedCanScrollNext = resolvedOpts.loop ? itemCount > 1 : canScrollNext;

    const scrollTo = useCallback(
      (index: number) => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        // Mark a programmatic scroll so the observer's re-sync is suppressed until
        // the smooth scroll settles (the timer outlasts the animation).
        navigatingRef.current = true;
        if (navTimerRef.current) clearTimeout(navTimerRef.current);
        navTimerRef.current = setTimeout(() => {
          navigatingRef.current = false;
        }, 500);
        const rtl = getComputedStyle(viewport).direction === "rtl";
        const child = viewport.children.item(index) as HTMLElement | null;
        if (child) {
          // Park the slide at the snap point: its centre under the viewport
          // centre for center-align, or its left edge for start-align.
          const raw =
            resolvedOpts.align === "center"
              ? child.offsetLeft + child.offsetWidth / 2 - viewport.clientWidth / 2
              : child.offsetLeft;
          const left = Math.max(0, raw);
          // In RTL the reachable scroll range is 0..-maxScroll, so flip the sign.
          viewport.scrollTo({ left: rtl ? -left : left, behavior: "smooth" });
          return;
        }
        // No child at that index (empty viewport): fall back to a step scroll.
        const left = index * getStep(viewport);
        viewport.scrollTo({ left: rtl ? -left : left, behavior: "smooth" });
      },
      [resolvedOpts.align],
    );

    const scrollPrev = useCallback(() => {
      // Step from the synchronous target (not lagging React state) so rapid taps
      // queue up multiple slides instead of all reading the same mid-scroll spot.
      const prev = targetIndexRef.current - 1;
      targetIndexRef.current =
        resolvedOpts.loop && prev < 0 ? Math.max(0, itemCount - 1) : Math.max(0, prev);
      scrollTo(targetIndexRef.current);
    }, [resolvedOpts.loop, itemCount, scrollTo]);

    const scrollNext = useCallback(() => {
      const last = itemCount - 1;
      const next = targetIndexRef.current + 1;
      targetIndexRef.current = resolvedOpts.loop && next > last ? 0 : Math.min(last, next);
      scrollTo(targetIndexRef.current);
    }, [resolvedOpts.loop, itemCount, scrollTo]);

    // Lets CarouselContent re-anchor the target after a manual swipe/scroll —
    // but only when no programmatic scroll is in flight, so rapid button taps
    // (which the observer would otherwise reset mid-animation) still accumulate.
    const setTargetIndex = useCallback((index: number) => {
      if (navigatingRef.current) return;
      targetIndexRef.current = index;
    }, []);

    useEffect(
      () => () => {
        if (navTimerRef.current) clearTimeout(navTimerRef.current);
      },
      [],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [onKeyDown, scrollPrev, scrollNext],
    );

    const contextValue = useMemo<CarouselContextValue>(
      () => ({
        viewportRef,
        selectedIndex,
        itemCount,
        canScrollPrev: exposedCanScrollPrev,
        canScrollNext: exposedCanScrollNext,
        scrollPrev,
        scrollNext,
        scrollTo,
        setItemCount,
        setTargetIndex,
        opts: resolvedOpts,
        carouselId,
      }),
      [
        selectedIndex,
        itemCount,
        exposedCanScrollPrev,
        exposedCanScrollNext,
        scrollPrev,
        scrollNext,
        scrollTo,
        setTargetIndex,
        resolvedOpts,
        carouselId,
      ],
    );

    // Internal setters used by CarouselContent's scroll/resize observers.
    const internals = useMemo(() => ({ setSelectedIndex, setCanScrollPrev, setCanScrollNext }), []);

    return (
      <CarouselContext.Provider value={contextValue}>
        <CarouselInternalsContext.Provider value={internals}>
          {/* biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA carousel pattern uses role="region" + aria-roledescription to announce "carousel"; a bare <section> can't convey that. */}
          <div
            ref={ref}
            data-slot="carousel"
            role="region"
            aria-roledescription="carousel"
            onKeyDown={handleKeyDown}
            className={cn("relative outline-none", className)}
            {...props}
          >
            {children}
          </div>
        </CarouselInternalsContext.Provider>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

/**
 * Private channel for the state setters {@link CarouselContent} drives. Kept
 * separate from the public {@link CarouselContext} so consumers never see the
 * mutable setters, and so updating scroll state doesn't churn the public value.
 */
interface CarouselInternals {
  setSelectedIndex: (index: number) => void;
  setCanScrollPrev: (value: boolean) => void;
  setCanScrollNext: (value: boolean) => void;
}

const CarouselInternalsContext = createContext<CarouselInternals | null>(null);

export interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * The scroll viewport: a horizontal flex row with native scroll-snap. Holds the
 * {@link CarouselItem}s, owns the rAF-throttled `scroll` listener and a
 * {@link ResizeObserver} that keep the root's `selectedIndex` /
 * `canScrollPrev` / `canScrollNext` / item count in sync. The scrollbar is
 * visually hidden (drag/touch still work). Uses the shadcn `-ml-4` gutter trick
 * paired with `pl-4` on each item to produce an even inter-item gap.
 */
export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { viewportRef, setItemCount, setTargetIndex, opts, carouselId } =
      useCarousel("CarouselContent");
    const internals = useContext(CarouselInternalsContext);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        viewportRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [viewportRef, forwardedRef],
    );

    const update = useCallback(() => {
      const viewport = viewportRef.current;
      if (!viewport || !internals) return;

      const count = viewport.children.length;
      setItemCount(count);

      const { scrollLeft, scrollWidth, clientWidth } = viewport;
      const maxScroll = scrollWidth - clientWidth;
      // RTL scrollLeft is negative-going; compare snap targets in positive space.
      const pos = Math.abs(scrollLeft);

      // Clamped snap target for a slide: its centre (center align) or left edge
      // (start align), bounded to the reachable [0, maxScroll] range so the last
      // slide — whose ideal target may exceed maxScroll — stays selectable.
      const snapTarget = (child: HTMLElement) => {
        const raw =
          opts.align === "center"
            ? child.offsetLeft + child.offsetWidth / 2 - clientWidth / 2
            : child.offsetLeft;
        return Math.max(0, Math.min(maxScroll, raw));
      };

      // Argmin: pick the slide whose actual snap target is nearest the current
      // (RTL-normalized) scroll position.
      let index = 0;
      let best = Number.POSITIVE_INFINITY;
      for (let i = 0; i < count; i++) {
        const child = viewport.children.item(i) as HTMLElement | null;
        if (!child) continue;
        const distance = Math.abs(pos - snapTarget(child));
        if (distance < best) {
          best = distance;
          index = i;
        }
      }
      internals.setSelectedIndex(index);
      // Re-anchor the navigation target so a manual swipe then a button press
      // steps from the slide the user actually landed on.
      setTargetIndex(index);

      // 1px slack absorbs sub-pixel rounding at the extremes.
      internals.setCanScrollPrev(pos > 1);
      internals.setCanScrollNext(pos < maxScroll - 1);
    }, [viewportRef, internals, setItemCount, setTargetIndex, opts.align]);

    useEffect(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      let frame = 0;
      const onScroll = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      };

      // Mirror live DOM changes (slides added/removed) into the index + count.
      const mutationObserver = new MutationObserver(() => update());
      mutationObserver.observe(viewport, { childList: true });

      const resizeObserver = new ResizeObserver(() => update());
      resizeObserver.observe(viewport);

      viewport.addEventListener("scroll", onScroll, { passive: true });
      // Initial sync once layout is measured.
      update();

      return () => {
        if (frame) cancelAnimationFrame(frame);
        viewport.removeEventListener("scroll", onScroll);
        mutationObserver.disconnect();
        resizeObserver.disconnect();
      };
    }, [viewportRef, update]);

    return (
      <div
        ref={setRefs}
        id={`${carouselId}-viewport`}
        data-slot="carousel-content"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the slides viewport is intentionally focusable so keyboard users can scroll/arrow through the slides.
        tabIndex={0}
        className={cn(
          "-ml-4 flex overflow-x-auto scroll-smooth snap-x snap-mandatory outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          // Hide the scrollbar across engines; drag + touch still work.
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * A single slide. Defaults to full-width (`basis-full`); override `basis-*` via
 * `className` for multi-item views (e.g. `md:basis-1/2`, `lg:basis-1/3`). The
 * `pl-4` left padding pairs with the viewport's `-ml-4` to make an even gap.
 */
export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    const { opts } = useCarousel("CarouselItem");
    return (
      // biome-ignore lint/a11y/useSemanticElements: a carousel slide is role="group" + aria-roledescription="slide" per WAI-ARIA; <fieldset> would be semantically wrong.
      <div
        ref={ref}
        data-slot="carousel-item"
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full pl-4",
          opts.align === "center" ? "snap-center" : "snap-start",
          className,
        )}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = "CarouselItem";

export interface CarouselPreviousProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Outline icon button that scrolls to the previous slide. Disabled at the start
 * (unless `opts.loop`). Renders inline by default; absolutely position it from
 * the consumer via `className` (e.g. `absolute left-2 top-1/2 -translate-y-1/2`).
 */
export const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselPreviousProps>(
  ({ className, onClick, disabled, children, ...props }, ref) => {
    const { scrollPrev, canScrollPrev, carouselId } = useCarousel("CarouselPrevious");
    return (
      <Button
        ref={ref}
        data-slot="carousel-previous"
        variant="outline"
        size="icon"
        aria-label="Previous slide"
        aria-controls={`${carouselId}-viewport`}
        disabled={disabled ?? !canScrollPrev}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) scrollPrev();
        }}
        className={cn("rounded-full", className)}
        {...props}
      >
        {children ?? <ChevronLeft />}
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

export interface CarouselNextProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Outline icon button that scrolls to the next slide. Disabled at the end
 * (unless `opts.loop`). Renders inline by default; absolutely position it from
 * the consumer via `className` (e.g. `absolute right-2 top-1/2 -translate-y-1/2`).
 */
export const CarouselNext = forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className, onClick, disabled, children, ...props }, ref) => {
    const { scrollNext, canScrollNext, carouselId } = useCarousel("CarouselNext");
    return (
      <Button
        ref={ref}
        data-slot="carousel-next"
        variant="outline"
        size="icon"
        aria-label="Next slide"
        aria-controls={`${carouselId}-viewport`}
        disabled={disabled ?? !canScrollNext}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) scrollNext();
        }}
        className={cn("rounded-full", className)}
        {...props}
      >
        {children ?? <ChevronRight />}
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export interface CarouselDotsProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * One dot per slide; the active dot is filled (`bg-fg`) while the rest are muted
 * (`bg-border`). Clicking a dot scrolls to that slide. Each dot is a labelled
 * button ("Go to slide N") and the active one carries `aria-current`.
 */
export const CarouselDots = forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ className, ...props }, ref) => {
    const { itemCount, selectedIndex, scrollTo } = useCarousel("CarouselDots");
    return (
      <div
        ref={ref}
        data-slot="carousel-dots"
        className={cn("flex items-center justify-center gap-2", className)}
        {...props}
      >
        {Array.from({ length: itemCount }, (_, index) => {
          const active = index === selectedIndex;
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: dots are positional and 1:1 with slides — index is the stable identity.
              key={index}
              type="button"
              data-slot="carousel-dot"
              data-active={active || undefined}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={active || undefined}
              onClick={() => scrollTo(index)}
              className={cn(
                "size-2 rounded-full transition-colors",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
                active ? "bg-fg" : "bg-border hover:bg-fg-muted",
              )}
            />
          );
        })}
      </div>
    );
  },
);
CarouselDots.displayName = "CarouselDots";
