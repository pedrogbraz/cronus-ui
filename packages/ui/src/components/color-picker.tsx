"use client";

import {
  type ChangeEvent,
  forwardRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { Input } from "./input.js";
import { Label } from "./label.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

/**
 * OKLCH channel bounds. Lightness is perceptual 0..1; chroma is unbounded in
 * theory but display-P3/sRGB tops out near 0.37, so we clamp there for sane
 * sliders; hue is the usual 0..360 wheel.
 */
const L_MIN = 0;
const L_MAX = 1;
const C_MIN = 0;
const C_MAX = 0.37;
const H_MIN = 0;
const H_MAX = 360;

export interface OklchColor {
  /** Perceptual lightness, 0..1. */
  l: number;
  /** Chroma, 0..~0.37. */
  c: number;
  /** Hue angle in degrees, 0..360. */
  h: number;
}

export interface ColorPickerProps {
  /** Controlled color as a CSS color string (ideally `oklch(l c h)`). */
  value?: string;
  /** Initial color for uncontrolled usage. Defaults to a brand-ish oklch. */
  defaultValue?: string;
  /** Called with the new color, serialized as `oklch(l c h)`, on every change. */
  onValueChange?: (value: string) => void;
  /** Preset swatches shown as a row; clicking one selects it. */
  swatches?: string[];
  /** Disables the trigger and all panel controls. */
  disabled?: boolean;
  /** Accessible name for the trigger when there is no visible label. */
  "aria-label"?: string;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Extra classes for the popover panel. */
  contentClassName?: string;
  /** Native id for the trigger. */
  id?: string;
}

/** A tasteful default palette, authored natively in oklch. */
const DEFAULT_SWATCHES = [
  "oklch(0.62 0.21 256)", // blue
  "oklch(0.65 0.24 24)", // red
  "oklch(0.72 0.19 145)", // green
  "oklch(0.8 0.16 86)", // amber
  "oklch(0.62 0.25 304)", // violet
  "oklch(0.7 0.17 196)", // cyan
  "oklch(0.68 0.2 35)", // orange
  "oklch(0.5 0 0)", // neutral gray
] as const;

const DEFAULT_VALUE = "oklch(0.62 0.21 256)";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Trim trailing zeros so serialized strings stay tidy (0.6200 -> 0.62). */
function trim(value: number, digits: number): string {
  const fixed = value.toFixed(digits);
  return fixed.replace(/\.?0+$/, "") || "0";
}

/**
 * Parse an `oklch(l c h)` string into channels. Supports space- or
 * comma-separated values, an optional `/ alpha` (ignored), and percentage
 * lightness (`62%` -> 0.62). Returns `null` for anything that isn't oklch so
 * callers can fall back gracefully.
 */
function parseOklch(input: string): OklchColor | null {
  const match = /^oklch\(\s*([^)]+?)\s*\)$/i.exec(input.trim());
  const body = match?.[1];
  if (body === undefined) return null;
  // Drop any alpha component after a slash, then split on commas/whitespace.
  const parts = (body.split("/")[0] ?? "")
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
  const [rawL, rawC, rawH] = parts;
  if (rawL === undefined || rawC === undefined || rawH === undefined) return null;

  const parseChannel = (raw: string, scaleForPercent: number): number | null => {
    const isPercent = raw.endsWith("%");
    const num = Number.parseFloat(raw);
    if (Number.isNaN(num)) return null;
    return isPercent ? (num / 100) * scaleForPercent : num;
  };

  const l = parseChannel(rawL, 1);
  const c = parseChannel(rawC, C_MAX);
  const h = parseChannel(rawH, 1);
  if (l === null || c === null || h === null) return null;

  return {
    l: clamp(l, L_MIN, L_MAX),
    c: clamp(c, C_MIN, C_MAX),
    h: clamp(((h % 360) + 360) % 360, H_MIN, H_MAX),
  };
}

