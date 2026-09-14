"use client";

import { type Mode, modes, type ThemeName, themeNames } from "@cronus-ui/tokens";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AuditToolbar({
  fixtures,
  fixtureId,
  preset,
  mode,
  dir,
}: {
  fixtures: { id: string }[];
  fixtureId: string;
  preset: ThemeName;
  mode: Mode;
  dir: "ltr" | "rtl";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 text-sm">
      <label className="flex items-center gap-2 text-fg-secondary">
        Fixture
        <select
          className="rounded-lg border border-border bg-surface-inset px-2 py-1 text-fg"
          value={fixtureId}
          onChange={(e) => setParam("fixture", e.target.value)}
        >
          {fixtures.map((f) => (
            <option key={f.id} value={f.id}>
              {f.id}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-fg-secondary">
        Preset
        <select
          className="rounded-lg border border-border bg-surface-inset px-2 py-1 text-fg"
          value={preset}
          onChange={(e) => setParam("preset", e.target.value)}
        >
          {themeNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-fg-secondary">
        Mode
        <select
          className="rounded-lg border border-border bg-surface-inset px-2 py-1 text-fg"
          value={mode}
          onChange={(e) => setParam("mode", e.target.value)}
        >
          {modes.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-fg-secondary">
        Dir
        <select
          className="rounded-lg border border-border bg-surface-inset px-2 py-1 text-fg"
          value={dir}
          onChange={(e) => setParam("dir", e.target.value)}
        >
          <option value="ltr">ltr</option>
          <option value="rtl">rtl</option>
        </select>
      </label>
    </div>
  );
}
