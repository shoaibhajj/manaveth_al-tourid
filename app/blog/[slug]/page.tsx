import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale } from '@/lib/locale-server'
import { getArticleBySlug } from '@/lib/sanity/details'
import { imageUrl } from '@/lib/sanity/image'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Blog' }
  return {
    title: article.seo?.title?.ar || article.title?.ar || article.title?.en,
    description: article.seo?.description?.ar || article.excerpt?.ar || article.excerpt?.en,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()])
  const article = await getArticleBySlug(slug)
  if (!article) notFound()
  const title = article.title?.[locale] || article.title?.en || article.title?.ar
  const excerpt = article.excerpt?.[locale] || article.excerpt?.en || article.excerpt?.ar
  const image = imageUrl(article.coverImage, 1400)
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <article className="flex flex-col gap-8">
        {image ? <img src={image} alt={title} className="aspect-[16/9] w-full rounded-3xl object-cover" /> : null}
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Blog</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
          {excerpt ? <p className="text-xl leading-8 text-muted-foreground">{excerpt}</p> : null}
        </header>
        <div className="flex flex-col gap-5 text-lg leading-8 text-muted-foreground">
          {(article.body ?? []).map((block: { _key?: string; _type?: string; children?: Array<{ text?: string }> }, index: number) => {
            const text = block.children?.map((child) => child.text ?? '').join('')
            return text ? <p key={block._key ?? index}>{text}</p> : null
          })}
        </div>
      </article>
    </main>
  )
}
