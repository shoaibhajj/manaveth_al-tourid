import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getContent } from '@/lib/sanity/get-content'
import { sanityServerClient } from '@/lib/sanity/server-client'
import { productCategorySlugsQuery } from '@/lib/sanity/queries'
import { getSiteUrl } from '@/lib/site-url'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { catalogCategories } from '@/lib/content/catalog-data'
import { evaluateSeo } from '@/lib/seo/engine/evaluate'
import { JsonLd } from '@/components/json-ld'
import { ArrowLeft, ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react'

export const dynamicParams = true

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  let categorySlugs: string[] = []

  if (sanityServerClient) {
    try {
      const categories = await sanityServerClient.fetch(productCategorySlugsQuery)
      categorySlugs = ((categories ?? []) as any[])
        .map((category: any) => category.slug || category._id?.replace(/^category-/, ''))
        .filter(Boolean)
    } catch {
      // Use the built-in category list if Sanity is unavailable during build.
    }
  }

  if (!categorySlugs.length) {
    categorySlugs = catalogCategories.map((category) => category.id)
  }

  for (const slug of new Set(categorySlugs)) {
    params.push({ locale: 'ar', slug })
    params.push({ locale: 'en', slug })
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
  const isAr = locale === 'ar'
  const content = await getContent()
  const categories = content.catalogCategories?.length ? content.catalogCategories : catalogCategories

  const category = categories.find((c) => c.id === slug)
  if (!category) {
    return { title: 'Category Not Found', robots: { index: false, follow: false } }
  }

  const allProducts = content?.products || []
  const categoryProducts = allProducts.filter(
    (p) => p.categoryId === category.id || p.categoryId?.replace(/^category-/, '') === category.id
  )

  // E6 Condition: Index only if >= 3 eligible products exist and category has description
  const eligibleProducts = categoryProducts.filter((p) => evaluateSeo(p as any, locale).isIndexable)
  const categoryDesc = isAr ? category.description?.ar : category.description?.en || category.description?.ar
  const isIndexable = eligibleProducts.length >= 3 && Boolean(categoryDesc)

  const title = isAr
    ? `${category.name.ar} بالجملة للمطاعم والفنادق | شركة منافذ التوريد`
    : `Wholesale ${category.name.en || category.name.ar} for Foodservice | Mnaveth ALTourid`

  const description =
    categoryDesc ||
    (isAr
      ? `تصفح تشكيلة ${category.name.ar} المعتمدة لشركة منافذ التوريد المخصصة لقطاع الإعاشة والمطاعم في المملكة.`
      : `Explore wholesale ${category.name.en || category.name.ar} certified for restaurants and hotels across Saudi Arabia.`)

  return buildMetadata({
    path: `/products/category/${slug}`,
    locale,
    title,
    description,
    isIndexable,
  })
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug, locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'
  const [content, base] = await Promise.all([getContent(), getSiteUrl()])
  const categories = content.catalogCategories?.length ? content.catalogCategories : catalogCategories

  const category = categories.find((c) => c.id === slug)
  if (!category) return notFound()

  const allProducts = content?.products || []
  const categoryProducts = allProducts.filter(
    (p) => p.categoryId === category.id || p.categoryId?.replace(/^category-/, '') === category.id
  )

  const categoryTitle = isAr ? category.name.ar : category.name.en || category.name.ar
  const categoryDesc = isAr ? category.description?.ar : category.description?.en || category.description?.ar

  // Breadcrumbs schema
  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isAr ? 'الرئيسية' : 'Home',
        item: `${base}${localePath('/', locale)}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isAr ? 'المنتجات' : 'Products',
        item: `${base}${localePath('/products', locale)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryTitle,
        item: `${base}${localePath(`/products/category/${slug}`, locale)}`,
      },
    ],
  }

  // ItemList schema
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryTitle,
    description: categoryDesc,
    numberOfItems: categoryProducts.length,
    itemListElement: categoryProducts.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: isAr ? p.name.ar : p.name.en || p.name.ar,
      url: `${base}${localePath(`/products/${p.slug || p.id}`, locale)}`,
    })),
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16">
      <JsonLd graph={[breadcrumbListSchema, itemListSchema]} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs sm:text-sm text-forest/60">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href={localePath('/', locale)} className="hover:text-gold transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
          </li>
          <li className="text-forest/30">/</li>
          <li>
            <Link href={localePath('/products', locale)} className="hover:text-gold transition-colors">
              {isAr ? 'المنتجات' : 'Products'}
            </Link>
          </li>
          <li className="text-forest/30">/</li>
          <li className="font-bold text-forest-deep">{categoryTitle}</li>
        </ol>
      </nav>

      {/* Category Hero / Header */}
      <div className="mb-10 rounded-3xl bg-forest-deep px-6 py-10 sm:px-10 sm:py-12 text-cream shadow-xl">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 border border-gold/40 px-3 py-1 text-xs font-bold text-gold">
            <PackageCheck className="size-3.5" />
            <span>
              {categoryProducts.length} {isAr ? 'صنف معتمد' : 'Certified Items'}
            </span>
          </span>
          <Link
            href={localePath('/catalog', locale)}
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cream hover:bg-white/20 transition-colors"
          >
            <span>{isAr ? 'تصفح في الكتالوج المدمج' : 'Browse in Compact Catalog'}</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-cream tracking-tight">
          {categoryTitle}
        </h1>

        {categoryDesc && (
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-cream/80 leading-relaxed">
            {categoryDesc}
          </p>
        )}
      </div>

      {/* Other Categories Navigation Pills */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-forest/50 mb-3">
          {isAr ? 'تصنيفات الأصناف التموينية الأخرى:' : 'Other Foodservice Categories:'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = cat.id === slug
            const catName = isAr ? cat.name.ar : cat.name.en || cat.name.ar
            return (
              <Link
                key={cat.id}
                href={localePath(`/products/category/${cat.id}`, locale)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-forest-deep text-cream shadow-xs'
                    : 'bg-white border border-forest/15 text-forest-deep hover:border-gold hover:text-gold'
                }`}
              >
                {catName}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Products Grid */}
      {categoryProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-forest/20 bg-white p-12 text-center">
          <p className="text-base font-bold text-forest-deep">
            {isAr ? 'الأصناف في هذا القسم قيد التحديث والاعتماد.' : 'Items in this category are being updated.'}
          </p>
          <Link
            href={localePath('/products', locale)}
            className="mt-4 inline-block rounded-xl bg-forest-deep px-5 py-2.5 text-xs font-bold text-cream hover:bg-forest"
          >
            {isAr ? 'العودة لجميع المنتجات' : 'Back to all products'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryProducts.map((product) => {
            const productHref = localePath(`/products/${product.slug || product.id}`, locale)
            const productName = isAr ? product.name.ar : product.name.en || product.name.ar
            const productDesc = isAr ? product.description?.ar : product.description?.en || product.description?.ar
            const productImage = typeof product.image === 'string' ? product.image : '/images/hero.png'

            return (
              <article
                key={product.id}
                className="group flex flex-col justify-between rounded-2xl border border-forest/10 bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
              >
                <div>
                  <Link href={productHref} className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F5F2EA]">
                    <Image
                      src={productImage}
                      alt={productName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-mono text-forest/50">{product.sku}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                        <CheckCircle2 className="size-3" />
                        <span>{isAr ? 'معتمد' : 'Approved'}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-black text-forest-deep group-hover:text-gold transition-colors line-clamp-1">
                      <Link href={productHref}>{productName}</Link>
                    </h3>

                    {productDesc && (
                      <p className="mt-1 text-xs text-forest/70 line-clamp-2 leading-relaxed">
                        {productDesc}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 border-t border-forest/10 pt-3 flex items-center justify-between">
                  <Link
                    href={productHref}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-forest-deep group-hover:text-gold transition-colors"
                  >
                    <span>{isAr ? 'عرض التفاصيل والطلب' : 'View Details & Order'}</span>
                    {isAr ? <ArrowLeft className="size-3.5" /> : <ArrowRight className="size-3.5" />}
                  </Link>

                  <Link
                    href={localePath('/catalog', locale)}
                    className="text-[11px] font-bold text-forest/50 hover:text-emerald-700"
                  >
                    {isAr ? 'طلب تسعير' : 'RFQ'}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
