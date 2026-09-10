// @ts-nocheck
"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useThemeTransition } from "../hooks/use-themetransition";
import { useTemplateMode } from "../lib/use-template-mode";
import { cn } from "../lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const { isDark } = useTemplateMode();
  const toggleTheme = useThemeTransition();

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e.clientX, e.clientY)}
      className={cn(
        "relative flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      <SunIcon
        className={cn(
          "absolute size-3.5 transition-all",
          isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100",
        )}
      />
      <MoonIcon
        className={cn(
          "absolute size-3.5 transition-all",
          isDark ? "rotate-0 scale-100" : "rotate-90 scale-0",
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
