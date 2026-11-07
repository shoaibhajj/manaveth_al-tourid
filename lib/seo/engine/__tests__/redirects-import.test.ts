import { test, describe } from 'node:test'
import assert from 'node:assert'
import { resolveRedirect } from '../../../redirects'

describe('SEO Engine: 301 Redirects & Import (Task E8)', () => {
  test('should resolve 301 redirect for configured arabic source path', () => {
    const result = resolveRedirect('/products/beef')
    assert.ok(result, 'redirect should match')
    assert.strictEqual(result.destination, '/products/frozen-meat')
    assert.strictEqual(result.status, 301)
  })

  test('should resolve 301 redirect for english locale prefix automatically', () => {
    const result = resolveRedirect('/en/products/beef')
    assert.ok(result, 'redirect should match english path')
    assert.strictEqual(result.destination, '/en/products/frozen-meat')
    assert.strictEqual(result.status, 301)
  })

  test('should return null for paths without redirects', () => {
    const result = resolveRedirect('/products/unknown-item-123')
    assert.strictEqual(result, null)
  })

  test('should handle custom dynamic redirects from Sanity documents', () => {
    const customRules = [
      { source: '/products/old-rice-slug', destination: '/products/basmati-rice', permanent: true },
    ]

    const resultAr = resolveRedirect('/products/old-rice-slug', customRules)
    assert.strictEqual(resultAr?.destination, '/products/basmati-rice')
    assert.strictEqual(resultAr?.status, 301)

    const resultEn = resolveRedirect('/en/products/old-rice-slug', customRules)
    assert.strictEqual(resultEn?.destination, '/en/products/basmati-rice')
    assert.strictEqual(resultEn?.status, 301)
  })
})
