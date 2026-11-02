import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from '@/lib/locale-server'
import { localePath } from '@/lib/i18n'
import { getArticles } from '@/lib/sanity/articles'
import { imageUrl } from '@/lib/sanity/image'
import { getSiteUrl } from '@/lib/site-url'

export async function generateMetadata(): Promise<Metadata> {
  const [locale, base] = await Promise.all([getLocale(), getSiteUrl()])
  const title =
    locale === 'ar'
      ? 'المقالات والأدلة التجارية لتوريد الأغذية | منافذ التوريد'
      : 'Commercial Food Supply Articles & Guides | Mnaveeh ALTourid'
  const description =
    locale === 'ar'
      ? 'دليل وتوجيهات متخصصة في توريد المواد الغذائية للمطاعم والفنادق والجهات الكبرى في المملكة العربية السعودية.'
      : 'Specialized guides on commercial food procurement for restaurants, hotels, and large catering projects in Saudi Arabia.'
  const path = localePath('/blog', locale)
  return {
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: { ar: `${base}/blog`, en: `${base}/en/blog`, 'x-default': `${base}/blog` },
    },
    openGraph: { type: 'website', title, description, url: `${base}${path}` },
  }
}

export default async function BlogPage() {
  const [locale, articles] = await Promise.all([getLocale(), getArticles()])
  const heading = locale === 'ar' ? 'مقالات وأدلة التوريد' : 'Articles & Supply Guides'
  const subHeading =
    locale === 'ar'
      ? 'أدلة إرشادية وتحليلات متخصصة لملاك المطاعم ومديري المشتريات والضيافة في المملكة العربية السعودية.'
      : 'Specialized procurement guides and insights for restaurant owners and procurement managers in Saudi Arabia.'

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <header className="mb-12 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-gold">
          {locale === 'ar' ? 'المدونة التجارية' : 'Commercial Blog'}
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-forest md:text-5xl">{heading}</h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">{subHeading}</p>
      </header>

      {articles.length ? (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: any) => {
            const title = article.title?.[locale] || article.title?.ar || article.title?.en
            const excerpt = article.excerpt?.[locale] || article.excerpt?.ar || article.excerpt?.en
            const slug = article.slug?.current || article.slug
            const image = imageUrl(article.coverImage, 900)
            const dateStr = article.publishedAt
              ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium' }).format(
                  new Date(article.publishedAt),
                )
              : null

            return (
              <li
                key={article._id || slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:border-gold hover:shadow-xl hover:shadow-gold/10"
              >
                <Link href={localePath(`/blog/${slug}`, locale)} className="flex h-full flex-col">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-forest-deep/10">
                    {image ? (
                      <Image
                        src={image}
                        alt={title ?? ''}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-forest-deep text-gold font-bold">
                        {locale === 'ar' ? 'منافذ التوريد' : 'Mnaveeh'}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    {dateStr && <time className="mb-2 block text-xs font-medium text-gold">{dateStr}</time>}
                    <h2 className="text-xl font-extrabold leading-snug text-forest transition-colors group-hover:text-gold">
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {excerpt}
                      </p>
                    )}
                    <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-bold text-gold">
                      <span>{locale === 'ar' ? 'قراءة الدليل بالكامل' : 'Read full guide'}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true">
                        {locale === 'ar' ? '←' : '→'}
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground">
          {locale === 'ar' ? 'لا توجد مقالات منشورة حاليًا.' : 'No published articles yet.'}
        </p>
      )}
    </main>
  )
}
