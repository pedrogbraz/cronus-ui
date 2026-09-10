"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Children,
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card.js";

export type InlineCitationLabels = {
  previous?: string;
  next?: string;
  unknown?: string;
};

const DEFAULT_LABELS: Required<InlineCitationLabels> = {
  previous: "Previous",
  next: "Next",
  unknown: "unknown",
};

export type InlineCitationProps = HTMLAttributes<HTMLSpanElement>;

export function InlineCitation({
  className,
  ref,
  ...props
}: InlineCitationProps & { ref?: Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={ref}
      data-slot="inline-citation"
      className={cn("group inline items-center gap-1", className)}
      {...props}
    />
  );
}

export type InlineCitationTextProps = HTMLAttributes<HTMLSpanElement>;

export function InlineCitationText({ className, ...props }: InlineCitationTextProps) {
  return (
    <span
      data-slot="inline-citation-text"
      className={cn("transition-colors group-hover:bg-surface-overlay", className)}
      {...props}
    />
  );
}

export type InlineCitationCardProps = ComponentProps<typeof HoverCard>;

export function InlineCitationCard(props: InlineCitationCardProps) {
  return <HoverCard data-slot="inline-citation-card" openDelay={0} closeDelay={0} {...props} />;
}

export type InlineCitationCardTriggerProps = ComponentProps<typeof Badge> & {
  sources: string[];
  labels?: Pick<InlineCitationLabels, "unknown">;
};

export function InlineCitationCardTrigger({
  sources,
  className,
  labels: labelsProp,
  ...props
}: InlineCitationCardTriggerProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const firstSource = sources[0];
  let host = labels.unknown;
  if (firstSource) {
    try {
      host = new URL(firstSource).hostname;
    } catch {
      host = firstSource;
    }
  }

  return (
    <HoverCardTrigger asChild>
      <Badge
        data-slot="inline-citation-card-trigger"
        role="button"
        tabIndex={0}
        className={cn(
          "ms-1 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          className,
        )}
        variant="secondary"
        {...props}
      >
        {sources.length ? (
          <>
            {host}
            {sources.length > 1 ? ` +${sources.length - 1}` : null}
          </>
        ) : (
          labels.unknown
        )}
      </Badge>
    </HoverCardTrigger>
  );
}

export type InlineCitationCardBodyProps = ComponentProps<typeof HoverCardContent>;

export function InlineCitationCardBody({ className, ...props }: InlineCitationCardBodyProps) {
  return (
    <HoverCardContent
      data-slot="inline-citation-card-body"
      className={cn("relative w-80 p-0", className)}
      {...props}
    />
  );
}

type CarouselContextType = {
  index: number;
  count: number;
  setCount: (n: number) => void;
  goPrev: () => void;
  goNext: () => void;
  labels: Required<InlineCitationLabels>;
};

const CarouselContext = createContext<CarouselContextType | null>(null);

const useCarousel = () => {
  const ctx = useContext(CarouselContext);
  if (!ctx) {
    throw new Error("InlineCitationCarousel components must be used within InlineCitationCarousel");
  }
  return ctx;
};

export type InlineCitationCarouselProps = HTMLAttributes<HTMLDivElement> & {
  labels?: InlineCitationLabels;
};

