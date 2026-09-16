import { type ParityFixture, renderReactFixture } from "@cronus-ui/audit";
import type { Mode, ThemeName } from "@cronus-ui/tokens";
import { AuditReactCanvas } from "./audit-canvas";
import { AuditToolbar } from "./audit-toolbar";
import { CronusPane } from "./cronus-pane";

export function AuditSplit({
  slug,
  fixtures,
  fixture,
  preset,
  mode,
  dir,
  kernelSrc,
}: {
  slug: string;
  fixtures: ParityFixture[];
  fixture: ParityFixture;
  preset: ThemeName;
  mode: Mode;
  dir: "ltr" | "rtl";
  kernelSrc: string | null;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-base text-fg">
      <header className="border-b border-border px-4 py-3">
        <p className="text-xs uppercase tracking-[0.14em] text-fg-tertiary">Cronus Audit</p>
        <h1 className="text-xl text-fg">{slug}</h1>
      </header>
      <AuditToolbar
        fixtures={fixtures}
        fixtureId={fixture.id}
        preset={preset}
        mode={mode}
        dir={dir}
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
        <section
          data-audit-side="react"
          className="overflow-auto border-b border-border md:border-b-0 md:border-e"
        >
          <h2 className="border-b border-border px-4 py-2 text-sm text-fg-secondary">React</h2>
          <div className="p-6">
            <AuditReactCanvas preset={preset} mode={mode} dir={dir}>
              {renderReactFixture(fixture)}
            </AuditReactCanvas>
          </div>
        </section>
        <section data-audit-side="cronus" className="overflow-auto">
          <h2 className="border-b border-border px-4 py-2 text-sm text-fg-secondary">Cronus</h2>
          {kernelSrc ? (
            <CronusPane src={kernelSrc} />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center p-6 text-sm text-fg-secondary">
              Cronus origin is not allowlisted. Set CRONUS_AUDIT_ORIGIN to http://127.0.0.1:5176
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
