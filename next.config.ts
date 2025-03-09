import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "storage.googleapis.com",
      "shyueiubgibnztmjcbqs.supabase.co",
      "storage.example.com",
    ],
  },
};

export default nextConfig;
