import { test, describe } from 'node:test'
import assert from 'node:assert'
import { evaluateSeo } from '../evaluate'
import { submitIndexNow } from '../../indexnow'

describe('SEO Engine: Sitemaps & IndexNow (Task E4)', () => {
  test('deficient product with score < threshold must be excluded from indexing', () => {
    const deficientProduct = {
      id: 'incomplete-item',
      slug: 'incomplete-item',
      name: { ar: 'صنف بدون مواصفات', en: 'Incomplete Item' },
      // Missing description, image, category, and specs
    }

    const evaluation = evaluateSeo(deficientProduct as any, 'ar')
    assert.strictEqual(evaluation.isIndexable, false)
    assert.ok(evaluation.missingFields.length > 0)
  })

  test('eligible product meets all requirements and enters indexing', () => {
    const completeProduct = {
      id: 'fresh-beef',
      slug: 'fresh-beef',
      name: { ar: 'لحم بقري مبرد', en: 'Fresh Chilled Beef' },
      description: {
        ar: 'لحم بقري مبرد عالي الجودة لكبرى المطابخ والفنادق في الرياض',
        en: 'Premium chilled beef for restaurants and catering kitchens in Riyadh',
      },
      image: 'https://cdn.sanity.io/images/mock/production/beef.jpg',
      category: { id: 'meat', name: { ar: 'اللحوم والدواجن', en: 'Meat & Poultry' } },
      productType: 'meat',
      originCountries: [{ name: { ar: 'البرازيل', en: 'Brazil' } }],
      packSizes: [{ size: '20kg' }],
      storageState: 'chilled',
      serviceAreas: [{ name: { ar: 'الرياض', en: 'Riyadh' } }],
    }

    const evaluation = evaluateSeo(completeProduct as any, 'ar')
    assert.strictEqual(evaluation.isIndexable, true)
    assert.strictEqual(evaluation.missingFields.length, 0)
  })

  test('submitIndexNow dispatches valid URLs and returns boolean without crashing', async () => {
    // When offline or unconfigured, it safely catches or returns false without throwing
    const result = await submitIndexNow([
      'https://www.mnaveth-altourid.com/products/fresh-beef',
      'https://www.mnaveth-altourid.com/en/products/fresh-beef',
    ])
    // Result should be boolean and never throw an unhandled rejection
    assert.strictEqual(typeof result, 'boolean')
  })
})
