import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "premiumess.test",
      },
      {
        protocol: "https",
        hostname: "perfumes.janamithrasociety.com",
      },
    ],
    qualities: [25, 50, 75, 80, 100],
  },
};

export default nextConfig;