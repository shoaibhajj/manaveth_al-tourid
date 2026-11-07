import { test, describe } from 'node:test'
import assert from 'node:assert'
import {
  buildOrganizationSchema,
  buildProductSchema,
  buildBranchSchema,
  buildArticleSchema,
  buildBreadcrumbSchema,
} from '../index'

describe('Dynamic Schema & Entities Engine (Tasks G1 & G2)', () => {
  const base = 'https://www.mnaveth-altourid.com'

  test('buildOrganizationSchema must link stable @id, legalName, CR, and Wikidata entities', () => {
    const siteMock = {
      brand: {
        commercialRegistration: '1116011768',
        taxId: '300998877600003',
      },
      contact: {
        phone: '+966509971699',
        email: 'info@mnafeth.com',
        social: [{ url: 'https://twitter.com/mnaveth' }],
      },
    }

    const org = buildOrganizationSchema(siteMock, 'ar', base)
    assert.strictEqual(org['@type'], 'Organization')
    assert.strictEqual(org['@id'], `${base}/#organization`)
    assert.strictEqual(org.legalName, 'شركة منافذ التوريد للتجارة')
    assert.strictEqual(org.identifier, '1116011768')
    assert.ok(Array.isArray(org.knowsAbout), 'knowsAbout should be array')
    assert.ok(org.knowsAbout.some((item: any) => item.sameAs?.includes('wikidata.org/wiki/Q1549591')))
  })

  test('buildProductSchema must omit offers when price is hidden or not configured', () => {
    const hiddenPriceProduct = {
      slug: 'frozen-beef',
      name: { ar: 'لحم بقري مجمد', en: 'Frozen Beef' },
      description: { ar: 'لحم بقري بالجملة', en: 'Wholesale beef' },
      sku: 'MNV-BF-01',
      showPrice: false,
      price: { amount: 50 },
    }

    const schema = buildProductSchema(hiddenPriceProduct, 'ar', base)
    assert.strictEqual(schema['@type'], 'Product')
    assert.strictEqual(schema.offers, undefined, 'Offers must be omitted when showPrice is false')
  })

  test('buildProductSchema must include valid Offer, UnitPriceSpecification, and seller reference when price is visible', () => {
    const visiblePriceProduct = {
      slug: 'basmati-rice-1121',
      name: { ar: 'أرز بسمتي هندي', en: 'Indian Basmati Rice' },
      sku: 'MNV-RC-01',
      showPrice: true,
      price: { amount: 118, unit: { ar: 'كيس 40 كجم', en: '40kg sack' } },
      availability: 'in_stock',
    }

    const schema = buildProductSchema(visiblePriceProduct, 'ar', base)
    assert.ok(schema.offers, 'Offers should be defined')
    assert.strictEqual(schema.offers.price, 118)
    assert.strictEqual(schema.offers.priceCurrency, 'SAR')
    assert.strictEqual(schema.offers.seller['@id'], `${base}/#organization`)
    assert.strictEqual(schema.offers.priceSpecification['@type'], 'UnitPriceSpecification')
  })

  test('buildBranchSchema must be WholesaleStore/LocalBusiness and never FoodEstablishment', () => {
    const branchMock = {
      id: 'riyadh-main',
      name: { ar: 'مستودع الرياض المركزي', en: 'Riyadh Central Hub' },
      city: { ar: 'الرياض', en: 'Riyadh' },
      address: { ar: 'حي المنصورة', en: 'Al Mansourah' },
      mapQuery: '24.5822,46.7725',
    }

    const branch = buildBranchSchema(branchMock, 'ar', base)
    const types = Array.isArray(branch['@type']) ? branch['@type'] : [branch['@type']]
    assert.ok(types.includes('WholesaleStore'))
    assert.ok(types.includes('LocalBusiness'))
    assert.strictEqual(types.includes('FoodEstablishment'), false, 'Wholesaler must not be FoodEstablishment')
    assert.strictEqual(branch.parentOrganization['@id'], `${base}/#organization`)
    assert.deepStrictEqual(branch.geo, {
      '@type': 'GeoCoordinates',
      latitude: 24.5822,
      longitude: 46.7725,
    })
  })

  test('buildArticleSchema maps aboutEntities and mentionedEntities into about and mentions', () => {
    const articleMock = {
      slug: 'cold-kitchen-food-supply',
      title: { ar: 'سلاسل إمداد المطابخ السحابية', en: 'Cloud Kitchen Food Supply' },
      aboutEntities: ['تجارة الجملة', 'لحوم مجمدة'],
      mentionedEntities: ['الرياض', 'جدة'],
    }

    const schema = buildArticleSchema(articleMock, 'ar', base)
    assert.strictEqual(schema['@type'], 'Article')
    assert.strictEqual(schema.about?.length, 2)
    assert.strictEqual(schema.mentions?.length, 2)
    assert.strictEqual(schema.about[0].name, 'تجارة الجملة')
  })

  test('buildBreadcrumbSchema outputs correct positional BreadcrumbList', () => {
    const breadcrumbs = buildBreadcrumbSchema(
      [
        { name: 'الرئيسية', url: '/' },
        { name: 'المنتجات', url: '/products' },
        { name: 'لحم بقري', url: '/products/beef' },
      ],
      base
    )

    assert.strictEqual(breadcrumbs['@type'], 'BreadcrumbList')
    assert.strictEqual(breadcrumbs.itemListElement.length, 3)
    assert.strictEqual(breadcrumbs.itemListElement[0].position, 1)
    assert.strictEqual(breadcrumbs.itemListElement[2].position, 3)
    assert.strictEqual(breadcrumbs.itemListElement[2].item, `${base}/products/beef`)
  })
})
