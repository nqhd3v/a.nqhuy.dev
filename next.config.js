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
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US', 'vi-VN'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en-US',
  }
}

module.exports = nextConfig
