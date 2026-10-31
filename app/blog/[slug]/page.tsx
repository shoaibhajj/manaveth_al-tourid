import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { ShareActions } from '@/components/share-actions'
import { getLocale } from '@/lib/locale-server'
import { localePath } from '@/lib/i18n'
import { getArticleBySlug } from '@/lib/sanity/details'
import { imageUrl } from '@/lib/sanity/image'
import { articleDetailGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'

const textFor = (value: any, locale: 'ar' | 'en') => value?.[locale] || value?.ar || value?.en || ''

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, locale, base, draft] = await Promise.all([params, getLocale(), getSiteUrl(), draftMode()])
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article', robots: { index: false, follow: false } }
  const title = textFor(article.seo?.title, locale) || textFor(article.title, locale)
  const description = textFor(article.seo?.description, locale) || textFor(article.excerpt, locale)
  const path = `/blog/${slug}`
  const image = imageUrl(article.seo?.shareImage, 1200) || imageUrl(article.coverImage, 1200)
  return {
    title,
    description,
    alternates: { canonical: `${base}${localePath(path, locale)}`, languages: { ar: `${base}${path}`, en: `${base}/en${path}`, 'x-default': `${base}${path}` } },
    openGraph: { type: 'article', title, description, url: `${base}${localePath(path, locale)}`, images: image ? [image] : undefined, publishedTime: article.publishedAt },
    robots: draft.isEnabled ? { index: false, follow: false } : undefined,
  }
}

function renderBlock(block: any, index: number) {
  if (block?._type !== 'block') return null
  const children = (block.children ?? []).map((child: any, childIndex: number) => {
    let node: React.ReactNode = child.text ?? ''
    for (const mark of child.marks ?? []) {
      const definition = (block.markDefs ?? []).find((item: any) => item._key === mark)
      if (mark === 'strong') node = <strong key={childIndex}>{node}</strong>
      else if (mark === 'em') node = <em key={childIndex}>{node}</em>
      else if (definition?._type === 'link' && /^https?:\/\//.test(definition.href ?? '')) node = <a key={childIndex} href={definition.href} target="_blank" rel="noopener noreferrer" className="text-primary underline">{node}</a>
    }
    return <span key={child._key ?? childIndex}>{node}</span>
  })
  const key = block._key ?? index
  if (block.style === 'h2') return <h2 key={key} className="mt-8 text-2xl font-bold text-foreground">{children}</h2>
  if (block.style === 'h3') return <h3 key={key} className="mt-6 text-xl font-bold text-foreground">{children}</h3>
  if (block.style === 'blockquote') return <blockquote key={key} className="border-s-4 border-gold ps-4 italic">{children}</blockquote>
  return <p key={key}>{children}</p>
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale, base] = await Promise.all([params, getLocale(), getSiteUrl()])
  const article = await getArticleBySlug(slug)
  if (!article) return notFound()

  const title = textFor(article.title, locale)
  const excerpt = textFor(article.excerpt, locale)
  const body = locale === 'en' && article.bodyEn?.length ? article.bodyEn : article.body ?? []
  const image = imageUrl(article.coverImage, 1400)
  const shareUrl = `${base}${localePath(`/blog/${slug}`, locale)}`
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <JsonLd graph={articleDetailGraph(article, locale, base)} />
      <article className="flex flex-col gap-8">
        {image ? <img src={image} alt={title} className="aspect-[16/9] w-full rounded-3xl object-cover" /> : null}
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{locale === 'ar' ? 'مقالات' : 'Articles'}</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
          {excerpt ? <p className="text-xl leading-8 text-muted-foreground">{excerpt}</p> : null}
          {article.publishedAt ? <time dateTime={article.publishedAt} className="text-sm text-muted-foreground">{new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'long' }).format(new Date(article.publishedAt))}</time> : null}
        </header>
        <div className="flex flex-col gap-5 text-lg leading-8 text-muted-foreground">{body.map(renderBlock)}</div>
      </article>
      <div className="mt-10 border-t border-border pt-6"><ShareActions url={shareUrl} title={title} locale={locale} /></div>
    </main>
  )
}
