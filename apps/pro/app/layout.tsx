import { CronusThemeScript, CronusUIProvider } from "@cronus-ui/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ChromeThemeLock } from "../components/chrome-theme-lock";
import { ProFooter } from "../components/pro-footer";
import { ProHeader } from "../components/pro-header";
import { PRO_URL } from "../lib/origins";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(PRO_URL),
  title: "Cronus Pro — Mail, chat, and finance",
  description:
    "Additive pack on the Cronus product UI system. OSS stays complete. Pro adds mail, chat, and finance — one-time, perpetual, not billed yet.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-cronus-theme="neutral"
      data-cronus-mode="dark"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <CronusThemeScript
          storageKey="cronus-pro-theme-v2"
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
        <CronusUIProvider
          asRoot
          defaultThemeName="neutral"
          defaultModeName="dark"
          storageKey="cronus-pro-theme-v2"
        >
          <ChromeThemeLock />
          <div className="min-h-screen bg-surface-base text-fg">
            <ProHeader />
            {children}
            <ProFooter />
          </div>
        </CronusUIProvider>
      </body>
    </html>
  );
}
