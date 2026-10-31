import { NextResponse, type NextRequest } from 'next/server'
import { LOCALE_HEADER } from '@/lib/i18n'

/**
 * English pages are served from /en and Arabic from the root. The /en prefix is stripped here so both
 * languages share the same routes; the requested language travels in a request header.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const stripped = pathname.slice(3) || '/'

    requestHeaders.set(LOCALE_HEADER, 'en')
    const url = request.nextUrl.clone()
    url.pathname = stripped
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }

  requestHeaders.set(LOCALE_HEADER, 'ar')
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
}
