/**
 * Anchored replacement of a block's `@cronus:data <name>` data const and its brand
 * literal. Both mechanisms are marker/literal driven and FAIL LOUD when the anchor
 * is absent — the composer must never silently target a missing slot or brand
 * (the same guarantee `registry:check` enforces at build time, re-checked here
 * against the bytes actually on disk).
 *
 * The data-slot replacement operates on DATA CONSTS ONLY (never JSX): the region
 * between `/* @cronus:data X *\/` and the FIRST following `/* @cronus:data-end *\/`
 * is replaced wholesale with a freshly-serialized const, keeping the markers so a
 * re-compose stays idempotent. The brand replacement, by contrast, targets JSX
 * TEXT (the chrome wordmark/copyright), so its injected value is JSX-escaped —
 * source-side literal matching alone does NOT make the destination context safe.
 */

/** The exact marker pair for a named data-slot (mirrors build-registry's `dataSlotMarkers`). */
export function dataSlotMarkers(name: string): { open: string; close: string } {
  return { open: `/* @cronus:data ${name} */`, close: "/* @cronus:data-end */" };
}

/** Thrown when a required data-slot marker or brand literal is missing from a source. */
export class DataSlotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataSlotError";
  }
}

/**
 * Replace the body delimited by a named data-slot's markers with `replacement`
 * (the full const declaration, e.g. `const NAVBAR_LINKS = [...];`). The markers
 * themselves are preserved so the result stays re-composable. Throws
 * {@link DataSlotError} when the opening marker is absent or ambiguous (appears
 * more than once), or when no closing marker follows it — never a silent no-op.
 *
 * The close marker is GENERIC (`/* @cronus:data-end *\/`) and shared by every slot,
 * so a block with two data-slots carries two close markers. We therefore pair the
 * open marker with the FIRST close marker that follows it (its own region end),
 * rather than rejecting any source in which the shared close marker repeats. This
 * is deterministic and unambiguous because slot regions are flat siblings (never
 * nested), so the first `data-end` after an `@cronus:data <name>` open always
 * belongs to that same slot. The only ambiguity we still reject is a duplicated
 * OPEN marker for this named slot (we would not know which region to rewrite).
 *
 * `source` — the on-disk block copy; `name` — the slot id; `replacement` — the
 * new const source (no surrounding markers/newlines; they are re-added).
 */
export function replaceDataSlot(source: string, name: string, replacement: string): string {
  const { open, close } = dataSlotMarkers(name);

  const openAt = source.indexOf(open);
  if (openAt === -1) {
    throw new DataSlotError(`data-slot "${name}": opening marker \`${open}\` not found in source`);
  }
  if (source.indexOf(open, openAt + open.length) !== -1) {
    throw new DataSlotError(
      `data-slot "${name}": opening marker \`${open}\` appears more than once`,
    );
  }
  // Pair with the FIRST close marker after this slot's open marker — that is this
  // slot's region end. Other slots' close markers appearing later in the source
  // are irrelevant (they close their own regions), so we do NOT reject them.
  const closeAt = source.indexOf(close, openAt + open.length);
  if (closeAt === -1) {
    throw new DataSlotError(
      `data-slot "${name}": closing marker \`${close}\` not found after the opening marker`,
    );
  }

  const before = source.slice(0, openAt);
  const after = source.slice(closeAt + close.length);
  return `${before}${open}\n${replacement}\n${close}${after}`;
}

/**
 * JSX-escape a value destined for a JSX **text** context (element children). The
 * chrome brand literal (`Cronus`) lives inside JSX text nodes — the navbar/footer
 * wordmark `<span>…</span>` and the footer copyright `<p>…</p>` — so a raw
 * substitution of a brand containing `<`, `>`, `{` or `}` would emit invalid TSX
 * (`<`/`>` are token starts) or an undefined JSX expression container (`{Store}`),
 * breaking `next build`. Escaping here makes ANY brand safe regardless of source,
 * which is stronger than validate-and-reject. `&` is escaped first so we never
 * double-escape the entities we introduce. A brand with none of these characters
 * is returned unchanged (no-op for safe brands like `Acme`).
 */
export function escapeJsxText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

/**
 * Replace EVERY occurrence of a brand `literal` in the source with `brand`. Used
 * for the chrome wordmark/copyright (`Cronus` → the app brand), which sit in JSX
 * text nodes. Throws {@link DataSlotError} when the literal is absent so a
 * renamed/removed anchor fails loud instead of leaving the placeholder brand.
 *
 * The `literal` MATCH is literal (not regex), so special characters in the search
 * literal do not misbehave. The injected `brand`, however, lands in a JSX text
 * context, so it is JSX-escaped ({@link escapeJsxText}) before substitution —
 * otherwise a brand like `Tom > Jerry`, `Ben <Labs>`, `Acme {Store}` or `A & B`
 * would emit invalid TSX / an undefined JSX expression and break `next build`.
 * Escaping is a no-op for brands with no `& < > { }`, so safe brands are
 * byte-identical to a raw substitution.
 */
export function replaceBrandLiteral(source: string, literal: string, brand: string): string {
  if (!source.includes(literal)) {
    throw new DataSlotError(`brand literal "${literal}" not found in source`);
  }
  return source.split(literal).join(escapeJsxText(brand));
}
