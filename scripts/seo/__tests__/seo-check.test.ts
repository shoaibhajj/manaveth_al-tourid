import { describe, test } from 'node:test'
import assert from 'node:assert'
import { validatePageHtml, FORBIDDEN_PATTERNS } from '../check'

describe('Stage 7 Task Q1: Automated SEO Quality Gate Tests', () => {
  const validArabicProductHtml = `
    <!DOCTYPE html>
    <html lang="ar">
      <head>
        <title>لحم بقر برازيلي مجمد بالجملة | منافذ التوريد</title>
        <meta name="description" content="توريد لحم بقر برازيلي مجمد عالي الجودة لقطاع المطاعم والفنادق والإعاشة في السعودية مع أسعار تنافسية." />
        <link rel="canonical" href="https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef" />
        <link rel="alternate" hreflang="ar" href="https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef" />
        <link rel="alternate" hreflang="en" href="https://www.mnaveth-altourid.com/en/products/frozen-brazilian-beef" />
        <link rel="alternate" hreflang="x-default" href="https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef" />
        <meta property="og:image" content="https://cdn.sanity.io/images/10ol7pkg/production/beef.jpg" />
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "name": "لحم بقر برازيلي مجمد"
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": []
              }
            ]
          }
        </script>
      </head>
      <body>
        <h1>لحم بقر برازيلي مجمد بالجملة</h1>
        <img src="https://cdn.sanity.io/images/10ol7pkg/production/beef.jpg" alt="لحم بقر برازيلي مجمد درجة أولى" />
        <a href="/ar/meat-supply">توريد اللحوم</a>
        <a href="/ar/contact">تواصل معنا</a>
      </body>
    </html>
  `

  test('valid page html passes all SEO quality gate rules with 0 errors', () => {
    const result = validatePageHtml(
      validArabicProductHtml,
      'https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef',
      { 'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400' },
      200
    )

    const errors = result.issues.filter((i) => i.severity === 'error')
    assert.strictEqual(errors.length, 0, `Expected 0 errors, got: ${JSON.stringify(errors)}`)
    assert.strictEqual(result.h1Count, 1)
    assert.strictEqual(result.hasBreadcrumbs, true)
    assert.strictEqual(result.forbiddenWordsFound.length, 0)
    assert.strictEqual(result.isNoStore, false)
  })

  test('rule 1: fails when HTTP status is not 200', () => {
    const result = validatePageHtml(validArabicProductHtml, 'https://www.mnaveth-altourid.com/ar/test', undefined, 404)
    const err = result.issues.find((i) => i.rule === 'status-code')
    assert.ok(err, 'Must produce status-code error')
  })

  test('rule 2: fails when canonical is missing or relative', () => {
    const badCanonicalHtml = validArabicProductHtml.replace(
      /href="https:\/\/www\.mnaveth-altourid\.com\/ar\/products\/frozen-brazilian-beef"/,
      'href="/ar/products/frozen-brazilian-beef"'
    )
    const result = validatePageHtml(badCanonicalHtml, 'https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef')
    const err = result.issues.find((i) => i.rule === 'canonical')
    assert.ok(err, 'Must produce canonical error for relative URL')
  })

  test('rule 3: fails when reciprocal hreflang or x-default is missing', () => {
    const missingHreflangHtml = validArabicProductHtml.replace(
      /<link rel="alternate" hreflang="x-default"[^>]+>/,
      ''
    )
    const result = validatePageHtml(missingHreflangHtml, 'https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef')
    const err = result.issues.find((i) => i.rule === 'hreflang')
    assert.ok(err, 'Must flag missing x-default')
  })

  test('rule 5: fails when H1 is missing or duplicated', () => {
    const duplicateH1Html = validArabicProductHtml.replace('</body>', '<h1>عنوان H1 إضافي ممنوع</h1></body>')
    const result = validatePageHtml(duplicateH1Html, 'https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef')
    const err = result.issues.find((i) => i.rule === 'h1')
    assert.ok(err, 'Must fail when multiple H1 tags exist')
    assert.strictEqual(result.h1Count, 2)
  })

  test('rule 7: fails when internal page lacks BreadcrumbList schema', () => {
    const noBreadcrumbHtml = validArabicProductHtml.replace(/"@type":\s*"BreadcrumbList"/, '"@type": "Other"')
    const result = validatePageHtml(noBreadcrumbHtml, 'https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef')
    const err = result.issues.find((i) => i.rule === 'schema-breadcrumb')
    assert.ok(err, 'Must flag missing BreadcrumbList on internal page')
  })

  test('rule 8: fails when product image uses placeholder hero.png or missing alt', () => {
    const placeholderImgHtml = validArabicProductHtml.replace(
      'alt="لحم بقر برازيلي مجمد درجة أولى"',
      'alt=""'
    ).replaceAll('beef.jpg', 'images/hero.png')

    const result = validatePageHtml(placeholderImgHtml, 'https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef')
    const altErr = result.issues.find((i) => i.rule === 'image-alt')
    const heroErr = result.issues.find((i) => i.rule === 'product-placeholder')
    assert.ok(altErr, 'Must fail when image alt is empty')
    assert.ok(heroErr, 'Must fail when hero.png is used on product page')
  })

  test('rule 10: fails when forbidden content is detected (Mnaveeh, 300000000000003, oli1, TODO)', () => {
    const forbiddenHtml = validArabicProductHtml.replace(
      'منافذ التوريد',
      'Mnaveeh الرقم الضريبي: 300000000000003 رابط oli1 ملاحظة: TODO مراجعة السعر'
    )
    const result = validatePageHtml(forbiddenHtml, 'https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef')
    const errs = result.issues.filter((i) => i.rule === 'forbidden-content')
    assert.strictEqual(errs.length, 4, 'Must detect all 4 forbidden patterns')
  })

  test('rule 11: fails when public page returns no-store cache control', () => {
    const result = validatePageHtml(
      validArabicProductHtml,
      'https://www.mnaveth-altourid.com/ar/products/frozen-brazilian-beef',
      { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    )
    const err = result.issues.find((i) => i.rule === 'cache-control')
    assert.ok(err, 'Must fail when no-store cache control is returned')
    assert.strictEqual(result.isNoStore, true)
  })
})
