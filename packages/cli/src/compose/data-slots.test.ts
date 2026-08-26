import ts from "typescript";
import { describe, expect, it } from "vitest";
import {
  DataSlotError,
  dataSlotMarkers,
  escapeJsxText,
  replaceBrandLiteral,
  replaceDataSlot,
} from "./data-slots.js";

const SOURCE = [
  "import x from 'y';",
  "",
  "/* @kronus:data navbar-links */",
  "const NAVBAR_LINKS = [",
  '  { label: "Old", href: "#old" },',
  "];",
  "/* @kronus:data-end */",
  "",
  "export function NavbarBlock() { return <span>Kronus</span>; }",
].join("\n");

describe("replaceDataSlot", () => {
  it("replaces only the delimited body and keeps the markers", () => {
    const out = replaceDataSlot(
      SOURCE,
      "navbar-links",
      'const NAVBAR_LINKS = [\n  { label: "New" },\n];',
    );
    expect(out).toContain(dataSlotMarkers("navbar-links").open);
    expect(out).toContain(dataSlotMarkers("navbar-links").close);
    expect(out).toContain('{ label: "New" }');
    expect(out).not.toContain('{ label: "Old", href: "#old" }');
    // Everything outside the markers is untouched.
    expect(out).toContain("import x from 'y';");
    expect(out).toContain("export function NavbarBlock()");
  });

  it("is idempotent-shaped: re-running finds the (still present) markers", () => {
    const once = replaceDataSlot(SOURCE, "navbar-links", "const NAVBAR_LINKS = [];");
    const twice = replaceDataSlot(once, "navbar-links", "const NAVBAR_LINKS = [];");
    expect(twice).toBe(once);
  });

  it("FAILS LOUD when the opening marker is absent", () => {
    expect(() => replaceDataSlot("no markers here", "navbar-links", "x")).toThrow(DataSlotError);
  });

  it("FAILS LOUD when the closing marker is absent", () => {
    const truncated = "/* @kronus:data navbar-links */\nconst X = [];";
    expect(() => replaceDataSlot(truncated, "navbar-links", "x")).toThrow(/closing marker/);
  });

  it("FAILS LOUD when the OPEN marker for the slot is duplicated (ambiguous region)", () => {
    const dup = `${SOURCE}\n${dataSlotMarkers("navbar-links").open}\n`;
    expect(() => replaceDataSlot(dup, "navbar-links", "x")).toThrow(/more than once/);
  });

  // Regression: the close marker is GENERIC and shared by every slot, so a block
  // with two data-slots has two `@kronus:data-end` markers. Rewriting the FIRST
  // slot must pair with its OWN (first-following) close marker and leave the
  // second slot's region intact — not throw "appears more than once".
  it("supports a block with two data-slots (pairs each open with its first-following close)", () => {
    const two = [
      "/* @kronus:data navbar-links */",
      "const NAVBAR_LINKS = [{ label: 'A' }];",
      "/* @kronus:data-end */",
      "/* @kronus:data footer-links */",
      "const FOOTER_LINKS = [{ label: 'B' }];",
      "/* @kronus:data-end */",
    ].join("\n");

    // Rewriting the FIRST slot must succeed and touch only its region.
    const afterNav = replaceDataSlot(two, "navbar-links", "const NAVBAR_LINKS = [{ label: 'X' }];");
    expect(afterNav).toContain("const NAVBAR_LINKS = [{ label: 'X' }];");
    expect(afterNav).not.toContain("const NAVBAR_LINKS = [{ label: 'A' }];");
    // The second slot's region is untouched (both its markers + body survive).
    expect(afterNav).toContain("/* @kronus:data footer-links */");
    expect(afterNav).toContain("const FOOTER_LINKS = [{ label: 'B' }];");

    // Rewriting the SECOND slot also works and only touches its own region.
    const afterFooter = replaceDataSlot(
      afterNav,
      "footer-links",
      "const FOOTER_LINKS = [{ label: 'Y' }];",
    );
    expect(afterFooter).toContain("const NAVBAR_LINKS = [{ label: 'X' }];");
    expect(afterFooter).toContain("const FOOTER_LINKS = [{ label: 'Y' }];");
    expect(afterFooter).not.toContain("const FOOTER_LINKS = [{ label: 'B' }];");

    // And it stays idempotent-shaped after both rewrites.
    const again = replaceDataSlot(
      afterFooter,
      "navbar-links",
      "const NAVBAR_LINKS = [{ label: 'X' }];",
    );
    expect(again).toBe(afterFooter);
  });
});

/**
 * Parse a chrome-block source with TypeScript's own TSX parser (the same
 * `ts.createSourceFile` path build-registry uses to extract block sources) and
 * return its syntactic parse diagnostics. Zero diagnostics ⇒ the emitted `.tsx`
 * is syntactically valid and would not break `tsc`/`next build`.
 */
