/**
 * demo-store — the single source of truth for the storefront demo dataset.
 *
 * PURE TS DATA (zero React / hooks / DOM), so it is safe to import from a React
 * Server Component and ships as a `registry:lib` item (`cronus-ui add demo-store`
 * writes `lib/demo-store.ts`). Every storefront block (product grid, cart,
 * checkout, invoice, order history, reviews) is meant to read from HERE, so the
 * same product ("Aurora Wireless Headphones", $349) appears in the grid, the
 * cart, the order, and the invoice — change one product and every surface moves
 * together.
 *
 * The values below are LIFTED verbatim from the existing storefront blocks (they
 * are behaviour-preserving: migrating a block swaps its inline array for an
 * import of the SAME data), so visual snapshots stay byte-identical.
 *
 * Brand: {@link BRAND} is the standalone demo store name ("Aurora Audio"), used
 * when this dataset is consumed on its own. It is a demo default — `cronus-ui
 * compose` does NOT override it (the composed app's brand reaches its VISIBLE
 * chrome via the separate brandTokens literal-replacement path, not this lib).
 */

/** The storefront brand wordmark — the standalone demo store name. */
export const BRAND = "Aurora Audio";

/** A tailwind gradient pair used as a product/thumbnail placeholder fill. */
export type Gradient = string;

/** A catalog product. `id` is stable (drives the future `/products/[id]` route). */
export interface Product {
  /** Stable slug id (never changes; safe as a route/key). */
  id: string;
  /** Display name. */
  name: string;
  /** Short kind/category caption (e.g. "Course · 42 lessons"). */
  kind: string;
  /** Coarse category, for filtering/grouping. */
  category: string;
  /** Formatted price string, exactly as rendered (e.g. "$349.00"). */
  price: string;
  /** Numeric price in whole currency units, for computed subtotals/tests. */
  priceValue: number;
  /** Aggregate star rating (0–5). */
  rating: number;
  /** Number of reviews backing {@link rating}. */
  reviews: number;
  /** Two-letter monogram shown on the placeholder tile. */
  initials: string;
  /** Placeholder gradient fill. */
  gradient: Gradient;
  /** Optional merchandising badge (e.g. "Bestseller", "New"). */
  badge?: string;
}

/**
 * The catalog. Twelve products spanning the two storefront narratives the blocks
 * ship today: the physical Aurora-Audio line (headphones + accessories used by
 * the cart / order / invoice) and the digital creator line (used by the product
 * grid). Ids are stable so orders and carts can reference them.
 */
export const PRODUCTS: Product[] = [
  {
    id: "aurora",
    name: "Aurora Wireless Headphones",
    kind: "Over-ear · ANC",
    category: "Audio",
    price: "$349.00",
    priceValue: 349,
    rating: 4.8,
    reviews: 1284,
    initials: "AH",
    gradient: "from-primary/30 to-info/20",
    badge: "Bestseller",
  },
  {
    id: "case",
    name: "Hard-Shell Travel Case",
    kind: "Accessory · Charcoal",
    category: "Accessories",
    price: "$49.00",
    priceValue: 49,
    rating: 4.7,
    reviews: 212,
    initials: "TC",
    gradient: "from-info/30 to-success/20",
  },
  {
    id: "cushions",
    name: "Memory-Foam Ear Cushions",
    kind: "Accessory · 2-pack",
    category: "Accessories",
    price: "$29.00",
    priceValue: 29,
    rating: 4.6,
    reviews: 168,
    initials: "EC",
    gradient: "from-warning/30 to-primary/20",
  },
  {
    id: "buds",
    name: "Aurora Wireless Earbuds",
    kind: "In-ear · ANC",
    category: "Audio",
    price: "$149.00",
    priceValue: 149,
    rating: 4.5,
    reviews: 942,
    initials: "AE",
    gradient: "from-primary/30 to-warning/20",
    badge: "New",
  },
  {
    id: "stand",
    name: "Aluminum Headphone Stand",
    kind: "Accessory · Space Gray",
    category: "Accessories",
    price: "$39.00",
    priceValue: 39,
    rating: 4.4,
    reviews: 96,
    initials: "HS",
    gradient: "from-success/30 to-info/20",
  },
  {
    id: "cable",
    name: "Braided USB-C Cable",
    kind: "Accessory · 1.5m",
    category: "Accessories",
    price: "$19.00",
    priceValue: 19,
    rating: 4.3,
    reviews: 74,
    initials: "UC",
    gradient: "from-info/30 to-primary/20",
  },
  {
    id: "playbook",
    name: "The Creator Playbook",
    kind: "Course · 42 lessons",
    category: "Course",
    price: "$129.00",
    priceValue: 129,
    rating: 4.9,
    reviews: 512,
    initials: "CP",
    gradient: "from-primary/30 to-info/20",
    badge: "Bestseller",
  },
  {
    id: "presets",
    name: "Cinematic LUT Presets",
    kind: "Asset pack · 60 presets",
    category: "Assets",
    price: "$39.00",
    priceValue: 39,
    rating: 4.7,
    reviews: 208,
    initials: "LP",
    gradient: "from-info/30 to-success/20",
  },
  {
    id: "templates",
    name: "Launch Notion System",
    kind: "Template · instant access",
    category: "Template",
    price: "$24.00",
    priceValue: 24,
    rating: 4.6,
    reviews: 146,
    initials: "NS",
    gradient: "from-warning/30 to-primary/20",
  },
  {
    id: "ebook",
    name: "Newsletter to Income",
    kind: "Ebook · 180 pages",
    category: "Ebook",
    price: "$19.00",
    priceValue: 19,
    rating: 4.5,
    reviews: 121,
    initials: "NI",
    gradient: "from-success/30 to-info/20",
  },
  {
    id: "workshop",
    name: "Monetization Workshop",
    kind: "Replay · 3 hours",
    category: "Course",
    price: "$89.00",
    priceValue: 89,
    rating: 4.8,
    reviews: 238,
    initials: "MW",
    gradient: "from-primary/30 to-warning/20",
    badge: "New",
  },
  {
    id: "soundkit",
    name: "Ambient Sound Kit",
    kind: "Audio · 120 loops",
    category: "Assets",
    price: "$29.00",
    priceValue: 29,
    rating: 4.7,
    reviews: 184,
    initials: "SK",
    gradient: "from-info/30 to-primary/20",
  },
];

