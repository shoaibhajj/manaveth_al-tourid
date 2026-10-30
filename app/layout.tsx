import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import { LocaleProvider } from '@/components/locale-provider'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { WhatsappWidget } from '@/components/whatsapp-widget'
import { directionOf } from '@/lib/i18n'
import { getLocale } from '@/lib/locale-server'
import { getContent } from '@/lib/sanity/get-content'
import { SanityRuntime } from '@/components/sanity-runtime'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const [locale, content] = await Promise.all([getLocale(), getContent()])
  const { home } = content.seo
  const icon = content.favicon ?? '/images/logo.png'
  return {
    title: home.title[locale],
    description: home.description[locale],
    generator: 'v0.app',
    icons: { icon, apple: icon },
    openGraph: home.shareImage ? { images: [home.shareImage] } : undefined,
  }
}

export const viewport: Viewport = {
  themeColor: '#0b2a22',
  colorScheme: 'light',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [locale, content] = await Promise.all([getLocale(), getContent()])

  return (
    <html lang={locale} dir={directionOf(locale)} className={tajawal.variable}>
      <body className="antialiased">
        <LocaleProvider initialLocale={locale} content={content}>
          <SiteHeader />
          {children}
          <SiteFooter />
          <WhatsappWidget />
        </LocaleProvider>
        <SanityRuntime />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
