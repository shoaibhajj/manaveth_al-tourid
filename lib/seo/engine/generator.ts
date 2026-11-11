import { localePath, type Locale } from '@/lib/i18n'
import { evaluateSeo } from './evaluate'
import type {
  AutoFaqItem,
  BreadcrumbItem,
  ProductDoc,
  ProductSeoResult,
  SiteSeoContext,
  SpecRow,
} from './types'

function getLocalizedText(field: any, locale: Locale): string {
  if (!field) return ''
  if (typeof field === 'string') return field.trim()
  return (field[locale] || field.ar || field.en || '').trim()
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  const trimmed = text.slice(0, maxLen)
  const lastSpace = trimmed.lastIndexOf(' ')
  return (lastSpace > 20 ? trimmed.slice(0, lastSpace) : trimmed).trim() + '...'
}

/**
 * Builds an automated SEO Title based on productType and filled fields.
 * Strives to stay under ~60 characters, dropping optional brand/suffixes if needed.
 */
function generateTitle(product: ProductDoc, locale: Locale, site: SiteSeoContext): string {
  const isAr = locale === 'ar'
  const name = getLocalizedText(product.name, locale)
  const brandName = getLocalizedText(product.brand?.name, locale) || getLocalizedText(site.brandName, locale)

  // Primary pack size string if available
  let packStr = ''
  if (product.packSizes && product.packSizes.length > 0) {
    const firstPack = product.packSizes[0]
    const unit = getLocalizedText(firstPack.unit, locale)
    const pkg = getLocalizedText(firstPack.packageType, locale)
    packStr = [firstPack.weight, unit, pkg].filter(Boolean).join(' ')
  } else if (product.packaging) {
    packStr = getLocalizedText(product.packaging, locale)
  }

  const type = product.productType || 'canned'
  let title = ''

  switch (type) {
    case 'meat':
    case 'poultry':
      title = isAr
        ? `${name} بالجملة للمطاعم والإعاشة | ${brandName}`
        : `${name} Wholesale for Restaurants | ${brandName}`
      break

    case 'rice':
      if (packStr) {
        title = isAr
          ? `${name} جملة ${packStr} | ${brandName}`
          : `${name} Wholesale ${packStr} | ${brandName}`
      } else {
        title = isAr
          ? `${name} جملة للمطاعم | ${brandName}`
          : `${name} Wholesale | ${brandName}`
      }
      break

    case 'oil':
    case 'dates':
    case 'canned':
    case 'frozenVeg':
    case 'packaging':
    default:
      if (packStr) {
        title = isAr
          ? `${name} بالجملة ${packStr} | ${brandName}`
          : `${name} Wholesale ${packStr} | ${brandName}`
      } else {
        title = isAr
          ? `${name} بالجملة للمطاعم والفنادق | ${brandName}`
          : `${name} Wholesale for Restaurants | ${brandName}`
      }
      break
  }

  // If longer than 65 characters, simplify by removing trailing brand suffix
  if (title.length > 65) {
    const stripped = title.split(' | ')[0]
    return stripped.length > 65 ? truncate(stripped, 65) : stripped
  }

  return title
}

/**
 * Builds an automated SEO Description from verified filled fields only.
 * Strives to stay under ~155 characters.
 */
