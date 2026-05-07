import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,   // serve local PNGs directly from /public
  },
};

export default nextConfig;
