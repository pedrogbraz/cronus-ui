export const DEFAULT_AUDIT_ORIGIN = "http://127.0.0.1:5176";

export interface PreviewQuery {
  fixture?: string;
  preset?: string;
  mode?: string;
  dir?: string;
}

export function parseAuditOrigin(raw: string | undefined | null): string | null {
  const value = raw && raw.length > 0 ? raw : DEFAULT_AUDIT_ORIGIN;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "http:") return null;
  if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") return null;
  return url.origin;
}

export function queryString(query: PreviewQuery): string {
  const params = new URLSearchParams();
  if (query.preset) params.set("preset", query.preset);
  if (query.mode) params.set("mode", query.mode);
  if (query.dir) params.set("dir", query.dir);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function reactPreviewPath(slug: string, fixture: string, query: PreviewQuery = {}): string {
  return `/preview/react/${slug}/${fixture}${queryString(query)}`;
}

export function cronusPreviewPath(slug: string, fixture: string, query: PreviewQuery = {}): string {
  return `/preview/cronus/${slug}/${fixture}${queryString(query)}`;
}

export function auditPagePath(slug: string, query: PreviewQuery = {}): string {
  const params = new URLSearchParams();
  if (query.fixture) params.set("fixture", query.fixture);
  if (query.preset) params.set("preset", query.preset);
  if (query.mode) params.set("mode", query.mode);
  if (query.dir) params.set("dir", query.dir);
  const s = params.toString();
  return s ? `/audit/${slug}?${s}` : `/audit/${slug}`;
}

export function kernelAuditUrl(
  origin: string,
  slug: string,
  fixture: string,
  query: PreviewQuery = {},
): string {
  return `${origin}/audit/${slug}/${fixture}${queryString(query)}`;
}
