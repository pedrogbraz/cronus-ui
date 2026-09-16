import { parseAuditOrigin } from "@cronus-ui/audit/preview-url";
import type { Metadata } from "next";
import { ParityScoreboard } from "../../components/audit/parity-scoreboard";
import { DocsHeader, DocsTextLink, PrimaryLink } from "../../components/docs/documentation";
import { SiteFooter } from "../../components/home/site-footer";
import { SiteNav } from "../../components/site-nav";
import { configuredAuditOrigin, SCOREBOARD } from "../../lib/audit/scoreboard";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Parity scoreboard",
  description:
    "React vs Cronus parity for every Cronus UI family: kernel port status, geometry, pixel and logic audit results.",
  robots: { index: true, follow: true },
};

export default function AuditIndexPage() {
  const auditOrigin = configuredAuditOrigin(process.env.CRONUS_AUDIT_ORIGIN, parseAuditOrigin);
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteNav />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <DocsHeader
          eyebrow="Audit"
          title="React vs Cronus parity"
          description="Every family in the React catalog and the kernel registry, with the latest audit run: the same fixture rendered by @cronus-ui/ui and by the Rust kernel from .cronus, compared slot by slot, pixel by pixel and by behavior."
        >
          <PrimaryLink href="/language">How .cronus works</PrimaryLink>
          <DocsTextLink href="/components">React catalog</DocsTextLink>
        </DocsHeader>
        <ParityScoreboard board={SCOREBOARD} auditOrigin={auditOrigin} />
      </main>
      <SiteFooter />
    </div>
  );
}
