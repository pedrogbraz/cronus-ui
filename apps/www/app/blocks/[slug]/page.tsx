import { notFound } from "next/navigation";
import { BlockApiReference } from "../../../components/blocks/block-api-reference";
import { BlockVariantsGallery } from "../../../components/blocks/block-variants-gallery";
import { BLOCK_SLUGS, getBlockMeta } from "../../../lib/blocks-index";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOCK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getBlockMeta(slug);
  return {
    title: meta ? `${meta.name} Variations — Cronus UI Blocks` : "Blocks — Cronus UI",
    description: meta?.description,
  };
}

export default async function BlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getBlockMeta(slug);
  if (!meta) notFound();

  return (
    <>
      <BlockVariantsGallery slug={slug} />
      <BlockApiReference meta={meta} />
    </>
  );
}
