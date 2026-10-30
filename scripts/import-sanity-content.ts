/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * One-time, repeatable import of the built-in website content (lib/content/*) into Sanity.
 *
 * - Safe to run again: every record has a deterministic _id and existing records are matched by id,
 *   slug or Arabic name. Only fields that are EMPTY in Sanity are filled; edited values are never overwritten.
 * - Images are uploaded from /public/images (Sanity de-duplicates identical files).
 * - Nothing is ever deleted.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=... pnpm sanity:import            # import
 *   pnpm sanity:import --dry-run                              # print the plan without writing
 */
import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import { createClient } from 'next-sanity'
import { contact } from '../lib/content/contact'
import { galleryCategories, galleryFeatured, galleryItems } from '../lib/content/gallery'
import { places } from '../lib/content/branches'
import { currency, products } from '../lib/content/products'
import { sectors } from '../lib/content/sectors'
import { services } from '../lib/content/services'
import { site } from '../lib/content/site'

for (const file of ['.env.local', '.env.development.local']) {
  if (existsSync(file)) process.loadEnvFile(file)
}

type Doc = Record<string, any>
type Localized = { ar: string; en: string }

const dryRun = process.argv.includes('--dry-run')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.')
  process.exit(1)
}
if (!token && !dryRun) {
  console.error('Missing SANITY_API_WRITE_TOKEN (an Editor token). Use --dry-run to preview without one.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token,
  useCdn: false,
  perspective: 'raw',
})

const report: Record<string, { created: number; filled: number; unchanged: number }> = {}
const bump = (type: string, kind: 'created' | 'filled' | 'unchanged') => {
  report[type] ??= { created: 0, filled: 0, unchanged: 0 }
  report[type][kind] += 1
}

// ---------- value helpers ----------
const text = (value: string | undefined) => (value && value.trim() ? value : undefined)
const ls = (value: Localized | undefined): Doc | undefined =>
  value ? { _type: 'localizedString', ar: text(value.ar), en: text(value.en) } : undefined
const lt = (value: Localized | undefined): Doc | undefined =>
  value ? { _type: 'localizedText', ar: text(value.ar), en: text(value.en) } : undefined

const assetCache = new Map<string, string>()
async function uploadImage(publicPath: string): Promise<string> {
  const cached = assetCache.get(publicPath)
  if (cached) return cached
  const absolute = path.join(process.cwd(), 'public', publicPath)
  if (!existsSync(absolute)) throw new Error(`Missing image file: ${absolute}`)
  let id: string
  if (dryRun) {
    id = `image-dry-run-${path.basename(publicPath)}`
  } else {
    const asset = await client.assets.upload('image', createReadStream(absolute), { filename: path.basename(publicPath) })
    id = asset._id
  }
  assetCache.set(publicPath, id)
  return id
}

async function image(publicPath: string, alt?: Localized, localized = true): Promise<Doc> {
  const ref = await uploadImage(publicPath)
  return {
    _type: localized ? 'localizedImage' : 'image',
    asset: { _type: 'reference', _ref: ref },
    ...(localized && alt ? { alt: ls(alt) } : {}),
  }
}

const withKeys = <T extends Doc>(prefix: string, items: T[]): T[] =>
  items.map((item, index) => ({ _key: `${prefix}-${index + 1}`, ...item }))

const clean = (value: any): any => {
  if (Array.isArray(value)) return value.map(clean)
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, child]) => [key, clean(child)] as const)
      .filter(([, child]) => child !== undefined)
    return Object.fromEntries(entries)
  }
  return value
}

// ---------- fill-missing diff ----------
const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0)
const isPlain = (value: unknown): value is Doc => !!value && typeof value === 'object' && !Array.isArray(value)

