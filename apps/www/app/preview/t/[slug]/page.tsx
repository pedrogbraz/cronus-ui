import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewChrome } from "../../../../components/templates/preview-chrome";
import { PreviewThemeLock } from "../../../../components/templates/preview-theme-lock";
import { TemplateStage } from "../../../../components/templates/template-stage";
import { getTemplate, hasLivePreview, TEMPLATE_SLUGS } from "../../../../lib/templates/catalog";
import { previewThemeInlineScript } from "../../../../lib/templates/preview-script";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATE_SLUGS.filter((slug) => {
    const entry = getTemplate(slug);
    return entry !== undefined && hasLivePreview(entry);
  }).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getTemplate(slug);
  return {
    title: entry ? `${entry.name} preview — Kronus UI` : "Template preview — Kronus UI",
    description: entry?.description,
    robots: { index: false, follow: false },
  };
}

export default async function TemplatePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ embed?: string }>;
}) {
  const { slug } = await params;
  const { embed } = await searchParams;
  const entry = getTemplate(slug);
  if (!entry || !hasLivePreview(entry)) notFound();

  const isEmbed = embed === "1";

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: theme/mode/embed are JSON.stringify-encoded literals from the catalog.
        dangerouslySetInnerHTML={{
          __html: previewThemeInlineScript(entry.theme, entry.mode, isEmbed),
        }}
      />
      <PreviewThemeLock theme={entry.theme} mode={entry.mode} embed={isEmbed} />
      {isEmbed ? null : <PreviewChrome entry={entry} />}
      <main id="main-content" aria-label={`${entry.name} live preview`}>
        <TemplateStage entry={entry} />
      </main>
    </>
  );
}
