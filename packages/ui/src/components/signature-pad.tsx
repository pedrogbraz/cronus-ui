"use client";

import { Eraser, Undo2 } from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";

interface Point {
  x: number;
  y: number;
}

const STROKE_WIDTH = 2;

/** Imperative surface exposed through the forwarded ref. */
export interface SignaturePadHandle {
  /** Erase every stroke and notify `onChange` with `null`. */
  clear: () => void;
  /** Remove the most recent stroke and re-notify `onChange`. */
  undo: () => void;
  /** `true` while no ink has been laid down on the pad. */
  isEmpty: () => boolean;
  /** Snapshot the current drawing as a data URL (`null` while the pad is empty). */
  toDataURL: (type?: string, quality?: number) => string | null;
}

export interface SignaturePadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Fired when a stroke is committed, undone, or the pad is cleared. Receives a
   * PNG data URL of the drawing, or `null` once the pad is empty again.
   */
  onChange?: (dataUrl: string | null) => void;
  /** Freezes the pad: pointer input is ignored and the overlay actions disable. */
  disabled?: boolean;
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function pointFromEvent(
  canvas: HTMLCanvasElement,
  event: { clientX: number; clientY: number },
): Point {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/**
 * Replays one recorded stroke with the exact same midpoint-quadratic math the
 * live pointer path uses: each raw sample becomes the *control* point of a
 * quadratic segment that runs between successive midpoints, which rounds off
 * the polyline corners jittery pointer input would otherwise leave behind. A
 * lone sample renders as a dot so a tap still leaves a mark. Returns the
 * trailing midpoint so an in-progress stroke can resume from it after a
 * resize-triggered repaint.
 */
function traceStroke(ctx: CanvasRenderingContext2D, stroke: readonly Point[]): Point | null {
  const first = stroke[0];
  if (!first) return null;
  ctx.beginPath();
  ctx.arc(first.x, first.y, STROKE_WIDTH / 2, 0, Math.PI * 2);
  ctx.fill();
  let prev = first;
  let lastMid = first;
  for (let index = 1; index < stroke.length; index += 1) {
    const point = stroke[index];
    if (!point) continue;
    const mid = midpoint(prev, point);
    ctx.beginPath();
    ctx.moveTo(lastMid.x, lastMid.y);
    ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y);
    ctx.stroke();
    prev = point;
    lastMid = mid;
  }
  if (stroke.length > 1) {
    // The curve chain stops at the trailing midpoint; cap it to the final sample.
    ctx.beginPath();
    ctx.moveTo(lastMid.x, lastMid.y);
    ctx.lineTo(prev.x, prev.y);
    ctx.stroke();
  }
  return lastMid;
}

/**
 * A canvas signature input. Pointer events (mouse / touch / pen) are captured
 * on the canvas and rendered as midpoint-smoothed quadratic curves: every raw
 * sample is used as a control point between successive midpoints, so shaky
 * input still produces a fluid line. Pointer moves never touch React state —
 * samples are queued in refs and painted inside a single pending
 * `requestAnimationFrame`, so drawing costs zero re-renders.
 *
 * The bitmap is `devicePixelRatio`-aware: a `ResizeObserver` resizes the
 * backing store to CSS-size × DPR and replays the stroke model (strokes are
 * stored in CSS pixels), so the ink stays crisp on retina displays and
 * survives layout changes. Ink color is resolved from the wrapper's computed
 * CSS `color` at stroke time, so the line follows the `text-fg` token (and
 * re-resolves per stroke after theme switches).
 *
 * The forwarded ref exposes an imperative API — `clear()`, `undo()`,
 * `isEmpty()`, `toDataURL()` — and `onChange` reports a PNG data URL (or
 * `null` when empty) whenever a stroke is committed, undone, or cleared. A
 * dashed "Sign here" baseline fades away once drawing starts
 * (`motion-reduce` disables the fade transition).
 */