function missingFields(existing: Doc, desired: Doc, prefix = '', out: Doc = {}): Doc {
  for (const [key, value] of Object.entries(desired)) {
    if (!prefix && (key === '_id' || key === '_type')) continue
    const current = existing?.[key]
    const pathKey = prefix ? `${prefix}.${key}` : key
    if (isEmpty(current)) out[pathKey] = value
    else if (isPlain(current) && isPlain(value)) missingFields(current, value, pathKey, out)
  }
  return out
}

// ---------- upsert ----------
type Spec = { id: string; type: string; data: Doc; matchField?: string; matchValue?: string; slug?: string }

/** Returns the published id that now represents the record. */
async function upsert({ id, type, data, matchField, matchValue, slug }: Spec): Promise<string> {
  const desired = clean({ _type: type, ...data })
  let publishedId = id

  if (!(await client.getDocument(id)) && !(await client.getDocument(`drafts.${id}`))) {
    const matches: { _id: string }[] = await client.fetch(
      `*[_type == $type && ((defined($value) && ${matchField ?? '_id'} == $value) || (defined($slug) && slug.current == $slug))]{_id}`,
      { type, value: matchValue ?? null, slug: slug ?? null },
    )
    if (matches.length) publishedId = matches[0]._id.replace(/^drafts\./, '')
  }

  const targets = (
    await Promise.all([publishedId, `drafts.${publishedId}`].map((docId) => client.getDocument(docId)))
  ).filter(Boolean) as Doc[]

  if (!targets.length) {
    bump(type, 'created')
    if (!dryRun) await client.createIfNotExists({ _id: publishedId, ...desired } as any)
    console.log(`  + ${type} ${publishedId}`)
    return publishedId
  }

  let touched = false
  for (const existing of targets) {
    const patch = missingFields(existing, desired)
    if (!Object.keys(patch).length) continue
    touched = true
    console.log(`  ~ ${existing._id}: fill ${Object.keys(patch).join(', ')}`)
    if (!dryRun) await client.patch(existing._id).set(patch).commit()
  }
  bump(type, touched ? 'filled' : 'unchanged')
  return publishedId
}

const ref = (id: string) => ({ _type: 'reference', _ref: id })

