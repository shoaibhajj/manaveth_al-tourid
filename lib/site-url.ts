import 'server-only'

/**
 * Public origin of the site. Reads from environment variables (NEXT_PUBLIC_SITE_URL or SITE_URL).
 * If neither is set, defaults to the official domain 'https://www.mnaveth-altourid.com'.
 * D1: Removed headers() so that public routes remain fully static and ISR cacheable.
 */
export async function getSiteUrl(): Promise<string> {
  const pinned = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim()
  if (pinned) return pinned.replace(/\/+$/, '')
  return 'https://www.mnaveth-altourid.com'
}

/** Only the production deployment may be indexed; previews and local runs are kept out of search. */
export const isIndexableEnvironment = () => !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'
