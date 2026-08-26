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
          "--normal-bg": "var(--kronus-surface-floating)",
          "--normal-text": "var(--kronus-fg)",
          "--normal-border": "var(--kronus-border)",
          "--border-radius": "var(--kronus-radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};
Toaster.displayName = "Toaster";

export { toast };