// ---------- main ----------
async function main() {
  console.log(`Sanity import → ${projectId}/${dataset}${dryRun ? ' (dry run)' : ''}`)

  // Gallery categories
  console.log('Gallery categories')
  const categoryIds = new Map<string, string>()
  for (const [index, category] of galleryCategories.entries()) {
    const id = await upsert({
      id: `galleryCategory-${category.id}`,
      type: 'galleryCategory',
      matchField: 'name.ar',
      matchValue: category.label.ar,
      data: { name: ls(category.label), order: index + 1, visible: true },
    })
    categoryIds.set(category.id, id)
  }

  // Products
  console.log('Products')
  const featuredIds = products.filter((product) => product.featured).slice(0, 3).map((product) => product.id)
  const productIds = new Map<string, string>()
  for (const product of products) {
    const showPrice = Boolean(product.price || product.tiers)
    const id = await upsert({
      id: `product-${product.id}`,
      type: 'product',
      matchField: 'name.ar',
      matchValue: product.name.ar,
      slug: product.id,
      data: {
        name: ls(product.name),
        slug: { _type: 'slug', current: product.id },
        description: lt(product.description),
        image: await image(product.image, product.alt),
        showPrice,
        price: product.price ? { _type: 'unitPrice', amount: product.price.amount, unit: ls(product.price.unit) } : undefined,
        priceTiers: product.tiers
          ? withKeys(
              'tier',
              product.tiers.items.map((tier, index) => ({
                _type: 'priceTier',
                minQuantity: index === 0 ? 10 : 30,
                maxQuantity: index === 0 ? 10 : undefined,
                unit: ls(product.tiers!.unit),
                price: tier.amount,
                label: ls(tier.label),
              })),
            )
          : undefined,
        featured: Boolean(product.featured),
        order: product.order,
        visible: product.visible !== false,
      },
    })
    productIds.set(product.id, id)
  }

  // Services and sectors
  for (const [type, items] of [
    ['service', services],
    ['sector', sectors],
  ] as const) {
    console.log(type === 'service' ? 'Services' : 'Sectors')
    for (const item of items) {
      await upsert({
        id: `${type}-${item.id}`,
        type,
        matchField: 'name.ar',
        matchValue: item.title.ar,
        data: {
          name: ls(item.title),
          description: lt(item.text),
          icon: item.icon,
          image: await image(item.image, item.alt),
          order: item.order,
          visible: item.visible !== false,
        },
      })
    }
  }

  // Stats
  console.log('Stats')
  for (const [index, stat] of site.stats.items.entries()) {
    await upsert({
      id: `stat-${stat.icon}-${index + 1}`,
      type: 'stat',
      matchField: 'label.ar',
      matchValue: stat.label.ar,
      data: { value: stat.value, label: ls(stat.label), icon: stat.icon, order: index + 1, visible: true },
    })
  }

  // Branches and warehouses
  console.log('Branches and warehouses')
  for (const place of places) {
    await upsert({
      id: `place-${place.id}`,
      type: 'place',
      matchField: 'name.ar',
      matchValue: place.name.ar,
      data: {
        kind: place.kind,
        name: ls(place.name),
        address: lt(place.address),
        image: await image(place.image, place.imageAlt),
        mapQuery: text(place.mapQuery),
        mapUrl: text(place.mapUrl),
        phone: text(place.phone),
        email: text(place.email),
        manager: place.manager
          ? { _type: 'contactPerson', name: ls(place.manager.name), phone: text(place.manager.phone) }
          : undefined,
        order: place.order,
        visible: place.visible !== false,
      },
    })
  }

  // Gallery items (the featured picture is stored as a featured item)
  console.log('Gallery items')
  await upsert({
    id: 'galleryItem-featured',
    type: 'galleryItem',
    matchField: 'alt.ar',
    matchValue: galleryFeatured.alt.ar,
    data: {
      mediaType: 'image',
      image: await image(galleryFeatured.src, undefined, false),
      alt: ls(galleryFeatured.alt),
      featured: true,
      order: 0,
      visible: true,
    },
  })
  for (const item of galleryItems) {
    const cover = await image(item.src, undefined, false)
    await upsert({
      id: `galleryItem-${item.id}`,
      type: 'galleryItem',
      matchField: 'alt.ar',
      matchValue: item.alt.ar,
      data: {
        mediaType: item.type,
        image: item.type === 'image' ? cover : undefined,
        poster: item.type === 'video' ? cover : undefined,
        alt: ls(item.alt),
        category: categoryIds.has(item.category) ? ref(categoryIds.get(item.category)!) : undefined,
        featured: false,
        order: item.order,
        visible: item.visible !== false,
      },
    })
  }

  // Singletons
  console.log('Settings and pages')
  const channel = (value: typeof contact.whatsapp.quote) => ({
    _type: 'whatsappChannel',
    name: ls(value.label),
    shortLabel: ls(value.shortLabel),
    message: lt(value.message),
    number: text(value.number),
    visible: true,
  })

  await upsert({
    id: 'siteSettings',
    type: 'siteSettings',
    data: {
      companyName: ls(site.brand.name),
      tagline: ls(site.brand.subtitle),
      about: lt(site.about.text),
      logo: await image(site.brand.logo, site.brand.homeLabel),
      currency: ls(currency),
      phone: text(contact.phone),
      email: text(contact.email),
      address: lt(contact.address),
      defaultSeo: { _type: 'seo', title: ls(site.metadata.title), description: lt(site.metadata.description) },
    },
  })

  await upsert({
    id: 'contactSettings',
    type: 'contactSettings',
    data: {
      whatsappQuote: channel(contact.whatsapp.quote),
      whatsappOrders: channel(contact.whatsapp.orders),
      productOrderMessage: lt(contact.productOrderMessage),
    },
  })

  const header = (eyebrow?: Localized, title?: Localized, description?: Localized) => ({
    visible: true,
    eyebrow: ls(eyebrow),
    title: ls(title),
    description: lt(description),
  })

  await upsert({
    id: 'homePage',
    type: 'homePage',
    data: {
      hero: {
        _type: 'heroSection',
        title: ls({
          ar: site.hero.titleLines.map((line) => line.ar).join('\n'),
          en: site.hero.titleLines.map((line) => line.en).join('\n'),
        }),
        text: lt(site.hero.subtitle),
        mediaType: 'image',
        image: await image(site.brand.heroImage, site.hero.imageAlt),
        badge: ls(site.hero.badge),
        buttons: withKeys('hero-button', [
          { _type: 'ctaButton', label: ls(site.hero.primaryCta), href: '/#contact', style: 'primary' },
          { _type: 'ctaButton', label: ls(site.hero.secondaryCta), href: '/#about', style: 'secondary' },
        ]),
        features: withKeys(
          'hero-feature',
          site.hero.features.map((feature) => ({ _type: 'heroFeature', icon: feature.icon, label: ls(feature.label) })),
        ),
      },
      about: {
        _type: 'aboutSection',
        ...header(site.about.eyebrow, site.about.title),
        paragraphs: withKeys('about-paragraph', [lt(site.about.text)!]),
        image: await image(site.brand.aboutImage, site.about.imageAlt),
        pillars: withKeys(
          'about-pillar',
          site.about.pillars.map((pillar) => ({
            _type: 'aboutPillar',
            icon: pillar.icon,
            title: ls(pillar.title),
            text: ls(pillar.text),
          })),
        ),
      },
      services: { _type: 'servicesSection', ...header(site.servicesSection.eyebrow, site.servicesSection.title) },
      gallery: {
        _type: 'gallerySection',
        ...header(site.gallerySection.eyebrow, site.gallerySection.title, site.gallerySection.subtitle),
        showCategoryFilter: true,
      },
      stats: { _type: 'statsSection', ...header(undefined, site.stats.label) },
      sectors: {
        _type: 'sectorsSection',
        ...header(site.sectorsSection.eyebrow, site.sectorsSection.title, site.sectorsSection.subtitle),
      },
      featuredProducts: {
        _type: 'featuredProductsSection',
        ...header(site.productsSection.eyebrow, site.productsSection.title, site.productsSection.subtitle),
        products: featuredIds.map((id) => ({ _key: `featured-${id}`, ...ref(productIds.get(id)!) })),
        buttonLabel: ls(site.productsSection.cta),
      },
      branches: {
        _type: 'branchesSection',
        ...header(site.branchesSection.eyebrow, site.branchesSection.title, site.branchesSection.subtitle),
        showMap: true,
      },
      contact: {
        _type: 'contactSection',
        ...header(undefined, {
          ar: `${site.contact.titleStart.ar}\n${site.contact.titleHighlight.ar}`,
          en: `${site.contact.titleStart.en}\n${site.contact.titleHighlight.en}`,
        }, site.contact.text),
        image: await image(site.brand.ctaImage, site.brand.name),
      },
      footer: {
        _type: 'footerSection',
        visible: true,
        description: lt(site.footer.description),
        copyright: ls(site.footer.rights),
      },
    },
  })

  await upsert({
    id: 'seoHome',
    type: 'seoHome',
    data: { title: ls(site.metadata.title), description: lt(site.metadata.description) },
  })
  await upsert({
    id: 'seoProducts',
    type: 'seoProducts',
    data: { title: ls(site.metadata.productsTitle), description: lt(site.productsPage.subtitle) },
  })
  await upsert({
    id: 'seoBranches',
    type: 'seoBranches',
    data: { title: ls(site.metadata.branchesTitle), description: lt(site.branchesPage.subtitle) },
  })

  console.log('\nSummary')
  console.table(report)
  if (dryRun) console.log('Dry run only: nothing was written.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