/** A single quantity of a product inside a cart / order (references {@link Product.id}). */
export interface LineItem {
  /** References {@link Product.id}. */
  productId: string;
  /** Variant/option caption as rendered (e.g. "Midnight", "2-pack"). */
  option: string;
  /** Quantity. */
  qty: number;
}

/**
 * The demo cart — the exact three lines the cart/checkout blocks render today
 * (Aurora headphones + travel case + ear cushions). Derived surfaces (checkout
 * summary, invoice) slice from here.
 */
export const CART: LineItem[] = [
  { productId: "aurora", option: "Midnight", qty: 1 },
  { productId: "case", option: "Charcoal", qty: 1 },
  { productId: "cushions", option: "2-pack", qty: 2 },
];

/** An order's lifecycle status, matching the storefront badge variants. */
export type OrderStatus = "Delivered" | "In transit" | "Processing" | "Refunded";

/** A past order in the customer's history. */
export interface Order {
  /** Display id, e.g. "#CD-58291". */
  id: string;
  /** Human date string, as rendered (e.g. "Jul 9, 2026"). */
  date: string;
  /** Formatted order total (e.g. "$387.60"). */
  total: string;
  /** Numeric total in whole currency units, for computed checks. */
  totalValue: number;
  /** Lifecycle status. */
  status: OrderStatus;
  /** Line items (each references a {@link Product.id}). */
  items: LineItem[];
}

/**
 * The five orders the order-history table/cards render today. `#CD-58291` is the
 * headline "In transit" order (the 4-item Aurora bundle). Each order references
 * real {@link PRODUCTS} ids (asserted in demo-store.test.ts).
 */
export const ORDERS: Order[] = [
  {
    id: "#CD-58291",
    date: "Jul 9, 2026",
    total: "$387.60",
    totalValue: 387.6,
    status: "In transit",
    items: [
      { productId: "aurora", option: "Midnight", qty: 1 },
      { productId: "case", option: "Charcoal", qty: 1 },
      { productId: "cushions", option: "2-pack", qty: 2 },
    ],
  },
  {
    id: "#CD-57904",
    date: "Jun 20, 2026",
    total: "$129.00",
    totalValue: 129,
    status: "Delivered",
    items: [{ productId: "playbook", option: "Lifetime access", qty: 1 }],
  },
  {
    id: "#CD-57648",
    date: "Jun 11, 2026",
    total: "$94.50",
    totalValue: 94.5,
    status: "Delivered",
    items: [
      { productId: "presets", option: "60 presets", qty: 1 },
      { productId: "templates", option: "Instant access", qty: 1 },
    ],
  },
  {
    id: "#CD-57310",
    date: "May 30, 2026",
    total: "$349.00",
    totalValue: 349,
    status: "Refunded",
    items: [{ productId: "aurora", option: "Midnight", qty: 1 }],
  },
  {
    id: "#CD-57122",
    date: "May 21, 2026",
    total: "$212.80",
    totalValue: 212.8,
    status: "Processing",
    items: [
      { productId: "buds", option: "White", qty: 1 },
      { productId: "cushions", option: "2-pack", qty: 1 },
      { productId: "stand", option: "Space Gray", qty: 1 },
      { productId: "cable", option: "1.5m", qty: 1 },
    ],
  },
];