function generateDescription(product: ProductDoc, locale: Locale, site: SiteSeoContext): string {
  const isAr = locale === 'ar'
  const name = getLocalizedText(product.name, locale)
  const brandName = getLocalizedText(product.brand?.name, locale) || getLocalizedText(site.brandName, locale)

  const parts: string[] = []
  parts.push(
    isAr
      ? `توريد ${name} بالجملة من ${brandName}`
      : `Wholesale supply of ${name} from ${brandName}`
  )

  // Origin
  const origins = (product.originCountries || [])
    .map((c) => getLocalizedText(c.name, locale))
    .filter(Boolean)
  const legacyOrigin = getLocalizedText(product.origin, locale)
  const originText = origins.length > 0 ? origins.join(', ') : legacyOrigin
  if (originText) {
    parts.push(isAr ? `منشأ: ${originText}` : `Origin: ${originText}`)
  }

  // Storage
  if (product.storageState) {
    const storageLabel =
      product.storageState === 'frozen'
        ? isAr
          ? 'مجمد'
          : 'Frozen'
        : product.storageState === 'chilled'
          ? isAr
            ? 'مبرد'
            : 'Chilled'
          : isAr
            ? 'جاف'
            : 'Ambient'
    parts.push(isAr ? `حفظ ${storageLabel}` : `${storageLabel} storage`)
  }

  // Packaging
  if (product.packSizes && product.packSizes.length > 0) {
    const firstPack = product.packSizes[0]
    const unit = getLocalizedText(firstPack.unit, locale)
    const pkg = getLocalizedText(firstPack.packageType, locale)
    const packDetails = [firstPack.weight, unit, pkg].filter(Boolean).join(' ')
    if (packDetails) parts.push(isAr ? `عبوة: ${packDetails}` : `Packaging: ${packDetails}`)
  }

  // Service Areas
  const cities = (product.serviceAreas || [])
    .map((c) => getLocalizedText(c.name, locale))
    .filter(Boolean)
  if (cities.length > 0) {
    parts.push(isAr ? `توصيل في: ${cities.join('، ')}` : `Delivery in: ${cities.join(', ')}`)
  }

  parts.push(isAr ? 'للمطاعم والفنادق وشركات الإعاشة.' : 'for restaurants, hotels and caterers.')

  const fullText = parts.join(' - ')
  return truncate(fullText, 155)
}

/**
 * Builds table specification rows from filled product fields.
 */
