"use client";

import { tokensToCssVars } from "@cooud-ui/tokens";
import { cn } from "@cooud-ui/ui";
import { Maximize2, Moon, RotateCcw, Sun } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";

interface Preset {
  name: string;
  primary: string;
  accent: string;
}

const PRESETS: Preset[] = [
  { name: "Sky", primary: "oklch(0.685 0.169 237.3)", accent: "oklch(0.715 0.143 215.2)" },
  { name: "Violet", primary: "oklch(0.62 0.21 292)", accent: "oklch(0.7 0.17 300)" },
  { name: "Emerald", primary: "oklch(0.7 0.15 162)", accent: "oklch(0.72 0.13 178)" },
  { name: "Amber", primary: "oklch(0.78 0.16 70)", accent: "oklch(0.82 0.13 85)" },
  { name: "Rose", primary: "oklch(0.65 0.23 12)", accent: "oklch(0.7 0.18 2)" },
];

/**
 * The sticky right-hand preview pane: renders the block in its own scoped theme
 * (so presets re-color only the preview) with a toolbar and preset chips.
 */
export function BlockPreview({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState(0);
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [resetKey, setResetKey] = useState(0);
  const paneRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else paneRef.current?.requestFullscreen().catch(() => {});
  };

  const current = PRESETS[preset] ?? PRESETS[0];
  const style = current
    ? tokensToCssVars({ primary: current.primary, accent: current.accent, ring: current.primary })
    : {};

  return (
    <div ref={paneRef} className="relative flex h-full flex-col overflow-hidden bg-surface-base">
      {/* Toolbar */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-lg border border-border bg-surface-raised/70 p-1 backdrop-blur">
        <ToolButton label="Reset" onClick={() => setResetKey((k) => k + 1)}>
          <RotateCcw className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label={mode === "dark" ? "Light preview" : "Dark preview"}
          onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
        >
          {mode === "dark" ? (
            <Sun className="size-4" aria-hidden="true" />
          ) : (
            <Moon className="size-4" aria-hidden="true" />
          )}
        </ToolButton>
        <ToolButton label="Fullscreen" onClick={toggleFullscreen}>
          <Maximize2 className="size-4" aria-hidden="true" />
        </ToolButton>
      </div>

      {/* Themed, scrollable preview surface */}
      <div
        key={resetKey}
        data-cooud-theme="aurora"
        data-cooud-mode={mode}
        style={style}
        className={cn(
          "flex-1 overflow-x-auto overflow-y-auto bg-surface-base px-4 py-14 sm:px-6 lg:px-8",
          // Smoothly cross-fade the brand colors when a preset is chosen.
          "transition-[--cooud-primary,--cooud-accent,--cooud-ring] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
          mode === "dark" ? "dark" : "",
        )}
      >
        <div className="mx-auto flex min-h-full w-full min-w-0 max-w-6xl items-center">
          <div className="w-full">{children}</div>
        </div>
      </div>

      {/* Preset chips */}
      <div className="pointer-events-none absolute inset-x-3 bottom-4 z-20 flex justify-center">
        <div className="pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-surface-raised/80 p-1 backdrop-blur">
          {PRESETS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPreset(i)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                i === preset
                  ? "bg-surface-floating text-fg shadow-xs"
                  : "text-fg-tertiary hover:text-fg",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-8 place-items-center rounded-md text-fg-tertiary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  );
}
