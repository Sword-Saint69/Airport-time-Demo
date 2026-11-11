import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  devIndicators: false,
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
