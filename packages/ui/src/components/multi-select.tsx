"use client";

import { Check, ChevronDown, X } from "lucide-react";
import {
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./command.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

export interface MultiSelectOption {
  /** Stable value persisted in the selection array. */
  value: string;
  /** Human-readable label rendered in the list and chips. */
  label: string;
  /** Disable selecting/deselecting this single option. */
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** Options shown in the searchable list. */
  options: MultiSelectOption[];
  /** Controlled selection. Provide together with `onValueChange`. */
  value?: string[];
  /** Uncontrolled initial selection. */
  defaultValue?: string[];
  /** Called with the next selection whenever it changes. */
  onValueChange?: (value: string[]) => void;
  /** Text shown in the trigger when nothing is selected. */
  placeholder?: string;
  /** Placeholder for the search input inside the popover. */
  searchPlaceholder?: string;
  /** Text shown when the search yields no results. */
  emptyText?: string;
  /**
   * Maximum number of chips to render before collapsing the rest into a
   * "+N" badge. When omitted, every selected chip is rendered.
   */
  maxDisplay?: number;
  /** Disable the whole control. */
  disabled?: boolean;
  /**
   * When true (default), pressing Backspace with an empty search removes the
   * last selected item.
   */
  removeLastOnBackspace?: boolean;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Extra classes for the popover content. */
  contentClassName?: string;
  /** Accessible label for the trigger when no visible label is associated. */
  "aria-label"?: string;
  /** id of an element that labels the trigger. */
  "aria-labelledby"?: string;
  /** Marks the trigger as invalid (e.g. from a Form layer), applying error styling. */
  "aria-invalid"?: boolean | "true" | "false";
  /** Controls the popover open state (controlled). */
  open?: boolean;
  /** Initial popover open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the popover open state changes. */
  onOpenChange?: (open: boolean) => void;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Select…",
      searchPlaceholder = "Search…",
      emptyText = "No results found.",
      maxDisplay,
      disabled = false,
      removeLastOnBackspace = true,
      className,
      contentClassName,
      open,
      defaultOpen,
      onOpenChange,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-invalid": ariaInvalid,
    },
    ref,
  ) => {
    const [search, setSearch] = useState("");

    // --- Uncontrolled / controlled selection ---------------------------------
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
    const selected = isControlled ? value : internalValue;

    // --- Uncontrolled / controlled open state --------------------------------
    const isOpenControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen ?? false);
    const isOpen = isOpenControlled ? open : internalOpen;

    const setSelected = useCallback(
      (next: string[]) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isOpenControlled) setInternalOpen(next);
        onOpenChange?.(next);
        if (!next) setSearch("");
      },
      [isOpenControlled, onOpenChange],
    );

    const toggle = useCallback(
      (optionValue: string) => {
        const next = selected.includes(optionValue)
          ? selected.filter((v) => v !== optionValue)
          : [...selected, optionValue];
        setSelected(next);
      },
      [selected, setSelected],
    );

    const remove = useCallback(
      (optionValue: string) => {
        setSelected(selected.filter((v) => v !== optionValue));
      },
      [selected, setSelected],
    );

    const clearAll = useCallback(() => {
      setSelected([]);
    }, [setSelected]);

    const hasSelection = selected.length > 0;

    // Chips are ordered to match the option list ordering for stability.
    const selectedOptions = useMemo(
      () => options.filter((option) => selected.includes(option.value)),
      [options, selected],
    );
    const visibleOptions =
      maxDisplay != null ? selectedOptions.slice(0, maxDisplay) : selectedOptions;
    const overflowCount = selectedOptions.length - visibleOptions.length;

    const handleSearchKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (
          removeLastOnBackspace &&
          event.key === "Backspace" &&
          event.currentTarget.value === "" &&
          selected.length > 0
        ) {
          event.preventDefault();
          remove(selected[selected.length - 1] as string);
        }
      },
      [removeLastOnBackspace, selected, remove],
    );

    const handleTriggerKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        // Activation keys open the listbox (a div trigger is not natively
        // activatable, so we wire it up to behave like a combobox button).
        if (!isOpen && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          setOpen(true);
          return;
        }
        // Backspace on the trigger removes the last chip, mirroring the search
        // input behaviour for fast keyboard editing.
        if (removeLastOnBackspace && event.key === "Backspace" && !isOpen && selected.length > 0) {
          event.preventDefault();
          remove(selected[selected.length - 1] as string);
        }
      },
      [disabled, isOpen, setOpen, removeLastOnBackspace, selected, remove],
    );

    return (
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            role="combobox"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            // No aria-controls: cmdk overwrites the id we set on CommandList with
            // its own generated id, so any id we reference here would be dangling.
            // aria-haspopup + aria-expanded already convey the popup relationship.
            aria-disabled={disabled || undefined}
            aria-invalid={ariaInvalid}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            data-slot="multi-select-trigger"
            data-disabled={disabled || undefined}
            data-placeholder={hasSelection ? undefined : ""}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              "flex min-h-10 w-full cursor-default items-center justify-between gap-2 rounded-lg border border-border bg-surface-inset px-3 py-1.5 text-sm text-fg outline-none transition-[border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[state=open]:border-border-strong aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/30",
              className,
            )}
          >
            <span className="flex flex-1 flex-wrap items-center gap-1.5 overflow-hidden">
              {hasSelection ? (
                <>
                  {visibleOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      disabled={disabled || option.disabled}
                      onRemove={() => remove(option.value)}
                    />
                  ))}
                  {overflowCount > 0 ? (
                    <Badge variant="secondary" aria-hidden="true">
                      +{overflowCount}
                    </Badge>
                  ) : null}
                </>
              ) : (
                <span className="text-fg-muted">{placeholder}</span>
              )}
            </span>

            <span className="flex shrink-0 items-center gap-1">
              {hasSelection && !disabled ? (
                <button
                  type="button"
                  aria-label="Clear all"
                  data-slot="multi-select-clear"
                  className="flex size-5 items-center justify-center rounded-sm text-fg-tertiary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  onPointerDown={(event) => {
                    // Prevent the popover trigger from toggling on click.
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    clearAll();
                  }}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              ) : null}
              <ChevronDown className="size-4 shrink-0 opacity-60" aria-hidden="true" />
            </span>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className={cn("w-[var(--radix-popover-trigger-width)] p-0", contentClassName)}
          // Keep focus management on the search input rather than the trigger.
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
              onKeyDown={handleSearchKeyDown}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    // cmdk indexes/highlights by `value`; duplicate labels would
                    // collide, so include the stable value to keep it unique while
                    // still matching the visible label for text search.
                    key={option.value}
                    value={`${option.label} ${option.value}`}
                    disabled={option.disabled}
                    onSelect={() => toggle(option.value)}
                  >
                    <span
                      data-slot="multi-select-indicator"
                      data-state={isSelected ? "checked" : "unchecked"}
                      aria-hidden="true"
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-sm border border-border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-surface-inset",
                      )}
                    >
                      {isSelected ? <Check className="size-3" /> : null}
                    </span>
                    <span className="flex-1 truncate">{option.label}</span>
                    {/* cmdk overwrites aria-selected to mean "highlighted" and the
                        check indicator is aria-hidden, so expose the checked state
                        to assistive tech with a visually-hidden announcement. */}
                    {isSelected ? <span className="sr-only">, selected</span> : null}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
MultiSelect.displayName = "MultiSelect";

interface ChipProps {
  label: ReactNode;
  disabled?: boolean;
  onRemove: () => void;
}

function Chip({ label, disabled, onRemove }: ChipProps) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      <span className="truncate">{label}</span>
      {disabled ? null : (
        <button
          type="button"
          aria-label={`Remove ${typeof label === "string" ? label : "item"}`}
          data-slot="multi-select-chip-remove"
          className="flex size-3.5 items-center justify-center rounded-sm text-fg-tertiary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          onPointerDown={(event) => {
            // Stop the trigger from opening the popover.
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
    </Badge>
  );
}
