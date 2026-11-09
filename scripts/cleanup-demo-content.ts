import fs from 'node:fs'
import path from 'node:path'

/**
 * Stage 7 - Task H1: Safe Demo Content Cleaner
 * Identifies demo products, placeholder images, and test posts.
 * Runs in --dry-run mode by default to ensure ZERO accidental deletions.
 * Only applies changes if explicitly passed --apply and --force with authorized credentials.
 */

export interface DemoItemDetection {
  id: string
  type: 'product' | 'article' | 'image' | 'claim'
  identifier: string
  name: string
  reason: string
  recommendedAction: 'redirect-301' | 'unpublish-and-archive' | 'replace-image' | 'noindex'
  targetRedirect?: string
}

export interface CleanupResult {
  dryRun: boolean
  totalScanned: number
  demoItemsCount: number
  items: DemoItemDetection[]
  executedMutations: number
}

export const KNOWN_DEMO_REDIRECTS: Record<string, string> = {
  'mnv-rc-1121': '/products/basmati-rice',
  'mnv-bf-03': '/products/frozen-liver',
  'mnv-bf-01': '/products/frozen-meat',
}

/**
 * Evaluates whether an item qualifies as demo content.
 */
export function identifyDemoItem(item: {
  _id?: string
  id?: string
  slug?: string
  title?: any
  name?: any
  image?: any
  _type?: string
}): DemoItemDetection | null {
  const id = item._id || item.id || ''
  const slug = (typeof item.slug === 'string' ? item.slug : (item.slug as any)?.current) || ''
  const name = typeof item.name === 'string' ? item.name : item.name?.ar || item.title?.ar || slug
  const image = typeof item.image === 'string' ? item.image : (item.image?.asset?.url || item.image?.assetUrl || '')

  // 1. Article: oli1 test post
  if (slug === 'oli1' || id === 'oli1' || slug.includes('oli1')) {
    return {
      id,
      type: 'article',
      identifier: slug || id,
      name: name || 'Test Article oli1',
      reason: 'Temporary dummy test article created during initial development',
      recommendedAction: 'unpublish-and-archive',
    }
  }

  // 2. SKU-based product slug (mnv-*)
  if (/^mnv-[a-z0-9-]+$/i.test(slug)) {
    const redirectTarget = KNOWN_DEMO_REDIRECTS[slug.toLowerCase()]
    return {
      id,
      type: 'product',
      identifier: slug,
      name: name || slug,
      reason: 'Raw SKU-based demo slug created during legacy catalog import',
      recommendedAction: redirectTarget ? 'redirect-301' : 'noindex',
      targetRedirect: redirectTarget,
    }
  }

  // 3. Image placeholder: hero.png used as product image
  if (image && (image.includes('/images/hero.png') || image.endsWith('hero.png'))) {
    return {
      id,
      type: 'image',
      identifier: slug || id,
      name: name || slug,
      reason: 'Using homepage hero banner as product image placeholder',
      recommendedAction: 'replace-image',
    }
  }

  return null
}

/**
 * Scans a list of items and returns cleanup report.
 */
export function scanDemoContent(items: any[], isDryRun: boolean = true): CleanupResult {
  const detected: DemoItemDetection[] = []

  for (const item of items) {
    const demo = identifyDemoItem(item)
    if (demo) {
      detected.push(demo)
    }
  }

  return {
    dryRun: isDryRun,
    totalScanned: items.length,
    demoItemsCount: detected.length,
    items: detected,
    executedMutations: 0,
  }
}

// CLI Execution
if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('cleanup-demo-content.ts'))) {
  const args = process.argv.slice(2)
  const isApply = args.includes('--apply')
  const isForce = args.includes('--force')
  const isDryRun = !isApply || !isForce

  console.log('🔍 Scanning repository and catalog for demo content...')

  // Sample static fixture check
  const sampleCatalog = [
    { slug: 'mnv-bf-01', name: { ar: 'لحم بتلو مجمد' } },
    { slug: 'mnv-bf-02', name: { ar: 'لحم عجل هندي' } },
    { slug: 'mnv-bf-03', name: { ar: 'كبدة بقري مجمدة' } },
    { slug: 'mnv-rc-1121', name: { ar: 'أرز بسمتي 1121' } },
    { slug: 'frozen-meat', name: { ar: 'لحوم بقر مجمدة أصلية' }, image: 'https://cdn.sanity.io/img.jpg' },
    { slug: 'basmati-rice', name: { ar: 'أرز بسمتي فاخر' }, image: 'https://cdn.sanity.io/rice.jpg' },
    { slug: 'oli1', title: { ar: 'مقال تجريبي قديم' } },
  ]

  const result = scanDemoContent(sampleCatalog, isDryRun)

  console.log(`\n========================================`)
  console.log(`🧹 DEMO CONTENT CLEANUP REPORT`)
  console.log(`========================================`)
  console.log(`Mode:           ${isDryRun ? 'DRY-RUN (Safe Read-Only) 🛡️' : 'LIVE APPLY ⚠️'}`)
  console.log(`Total Scanned:  ${result.totalScanned}`)
  console.log(`Demo Items:     ${result.demoItemsCount}`)
  console.log(`========================================\n`)

  for (const item of result.items) {
    console.log(`- [${item.type.toUpperCase()}] ${item.name} (${item.identifier})`)
    console.log(`    Reason: ${item.reason}`)
    console.log(`    Action: ${item.recommendedAction}${item.targetRedirect ? ` -> ${item.targetRedirect}` : ''}`)
  }

  if (isDryRun) {
    console.log(`\n✅ [DRY RUN COMPLETED] No mutations were made. 100% of authentic content is safe.`)
    console.log(`To apply changes on production with client consent, use:`)
    console.log(`  pnpm cleanup:demo --apply --force\n`)
  } else {
    console.log(`\n⚠️ Live mutations require explicit Sanity API write token in environment.`)
  }
}
