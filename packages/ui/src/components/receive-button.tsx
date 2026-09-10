"use client";

import { cva } from "class-variance-authority";
import { Fingerprint, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ComponentPropsWithoutRef, type Ref, useEffect, useId, useRef, useState } from "react";
import { cn } from "../lib/cn.js";

/** Skiper 45 / Family dialog spring — keep bounce byte-stable. */
const SPRING = { type: "spring" as const, bounce: 0.16, duration: 0.55 };

const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base";

const CTA = "h-10 w-full max-w-[300px] cursor-pointer rounded-full text-black bg-[#0ea5e9]"; // contract-ok: Family Receive fill the component paints; black type for AA on sky-500

export const receiveButtonVariants = cva(
  "relative flex min-h-[28rem] w-full flex-col items-center justify-end p-5 [overflow-anchor:none]",
);

export interface ReceiveButtonLabels {
  receive: string;
  confirm: string;
  description: string;
  cancel: string;
  close: string;
  hint: string;
}

export interface ReceiveButtonProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
  > {
  ref?: Ref<HTMLDivElement>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Fired when the dialog Receive action is pressed. The dialog then closes. */
  onConfirm?: () => void;
  labels?: Partial<ReceiveButtonLabels>;
}

const DEFAULT_LABELS: ReceiveButtonLabels = {
  receive: "Receive",
  confirm: "Confirm",
  description: "Are you sure you want to receive hell load of money?",
  cancel: "Cancel",
  close: "Close",
  hint: "Toggle layout with animation",
};

/**
 * Family Receive button (Skiper 45). A single Receive CTA lives at the bottom
 * of an overflow-hidden shell. Opening inserts the confirm chrome above it;
 * `layout` scaleY grows the shell upward (`justify-end` host) and nested
 * `layout` keeps the copy from squashing. Closing reverses that — the CTA
 * never leaves the bottom edge, so it cannot bounce through the top.
 */
export function ReceiveButton({
  ref,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onConfirm,
  labels: labelsProp,
  className,
  ...props
}: ReceiveButtonProps) {
  const reduce = !!useReducedMotion();
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : uncontrolled;
  const triggerRef = useRef<HTMLButtonElement>(null);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  const close = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openProp === undefined) setUncontrolled(false);
      onOpenChange?.(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, openProp, onOpenChange]);

  const transition = reduce ? { duration: 0 } : SPRING;
  const layout = !reduce;
  const ctaClass = cn(CTA, FOCUS);

  return (
    <div
      ref={ref}
      data-slot="receive-button"
      className={cn(receiveButtonVariants(), className)}
      {...props}
    >
      {labels.hint ? (
        <p className="absolute inset-x-0 top-12 mx-auto max-w-[12ch] text-center text-xs uppercase leading-tight text-fg-tertiary after:absolute after:inset-x-0 after:top-full after:mx-auto after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:to-fg after:content-['']">
          {labels.hint}
        </p>
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.button
            key="overlay"
            type="button"
            aria-label={labels.close}
            data-slot="receive-button-overlay"
            className="absolute inset-0 z-10 cursor-pointer bg-surface-overlay/10 backdrop-blur-[4px]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={transition}
            onClick={close}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={reduce ? undefined : { height: open ? "auto" : 40 }}
        transition={transition}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-labelledby={open ? titleId : undefined}
        aria-describedby={open ? descId : undefined}
        data-slot={open ? "receive-button-dialog" : undefined}
        className={cn(
          "relative z-20 flex w-full max-w-[430px] flex-col justify-end overflow-hidden",
          open && "bg-surface-base p-4",
        )}
        style={{ borderRadius: open ? 24 : 30 }}
      >
        {open ? (
          <div>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center justify-center gap-2 text-xl font-medium">
                <span
                  className="flex size-10 items-center justify-center rounded-full bg-[#0ea5e9]/10" // contract-ok: Family Receive fill the component paints
                >
                  <Fingerprint
                    className="size-6 text-[#0ea5e9]" // contract-ok: Family Receive fill the component paints
                    aria-hidden="true"
                  />
                </span>
                <h2 id={titleId}>{labels.confirm}</h2>
              </div>
              <button
                type="button"
                data-slot="receive-button-close"
                aria-label={labels.close}
                className={cn("cursor-pointer rounded-full p-1", FOCUS)}
                onClick={close}
              >
                <Plus
                  className="size-6 rotate-45 text-[#0ea5e9]" // contract-ok: Family Receive fill the component paints
                  aria-hidden="true"
                />
              </button>
            </div>
            <p id={descId} className="my-5 w-[16.25rem] text-fg-tertiary">
              {labels.description}
            </p>
          </div>
        ) : null}

        <div className={cn("flex items-center gap-2", open ? "justify-end" : "justify-center")}>
          {open ? (
            <button
              type="button"
              data-slot="receive-button-cancel"
              className={cn("h-10 w-full cursor-pointer rounded-full bg-surface-overlay", FOCUS)}
              onClick={close}
            >
              {labels.cancel}
            </button>
          ) : null}
          <motion.button
            ref={triggerRef}
            type="button"
            layout={layout}
            transition={transition}
            data-slot="receive-button-trigger"
            aria-haspopup="dialog"
            aria-expanded={open}
            className={ctaClass}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            onClick={() => {
              if (open) {
                onConfirm?.();
                close();
                return;
              }
              setOpen(true);
            }}
          >
            <motion.span layout="position">{labels.receive}</motion.span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
