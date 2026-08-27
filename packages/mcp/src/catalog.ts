/**
 * Compact Hydra-ready catalog: tag cards, 2-query match, natural-language parse.
 * Tags come from `registry/meta.json`. Scoring is local and deterministic —
 * Hydra can replace the ranker later; the tags stay the mapping.
 */

import type { RegistryIndexEntry, RegistryMeta } from "./registry.js";

const ADD_COMMAND = "npx cronus-ui add";

function humanizeName(name: string): string {
  return name
    .split(/[-_]/g)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const CATALOG_KINDS = ["component", "block", "variant", "template"] as [
  "component",
  "block",
  "variant",
  "template",
];
export type CatalogKind = (typeof CATALOG_KINDS)[number];

export interface CatalogCard {
  name: string;
  kind: CatalogKind;
  title: string;
  description: string;
  style: string;
  palette: string;
  motion: string;
  intents: string[];
  category?: string;
  family?: string;
  install: string;
}

export interface MatchCatalogInput {
  query?: string;
  intent?: string;
  style?: string;
  palette?: string;
  motion?: string;
  kind?: CatalogKind;
  limit?: number;
}

export interface MatchCatalogResult {
  filters: {
    query: string;
    intent?: string;
    style?: string;
    palette?: string;
    motion?: string;
    kind?: CatalogKind;
  };
  /** Combined recommendation — intersection, or one intent hit + one motion hit. */
  pick: CatalogCard[];
  /** Facet 1: best items for the intent (login, pricing, …). */
  intent: CatalogCard[];
  /** Facet 2: best items for motion/style (smooth, glass, …). */
  motion: CatalogCard[];
  /** Ranked joint list (items that match as many filters as possible). */
  matches: CatalogCard[];
}

const MOTION_ALIASES: Record<string, string> = {
  smooth: "smooth",
  suave: "smooth",
  gentle: "smooth",
  soft: "smooth",
  snappy: "snappy",
  quick: "snappy",
  crisp: "snappy",
  cinematic: "cinematic",
  dramatic: "cinematic",
  static: "none",
  none: "none",
};

const STYLE_ALIASES: Record<string, string> = {
  default: "default",
  editorial: "editorial",
  operational: "operational",
  glass: "glass",
  frosted: "glass",
  brutalist: "brutalist",
};

const INTENT_ALIASES: Record<string, string> = {
  login: "login",
  signin: "login",
  "sign-in": "login",
  auth: "auth",
  signup: "signup",
  "sign-up": "signup",
  register: "signup",
  pricing: "marketing",
  hero: "marketing",
  landing: "marketing",
  dashboard: "dashboard",
  admin: "admin",
  chart: "chart",
  charts: "chart",
  table: "data",
  form: "form",
  forms: "form",
  nav: "nav",
  navigation: "nav",
  overlay: "overlay",
  dialog: "overlay",
  modal: "overlay",
  billing: "billing",
  checkout: "commerce",
  shop: "commerce",
  store: "commerce",
  ai: "ai",
  chat: "ai",
  email: "email",
  settings: "settings",
  account: "account",
};

function tokenize(raw: string): string[] {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 1);
}

/** Lift a free-text prompt into structured filters. Explicit fields win. */
export function parseCatalogQuery(input: MatchCatalogInput): {
  query: string;
  intent?: string;
  style?: string;
  palette?: string;
  motion?: string;
  kind?: CatalogKind;
} {
  const query = input.query?.trim() ?? "";
  const tokens = tokenize(query);
  let intent = input.intent?.trim().toLowerCase() || undefined;
  let style = input.style?.trim().toLowerCase() || undefined;
  let palette = input.palette?.trim().toLowerCase() || undefined;
  let motion = input.motion?.trim().toLowerCase() || undefined;
  const kind = input.kind;

  if (!intent) {
    for (const token of tokens) {
      if (INTENT_ALIASES[token]) {
        intent = INTENT_ALIASES[token];
        break;
      }
    }
  }
  if (!motion) {
    for (const token of tokens) {
      if (MOTION_ALIASES[token]) {
        motion = MOTION_ALIASES[token];
        break;
      }
    }
  }
  if (!style) {
    for (const token of tokens) {
      if (STYLE_ALIASES[token]) {
        style = STYLE_ALIASES[token];
        break;
      }
    }
  }
  if (!palette) {
    for (const token of tokens) {
      if (token === "aurora" || token === "neutral" || token === "semantic") {
        palette = token;
        break;
      }
    }
  }

  return { query, intent, style, palette, motion, kind };
}

function installFor(kind: CatalogKind, name: string): string {
  if (kind === "template") {
    return name === "saas"
      ? "npx create-cronus-app my-app --template saas"
      : `npx create-cronus-app my-app --template ${name}`;
  }
  return `${ADD_COMMAND} ${name}`;
}

interface TaggedMeta {
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  style?: string;
  palette?: string;
  motion?: string;
  intents?: string[];
  variants?: (TaggedMeta & { id?: string; item?: string })[];
}