export function InlineCitationCarousel({
  className,
  children,
  labels: labelsProp,
  ...props
}: InlineCitationCarouselProps) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);

  const goPrev = useCallback(() => {
    setIndex((i) => (count === 0 ? 0 : (i - 1 + count) % count));
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((i) => (count === 0 ? 0 : (i + 1) % count));
  }, [count]);

  const value = useMemo(
    () => ({ index, count, setCount, goPrev, goNext, labels }),
    [index, count, goPrev, goNext, labels],
  );

  return (
    <CarouselContext.Provider value={value}>
      <div data-slot="inline-citation-carousel" className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export type InlineCitationCarouselContentProps = HTMLAttributes<HTMLDivElement>;

export function InlineCitationCarouselContent({
  className,
  children,
  ...props
}: InlineCitationCarouselContentProps) {
  const { index, setCount } = useCarousel();
  const items = Children.toArray(children);

  useEffect(() => {
    setCount(items.length);
  }, [items.length, setCount]);

  return (
    <div
      data-slot="inline-citation-carousel-content"
      className={cn("relative", className)}
      {...props}
    >
      {items.map((child, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: opaque slide children have no stable ids; position is the identity
          key={i}
          className={cn(i === index ? "block" : "hidden")}
          aria-hidden={i !== index}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export type InlineCitationCarouselItemProps = HTMLAttributes<HTMLDivElement>;

export function InlineCitationCarouselItem({
  className,
  ...props
}: InlineCitationCarouselItemProps) {
  return (
    <div
      data-slot="inline-citation-carousel-item"
      className={cn("w-full space-y-2 p-4 ps-8", className)}
      {...props}
    />
  );
}

export type InlineCitationCarouselHeaderProps = HTMLAttributes<HTMLDivElement>;

export function InlineCitationCarouselHeader({
  className,
  ...props
}: InlineCitationCarouselHeaderProps) {
  return (
    <div
      data-slot="inline-citation-carousel-header"
      className={cn(
        "flex items-center justify-between gap-2 rounded-t-md bg-surface-overlay p-2",
        className,
      )}
      {...props}
    />
  );
}

export type InlineCitationCarouselIndexProps = HTMLAttributes<HTMLDivElement>;

export function InlineCitationCarouselIndex({
  children,
  className,
  ...props
}: InlineCitationCarouselIndexProps) {
  const { index, count } = useCarousel();
  return (
    <div
      data-slot="inline-citation-carousel-index"
      className={cn(
        "flex flex-1 items-center justify-end px-3 py-1 text-xs text-fg-tertiary",
        className,
      )}
      {...props}
    >
      {children ?? `${count === 0 ? 0 : index + 1}/${count}`}
    </div>
  );
}

export type InlineCitationCarouselPrevProps = HTMLAttributes<HTMLButtonElement>;

export function InlineCitationCarouselPrev({
  className,
  ...props
}: InlineCitationCarouselPrevProps) {
  const { goPrev, labels } = useCarousel();
  return (
    <button
      data-slot="inline-citation-carousel-prev"
      type="button"
      aria-label={labels.previous}
      className={cn(
        "shrink-0 rounded-md p-1 text-fg-tertiary outline-none hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
        className,
      )}
      onClick={goPrev}
      {...props}
    >
      <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
    </button>
  );
}

export type InlineCitationCarouselNextProps = HTMLAttributes<HTMLButtonElement>;

export function InlineCitationCarouselNext({
  className,
  ...props
}: InlineCitationCarouselNextProps) {
  const { goNext, labels } = useCarousel();
  return (
    <button
      data-slot="inline-citation-carousel-next"
      type="button"
      aria-label={labels.next}
      className={cn(
        "shrink-0 rounded-md p-1 text-fg-tertiary outline-none hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
        className,
      )}
      onClick={goNext}
      {...props}
    >
      <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
    </button>
  );
}

export type InlineCitationSourceProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  url?: string;
  description?: string;
};

export function InlineCitationSource({
  title,
  url,
  description,
  className,
  children,
  ...props
}: InlineCitationSourceProps) {
  return (
    <div data-slot="inline-citation-source" className={cn("space-y-1", className)} {...props}>
      {title ? (
        <h4 className="truncate text-sm font-medium leading-tight text-fg">{title}</h4>
      ) : null}
      {url ? <p className="truncate break-all text-xs text-fg-tertiary">{url}</p> : null}
      {description ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-fg-tertiary">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

export type InlineCitationQuoteProps = HTMLAttributes<HTMLQuoteElement>;

export function InlineCitationQuote({ children, className, ...props }: InlineCitationQuoteProps) {
  return (
    <blockquote
      data-slot="inline-citation-quote"
      className={cn("border-s-2 border-border ps-3 text-sm italic text-fg-tertiary", className)}
      {...props}
    >
      {children}
    </blockquote>
  );
}
