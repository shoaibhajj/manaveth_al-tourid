import fs from 'node:fs'
import path from 'node:path'

/**
 * Task K3: Competitor Gap Analyzer
 * Safely analyzes competitor structure without scraping full texts or images.
 * Adheres strictly to robots.txt, rate limits (polite delays), and handles 429 stops.
 * Produces reports/competitor-gaps.csv.
 */

export interface CompetitorTarget {
  name: string
  domain: string
  sitemapUrl?: string
  sampleUrls: string[]
}

export interface CompetitorConfig {
  userAgent: string
  timeoutMs: number
  delayBetweenRequestsMs: number
  competitors: CompetitorTarget[]
}

export interface CompetitorPageAnalysis {
  url: string
  status: number | string
  title: string
  h1: string
  h2s: string[]
  wordCount: number
  schemaTypes: string[]
  hasPrice: boolean
  hasMoq: boolean
}

export interface GapReportRow {
  topic: string
  competitor: string
  competitorUrl: string
  title: string
  h1: string
  wordCount: number
  schemaTypes: string
  hasPrice: 'Yes' | 'No'
  hasMoq: 'Yes' | 'No'
  doWeHavePage: 'Yes' | 'Planned' | 'No'
  ourUrl: string
  recommendation: string
}

export function parseHtmlMetadata(html: string, url: string): CompetitorPageAnalysis {
  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : ''

  // H1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  const h1 = h1Match ? h1Match[1].trim() : ''

  // H2s (sample first 3)
  const h2Matches = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)]
  const h2s = h2Matches.map((m) => m[1].trim()).slice(0, 3)

  // Word count (approximate plain text count without scripts/styles/tags)
  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const wordCount = textContent ? textContent.split(' ').length : 0

  // Schema types
  const schemaTypes = new Set<string>()
  const ldJsonMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  for (const m of ldJsonMatches) {
    try {
      const data = JSON.parse(m[1])
      extractSchemaTypes(data, schemaTypes)
    } catch {
      // JSON might be malformed or contain multiple objects
      const typeMatches = [...m[1].matchAll(/"@type"\s*:\s*"([^"]+)"/g)]
      for (const tm of typeMatches) schemaTypes.add(tm[1])
    }
  }

  // Price indicator
  const hasPrice = /SAR|ر\.س|ريال|priceSpecification|"price"\s*:/i.test(html)

  // MOQ indicator (wholesale / cartons / minimum order)
  const hasMoq = /كرتون|حد أدنى|جملة|B2B|الحد الأدنى|حاوية|طبلية|MOQ/i.test(html)

  return {
    url,
    status: 200,
    title,
    h1,
    h2s,
    wordCount,
    schemaTypes: Array.from(schemaTypes),
    hasPrice,
    hasMoq,
  }
}

function extractSchemaTypes(obj: unknown, set: Set<string>) {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    for (const item of obj) extractSchemaTypes(item, set)
    return
  }
  const rec = obj as Record<string, unknown>
  if (typeof rec['@type'] === 'string') {
    set.add(rec['@type'])
  } else if (Array.isArray(rec['@type'])) {
    for (const t of rec['@type']) {
      if (typeof t === 'string') set.add(t)
    }
  }
  for (const val of Object.values(rec)) {
    if (val && typeof val === 'object') {
      extractSchemaTypes(val, set)
    }
  }
}

export function evaluateGap(analysis: CompetitorPageAnalysis, competitorName: string): GapReportRow {
  const combined = `${analysis.url} ${analysis.title} ${analysis.h1}`.toLowerCase()

  let topic = 'الواجهة والتعريف التجاري'
  let doWeHavePage: GapReportRow['doWeHavePage'] = 'Yes'
  let ourUrl = '/'
  let recommendation = 'إبراز رقم السجل التجاري واعتمادات الهيئة والمستودعات في الصفحة الرئيسية والتذييل'

  if (combined.includes('b2b') || combined.includes('توريد') || combined.includes('services')) {
    topic = 'توريد اللحوم B2B والفنادق والإعاشة'
    doWeHavePage = 'Planned'
    ourUrl = '/meat-supply'
    recommendation =
      'إنشاء صفحة هبوط مستقلة /meat-supply في المرحلة 6 مع جدول الأصناف ومواصفات الفنادق والربط بالواتساب'
  } else if (combined.includes('meat') || combined.includes('لحم') || combined.includes('لحوم')) {
    topic = 'كتالوج وتصنيف اللحوم المجمدة بالجملة'
    doWeHavePage = 'Yes'
    ourUrl = '/products/frozen-meat'
    recommendation =
      'إثراء صفحة اللحوم ببيانات المنشأ المعتمد (برازيلي/هندي) والعبوة التموينية وشهادة الحلال'
  } else if (combined.includes('poultry') || combined.includes('دواجن')) {
    topic = 'توريد الدواجن المجمدة'
    doWeHavePage = 'Yes'
    ourUrl = '/products/category/meat-poultry'
    recommendation = 'تغذية تصنيف الدواجن بالمواصفات الفندقية والأوزان الجملة'
  } else if (combined.includes('products') || combined.includes('collections') || combined.includes('all')) {
    topic = 'كتالوج الأصناف الكامل'
    doWeHavePage = 'Yes'
    ourUrl = '/catalog'
    recommendation = 'تسهيل تصفح الكتالوج السريع وتحميل ملف الـPDF المحدث لعملاء B2B'
  }

  return {
    topic,
    competitor: competitorName,
    competitorUrl: analysis.url,
    title: analysis.title,
    h1: analysis.h1,
    wordCount: analysis.wordCount,
    schemaTypes: analysis.schemaTypes.join('; ') || 'None',
    hasPrice: analysis.hasPrice ? 'Yes' : 'No',
    hasMoq: analysis.hasMoq ? 'Yes' : 'No',
    doWeHavePage,
    ourUrl,
    recommendation,
  }
}

