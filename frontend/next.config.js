/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_PUBLIC_BUILD_MODE === "capacitor" ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
