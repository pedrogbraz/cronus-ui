import { fixturesForFamily, kernelAuditUrl, parseAuditOrigin } from "@cronus-ui/audit";
import { notFound } from "next/navigation";
import { AuditSplit } from "../../../components/audit/audit-split";
import { parseDir, parseMode, parsePreset } from "../../../lib/audit-query";

export const dynamic = "force-dynamic";

export default async function AuditSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ fixture?: string; preset?: string; mode?: string; dir?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const fixtures = fixturesForFamily(slug);
  if (fixtures.length === 0) notFound();
  const fixture = fixtures.find((f) => f.id === query.fixture) ?? fixtures[0];
  if (!fixture) notFound();
  const preset = parsePreset(query.preset);
  const mode = parseMode(query.mode);
  const dir = parseDir(query.dir);
  const origin = parseAuditOrigin(process.env.CRONUS_AUDIT_ORIGIN);
  const kernelSrc = origin ? kernelAuditUrl(origin, slug, fixture.id, { preset, mode, dir }) : null;

  return (
    <AuditSplit
      slug={slug}
      fixtures={fixtures}
      fixture={fixture}
      preset={preset}
      mode={mode}
      dir={dir}
      kernelSrc={kernelSrc}
    />
  );
}
