import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { ProductDetailActions } from '@/components/product-detail-actions'
import { ShareActions } from '@/components/share-actions'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getProductBySlug } from '@/lib/sanity/details'
import { getDetailSlugs } from '@/lib/sanity/articles'
import { imageUrl } from '@/lib/sanity/image'
import { productDetailGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { buildProductSeo } from '@/lib/seo/engine'

const textFor = (value: any, locale: 'ar' | 'en') => value?.[locale] || value?.ar || value?.en || ''
const labelFor = (locale: 'ar' | 'en', ar: string, en: string) => (locale === 'ar' ? ar : en)

export const dynamicParams = true

export async function generateStaticParams() {
  const details = await getDetailSlugs()
  const products = Array.isArray(details?.products) ? details.products : []
  const params: { locale: string; slug: string }[] = []
  for (const p of products) {
    if (p?.slug) {
      params.push({ locale: 'ar', slug: p.slug })
      params.push({ locale: 'en', slug: p.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const [product, base] = await Promise.all([getProductBySlug(slug), getSiteUrl()])
  if (!product) return { title: 'Product', robots: { index: false, follow: false } }

  const seo = buildProductSeo(product as any, locale, {
    baseUrl: base,
    brandName: { ar: 'منافذ التوريد', en: 'Mnaveth ALTourid' },
  })

  const image =
    imageUrl(product.seo?.shareImage, 1200) ||
    imageUrl(product.image, 1200) ||
    (typeof product.image === 'string' ? product.image : undefined)
  const keywords = (product.targetPhrases ?? []).map((item: any) => textFor(item, locale)).filter(Boolean)

  return buildMetadata({
    path: `/products/${slug}`,
    locale,
    title: seo.title,
    description: seo.description,
    image,
    keywords,
    isIndexable: seo.robots.index,
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug, locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const [product, base] = await Promise.all([getProductBySlug(slug), getSiteUrl()])
  if (!product) return notFound()

  const seo = buildProductSeo(product as any, locale, {
    baseUrl: base,
    brandName: { ar: 'منافذ التوريد', en: 'Mnaveth ALTourid' },
  })

  const title = seo.h1
  const description = textFor(product.description, locale)
  const longDescription = textFor(product.longDescription, locale)
  const image =
    imageUrl(product.image, 1400) ||
    (typeof product.image === 'string' ? product.image : undefined) ||
    product.image?.asset?.url ||
    undefined
  const productPath = `/products/${slug}`
  const shareUrl = `${base}${localePath(productPath, locale)}`

  const showPrice = product.showPrice !== false
  const tierRows = (product.priceTiers ?? []).filter((tier: any) => typeof tier.price === 'number')
  const singlePrice = showPrice && typeof product.price?.amount === 'number' ? product.price : null
  const amountText = (amount: number) => new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(amount)

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <JsonLd graph={productDetailGraph(product, locale, base)} />

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {seo.breadcrumbs.map((b, idx) => (
            <li key={b.url} className="flex items-center gap-2">
              {idx > 0 && <span className="text-muted-foreground/40">/</span>}
              {idx === seo.breadcrumbs.length - 1 ? (
                <span className="font-semibold text-foreground">{b.name}</span>
              ) : (
                <Link href={b.url} className="hover:text-gold transition-colors">
                  {b.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {image ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-forest/5 shadow-md">
            <Image
              src={image}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] w-full rounded-3xl bg-forest/5 border border-dashed border-forest/20 flex flex-col items-center justify-center text-forest/50 p-6 text-center">
            <span className="text-sm font-semibold">
              {labelFor(locale, 'صورة المنتج قيد الاعتماد', 'Product image pending verification')}
            </span>
          </div>
        )}
        <article className="flex flex-col gap-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {labelFor(locale, 'منتج معتمد', 'Certified Product')}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
          {description ? <p className="text-lg leading-8 text-muted-foreground">{description}</p> : null}
          {longDescription ? <p className="leading-8 text-muted-foreground">{longDescription}</p> : null}

          {showPrice && tierRows.length ? (
            <section className="rounded-2xl bg-secondary/70 p-5">
              <h2 className="mb-3 font-bold">{labelFor(locale, 'السعر حسب الكمية', 'Price by quantity')}</h2>
              <ul className="space-y-2">
                {tierRows.map((tier: any, index: number) => (
                  <li key={tier._key ?? index} className="flex justify-between gap-4">
                    <span>
                      {tier.label?.[locale] || (tier.minQuantity ? `${tier.minQuantity}+` : '')} {textFor(tier.unit, locale)}
                    </span>
                    <strong>
                      {amountText(tier.price)} {labelFor(locale, 'ر.س', 'SAR')}
                    </strong>
                  </li>
                ))}
              </ul>
            </section>
          ) : singlePrice ? (
            <p className="rounded-xl bg-secondary/70 p-4 font-bold">
              {labelFor(locale, 'السعر:', 'Price:')} {amountText(singlePrice.amount)} {textFor(singlePrice.unit, locale)}
            </p>
          ) : (
            <p className="rounded-xl bg-secondary/70 p-4">{labelFor(locale, 'السعر عند الطلب - تواصل للتسعير الفوري', 'Price on request - inquire for instant quote')}</p>
          )}

          <ProductDetailActions productName={product.name} />
        </article>
      </div>

      {/* Specifications Table */}
      {seo.specRows.length > 0 && (
        <section className="mt-14 rounded-2xl border border-border p-6 bg-card/60">
          <h2 className="text-xl font-bold mb-4 text-forest">
            {labelFor(locale, 'المواصفات الفنية وبيانات التوريد', 'Specifications & Supply Details')}
          </h2>
          <div className="grid divide-y divide-border">
            {seo.specRows.map((row, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row justify-between py-3 gap-2">
                <span className="font-semibold text-muted-foreground text-sm">{row.label}</span>
                <span className="font-medium text-foreground text-sm">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Auto FAQs Section */}
      {seo.autoFaqs.length > 0 && (
        <section className="mt-10 rounded-2xl border border-border p-6 bg-secondary/30">
          <h2 className="text-xl font-bold mb-4 text-forest">
            {labelFor(locale, 'الأسئلة الشائعة حول الصنف', 'Frequently Asked Questions')}
          </h2>
          <div className="space-y-4">
            {seo.autoFaqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-bold text-foreground text-base mb-1.5">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 border-t border-border pt-6">
        <ShareActions url={shareUrl} title={title} locale={locale} />
      </div>
    </main>
  )
}
