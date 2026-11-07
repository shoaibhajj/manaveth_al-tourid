import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildProductSeo, evaluateSeo } from '../index'
import type { ProductDoc, SiteSeoContext } from '../types'

const siteContext: SiteSeoContext = {
  baseUrl: 'https://mnaveth.com',
  brandName: { ar: 'منافذ التوريد', en: 'Mnaveth ALTourid' },
}

describe('SEO Engine: evaluateSeo (Task E3)', () => {
  it('should flag a product as not indexable if missing image and category', () => {
    const deficient: ProductDoc = {
      name: { ar: 'لحم بقري مجمد', en: 'Frozen Beef' },
      slug: 'frozen-beef',
      description: { ar: 'وصف تجريبي', en: 'Sample description' },
    }
    const evalAr = evaluateSeo(deficient, 'ar')
    assert.equal(evalAr.isIndexable, false)
    assert.ok(evalAr.missingFields.length > 0)
    assert.ok(evalAr.missingFields.some((f) => f.includes('صورة')))
    assert.ok(evalAr.missingFields.some((f) => f.includes('التصنيف')))
  })

  it('should pass an enriched, fully-specified product as indexable', () => {
    const complete: ProductDoc = {
      name: { ar: 'لحم بقري مفروم ممتاز', en: 'Premium Minced Beef' },
      slug: 'premium-minced-beef',
      description: { ar: 'لحم بقري مفروم ممتاز للمطاعم والفنادق', en: 'Premium minced beef for restaurants' },
      image: 'https://cdn.sanity.io/images/1y0u21z5/production/beef.jpg',
      category: { name: { ar: 'لحوم ودواجن', en: 'Meat & Poultry' }, slug: 'meat-poultry' },
      productType: 'meat',
      originCountries: [{ name: { ar: 'البرازيل', en: 'Brazil' } }],
      storageState: 'frozen',
      packSizes: [{ weight: 20, unit: { ar: 'كجم', en: 'kg' }, packageType: { ar: 'كرتون', en: 'Carton' } }],
      moq: { amount: 50, unit: { ar: 'كرتون', en: 'cartons' } },
      serviceAreas: [{ name: { ar: 'الرياض', en: 'Riyadh' } }],
    }
    const evalAr = evaluateSeo(complete, 'ar')
    assert.equal(evalAr.isIndexable, true)
    assert.equal(evalAr.missingFields.length, 0)
    assert.ok(evalAr.score >= 80)
  })
})

