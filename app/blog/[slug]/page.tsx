import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MessageCircle, Phone } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { ShareActions } from '@/components/share-actions'
import { getLocale } from '@/lib/locale-server'
import { localePath, type Locale } from '@/lib/i18n'
import { getArticleBySlug } from '@/lib/sanity/details'
import { imageUrl } from '@/lib/sanity/image'
import { articleDetailGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'
import { whatsappUrl, telUrl } from '@/lib/content/contact'
import { buildMetadata } from '@/lib/seo/build-metadata'

const textFor = (value: any, locale: 'ar' | 'en') => value?.[locale] || value?.ar || value?.en || ''

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()])
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article', robots: { index: false, follow: false } }

  const title = textFor(article.seo?.title, locale) || textFor(article.title, locale)
  const description = textFor(article.seo?.description, locale) || textFor(article.excerpt, locale)
  const path = `/blog/${slug}`
  const image = imageUrl(article.seo?.shareImage, 1200) || imageUrl(article.coverImage, 1200)

  return buildMetadata({
    path,
    locale,
    title,
    description,
    image,
    type: 'article',
    publishedTime: article.publishedAt,
    isIndexable: Boolean(article.visible !== false),
  })
}

// F6: Robust rich block and portable text renderer supporting internal links, lists, and images
function renderBlocks(blocks: any[], locale: Locale) {
  if (!blocks || !Array.isArray(blocks)) return null

  const elements: React.ReactNode[] = []
  let currentList: { type: 'bullet' | 'number'; items: React.ReactNode[] } | null = null

  const flushList = (keySuffix: number | string) => {
    if (!currentList) return
    const ListTag = currentList.type === 'number' ? 'ol' : 'ul'
    const listClass =
      currentList.type === 'number'
        ? 'my-6 list-decimal ps-6 space-y-2 text-forest-deep text-lg leading-relaxed'
        : 'my-6 list-disc ps-6 space-y-2 text-forest-deep text-lg leading-relaxed'

    elements.push(
      <ListTag key={`list-${keySuffix}`} className={listClass}>
        {currentList.items.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ListTag>
    )
    currentList = null
  }

  blocks.forEach((block, index) => {
    if (block._type === 'image') {
      flushList(index)
      const src = imageUrl(block, 1200)
      if (src) {
        elements.push(
          <figure key={block._key ?? index} className="my-8 overflow-hidden rounded-2xl border border-forest/10">
            <div className="relative aspect-[16/9] w-full max-h-[480px]">
              <Image
                src={src}
                alt={block.alt || ''}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>
            {block.caption && (
              <figcaption className="p-3 text-center text-xs text-muted-foreground bg-forest/5">
                {block.caption}
              </figcaption>
            )}
          </figure>
        )
      }
      return
    }

    if (block._type !== 'block') {
      flushList(index)
      return
    }

    const children = (block.children ?? []).map((child: any, childIndex: number) => {
      let node: React.ReactNode = child.text
      for (const mark of child.marks ?? []) {
        const definition = (block.markDefs ?? []).find((item: any) => item._key === mark)
        if (mark === 'strong') {
          node = <strong key={childIndex} className="font-bold text-forest">{node}</strong>
        } else if (mark === 'em') {
          node = <em key={childIndex}>{node}</em>
        } else if (definition?._type === 'link') {
          const href = String(definition.href || '')
          // Internal relative link
          if (href.startsWith('/')) {
            node = (
              <Link
                key={childIndex}
                href={localePath(href, locale)}
                className="text-gold font-bold underline hover:text-gold-light transition-colors"
              >
                {node}
              </Link>
            )
          } else if (/^https?:\/\//.test(href)) {
            // External link
            node = (
              <a
                key={childIndex}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold font-bold underline hover:text-gold-light transition-colors"
              >
                {node}
              </a>
            )
          }
        }
      }
      return <span key={child._key ?? childIndex}>{node}</span>
    })

    const key = block._key ?? index

    // Handle lists
    if (block.listItem === 'bullet' || block.listItem === 'number') {
      const listType = block.listItem === 'number' ? 'number' : 'bullet'
      if (!currentList || currentList.type !== listType) {
        flushList(index)
        currentList = { type: listType, items: [children] }
      } else {
        currentList.items.push(children)
      }
      return
    }

    flushList(index)

    if (block.style === 'h2') {
      elements.push(
        <h2 key={key} className="mt-10 mb-4 text-2xl font-extrabold text-forest md:text-3xl border-b border-gold/20 pb-3">
          {children}
        </h2>
      )
    } else if (block.style === 'h3') {
      elements.push(
        <h3 key={key} className="mt-8 mb-3 text-xl font-bold text-forest md:text-2xl">
          {children}
        </h3>
      )
    } else if (block.style === 'blockquote') {
      elements.push(
        <blockquote key={key} className="my-8 rounded-2xl border-s-4 border-gold bg-forest-deep/5 p-6 italic text-forest-deep text-lg leading-relaxed shadow-sm">
          {children}
        </blockquote>
      )
    } else {
      elements.push(
        <p key={key} className="my-4 text-lg leading-relaxed text-muted-foreground">
          {children}
        </p>
      )
    }
  })

  flushList('final')
  return elements
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
  const dateFormatted = article.publishedAt
    ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'long' }).format(
        new Date(article.publishedAt)
      )
    : null

  const whatsappMessage =
    locale === 'ar'
      ? `مرحباً منافذ التوريد، قرأت مقال "${title}" وأرغب في الاستفسار عن عروض أسعار التوريد للمطاعم والشركات.`
      : `Hello Mnaveth ALTourid, I read your article "${title}" and would like to inquire about commercial food supply pricing.`

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <JsonLd graph={articleDetailGraph(article, locale, base)} />

      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={localePath('/', locale)} className="hover:text-gold transition-colors">
          {locale === 'ar' ? 'الرئيسية' : 'Home'}
        </Link>
        <span>/</span>
        <Link href={localePath('/blog', locale)} className="hover:text-gold transition-colors">
          {locale === 'ar' ? 'المقالات' : 'Blog'}
        </Link>
        <span>/</span>
        <span className="truncate text-forest font-medium">{title}</span>
      </nav>

      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
              {locale === 'ar' ? 'سلاسل الإمداد الغذائي' : 'Food Supply Chain'}
            </span>
            {dateFormatted && <time dateTime={article.publishedAt} className="text-xs text-muted-foreground">{dateFormatted}</time>}
            {article.author && <span className="text-xs text-muted-foreground">· {article.author}</span>}
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-forest md:text-5xl">{title}</h1>

          {excerpt && (
            <p className="text-xl leading-relaxed text-muted-foreground/90 border-s-2 border-gold ps-4 my-2">
              {excerpt}
            </p>
          )}
        </header>

        {image && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-forest-deep/10 shadow-lg">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 800px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-4">{renderBlocks(body, locale)}</div>

        {/* Commercial Conversion Card */}
        <section className="my-10 rounded-3xl border border-gold/30 bg-forest-deep p-8 text-cream shadow-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">
            {locale === 'ar' ? 'شريك التوريد المعتمد للمطاعم' : 'Certified Food Supply Partner'}
          </span>
          <h3 className="mt-2 text-2xl font-extrabold text-cream md:text-3xl">
            {locale === 'ar'
              ? 'هل تبحث عن مورد أغذية موثوق لمطعمك أو مشروعك في السعودية؟'
              : 'Looking for a Reliable Food Supplier for Your Kitchen in Saudi Arabia?'}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/80 max-w-2xl">
            {locale === 'ar'
              ? 'تؤمن شركة منافذ التوريد للمطاعم والمطابخ المركزية والفنادق احتياجاتها الدورية من الأرز البسمتي الفاخر، اللحوم والكبدة المجمدة، الزيوت، والمعلبات بأسعار جملة تنافسية وعقود توريد سنوية تضمن استقرار الأسعار.'
              : 'Mnaveth ALTourid supplies commercial kitchens, cloud commissaries, and restaurants with basmati rice, frozen meats, oils, and canned staples under reliable annual agreements.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={whatsappUrl('+966509971699', whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3.5 font-bold text-forest-deep shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="size-5" />
              <span>{locale === 'ar' ? 'طلب عرض أسعار عبر واتساب' : 'Request Quotation on WhatsApp'}</span>
            </a>
            <a
              href={telUrl('+966509971699')}
              className="inline-flex items-center gap-2 rounded-xl border border-cream/30 px-6 py-3.5 font-bold text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <Phone className="size-5" />
              <span dir="ltr">+966 50 997 1699</span>
            </a>
          </div>
        </section>

        <footer className="border-t border-border pt-6">
          <ShareActions url={shareUrl} title={title} locale={locale} />
        </footer>
      </article>
    </main>
  )
}
