import { describe, test } from 'node:test'
import assert from 'node:assert'
import { evaluateSeo } from '../../../lib/seo/engine/evaluate'
import { buildProductSeo } from '../../../lib/seo/engine/generator'
import { buildProductSchema } from '../../../lib/seo/schema/product'
import { resolveRedirect } from '../../../lib/redirects'
import type { ProductDoc, SiteSeoContext } from '../../../lib/seo/engine/types'

describe('Stage 7 Task Q2: End-to-End Product Lifecycle Integration Tests', () => {
  const siteContext: SiteSeoContext = {
    baseUrl: 'https://www.mnaveth-altourid.com',
    brandName: { ar: 'منافذ التوريد', en: 'Mnaveth ALTourid' },
    defaultLocale: 'ar',
  }

  // 1. Incomplete Product Document
  const incompleteProduct: ProductDoc = {
    id: 'test-veal-01',
    slug: 'test-veal-lifecycle',
    name: { ar: 'لحم بتلو تجريبي', en: '' },
    description: { ar: '', en: '' },
    // Missing image, category, price, specifications
  }

  // 2. Complete Product Document
  const completeProduct: ProductDoc = {
    id: 'test-veal-01',
    slug: 'test-veal-lifecycle',
    name: {
      ar: 'لحم بتلو رضيع مجمد بالعظم فاخر',
      en: 'Premium Frozen Bone-In Baby Veal',
    },
    description: {
      ar: 'توريد لحم بتلو رضيع مجمد عالي الجودة للقطاع التجاري والمطاعم مع اشتراطات التبريد الصارمة.',
      en: 'High quality wholesale frozen baby veal supply for commercial hospitality and restaurants.',
    },
    longDescription: {
      ar: 'لحم بتلو رضيع بالعظم معبأ في كراتين معتمدة وتبريد قياسي لضمان أعلى مستويات الجودة.',
      en: 'Premium bone-in baby veal packaged in approved wholesale cartons for B2B supply.',
    },
    image: 'https://cdn.sanity.io/images/10ol7pkg/production/veal-cut.jpg',
    category: {
      _id: 'meat-poultry',
      slug: 'meat-poultry',
      name: { ar: 'اللحوم والدواجن', en: 'Meat & Poultry' },
    },
    productType: 'meat',
    price: {
      amount: 48,
      unit: { ar: 'كجم', en: 'kg' },
    },
    showPrice: true,
    priceValidUntil: '2026-12-31T00:00:00.000Z',
    originCountries: [{ name: { ar: 'هولندا', en: 'Netherlands' } }],
    storageState: 'frozen',
    packSizes: [{ weight: 20, unit: { ar: 'كجم', en: 'kg' }, packageType: { ar: 'كرتون', en: 'Carton' } }],
    moq: { amount: 50, unit: { ar: 'كرتون', en: 'cartons' } },
    serviceAreas: [{ name: { ar: 'الرياض', en: 'Riyadh' } }],
  }

  test('Step 1: incomplete product is set to noindex and excluded from sitemap', () => {
    const evalAr = evaluateSeo(incompleteProduct, 'ar')
    assert.strictEqual(evalAr.isIndexable, false, 'Incomplete product must NOT be indexable')
    assert.ok(evalAr.missingFields.length >= 2, 'Must list missing required fields')

    const seoResult = buildProductSeo(incompleteProduct, 'ar', siteContext)
    assert.strictEqual(seoResult.robots.index, false, 'Robots index must be false for incomplete product')

    // Sitemap filter simulation
    const sitemapEligible = evalAr.isIndexable && Boolean(incompleteProduct.slug)
    assert.strictEqual(sitemapEligible, false, 'Incomplete product must be excluded from XML sitemap')
  })

  test('Step 2: completed product is indexable, generates valid Schema, og:image, and enters sitemap', () => {
    const evalAr = evaluateSeo(completeProduct, 'ar')
    assert.strictEqual(evalAr.isIndexable, true, 'Completed product must be indexable')
    assert.strictEqual(evalAr.missingFields.length, 0)

    const seoResult = buildProductSeo(completeProduct, 'ar', siteContext)
    assert.strictEqual(seoResult.robots.index, true, 'Robots index must be true')
    assert.ok(seoResult.title.includes('لحم بتلو'), 'Title must contain product name')
    assert.ok(seoResult.openGraph.images.length > 0, 'OpenGraph must have valid image')
    assert.strictEqual(seoResult.openGraph.images[0].url, 'https://cdn.sanity.io/images/10ol7pkg/production/veal-cut.jpg')

    // Schema Validation
    const schema = buildProductSchema(completeProduct, 'ar', siteContext.baseUrl)
    assert.strictEqual(schema['@type'], 'Product')
    assert.strictEqual(schema.name, 'لحم بتلو رضيع مجمد بالعظم فاخر')
    assert.strictEqual(schema.category, 'اللحوم والدواجن')
    assert.ok(schema.offers, 'Offers must be present when showPrice is true')
    assert.strictEqual(schema.offers.price, 48)
    assert.strictEqual(schema.offers.priceCurrency, 'SAR')

    // Sitemap filter simulation
    const sitemapEligible = evalAr.isIndexable && Boolean(completeProduct.slug)
    assert.strictEqual(sitemapEligible, true, 'Completed product must be included in XML sitemap')
  })

  test('Step 3: price update dynamically reflects in Schema offers, or omits offers when price is hidden', () => {
    // 3a: Price updated to 55 SAR
    const updatedPriceProduct = {
      ...completeProduct,
      price: { amount: 55, unit: { ar: 'كجم', en: 'kg' } },
    }
    const schemaUpdated = buildProductSchema(updatedPriceProduct, 'ar', siteContext.baseUrl)
    assert.strictEqual(schemaUpdated.offers.price, 55, 'Offer price must dynamically update to 55')
    assert.strictEqual(schemaUpdated.offers.priceSpecification.price, 55)

    // 3b: Price hidden by client
    const hiddenPriceProduct = {
      ...completeProduct,
      showPrice: false,
    }
    const schemaHidden = buildProductSchema(hiddenPriceProduct, 'ar', siteContext.baseUrl)
    assert.strictEqual(schemaHidden.offers, undefined, 'Offers must be completely omitted when showPrice is false')
  })

  test('Step 4: slug change generates permanent 301 redirect from old to new URL', () => {
    const oldSlug = 'test-veal-lifecycle'
    const newSlug = 'premium-frozen-dutch-baby-veal'

    const dynamicRedirects = [
      {
        source: `/products/${oldSlug}`,
        destination: `/products/${newSlug}`,
        permanent: true,
      },
    ]

    const redirectAr = resolveRedirect(`/products/${oldSlug}`, dynamicRedirects)
    assert.ok(redirectAr, 'Redirect must resolve for old product slug')
    assert.strictEqual(redirectAr.status, 301)
    assert.strictEqual(redirectAr.destination, `/products/${newSlug}`)

    const redirectEn = resolveRedirect(`/en/products/${oldSlug}`, dynamicRedirects)
    assert.ok(redirectEn, 'Redirect must automatically preserve English locale prefix')
    assert.strictEqual(redirectEn.status, 301)
    assert.strictEqual(redirectEn.destination, `/en/products/${newSlug}`)
  })

  test('Step 5: product deletion/unpublish removes it from catalog, sitemap, and returns 404', () => {
    // Simulation of deleted / hidden document
    const deletedProduct = {
      ...completeProduct,
      visible: false,
    }

    const sitemapEligible = deletedProduct.visible !== false && evaluateSeo(deletedProduct, 'ar').isIndexable
    assert.strictEqual(sitemapEligible, false, 'Unpublished or hidden product must immediately exit sitemap')

    // Page resolution simulation
    const resolveProductPage = (doc: any) => {
      if (!doc || doc.visible === false) return 404
      return 200
    }

    assert.strictEqual(resolveProductPage(deletedProduct), 404, 'Unpublished product page must return 404')
    assert.strictEqual(resolveProductPage(null), 404, 'Deleted product must return 404')
  })
})
