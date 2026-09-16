"use client";

import { CircleAlert, TriangleAlert } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog.js";
import { buttonVariants } from "./button.js";
import { Spinner } from "./spinner.js";

function resolveErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error) {
    return error;
  }
  return "Something went wrong. Please try again.";
}

export interface ConfirmationDialogProps
  extends Omit<ComponentPropsWithoutRef<typeof AlertDialogContent>, "title" | "children"> {
  /** Element that opens the dialog. Rendered inside an `AlertDialogTrigger asChild`, so a single focusable child (e.g. a `Button`) is expected. Omit when driving the dialog purely via `open`. */
  trigger?: ReactNode;
  /** Dialog heading — labels the dialog for assistive tech (rendered as `AlertDialogTitle`). */
  title: ReactNode;
  /** Supporting copy describing the consequence of the action (rendered as `AlertDialogDescription`). */
  description?: ReactNode;
  /** Text for the confirm button. @default "Confirm" */
  confirmLabel?: ReactNode;
  /** Text for the cancel button. @default "Cancel" */
  cancelLabel?: ReactNode;
  /** Style the confirm button as a destructive (red) action and default the header icon to a warning triangle. @default false */
  destructive?: boolean;
  /** Icon shown in the header badge. Defaults to a warning triangle when `destructive`, otherwise none. Pass `null` to force it off. */
  icon?: ReactNode;
  /** Invoked when the user confirms. If it returns a promise, the confirm button shows a spinner and is disabled until it settles; on resolve the dialog closes, on reject it stays open and surfaces the error message. */
  onConfirm?: () => void | Promise<void>;
  /** Controlled open state. Provide alongside `onOpenChange` to control the dialog externally. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called whenever the open state changes (opening, cancelling, or confirming). Dismissal is suppressed while a confirm promise is pending. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * An ergonomic confirmation dialog for destructive or irreversible actions,
 * composed on top of the accessible `AlertDialog` primitive (which supplies the
 * `alertdialog` role, focus trap, and Escape handling).
 *
 * Behavior: `onConfirm` may be async — while its promise is pending the confirm
 * button shows a `Spinner`, both actions are disabled, and the dialog cannot be
 * dismissed (Escape/Cancel are ignored) so the operation can't be interrupted
 * mid-flight. On resolve the dialog closes; on reject it stays open and renders
 * the error in a `role="alert"` region. Works controlled (`open`/`onOpenChange`)
 * or uncontrolled (`defaultOpen`).
 *
 * Performance/a11y: no timers or animation loops of its own; late promise
 * settlements are ignored after unmount via a mounted ref. The spinner is
 * decorative (`aria-hidden`) with loading state conveyed through `aria-busy`,
 * keeping the button's accessible name stable. All entrance/exit motion is owned
 * by the underlying primitive and degrades under `prefers-reduced-motion`.
 */
export const ConfirmationDialog = forwardRef<
  ComponentRef<typeof AlertDialogContent>,
  ConfirmationDialogProps
>(
  (
    {
      trigger,
      title,
      description,
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      destructive = false,
      icon,
      onConfirm,
      open,
      defaultOpen,
      onOpenChange,
      className,
      ...contentProps
    },
    ref,
  ) => {
    const isControlled = open !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
    const isOpen = isControlled ? open : uncontrolledOpen;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadingRef = useRef(false);
    const mountedRef = useRef(true);
    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(next);
        }
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const handleOpenChange = useCallback(
      (next: boolean) => {
        // Never let the dialog be dismissed while a confirm promise is pending.
        if (loadingRef.current && !next) {
          return;
        }
        if (next) {
          setError(null);
        }
        setOpen(next);
      },
      [setOpen],
    );

    const beginLoading = useCallback((value: boolean) => {
      loadingRef.current = value;
      setLoading(value);
    }, []);

    const handleConfirm = useCallback(async () => {
      setError(null);
      if (!onConfirm) {
        setOpen(false);
        return;
      }
      const result = onConfirm();
      if (!(result instanceof Promise)) {
        setOpen(false);
        return;
      }
      beginLoading(true);
      try {
        await result;
        if (!mountedRef.current) {
          return;
        }
        beginLoading(false);
        setOpen(false);
      } catch (err) {
        if (!mountedRef.current) {
          return;
        }
        beginLoading(false);
        setError(resolveErrorMessage(err));
      }
    }, [onConfirm, beginLoading, setOpen]);

    const resolvedIcon = icon !== undefined ? icon : destructive ? <TriangleAlert /> : null;

    return (
      <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
        {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
        <AlertDialogContent
          ref={ref}
          data-slot="confirmation-dialog"
          className={cn("max-w-md", className)}
          {...contentProps}
        >
          <AlertDialogHeader>
            {resolvedIcon !== null ? (
              <div
                aria-hidden
                data-slot="confirmation-dialog-icon"
                className={cn(
                  "mb-1 flex size-11 items-center justify-center self-center rounded-full sm:self-start [&_svg]:size-5",
                  destructive ? "bg-error/10 text-error" : "bg-primary/10 text-primary",
                )}
              >
                {resolvedIcon}
              </div>
            ) : null}
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
          </AlertDialogHeader>

          {error ? (
            <div
              role="alert"
              data-slot="confirmation-dialog-error"
              className="flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-start text-sm text-error-strong"
            >
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
            <button
              type="button"
              data-slot="confirmation-dialog-confirm"
              disabled={loading}
              aria-busy={loading}
              onClick={handleConfirm}
              className={cn(
                buttonVariants({ variant: destructive ? "destructive" : "primary" }),
                "min-w-24",
              )}
            >
              {loading ? <Spinner size="sm" aria-hidden /> : null}
              {confirmLabel}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);
ConfirmationDialog.displayName = "ConfirmationDialog";
