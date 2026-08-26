"use client";

import { useTheme } from "@kronus-ui/theme";
import { modes, serializeOverrides, type ThemeOverrides, themeNames } from "@kronus-ui/tokens";
import { Button, cn, Label, Separator } from "@kronus-ui/ui";
import { Check, Copy, Moon, RotateCcw, Sun } from "lucide-react";
import { type ReactNode, useState } from "react";

/** Pull a px number out of a `radius` override (or fall back to the default). */
function parseRadius(radius: string | undefined): number {
  if (!radius) return 14;
  const n = Number.parseInt(radius, 10);
  return Number.isNaN(n) ? 14 : n;
}

/**
 * A normalized #rrggbb value for the color inputs (they reject non-hex).
 *
 * The hex literals passed in as fallbacks below are theme DATA — the value the
 * `<input type="color">` round-trips — not chrome styling. ADR 0001's "no raw
 * hex" rule targets surfaces that must re-theme themselves; this builder's job
 * is to author those colors, so its swatches and hex strings stay literal.
 */
function asHex(value: string | undefined, fallback: string): string {
  if (value && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return value;
  return fallback;
}

const themeLabels: Record<string, string> = {
  aurora: "Aurora",
  neutral: "Neutral",
};

export function ThemeBuilder() {
  const { theme, mode, overrides, setTheme, setMode, setOverrides } = useTheme();
  const [copied, setCopied] = useState(false);

  const radius = parseRadius(overrides.radius);
  const hasOverrides = Object.keys(overrides).length > 0;

  function patch(next: ThemeOverrides) {
    setOverrides({ ...overrides, ...next });
  }

  function reset() {
    setOverrides({});
  }

  const snippet = serializeOverrides(overrides, ":root");

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard may be unavailable — ignore.
    }
  }

  return (
    <aside
      className="flex w-full min-w-0 flex-col gap-6 rounded-2xl border border-border bg-surface-raised p-4 shadow-md sm:p-6 lg:sticky lg:top-24"
      aria-label="Theme builder"
    >
      <header className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-fg-tertiary">
          Live preview
        </span>
        <h2 className="font-display text-lg font-medium text-fg">Theme Builder</h2>
        <p className="text-sm text-fg-secondary">
          Tweak tokens and watch the whole page re-theme instantly.
        </p>
      </header>

      <Separator />

      {/* Theme selector */}
      <Row label="Theme" htmlFor={undefined}>
        <fieldset className="grid grid-cols-2 gap-2 border-0 p-0 m-0 min-w-0" aria-label="Theme">
          {themeNames.map((name) => {
            const active = theme === name;
            return (
              // Selected reads achromatically — a firmed border on a floating
              // surface — so the chrome carries no decorative hue; the colors
              // the user is authoring live in the swatches below instead.
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setTheme(name)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium outline-none",
                  "transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised",
                  active
                    ? "border-border-strong bg-surface-floating text-fg shadow-xs"
                    : "border-border bg-surface-inset text-fg-secondary hover:border-border-strong hover:text-fg",
                )}
              >
                {themeLabels[name] ?? name}
              </button>
            );
          })}
        </fieldset>
      </Row>

      {/* Mode selector */}
      <Row label="Mode" htmlFor={undefined}>
        <fieldset
          className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-surface-inset p-1 m-0 min-w-0"
          aria-label="Color mode"
        >
          {modes.map((m) => {
            const active = mode === m;
            const Icon = m === "dark" ? Moon : Sun;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={active}
                onClick={() => setMode(m)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium capitalize outline-none",
                  "transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-surface-floating text-fg shadow-xs"
                    : "text-fg-tertiary hover:text-fg",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {m}
              </button>
            );
          })}
        </fieldset>
      </Row>

      {/* Radius slider */}
      <Row
        label="Radius"
        htmlFor="tb-radius"
        trailing={
          <span className="font-mono text-xs tabular-nums text-fg-secondary">{radius}px</span>
        }
      >
        <input
          id="tb-radius"
          type="range"
          min={0}
          max={28}
          step={1}
          value={radius}
          onChange={(e) => patch({ radius: `${e.target.value}px` })}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-overlay accent-fg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Corner radius in pixels"
        />
      </Row>

      {/* Primary color — the hex fallback is the field's data value, not
          decoration: it is what the color input shows before an override. */}
      <Row label="Primary" htmlFor="tb-primary">
        <ColorField
          id="tb-primary"
          value={asHex(overrides.primary, "#0ea5e9")}
          onChange={(hex) => patch({ primary: hex })}
          hint="Brand / action color"
        />
      </Row>

      {/* Border color — same: the hex is the edited value, kept literal. */}
      <Row label="Border" htmlFor="tb-border">
        <ColorField
          id="tb-border"
          value={asHex(overrides.border, "#3f3f46")}
          onChange={(hex) => patch({ border: hex, borderStrong: hex })}
          hint="Lines & dividers"
        />
      </Row>

      <Separator />

      {/* Reset */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-fg-tertiary">
          {hasOverrides ? "Custom overrides active" : "Using theme defaults"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          disabled={!hasOverrides}
          aria-label="Reset overrides to theme defaults"
        >
          <RotateCcw aria-hidden="true" />
          Reset
        </Button>
      </div>

      {/* Code block */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium uppercase tracking-wider text-fg-tertiary">
            CSS overrides
          </Label>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={copySnippet}
            disabled={!hasOverrides}
            aria-label="Copy CSS to clipboard"
          >
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          </Button>
        </div>
        <pre className="max-h-56 max-w-full overflow-auto rounded-lg border border-border bg-surface-inset p-3 font-mono text-xs leading-relaxed text-fg-secondary">
          <code>{hasOverrides ? snippet : "/* No overrides — adjust a control above */"}</code>
        </pre>
      </div>
    </aside>
  );
}

interface RowProps {
  label: string;
  htmlFor: string | undefined;
  trailing?: ReactNode;
  children: ReactNode;
}

function Row({ label, htmlFor, trailing, children }: RowProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {htmlFor ? (
          <Label htmlFor={htmlFor}>{label}</Label>
        ) : (
          <span className="text-sm font-medium leading-none text-fg">{label}</span>
        )}
        {trailing}
      </div>
      {children}
    </div>
  );
}

interface ColorFieldProps {
  id: string;
  value: string;
  hint: string;
  onChange: (hex: string) => void;
}

function ColorField({ id, value, hint, onChange }: ColorFieldProps) {
  return (
    // Flattened: this used to be a bordered card nested inside the builder
    // card. It is now a ruled row — one hairline above it, hover on the row
    // background only.
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 border-t border-border px-1 py-2.5 transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-surface-inset motion-reduce:transition-none"
    >
      {/* The swatch IS the output: it paints the exact value the user picked,
          so its inline color stays literal (see the note on `asHex`). */}
      <span
        className="size-9 shrink-0 rounded-md border border-border-soft"
        style={{ backgroundColor: value }}
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-col">
        <span className="font-mono text-sm uppercase text-fg">{value}</span>
        <span className="truncate text-xs text-fg-tertiary">{hint}</span>
      </span>
      <input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </label>
  );
}
