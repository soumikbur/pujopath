/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGithubActions ? '/pujopath' : '';

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
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
    : (isGithubActions || process.env.STATIC_EXPORT === 'true')
    ? {
        output: 'export',
        trailingSlash: true,
        ...(basePath
          ? {
              basePath,
              assetPrefix: basePath,
            }
          : {}),
      }
    : {
        trailingSlash: false,
      }),
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
