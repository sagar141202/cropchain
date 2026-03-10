// frontend/next.config.js
// Static export mode is required for Capacitor to bundle the app into an APK.
// The Capacitor WebView loads index.html directly — no Node server inside the APK.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — generates /out directory that Capacitor picks up
  output: process.env.NEXT_PUBLIC_BUILD_MODE === "capacitor" ? "export" : undefined,

  // Required for static export — disable image optimisation (no server)
  images: {
    unoptimized: true,
  },

  // Trailing slash for consistent static file resolution in WebView
  trailingSlash: true,

  // No strict mode in production (avoids double-render in dev)
  reactStrictMode: false,

  // Reduce JS bundle size for mobile
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental: faster builds
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;