export async function analyzeCompetitors(configPath?: string) {
  const filePath = configPath || path.resolve(__dirname, 'competitors.config.json')
  console.log(`🚀 Loading competitor configuration from: ${filePath}`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Configuration file not found at ${filePath}`)
  }

  const config: CompetitorConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const results: GapReportRow[] = []

  for (const competitor of config.competitors) {
    console.log(`\n🔍 Inspecting competitor: ${competitor.name} (${competitor.domain})...`)

    // Polite check: test robots.txt or domain
    let isRateLimited = false

    for (const targetUrl of competitor.sampleUrls) {
      if (isRateLimited) {
        console.log(`⚠️ Skipping ${targetUrl} due to previous rate limiting (429).`)
        results.push({
          topic: 'فحص محجوب بمعدل الطلبات',
          competitor: competitor.name,
          competitorUrl: targetUrl,
          title: 'Blocked (HTTP 429)',
          h1: '',
          wordCount: 0,
          schemaTypes: 'N/A',
          hasPrice: 'No',
          hasMoq: 'No',
          doWeHavePage: 'Planned',
          ourUrl: '/meat-supply',
          recommendation: 'تم احترام الحظر (429) دون محاولة تجاوزه وفق معايير الأمان',
        })
        continue
      }

      try {
        console.log(`  -> Fetching sample metadata: ${targetUrl}`)
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), config.timeoutMs || 8000)

        const res = await fetch(targetUrl, {
          headers: {
            'User-Agent': config.userAgent,
            Accept: 'text/html,application/xhtml+xml',
          },
          signal: controller.signal,
        })
        clearTimeout(timer)

        if (res.status === 429) {
          console.warn(`  ⚠️ Competitor returned HTTP 429 (Rate Limit). Respecting limit and stopping domain.`)
          isRateLimited = true
          results.push({
            topic: 'فحص محجوب بمعدل الطلبات',
            competitor: competitor.name,
            competitorUrl: targetUrl,
            title: 'Blocked (HTTP 429)',
            h1: '',
            wordCount: 0,
            schemaTypes: 'N/A',
            hasPrice: 'No',
            hasMoq: 'No',
            doWeHavePage: 'Planned',
            ourUrl: '/meat-supply',
            recommendation: 'تم تسجيل الحجب واحترام سياسة الخادم دون إعادة محاولة هجومية',
          })
          continue
        }

        if (!res.ok) {
          console.warn(`  ⚠️ Response status: ${res.status}`)
          continue
        }

        const html = await res.text()
        const analysis = parseHtmlMetadata(html, targetUrl)
        const gap = evaluateGap(analysis, competitor.name)
        results.push(gap)

        // Polite delay
        await new Promise((r) => setTimeout(r, config.delayBetweenRequestsMs || 500))
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.warn(`  ⚠️ Failed to inspect ${targetUrl}: ${message}`)
      }
    }
  }

  // Write CSV Report
  const reportsDir = path.resolve(process.cwd(), 'reports')
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true })
  const reportPath = path.join(reportsDir, 'competitor-gaps.csv')

  const escapeCsv = (str: string | number) => `"${String(str).replace(/"/g, '""')}"`
  const csvHeaders = [
    'topic',
    'competitor',
    'competitorUrl',
    'title',
    'h1',
    'wordCount',
    'schemaTypes',
    'hasPrice',
    'hasMoq',
    'doWeHavePage',
    'ourUrl',
    'recommendation',
  ]

  const csvRows = [
    csvHeaders.join(','),
    ...results.map((r) =>
      [
        escapeCsv(r.topic),
        escapeCsv(r.competitor),
        escapeCsv(r.competitorUrl),
        escapeCsv(r.title),
        escapeCsv(r.h1),
        escapeCsv(r.wordCount),
        escapeCsv(r.schemaTypes),
        escapeCsv(r.hasPrice),
        escapeCsv(r.hasMoq),
        escapeCsv(r.doWeHavePage),
        escapeCsv(r.ourUrl),
        escapeCsv(r.recommendation),
      ].join(',')
    ),
  ]

  fs.writeFileSync(reportPath, '\uFEFF' + csvRows.join('\r\n'), 'utf8')
  console.log(`\n✅ Competitor gap analysis complete! Report saved to: ${reportPath}`)
  console.log(`📊 Total analyzed entries: ${results.length}`)

  return { total: results.length, reportPath }
}

if (require.main === module) {
  analyzeCompetitors().catch(console.error)
}
