/**
 * The Cronus Stack Builder resolver — PURE and DETERMINISTIC.
 *
 * Given a {@link Catalog} and a raw {@link Selection}, `resolve()` returns a
 * fully resolved {@link Resolution}:
 *  1. expands `implies` (auto-selects implied options);
 *  2. marks every option `available` + a human `reason` when a `requires` is
 *     unsatisfied or it `conflicts` with something selected;
 *  3. CASCADES — if a category's current value became unavailable, it falls
 *     back to that category's default valid option, iterating to a fixpoint.
 *
 * No I/O, no Date.now (except the seedable randomizer), no module state — the
 * same inputs always produce the same output, so it's trivially unit-testable
 * and safe to run on every keystroke in the UI.
 */

import {
  catalog as defaultCatalog,
  MULTI_DEFAULTS,
  SYNTHETIC_REQUIREMENTS,
  TOGGLE_DEFAULTS_ON,
} from "./catalog.js";
import type {
  Catalog,
  Category,
  Option,
  Resolution,
  ResolutionIssue,
  ResolvedCategory,
  ResolvedOption,
  Selection,
} from "./types.js";

/** Max cascade iterations before we bail (defensive — fixpoint is reached fast). */
const CASCADE_CAP = 20;

// --------------------------------------------------------------------------
// Catalog indexing helpers
// --------------------------------------------------------------------------

interface CatalogIndex {
  /** category id -> Category */
  catById: Map<string, Category>;
  /** option id -> Category that owns it */
  catOfOption: Map<string, Category>;
  /** option id -> Option */
  optById: Map<string, Option>;
  /**
   * Reverse-conflict edges: option id -> set of option ids that declared a
   * conflict WITH it. Conflicts are symmetric — if "backend-convex" conflicts
   * with "db-postgres", then selecting Convex must also disable Postgres even
   * though Postgres itself declares no conflict.
   */
  conflictedBy: Map<string, Set<string>>;
}

function indexCatalog(catalog: Catalog): CatalogIndex {
  const catById = new Map<string, Category>();
  const catOfOption = new Map<string, Category>();
  const optById = new Map<string, Option>();
  const conflictedBy = new Map<string, Set<string>>();
  for (const cat of catalog) {
    catById.set(cat.id, cat);
    for (const opt of cat.options) {
      catOfOption.set(opt.id, cat);
      optById.set(opt.id, opt);
    }
  }
  // Second pass: now every option is known, build the symmetric reverse edges.
  for (const cat of catalog) {
    for (const opt of cat.options) {
      for (const conf of opt.conflicts ?? []) {
        let set = conflictedBy.get(conf);
        if (!set) {
          set = new Set();
          conflictedBy.set(conf, set);
        }
        set.add(opt.id);
      }
    }
  }
  return { catById, catOfOption, optById, conflictedBy };
}

// --------------------------------------------------------------------------
// Selection accessors (typed by category kind)
// --------------------------------------------------------------------------

function singleValue(selection: Selection, catId: string): string | undefined {
  const v = selection[catId];
  return typeof v === "string" ? v : undefined;
}

function multiValue(selection: Selection, catId: string): string[] {
  const v = selection[catId];
  return Array.isArray(v) ? v : [];
}

/** The default option id for a "single" category (its first option). */
function defaultSingle(cat: Category): string | undefined {
  return cat.options[0]?.id;
}

// --------------------------------------------------------------------------
// Selected-id set (drives requires/conflicts evaluation)
// --------------------------------------------------------------------------

/**
 * Build the set of currently-selected option ids across all categories, plus
 * the SYNTHETIC group ids ("web-react", "db-sql", ...) that are satisfied.
 */
function buildSelectedSet(catalog: Catalog, selection: Selection): Set<string> {
  const selected = new Set<string>();
  for (const cat of catalog) {
    if (cat.kind === "single") {
      const v = singleValue(selection, cat.id);
      if (v) selected.add(v);
    } else if (cat.kind === "multi") {
      for (const id of multiValue(selection, cat.id)) selected.add(id);
    }
    // toggles never contribute option ids to constraints.
  }
  // Expand synthetic group satisfaction.
  for (const [synthetic, members] of Object.entries(SYNTHETIC_REQUIREMENTS)) {
    if (members.some((m) => selected.has(m))) selected.add(synthetic);
  }
  return selected;
}

