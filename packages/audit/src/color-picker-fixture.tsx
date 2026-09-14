"use client";

import { ColorPicker } from "@cronus-ui/ui/color-picker";
import { useEffect, useRef } from "react";

/** ColorPicker does not expose `open`; click the trigger once after mount. */
export function ColorPickerFixture({
  defaultValue,
  "aria-label": ariaLabel,
}: {
  defaultValue?: string;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    ref.current?.click();
  }, []);

  return <ColorPicker ref={ref} defaultValue={defaultValue} aria-label={ariaLabel} />;
}
