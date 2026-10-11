/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

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
        ...(isGithubActions
          ? {
              basePath: '/pujopath',
              assetPrefix: '/pujopath',
            }
          : {}),
      }),
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