export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  (
    { className, onChange, disabled = false, "aria-label": ariaLabel = "Signature pad", ...props },
    ref,
  ) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    /** Committed strokes, in CSS-pixel coordinates (the resize replay source). */
    const strokesRef = useRef<Point[][]>([]);
    /** The stroke currently being drawn (`null` when the pointer is up). */
    const currentStrokeRef = useRef<Point[] | null>(null);
    /** Index of the first sample of the current stroke not yet painted. */
    const paintedIndexRef = useRef(0);
    /** Trailing midpoint of the painted curve chain (next segment starts here). */
    const lastMidRef = useRef<Point | null>(null);
    const pointerIdRef = useRef<number | null>(null);
    const frameRef = useRef<number | null>(null);
    const [hasInk, setHasInk] = useState(false);

    const onChangeRef = useRef(onChange);
    useEffect(() => {
      onChangeRef.current = onChange;
    });

    const getContext = useCallback(() => {
      if (!ctxRef.current && canvasRef.current) {
        ctxRef.current = canvasRef.current.getContext("2d");
      }
      return ctxRef.current;
    }, []);

    /**
     * Configures the brush, resolving the ink color from the wrapper's
     * computed `color` so the stroke follows the surrounding text token.
     */
    const applyBrush = useCallback((ctx: CanvasRenderingContext2D) => {
      const wrapper = wrapperRef.current;
      const color =
        (wrapper && typeof window !== "undefined" && window.getComputedStyle(wrapper).color) ||
        "currentColor";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = STROKE_WIDTH;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }, []);

    /** Wipes the bitmap and replays the whole stroke model. */
    const repaint = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (!canvas || !ctx) return;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      applyBrush(ctx);
      for (const stroke of strokesRef.current) {
        traceStroke(ctx, stroke);
      }
      const current = currentStrokeRef.current;
      if (current) {
        lastMidRef.current = traceStroke(ctx, current);
        paintedIndexRef.current = current.length;
      }
    }, [applyBrush, getContext]);

    /** Paints every queued-but-unpainted sample of the in-progress stroke. */
    const paintPending = useCallback(() => {
      const ctx = getContext();
      const stroke = currentStrokeRef.current;
      if (!ctx || !stroke) return;
      for (let index = Math.max(1, paintedIndexRef.current); index < stroke.length; index += 1) {
        const prev = stroke[index - 1];
        const point = stroke[index];
        if (!prev || !point) continue;
        const mid = midpoint(prev, point);
        const from = lastMidRef.current ?? prev;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y);
        ctx.stroke();
        lastMidRef.current = mid;
      }
      paintedIndexRef.current = stroke.length;
    }, [getContext]);

    const scheduleFlush = useCallback(() => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        paintPending();
      });
    }, [paintPending]);

    const emitChange = useCallback(() => {
      const handler = onChangeRef.current;
      if (!handler) return;
      const canvas = canvasRef.current;
      if (strokesRef.current.length === 0 || !canvas) {
        handler(null);
        return;
      }
      handler(canvas.toDataURL());
    }, []);

    // Size the backing store to CSS-size × devicePixelRatio (resizing a canvas
    // erases it, so the strokes are replayed from the model afterwards).
    useEffect(() => {
      const wrapper = wrapperRef.current;
      const canvas = canvasRef.current;
      if (!wrapper || !canvas) return;

      const resize = () => {
        const rect = wrapper.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        // Scale so the drawing code works in CSS pixels at native sharpness.
        getContext()?.setTransform(dpr, 0, 0, dpr, 0, 0);
        repaint();
      };

      resize();
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(resize);
      observer.observe(wrapper);
      return () => observer.disconnect();
    }, [getContext, repaint]);

    // Drop any pending paint frame on unmount.
    useEffect(
      () => () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      },
      [],
    );

    const handlePointerDown = useCallback(
      (event: ReactPointerEvent<HTMLCanvasElement>) => {
        if (disabled) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        const canvas = event.currentTarget;
        const ctx = getContext();
        if (!ctx) return;
        pointerIdRef.current = event.pointerId;
        if (typeof canvas.setPointerCapture === "function") {
          try {
            canvas.setPointerCapture(event.pointerId);
          } catch {
            // Some environments reject capture for synthetic pointers; the
            // move/up handlers still work for in-bounds drawing without it.
          }
        }
        const point = pointFromEvent(canvas, event);
        currentStrokeRef.current = [point];
        paintedIndexRef.current = 1;
        lastMidRef.current = point;
        applyBrush(ctx);
        // Anchor dot so a tap leaves a mark even without any movement.
        ctx.beginPath();
        ctx.arc(point.x, point.y, STROKE_WIDTH / 2, 0, Math.PI * 2);
        ctx.fill();
        setHasInk(true);
      },
      [applyBrush, disabled, getContext],
    );

    const handlePointerMove = useCallback(
      (event: ReactPointerEvent<HTMLCanvasElement>) => {
        const stroke = currentStrokeRef.current;
        if (!stroke || event.pointerId !== pointerIdRef.current) return;
        const canvas = event.currentTarget;
        const native = event.nativeEvent;
        // Pens and high-rate mice batch samples between frames; unpack them so
        // fast flourishes keep their curvature instead of turning into chords.
        const coalesced =
          typeof native.getCoalescedEvents === "function" ? native.getCoalescedEvents() : [];
        const samples = coalesced.length > 0 ? coalesced : [native];
        for (const sample of samples) {
          stroke.push(pointFromEvent(canvas, sample));
        }
        scheduleFlush();
      },
      [scheduleFlush],
    );

    const finishStroke = useCallback(
      (event: ReactPointerEvent<HTMLCanvasElement>) => {
        if (event.pointerId !== pointerIdRef.current) return;
        const stroke = currentStrokeRef.current;
        if (!stroke) return;
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
        paintPending();
        const ctx = getContext();
        const last = stroke[stroke.length - 1];
        const lastMid = lastMidRef.current;
        if (ctx && last && lastMid && stroke.length > 1) {
          // Cap the curve chain through to the final sample (mirrors traceStroke).
          ctx.beginPath();
          ctx.moveTo(lastMid.x, lastMid.y);
          ctx.lineTo(last.x, last.y);
          ctx.stroke();
        }
        strokesRef.current.push(stroke);
        currentStrokeRef.current = null;
        pointerIdRef.current = null;
        lastMidRef.current = null;
        const canvas = event.currentTarget;
        if (typeof canvas.releasePointerCapture === "function") {
          try {
            canvas.releasePointerCapture(event.pointerId);
          } catch {
            // Capture may already be gone (e.g. pointercancel); nothing to undo.
          }
        }
        emitChange();
      },
      [emitChange, getContext, paintPending],
    );

    const clear = useCallback(() => {
      if (strokesRef.current.length === 0 && !currentStrokeRef.current) return;
      strokesRef.current = [];
      currentStrokeRef.current = null;
      pointerIdRef.current = null;
      lastMidRef.current = null;
      repaint();
      setHasInk(false);
      emitChange();
    }, [emitChange, repaint]);

    const undo = useCallback(() => {
      if (strokesRef.current.length === 0) return;
      strokesRef.current = strokesRef.current.slice(0, -1);
      repaint();
      setHasInk(strokesRef.current.length > 0 || currentStrokeRef.current !== null);
      emitChange();
    }, [emitChange, repaint]);

    useImperativeHandle(
      ref,
      () => ({
        clear,
        undo,
        isEmpty: () => strokesRef.current.length === 0 && currentStrokeRef.current === null,
        toDataURL: (type?: string, quality?: number) => {
          const canvas = canvasRef.current;
          if (!canvas || (strokesRef.current.length === 0 && !currentStrokeRef.current)) {
            return null;
          }
          return canvas.toDataURL(type, quality);
        },
      }),
      [clear, undo],
    );

    return (
      <div
        ref={wrapperRef}
        data-slot="signature-pad"
        data-empty={hasInk ? "false" : "true"}
        data-disabled={disabled ? "true" : undefined}
        className={cn(
          "relative h-40 w-full touch-none overflow-hidden rounded-xl border border-border bg-surface-inset text-fg shadow-xs",
          disabled && "opacity-60",
          className,
        )}
        {...props}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          data-slot="signature-pad-canvas"
          className={cn(
            "absolute inset-0 size-full",
            disabled ? "cursor-not-allowed" : "cursor-crosshair",
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
        />
        <div
          aria-hidden="true"
          data-slot="signature-pad-hint"
          className={cn(
            "pointer-events-none absolute inset-x-5 bottom-7 select-none transition-opacity duration-300 motion-reduce:transition-none",
            hasInk ? "opacity-0" : "opacity-100",
          )}
        >
          <div className="border-t border-dashed border-border-strong" />
          <span className="mt-1.5 block text-xs text-fg-muted">Sign here</span>
        </div>
        <div className="absolute end-1.5 bottom-1.5 flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Undo last stroke"
            disabled={disabled || !hasInk}
            onClick={undo}
          >
            <Undo2 aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Clear signature"
            disabled={disabled || !hasInk}
            onClick={clear}
          >
            <Eraser aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  },
);
SignaturePad.displayName = "SignaturePad";
