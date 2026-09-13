/**
 * Serialize a computed CSS color to a canonical hex string.
 * Chromium `getComputedStyle` yields `rgb()` / `rgba()` (oklch is already resolved).
 *
 * - `rgba(0,0,0,0)` → `"transparent"`
 * - opaque rgb → `#rrggbb`
 * - partial alpha → `#rrggbbaa`
 */
export function cssColorToHex(input: string): string {
  const value = input.trim().toLowerCase();
  if (value === "transparent") return "transparent";
  if (value.startsWith("#")) {
    if (value.length === 4) {
      const r = value[1];
      const g = value[2];
      const b = value[3];
      if (r && g && b) return `#${r}${r}${g}${g}${b}${b}`;
    }
    return value;
  }
  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/,
  );
  if (rgb) {
    const r = clampByte(Number(rgb[1]));
    const g = clampByte(Number(rgb[2]));
    const b = clampByte(Number(rgb[3]));
    const aRaw = rgb[4];
    const alpha = aRaw === undefined ? 1 : parseAlpha(aRaw);
    if (alpha === 0) return "transparent";
    const hex = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
    if (alpha >= 1) return hex;
    return `${hex}${hex2(Math.round(alpha * 255))}`;
  }
  const oklch = value.match(/^oklch\(/);
  if (oklch) {
    throw new Error(`cssColorToHex: oklch must be resolved by the browser first: ${input}`);
  }
  throw new Error(`cssColorToHex: unsupported color ${input}`);
}

function parseAlpha(raw: string): number {
  if (raw.endsWith("%")) return Number(raw.slice(0, -1)) / 100;
  return Number(raw);
}

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function hex2(n: number): string {
  return n.toString(16).padStart(2, "0");
}
