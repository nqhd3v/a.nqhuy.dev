const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'components', '**', '*.scss'),
      path.join(__dirname, 'pages', '**', '*.scss'),
    ],
  },
  images: {
    domains: ["lh3.googleusercontent.com"]
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