// --------------------------------------------------------------------------
// Availability of a single option given the selected set
// --------------------------------------------------------------------------

/** A friendlier label for a (possibly synthetic) requirement id. */
function requirementLabel(reqId: string, index: CatalogIndex): string {
  switch (reqId) {
    case "web-react":
      return "a React web frontend";
    case "db-sql":
      return "a SQL database";
    case "db-sql-server":
      return "PostgreSQL or MySQL";
    default:
      return index.optById.get(reqId)?.name ?? reqId;
  }
}

/**
 * Curated, human reasons for the most common unavailability cases. Falls back
 * to a generic message built from the requirement/conflict label.
 */
function reasonFor(
  opt: Option,
  unmetRequire: string | null,
  conflictId: string | null,
  index: CatalogIndex,
): string {
  // Hand-tuned short reasons for the headline constraints.
  switch (opt.id) {
    case "orm-drizzle":
    case "orm-prisma":
      if (conflictId === "db-mongodb") return `${opt.name} is SQL-only — not for MongoDB`;
      if (unmetRequire === "db-sql") return "Requires a SQL database";
      break;
    case "orm-mongoose":
      return "Mongoose only works with MongoDB";
    case "ui-cronus":
    case "ui-shadcn":
    case "ui-heroui":
    case "ui-aceternity":
      return "Needs a React web frontend";
    case "backend-elysia":
      return "Elysia requires the Bun runtime";
    case "backend-express":
      if (conflictId === "runtime-cloudflare") return "Express can't run on Cloudflare Workers";
      return "Express requires the Node.js runtime";
    case "backend-fullstack-next":
      if (conflictId) return "Fullstack Next replaces a dedicated backend";
      return "Requires the Next.js web frontend";
    case "backend-fullstack-tanstack":
      if (conflictId) return "Fullstack TanStack replaces a dedicated backend";
      return "Requires the TanStack Start web frontend";
    case "deploy-cloudflare":
      return "Requires the Cloudflare Workers runtime";
    default:
      break;
  }
  // Convex conflicts surface from the OTHER side (db/orm options conflicting).
  if (conflictId === "backend-convex") return "Convex is an all-in-one backend";
  // Fullstack meta-frameworks reverse-conflict with dedicated backends.
  if (conflictId === "backend-fullstack-next" || conflictId === "backend-fullstack-tanstack") {
    return "A fullstack backend is selected";
  }
  if (conflictId) return `Conflicts with ${requirementLabel(conflictId, index)}`;
  if (unmetRequire) return `Requires ${requirementLabel(unmetRequire, index)}`;
  return "Unavailable in this stack";
}

/**
 * Evaluate availability of one option against the currently-selected set.
 * Returns `{ available, reason }`.
 */
function evaluateOption(
  opt: Option,
  selected: Set<string>,
  index: CatalogIndex,
): { available: boolean; reason?: string } {
  // conflicts (checked first — usually the most specific reason): if any id
  // this option declares a conflict with is selected, it's unavailable.
  for (const conf of opt.conflicts ?? []) {
    if (selected.has(conf)) {
      return { available: false, reason: reasonFor(opt, null, conf, index) };
    }
  }
  // Symmetric reverse conflicts: something selected declared a conflict with us.
  const reverse = index.conflictedBy.get(opt.id);
  if (reverse) {
    for (const other of reverse) {
      if (selected.has(other)) {
        return { available: false, reason: reasonFor(opt, null, other, index) };
      }
    }
  }
  // requires: every listed id (or synthetic group) must be satisfied.
  for (const req of opt.requires ?? []) {
    if (!selected.has(req)) {
      return { available: false, reason: reasonFor(opt, req, null, index) };
    }
  }
  return { available: true };
}

// --------------------------------------------------------------------------
// implies expansion
// --------------------------------------------------------------------------

/**
 * Apply `implies` once: for every selected option, auto-select its implied
 * options (single categories get their value set, multi categories get the id
 * appended). Returns a NEW selection; idempotent at fixpoint.
 */
