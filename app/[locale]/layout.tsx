import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Tajawal } from 'next/font/google'
import { Suspense } from 'react'
import { LocaleProvider } from '@/components/locale-provider'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { WhatsappWidget } from '@/components/whatsapp-widget'
import { defaultLocale, directionOf, isLocale, type Locale } from '@/lib/i18n'
import { getContent } from '@/lib/sanity/get-content'
import { SanityRuntime } from '@/components/sanity-runtime'
import { JsonLd } from '@/components/json-ld'
import { organizationGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'
import '../globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
})

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const [content, base] = await Promise.all([getContent(), getSiteUrl()])
  const { home } = content.seo
  const icon = content.favicon ?? '/images/logo.png'
  return {
    metadataBase: new URL(base),
    title: home.title[locale],
    description: home.description[locale],
    icons: { icon, apple: icon },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : undefined,
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#0b2a22',
  colorScheme: 'light',
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const [content, base] = await Promise.all([getContent(), getSiteUrl()])

  return (
    <html lang={locale} dir={directionOf(locale)} className={tajawal.variable}>
      <body className="antialiased">
        <LocaleProvider locale={locale} content={content}>
          <JsonLd graph={organizationGraph(content, locale, base)} />
          <SiteHeader />
          {children}
          <SiteFooter />
          <WhatsappWidget />
        </LocaleProvider>
        <Suspense fallback={null}>
          <SanityRuntime />
        </Suspense>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "z81tkal3oi");
          `}
        </Script>
      </body>
    </html>
  )
}
