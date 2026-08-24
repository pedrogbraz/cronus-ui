"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { forwardRef, type HTMLAttributes, useCallback, useEffect, useState } from "react";
import { cn } from "../lib/cn.js";
import { Dialog, DialogClose, DialogContent } from "./dialog.js";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface LightboxProps extends HTMLAttributes<HTMLDivElement> {
  /** The images to display in the gallery. */
  images: LightboxImage[];
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Controlled active image index. */
  index?: number;
  /** Called when the active index should change. */
  onIndexChange?: (index: number) => void;
  /** Uncontrolled initial index. */
  defaultIndex?: number;
}

export const Lightbox = forwardRef<HTMLDivElement, LightboxProps>(
  (
    {
      className,
      images,
      open,
      onOpenChange,
      defaultOpen = false,
      index,
      onIndexChange,
      defaultIndex = 0,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isOpenControlled = open !== undefined;
    const isOpen = isOpenControlled ? open : uncontrolledOpen;

    const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
    const isIndexControlled = index !== undefined;
    const currentIndex = isIndexControlled ? index : uncontrolledIndex;

    const count = images.length;
    const clampedIndex = count > 0 ? Math.min(Math.max(currentIndex, 0), count - 1) : 0;

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isOpenControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isOpenControlled, onOpenChange],
    );

    const setIndex = useCallback(
      (next: number) => {
        if (count === 0) return;
        const clamped = Math.min(Math.max(next, 0), count - 1);
        if (!isIndexControlled) setUncontrolledIndex(clamped);
        onIndexChange?.(clamped);
      },
      [count, isIndexControlled, onIndexChange],
    );

    const current = images[clampedIndex];

    const goPrev = useCallback(() => setIndex(clampedIndex - 1), [setIndex, clampedIndex]);
    const goNext = useCallback(() => setIndex(clampedIndex + 1), [setIndex, clampedIndex]);

    useEffect(() => {
      if (!isOpen) return;
      const handler = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          goNext();
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [isOpen, goPrev, goNext]);

    const atStart = clampedIndex <= 0;
    const atEnd = clampedIndex >= count - 1;

    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent
          // The header renders its own dark-themed close, so suppress the
          // dialog's default light-theme one.
          showCloseButton={false}
          className="inset-0 h-full max-w-full rounded-none border-none bg-black/95 p-0 text-white"
          aria-label="Image gallery"
        >
          <div
            ref={ref}
            data-slot="lightbox"
            className={cn("flex h-full w-full flex-col", className)}
            {...props}
          >
            <div className="flex items-center justify-between gap-2 p-4">
              <span data-slot="lightbox-counter" className="text-sm text-white/70">
                {count > 0 ? `${clampedIndex + 1} / ${count}` : "0 / 0"}
              </span>
              <DialogClose
                data-slot="lightbox-close"
                aria-label="Close"
                className="rounded-md p-1.5 text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <X className="size-5" />
              </DialogClose>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2">
              <button
                type="button"
                aria-label="Previous image"
                onClick={goPrev}
                disabled={atStart}
                className="absolute left-2 z-10 rounded-full bg-black/40 p-2 text-white/80 outline-none transition-colors hover:bg-black/60 hover:text-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-6" />
              </button>

              {current ? (
                <img
                  data-slot="lightbox-image"
                  src={current.src}
                  alt={current.alt}
                  className="max-h-full max-w-full object-contain"
                />
              ) : null}

              <button
                type="button"
                aria-label="Next image"
                onClick={goNext}
                disabled={atEnd}
                className="absolute right-2 z-10 rounded-full bg-black/40 p-2 text-white/80 outline-none transition-colors hover:bg-black/60 hover:text-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>

            {current?.caption ? (
              <p
                data-slot="lightbox-caption"
                className="px-4 pt-3 text-center text-sm text-white/80"
              >
                {current.caption}
              </p>
            ) : null}

            {count > 1 ? (
              <div
                data-slot="lightbox-thumbnails"
                className="flex items-center justify-center gap-2 overflow-x-auto p-4"
              >
                {images.map((image, i) => (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: src may repeat, index disambiguates
                    key={`${image.src}-${i}`}
                    type="button"
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === clampedIndex}
                    onClick={() => setIndex(i)}
                    className={cn(
                      // contract-ok: anel externo com literal, não ring-inset nem
                      // ring-offset-surface-*. O inset é um box-shadow interno e
                      // a <img> abaixo o cobre por inteiro — o foco sumiria. E o
                      // fundo aqui é o scrim bg-black/95 que este componente
                      // define, não um token de superfície, então branco sobre
                      // preto é o par correto (ver docs/adr/0001). O offset
                      // separa o anel da miniatura; a seleção usa anel rente,
                      // então os dois estados continuam distinguíveis.
                      "size-14 shrink-0 overflow-hidden rounded-md outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                      i === clampedIndex ? "ring-2 ring-white" : "opacity-60 hover:opacity-100",
                    )}
                  >
                    {/* Decorative: the button's aria-label already names it. */}
                    <img src={image.src} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
Lightbox.displayName = "Lightbox";
