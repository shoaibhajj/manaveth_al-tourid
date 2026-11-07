import { NextResponse, type NextRequest } from 'next/server'
import { LOCALE_HEADER } from '@/lib/i18n'

/**
 * Proxy Middleware (D1):
 * - Direct requests to /ar or /ar/... are permanently redirected (301) to the clean canonical path without /ar.
 * - Arabic is the default locale served at / and /*: internally rewritten to /ar/* so Next.js matches app/[locale] with params.locale = 'ar'.
 * - English is served at /en and /en/*: passed through to Next.js matching app/[locale] with params.locale = 'en'.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Permanent redirect (301) for direct /ar requests
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    const stripped = pathname.replace(/^\/ar(\/|$)/, '$1') || '/'
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = stripped
    return NextResponse.redirect(redirectUrl, 301)
  }

  // 2. English requests (/en or /en/*)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(LOCALE_HEADER, 'en')
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // 3. Arabic default routes (/, /catalog, /products, etc.)
  // Internally rewrite to /ar... so it executes app/[locale]/... with locale='ar'
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LOCALE_HEADER, 'ar')
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = `/ar${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
}