/** Serialize channels back to a canonical `oklch(l c h)` string. */
function serializeOklch({ l, c, h }: OklchColor): string {
  return `oklch(${trim(l, 4)} ${trim(c, 4)} ${trim(h, 2)})`;
}

/** A CSS color usable as a background tile for an arbitrary (maybe non-oklch) value. */
function tileColor(parsed: OklchColor | null, raw: string): string {
  return parsed ? serializeOklch(parsed) : raw;
}

/**
 * Translate a pointer event into a 0..1 fraction within an element along one
 * axis. Used by the 2D area; mirrors the math Radix Slider does internally but
 * stays dependency-free so the gradients can render in native oklch.
 */
function fractionFromPointer(
  element: HTMLElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const x = rect.width === 0 ? 0 : clamp((clientX - rect.left) / rect.width, 0, 1);
  const y = rect.height === 0 ? 0 : clamp((clientY - rect.top) / rect.height, 0, 1);
  return { x, y };
}

interface ChannelFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  precision: number;
  disabled?: boolean;
  onCommit: (next: number) => void;
}

/** A small labelled numeric input for one OKLCH channel. */
function ChannelField({
  label,
  value,
  min,
  max,
  step,
  precision,
  disabled,
  onCommit,
}: ChannelFieldProps) {
  const id = useId();
  // Mirror keystrokes locally so partial entries stay editable, syncing back
  // from the committed value whenever it changes from outside.
  const [text, setText] = useState(() => trim(value, precision));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(trim(value, precision));
  }, [value, precision, focused]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    setText(raw);
    const parsed = Number.parseFloat(raw);
    if (!Number.isNaN(parsed)) onCommit(clamp(parsed, min, max));
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = Number.parseFloat(text);
    if (Number.isNaN(parsed)) {
      setText(trim(value, precision));
    } else {
      const next = clamp(parsed, min, max);
      setText(trim(next, precision));
      onCommit(next);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="text-xs text-fg-secondary">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={text}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        data-slot="color-picker-channel"
        className="h-8 px-2 text-xs"
      />
    </div>
  );
}

