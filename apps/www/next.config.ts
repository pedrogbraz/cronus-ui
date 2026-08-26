import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@kronus-ui/ui", "@kronus-ui/theme", "@kronus-ui/tokens", "@kronus-ui/stack"],
};

export default nextConfig;