function tsxParseDiagnostics(source: string): readonly ts.Diagnostic[] {
  const sourceFile = ts.createSourceFile(
    "chrome.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  // `parseDiagnostics` is where the scanner/parser records syntax errors. It is
  // not on the public typing but is the canonical way to detect parse failures.
  return (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics ?? [];
}

// A minimal but faithful chrome source: `Kronus` sits in JSX TEXT nodes exactly as
// in the shipped navbar/footer (the wordmark <span> and the copyright <p>), which
// is the context the brand is injected into.
const CHROME_SOURCE = [
  'import { Badge } from "@kronus-ui/ui";',
  "",
  "export function SiteNav() {",
  "  return (",
  "    <nav>",
  '      <span className="font-display text-lg font-semibold text-fg">Kronus</span>',
  "    </nav>",
  "  );",
  "}",
  "",
  "export function SiteFooter() {",
  "  return (",
  "    <footer>",
  '      <span className="font-display text-lg font-semibold text-fg">Kronus</span>',
  "      <p>© 2026 Kronus. All rights reserved.</p>",
  "    </footer>",
  "  );",
  "}",
].join("\n");

describe("escapeJsxText", () => {
  it("escapes the five JSX-text-hostile characters and is a no-op otherwise", () => {
    expect(escapeJsxText("Acme")).toBe("Acme");
    expect(escapeJsxText("A$B (x)")).toBe("A$B (x)");
    expect(escapeJsxText("A & B")).toBe("A &amp; B");
    expect(escapeJsxText("Tom > Jerry")).toBe("Tom &gt; Jerry");
    expect(escapeJsxText("Ben <Labs>")).toBe("Ben &lt;Labs&gt;");
    expect(escapeJsxText("Acme {Store}")).toBe("Acme &#123;Store&#125;");
  });

  it("escapes `&` first so introduced entities are never double-escaped", () => {
    // If `<`→`&lt;` ran before `&`→`&amp;`, the `&` in `&lt;` would become
    // `&amp;lt;`. Escaping `&` first guarantees exactly one entity per char.
    expect(escapeJsxText("<")).toBe("&lt;");
    expect(escapeJsxText("&lt;")).toBe("&amp;lt;");
  });
});

describe("replaceBrandLiteral", () => {
  it("replaces every occurrence of the literal", () => {
    const src = "<span>Kronus</span> ... © 2026 Kronus.";
    expect(replaceBrandLiteral(src, "Kronus", "Acme")).toBe("<span>Acme</span> ... © 2026 Acme.");
  });

  it("is a no-op escape for safe brands (byte-identical to a raw substitution)", () => {
    expect(replaceBrandLiteral("Kronus", "Kronus", "A$B (x)")).toBe("A$B (x)");
  });

  it("FAILS LOUD when the literal is absent", () => {
    expect(() => replaceBrandLiteral("no brand here", "Kronus", "Acme")).toThrow(DataSlotError);
  });

  // The point of the fix: the injected brand lands in a JSX TEXT context, so the
  // EMITTED source must be valid TSX regardless of the brand's characters. We
  // prove it by TS-parsing the rewritten chrome and asserting 0 parse diagnostics
  // — the SOURCE-side literal match alone never guaranteed this.
  it("baseline: a safe brand keeps the emitted chrome valid TSX", () => {
    const out = replaceBrandLiteral(CHROME_SOURCE, "Kronus", "Acme");
    expect(tsxParseDiagnostics(out)).toHaveLength(0);
    expect(out).toContain(">Acme<");
  });

  it.each([
    ["Tom > Jerry", "Tom &gt; Jerry"],
    ["Acme {Store}", "Acme &#123;Store&#125;"],
    ["Ben <Labs>", "Ben &lt;Labs&gt;"],
    ["A & B", "A &amp; B"],
  ])("emits valid TSX for a brand with JSX-hostile chars: %s", (brand, escaped) => {
    const out = replaceBrandLiteral(CHROME_SOURCE, "Kronus", brand);
    // The rewritten chrome parses with zero syntax errors (would break
    // tsc/next build if the brand were injected raw).
    expect(tsxParseDiagnostics(out)).toHaveLength(0);
    // The escaped brand actually landed in the JSX text nodes.
    expect(out).toContain(`>${escaped}<`);
    // And the raw, unescaped brand is NOT present in the wordmark text node.
    expect(out).not.toContain(`>${brand}<`);
  });

  it("proves the RAW (unescaped) brand would have produced invalid TSX", () => {
    // Guard the guard: injecting the raw brand into the same context yields parse
    // diagnostics, so the escaping above is doing load-bearing work.
    const raw = CHROME_SOURCE.split("Kronus").join("Tom > Jerry");
    expect(tsxParseDiagnostics(raw).length).toBeGreaterThan(0);
  });
});
