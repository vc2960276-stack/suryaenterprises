import { gatewayRewrites } from "./deployment-config.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return { beforeFiles: gatewayRewrites(process.env), afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
