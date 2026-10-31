import type { SchemaTypeDefinition } from 'sanity'
import { article } from './documents/articles'
import { place, product, productCategory, sector, service, stat } from './documents/cards'
import { galleryCategory, galleryItem } from './documents/gallery'
import {
  contactSettings,
  homePage,
  seoBranches,
  seoHome,
  seoProducts,
  siteSettings,
  visitorCounter,
} from './documents/singletons'
import { localizedImage, localizedString, localizedText } from './objects/localized'
import {
  aboutSection,
  branchesSection,
  contactSection,
  featuredProductsSection,
  footerSection,
  gallerySection,
  heroSection,
  sectorsSection,
  servicesSection,
  statsSection,
} from './objects/home-sections'
import { contactPerson, ctaButton, link, priceTier, seo, socialLink, unitPrice, whatsappChannel } from './objects/shared'

/** Documents that exist exactly once. The Studio hides "create" and "delete" for them. */
export const singletonTypes = [
  'siteSettings',
  'homePage',
  'contactSettings',
  'visitorCounter',
  'seoHome',
  'seoProducts',
  'seoBranches',
] as const

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singleton documents
  siteSettings,
  homePage,
  contactSettings,
  visitorCounter,
  seoHome,
  seoProducts,
  seoBranches,
  // Repeatable documents
  article,
  service,
  sector,
  stat,
  productCategory,
  product,
  place,
  galleryCategory,
  galleryItem,
  // Objects
  localizedString,
  localizedText,
  localizedImage,
  seo,
  link,
  ctaButton,
  socialLink,
  contactPerson,
  whatsappChannel,
  unitPrice,
  priceTier,
  heroSection,
  aboutSection,
  servicesSection,
  gallerySection,
  statsSection,
  sectorsSection,
  featuredProductsSection,
  branchesSection,
  contactSection,
  footerSection,
]
