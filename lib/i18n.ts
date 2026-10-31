export type Locale = 'ar' | 'en'
export type Localized = Record<Locale, string>
export type Direction = 'rtl' | 'ltr'

export const defaultLocale: Locale = 'ar'
export const locales: Locale[] = ['ar', 'en']
/** Request header set by proxy.ts so server code knows which language URL was requested. */
export const LOCALE_HEADER = 'x-locale'
/** Public pages that exist in both languages. Arabic lives at the root, English under /en. */
export const publicPaths = ['/', '/products', '/branches', '/blog'] as const

export const isLocale = (value: unknown): value is Locale => value === 'ar' || value === 'en'
export const directionOf = (locale: Locale): Direction => (locale === 'ar' ? 'rtl' : 'ltr')

/** Turns an internal path such as "/products" or "/#contact" into the URL for the given language. */
export function localePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path
  if (!path.startsWith('/') || path.startsWith('//')) return path
  if (path === '/en' || path.startsWith('/en/') || path.startsWith('/en#') || path.startsWith('/en?')) return path
  if (path === '/') return '/en'
  if (path.startsWith('/#') || path.startsWith('/?')) return `/en${path.slice(1)}`
  return `/en${path}`
}

/** Removes the /en prefix so a browser pathname can be compared with the language-neutral path. */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/en') return '/'
  return pathname.startsWith('/en/') ? pathname.slice(3) : pathname
}
