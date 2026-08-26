import type { MetadataRoute } from "next";
import { PRO_URL } from "../lib/origins";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${PRO_URL}/sitemap.xml`,
  };
}
