import type { Locale } from '@/lib/i18n'
import { compact, t, absoluteUrl } from './helpers'

export function buildOffer(product: any, productUrl: string, base: string) {
  // G1 Rule: Offer appears ONLY if price is explicitly configured and visible
  if (product.showPrice === false) return undefined
  if (!product.price || typeof product.price.amount !== 'number' || product.price.amount <= 0) {
    return undefined
  }

  const priceValidUntil = product.priceValidUntil
    ? new Date(product.priceValidUntil).toISOString().split('T')[0]
    : undefined

  const availability =
    product.availability === 'out_of_stock'
      ? 'https://schema.org/OutOfStock'
      : product.availability === 'pre_order'
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock'

  return compact({
    '@type': 'Offer',
    url: productUrl,
    price: product.price.amount,
    priceCurrency: 'SAR',
    priceValidUntil,
    availability,
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      '@id': `${base}/#organization`,
    },
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: product.price.amount,
      priceCurrency: 'SAR',
      unitText: t(product.price.unit, 'ar') || 'ر.س',
    },
  })
}

export function buildProductSchema(product: any, locale: Locale, base: string) {
  const slug = product.slug || product.id
  const productUrl = `${base}${locale === 'ar' ? '' : '/en'}/products/${slug}`
  const mainImage = typeof product.image === 'string' ? product.image : product.image?.asset?.url
  const galleryImages = Array.isArray(product.gallery)
    ? product.gallery
        .map((g: any) => (typeof g === 'string' ? g : g?.assetUrl || g?.asset?.url))
        .filter(Boolean)
    : []
  const allImages = [mainImage, ...galleryImages].filter(Boolean).map((img) => absoluteUrl(img, base))
  const uniqueImages = Array.from(new Set(allImages))

  const brandName =
    product.brand && typeof product.brand === 'object' && product.brand.name
      ? t(product.brand.name, locale)
      : typeof product.brand === 'string'
        ? product.brand
        : locale === 'ar'
          ? 'منافذ التوريد'
          : 'Mnaveth ALTourid'

  return compact({
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    url: productUrl,
    name: t(product.name, locale),
    description: t(product.description, locale),
    sku: product.sku || undefined,
    image: uniqueImages.length > 0 ? uniqueImages : undefined,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    category:
      product.category && typeof product.category === 'object' && product.category.name
        ? t(product.category.name, locale)
        : typeof product.category === 'string'
          ? product.category
          : product.categoryId || undefined,
    offers: buildOffer(product, productUrl, base),
  })
}