function applyImplies(catalog: Catalog, selection: Selection, index: CatalogIndex): Selection {
  const next: Selection = { ...selection };
  const selected = buildSelectedSet(catalog, next);
  for (const id of selected) {
    const opt = index.optById.get(id);
    if (!opt?.implies) continue;
    for (const impliedId of opt.implies) {
      const owner = index.catOfOption.get(impliedId);
      if (!owner) continue;
      if (owner.kind === "single") {
        next[owner.id] = impliedId;
      } else if (owner.kind === "multi") {
        const arr = multiValue(next, owner.id);
        if (!arr.includes(impliedId)) next[owner.id] = [...arr, impliedId];
      }
    }
  }
  return next;
}

// --------------------------------------------------------------------------
// Normalization — make sure every category has a well-typed value
// --------------------------------------------------------------------------

function normalize(catalog: Catalog, selection: Selection): Selection {
  const next: Selection = { ...selection };
  for (const cat of catalog) {
    const raw = next[cat.id];
    if (cat.kind === "single") {
      if (typeof raw !== "string" || !cat.options.some((o) => o.id === raw)) {
        const def = defaultSingle(cat);
        if (def !== undefined) next[cat.id] = def;
        else delete next[cat.id];
      }
    } else if (cat.kind === "multi") {
      const valid = new Set(cat.options.map((o) => o.id));
      const arr = Array.isArray(raw)
        ? raw.filter((x) => typeof x === "string" && valid.has(x))
        : (MULTI_DEFAULTS[cat.id] ?? []);
      next[cat.id] = arr;
    } else {
      // toggle
      if (typeof raw !== "boolean") next[cat.id] = TOGGLE_DEFAULTS_ON.has(cat.id);
    }
  }
  return next;
}

// --------------------------------------------------------------------------
// Conflict priority — decides which side of a symmetric conflict gives way
// --------------------------------------------------------------------------

/**
 * Category priority: lower number = higher priority (gets to keep its value).
 * The just-`select()`ed category is pinned to the very top (-1) so the user's
 * explicit choice always wins; everything else uses catalog order, so a
 * higher-up category (e.g. Backend=Convex) forces lower ones (Database/ORM) to
 * give way rather than the reverse.
 */
function buildPriority(catalog: Catalog, pinnedCatId?: string): Map<string, number> {
  const prio = new Map<string, number>();
  for (let i = 0; i < catalog.length; i++) {
    const cat = catalog[i];
    if (cat) prio.set(cat.id, cat.id === pinnedCatId ? -1 : i);
  }
  return prio;
}

/**
 * Whether a SELECTED single option must give way in this cascade pass. It gives
 * way if (a) a hard `requires` is unsatisfied, or (b) it conflicts with another
 * selected option owned by a strictly HIGHER-priority category. A conflict with
 * a lower-priority category does NOT force it out — that other category yields.
 */
function mustGiveWay(
  opt: Option,
  ownerCatId: string,
  selected: Set<string>,
  index: CatalogIndex,
  prio: Map<string, number>,
): boolean {
  const probe = removeSelf(selected, opt.id);
  // (a) requires — always binding.
  for (const req of opt.requires ?? []) {
    if (!probe.has(req)) return true;
  }
  // (b) conflicts — binding only against higher-priority selected options.
  const myPrio = prio.get(ownerCatId) ?? Number.MAX_SAFE_INTEGER;
  const partners = new Set<string>(opt.conflicts ?? []);
  for (const p of index.conflictedBy.get(opt.id) ?? []) partners.add(p);
  for (const partner of partners) {
    if (!probe.has(partner)) continue;
    const partnerCat = index.catOfOption.get(partner);
    const partnerPrio = partnerCat
      ? (prio.get(partnerCat.id) ?? Number.MAX_SAFE_INTEGER)
      : Number.MAX_SAFE_INTEGER;
    // Strictly higher priority (smaller number) wins; on a tie, keep ours.
    if (partnerPrio < myPrio) return true;
  }
  return false;
}

// --------------------------------------------------------------------------
// One cascade pass — drop unavailable values, fall back to defaults
// --------------------------------------------------------------------------

