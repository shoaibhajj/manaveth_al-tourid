import fs from 'node:fs'
import path from 'node:path'

/**
 * Task K1 & K2: Keyword Clustering & Expansion Engine
 * Formula: [Prefix Intent] + [Product/Cut] + [State] + [Origin] + [Sector] + [City]
 * Excludes non-catering terms, normalizes Arabic text, assigns search intent,
 * and maps every cluster strictly to 1 target URL.
 */

export function normalizeArabic(text: string): string {
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\bال/g, '')
    .replace(/[^\u0600-\u06FF\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export type KeywordRow = {
  phrase: string
  normalized: string
  cluster: string
  intent: 'commercial' | 'transactional' | 'local' | 'informational' | 'brand'
  targetUrl: string
  status: 'approved' | 'excluded' | 'review'
  source: 'permutation' | 'google-suggest' | 'catalog'
}

// Data Matrix strictly supported by Mnaveth ALTourid catalog & facilities
const PREFIXES = [
  'مورد',
  'موردين',
  'شركات توريد',
  'شركة توريد',
  'موزعين',
  'طلب توريد',
  'أسعار جملة',
]

const PRODUCTS_MATRIX = [
  {
    cluster: 'اللحوم والدواجن المجمدة',
    targetUrl: '/products/frozen-meat',
    categoryUrl: '/products/category/meat-poultry',
    items: ['لحوم', 'لحم بقري', 'لحم ضأن', 'كبدة مجمدة', 'توب سايد', 'دواجن'],
    states: ['مجمدة', 'مقطعة'],
    origins: ['برازيلي', 'هندي'],
  },
  {
    cluster: 'الأرز والحبوب التموينية',
    targetUrl: '/products/basmati-rice',
    categoryUrl: '/products/category/rice-grains',
    items: ['أرز بسمتي', 'رز مزة 1121', 'أرز هندي معتق'],
    states: ['معتق سنتين', 'أكياس 40 كجم'],
    origins: ['هندي'],
  },
  {
    cluster: 'زيوت الطعام والدهون التموينية',
    targetUrl: '/products/category/oils-fats',
    categoryUrl: '/products/category/oils-fats',
    items: ['زيت طعام', 'زيت قلي فندقي', 'زيت أولين النخيل'],
    states: ['صفائح 18 لتر', 'مكرر'],
    origins: ['ماليزي', 'سعودي'],
  },
  {
    cluster: 'المعلبات وصلصات الطماطم',
    targetUrl: '/products/category/canned-pastes',
    categoryUrl: '/products/category/canned-pastes',
    items: ['معجون طماطم A10', 'معلبات غذائية'],
    states: ['مركز بريكس 28', 'عبوات فندقية'],
    origins: ['سعودي', 'إيطالي'],
  },
  {
    cluster: 'التمور والضيافة الفاخرة',
    targetUrl: '/products/category/dates-hospitality',
    categoryUrl: '/products/category/dates-hospitality',
    items: ['تمر سكري مفتل', 'تمور ضيافة فندقية'],
    states: ['تغليف فردي معقم', 'ملكي'],
    origins: ['مزارع القصيم'],
  },
]

const SECTORS = ['للمطاعم', 'للفنادق', 'لمطابخ الإعاشة', 'للكافيهات']
const CITIES = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة']

// Excluded negative keywords (irrelevant/non-compliant)
const EXCLUDED_PATTERNS = [
  'بلدي', // We only deal in certified imported/frozen and regulated wholesale
  'مصر',
  'الاردن',
  'العراق',
  'الامارات',
  'مطلوب مورد',
  'وظائف',
  'وظيفة',
  'حراج',
]

function determineIntent(phrase: string): KeywordRow['intent'] {
  if (phrase.includes('منافذ') || phrase.includes('التوريد')) return 'brand'
  if (phrase.includes('طلب') || phrase.includes('سعر') || phrase.includes('أسعار') || phrase.includes('شراء'))
    return 'transactional'
  if (phrase.includes('الرياض') || phrase.includes('جدة') || phrase.includes('الدمام') || phrase.includes('مكة'))
    return 'local'
  if (phrase.includes('طريقة') || phrase.includes('مواصفات') || phrase.includes('ما هو'))
    return 'informational'
  return 'commercial'
}

function isExcluded(phrase: string): boolean {
  return EXCLUDED_PATTERNS.some((pattern) => phrase.includes(pattern))
}

// K2: Google Autosuggest fetcher with local disk cache
async function fetchGoogleSuggestions(query: string, cacheMap: Record<string, string[]>): Promise<string[]> {
  if (cacheMap[query]) return cacheMap[query]

  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=ar&gl=sa&q=${encodeURIComponent(query)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    })
    if (!res.ok) return []
    const data = await res.json()
    const suggestions: string[] = Array.isArray(data[1]) ? data[1] : []
    cacheMap[query] = suggestions
    // polite 100ms throttle
    await new Promise((r) => setTimeout(r, 100))
    return suggestions
  } catch {
    return []
  }
}

