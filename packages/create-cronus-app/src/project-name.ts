const SCOPED = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

/** Validate that `name` is safe to use as an npm package name and a dir name. */
export function isValidProjectName(name: string): boolean {
  if (!name || name.length > 214) return false;
  if (name.trim() !== name) return false;
  // Reject path separators outright (a scoped name's single "/" is allowed by
  // the regex, but the literal dir is the unscoped trailing segment).
  if (name.includes("\\")) return false;
  return SCOPED.test(name);
}

/**
 * Derive the on-disk directory name from a (possibly scoped) package name:
 * "@acme/widget" → "widget", "my-app" → "my-app".
 */
export function dirNameFromProjectName(name: string): string {
  const slash = name.lastIndexOf("/");
  return slash === -1 ? name : name.slice(slash + 1);
}
