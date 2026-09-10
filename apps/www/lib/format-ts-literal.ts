/** Compact TypeScript-ish literal for docs Default columns. */
export function formatTsLiteral(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return `[${value.map((item) => formatTsLiteral(item)).join(", ")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, nested]) => nested !== undefined,
    );
    if (entries.length === 0) return "{}";
    return `{ ${entries.map(([key, nested]) => `${key}: ${formatTsLiteral(nested)}`).join(", ")} }`;
  }
  return JSON.stringify(value);
}
