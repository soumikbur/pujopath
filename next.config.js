/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  ...(isDev
    ? {
        async rewrites() {
          return [
            {
              source: '/index.html',
              destination: '/',
            },
          ];
        },
      }
    : {
        output: 'export',
        trailingSlash: true,
      }),
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
