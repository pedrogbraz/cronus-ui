/**
 * OSS support. Kronus is free; this is an optional coffee, not a paywall.
 *
 * Checkout defaults to GitHub Sponsors (custom one-time amounts). Point
 * `NEXT_PUBLIC_SPONSOR_URL` at Buy Me a Coffee or Ko-fi if you prefer that rail.
 */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const GITHUB_SPONSORS_URL = "https://github.com/sponsors/pedrogbraz";

export const SPONSOR_URL = (process.env.NEXT_PUBLIC_SPONSOR_URL ?? GITHUB_SPONSORS_URL).replace(
  /\/+$/,
  "",
);

export interface SponsorPreset {
  id: string;
  label: string;
  amount: number;
  hint: string;
}

export const SPONSOR_PRESETS: readonly SponsorPreset[] = [
  { id: "coffee", label: "Coffee", amount: 5, hint: "A warm thank you" },
  { id: "lunch", label: "Lunch", amount: 15, hint: "Keeps a session going" },
  { id: "day", label: "A working day", amount: 50, hint: "A real dent in the backlog" },
];

export const SPONSOR_AMOUNT_MIN = 1;
export const SPONSOR_AMOUNT_MAX = 10_000;
export const SPONSOR_AMOUNT_DEFAULT = SPONSOR_PRESETS[0]?.amount ?? 5;

export function formatSponsorAmount(amount: number): string {
  return usd.format(amount);
}

const GITHUB_SPONSOR_RE = /github\.com\/sponsors\/([A-Za-z0-9-]+)/i;

export function isGitHubSponsorsUrl(url: string = SPONSOR_URL): boolean {
  return GITHUB_SPONSOR_RE.test(url);
}

/** Clamp a typed amount to the public one-time range. */
export function clampSponsorAmount(value: number): number {
  if (!Number.isFinite(value)) return SPONSOR_AMOUNT_DEFAULT;
  return Math.min(SPONSOR_AMOUNT_MAX, Math.max(SPONSOR_AMOUNT_MIN, Math.round(value)));
}

/**
 * GitHub Sponsors accepts a one-time custom amount in the query string.
 * Buy Me a Coffee / Ko-fi land on the page — the visitor picks the amount there.
 */
export function sponsorCheckoutUrl(amountUsd?: number): string {
  const match = GITHUB_SPONSOR_RE.exec(SPONSOR_URL);
  if (!match?.[1] || amountUsd == null) return SPONSOR_URL;
  const amount = clampSponsorAmount(amountUsd);
  const user = match[1];
  const params = new URLSearchParams({
    sponsor: user,
    preview: "false",
    frequency: "one-time",
    amount: String(amount),
  });
  return `https://github.com/sponsors/${user}/sponsorships?${params.toString()}`;
}
