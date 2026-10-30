import 'server-only'
import { headers } from 'next/headers'

/**
 * Public origin of the site. An optional SITE_URL variable pins it; otherwise it follows the domain that
 * actually served the request, so canonical links never point at a domain that is not live.
 */
export async function getSiteUrl(): Promise<string> {
  const pinned = process.env.SITE_URL?.trim()
  if (pinned) return pinned.replace(/\/+$/, '')

  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? 'localhost:3000'
  const protocol = requestHeaders.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${protocol}://${host}`
}

/** Only the production deployment may be indexed; previews and local runs are kept out of search. */
export const isIndexableEnvironment = () => !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'
