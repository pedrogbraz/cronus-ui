/** Levenshtein edit distance between two strings (small inputs: registry names). */
export function levenshtein(a: string, b: string): number {
  // Single rolling row of the DP matrix (row 0 = distances against an empty `a`).
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prevDiag = row[0] ?? 0; // dist[i-1][0]
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j] ?? 0; // dist[i-1][j], not yet overwritten
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(above + 1, (row[j - 1] ?? 0) + 1, prevDiag + cost);
      prevDiag = above;
    }
  }
  return row[b.length] ?? 0;
}

/**
 * Find the closest registry name to a (presumably mistyped) `name`. Prefers a
 * substring match, then falls back to the nearest by edit distance, but only
 * when that distance is small enough to be a plausible typo. Returns undefined
 * when nothing is close enough to suggest.
 */
export function closestName(name: string, candidates: string[]): string | undefined {
  if (candidates.length === 0) return undefined;
  const needle = name.toLowerCase();

  const substring = candidates.find(
    (c) => c.toLowerCase().includes(needle) || needle.includes(c.toLowerCase()),
  );
  if (substring) return substring;

  let best: string | undefined;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const candidate of candidates) {
    const dist = levenshtein(needle, candidate.toLowerCase());
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  // Only suggest when it is a plausible typo (scaled to the name length).
  const threshold = Math.max(2, Math.floor(name.length / 2));
  return best !== undefined && bestDist <= threshold ? best : undefined;
}
