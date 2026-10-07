import { gatewayRewrites } from "./deployment-config.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Keep the complete reference archive in Git without copying development
  // inputs into production server functions.
  outputFileTracingExcludes: {
    "/*": ["./bighaat_products/**/*", "./app/products/data/reference-overlay.json"],
  },
  async rewrites() {
    return { beforeFiles: gatewayRewrites(process.env), afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
