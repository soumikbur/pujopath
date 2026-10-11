/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGithubActions ? '/pujopath' : '';

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
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
        ...(basePath
          ? {
              basePath,
              assetPrefix: basePath,
            }
          : {}),
      }),
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
