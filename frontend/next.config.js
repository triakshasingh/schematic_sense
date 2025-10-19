/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // disables lint blocking builds
  },
};

module.exports = nextConfig;
