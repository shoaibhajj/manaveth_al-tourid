import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import { LocaleProvider } from '@/components/locale-provider'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { site } from '@/lib/content/site'
import { directionOf } from '@/lib/i18n'
import { getLocale } from '@/lib/locale-server'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: site.metadata.title[locale],
    description: site.metadata.description[locale],
    generator: 'v0.app',
    icons: {
      icon: '/images/logo.png',
      apple: '/images/logo.png',
    },
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
  const locale = await getLocale()

  return (
    <html lang={locale} dir={directionOf(locale)} className={tajawal.variable}>
      <body className="antialiased">
        <LocaleProvider initialLocale={locale}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </LocaleProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
