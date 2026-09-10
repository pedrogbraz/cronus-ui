import { CronusThemeScript, CronusUIProvider } from "@cronus-ui/theme";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import ClientBody from "./Clientbody";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <CronusThemeScript
          storageKey="theme"
          defaultThemeName="__THEME__"
          defaultModeName="__MODE__"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
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
