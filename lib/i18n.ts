export type Locale = 'ar' | 'en'
export type Localized = Record<Locale, string>
export type Direction = 'rtl' | 'ltr'

export const defaultLocale: Locale = 'ar'
export const locales: Locale[] = ['ar', 'en']
/** Request header set by proxy.ts so server code knows which language URL was requested. */
export const LOCALE_HEADER = 'x-locale'
/** Public pages that exist in both languages. Arabic lives at the root, English under /en. */
export const publicPaths = [
  '/',
  '/catalog',
  '/products',
  '/meat-supply',
  '/meat-supply/restaurants',
  '/meat-supply/hotels',
  '/meat-supply/catering',
  '/meat-supply/riyadh',
  '/meat-supply/jeddah',
  '/certifications',
  '/contact',
  '/branches',
  '/blog',
  '/about',
] as const

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

/** Removes locale prefixes (/en, /ar) so a browser pathname can be compared with the language-neutral path. */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/en' || pathname === '/ar') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  if (pathname.startsWith('/ar/')) return pathname.slice(3)
  return pathname
}
