"use client";

import { ModeToggle } from "@cronus-ui/ui/mode-toggle";

export function ModeToggleFixture({
  mode,
  "aria-label": ariaLabel,
}: {
  mode?: string;
  "aria-label"?: string;
}) {
  return (
    <ModeToggle
      mode={mode === "dark" ? "dark" : "light"}
      onModeChange={() => {}}
      aria-label={ariaLabel}
    />
  );
}
