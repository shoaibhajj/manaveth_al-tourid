import type { Locale } from '@/lib/i18n'
import type { ProductDoc, SeoEvaluationResult } from './types'

function getLocalizedText(field: any, locale: Locale): string {
  if (!field) return ''
  if (typeof field === 'string') return field.trim()
  return (field[locale] || field.ar || field.en || '').trim()
}

/**
 * E3: Evaluates whether a product document satisfies the minimum data completeness
 * requirements for search engine indexing. If deficient, the page receives `noindex`
 * and is excluded from XML sitemaps to prevent thin/spam pages.
 */
export function evaluateSeo(product: ProductDoc, locale: Locale = 'ar'): SeoEvaluationResult {
  const missingFields: string[] = []
  const reasons: string[] = []

  // 1. Mandatory Name and Description in page locale
  const name = getLocalizedText(product.name, locale)
  if (!name) {
    missingFields.push(locale === 'ar' ? 'الاسم باللغة الحالية' : 'Name in current locale')
    reasons.push(locale === 'ar' ? 'اسم المنتج فارغ' : 'Product name is missing')
  }

  const desc = getLocalizedText(product.description, locale) || getLocalizedText(product.longDescription, locale)
  if (!desc) {
    missingFields.push(locale === 'ar' ? 'الوصف' : 'Description')
    reasons.push(locale === 'ar' ? 'وصف المنتج فارغ' : 'Product description is missing')
  }

  // 2. Real Image (must exist and not be empty/placeholder)
  const hasImage = Boolean(
    product.image &&
      (typeof product.image === 'string'
        ? product.image.trim() !== '' && !product.image.includes('placeholder')
        : product.image.asset || product.image.ar?.asset || product.image.en?.asset)
  )
  if (!hasImage) {
    missingFields.push(locale === 'ar' ? 'صورة المنتج' : 'Product image')
    reasons.push(locale === 'ar' ? 'لا توجد صورة صالحة للمنتج' : 'Valid product image is missing')
  }

  // 3. Category and ProductType
  const hasCategory = Boolean(product.category)
  if (!hasCategory) {
    missingFields.push(locale === 'ar' ? 'التصنيف' : 'Category')
    reasons.push(locale === 'ar' ? 'التصنيف غير محدد' : 'Category is not assigned')
  }

  const hasProductType = Boolean(product.productType && String(product.productType).trim() !== '')
  if (!hasProductType) {
    missingFields.push(locale === 'ar' ? 'نوع المنتج (Product Type)' : 'Product type')
    reasons.push(locale === 'ar' ? 'فئة ونوع المنتج غير محددة' : 'Product type is not specified')
  }

  // 4. Detail elements checklist (at least 3 required)
  let detailCount = 0

  // (a) Origin
  const hasOrigin = Boolean(
    (product.originCountries && product.originCountries.length > 0) ||
      getLocalizedText(product.origin, locale)
  )
  if (hasOrigin) detailCount++

  // (b) Pack sizes / packaging
  const hasPackaging = Boolean(
    (product.packSizes && product.packSizes.length > 0) ||
      getLocalizedText(product.packaging, locale)
  )
  if (hasPackaging) detailCount++

  // (c) Cuts / specs / grainType
  const hasCutsOrSpecs = Boolean(
    (product.cuts && product.cuts.length > 0) ||
      getLocalizedText(product.grainType, locale)
  )
  if (hasCutsOrSpecs) detailCount++

  // (d) Storage
  const hasStorage = Boolean(
    product.storageState ||
      getLocalizedText(product.storage, locale)
  )
  if (hasStorage) detailCount++

  // (e) Minimum Order Quantity (MOQ)
  const hasMoq = Boolean(product.moq && (product.moq.amount || product.moq.unit))
  if (hasMoq) detailCount++

  // (f) Service Areas
  const hasServiceAreas = Boolean(product.serviceAreas && product.serviceAreas.length > 0)
  if (hasServiceAreas) detailCount++

  if (detailCount < 3) {
    const needed = 3 - detailCount
    missingFields.push(
      locale === 'ar'
        ? `بيانات إضافية: يلزم ${needed} من (المنشأ، التعبئة، القطعيات، التخزين، الحد الأدنى، مدن التوريد)`
        : `Additional specs: need ${needed} of (origin, pack size, cuts, storage, MOQ, cities)`
    )
    reasons.push(
      locale === 'ar'
        ? `البيانات التفصيلية غير كافية (${detailCount}/3 مكتملة)`
        : `Insufficient specification details (${detailCount}/3 completed)`
    )
  }

  // Calculate score (0 to 100)
  let score = 0
  if (name) score += 20
  if (desc) score += 20
  if (hasImage) score += 20
  if (hasCategory && hasProductType) score += 20
  score += Math.min(20, detailCount * 5)

  const isIndexable = missingFields.length === 0 && Boolean(product.visible !== false)

  return {
    isIndexable,
    missingFields,
    score,
    reasons,
  }
}
