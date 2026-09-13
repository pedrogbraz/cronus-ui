"use client";

import { Autocomplete } from "@cronus-ui/ui/autocomplete";
import { useEffect, useRef } from "react";

/** Autocomplete has no `open` / `defaultOpen`; focus a non-empty value to open. */
export function AutocompleteFixture({
  options,
  placeholder,
  defaultValue,
  "aria-label": ariaLabel,
}: {
  options: string[];
  placeholder?: string;
  defaultValue?: string;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const opened = useRef(false);
  const entries = options.map((item) => ({ label: item, value: item }));

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    ref.current?.focus();
  }, []);

  return (
    <Autocomplete
      ref={ref}
      options={entries}
      placeholder={placeholder}
      defaultValue={defaultValue}
      aria-label={ariaLabel}
    />
  );
}