/** Returns the corrected selection and whether anything changed. */
function cascadePass(
  catalog: Catalog,
  selection: Selection,
  index: CatalogIndex,
  prio: Map<string, number>,
): { next: Selection; changed: boolean } {
  const next: Selection = { ...selection };
  let changed = false;
  const selected = buildSelectedSet(catalog, next);

  for (const cat of catalog) {
    if (cat.kind === "single") {
      const current = singleValue(next, cat.id);
      const opt = current ? index.optById.get(current) : undefined;
      if (!opt) continue;
      if (mustGiveWay(opt, cat.id, selected, index, prio)) {
        // Fall back to the first AVAILABLE option (default-first ordering).
        const fallback = cat.options.find(
          (o) => evaluateOption(o, removeSelf(selected, current ?? ""), index).available,
        );
        const target = fallback?.id ?? defaultSingle(cat);
        if (target && target !== current) {
          next[cat.id] = target;
          changed = true;
        }
      }
    } else if (cat.kind === "multi") {
      const arr = multiValue(next, cat.id);
      const kept = arr.filter((id) => {
        const o = index.optById.get(id);
        if (!o) return false;
        // Multi options are independent — drop any that aren't available, but a
        // multi never out-prioritizes a single, so plain availability is right.
        return !mustGiveWay(o, cat.id, selected, index, prio);
      });
      if (kept.length !== arr.length) {
        next[cat.id] = kept;
        changed = true;
      }
    }
  }
  return { next, changed };
}

/** A copy of `selected` without `self` so an option doesn't conflict with itself. */
function removeSelf(selected: Set<string>, self: string): Set<string> {
  if (!selected.has(self)) return selected;
  const copy = new Set(selected);
  copy.delete(self);
  // Re-derive synthetics after removal so e.g. dropping the only React web
  // frontend also clears "web-react".
  return copy;
}

// --------------------------------------------------------------------------
// Public API
// --------------------------------------------------------------------------

/**
 * Resolve a raw selection into a fully consistent {@link Resolution}.
 * Deterministic: same (catalog, selection, pinnedCatId) → same output.
 *
 * `pinnedCatId` (optional) marks the category the user just changed so its
 * value wins every conflict during the cascade; omit it for a plain resolve
 * where catalog order decides which side of a conflict gives way.
 */
export function resolve(catalog: Catalog, selection: Selection, pinnedCatId?: string): Resolution {
  const index = indexCatalog(catalog);
  const prio = buildPriority(catalog, pinnedCatId);

  // 1. Normalize + apply implies + cascade to a fixpoint.
  let current = normalize(catalog, selection);
  for (let i = 0; i < CASCADE_CAP; i++) {
    const implied = normalize(catalog, applyImplies(catalog, current, index));
    const { next, changed } = cascadePass(catalog, implied, index, prio);
    if (!changed && shallowEqual(catalog, next, current)) {
      current = next;
      break;
    }
    current = next;
  }

  // 2. Build per-category resolved state against the final selected set.
  const finalSelected = buildSelectedSet(catalog, current);
  const categories: Record<string, ResolvedCategory> = {};
  const issues: ResolutionIssue[] = [];

  for (const cat of catalog) {
    const value = current[cat.id] as string | string[] | boolean;
    const options: ResolvedOption[] = cat.options.map((opt) => {
      const isSelected =
        cat.kind === "single"
          ? value === opt.id
          : cat.kind === "multi"
            ? Array.isArray(value) && value.includes(opt.id)
            : false;
      // For availability, an already-selected option shouldn't conflict with itself.
      const probe = isSelected ? removeSelf(finalSelected, opt.id) : finalSelected;
      const { available, reason } = evaluateOption(opt, probe, index);
      return { option: opt, available, reason, selected: isSelected };
    });

    categories[cat.id] = { category: cat, options, value };

    // Validity: a selected single/multi option that is NOT available is an error.
    for (const ro of options) {
      if (ro.selected && !ro.available) {
        issues.push({
          categoryId: cat.id,
          level: "error",
          message: `${cat.title}: ${ro.option.name} — ${ro.reason ?? "unavailable"}`,
        });
      }
    }

    // Advisory recommends.
    if (cat.kind === "single" || cat.kind === "multi") {
      for (const ro of options) {
        if (!ro.selected || !ro.option.recommends) continue;
        for (const rec of ro.option.recommends) {
          if (!finalSelected.has(rec)) {
            const recOpt = index.optById.get(rec);
            issues.push({
              categoryId: cat.id,
              level: "info",
              message: `${ro.option.name} works best with ${recOpt?.name ?? rec}`,
            });
          }
        }
      }
    }
  }

  const valid = issues.every((i) => i.level !== "error");
  return { selection: current, categories, valid, issues };
}

