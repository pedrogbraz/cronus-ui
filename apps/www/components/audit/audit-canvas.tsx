import { CronusUIProvider } from "@cronus-ui/theme";
import type { Mode, ThemeName } from "@cronus-ui/tokens";
import type { ReactNode } from "react";

const CANVAS_STYLE = {
  width: 480,
  minHeight: 240,
  padding: 24,
  boxSizing: "border-box" as const,
};

export function AuditReactCanvas({
  preset,
  mode,
  dir,
  children,
}: {
  preset: ThemeName;
  mode: Mode;
  dir: "ltr" | "rtl";
  children: ReactNode;
}) {
  return (
    <CronusUIProvider asRoot={false} defaultThemeName={preset} defaultModeName={mode}>
      <div
        data-audit-canvas=""
        data-cronus-theme={preset}
        data-cronus-mode={mode}
        dir={dir}
        className="bg-surface-base text-fg"
        style={CANVAS_STYLE}
      >
        {children}
      </div>
    </CronusUIProvider>
  );
}
