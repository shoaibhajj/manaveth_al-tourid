import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { ProductDetailActions } from '@/components/product-detail-actions'
import { ShareActions } from '@/components/share-actions'
import { getLocale } from '@/lib/locale-server'
import { localePath } from '@/lib/i18n'
import { getProductBySlug } from '@/lib/sanity/details'
import { imageUrl } from '@/lib/sanity/image'
import { getSiteUrl } from '@/lib/site-url'

const textFor = (value: any, locale: 'ar' | 'en') => value?.[locale] || value?.ar || value?.en || ''
const labelFor = (locale: 'ar' | 'en', ar: string, en: string) => locale === 'ar' ? ar : en

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, locale, base, draft] = await Promise.all([params, getLocale(), getSiteUrl(), draftMode()])
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product', robots: { index: false, follow: false } }
  const title = textFor(product.seo?.title, locale) || textFor(product.name, locale)
  const description = textFor(product.seo?.description, locale) || textFor(product.longDescription, locale) || textFor(product.description, locale)
  const path = `/products/${slug}`
  const image = imageUrl(product.seo?.shareImage, 1200) || imageUrl(product.image, 1200)
  const keywords = (product.targetPhrases ?? []).map((item: any) => textFor(item, locale)).filter(Boolean)
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: `${base}${localePath(path, locale)}`, languages: { ar: `${base}${path}`, en: `${base}/en${path}`, 'x-default': `${base}${path}` } },
    openGraph: { type: 'website', title, description, url: `${base}${localePath(path, locale)}`, images: image ? [image] : undefined },
    robots: draft.isEnabled ? { index: false, follow: false } : undefined,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale, base] = await Promise.all([params, getLocale(), getSiteUrl()])
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  const title = textFor(product.name, locale)
  const description = textFor(product.description, locale)
  const longDescription = textFor(product.longDescription, locale)
  const image = imageUrl(product.image, 1400)
  const productPath = `/products/${slug}`
  const shareUrl = `${base}${localePath(productPath, locale)}`
  const sections = [
    ['origin', labelFor(locale, 'بلد المنشأ', 'Country of origin')],
    ['packaging', labelFor(locale, 'التعبئة والأحجام', 'Packaging and sizes')],
    ['storage', labelFor(locale, 'تعليمات التخزين', 'Storage instructions')],
    ['usage', labelFor(locale, 'الاستخدامات', 'Suggested uses')],
  ] as const
  const showPrice = product.showPrice !== false
  const tierRows = (product.priceTiers ?? []).filter((tier: any) => typeof tier.price === 'number')
  const singlePrice = showPrice && typeof product.price?.amount === 'number' ? product.price : null
  const amountText = (amount: number) => new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(amount)

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {image ? <img src={image} alt={title} className="aspect-[4/3] w-full rounded-3xl object-cover" /> : null}
        <article className="flex flex-col gap-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{labelFor(locale, 'منتج', 'Product')}</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
          {description ? <p className="text-lg leading-8 text-muted-foreground">{description}</p> : null}
          {longDescription ? <p className="leading-8 text-muted-foreground">{longDescription}</p> : null}
          {product.origin ? <p><strong>{labelFor(locale, 'بلد المنشأ:', 'Country of origin:')}</strong> {textFor(product.origin, locale)}</p> : null}
          {product.packaging ? <p><strong>{labelFor(locale, 'التعبئة:', 'Packaging:')}</strong> {textFor(product.packaging, locale)}</p> : null}
          {showPrice && tierRows.length ? (
            <section className="rounded-2xl bg-secondary/70 p-5">
              <h2 className="mb-3 font-bold">{labelFor(locale, 'السعر حسب الكمية', 'Price by quantity')}</h2>
              <ul className="space-y-2">{tierRows.map((tier: any, index: number) => <li key={tier._key ?? index} className="flex justify-between gap-4"><span>{tier.label?.[locale] || (tier.minQuantity ? `${tier.minQuantity}+` : '')} {textFor(tier.unit, locale)}</span><strong>{amountText(tier.price)} {labelFor(locale, 'ر.س', 'SAR')}</strong></li>)}</ul>
            </section>
          ) : singlePrice ? <p className="rounded-xl bg-secondary/70 p-4 font-bold">{labelFor(locale, 'السعر:', 'Price:')} {amountText(singlePrice.amount)} {textFor(singlePrice.unit, locale)}</p> : (
            <p className="rounded-xl bg-secondary/70 p-4">{labelFor(locale, 'السعر عند الطلب', 'Price on request')}</p>
          )}
          <ProductDetailActions productName={product.name} />
        </article>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {sections.map(([key, label]) => {
          const value = textFor(product[key], locale)
          return value ? <section key={key} className="rounded-2xl border border-border p-5"><h2 className="mb-2 font-bold">{label}</h2><p className="leading-7 text-muted-foreground">{value}</p></section> : null
        })}
      </div>
      <div className="mt-10 border-t border-border pt-6"><ShareActions url={shareUrl} title={title} locale={locale} /></div>
    </main>
  )
}
