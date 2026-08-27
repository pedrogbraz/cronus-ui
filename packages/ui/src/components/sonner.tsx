"use client";

import { useOptionalThemeMode } from "@cronus-ui/theme";
import { Toaster as Sonner, toast } from "sonner";

export interface ToasterProps extends React.ComponentProps<typeof Sonner> {}

export const Toaster = ({ theme, ...props }: ToasterProps) => {
  const mode = useOptionalThemeMode();
  const resolved = theme ?? (mode === "light" ? "light" : "dark");

  return (
    <div data-slot="toaster">
      <Sonner
        theme={resolved}
        className="toaster group"
        style={
          {
            "--normal-bg": "var(--cronus-surface-floating)",
            "--normal-text": "var(--cronus-fg)",
            "--normal-border": "var(--cronus-border)",
            "--border-radius": "var(--cronus-radius)",
          } as React.CSSProperties
        }
        {...props}
      />
    </div>
  );
};
Toaster.displayName = "Toaster";

export { toast };
