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
  const title = locale === 'ar' ? 'المقالات | منافذ التوريد' : 'Articles | Mnaveeh ALTourid'
  const description = locale === 'ar'
    ? 'مقالات ومعلومات عن توريد الأغذية ومنتجات المطابخ التجارية.'
    : 'Articles and information about food supply and commercial kitchen products.'
  const path = localePath('/blog', locale)
  return {
    title,
    description,
    alternates: { canonical: `${base}${path}`, languages: { ar: `${base}/blog`, en: `${base}/en/blog`, 'x-default': `${base}/blog` } },
    openGraph: { type: 'website', title, description, url: `${base}${path}` },
  }
}

export default async function BlogPage() {
  const [locale, articles] = await Promise.all([getLocale(), getArticles()])
  const heading = locale === 'ar' ? 'المقالات' : 'Articles'
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <header className="mb-10"><h1 className="text-4xl font-extrabold text-foreground">{heading}</h1></header>
      {articles.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: any) => {
            const title = article.title?.[locale] || article.title?.ar || article.title?.en
            const excerpt = article.excerpt?.[locale] || article.excerpt?.ar || article.excerpt?.en
            const image = imageUrl(article.coverImage, 900)
            return (
              <li key={article._id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <Link href={localePath(`/blog/${article.slug}`, locale)} className="block h-full">
                  {image ? <Image src={image} alt={title ?? ''} width={900} height={520} className="aspect-[16/9] w-full object-cover" /> : null}
                  <div className="p-5"><h2 className="text-xl font-bold">{title}</h2>{excerpt ? <p className="mt-3 leading-7 text-muted-foreground">{excerpt}</p> : null}</div>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : <p className="text-muted-foreground">{locale === 'ar' ? 'لا توجد مقالات منشورة حاليًا.' : 'No published articles yet.'}</p>}
    </main>
  )
}
