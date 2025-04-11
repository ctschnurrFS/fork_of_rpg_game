// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/lib/db/drizzle": path.resolve(__dirname, "lib/db/drizzle.ts"),
      "@/lib/db": path.resolve(__dirname, "lib/db"),
    };
    return config;
  },
};

module.exports = nextConfig;


