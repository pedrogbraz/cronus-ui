import { CronusThemeScript, CronusUIProvider } from "@cronus-ui/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DATA } from "@/data/resume";
import ClientBody from "./Clientbody";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: { default: DATA.name, template: `%s | ${DATA.name}` },
  description: DATA.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <CronusThemeScript
          storageKey="theme"
          defaultThemeName="__THEME__"
          defaultModeName="__MODE__"
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <CronusUIProvider
          asRoot
          defaultThemeName="__THEME__"
          defaultModeName="__MODE__"
          storageKey="theme"
        >
          <ClientBody>{children}</ClientBody>
        </CronusUIProvider>
      </body>
    </html>
  );
}
