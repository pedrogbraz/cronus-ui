import { CooudThemeScript, CooudUIProvider } from "@cooud-ui/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "../lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  // Absolute base for og:image / twitter:image URLs (Next falls back to
  // localhost in production output without it).
  metadataBase: new URL(SITE_URL),
  title: "Cooud UI — Design System",
  description: "The Cooud design system: themeable, accessible React components. Aurora + Neutral.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-cooud-theme="neutral"
      data-cooud-mode="dark"
      data-force-motion
      className="dark"
      // The CooudThemeScript below mutates <html> (theme/mode/dark class) before
      // hydration, so React must not warn about the resulting attribute mismatch.
      suppressHydrationWarning
    >
      <head>
        <CooudThemeScript
          storageKey="cooud-ui-theme-v2"
          defaultThemeName="neutral"
          defaultModeName="dark"
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-lg border border-border bg-surface-floating px-4 py-2 text-sm font-medium text-fg shadow-lg outline-none focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
        >
          Skip to content
        </a>
        <CooudUIProvider
          asRoot
          defaultThemeName="neutral"
          defaultModeName="dark"
          storageKey="cooud-ui-theme-v2"
        >
          {children}
        </CooudUIProvider>
      </body>
    </html>
  );
}
