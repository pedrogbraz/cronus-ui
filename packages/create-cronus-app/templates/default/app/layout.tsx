import { CronusThemeScript, CronusUIProvider } from "@cronus-ui/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "__APP_NAME__",
  description: "A Next.js app built with Cronus UI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      // CronusThemeScript mutates <html> (theme/mode/dark class) before hydration
      // to prevent a flash of the wrong theme, so React must not warn about the
      // resulting attribute mismatch.
      suppressHydrationWarning
    >
      <head>
        <CronusThemeScript
          storageKey="theme"
          defaultThemeName="__THEME__"
          defaultModeName="__MODE__"
        />
      </head>
      <body>
        <CronusUIProvider
          asRoot
          defaultThemeName="__THEME__"
          defaultModeName="__MODE__"
          storageKey="theme"
        >
          {children}
        </CronusUIProvider>
      </body>
    </html>
  );
}
