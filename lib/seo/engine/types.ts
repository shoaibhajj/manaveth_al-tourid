import type { Locale, Localized } from '@/lib/i18n'

export type ProductTypeKey =
  | 'meat'
  | 'poultry'
  | 'rice'
  | 'oil'
  | 'dates'
  | 'canned'
  | 'frozenVeg'
  | 'packaging'

export type ProductDoc = {
  _id?: string
  name: Localized
  slug: string
  sku?: string
  productType?: ProductTypeKey | string
  description?: Localized
  longDescription?: Localized
  image?: any
  gallery?: Array<{ assetUrl?: string; alt?: Localized }>
  brand?: { _id?: string; name: Localized; slug?: string }
  category?: { _id?: string; name: Localized; slug?: string }
  originCountries?: Array<{ _id?: string; name: Localized; code?: string }>
  serviceAreas?: Array<{ _id?: string; name: Localized }>
  sectors?: Array<{ _id?: string; name: Localized }>
  certificates?: Array<{ _id?: string; name: Localized; issuer?: Localized }>
  cuts?: Array<{ name: Localized; description?: Localized; usage?: Localized }>
  packSizes?: Array<{ weight?: number; unit?: Localized; packageType?: Localized }>
  storageState?: 'frozen' | 'chilled' | 'ambient' | string
  moq?: { amount?: number; unit?: Localized }
  availability?: 'InStock' | 'PreOrder' | 'OutOfStock' | string
  priceValidUntil?: string
  showPrice?: boolean
  price?: { amount: number; unit?: Localized }
  priceTiers?: Array<{ label: Localized; amount: number }>
  // Legacy fields
  origin?: Localized
  aging?: Localized
  grainType?: Localized
  packaging?: Localized
  storage?: Localized
  certifications?: Localized
  usage?: Localized
  faqs?: Array<{ question?: Localized; answer?: Localized }>
  seo?: {
    title?: Localized
    description?: Localized
    shareImage?: any
  }
  visible?: boolean
  _updatedAt?: string
}

export type SiteSeoContext = {
  baseUrl: string
  brandName: Localized
}

export type BreadcrumbItem = {
  name: string
  url: string
}

export type SpecRow = {
  label: string
  value: string
}

export type AutoFaqItem = {
  question: string
  answer: string
}

export type SeoEvaluationResult = {
  isIndexable: boolean
  missingFields: string[]
  score: number
  reasons: string[]
}

export type ProductSeoResult = {
  title: string
  description: string
  h1: string
  canonical: string
  alternates: {
    canonical: string
    languages: Record<string, string>
  }
  openGraph: {
    title: string
    description: string
    url: string
    siteName: string
    locale: string
    images: Array<{ url: string; alt?: string }>
  }
  robots: {
    index: boolean
    follow: boolean
  }
  evaluation: SeoEvaluationResult
  breadcrumbs: BreadcrumbItem[]
  specRows: SpecRow[]
  autoFaqs: AutoFaqItem[]
}