function cardFrom(
  name: string,
  kind: CatalogKind,
  info: TaggedMeta | undefined,
  extras: { family?: string; category?: string } = {},
): CatalogCard {
  return {
    name,
    kind,
    title: info?.title ?? info?.name ?? humanizeName(name),
    description: info?.description ?? "",
    style: info?.style ?? "default",
    palette: info?.palette ?? "semantic",
    motion: info?.motion ?? "none",
    intents: info?.intents ?? [],
    ...(info?.category || extras.category ? { category: info?.category ?? extras.category } : {}),
    ...(extras.family ? { family: extras.family } : {}),
    install: installFor(kind, name),
  };
}

/** Flatten components, blocks, variants, and templates into compact cards. */
export function buildCatalogIndex(
  index: RegistryIndexEntry[],
  meta: RegistryMeta | null,
): CatalogCard[] {
  const cards: CatalogCard[] = [];
  const seen = new Set<string>();
  const push = (card: CatalogCard) => {
    if (seen.has(`${card.kind}:${card.name}`)) return;
    seen.add(`${card.kind}:${card.name}`);
    cards.push(card);
  };

  for (const entry of index) {
    if (entry.type === "registry:ui") {
      push(cardFrom(entry.name, "component", meta?.components?.[entry.name]));
    }
    if (entry.type === "registry:block") {
      const block = meta?.blocks?.[entry.name] as TaggedMeta | undefined;
      if (block) {
        push(cardFrom(entry.name, "block", block));
        for (const variant of block.variants ?? []) {
          if (!variant.item || variant.item === entry.name) continue;
          push(
            cardFrom(variant.item, "variant", variant, {
              family: entry.name,
              category: block.category,
            }),
          );
        }
      } else if (!entry.name.includes("--")) {
        push(cardFrom(entry.name, "block", undefined));
      }
    }
  }

  for (const [name, app] of Object.entries(meta?.apps ?? {})) {
    push(cardFrom(name, "template", app as TaggedMeta));
  }

  return cards;
}

function scoreCard(card: CatalogCard, filters: ReturnType<typeof parseCatalogQuery>): number {
  let score = 0;
  const haystack = [card.name, card.title, card.description, card.category ?? "", ...card.intents]
    .join(" ")
    .toLowerCase();

  if (filters.intent) {
    if (card.intents.includes(filters.intent)) score += 8;
    else if (card.category === filters.intent) score += 4;
    else if (haystack.includes(filters.intent)) score += 2;
  }
  if (filters.motion && card.motion === filters.motion) score += 5;
  if (filters.style && card.style === filters.style) score += 5;
  if (filters.palette && card.palette === filters.palette) score += 3;
  if (filters.kind && card.kind === filters.kind) score += 2;

  if (filters.query) {
    const tokens = tokenize(filters.query);
    for (const token of tokens) {
      if (card.name.includes(token)) score += 3;
      else if (haystack.includes(token)) score += 1;
    }
  }

  return score;
}

function top(cards: CatalogCard[], limit: number): CatalogCard[] {
  return cards.slice(0, Math.max(0, limit));
}

export function matchCatalog(
  index: RegistryIndexEntry[],
  meta: RegistryMeta | null,
  input: MatchCatalogInput,
): MatchCatalogResult {
  const filters = parseCatalogQuery(input);
  const limit = Math.min(Math.max(input.limit ?? 8, 1), 24);
  const catalog = buildCatalogIndex(index, meta);

  const kindFiltered = filters.kind
    ? catalog.filter((card) => card.kind === filters.kind)
    : catalog;

  const ranked = kindFiltered
    .map((card) => ({ card, score: scoreCard(card, filters) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.card.name.localeCompare(b.card.name));

  const matches = top(
    ranked.map((row) => row.card),
    limit,
  );

  const intentHits = filters.intent
    ? top(
        kindFiltered
          .map((card) => ({
            card,
            score: scoreCard(card, { query: "", intent: filters.intent }),
          }))
          .filter((row) => row.score > 0)
          .sort((a, b) => b.score - a.score || a.card.name.localeCompare(b.card.name))
          .map((row) => row.card),
        limit,
      )
    : [];

  const motionHits =
    filters.motion || filters.style
      ? top(
          kindFiltered
            .map((card) => ({
              card,
              score: scoreCard(card, {
                query: "",
                motion: filters.motion,
                style: filters.style,
              }),
            }))
            .filter((row) => row.score > 0)
            .sort((a, b) => b.score - a.score || a.card.name.localeCompare(b.card.name))
            .map((row) => row.card),
          limit,
        )
      : [];

  const joint = ranked
    .filter((row) => {
      const intentOk = !filters.intent || row.card.intents.includes(filters.intent);
      const motionOk = !filters.motion || row.card.motion === filters.motion;
      const styleOk = !filters.style || row.card.style === filters.style;
      return intentOk && motionOk && styleOk;
    })
    .map((row) => row.card);

  const pick =
    joint.length > 0
      ? top(joint, Math.min(limit, 4))
      : [...top(intentHits, 1), ...top(motionHits, 1)].filter(
          (card, i, all) => all.findIndex((other) => other.name === card.name) === i,
        );

  return {
    filters,
    pick,
    intent: intentHits,
    motion: motionHits,
    matches,
  };
}

export function listCatalog(
  index: RegistryIndexEntry[],
  meta: RegistryMeta | null,
  kind?: CatalogKind,
): { count: number; items: CatalogCard[] } {
  const items = buildCatalogIndex(index, meta).filter((card) => !kind || card.kind === kind);
  return { count: items.length, items };
}
