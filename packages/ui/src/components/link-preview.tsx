"use client";

import { cva } from "class-variance-authority";
import { Globe } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn.js";
import { Skeleton } from "./skeleton.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

export interface LinkPreviewMetadata {
  title: string | null;
  description: string | null;
  favicon: string | null;
  websiteName: string | null;
  image: string | null;
  url: string;
}

export interface LinkPreviewLabels {
  invalidUrl: string;
  failed: string;
  unavailable: string;
  preview: string;
  favicon: string;
}

const DEFAULT_LABELS: LinkPreviewLabels = {
  invalidUrl: "Invalid URL",
  failed: "Failed to load preview",
  unavailable: "No preview available",
  preview: "Website preview",
  favicon: "Favicon",
};

export const linkPreviewVariants = cva(
  "cursor-pointer rounded-sm bg-primary/20 px-1 text-sm font-medium text-primary-strong transition-colors hover:underline",
);

const metadataCache = new Map<string, LinkPreviewMetadata>();
const inFlight = new Map<string, Promise<LinkPreviewMetadata>>();

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseMetadata(href: string, payload: unknown): LinkPreviewMetadata {
  const json = payload as { data?: Record<string, unknown> } & Record<string, unknown>;
  const data = (json?.data ?? json) as Record<string, unknown>;
  const urlObj = new URL(href);
  const image = data?.image;
  const logo = data?.logo;
  return {
    title: typeof data?.title === "string" ? data.title : null,
    description: typeof data?.description === "string" ? data.description : null,
    image:
      typeof image === "string"
        ? image
        : image && typeof image === "object" && "url" in image && typeof image.url === "string"
          ? image.url
          : typeof data?.website_image === "string"
            ? data.website_image
            : null,
    favicon:
      typeof logo === "string"
        ? logo
        : logo && typeof logo === "object" && "url" in logo && typeof logo.url === "string"
          ? logo.url
          : typeof data?.favicon === "string"
            ? data.favicon
            : `${urlObj.origin}/favicon.ico`,
    websiteName:
      typeof data?.publisher === "string"
        ? data.publisher
        : typeof data?.website_name === "string"
          ? data.website_name
          : urlObj.hostname,
    url: href,
  };
}

export async function fetchLinkPreviewMetadata(
  href: string,
  endpoint: string,
): Promise<LinkPreviewMetadata> {
  const cached = metadataCache.get(href);
  if (cached) return cached;
  const existing = inFlight.get(href);
  if (existing) return existing;

  const promise = (async () => {
    const joiner = endpoint.includes("?") ? "&" : "?";
    const response = await fetch(`${endpoint}${joiner}url=${encodeURIComponent(href)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata (${response.status})`);
    }
    const json: unknown = await response.json();
    const metadata = parseMetadata(href, json);
    metadataCache.set(href, metadata);
    return metadata;
  })();

  inFlight.set(href, promise);
  try {
    return await promise;
  } finally {
    inFlight.delete(href);
  }
}

/** Test helper — clears the module-level metadata cache. */
export function clearLinkPreviewCache() {
  metadataCache.clear();
  inFlight.clear();
}

export interface LinkPreviewProps {
  href: string;
  children: ReactNode;
  className?: string;
  /**
   * Endpoint that returns URL metadata as JSON. Receives the target URL as a
   * `url` query param and must return microlink.io shape (`{ title, description,
   * image, logo, publisher }` or `{ data: … }`).
   */
  endpoint?: string;
  fetcher?: (href: string, endpoint: string) => Promise<LinkPreviewMetadata>;
  labels?: Partial<LinkPreviewLabels>;
}

export function LinkPreview({
  href,
  children,
  className,
  endpoint = "https://api.microlink.io",
  fetcher = fetchLinkPreviewMetadata,
  labels: labelsProp,
}: LinkPreviewProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const elementRef = useRef<HTMLAnchorElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [validFavicon, setValidFavicon] = useState(true);
  const [validImage, setValidImage] = useState(true);
  const [metadata, setMetadata] = useState<LinkPreviewMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isValidUrl =
    Boolean(href) && isValidHttpUrl(href) && !isEmail(href) && !href.startsWith("mailto:");

  useEffect(() => {
    if (!isInView || !isValidUrl || metadata) return;
    let mounted = true;
    setIsLoading(true);
    setError(null);
    fetcher(href, endpoint)
      .then((data) => {
        if (!mounted) return;
        setMetadata(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [isInView, isValidUrl, href, metadata, endpoint, fetcher]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !href) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { rootMargin: "100px", threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [href]);

  if (!href) return null;

  const displayUrl = href.replace(/^https?:\/\//, "");

  return (
    <Tooltip data-slot="link-preview" delayDuration={0}>
      <TooltipTrigger asChild>
        <a
          ref={elementRef}
          href={href}
          className={cn(linkPreviewVariants(), className)}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      </TooltipTrigger>
      <TooltipContent className="w-[300px] max-w-[300px] border border-border bg-surface-floating p-3 text-fg shadow-lg">
        {isLoading ? (
          <div className="flex w-full flex-col gap-2" aria-busy="true">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
        ) : error || !isValidUrl ? (
          <div className="flex items-center gap-2 p-1 text-error-strong">
            <Globe aria-hidden className="size-4" />
            <span className="text-sm">{!isValidUrl ? labels.invalidUrl : labels.failed}</span>
          </div>
        ) : metadata ? (
          <div className="flex w-full flex-col gap-2">
            {metadata.image && validImage ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={metadata.image}
                  alt={labels.preview}
                  className="size-full object-cover"
                  onError={() => setValidImage(false)}
                />
              </div>
            ) : null}
            {metadata.websiteName || (metadata.favicon && validFavicon) ? (
              <div className="flex min-w-0 items-center gap-2">
                {metadata.favicon && validFavicon ? (
                  <img
                    width={20}
                    height={20}
                    alt={labels.favicon}
                    className="size-5 shrink-0 rounded-full"
                    src={metadata.favicon}
                    onError={() => setValidFavicon(false)}
                  />
                ) : (
                  <Globe aria-hidden className="size-5 shrink-0 text-fg-tertiary" />
                )}
                {metadata.websiteName ? (
                  <div className="truncate text-sm font-medium text-fg">{metadata.websiteName}</div>
                ) : null}
              </div>
            ) : null}
            {metadata.title ? (
              <div className="line-clamp-2 break-words text-sm font-medium text-fg">
                {metadata.title}
              </div>
            ) : null}
            {metadata.description ? (
              <div className="line-clamp-3 break-words text-xs text-fg-tertiary">
                {metadata.description}
              </div>
            ) : null}
            <div className="truncate text-xs text-primary-strong">{displayUrl}</div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-1 text-fg-tertiary">
            <Globe aria-hidden className="size-4" />
            <span className="text-sm">{labels.unavailable}</span>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

export { DEFAULT_LABELS as linkPreviewDefaultLabels };
