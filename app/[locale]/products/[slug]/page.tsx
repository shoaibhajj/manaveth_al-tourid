import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { ProductDetailActions } from '@/components/product-detail-actions'
import { ShareActions } from '@/components/share-actions'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getProductBySlug } from '@/lib/sanity/details'
import { getDetailSlugs, getArticles, resolveArticleSlug } from '@/lib/sanity/articles'
import { getContent } from '@/lib/sanity/get-content'
import { imageUrl } from '@/lib/sanity/image'
import { productDetailGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { buildProductSeo } from '@/lib/seo/engine'
import { catalogCategories } from '@/lib/content/catalog-data'
import { ArrowLeft, ArrowRight, BookOpen, Layers, Sparkles, Truck } from 'lucide-react'

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
  const isAr = locale === 'ar'

  const [product, base, content, articles] = await Promise.all([
    getProductBySlug(slug),
    getSiteUrl(),
    getContent(),
    getArticles(),
  ])
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

  // Category determination
  const categoryId =
    product.categoryId ||
    (typeof product.category === 'object' ? product.category?.id : undefined) ||
    'meat-poultry'
  const category = catalogCategories.find(
    (c) => c.id === categoryId || `category-${c.id}` === categoryId
  )
  const categoryName = category ? (isAr ? category.name.ar : category.name.en || category.name.ar) : ''

  // Related products from the same category
  const allProducts = content?.products || []
  const relatedProducts = allProducts
    .filter(
      (p) =>
        (p.categoryId === categoryId || p.category?.id === categoryId) &&
        p.slug !== slug &&
        (p as any).visible !== false
    )
    .slice(0, 3)

  // Related articles from the blog
  const relatedArticles = (articles || []).slice(0, 2)

  const showPrice = product.showPrice !== false
  const tierRows = (product.priceTiers ?? []).filter((tier: any) => typeof tier.price === 'number')
  const singlePrice = showPrice && typeof product.price?.amount === 'number' ? product.price : null
  const amountText = (amount: number) => new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(amount)

  return (
    <main className="mx-auto max-w-6xl px-6 pt-28 md:pt-36 pb-16 lg:px-8">
      <JsonLd graph={productDetailGraph(product, locale, base)} />

      {/* Breadcrumbs Navigation with Category Link */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <li>
            <Link href={localePath('/', locale)} className="hover:text-gold transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
          </li>
          <li className="text-muted-foreground/40">/</li>
          <li>
            <Link href={localePath('/products', locale)} className="hover:text-gold transition-colors">
              {isAr ? 'المنتجات' : 'Products'}
            </Link>
          </li>
          {category && (
            <>
              <li className="text-muted-foreground/40">/</li>
              <li>
                <Link
                  href={localePath(`/products/category/${category.id}`, locale)}
                  className="hover:text-gold transition-colors font-medium"
                >
                  {categoryName}
                </Link>
              </li>
            </>
          )}
          <li className="text-muted-foreground/40">/</li>
          <li className="font-semibold text-foreground truncate max-w-xs">{title}</li>
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {labelFor(locale, 'منتج معتمد', 'Certified Product')}
            </span>
            {category && (
              <Link
                href={localePath(`/products/category/${category.id}`, locale)}
                className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-bold text-forest hover:bg-forest/20 transition-colors"
              >
                <Layers className="size-3 text-gold" />
                <span>{categoryName}</span>
              </Link>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{title}</h1>
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

          {/* Service linking banner */}
          <div className="mt-2 rounded-2xl border border-forest/15 bg-forest-deep/5 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Truck className="size-5 text-forest shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-forest-deep">
                  {isAr ? 'خدمة توريد مخصصة للفنادق والمطاعم' : 'Dedicated foodservice supply service'}
                </p>
                <p className="text-forest/70">
                  {isAr ? 'عقود دورية، أسطول مبرد، وتوصيل مجدول لكافة الفروع' : 'Scheduled deliveries with temperature-controlled fleet'}
                </p>
              </div>
            </div>
            <Link
              href={localePath('/services/food-supply', locale)}
              className="text-xs font-bold text-forest hover:text-gold shrink-0 underline"
            >
              {isAr ? 'تفاصيل الخدمة' : 'Service info'}
            </Link>
          </div>
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

      {/* Related Products from the Same Category (E6) */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-forest-deep">
                {isAr ? `أصناف أخرى من قسم ${categoryName}` : `More items in ${categoryName}`}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isAr ? 'منتجات إضافية بنفس معايير الجودة والتوريد' : 'Complementary items with identical certified quality'}
              </p>
            </div>
            {category && (
              <Link
                href={localePath(`/products/category/${category.id}`, locale)}
                className="text-xs font-bold text-forest hover:text-gold flex items-center gap-1"
              >
                <span>{isAr ? 'عرض كل القسم' : 'View all category'}</span>
                {isAr ? <ArrowLeft className="size-3" /> : <ArrowRight className="size-3" />}
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedProducts.map((relProduct) => {
              const relHref = localePath(`/products/${relProduct.slug || relProduct.id}`, locale)
              const relName = isAr ? relProduct.name.ar : relProduct.name.en || relProduct.name.ar
              const relImg = typeof relProduct.image === 'string' ? relProduct.image : '/images/hero.png'

              return (
                <Link
                  key={relProduct.id}
                  href={relHref}
                  className="group rounded-2xl border border-border bg-card p-3 shadow-xs hover:border-gold hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-forest/5 mb-3">
                    <Image
                      src={relImg}
                      alt={relName}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-gold transition-colors line-clamp-1">
                      {relName}
                    </h3>
                    {relProduct.sku && (
                      <span className="text-[10px] text-muted-foreground font-mono">{relProduct.sku}</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Related Industry Articles (E6) */}
      {relatedArticles.length > 0 && (
        <section className="mt-12 rounded-2xl border border-forest/10 bg-cream/40 p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-4 text-forest" />
            <h2 className="text-base font-bold text-forest-deep">
              {isAr ? 'أدلة ومقالات توريد الأغذية ذات الصلة' : 'Related Food Supply Guides & Insights'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedArticles.map((art: any) => {
              const artSlug = resolveArticleSlug(art)
              if (!artSlug || artSlug === 'undefined') return null
              const artTitle = isAr ? art.title?.ar || art.title : art.title?.en || art.title
              return (
                <Link
                  key={artSlug}
                  href={localePath(`/blog/${artSlug}`, locale)}
                  className="rounded-xl border border-border bg-white p-3 hover:border-gold transition-colors group block"
                >
                  <p className="text-xs font-bold text-forest-deep group-hover:text-gold transition-colors line-clamp-2">
                    {artTitle}
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1 inline-block">
                    {isAr ? 'اقرأ الدليل التمويني ←' : 'Read supply guide →'}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <div className="mt-12 border-t border-border pt-6">
        <ShareActions url={shareUrl} title={title} locale={locale} />
      </div>
    </main>
  )
}
