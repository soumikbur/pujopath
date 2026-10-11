/**
 * Resolves public asset URLs taking into account Next.js basePath and hosting subpath (e.g. GitHub Pages /pujopath/).
 * Supports:
 * - Build-time NEXT_PUBLIC_BASE_PATH
 * - Client-side window.location pathname inspection (/pujopath fallback)
 * - Preserves absolute URLs (http://, https://, data:, blob:)
 */
export function getAssetPath(src: string): string {
  if (!src) return '';
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return src;
  }

  let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // In browser runtime, if NEXT_PUBLIC_BASE_PATH was not populated, detect /pujopath
  if (typeof window !== 'undefined' && !basePath) {
    const pathname = window.location.pathname;
    if (pathname === '/pujopath' || pathname.startsWith('/pujopath/')) {
      basePath = '/pujopath';
    }
  }

  const cleanSrc = src.startsWith('/') ? src : `/${src}`;

  // If already prefixed with basePath, avoid double prefixing
  if (basePath && (cleanSrc === basePath || cleanSrc.startsWith(`${basePath}/`))) {
    return cleanSrc;
  }

  return `${basePath}${cleanSrc}`;
}