/** Shallow per-category equality for fixpoint detection. */
function shallowEqual(catalog: Catalog, a: Selection, b: Selection): boolean {
  for (const cat of catalog) {
    const av = a[cat.id];
    const bv = b[cat.id];
    if (Array.isArray(av) && Array.isArray(bv)) {
      if (av.length !== bv.length || av.some((x, i) => x !== bv[i])) return false;
    } else if (av !== bv) {
      return false;
    }
  }
  return true;
}

/**
 * Set a "single" category's value (or toggle a boolean), then re-resolve so
 * cascades/implies run. Returns the corrected, resolved selection.
 */
export function select(
  catalog: Catalog,
  selection: Selection,
  categoryId: string,
  optionId: string | boolean,
): Selection {
  const next: Selection = { ...selection, [categoryId]: optionId };
  // Pin the changed category so the user's explicit pick wins every conflict.
  return resolve(catalog, next, categoryId).selection;
}

/**
 * Toggle one option in a "multi" category on/off, then re-resolve.
 */
export function toggleMulti(
  catalog: Catalog,
  selection: Selection,
  categoryId: string,
  optionId: string,
): Selection {
  const arr = multiValue(selection, categoryId);
  const nextArr = arr.includes(optionId) ? arr.filter((x) => x !== optionId) : [...arr, optionId];
  const next: Selection = { ...selection, [categoryId]: nextArr };
  return resolve(catalog, next, categoryId).selection;
}

/**
 * The canonical default selection: every single category at its first option,
 * toggles per {@link TOGGLE_DEFAULTS_ON}, multis per {@link MULTI_DEFAULTS},
 * then product nudges (Next.js, Cronus UI, SQLite, Drizzle, Better-Auth, basic
 * DB setup). Catalog first-options stay the cascade fallback (e.g. `db-none`).
 * Always valid.
 */
export function defaultSelection(catalog: Catalog = defaultCatalog): Selection {
  const seed: Selection = {};
  for (const cat of catalog) {
    if (cat.kind === "single") {
      const def = defaultSingle(cat);
      if (def !== undefined) seed[cat.id] = def;
    } else if (cat.kind === "multi") {
      seed[cat.id] = MULTI_DEFAULTS[cat.id] ?? [];
    } else {
      seed[cat.id] = TOGGLE_DEFAULTS_ON.has(cat.id);
    }
  }
  // Product defaults: Next.js + Cronus UI + signed-in SQLite path.
  seed.web = "web-next";
  seed.ui = "ui-cronus";
  seed.database = "db-sqlite";
  seed.orm = "orm-drizzle";
  seed.auth = "auth-better-auth";
  seed.dbSetup = "dbsetup-basic";
  return resolve(catalog, seed).selection;
}

// --------------------------------------------------------------------------
// Deterministic randomizer
// --------------------------------------------------------------------------

/** A tiny seedable PRNG (mulberry32) so `randomize(seed)` is reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Produce a VALID random selection. Picks an available option for each single
 * category and a random subset for each multi, re-resolving after every pick so
 * later choices respect earlier ones. `seed` makes it deterministic for tests.
 */
export function randomize(catalog: Catalog, seed = 1): Selection {
  const rand = mulberry32(seed);
  const index = indexCatalog(catalog);
  let selection = defaultSelection(catalog);

  for (const cat of catalog) {
    if (cat.kind === "single") {
      const selected = removeSelf(
        buildSelectedSet(catalog, selection),
        singleValue(selection, cat.id) ?? "",
      );
      const avail = cat.options.filter((o) => evaluateOption(o, selected, index).available);
      if (avail.length > 0) {
        const pick = avail[Math.floor(rand() * avail.length)];
        if (pick) selection = select(catalog, selection, cat.id, pick.id);
      }
    } else if (cat.kind === "multi") {
      const chosen = cat.options.filter(() => rand() > 0.5).map((o) => o.id);
      selection = resolve(catalog, { ...selection, [cat.id]: chosen }).selection;
    } else {
      selection = { ...selection, [cat.id]: rand() > 0.5 };
    }
  }
  // Final resolve to guarantee validity.
  return resolve(catalog, selection).selection;
}
