import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack from bundling native/CJS modules
  serverExternalPackages: ["pdf-parse", "mammoth"],

  // Allow large file uploads (up to 20MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
