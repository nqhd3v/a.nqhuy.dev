const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'components', '**', '*.scss'),
      path.join(__dirname, 'pages', '**', '*.scss'),
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
