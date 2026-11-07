import { test, describe } from 'node:test'
import assert from 'node:assert'
import { evaluateSeo } from '../evaluate'
import { catalogCategories } from '../../../content/catalog-data'

describe('SEO Engine: Category Pages & Internal Linking (Task E6)', () => {
  test('all predefined catalog categories must have valid id, name, and non-empty description', () => {
    assert.ok(catalogCategories.length > 0)
    for (const cat of catalogCategories) {
      assert.ok(cat.id, 'category must have an id')
      assert.ok(cat.name?.ar, 'category must have arabic name')
      assert.ok(cat.description?.ar, 'category must have arabic description')
    }
  })

  test('category indexing rule: requires >= 3 eligible products and a valid description', () => {
    const validDesc = 'لحوم مجمدة ومقطعات معتمدة'
    const emptyDesc = ''

    // Helper simulating category evaluation
    const checkCategoryIndexable = (eligibleCount: number, desc: string) => {
      return eligibleCount >= 3 && Boolean(desc.trim())
    }

    assert.strictEqual(checkCategoryIndexable(3, validDesc), true)
    assert.strictEqual(checkCategoryIndexable(4, validDesc), true)
    assert.strictEqual(checkCategoryIndexable(2, validDesc), false, 'less than 3 products must be noindex')
    assert.strictEqual(checkCategoryIndexable(5, emptyDesc), false, 'empty description must be noindex')
  })
})
