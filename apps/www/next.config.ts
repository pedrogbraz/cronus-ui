import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cronus-ui/ui", "@cronus-ui/theme", "@cronus-ui/tokens", "@cronus-ui/stack"],
};

export default nextConfig;
