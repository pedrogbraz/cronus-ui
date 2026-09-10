import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cronus-ui/ui", "@cronus-ui/theme", "@cronus-ui/tokens", "@cronus-ui/stack"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
    ],
  },
  serverExternalPackages: ["cronus-ui-mcp", "@modelcontextprotocol/sdk"],
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
