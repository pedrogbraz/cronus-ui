import { KronusThemeScript, KronusUIProvider } from "@kronus-ui/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "../lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  // Absolute base for og:image / twitter:image URLs (Next falls back to
  // localhost in production output without it).
  metadataBase: new URL(SITE_URL),
  title: "Kronus UI — Product UI system",
  description:
    "A product UI system: accessible, themeable React components, a shadcn-compatible registry, and a generator that composes a SaaS from validated blocks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-kronus-theme="neutral"
      data-kronus-mode="dark"
      data-force-motion
      className="dark"
      // The KronusThemeScript below mutates <html> (theme/mode/dark class) before
      // hydration, so React must not warn about the resulting attribute mismatch.
      suppressHydrationWarning
    >
      <head>
        <KronusThemeScript
          storageKey="kronus-ui-theme-v2"
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
        <KronusUIProvider
          asRoot
          defaultThemeName="neutral"
          defaultModeName="dark"
          storageKey="kronus-ui-theme-v2"
        >
          {children}
        </KronusUIProvider>
      </body>
    </html>
  );
}
