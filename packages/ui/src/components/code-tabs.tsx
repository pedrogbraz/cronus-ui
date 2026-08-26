"use client";

import { forwardRef, type HTMLAttributes, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn.js";
import { CopyButton } from "./copy-button.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

/**
 * Same-page instances broadcast tab changes over this window event, because
 * the native `storage` event only fires in *other* documents. Cross-tab sync
 * still rides the native event; this one covers siblings in the same page.
 */
const SYNC_EVENT = "cronus-ui:code-tabs";

/** Separator used to derive a stable dependency key from the item labels. */
const LABEL_SEPARATOR = "\u0000";

interface CodeTabsSyncDetail {
  key: string;
  label: string;
}

/** Read a persisted label, tolerating blocked storage (private mode, iframes). */
function readStoredLabel(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Persist a label, silently ignoring quota/permission failures. */
function writeStoredLabel(key: string, label: string): void {
  try {
    window.localStorage.setItem(key, label);
  } catch {
    // Storage may be unavailable — the in-memory state still works.
  }
}

export interface CodeTabsItem {
  /** Tab label (e.g. "bun"). Doubles as the tab value, so labels must be unique. */
  label: string;
  /** Raw source rendered in the panel and written to the clipboard on copy. */
  code: string;
  /** Optional language hint shown at the far end of the header (e.g. "bash"). */
  language?: string;
}

export interface CodeTabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "dir" | "onChange"> {
  /** The snippets to switch between — one tab + one panel per item. */
  items: CodeTabsItem[];
  /**
   * Label selected on first render. Falls back to the first item when omitted
   * or unknown. When {@link CodeTabsProps.storageKey} is set, a stored choice
   * (applied after mount) wins over this.
   */
  defaultLabel?: string;
  /**
   * Persist the chosen label to `localStorage` under this key and keep every
   * `CodeTabs` sharing the key in sync — across the page *and* across browser
   * tabs. The stored value is only read after mount, so server-rendered HTML
   * and the first client render always agree (no hydration mismatch).
   */
  storageKey?: string;
  /** Called with the newly selected label on user-initiated changes. */
  onLabelChange?: (label: string) => void;
}

/**
 * A code-snippet switcher — the classic bun/npm/pnpm/yarn installer tabs, or
 * any set of labelled snippets. Built on the Radix-powered `Tabs` primitives,
 * so the tablist gets roving focus, arrow-key activation and correct
 * tab/tabpanel semantics for free. Two mechanisms are worth calling out:
 *
 * - **Shared persistence.** Pass a `storageKey` and the chosen label is
 *   written to `localStorage` and broadcast on a window event, so every
 *   `CodeTabs` with the same key flips together — pick pnpm once, see pnpm
 *   everywhere, including on the next visit. Reads happen after mount only,
 *   keeping server and client HTML identical (SSR-safe).
 * - **Sliding indicator.** The active-tab underline is a single absolutely
 *   positioned element. On selection (and on resize) the active trigger is
 *   measured inside a `requestAnimationFrame` and the result is written to
 *   CSS custom properties on the tablist — React never re-renders to move
 *   it, and the travel transition is disabled under
 *   `prefers-reduced-motion: reduce` (the underline still jumps into place).
 *
 * Each panel renders its code in `font-mono` inside a focusable, horizontally
 * scrollable tabpanel, with a per-tab copy button that never scrolls away.
 */
export const CodeTabs = forwardRef<HTMLDivElement, CodeTabsProps>(
  ({ items, defaultLabel, storageKey, onLabelChange, className, ...props }, ref) => {
    const listRef = useRef<HTMLDivElement | null>(null);

    const fallbackLabel =
      defaultLabel && items.some((item) => item.label === defaultLabel)
        ? defaultLabel
        : items[0]?.label;

    const [active, setActive] = useState(fallbackLabel);
    // Guard against stale state when `items` change under us.
    const resolvedActive = items.some((item) => item.label === active) ? active : fallbackLabel;
    const activeItem = items.find((item) => item.label === resolvedActive);

    const labelsKey = items.map((item) => item.label).join(LABEL_SEPARATOR);

    // Adopt the persisted choice after mount and follow later changes from
    // sibling instances (custom event) and other browser tabs (storage event).
    useEffect(() => {
      if (!storageKey) return;
      const labels = labelsKey.split(LABEL_SEPARATOR);

      const adopt = (label: string | null) => {
        if (label && labels.includes(label)) setActive(label);
      };
      adopt(readStoredLabel(storageKey));

      const handleSync = (event: Event) => {
        const detail = (event as CustomEvent<CodeTabsSyncDetail>).detail;
        if (detail?.key === storageKey) adopt(detail.label);
      };
      const handleStorage = (event: StorageEvent) => {
        if (event.key === storageKey) adopt(event.newValue);
      };

      window.addEventListener(SYNC_EVENT, handleSync);
      window.addEventListener("storage", handleStorage);
      return () => {
        window.removeEventListener(SYNC_EVENT, handleSync);
        window.removeEventListener("storage", handleStorage);
      };
    }, [storageKey, labelsKey]);

    // Position the sliding underline. The measurement is written straight to
    // the DOM as CSS custom properties inside a requestAnimationFrame — no
    // React re-render is involved in moving the indicator. `--code-tabs-ready`
    // keeps it invisible until the first real measurement lands, so it never
    // animates in from a zero-width flash.
    useEffect(() => {
      const list = listRef.current;
      // `labelsKey` participates so relabelled items re-measure even when the
      // active label itself is unchanged.
      if (!list || !resolvedActive || !labelsKey) return;

      let frame: number | null = null;
      const measure = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          frame = null;
          const current = listRef.current;
          const trigger = current?.querySelector<HTMLElement>('[data-state="active"]');
          if (!current || !trigger) return;
          current.style.setProperty("--code-tabs-x", `${trigger.offsetLeft}px`);
          current.style.setProperty("--code-tabs-w", `${trigger.offsetWidth}px`);
          current.style.setProperty("--code-tabs-ready", "1");
        });
      };
      measure();

      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(measure);
      observer.observe(list);
      return () => {
        if (frame !== null) cancelAnimationFrame(frame);
        observer.disconnect();
      };
    }, [resolvedActive, labelsKey]);

    const handleValueChange = useCallback(
      (label: string) => {
        setActive(label);
        onLabelChange?.(label);
        if (!storageKey) return;
        writeStoredLabel(storageKey, label);
        window.dispatchEvent(
          new CustomEvent<CodeTabsSyncDetail>(SYNC_EVENT, {
            detail: { key: storageKey, label },
          }),
        );
      },
      [onLabelChange, storageKey],
    );

    if (items.length === 0) return null;

    return (
      <Tabs
        ref={ref}
        value={resolvedActive}
        onValueChange={handleValueChange}
        data-slot="code-tabs"
        className={cn(
          "gap-0 overflow-hidden rounded-xl border border-border bg-surface-raised text-fg",
          className,
        )}
        {...props}
      >
        <div
          data-slot="code-tabs-header"
          className="flex items-center justify-between gap-3 border-b border-border bg-surface-overlay pr-3"
        >
          <TabsList
            ref={listRef}
            data-slot="code-tabs-list"
            className="relative h-auto gap-0 rounded-none bg-transparent p-0"
          >
            {items.map((item) => (
              <TabsTrigger
                key={item.label}
                value={item.label}
                data-slot="code-tabs-trigger"
                className="rounded-none px-3.5 py-2.5 text-fg-tertiary hover:text-fg-secondary focus-visible:ring-inset focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:text-fg data-[state=active]:shadow-none"
              >
                {item.label}
              </TabsTrigger>
            ))}
            <span
              aria-hidden="true"
              data-slot="code-tabs-indicator"
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
              style={{
                opacity: "var(--code-tabs-ready, 0)",
                width: "var(--code-tabs-w, 0px)",
                transform: "translateX(var(--code-tabs-x, 0px))",
              }}
            />
          </TabsList>
          {activeItem?.language ? (
            <span
              data-slot="code-tabs-language"
              // Information-bearing label — `fg-muted` fails AA on the header
              // surface, so it uses `fg-tertiary` (the next step up, which passes).
              className="shrink-0 font-mono text-fg-tertiary text-xs"
            >
              {activeItem.language}
            </span>
          ) : null}
        </div>

        <div data-slot="code-tabs-panels" className="relative">
          {activeItem ? (
            // Keyed by label so the "copied" feedback resets when switching tabs
            // — each tab gets its own copy button state. Positioned outside the
            // scroll container so it never scrolls away with wide snippets.
            <CopyButton
              key={activeItem.label}
              value={activeItem.code}
              size="icon-sm"
              aria-label={`Copy ${activeItem.label} snippet`}
              className="absolute top-2 right-2 z-10 shrink-0 bg-surface-overlay/80 backdrop-blur-sm"
            />
          ) : null}
          {items.map((item) => (
            // The tabpanel itself is the horizontal-scroll container. Radix
            // renders it with tabIndex=0, so keyboard users can scroll wide
            // snippets (axe scrollable-region-focusable, WCAG 2.1.1), and it
            // is named by its tab via aria-labelledby.
            <TabsContent
              key={item.label}
              value={item.label}
              data-slot="code-tabs-panel"
              className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <pre data-slot="code-tabs-pre" className="p-4 pr-14 text-sm leading-relaxed">
                <code data-slot="code-tabs-code" className="block whitespace-pre font-mono">
                  {item.code}
                </code>
              </pre>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    );
  },
);
CodeTabs.displayName = "CodeTabs";
