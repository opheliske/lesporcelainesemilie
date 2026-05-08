const { execSync } = require('child_process');

let version = 'dev';
try {
  version = execSync('git describe --tags --always').toString().trim();
} catch {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_VERSION: version },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;
