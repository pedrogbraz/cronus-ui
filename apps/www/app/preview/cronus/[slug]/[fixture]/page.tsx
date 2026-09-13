import { kernelAuditUrl, parseAuditOrigin } from "@cronus-ui/audit";
import type { Metadata } from "next";
import { parseDir, parseMode, parsePreset } from "../../../../../lib/audit-query";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CronusPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; fixture: string }>;
  searchParams: Promise<{ preset?: string; mode?: string; dir?: string }>;
}) {
  const { slug, fixture } = await params;
  const query = await searchParams;
  const origin = parseAuditOrigin(process.env.CRONUS_AUDIT_ORIGIN);
  if (!origin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-base p-6 text-sm text-fg-secondary">
        Cronus origin is not allowlisted.
      </div>
    );
  }
  const src = kernelAuditUrl(origin, slug, fixture, {
    preset: parsePreset(query.preset),
    mode: parseMode(query.mode),
    dir: parseDir(query.dir),
  });
  return (
    <iframe
      title="Cronus audit"
      sandbox="allow-scripts"
      src={src}
      className="h-screen w-full border-0 bg-surface-base"
    />
  );
}
