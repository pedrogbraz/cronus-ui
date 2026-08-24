"use client";

import { X } from "lucide-react";
import {
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";

export interface TagsInputProps {
  /** Controlled list of committed tags. Pair with `onValueChange`. */
  value?: string[];
  /** Initial tags for uncontrolled usage. */
  defaultValue?: string[];
  /** Called with the next list of tags whenever a tag is added or removed. */
  onValueChange?: (tags: string[]) => void;
  /** Placeholder shown in the text field when it is empty. */
  placeholder?: string;
  /** Maximum number of tags. Once reached, further additions are ignored. */
  max?: number;
  /** Disables typing and tag removal. */
  disabled?: boolean;
  /** When true, the same tag may be added more than once. Defaults to false. */
  allowDuplicates?: boolean;
  /**
   * Characters that commit the current input as a tag, in addition to Enter.
   * Defaults to a comma, so both Enter and "," commit.
   */
  delimiter?: string | string[];
  /** Reject a tag when this returns false. Receives the trimmed candidate. */
  validate?: (tag: string) => boolean;
  /** Marks the field as invalid, applying error styling. */
  "aria-invalid"?: boolean | "true" | "false";
  /** Native id for the text input (for an external `<label htmlFor>`). */
  id?: string;
  /** Accessible name for the text input when there is no visible label. */
  "aria-label"?: string;
  /** id of an element that labels the text input. */
  "aria-labelledby"?: string;
  /** Native name for the text input. */
  name?: string;
  /** Extra classes for the field wrapper. */
  className?: string;
  /** Extra classes for the inner text input. */
  inputClassName?: string;
}

const DEFAULT_DELIMITERS = [","];

export const TagsInput = forwardRef<HTMLInputElement, TagsInputProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      placeholder,
      max,
      disabled = false,
      allowDuplicates = false,
      delimiter = DEFAULT_DELIMITERS,
      validate,
      "aria-invalid": ariaInvalid,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      name,
      className,
      inputClassName,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    // Expose the inner input as the forwarded ref so consumers can focus it.
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    const [draft, setDraft] = useState("");

    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
    const tags = isControlled ? valueProp : internalValue;

    const delimiters = Array.isArray(delimiter) ? delimiter : [delimiter];

    const setTags = useCallback(
      (next: string[]) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const addTag = useCallback(
      (raw: string) => {
        const tag = raw.trim();
        if (tag === "") return false;
        if (max !== undefined && tags.length >= max) return false;
        if (!allowDuplicates && tags.includes(tag)) return false;
        if (validate && !validate(tag)) return false;
        setTags([...tags, tag]);
        return true;
      },
      [tags, max, allowDuplicates, validate, setTags],
    );

    const removeTag = useCallback(
      (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
      },
      [tags, setTags],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (event.key === "Enter") {
          // Don't submit a surrounding form when committing a tag.
          event.preventDefault();
          if (addTag(draft)) setDraft("");
          return;
        }
        if (delimiters.includes(event.key)) {
          event.preventDefault();
          if (addTag(draft)) setDraft("");
          return;
        }
        if (event.key === "Backspace" && draft === "" && tags.length > 0) {
          // Empty field: backspace edits the committed tags, not the text.
          event.preventDefault();
          removeTag(tags.length - 1);
        }
      },
      [disabled, draft, delimiters, tags.length, addTag, removeTag],
    );

    const handleBlur = useCallback(() => {
      // Commit any pending text on blur so a typed-but-not-entered tag isn't lost.
      if (disabled) return;
      if (addTag(draft)) setDraft("");
    }, [disabled, draft, addTag]);

    const handleFieldMouseDown = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        // Clicking anywhere in the field (the padding, between chips) focuses the
        // input — but let clicks land on the remove buttons themselves.
        if (event.target === inputRef.current) return;
        if ((event.target as HTMLElement).closest("[data-slot='tags-input-remove']")) return;
        event.preventDefault();
        inputRef.current?.focus();
      },
      [disabled],
    );

    const atMax = max !== undefined && tags.length >= max;

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: clicking the field forwards focus to the input; the input and remove buttons remain the real keyboard targets.
      <div
        data-slot="tags-input"
        data-disabled={disabled ? "" : undefined}
        aria-invalid={ariaInvalid}
        onMouseDown={handleFieldMouseDown}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface-inset px-3 py-1.5 text-sm text-fg",
          "transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)]",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-surface-base",
          "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
          "aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/30",
          className,
        )}
      >
        {tags.map((tag, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: tags can repeat when allowDuplicates is on, so the index disambiguates an otherwise non-unique value.
          <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1 pr-1">
            <span className="truncate">{tag}</span>
            {disabled ? null : (
              <button
                type="button"
                tabIndex={-1}
                aria-label={`Remove ${tag}`}
                data-slot="tags-input-remove"
                className="flex size-3.5 items-center justify-center rounded-sm text-fg-tertiary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                onClick={() => removeTag(index)}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            )}
          </Badge>
        ))}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          autoComplete="off"
          disabled={disabled}
          // Once `max` is reached, keep the field present but read-only so focus
          // and chip removal still work; clearing a tag re-enables typing.
          readOnly={atMax}
          aria-invalid={ariaInvalid}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          placeholder={tags.length === 0 ? placeholder : undefined}
          value={draft}
          data-slot="tags-input-field"
          className={cn(
            "min-w-[6rem] flex-1 bg-transparent text-sm text-fg outline-none",
            "placeholder:text-fg-tertiary",
            "selection:bg-primary selection:text-primary-foreground",
            "disabled:pointer-events-none",
            inputClassName,
          )}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </div>
    );
  },
);
TagsInput.displayName = "TagsInput";
