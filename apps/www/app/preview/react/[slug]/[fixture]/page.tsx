import { getFixture, type ParityFixture, renderReactFixture } from "@cronus-ui/audit";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditReactCanvas } from "../../../../../components/audit/audit-canvas";
import { parseDir, parseMode, parsePreset } from "../../../../../lib/audit-query";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ReactPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; fixture: string }>;
  searchParams: Promise<{ preset?: string; mode?: string; dir?: string }>;
}) {
  const { slug, fixture: id } = await params;
  const query = await searchParams;
  let fixture: ParityFixture;
  try {
    fixture = getFixture(slug, id);
  } catch {
    notFound();
  }
  const preset = parsePreset(query.preset);
  const mode = parseMode(query.mode);
  const dir = parseDir(query.dir);
  return (
    <div className="min-h-screen bg-surface-base p-6">
      <AuditReactCanvas preset={preset} mode={mode} dir={dir}>
        {renderReactFixture(fixture)}
      </AuditReactCanvas>
    </div>
  );
}
