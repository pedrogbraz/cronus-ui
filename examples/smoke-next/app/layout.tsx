import { KronusUIProvider } from "@kronus-ui/theme";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Kronus UI — Next.js smoke",
  description: "External-consumer smoke fixture for @kronus-ui/ui.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <KronusUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
          {children}
        </KronusUIProvider>
      </body>
    </html>
  );
}
