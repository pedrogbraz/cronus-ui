/**
 * @kronus-ui/ui ships ESM with its `"use client"` boundaries already in place,
 * so no `transpilePackages` is needed when it's installed (the normal case).
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
