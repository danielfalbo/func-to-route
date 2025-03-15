import type { NextConfig } from "next";

const config: NextConfig = {
  // Enable experimental features for better TypeScript support
  experimental: {
    // This is needed for our symlinked package to work properly
    externalDir: true,
    // Recommended for better type safety
    typedRoutes: true,
  },
};

export default config;
