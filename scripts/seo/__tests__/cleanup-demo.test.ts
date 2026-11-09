import { describe, test } from 'node:test'
import assert from 'node:assert'
import { identifyDemoItem, scanDemoContent, KNOWN_DEMO_REDIRECTS } from '../../cleanup-demo-content'

describe('Stage 7 Task H1: Demo Content Cleaner & Dry-Run Tests', () => {
  const authenticProduct = {
    id: 'prod-001',
    slug: 'frozen-meat',
    name: { ar: 'لحوم بقر مجمدة', en: 'Frozen Beef' },
    image: 'https://cdn.sanity.io/images/10ol7pkg/production/beef.jpg',
  }

  const demoSkuProduct = {
    id: 'prod-sku-01',
    slug: 'mnv-bf-01',
    name: { ar: 'لحم بتلو مجمد' },
    image: 'https://cdn.sanity.io/images/10ol7pkg/production/beef.jpg',
  }

  const placeholderImgProduct = {
    id: 'prod-002',
    slug: 'chicken-breast',
    name: { ar: 'صدور دجاج' },
    image: '/images/hero.png',
  }

  const demoArticle = {
    id: 'art-001',
    slug: 'oli1',
    title: { ar: 'مقال تجريبي قديم' },
  }

  test('identifyDemoItem returns null for authentic production products', () => {
    const result = identifyDemoItem(authenticProduct)
    assert.strictEqual(result, null, 'Authentic product must never be identified as demo content')
  })

  test('identifyDemoItem flags raw SKU-based slug and assigns 301 redirect or noindex', () => {
    const result = identifyDemoItem(demoSkuProduct)
    assert.ok(result, 'Must detect SKU demo product')
    assert.strictEqual(result.type, 'product')
    assert.strictEqual(result.identifier, 'mnv-bf-01')
    assert.strictEqual(result.recommendedAction, 'redirect-301')
    assert.strictEqual(result.targetRedirect, '/products/frozen-meat')
  })

  test('identifyDemoItem flags hero.png as placeholder image', () => {
    const result = identifyDemoItem(placeholderImgProduct)
    assert.ok(result, 'Must detect hero.png placeholder image')
    assert.strictEqual(result.type, 'image')
    assert.strictEqual(result.recommendedAction, 'replace-image')
  })

  test('identifyDemoItem flags oli1 test article for archiving/unpublishing', () => {
    const result = identifyDemoItem(demoArticle)
    assert.ok(result, 'Must detect oli1 test article')
    assert.strictEqual(result.type, 'article')
    assert.strictEqual(result.recommendedAction, 'unpublish-and-archive')
  })

  test('scanDemoContent in dry-run mode returns exact counts and executes 0 mutations', () => {
    const catalog = [
      authenticProduct,
      demoSkuProduct,
      placeholderImgProduct,
      demoArticle,
      { slug: 'basmati-rice', name: { ar: 'أرز بسمتي' }, image: 'https://cdn.sanity.io/rice.jpg' },
      { slug: 'mnv-rc-1121', name: { ar: 'أرز بسمتي 1121' } },
    ]

    const report = scanDemoContent(catalog, true)
    assert.strictEqual(report.dryRun, true, 'Report must be flagged as dryRun')
    assert.strictEqual(report.totalScanned, 6)
    assert.strictEqual(report.demoItemsCount, 4, 'Must identify exactly 4 demo items')
    assert.strictEqual(report.executedMutations, 0, 'Must execute 0 mutations in dry-run mode')

    // Confirm authentic items are preserved
    const demoIdentifiers = report.items.map((i) => i.identifier)
    assert.ok(!demoIdentifiers.includes('frozen-meat'), 'Authentic frozen-meat must NOT be in demo items')
    assert.ok(!demoIdentifiers.includes('basmati-rice'), 'Authentic basmati-rice must NOT be in demo items')
  })
})
