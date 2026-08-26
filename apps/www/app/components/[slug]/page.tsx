import { notFound } from "next/navigation";
import { ComponentDocView } from "../../../components/docs/component-doc-view";
import {
  COMPONENT_SLUGS,
  getComponentDisplayName,
  getComponentMeta,
} from "../../../lib/components-index";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getComponentMeta(slug);
  return {
    title: meta ? `${getComponentDisplayName(meta.name)} — Kronus UI` : "Kronus UI",
    description: meta?.description,
  };
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getComponentMeta(slug)) notFound();
  return <ComponentDocView slug={slug} />;
}
