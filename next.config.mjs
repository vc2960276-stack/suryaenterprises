import { gatewayRewrites } from "./deployment-config.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Keep the complete reference archive in Git without copying development
  // inputs into production server functions.
  outputFileTracingExcludes: {
    "/*": ["./bighaat_products/**/*", "./app/products/data/reference-overlay.json", "./public/assets/catalog/**/*"],
  },
  async headers() {
    return [{
      source: "/assets/catalog/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }];
  },
  async rewrites() {
    return { beforeFiles: gatewayRewrites(process.env), afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