export const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(
  (
    {
      value: valueProp,
      defaultValue = DEFAULT_VALUE,
      onValueChange,
      swatches = DEFAULT_SWATCHES as unknown as string[],
      disabled = false,
      "aria-label": ariaLabel,
      className,
      contentClassName,
      id,
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = isControlled ? valueProp : uncontrolledValue;

    // The string is the source of truth; the channels are derived. When the
    // string isn't oklch we keep `parsed === null` and fall back (tile shows the
    // raw color, sliders default) — but channel edits always produce oklch.
    const parsed = useMemo(() => parseOklch(value), [value]);
    const channels = parsed ?? parseOklch(DEFAULT_VALUE) ?? { l: 0.62, c: 0.21, h: 256 };

    const areaRef = useRef<HTMLDivElement | null>(null);
    const hueRef = useRef<HTMLDivElement | null>(null);

    const commit = useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const commitChannels = useCallback(
      (next: OklchColor) => {
        commit(
          serializeOklch({
            l: clamp(next.l, L_MIN, L_MAX),
            c: clamp(next.c, C_MIN, C_MAX),
            h: clamp(((next.h % 360) + 360) % 360, H_MIN, H_MAX),
          }),
        );
      },
      [commit],
    );

    // --- 2D area (x = chroma, y = lightness inverted) -----------------------
    const updateAreaFromPointer = useCallback(
      (clientX: number, clientY: number) => {
        const node = areaRef.current;
        if (!node) return;
        const { x, y } = fractionFromPointer(node, clientX, clientY);
        commitChannels({
          ...channels,
          c: x * C_MAX,
          l: (1 - y) * L_MAX,
        });
      },
      [channels, commitChannels],
    );

    const handleAreaPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      updateAreaFromPointer(event.clientX, event.clientY);
    };

    const handleAreaPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      // Only drag while the pointer is captured (i.e. a button is held).
      if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
      updateAreaFromPointer(event.clientX, event.clientY);
    };

    const handleAreaKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const lStep = event.shiftKey ? 0.1 : 0.02;
      const cStep = event.shiftKey ? 0.05 : 0.01;
      let handled = true;
      const next = { ...channels };
      switch (event.key) {
        case "ArrowUp":
          next.l = channels.l + lStep;
          break;
        case "ArrowDown":
          next.l = channels.l - lStep;
          break;
        case "ArrowRight":
          next.c = channels.c + cStep;
          break;
        case "ArrowLeft":
          next.c = channels.c - cStep;
          break;
        case "Home":
          next.c = C_MIN;
          break;
        case "End":
          next.c = C_MAX;
          break;
        default:
          handled = false;
      }
      if (handled) {
        event.preventDefault();
        commitChannels(next);
      }
    };

    // --- Hue slider ----------------------------------------------------------
    const updateHueFromPointer = useCallback(
      (clientX: number, clientY: number) => {
        const node = hueRef.current;
        if (!node) return;
        const { x } = fractionFromPointer(node, clientX, clientY);
        commitChannels({ ...channels, h: x * H_MAX });
      },
      [channels, commitChannels],
    );

    const handleHuePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      updateHueFromPointer(event.clientX, event.clientY);
    };

    const handleHuePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
      updateHueFromPointer(event.clientX, event.clientY);
    };

    const handleHueKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const step = event.shiftKey ? 15 : 3;
      let next: number | null = null;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = channels.h + step;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          next = channels.h - step;
          break;
        case "Home":
          next = H_MIN;
          break;
        case "End":
          next = H_MAX;
          break;
      }
      if (next !== null) {
        event.preventDefault();
        commitChannels({ ...channels, h: next });
      }
    };

    // --- Derived presentation ------------------------------------------------
    const swatchBackground = tileColor(parsed, value);
    // 2D area gradient: a lightness ramp (top=white-ish, bottom=black) layered
    // over a chroma ramp (left=gray, right=saturated) at the current hue. Both
    // built from native oklch() stops — no conversion.
    const areaBackground = useMemo(() => {
      const h = channels.h;
      const lightnessLayer = `linear-gradient(to bottom, oklch(1 0 ${h}) 0%, oklch(0 0 ${h}) 100%)`;
      const chromaLayer = `linear-gradient(to right, oklch(0.65 0 ${h}) 0%, oklch(0.65 ${C_MAX} ${h}) 100%)`;
      // Multiply so the chroma ramp tints the lightness ramp.
      return `${chromaLayer}, ${lightnessLayer}`;
    }, [channels.h]);

    const hueBackground = useMemo(() => {
      const stops: string[] = [];
      for (let deg = 0; deg <= 360; deg += 30) {
        stops.push(`oklch(0.7 0.2 ${deg}) ${(deg / 360) * 100}%`);
      }
      return `linear-gradient(to right, ${stops.join(", ")})`;
    }, []);

    // Thumb positions as percentages.
    const areaThumbX = (channels.c / C_MAX) * 100;
    const areaThumbY = (1 - channels.l / L_MAX) * 100;
    const hueThumbX = (channels.h / H_MAX) * 100;

    const triggerLabel = serializeOklch(channels);

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
      commit(event.target.value);
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-label={ariaLabel ? `${ariaLabel}: ${value}` : `Color: ${value}`}
            aria-haspopup="dialog"
            data-slot="color-picker-trigger"
            className={cn("h-10 w-full justify-start gap-2 font-normal", className)}
          >
            <span
              aria-hidden="true"
              data-slot="color-picker-swatch"
              className="size-5 shrink-0 rounded-md border border-border"
              style={{ background: swatchBackground }}
            />
            <span className="truncate text-sm tabular-nums">{value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          aria-label={ariaLabel ?? "Color picker"}
          data-slot="color-picker-content"
          className={cn("w-64 space-y-3", contentClassName)}
        >
          {/* 2D chroma x lightness area */}
          <div
            ref={areaRef}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label="Saturation and lightness"
            aria-valuetext={`Chroma ${trim(channels.c, 3)}, lightness ${trim(channels.l, 3)}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((channels.l / L_MAX) * 100)}
            aria-disabled={disabled || undefined}
            data-slot="color-picker-area"
            onPointerDown={handleAreaPointerDown}
            onPointerMove={handleAreaPointerMove}
            onKeyDown={handleAreaKeyDown}
            className="relative h-36 w-full cursor-crosshair touch-none overflow-hidden rounded-lg border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-floating data-[disabled]:opacity-50"
            style={{ background: areaBackground }}
          >
            <span
              aria-hidden="true"
              data-slot="color-picker-area-thumb"
              className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
              style={{
                left: `${areaThumbX}%`,
                top: `${areaThumbY}%`,
                background: triggerLabel,
              }}
            />
          </div>

          {/* Hue slider */}
          <div
            ref={hueRef}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label="Hue"
            aria-valuemin={H_MIN}
            aria-valuemax={H_MAX}
            aria-valuenow={Math.round(channels.h)}
            aria-disabled={disabled || undefined}
            data-slot="color-picker-hue"
            onPointerDown={handleHuePointerDown}
            onPointerMove={handleHuePointerMove}
            onKeyDown={handleHueKeyDown}
            className="relative h-4 w-full cursor-ew-resize touch-none rounded-full border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-floating data-[disabled]:opacity-50"
            style={{ background: hueBackground }}
          >
            <span
              aria-hidden="true"
              data-slot="color-picker-hue-thumb"
              className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
              style={{
                left: `${hueThumbX}%`,
                background: `oklch(0.7 0.2 ${channels.h})`,
              }}
            />
          </div>

          {/* L / C / H numeric inputs */}
          <div className="grid grid-cols-3 gap-2">
            <ChannelField
              label="L"
              value={channels.l}
              min={L_MIN}
              max={L_MAX}
              step={0.01}
              precision={4}
              disabled={disabled}
              onCommit={(l) => commitChannels({ ...channels, l })}
            />
            <ChannelField
              label="C"
              value={channels.c}
              min={C_MIN}
              max={C_MAX}
              step={0.01}
              precision={4}
              disabled={disabled}
              onCommit={(c) => commitChannels({ ...channels, c })}
            />
            <ChannelField
              label="H"
              value={channels.h}
              min={H_MIN}
              max={H_MAX}
              step={1}
              precision={2}
              disabled={disabled}
              onCommit={(h) => commitChannels({ ...channels, h })}
            />
          </div>

          {/* Full oklch() string, read-write */}
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${id ?? "color-picker"}-oklch`} className="text-xs text-fg-secondary">
              Value
            </Label>
            <Input
              id={`${id ?? "color-picker"}-oklch`}
              type="text"
              spellCheck={false}
              autoComplete="off"
              disabled={disabled}
              value={value}
              onChange={handleTextChange}
              data-slot="color-picker-value"
              className="h-8 px-2 font-mono text-xs"
            />
          </div>

          {/* Preset swatches */}
          {swatches.length > 0 ? (
            // biome-ignore lint/a11y/useSemanticElements: a labelled row of preset swatch buttons is role="group", not a <fieldset> (no form fields).
            <div
              role="group"
              aria-label="Preset colors"
              data-slot="color-picker-swatches"
              className="flex flex-wrap gap-1.5"
            >
              {swatches.map((swatch) => {
                const isActive = swatch === value;
                return (
                  <button
                    key={swatch}
                    type="button"
                    disabled={disabled}
                    aria-label={swatch}
                    aria-pressed={isActive}
                    data-slot="color-picker-swatch-button"
                    onClick={() => commit(swatch)}
                    className={cn(
                      "size-6 rounded-md border border-border transition-transform",
                      "outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-floating",
                      "disabled:pointer-events-none disabled:opacity-50",
                      isActive && "ring-2 ring-ring ring-offset-2 ring-offset-surface-floating",
                    )}
                    style={{ background: swatch }}
                  />
                );
              })}
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    );
  },
);
ColorPicker.displayName = "ColorPicker";
