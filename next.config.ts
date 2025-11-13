import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // This tells Webpack to ignore the node-canvas package
    // which is not needed in the browser but is referenced by pdfjs-dist
    config.resolve.alias.canvas = false;

    return config;
  },
};

export default nextConfig;