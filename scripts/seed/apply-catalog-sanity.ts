import { createClient } from '@sanity/client'
import { defaultCatalogProducts, supportingCommodities } from '../../lib/content/catalog-data'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
const apply = process.argv.includes('--apply')

const keywordMap: Record<string, { ar: string[]; en: string[] }> = {
  'frozen-liver-classic': {
    ar: ['توريد كبدة كلاسيك بالجملة للمطاعم', 'كبدة ضأن أسترالية توماس فودز'],
    en: ['Thomas Foods Classic lamb liver wholesale supplier', 'Australian Thomas Foods ovine liver for foodservice'],
  },
  'frozen-liver-johny-gold': {
    ar: ['كبدة جوني جولد بالجملة', 'توريد كبدة جوني جولد للمطاعم'],
    en: ['Johny Gold frozen liver wholesale supplier', 'Johny Gold liver for restaurants and foodservice'],
  },
  'frozen-brain': {
    ar: ['مخ عجل وضأن مجمد بالجملة للمطاعم', 'توريد مخ مجمد للمطاعم والفنادق'],
    en: ['Wholesale frozen veal and lamb brain supplier', 'Frozen brain for restaurants and hotels'],
  },
  'frozen-tongue': {
    ar: ['لسان بقري وعجل مجمد بالجملة', 'توريد لسان بقري للمطاعم'],
    en: ['Wholesale frozen beef and veal tongue supplier', 'Frozen beef tongue for restaurants and foodservice'],
  },
  'frozen-ribs-wagstaff': {
    ar: ['ريش ضأن أسترالي بالجملة للمطاعم', 'توريد ريش ضأن للمطاعم والفنادق'],
    en: ['Australian lamb rack ribs wholesale supplier', 'Wholesale frozen lamb ribs for restaurants and hotels'],
  },
}

const clusters = [
  {
    _id: 'keyword-meat-specialties',
    _type: 'keywordCluster',
    name: 'توريد أصناف اللحوم التخصصية للمطاعم',
    intent: 'transactional',
    targetUrl: '/meat-supply',
    primaryKeyword: 'توريد لحوم تخصصية بالجملة للمطاعم',
    variations: ['لحوم مجمدة بالجملة للمطاعم', 'wholesale specialty meats Saudi Arabia'],
    recommendedH2: ['الأصناف التخصصية المتاحة', 'التوريد بالجملة للمطاعم والفنادق'],
    recommendedAnchors: ['استعرض كتالوج اللحوم', 'اطلب عرض سعر للتوريد'],
  },
  {
    _id: 'keyword-supporting-commodities',
    _type: 'keywordCluster',
    name: 'المواد التموينية المساندة للمطاعم',
    intent: 'commercial',
    targetUrl: '/catalog',
    primaryKeyword: 'مواد تموينية للمطاعم بالجملة',
    variations: ['أرز وطحين وزيوت للمطاعم', 'foodservice commodities wholesale Saudi Arabia'],
    recommendedH2: ['فئات تموينية مساندة للمطابخ', 'طلب توريد أصناف متعددة'],
    recommendedAnchors: ['اطلب توريد المواد التموينية', 'تعرف على أصناف التوريد بالجملة'],
  },
]

function localizedPhrases(slug: string) {
  const phrases = keywordMap[slug]
  return phrases.ar.map((ar, index) => ({
    _key: `${slug}-phrase-${index + 1}`,
    _type: 'localizedString',
    ar,
    en: phrases.en[index],
  }))
}

function commodityPayload() {
  return supportingCommodities.map((item) => ({
    _key: item.id,
    _type: 'object',
    id: item.id,
    name: { _type: 'localizedString', ...item.name },
    description: { _type: 'localizedText', ...item.description },
    icon: item.icon,
    packagingSummary: { _type: 'localizedString', ...item.packagingSummary },
    sampleItems: item.sampleItems.ar.map((ar, index) => ({
      _key: `${item.id}-example-${index + 1}`,
      _type: 'localizedString',
      ar,
      en: item.sampleItems.en[index] || ar,
    })),
  }))
}

async function main() {
  if (!projectId || !dataset) throw new Error('Set SANITY_PROJECT_ID and SANITY_DATASET before applying this migration.')
  if (apply && !token) throw new Error('Set SANITY_API_WRITE_TOKEN in the environment before using --apply.')

  const client = createClient({
    projectId,
    dataset,
    token: apply ? token : undefined,
    useCdn: false,
    apiVersion: '2025-01-01',
  })
  const core = defaultCatalogProducts.filter((product) => product.isCoreSpecialty)
  const planned = core.map((product) => {
    const slug = product.slug || product.id
    return {
      _id: `product-${slug}`,
      _type: 'product',
      name: { _type: 'localizedString', ...product.name },
      slug: { _type: 'slug', current: slug },
      sku: product.sku,
      productType: 'meat',
      description: { _type: 'localizedText', ...product.description },
      origin: { _type: 'localizedString', ...product.origin },
      packaging: { _type: 'localizedString', ...product.packaging },
      storage: { _type: 'localizedText', ...product.storage },
      certifications: { _type: 'localizedText', ...product.certifications },
      usage: product.usage ? { _type: 'localizedText', ...product.usage } : undefined,
      storageState: 'frozen',
      category: { _type: 'reference', _ref: 'category-meat-poultry' },
      isCoreSpecialty: true,
      targetPhrases: localizedPhrases(slug),
      order: product.order,
      visible: true,
    }
  })

  console.log(`${apply ? 'Applying' : 'Dry run'} catalog update to ${projectId}/${dataset}`)
  console.log(`Core product documents: ${planned.map((item) => item.slug.current).join(', ')}`)
  console.log(`Supporting commodity groups: ${supportingCommodities.length}; keyword clusters: ${clusters.length}`)
  if (!apply) {
    console.log('No writes made. Re-run with --apply and SANITY_API_WRITE_TOKEN to create missing core products and fill missing catalog fields.')
    return
  }

  for (const product of planned) {
    const existingId = await client.fetch<string | null>(
      '*[_type == "product" && slug.current == $slug][0]._id',
      { slug: product.slug.current },
    )
    if (existingId) {
      const { _id, _type, ...fields } = product
      await client.patch(existingId).setIfMissing(fields).set({ isCoreSpecialty: true }).commit()
      console.log(`Updated missing catalog fields: ${existingId}`)
    } else {
      await client.createIfNotExists(product as any)
      console.log(`Created core catalog product: ${product._id}`)
    }
  }

  const catalog = await client.getDocument('catalogPage')
  if (!catalog) throw new Error('The catalogPage singleton was not found; refusing to create an unlinked replacement.')
  await client.patch(catalog._id).setIfMissing({ supportingCommodities: commodityPayload() }).commit()

  for (const cluster of clusters) await client.createIfNotExists(cluster as any)
  console.log('Catalog migration applied. Review product photos and publish the Studio schema before editing these fields.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
