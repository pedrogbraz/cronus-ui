"use client";

import { Toaster as Sonner, toast } from "sonner";

export interface ToasterProps extends React.ComponentProps<typeof Sonner> {}

export const Toaster = ({ theme = "dark", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
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
  );
};
Toaster.displayName = "Toaster";

export { toast };
