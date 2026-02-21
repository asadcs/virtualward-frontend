// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   allowedDevOrigins: ["172.28.176.1", "localhost", "127.0.0.1"],
//   experimental: {
//     allowedDevOrigins: ["172.28.176.1", "localhost", "127.0.0.1"],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // OPTIONAL: if you want to proxy API requests to Railway
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://virtualwardbackend-production.up.railway.app/:path*",
      },
    ];
  },
};

export default nextConfig;
