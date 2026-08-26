/**
 * Split origins. Kronus OSS (docs, registry, live previews) and Kronus Pro
 * (this site) are different hosts — heroui.com / heroui.pro, not a /pro route
 * on the docs chrome.
 *
 * Override with `NEXT_PUBLIC_OSS_URL` / `NEXT_PUBLIC_PRO_URL`. Production
 * fallbacks name the public hosts; DNS is a deploy concern, not this file.
 */

function stripSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

const isDev = process.env.NODE_ENV === "development";

export const OSS_URL = stripSlash(
  process.env.NEXT_PUBLIC_OSS_URL ??
    (isDev ? "http://localhost:4747" : "https://ui.testkronus.cloud"),
);

export const PRO_URL = stripSlash(
  process.env.NEXT_PUBLIC_PRO_URL ?? (isDev ? "http://localhost:4748" : "https://kronusui.pro"),
);

export const GITHUB_URL = "https://github.com/pedrogbraz/kronus-ui";

export function ossUrl(path = "/"): string {
  return `${OSS_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function previewEmbedUrl(slug: string): string {
  return ossUrl(`/preview/t/${slug}?embed=1`);
}
