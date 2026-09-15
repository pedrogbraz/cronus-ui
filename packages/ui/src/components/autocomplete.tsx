"use client";

import { Command as CommandPrimitive } from "cmdk";
import {
  forwardRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { CommandEmpty, CommandItem, CommandList } from "./command.js";
import { Popover, PopoverAnchor, PopoverContent } from "./popover.js";
import { Skeleton } from "./skeleton.js";
import { Spinner } from "./spinner.js";

export interface AutocompleteOption {
  /** Stable, unique value used for selection and highlighting. */
  value: string;
  /** Human-readable text rendered in the list. Defaults to `value`. */
  label?: string;
  /** Disable selecting this single suggestion. */
  disabled?: boolean;
}

export interface AutocompleteProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "onSelect" | "role"
  > {
  /**
   * Static suggestions. When omitted, provide `onSearch` to fetch suggestions
   * for the current query asynchronously.
   */
  options?: AutocompleteOption[];
  /**
   * Async resolver invoked (debounced) with the current query. Return the
   * suggestions to render. Use together with `loading` for the busy state, or
   * let the component manage `loading` automatically when `options` is omitted.
   */
  onSearch?: (query: string) => Promise<AutocompleteOption[]>;
  /** Controlled free-text value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the new free-text value on every keystroke or selection. */
  onValueChange?: (value: string) => void;
  /** Called when a suggestion is committed (click / Enter on a highlight). */
  onSelect?: (option: AutocompleteOption) => void;
  /** Placeholder for the text input. */
  placeholder?: string;
  /** Message rendered when there are no suggestions for the query. */
  emptyText?: string;
  /**
   * Forces the busy state (spinner + skeletons). When `onSearch` is provided
   * and this is left undefined, the component tracks pending searches itself.
   */
  loading?: boolean;
  /** Debounce, in ms, before `onSearch` fires or local filtering re-runs. */
  debounceMs?: number;
  /**
   * When true (default), the committed value can be free text that is not in
   * the suggestion list. When false, blurring or Enter with non-matching text
   * reverts to the last valid value.
   */
  allowCustomValue?: boolean;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Extra classes for the popover content. */
  contentClassName?: string;
  /** Number of skeleton rows to show while loading. */
  loadingSkeletonRows?: number;
}

const SKELETON_WIDTHS = ["w-3/4", "w-1/2", "w-5/6", "w-2/3"] as const;

function optionLabel(option: AutocompleteOption): string {
  return option.label ?? option.value;
}

// cmdk indexes/filters/highlights by `value`; identical labels would collide, so
// we feed it a value that is unique per option while still surfacing the label
// (we own filtering via shouldFilter={false}, so the composite is never matched
// against the query). The trailing value keeps duplicates distinct.
function optionCmdkValue(option: AutocompleteOption): string {
  return `${optionLabel(option)} ${option.value}`;
}

function defaultLocalFilter(options: AutocompleteOption[], query: string): AutocompleteOption[] {
  if (query.trim() === "") return options;
  const needle = query.toLowerCase();
  return options.filter((option) => optionLabel(option).toLowerCase().includes(needle));
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options,
      onSearch,
      value: valueProp,
      defaultValue,
      onValueChange,
      onSelect,
      placeholder = "Type to search…",
      emptyText = "No results found.",
      loading: loadingProp,
      debounceMs = 200,
      allowCustomValue = true,
      disabled = false,
      className,
      contentClassName,
      loadingSkeletonRows = 3,
      onKeyDown,
      onBlur,
      onFocus,
      id: idProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...inputProps
    },
    forwardedRef,
  ) => {
    // --- Controlled / uncontrolled free-text value ---------------------------
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
    const value = isControlled ? valueProp : uncontrolledValue;

    const [open, setOpen] = useState(false);
    // Highlighted suggestion (drives cmdk + aria-activedescendant).
    const [highlighted, setHighlighted] = useState("");
    // Async results + internally tracked loading state.
    const [asyncOptions, setAsyncOptions] = useState<AutocompleteOption[]>([]);
    const [internalLoading, setInternalLoading] = useState(false);
    // Real ids read back from the cmdk DOM. cmdk overwrites any id we set on the
    // list/items with its own useId, so we must reference its generated ids to
    // keep aria-controls / aria-activedescendant pointing at nodes that exist.
    const [listboxId, setListboxId] = useState<string>();
    const [activeDescendant, setActiveDescendant] = useState<string>();

    const reactId = useId();
    const id = idProp ?? `${reactId}-autocomplete`;

    // Expose the underlying input while keeping a local handle for focus mgmt.
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement, []);
    // The cmdk root, used to forward navigation keys into its roving listbox.
    const commandRef = useRef<HTMLDivElement>(null);
    // Last value that matched a real suggestion, for allowCustomValue=false revert.
    // Seeded with the initial value; kept in sync below so a controlled value that
    // changes after the first render does not leave a stale revert target.
    const lastValidValue = useRef(value);
    // Guards a blur that is the result of clicking an option inside the popover.
    const selectingRef = useRef(false);

    const isAsync = onSearch !== undefined;
    const loading = loadingProp ?? (isAsync ? internalLoading : false);

    const setValue = useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    // --- Suggestion source ----------------------------------------------------
    // For static options we filter locally; for async we use resolver output.
    const localOptions = useMemo(
      () => (isAsync ? asyncOptions : defaultLocalFilter(options ?? [], value)),
      [isAsync, asyncOptions, options, value],
    );

    // Debounced async search. Stale responses are dropped via a request token.
    const requestToken = useRef(0);
    useEffect(() => {
      if (!isAsync || !open) {
        // Closing (or leaving async mode) invalidates any in-flight request so a
        // late-resolving promise cannot write stale results, and drops the old
        // suggestions/loading so reopening never flashes a previous query.
        requestToken.current++;
        setAsyncOptions([]);
        setInternalLoading(false);
        return;
      }
      const token = ++requestToken.current;
      setInternalLoading(true);
      const handle = setTimeout(() => {
        onSearch(value)
          .then((result) => {
            if (token !== requestToken.current) return;
            setAsyncOptions(result);
          })
          .catch(() => {
            if (token !== requestToken.current) return;
            setAsyncOptions([]);
          })
          .finally(() => {
            if (token !== requestToken.current) return;
            setInternalLoading(false);
          });
      }, debounceMs);
      return () => clearTimeout(handle);
    }, [isAsync, open, value, debounceMs, onSearch]);

    // Track the latest value that maps to a concrete suggestion.
    useEffect(() => {
      if (localOptions.some((option) => optionLabel(option) === value)) {
        lastValidValue.current = value;
      }
    }, [localOptions, value]);

    const commitSelection = useCallback(
      (option: AutocompleteOption) => {
        if (option.disabled) return;
        const label = optionLabel(option);
        setValue(label);
        lastValidValue.current = label;
        onSelect?.(option);
        setOpen(false);
        setHighlighted("");
        // Return focus to the text input after committing.
        requestAnimationFrame(() => inputRef.current?.focus());
      },
      [setValue, onSelect],
    );

    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setValue(next);
        // Reopen on type-ahead; close only when the field is fully cleared.
        setOpen(next.length > 0);
      },
      [setValue],
    );

    // Forward navigation keys to cmdk so it manages roving focus + highlight.
    const forwardToCommand = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
      const node = commandRef.current;
      if (!node) return;
      node.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: event.key,
          code: event.code,
          bubbles: true,
          cancelable: true,
        }),
      );
    }, []);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || disabled) return;

        switch (event.key) {
          case "ArrowDown":
          case "ArrowUp": {
            event.preventDefault();
            if (!open) {
              setOpen(true);
              return;
            }
            forwardToCommand(event);
            return;
          }
          case "Home":
          case "End": {
            if (!open) return;
            event.preventDefault();
            forwardToCommand(event);
            return;
          }
          case "Enter": {
            if (!open) return;
            const active = localOptions.find((option) => optionCmdkValue(option) === highlighted);
            if (active && !active.disabled) {
              event.preventDefault();
              commitSelection(active);
            } else if (!allowCustomValue) {
              event.preventDefault();
              setValue(lastValidValue.current);
              setOpen(false);
            } else {
              // Free text: accept current input and dismiss suggestions.
              setOpen(false);
            }
            return;
          }
          case "Escape": {
            if (open) {
              event.preventDefault();
              setOpen(false);
              setHighlighted("");
            }
            return;
          }
          default:
            return;
        }
      },
      [
        onKeyDown,
        disabled,
        open,
        localOptions,
        highlighted,
        allowCustomValue,
        commitSelection,
        forwardToCommand,
        setValue,
      ],
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);
        // Ignore blur caused by interacting with the suggestion list.
        if (selectingRef.current) {
          selectingRef.current = false;
          return;
        }
        setOpen(false);
        setHighlighted("");
        if (!allowCustomValue && !localOptions.some((o) => optionLabel(o) === value)) {
          setValue(lastValidValue.current);
        }
      },
      [onBlur, allowCustomValue, localOptions, value, setValue],
    );

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
        if (value.length > 0) setOpen(true);
      },
      [onFocus, value],
    );

    // Resolve the real cmdk-generated ids from the DOM after each render that can
    // change the list or the highlight. cmdk marks the active item with
    // aria-selected="true" and assigns its own ids, so reading them here keeps
    // aria-controls / aria-activedescendant referencing nodes that truly exist.
    useEffect(() => {
      if (!open) {
        setListboxId(undefined);
        setActiveDescendant(undefined);
        return;
      }
      const root = commandRef.current;
      const list = root?.querySelector<HTMLElement>("[cmdk-list]");
      setListboxId(list?.id || undefined);
      // While loading we render skeletons (no items) and an empty list has nothing
      // highlightable. `highlighted` is cmdk's roving value — re-resolve whenever
      // it or the rendered list changes so the id reflects the node cmdk marks.
      const active =
        loading || !highlighted || localOptions.length === 0
          ? null
          : root?.querySelector<HTMLElement>('[cmdk-item][aria-selected="true"]');
      setActiveDescendant(active?.id || undefined);
    }, [open, highlighted, localOptions, loading]);

    const showEmpty = !loading && localOptions.length === 0;

    return (
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div data-slot="autocomplete" className="relative w-full">
            <input
              ref={inputRef}
              id={id}
              type="text"
              role="combobox"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-autocomplete="list"
              aria-expanded={open && !disabled}
              aria-controls={open ? listboxId : undefined}
              aria-activedescendant={activeDescendant}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              data-slot="autocomplete-input"
              disabled={disabled}
              placeholder={placeholder}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={cn(
                "flex h-10 w-full rounded-lg border border-border bg-surface-inset px-3 text-sm text-fg",
                "placeholder:text-fg-tertiary",
                "transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)]",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
                "disabled:opacity-50 disabled:pointer-events-none",
                "selection:bg-primary selection:text-primary-foreground",
                // Reserve room for the trailing spinner while loading.
                loading && "pe-9",
                className,
              )}
              {...inputProps}
            />
            {loading ? (
              <span
                data-slot="autocomplete-spinner"
                className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-fg-tertiary"
              >
                <Spinner size="sm" aria-label="Loading suggestions" />
              </span>
            ) : null}
          </div>
        </PopoverAnchor>

        <PopoverContent
          align="start"
          data-slot="autocomplete-content"
          // Keep focus on the text input so type-ahead never breaks.
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          // A pointerdown inside the list must not blur-commit before onSelect.
          onPointerDownOutside={(event) => {
            if (inputRef.current?.contains(event.target as Node)) event.preventDefault();
          }}
          className={cn(
            "w-[var(--radix-popover-trigger-width)] min-w-[8rem] p-0",
            contentClassName,
          )}
        >
          <CommandPrimitive
            ref={commandRef}
            // We own filtering (local includes-match or async results).
            shouldFilter={false}
            // cmdk owns roving highlight; mirror it for aria-activedescendant.
            value={highlighted}
            onValueChange={setHighlighted}
            data-slot="autocomplete-command"
            className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-surface-floating text-fg"
          >
            <CommandList
              // cmdk sets role="listbox" and its own id; the accessible name must
              // go through its `label` prop (it overrides any aria-label we pass).
              label={ariaLabel ?? "Suggestions"}
              // Block the blur-revert when a pointer lands on the list.
              onMouseDown={(event) => {
                selectingRef.current = true;
                event.preventDefault();
              }}
            >
              {loading ? (
                <div
                  data-slot="autocomplete-loading"
                  className="space-y-1.5 p-2"
                  aria-hidden="true"
                >
                  {Array.from({ length: Math.max(1, loadingSkeletonRows) }).map((_, index) => (
                    <Skeleton
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder rows
                      key={index}
                      className={cn("h-7", SKELETON_WIDTHS[index % SKELETON_WIDTHS.length])}
                    />
                  ))}
                </div>
              ) : null}

              {showEmpty ? <CommandEmpty>{emptyText}</CommandEmpty> : null}

              {!loading
                ? localOptions.map((option) => {
                    const label = optionLabel(option);
                    return (
                      <CommandItem
                        key={option.value}
                        // cmdk overwrites any id we set with its own; we read the
                        // generated id back from the DOM for aria-activedescendant.
                        // Use a value unique per option so duplicate labels do not
                        // collide in cmdk's index/highlight.
                        value={optionCmdkValue(option)}
                        disabled={option.disabled}
                        onSelect={() => commitSelection(option)}
                      >
                        <span className="truncate">{label}</span>
                      </CommandItem>
                    );
                  })
                : null}
            </CommandList>
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
    );
  },
);
Autocomplete.displayName = "Autocomplete";
