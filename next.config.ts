import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent pdfjs-dist from being bundled on server
      config.externals = config.externals || [];
      config.externals.push("pdfjs-dist");

      // Fix for canvas in Node.js
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: require.resolve("canvas"),
      };

      // Ignore worker files and other browser-specific modules in server builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
