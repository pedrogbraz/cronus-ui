import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cronus-ui/ui", "@cronus-ui/theme", "@cronus-ui/tokens"],
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.iacronus.com" }],
        destination: "https://iacronus.com",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.iacronus.com" }],
        destination: "https://iacronus.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
