/**
 * Kernel family registry, read from `cronus-kernel/src/cronus_ui_widgets.rs`.
 *
 * `PORTED_FAMILIES` is a `const fn` over `FAMILY_TABLE` since the kernel
 * registry refactor, so the family list must come from the table entries:
 *   dedicated!("accordion", cronus_ui_accordion),
 *   ("button", Renderer::Dedicated("button_from", button_from)),
 *   ("meteors", Renderer::Stub("fx", fx)),
 * Older kernels with a literal `PORTED_FAMILIES = &["a", ...]` still parse.
 */

export interface KernelFamily {
  family: string;
  renderer: "dedicated" | "stub";
  /** Catalog kind of a stub renderer (`fx`, `chart`, …); null for dedicated. */
  stubKind: string | null;
}

function stripLineComments(source: string): string {
  return source.replace(/\/\/[^\n]*/g, "");
}

export function parseKernelFamilies(source: string): KernelFamily[] | null {
  const code = stripLineComments(source);
  const table = code.match(/pub const FAMILY_TABLE:[^=]*=\s*&\[([\s\S]*?)\n\];/);
  if (table?.[1]) {
    const out: KernelFamily[] = [];
    const entry =
      /dedicated!\(\s*"([^"]+)"|\(\s*"([^"]+)"\s*,\s*Renderer::(Dedicated|Stub)\(\s*"([^"]*)"/g;
    for (const m of table[1].matchAll(entry)) {
      if (m[1]) {
        out.push({ family: m[1], renderer: "dedicated", stubKind: null });
      } else if (m[2]) {
        const stub = m[3] === "Stub";
        out.push({
          family: m[2],
          renderer: stub ? "stub" : "dedicated",
          stubKind: stub ? (m[4] ?? null) : null,
        });
      }
    }
    if (out.length > 0) return out;
  }
  const literal = code.match(/pub const PORTED_FAMILIES: &\[&str\] = &\[([\s\S]*?)\];/);
  if (!literal?.[1]) return null;
  return [...literal[1].matchAll(/"([^"]+)"/g)]
    .map((m) => m[1] ?? "")
    .filter(Boolean)
    .map((family) => ({ family, renderer: "dedicated" as const, stubKind: null }));
}

export function portedFamilyNames(families: KernelFamily[]): string[] {
  return families.filter((f) => f.renderer === "dedicated").map((f) => f.family);
}