describe('SEO Engine: buildProductSeo (Task E2)', () => {
  it('should generate template title for meat products', () => {
    const meatProd: ProductDoc = {
      name: { ar: 'ريش ضأن هندي مجمد', en: 'Frozen Indian Mutton Chops' },
      slug: 'frozen-indian-mutton-chops',
      productType: 'meat',
      brand: { name: { ar: 'منافذ التوريد', en: 'Mnaveth ALTourid' } },
      description: { ar: 'لحوم ضأن هندية مجمدة عالية الجودة للمطابخ والمطاعم', en: 'High quality frozen Indian mutton for restaurants' },
      image: 'https://cdn.sanity.io/images/1y0u21z5/production/mutton.jpg',
    }
    const seoAr = buildProductSeo(meatProd, 'ar', siteContext)
    assert.ok(seoAr.title.includes('ريش ضأن هندي مجمد بالجملة'))
    assert.ok(seoAr.title.includes('منافذ التوريد'))
    assert.equal(seoAr.h1, 'ريش ضأن هندي مجمد')
    assert.equal(seoAr.canonical, 'https://mnaveth.com/products/frozen-indian-mutton-chops')
  })

  it('should generate template title for rice products with pack size', () => {
    const riceProd: ProductDoc = {
      name: { ar: 'أرز بسمتي هندي سيلا 1121', en: 'Indian Basmati Rice Sella 1121' },
      slug: 'indian-basmati-rice-sella-1121',
      productType: 'rice',
      packSizes: [{ weight: 40, unit: { ar: 'كجم', en: 'kg' }, packageType: { ar: 'شوال', en: 'Bag' } }],
      brand: { name: { ar: 'المها', en: 'Al Maha' } },
      description: { ar: 'أرز بسمتي هندي فاخر حبة طويلة للمطاعم', en: 'Premium long grain Indian basmati rice' },
      image: 'https://cdn.sanity.io/images/1y0u21z5/production/rice.jpg',
    }
    const seoAr = buildProductSeo(riceProd, 'ar', siteContext)
    assert.ok(seoAr.title.includes('أرز بسمتي هندي سيلا 1121 جملة 40 كجم شوال'))
    assert.ok(seoAr.title.includes('المها'))
  })

  it('should respect manual SEO override when provided', () => {
    const customProd: ProductDoc = {
      name: { ar: 'زيت ذرة نقي', en: 'Pure Corn Oil' },
      slug: 'pure-corn-oil',
      productType: 'oil',
      seo: {
        title: { ar: 'عنوان يدوي مخصص لمحركات البحث', en: 'Custom Manual Title for Search' },
        description: { ar: 'وصف يدوي مخصص لا يتجاوز 150 حرف', en: 'Custom manual description under 150 characters' },
      },
      image: 'https://cdn.sanity.io/images/1y0u21z5/production/oil.jpg',
    }
    const seoAr = buildProductSeo(customProd, 'ar', siteContext)
    assert.equal(seoAr.title, 'عنوان يدوي مخصص لمحركات البحث')
    assert.equal(seoAr.description, 'وصف يدوي مخصص لا يتجاوز 150 حرف')
  })

  it('should generate autoFaqs only from verified filled fields', () => {
    const prod: ProductDoc = {
      name: { ar: 'دجاج مجمد دو', en: 'Doux Frozen Chicken' },
      slug: 'doux-frozen-chicken',
      productType: 'poultry',
      storageState: 'frozen',
      moq: { amount: 100, unit: { ar: 'كرتون', en: 'Cartons' } },
      serviceAreas: [{ name: { ar: 'الرياض', en: 'Riyadh' } }, { name: { ar: 'جدة', en: 'Jeddah' } }],
      image: 'https://cdn.sanity.io/images/1y0u21z5/production/chicken.jpg',
    }
    const seoAr = buildProductSeo(prod, 'ar', siteContext)
    assert.ok(seoAr.autoFaqs.length >= 2)
    const moqFaq = seoAr.autoFaqs.find((f) => f.question.includes('الحد الأدنى'))
    assert.ok(moqFaq)
    assert.ok(moqFaq.answer.includes('100 كرتون'))

    const storageFaq = seoAr.autoFaqs.find((f) => f.question.includes('تخزين'))
    assert.ok(storageFaq)
    assert.ok(storageFaq.answer.includes('-18°C'))
  })

  it('should format clean specification rows for tables', () => {
    const prod: ProductDoc = {
      name: { ar: 'صلصة طماطم فندقية', en: 'Catering Tomato Paste' },
      slug: 'catering-tomato-paste',
      productType: 'canned',
      category: { name: { ar: 'معلبات', en: 'Canned' } },
      storageState: 'ambient',
      packSizes: [{ weight: 5, unit: { ar: 'كجم', en: 'kg' }, packageType: { ar: 'تنكة', en: 'Tin' } }],
      availability: 'InStock',
    }
    const seoAr = buildProductSeo(prod, 'ar', siteContext)
    assert.ok(seoAr.specRows.some((r) => r.label === 'التصنيف' && r.value === 'معلبات'))
    assert.ok(seoAr.specRows.some((r) => r.label === 'حالة التخزين' && r.value.includes('جاف')))
    assert.ok(seoAr.specRows.some((r) => r.label === 'حالة التوفر' && r.value.includes('متوفر')))
  })
})
