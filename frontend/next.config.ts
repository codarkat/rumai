import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // Enable standalone output for Docker deployments
  env: {
    GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    GEMINI_API_MODEL: process.env.NEXT_PUBLIC_GEMINI_API_MODEL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ["localhost"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    unoptimized: true, // Cho phép sử dụng hình ảnh không được tối ưu hóa (bao gồm base64)
  },
};

export default nextConfig;
