import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  outputFileTracingRoot: __dirname,
};

export default nextConfig;

// Lets the dev server expose the Cloudflare bindings locally. It is a
// no-op outside development.
initOpenNextCloudflareForDev();
