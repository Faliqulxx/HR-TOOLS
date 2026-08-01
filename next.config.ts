import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file uploads (up to 20MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