function generateSpecRows(product: ProductDoc, locale: Locale): SpecRow[] {
  const isAr = locale === 'ar'
  const rows: SpecRow[] = []

  // Category
  const catName = getLocalizedText(product.category?.name, locale)
  if (catName) {
    rows.push({ label: isAr ? 'التصنيف' : 'Category', value: catName })
  }

  // Brand
  const brandName = getLocalizedText(product.brand?.name, locale)
  if (brandName) {
    rows.push({ label: isAr ? 'العلامة التجارية' : 'Brand', value: brandName })
  }

  // Product Type
  if (product.productType) {
    const typeLabels: Record<string, { ar: string; en: string }> = {
      meat: { ar: 'لحوم حمراء', en: 'Red Meat' },
      poultry: { ar: 'دواجن', en: 'Poultry' },
      rice: { ar: 'أرز وحبوب', en: 'Rice & Grains' },
      oil: { ar: 'زيوت ودهون', en: 'Cooking Oil' },
      dates: { ar: 'تمور وضيافة', en: 'Dates' },
      canned: { ar: 'معلبات وصلصات', en: 'Canned Food' },
      frozenVeg: { ar: 'خضروات مجمدة', en: 'Frozen Vegetables' },
      packaging: { ar: 'مواد تعبئة وتغليف', en: 'Packaging' },
    }
    const label = typeLabels[product.productType]?.[locale] || product.productType
    rows.push({ label: isAr ? 'فئة الصنف' : 'Product Type', value: label })
  }

  // Origin
  const origins = (product.originCountries || [])
    .map((c) => getLocalizedText(c.name, locale))
    .filter(Boolean)
  const legacyOrigin = getLocalizedText(product.origin, locale)
  const originText = origins.length > 0 ? origins.join(', ') : legacyOrigin
  if (originText) {
    rows.push({ label: isAr ? 'بلد المنشأ' : 'Country of Origin', value: originText })
  }

  // Storage condition
  if (product.storageState) {
    const storageLabels: Record<string, { ar: string; en: string }> = {
      frozen: { ar: 'مجمد (-18°C تحت الصفر)', en: 'Frozen (-18°C)' },
      chilled: { ar: 'مبرد (0°C إلى 4°C)', en: 'Chilled (0°C to 4°C)' },
      ambient: { ar: 'جاف / حرارة الغرفة', en: 'Ambient' },
    }
    const label = storageLabels[product.storageState]?.[locale] || product.storageState
    rows.push({ label: isAr ? 'حالة التخزين' : 'Storage State', value: label })
  } else if (product.storage) {
    rows.push({ label: isAr ? 'تعليمات التخزين' : 'Storage', value: getLocalizedText(product.storage, locale) })
  }

  // Packaging & Sizes
  if (product.packSizes && product.packSizes.length > 0) {
    const packStrs = product.packSizes.map((p) => {
      const u = getLocalizedText(p.unit, locale)
      const pkg = getLocalizedText(p.packageType, locale)
      return [p.weight, u, pkg].filter(Boolean).join(' ')
    })
    rows.push({ label: isAr ? 'العبوات المتوفرة' : 'Pack Sizes', value: packStrs.join(' / ') })
  } else if (product.packaging) {
    rows.push({ label: isAr ? 'التعبئة والتغليف' : 'Packaging', value: getLocalizedText(product.packaging, locale) })
  }

  // Minimum Order Quantity
  if (product.moq && (product.moq.amount || product.moq.unit)) {
    const unit = getLocalizedText(product.moq.unit, locale)
    const val = [product.moq.amount, unit].filter(Boolean).join(' ')
    rows.push({ label: isAr ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order (MOQ)', value: val })
  }

  // Availability
  if (product.availability) {
    const availMap: Record<string, { ar: string; en: string }> = {
      InStock: { ar: 'متوفر للتوريد الفوري', en: 'In Stock' },
      PreOrder: { ar: 'حجز وطلب مسبق', en: 'Pre-Order' },
      OutOfStock: { ar: 'غير متوفر حالياً', en: 'Out of Stock' },
    }
    const availLabel = availMap[product.availability]?.[locale] || product.availability
    rows.push({ label: isAr ? 'حالة التوفر' : 'Availability', value: availLabel })
  }

  // Service Areas
  const areas = (product.serviceAreas || []).map((c) => getLocalizedText(c.name, locale)).filter(Boolean)
  if (areas.length > 0) {
    rows.push({ label: isAr ? 'مناطق التوريد' : 'Supply Areas', value: areas.join('، ') })
  }

  return rows
}

/**
 * Builds automated FAQs strictly from filled fields.
 */
function generateAutoFaqs(product: ProductDoc, locale: Locale): AutoFaqItem[] {
  const isAr = locale === 'ar'
  const name = getLocalizedText(product.name, locale)
  const faqs: AutoFaqItem[] = []

  // Custom manual FAQs take precedence
  if (product.faqs && product.faqs.length > 0) {
    for (const f of product.faqs) {
      const q = getLocalizedText(f.question, locale)
      const a = getLocalizedText(f.answer, locale)
      if (q && a) faqs.push({ question: q, answer: a })
    }
    if (faqs.length > 0) return faqs
  }

  // 1. FAQ for Minimum Order Quantity
  if (product.moq && (product.moq.amount || product.moq.unit)) {
    const unit = getLocalizedText(product.moq.unit, locale)
    const moqStr = [product.moq.amount, unit].filter(Boolean).join(' ')
    faqs.push({
      question: isAr
        ? `ما هو الحد الأدنى لطلب ${name} بالجملة؟`
        : `What is the minimum order quantity (MOQ) for ${name}?`,
      answer: isAr
        ? `الحد الأدنى المسجل لطلب ${name} هو ${moqStr}. يُرجى تأكيد التوفر وشروط التوريد عند التواصل مع الشركة.`
        : `The recorded minimum order for ${name} is ${moqStr}. Please confirm availability and supply terms with the company.`,
    })
  }

  // 2. FAQ for Storage and Handling
  if (product.storageState) {
    const storageDesc =
      product.storageState === 'frozen'
          ? isAr
            ? 'مجمد وفق حالة التخزين المسجلة للصنف.'
            : 'frozen, as recorded for this product.'
        : product.storageState === 'chilled'
          ? isAr
              ? 'مبرد وفق حالة التخزين المسجلة للصنف.'
              : 'chilled, as recorded for this product.'
          : isAr
              ? 'يحفظ في درجة الحرارة المناسبة للصنف.'
              : 'stored at a temperature suitable for the product.'

    faqs.push({
      question: isAr
        ? `كيف يتم حفظ وتخزين ${name} وضمان جودته؟`
        : `How is ${name} stored to ensure food safety and quality?`,
      answer: isAr
        ? `يتم حفظ المنتج ${storageDesc}`
        : `The product is kept ${storageDesc}`,
    })
  }

  // 3. FAQ for Delivery Areas
  const cities = (product.serviceAreas || []).map((c) => getLocalizedText(c.name, locale)).filter(Boolean)
  if (cities.length > 0) {
    faqs.push({
      question: isAr
        ? `ما هي المدن والمناطق المشمولة بتوريد ${name}؟`
        : `Which cities are covered for delivery of ${name}?`,
      answer: isAr
        ? `يتوفر التوريد في: ${cities.join('، ')}. للمناطق البعيدة يُنسق للطلبات أو الكميات الكبيرة.`
        : `Supply is available in: ${cities.join(', ')}. For distant areas, arrangements are made for large orders or quantities.`,
    })
  }

  return faqs
}

/**
 * E2: Pure generator function for building rich, SEO-optimized metadata,
 * OpenGraph attributes, breadcrumbs, structured specs, and FAQs for products.
 */
export function buildProductSeo(
  product: ProductDoc,
  locale: Locale,
  site: SiteSeoContext
): ProductSeoResult {
  const isAr = locale === 'ar'
  const name = getLocalizedText(product.name, locale)
  const evaluation = evaluateSeo(product, locale)

  // Title: Manual override in product.seo takes precedence
  const title = getLocalizedText(product.seo?.title, locale) || generateTitle(product, locale, site)

  // Description: Manual override in product.seo takes precedence
  const description =
    getLocalizedText(product.seo?.description, locale) ||
    getLocalizedText(product.longDescription, locale) ||
    generateDescription(product, locale, site)

  const h1 = name
  const productPath = `/products/${product.slug}`
  const canonical = `${site.baseUrl}${localePath(productPath, locale)}`

  const alternates = {
    canonical,
    languages: {
      ar: `${site.baseUrl}/products/${product.slug}`,
      en: `${site.baseUrl}/en/products/${product.slug}`,
      'x-default': `${site.baseUrl}/products/${product.slug}`,
    },
  }

  const imageUrl =
    typeof product.image === 'string'
      ? product.image
      : product.image?.assetUrl || product.image?.ar?.assetUrl || product.image?.en?.assetUrl || ''

  const openGraph = {
    title,
    description,
    url: canonical,
    siteName: getLocalizedText(site.brandName, locale),
    locale: isAr ? 'ar_SA' : 'en_US',
    images: imageUrl ? [{ url: imageUrl, alt: name }] : [],
  }

  const robots = {
    index: evaluation.isIndexable,
    follow: true,
  }

  // Breadcrumbs: Home -> Products -> Category -> Product
  const breadcrumbs: BreadcrumbItem[] = [
    { name: isAr ? 'الرئيسية' : 'Home', url: `${site.baseUrl}${localePath('/', locale)}` },
    { name: isAr ? 'المنتجات' : 'Products', url: `${site.baseUrl}${localePath('/products', locale)}` },
  ]

  if (product.category && typeof product.category === 'object') {
    const catName = getLocalizedText(product.category.name, locale)
    const catSlug = product.category.slug || product.category._id
    if (catName && catSlug) {
      breadcrumbs.push({
        name: catName,
        url: `${site.baseUrl}${localePath(`/products/category/${catSlug}`, locale)}`,
      })
    }
  }

  breadcrumbs.push({ name, url: canonical })

  const specRows = generateSpecRows(product, locale)
  const autoFaqs = generateAutoFaqs(product, locale)

  return {
    title,
    description,
    h1,
    canonical,
    alternates,
    openGraph,
    robots,
    evaluation,
    breadcrumbs,
    specRows,
    autoFaqs,
  }
}
