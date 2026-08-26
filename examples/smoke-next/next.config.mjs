import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Minimal Next.js config for the external-consumer smoke fixture.
 *
 * @cronus-ui/ui ships ESM with `"use client"` boundaries already in place, so no
 * `transpilePackages` is needed when the package is installed (not symlinked
 * from the workspace) — which is exactly how the smoke runner installs it
 * (via a packed tarball into node_modules).
 *
 * `outputFileTracingRoot` pins the root to THIS fixture so Next doesn't infer
 * the surrounding monorepo (it would otherwise warn about multiple lockfiles).
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
};

export default nextConfig;
