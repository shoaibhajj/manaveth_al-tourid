/**
 * G2: Entity Knowledge Graph (Wikidata Identifiers):
 * Authoritative disambiguation of food wholesale concepts and regions
 * to establish clear semantic relationships in search engine knowledge graphs.
 */

export type EntityDefinition = {
  name: { ar: string; en: string }
  wikidataId?: string
  sameAs?: string
  description?: { ar: string; en: string }
}

export const ENTITIES = {
  saudiArabia: {
    name: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' },
    wikidataId: 'Q858',
    sameAs: 'https://www.wikidata.org/wiki/Q858',
  },
  riyadh: {
    name: { ar: 'الرياض', en: 'Riyadh' },
    wikidataId: 'Q3692',
    sameAs: 'https://www.wikidata.org/wiki/Q3692',
  },
  jeddah: {
    name: { ar: 'جدة', en: 'Jeddah' },
    wikidataId: 'Q374365',
    sameAs: 'https://www.wikidata.org/wiki/Q374365',
  },
  wholesale: {
    name: { ar: 'تجارة الجملة', en: 'Wholesale' },
    wikidataId: 'Q1549591',
    sameAs: 'https://www.wikidata.org/wiki/Q1549591',
  },
  foodSupply: {
    name: { ar: 'سلسلة إمداد الغذاء والتموين', en: 'Food supply chain' },
    wikidataId: 'Q126227',
    sameAs: 'https://www.wikidata.org/wiki/Q126227',
  },
  foodservice: {
    name: { ar: 'خدمات التغذية والإعاشة والفندقة', en: 'Foodservice' },
    wikidataId: 'Q1435520',
    sameAs: 'https://www.wikidata.org/wiki/Q1435520',
  },
  halal: {
    name: { ar: 'الذبح والأغذية الحلال', en: 'Halal food' },
    wikidataId: 'Q176766',
    sameAs: 'https://www.wikidata.org/wiki/Q176766',
  },
  beef: {
    name: { ar: 'لحم بقري', en: 'Beef' },
    wikidataId: 'Q10990',
    sameAs: 'https://www.wikidata.org/wiki/Q10990',
  },
  poultry: {
    name: { ar: 'دواجن مجمدة', en: 'Poultry meat' },
    wikidataId: 'Q179678',
    sameAs: 'https://www.wikidata.org/wiki/Q179678',
  },
  basmatiRice: {
    name: { ar: 'أرز بسمتي هندي', en: 'Basmati rice' },
    wikidataId: 'Q810356',
    sameAs: 'https://www.wikidata.org/wiki/Q810356',
  },
  dates: {
    name: { ar: 'تمور فاخرة', en: 'Dates' },
    wikidataId: 'Q1652',
    sameAs: 'https://www.wikidata.org/wiki/Q1652',
  },
  cookingOil: {
    name: { ar: 'زيوت الطعام التموينية', en: 'Cooking oil' },
    wikidataId: 'Q211756',
    sameAs: 'https://www.wikidata.org/wiki/Q211756',
  },
} as const

/**
 * Builds Schema.org entity reference with `@type: Thing`, `name`, and Wikidata `sameAs` link.
 */
export function entityThing(entityKey: keyof typeof ENTITIES, locale: 'ar' | 'en' = 'ar') {
  const e = ENTITIES[entityKey]
  if (!e) return undefined
  return {
    '@type': 'Thing',
    name: e.name[locale] || e.name.ar,
    sameAs: e.sameAs,
  }
}
