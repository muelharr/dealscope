import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/compare",
        destination: "/compare",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/compare/session",
        destination: "http://localhost:4000/api/v1/compare",
      },
      {
        source: "/api/compare",
        destination: "http://localhost:4000/api/v1/compare",
      },
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:4000/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
