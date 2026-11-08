import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getArticles, resolveArticleSlug } from '@/lib/sanity/articles'
import { imageUrl } from '@/lib/sanity/image'
import { getSiteUrl } from '@/lib/site-url'
import { buildMetadata } from '@/lib/seo/build-metadata'

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
  const title =
    locale === 'ar'
      ? 'المقالات والأدلة التجارية لتوريد الأغذية | منافذ التوريد'
      : 'Commercial Food Supply Articles & Guides | Mnaveth ALTourid'
  const description =
    locale === 'ar'
      ? 'دليل وتوجيهات متخصصة في توريد المواد الغذائية للمطاعم والفنادق والجهات الكبرى في المملكة العربية السعودية.'
      : 'Specialized guides on commercial food procurement for restaurants, hotels, and large catering projects in Saudi Arabia.'

  return buildMetadata({
    path: '/blog',
    locale,
    title,
    description,
  })
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const [base, articles] = await Promise.all([getSiteUrl(), getArticles()])

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-extrabold text-forest md:text-5xl">
          {locale === 'ar' ? 'المقالات وسلاسل الإمداد' : 'Supply Chain Articles'}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {locale === 'ar'
            ? 'رؤى وأدلة مهنية من خبراء التوريد لمساعدة المطاعم والفنادق على إدارة تكاليف الإعاشة وجودة المكونات.'
            : 'Professional food supply insights to help hospitality managers optimize food costs and supply chains.'}
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const title = article.title?.[locale] || article.title?.ar || article.title?.en || ''
          const excerpt = article.excerpt?.[locale] || article.excerpt?.ar || article.excerpt?.en || ''
          const image = imageUrl(article.coverImage, 800) || `${base}/images/logo.png`
          const slug = resolveArticleSlug(article)
          if (!slug || slug === 'undefined') return null

          const href = localePath(`/blog/${slug}`, locale)

          return (
            <article
              key={article._id || slug}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <Link href={href} className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h2 className="text-xl font-bold leading-snug text-foreground group-hover:text-gold transition-colors">
                    <Link href={href}>{title}</Link>
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {excerpt}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>
                    {article.publishedAt
                      ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
                          dateStyle: 'medium',
                        }).format(new Date(article.publishedAt))
                      : null}
                  </span>
                  <Link
                    href={href}
                    className="font-bold text-forest group-hover:text-gold transition-colors inline-flex items-center gap-1"
                  >
                    <span>{locale === 'ar' ? 'اقرأ المزيد' : 'Read more'}</span>
                    <span dir="ltr">→</span>
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
