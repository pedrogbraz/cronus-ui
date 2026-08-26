import { CronusUIProvider } from "@cronus-ui/theme";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Cronus UI — Next.js smoke",
  description: "External-consumer smoke fixture for @cronus-ui/ui.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CronusUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
          {children}
        </CronusUIProvider>
      </body>
    </html>
  );
}
