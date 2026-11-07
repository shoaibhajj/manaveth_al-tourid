import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeArabic } from '../keywords'
import { parseHtmlMetadata, evaluateGap, CompetitorPageAnalysis } from '../competitors'

describe('Stage 5: Keywords & Arabic Normalization (K1, K2)', () => {
  test('normalizeArabic handles alef, teh marbuta, alef maqsura and leading al-article', () => {
    const raw = '  أرز البسمتي الفاخر في مكة المكرمة مع لحمة مشوية!  '
    const normalized = normalizeArabic(raw)

    // أ -> ا
    assert.ok(normalized.includes('ارز'))
    // ة -> ه
    assert.ok(normalized.includes('مكه'))
    assert.ok(normalized.includes('المكرمه') || normalized.includes('مكرمه'))
    // no exclamation marks
    assert.ok(!normalized.includes('!'))
  })

  test('normalizeArabic collapses multiple spaces and trims', () => {
    assert.equal(normalizeArabic('مورد    لحوم   مجمدة  '), 'مورد لحوم مجمده')
  })
})

describe('Stage 5: Competitor Gap Analyzer (K3)', () => {
  test('parseHtmlMetadata extracts titles, h1, h2, schemas, price and MOQ', () => {
    const sampleHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>توريد لحوم وفنادق بالجملة | شركة المنافس</title>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "كرتون لحم بقري برازيلي",
              "offers": {
                "@type": "Offer",
                "price": "450.00",
                "priceCurrency": "SAR"
              }
            }
          </script>
        </head>
        <body>
          <h1>خدمات توريد اللحوم والمطابخ المركزية B2B</h1>
          <h2>مواصفات الفنادق 5 نجوم</h2>
          <h2>أسعار الجملة بالكرتون والكونتينر</h2>
          <p>نقدم لعملائنا في الرياض وجدة حلول التوريد بأعلى معايير الجودة والسلامة الغذائية والحد الأدنى 50 كرتون.</p>
        </body>
      </html>
    `

    const analysis = parseHtmlMetadata(sampleHtml, 'https://competitor.com/b2b-supply')

    assert.equal(analysis.title, 'توريد لحوم وفنادق بالجملة | شركة المنافس')
    assert.equal(analysis.h1, 'خدمات توريد اللحوم والمطابخ المركزية B2B')
    assert.equal(analysis.h2s.length, 2)
    assert.ok(analysis.h2s[0].includes('مواصفات الفنادق'))
    assert.ok(analysis.wordCount > 10)
    assert.ok(analysis.schemaTypes.includes('Product'))
    assert.ok(analysis.schemaTypes.includes('Offer'))
    assert.equal(analysis.hasPrice, true)
    assert.equal(analysis.hasMoq, true)
  })

  test('evaluateGap correctly maps B2B supply gaps to planned /meat-supply page', () => {
    const analysis: CompetitorPageAnalysis = {
      url: 'https://competitor.com/pages/b2b',
      status: 200,
      title: 'توريد لحوم المطاعم والفنادق',
      h1: 'حلول توريد B2B',
      h2s: ['عقود سنوية'],
      wordCount: 300,
      schemaTypes: ['WebPage'],
      hasPrice: false,
      hasMoq: true,
    }

    const gap = evaluateGap(analysis, 'CompetitorX')

    assert.equal(gap.competitor, 'CompetitorX')
    assert.equal(gap.doWeHavePage, 'Planned')
    assert.equal(gap.ourUrl, '/meat-supply')
    assert.ok(gap.recommendation.includes('/meat-supply'))
  })

  test('evaluateGap maps meat catalog topics to existing /products/frozen-meat', () => {
    const analysis: CompetitorPageAnalysis = {
      url: 'https://competitor.com/category/meat',
      status: 200,
      title: 'لحوم مفرومة وتوب سايد مجمد',
      h1: 'أصناف اللحوم',
      h2s: [],
      wordCount: 150,
      schemaTypes: ['CollectionPage'],
      hasPrice: true,
      hasMoq: true,
    }

    const gap = evaluateGap(analysis, 'CompetitorY')

    assert.equal(gap.doWeHavePage, 'Yes')
    assert.equal(gap.ourUrl, '/products/frozen-meat')
  })
})
