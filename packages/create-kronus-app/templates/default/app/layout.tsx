import { KronusThemeScript, KronusUIProvider } from "@kronus-ui/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "__APP_NAME__",
  description: "A Next.js app built with Kronus UI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      // KronusThemeScript mutates <html> (theme/mode/dark class) before hydration
      // to prevent a flash of the wrong theme, so React must not warn about the
      // resulting attribute mismatch.
      suppressHydrationWarning
    >
      <head>
        <KronusThemeScript
          storageKey="theme"
          defaultThemeName="__THEME__"
          defaultModeName="__MODE__"
        />
      </head>
      <body>
        <KronusUIProvider
          asRoot
          defaultThemeName="__THEME__"
          defaultModeName="__MODE__"
          storageKey="theme"
        >
          {children}
        </KronusUIProvider>
      </body>
    </html>
  );
}
