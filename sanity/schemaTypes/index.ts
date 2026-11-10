import type { SchemaTypeDefinition } from 'sanity'
import { article } from './documents/articles'
import { catalogPage } from './documents/catalogPage'
import { companyPost } from './documents/companyPost'
import { customSection } from './documents/customSection'
import { place, product, productCategory, sector, service, stat } from './documents/cards'
import { brand, certificate, city, country } from './documents/taxonomy'
import { redirect } from './documents/redirect'
import { keywordCluster } from './documents/keywordCluster'
import { landingPage } from './documents/landingPage'
import { galleryCategory, galleryItem } from './documents/gallery'
import {
  aboutPage,
  certificationsPage,
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
  newsFeedSection,
  sectorsSection,
  servicesSection,
  statsSection,
} from './objects/home-sections'
import { contactPerson, ctaButton, link, priceTier, seo, socialLink, unitPrice, whatsappChannel } from './objects/shared'

/** Documents that exist exactly once. The Studio hides "create" and "delete" for them. */
export const singletonTypes = [
  'siteSettings',
  'aboutPage',
  'homePage',
  'catalogPage',
  'contactSettings',
  'visitorCounter',
  'seoHome',
  'seoProducts',
  'seoBranches',
  'certificationsPage',
]

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  aboutPage,
  homePage,
  catalogPage,
  contactSettings,
  visitorCounter,
  seoHome,
  seoProducts,
  seoBranches,
  certificationsPage,
  // Documents
  article,
  companyPost,
  customSection,
  service,
  sector,
  stat,
  productCategory,
  product,
  brand,
  country,
  city,
  certificate,
  place,
  redirect,
  keywordCluster,
  landingPage,
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
  newsFeedSection,
  servicesSection,
  gallerySection,
  statsSection,
  sectorsSection,
  featuredProductsSection,
  branchesSection,
  contactSection,
  footerSection,
]
