import { notFound } from "next/navigation";
import { BlockView } from "../../../../components/blocks/block-view";
import {
  BLOCK_VARIANT_PARAMS,
  getBlockMeta,
  getBlockVariantMeta,
} from "../../../../lib/blocks-index";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOCK_VARIANT_PARAMS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; variant: string }>;
}) {
  const { slug, variant } = await params;
  const meta = getBlockMeta(slug);
  const variantMeta = getBlockVariantMeta(slug, variant);
  const titlePrefix =
    meta && variantMeta
      ? variantMeta.id === "default" || variantMeta.name === meta.name
        ? meta.name
        : `${variantMeta.name} ${meta.name}`
      : undefined;

  return {
    title: titlePrefix ? `${titlePrefix} — Kronus UI Blocks` : "Blocks — Kronus UI",
    description: variantMeta?.description ?? meta?.description,
  };
}

export default async function BlockVariantPage({
  params,
}: {
  params: Promise<{ slug: string; variant: string }>;
}) {
  const { slug, variant } = await params;

  if (!getBlockMeta(slug) || !getBlockVariantMeta(slug, variant)) notFound();

  return <BlockView slug={slug} variant={variant} />;
}
