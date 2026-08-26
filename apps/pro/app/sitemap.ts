import type { MetadataRoute } from "next";
import { PRO_URL } from "../lib/origins";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: PRO_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
