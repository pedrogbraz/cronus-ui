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
  const lab = value.match(/^lab\(/);
  if (lab) {
    throw new Error(`cssColorToHex: lab() must be resolved to rgb first: ${input}`);
  }
  throw new Error(`cssColorToHex: unsupported color ${input}`);
}

/** Browser-only: force any CSS color (lab/oklch/rgb) through a canvas to rgb(). */
export function cssColorToRgbString(color: string, doc: Document): string {
  const canvas = doc.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return color;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  const r = data[0] ?? 0;
  const g = data[1] ?? 0;
  const b = data[2] ?? 0;
  const a = data[3] ?? 255;
  if (a === 0) return "rgba(0, 0, 0, 0)";
  if (a < 255) return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  return `rgb(${r}, ${g}, ${b})`;
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
