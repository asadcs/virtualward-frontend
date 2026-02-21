import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.28.176.1", "localhost", "127.0.0.1"],
  experimental: {
    allowedDevOrigins: ["172.28.176.1", "localhost", "127.0.0.1"],
  },
};

export default nextConfig;
