import { getShadcnItem, shadcnItemParams } from "../../../lib/shadcn-registry";

/**
 * shadcn-spec registry items, one URL per item:
 *
 *   npx shadcn@latest add https://ui.testkronus.cloud/r/button.json
 *
 * Every known item is prerendered at build time; anything else 404s.
 */
export const dynamic = "force-static";

export function generateStaticParams(): { name: string }[] {
  return shadcnItemParams();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
): Promise<Response> {
  const { name } = await params;
  const item = name.endsWith(".json") ? getShadcnItem(name.slice(0, -".json".length)) : undefined;
  if (!item) return Response.json({ error: "Unknown registry item" }, { status: 404 });
  return Response.json(item);
}
