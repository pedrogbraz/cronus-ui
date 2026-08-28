import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cronus-ui/ui", "@cronus-ui/theme", "@cronus-ui/tokens", "@cronus-ui/stack"],
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.aicronus.com" }],
        destination: "https://aicronus.com",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aicronus.com" }],
        destination: "https://aicronus.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
