import { notFound } from "next/navigation";
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
    title: meta ? `${meta.name} Variations — Kronus UI Blocks` : "Blocks — Kronus UI",
    description: meta?.description,
  };
}

export default async function BlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlockMeta(slug)) notFound();
  return <BlockVariantsGallery slug={slug} />;
}
