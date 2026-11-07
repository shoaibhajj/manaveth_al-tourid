/**
 * URL Redirects Resolver (E8):
 * Evaluates requested paths against configured redirects.
 * Preserves language locale prefixes (/en) seamlessly:
 * e.g., if /products/old-meat -> /products/premium-beef,
 * then /en/products/old-meat -> /en/products/premium-beef.
 */

export type RedirectRule = {
  source: string
  destination: string
  permanent: boolean
}

// Built-in initial redirect map (cached & updated with Sanity rules)
export const staticRedirects: RedirectRule[] = [
  { source: '/menu', destination: '/catalog', permanent: true },
  { source: '/products/beef', destination: '/products/frozen-meat', permanent: true },
]

export function resolveRedirect(
  pathname: string,
  extraRedirects: RedirectRule[] = []
): { destination: string; status: number } | null {
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const cleanPath = isEn ? (pathname.slice(3) || '/') : pathname

  const allRules = [...staticRedirects, ...extraRedirects]

  for (const rule of allRules) {
    if (rule.source === cleanPath) {
      const dest = isEn
        ? (rule.destination === '/' ? '/en' : `/en${rule.destination}`)
        : rule.destination
      return {
        destination: dest,
        status: rule.permanent ? 301 : 302,
      }
    }
  }

  return null
}