export async function generateKeywords() {
  console.log('🚀 Running Keyword Clustering & Suggestion Engine (K1, K2)...')

  const results: KeywordRow[] = []
  const seenPhrases = new Set<string>()

  // 1. Permutation generation (K1)
  for (const matrix of PRODUCTS_MATRIX) {
    for (const item of matrix.items) {
      // Basic combinations
      for (const prefix of PREFIXES) {
        // [prefix] + [item]
        const p1 = `${prefix} ${item}`
        if (!seenPhrases.has(p1)) {
          seenPhrases.add(p1)
          results.push({
            phrase: p1,
            normalized: normalizeArabic(p1),
            cluster: matrix.cluster,
            intent: determineIntent(p1),
            targetUrl: matrix.targetUrl,
            status: isExcluded(p1) ? 'excluded' : 'approved',
            source: 'permutation',
          })
        }

        // [prefix] + [item] + [sector]
        for (const sector of SECTORS) {
          const p2 = `${prefix} ${item} ${sector}`
          if (!seenPhrases.has(p2)) {
            seenPhrases.add(p2)
            results.push({
              phrase: p2,
              normalized: normalizeArabic(p2),
              cluster: matrix.cluster,
              intent: determineIntent(p2),
              targetUrl: matrix.targetUrl,
              status: isExcluded(p2) ? 'excluded' : 'approved',
              source: 'permutation',
            })
          }

          // [prefix] + [item] + [sector] + [city]
          for (const city of CITIES) {
            const p3 = `${prefix} ${item} ${sector} ${city}`
            if (!seenPhrases.has(p3)) {
              seenPhrases.add(p3)
              results.push({
                phrase: p3,
                normalized: normalizeArabic(p3),
                cluster: `${matrix.cluster} - ${city}`,
                intent: 'local',
                targetUrl: matrix.targetUrl,
                status: isExcluded(p3) ? 'excluded' : 'approved',
                source: 'permutation',
              })
            }
          }
        }
      }
    }
  }

  // 2. Google Autosuggest Expansion (K2)
  const cacheDir = path.resolve(process.cwd(), '.cache')
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true })
  const cacheFile = path.join(cacheDir, 'google-suggest.json')

  let cacheMap: Record<string, string[]> = {}
  if (fs.existsSync(cacheFile)) {
    try {
      cacheMap = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
    } catch {}
  }

  const seedQueries = [
    'توريد لحوم',
    'توريد لحوم مجمدة',
    'مورد لحوم للمطاعم',
    'لحوم مجمدة جملة',
    'موردين لحوم الرياض',
    'مورد لحوم جدة',
    'كبدة مجمدة جملة',
    'رز بسمتي جملة',
    'شركات توريد مواد غذائية للمطاعم',
    'مورد مواد غذائية بالجملة',
    'تمور جملة الرياض',
    'معلبات غذائية جملة',
  ]

  console.log(`📡 Fetching Google Saudi suggestions for ${seedQueries.length} seed queries...`)
  for (const seed of seedQueries) {
    const suggestions = await fetchGoogleSuggestions(seed, cacheMap)
    for (const phrase of suggestions) {
      if (!seenPhrases.has(phrase) && !isExcluded(phrase)) {
        seenPhrases.add(phrase)

        // Find appropriate target cluster
        let targetCluster = 'خدمات التوريد والإعاشة'
        let targetUrl = '/services/food-supply'

        if (phrase.includes('لحم') || phrase.includes('لحوم') || phrase.includes('كبدة') || phrase.includes('دواجن')) {
          targetCluster = 'اللحوم والدواجن المجمدة'
          targetUrl = '/products/frozen-meat'
        } else if (phrase.includes('رز') || phrase.includes('ارز')) {
          targetCluster = 'الأرز والحبوب التموينية'
          targetUrl = '/products/basmati-rice'
        } else if (phrase.includes('زيت') || phrase.includes('زيوت')) {
          targetCluster = 'زيوت الطعام والدهون التموينية'
          targetUrl = '/products/category/oils-fats'
        } else if (phrase.includes('تمر') || phrase.includes('تمور')) {
          targetCluster = 'التمور والضيافة الفاخرة'
          targetUrl = '/products/category/dates-hospitality'
        }

        results.push({
          phrase,
          normalized: normalizeArabic(phrase),
          cluster: targetCluster,
          intent: determineIntent(phrase),
          targetUrl,
          status: 'approved',
          source: 'google-suggest',
        })
      }
    }
  }

  // Save updated cache
  fs.writeFileSync(cacheFile, JSON.stringify(cacheMap, null, 2), 'utf8')

  // 3. Write CSV Report
  const reportsDir = path.resolve(process.cwd(), 'reports')
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true })
  const reportPath = path.join(reportsDir, 'keyword-map.csv')

  const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`
  const csvHeaders = ['phrase', 'normalized', 'cluster', 'intent', 'targetUrl', 'status', 'source']
  const csvRows = [
    csvHeaders.join(','),
    ...results.map((r) =>
      [
        escapeCsv(r.phrase),
        escapeCsv(r.normalized),
        escapeCsv(r.cluster),
        escapeCsv(r.intent),
        escapeCsv(r.targetUrl),
        escapeCsv(r.status),
        escapeCsv(r.source),
      ].join(',')
    ),
  ]

  // Add UTF-8 BOM so Excel opens Arabic correctly
  fs.writeFileSync(reportPath, '\uFEFF' + csvRows.join('\r\n'), 'utf8')
  console.log(`✅ Generated ${results.length} mapped keywords saved to ${reportPath}`)

  return { total: results.length, reportPath }
}

if (require.main === module) {
  generateKeywords().catch(console.error)
}
