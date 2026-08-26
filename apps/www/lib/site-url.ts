/**
 * Canonical public origin of the showcase, used by the SEO surface
 * (sitemap, robots, Open Graph). Override with `NEXT_PUBLIC_SITE_URL`.
 */
const FALLBACK_SITE_URL = "https://ui.testcronus.cloud";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/+$/, "");

/**
 * Cronus Pro lives on its own origin (heroui.pro / pro.magicui.design), not
 * `/pro` on this docs chrome. Override with `NEXT_PUBLIC_PRO_URL`.
 */
export const PRO_URL = (
  process.env.NEXT_PUBLIC_PRO_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:4748" : "https://cronusui.pro")
).replace(/\/+$/, "");

/** Absolute URL for a site path: `absoluteUrl("/components/button")`. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