/** One bucket of the aggregate-rating histogram. */
export interface RatingBar {
  /** Star tier as a string ("5".."1"). */
  stars: string;
  /** Percent of reviews at this tier (the five sum to 100). */
  percent: number;
  /** Accessible label, as rendered. */
  label: string;
}

/**
 * The rating histogram the reviews block renders. The five percentages sum to
 * 100 (asserted in demo-store.test.ts).
 */
export const RATING_DISTRIBUTION: RatingBar[] = [
  { stars: "5", percent: 82, label: "5 stars: 82% of reviews" },
  { stars: "4", percent: 11, label: "4 stars: 11% of reviews" },
  { stars: "3", percent: 4, label: "3 stars: 4% of reviews" },
  { stars: "2", percent: 2, label: "2 stars: 2% of reviews" },
  { stars: "1", percent: 1, label: "1 star: 1% of reviews" },
];

/** Aggregate rating summary shown above the histogram. */
export const RATING_SUMMARY = {
  /** Average score, as rendered ("4.8"). */
  average: "4.8",
  /** Numeric average, for checks. */
  averageValue: 4.8,
  /** Total review count, as rendered ("1,284"). */
  count: "1,284",
  /** Numeric review count. */
  countValue: 1284,
} as const;

/** A single customer review. */
export interface Review {
  /** Stable id (also the reviewer slug). */
  id: string;
  /** Reviewer display name. */
  name: string;
  /** Reviewer monogram. */
  initials: string;
  /** Review date, as rendered. */
  date: string;
  /** Star rating 1–5. */
  rating: number;
  /** Accessible rating label, as rendered. */
  ratingLabel: string;
  /** Short review title (top reviews only). */
  title: string;
  /** Review body. */
  body: string;
  /** Whether the purchase was verified. */
  verified: boolean;
}

/**
 * The six reviewers the reviews blocks render (Sofia, Marcus, Priya, Jonas,
 * Amara, Leo). The summary block shows the first three with titles; the compact
 * block shows all six. Ratings are coherent with {@link RATING_DISTRIBUTION}.
 */
export const REVIEWS: Review[] = [
  {
    id: "sofia",
    name: "Sofia Almeida",
    initials: "SA",
    date: "Jul 2, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    title: "Best headphones I have ever owned",
    body: "The noise cancellation is unreal on flights — I forgot I was seated by the engine. And 40 hours of battery is not marketing math; I charge them about once a week.",
    verified: true,
  },
  {
    id: "marcus",
    name: "Marcus Chen",
    initials: "MC",
    date: "Jun 27, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    title: "Worth every dollar",
    body: "Swapped from a much pricier pair and the Aurora sounds warmer and fits better. Multipoint pairing between my laptop and phone just works.",
    verified: true,
  },
  {
    id: "priya",
    name: "Priya Nair",
    initials: "PN",
    date: "Jun 19, 2026",
    rating: 4,
    ratingLabel: "Rated 4 out of 5 stars",
    title: "Great sound, snug fit at first",
    body: "Sound stage is stunning for the price. The clamp was tight the first week but broke in nicely — would still buy again.",
    verified: false,
  },
  {
    id: "jonas",
    name: "Jonas Weber",
    initials: "JW",
    date: "Jun 14, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    title: "Best purchase this year",
    body: "Best purchase this year. The travel case alone feels premium.",
    verified: true,
  },
  {
    id: "amara",
    name: "Amara Diallo",
    initials: "AD",
    date: "Jun 8, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    title: "Crystal-clear calls",
    body: "Calls are crystal clear even on a windy commute. Zero regrets.",
    verified: true,
  },
  {
    id: "leo",
    name: "Leo Tanaka",
    initials: "LT",
    date: "May 31, 2026",
    rating: 4,
    ratingLabel: "Rated 4 out of 5 stars",
    title: "Fantastic for focus work",
    body: "Fantastic for focus work. Wish the earcups folded a bit flatter.",
    verified: false,
  },
];

/** The signed-in shopper (account / order-history header). */
export interface StoreUser {
  name: string;
  email: string;
  initials: string;
}

/** The demo shopper. */
export const USER: StoreUser = {
  name: "Sofia Almeida",
  email: "sofia@example.com",
  initials: "SA",
};

/** Look up a product by its stable id (undefined when absent). */
export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
