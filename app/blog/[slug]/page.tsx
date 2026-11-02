import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { MessageCircle, Phone, ArrowLeft, ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { ShareActions } from '@/components/share-actions'
import { getLocale } from '@/lib/locale-server'
import { localePath } from '@/lib/i18n'
import { getArticleBySlug } from '@/lib/sanity/details'
import { imageUrl } from '@/lib/sanity/image'
import { articleDetailGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'
import { whatsappUrl, telUrl } from '@/lib/content/contact'

const textFor = (value: any, locale: 'ar' | 'en') => value?.[locale] || value?.ar || value?.en || ''

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, locale, base, draft] = await Promise.all([params, getLocale(), getSiteUrl(), draftMode()])
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article', robots: { index: false, follow: false } }
  const title = textFor(article.seo?.title, locale) || textFor(article.title, locale)
  const description = textFor(article.seo?.description, locale) || textFor(article.excerpt, locale)
  const path = `/blog/${slug}`
  const image = imageUrl(article.seo?.shareImage, 1200) || imageUrl(article.coverImage, 1200) || `${base}/images/logo.png`
  return {
    title,
    description,
    alternates: {
      canonical: `${base}${localePath(path, locale)}`,
      languages: { ar: `${base}${path}`, en: `${base}/en${path}`, 'x-default': `${base}${path}` },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${base}${localePath(path, locale)}`,
      images: [image],
      publishedTime: article.publishedAt,
    },
    robots: draft.isEnabled ? { index: false, follow: false } : undefined,
  }
}

function renderBlock(block: any, index: number) {
  if (block._type !== 'block') return null
  const children = (block.children ?? []).map((child: any, childIndex: number) => {
    let node: React.ReactNode = child.text
    for (const mark of child.marks ?? []) {
      const definition = (block.markDefs ?? []).find((item: any) => item._key === mark)
      if (mark === 'strong') node = <strong key={childIndex} className="font-bold text-forest">{node}</strong>
      else if (mark === 'em') node = <em key={childIndex}>{node}</em>
      else if (definition?._type === 'link' && /^https?:\/\//.test(definition.href ?? ''))
        node = (
          <a
            key={childIndex}
            href={definition.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline hover:text-gold-light"
          >
            {node}
          </a>
        )
    }
    return <span key={child._key ?? childIndex}>{node}</span>
  })
  const key = block._key ?? index
  if (block.style === 'h2')
    return (
      <h2 key={key} className="mt-10 mb-4 text-2xl font-extrabold text-forest md:text-3xl border-b border-gold/20 pb-3">
        {children}
      </h2>
    )
  if (block.style === 'h3')
    return (
      <h3 key={key} className="mt-8 mb-3 text-xl font-bold text-forest md:text-2xl">
        {children}
      </h3>
    )
  if (block.style === 'blockquote')
    return (
      <blockquote key={key} className="my-8 rounded-2xl border-s-4 border-gold bg-forest-deep/5 p-6 italic text-forest-deep text-lg leading-relaxed shadow-sm">
        {children}
      </blockquote>
    )
  return <p key={key} className="my-4 text-lg leading-relaxed text-muted-foreground">{children}</p>
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
        new Date(article.publishedAt),
      )
    : null

  const whatsappMessage =
    locale === 'ar'
      ? `مرحباً منافذ التوريد، قرأت مقال "${title}" وأرغب في الاستفسار عن عروض أسعار التوريد للمطاعم والشركات.`
      : `Hello Mnaveeh, I read your article "${title}" and would like to inquire about commercial food supply pricing.`

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

        <div className="mt-4">{body.map(renderBlock)}</div>

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
              : 'Mnaveeh ALTourid supplies commercial kitchens, cloud commissaries, and restaurants with basmati rice, frozen meats, oils, and canned staples under reliable annual agreements.'}
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
