import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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

export default withNextIntl(nextConfig);
