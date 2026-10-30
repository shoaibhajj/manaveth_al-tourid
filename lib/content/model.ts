import type { Localized } from '../i18n'
import { places, type Place } from './branches'
import { contact } from './contact'
import { galleryCategories, galleryFeatured, galleryItems, type GalleryItem } from './gallery'
import { currency, products, type Product } from './products'
import { sectors } from './sectors'
import { services, type Card } from './services'
import { site } from './site'
import { visibleSorted, type IconKey } from './types'

export type CtaButton = { label: Localized; href: string; style: 'primary' | 'secondary' }

export type HeroMedia = {
  type: 'image' | 'video'
  image: string
  video?: string
  poster?: string
}

export type HeroData = Omit<typeof site.hero, 'features' | 'titleLines'> & {
  titleLines: Localized[]
  features: { icon: IconKey; label: Localized }[]
  buttons: CtaButton[]
  media: HeroMedia
}

export type AboutData = Omit<typeof site.about, 'pillars'> & {
  paragraphs: Localized[]
  pillars: { icon: IconKey; title: Localized; text: Localized }[]
}

export type StatItem = { id: string; icon: IconKey; value: number; prefix?: string; suffix?: string; label: Localized }

export type SiteData = Omit<typeof site, 'hero' | 'about' | 'stats'> & {
  hero: HeroData
  about: AboutData
  stats: { label: Localized; items: StatItem[] }
  /** Footer quick links. Empty means the built-in navigation links are used. */
  footerLinks: { label: Localized; href: string }[]
}

export type SocialLink = { platform: string; url: string }

export type ContactData = {
  phone: string
  email: string
  address: Localized
  whatsapp: typeof contact.whatsapp
  productOrderMessage: Localized
  social: SocialLink[]
}

export type GalleryCategory = { id: string; label: Localized }

export type PageSeo = { title: Localized; description: Localized; shareImage?: string }

export type SectionKey =
  | 'about'
  | 'services'
  | 'gallery'
  | 'stats'
  | 'sectors'
  | 'featuredProducts'
  | 'branches'
  | 'contact'

export type SiteContent = {
  sections: Record<SectionKey, boolean>
  showMaps: boolean
  contactButtons: CtaButton[]
  site: SiteData
  contact: ContactData
  currency: Localized
  products: Product[]
  featuredProducts: Product[]
  branches: Place[]
  warehouses: Place[]
  galleryCategories: GalleryCategory[]
  galleryFeatured: typeof galleryFeatured
  galleryItems: GalleryItem[]
  showCategoryFilter: boolean
  services: Card[]
  sectors: Card[]
  seo: { home: PageSeo; products: PageSeo; branches: PageSeo }
  favicon?: string
  /** Where the content came from. "fallback" means the built-in copy is in use. */
  source: 'sanity' | 'fallback'
}

const navItemsToKeep = site.nav

const staticSite: SiteData = {
  ...site,
  nav: navItemsToKeep,
  hero: {
    ...site.hero,
    titleLines: site.hero.titleLines,
    features: site.hero.features,
    buttons: [
      { label: site.hero.primaryCta, href: '/#contact', style: 'primary' },
      { label: site.hero.secondaryCta, href: '/#about', style: 'secondary' },
    ],
    media: { type: 'image', image: site.brand.heroImage },
  },
  about: {
    ...site.about,
    paragraphs: [site.about.text],
    pillars: site.about.pillars,
  },
  stats: {
    label: site.stats.label,
    items: site.stats.items.map((item) => ({ ...item, id: item.icon })),
  },
  footerLinks: [],
}

export const staticContent: SiteContent = {
  sections: {
    about: true,
    services: true,
    gallery: true,
    stats: true,
    sectors: true,
    featuredProducts: true,
    branches: true,
    contact: true,
  },
  showMaps: true,
  contactButtons: [],
  site: staticSite,
  contact: {
    phone: contact.phone,
    email: contact.email,
    address: contact.address,
    whatsapp: contact.whatsapp,
    productOrderMessage: contact.productOrderMessage,
    social: [],
  },
  currency,
  products: visibleSorted(products),
  featuredProducts: visibleSorted(products).filter((product) => product.featured),
  branches: visibleSorted(places.filter((place) => place.kind === 'branch')),
  warehouses: visibleSorted(places.filter((place) => place.kind === 'warehouse')),
  galleryCategories,
  galleryFeatured,
  galleryItems: visibleSorted(galleryItems),
  showCategoryFilter: true,
  services: visibleSorted(services),
  sectors: visibleSorted(sectors),
  seo: {
    home: { title: site.metadata.title, description: site.metadata.description },
    products: { title: site.metadata.productsTitle, description: site.productsPage.subtitle },
    branches: { title: site.metadata.branchesTitle, description: site.branchesPage.subtitle },
  },
  source: 'fallback',
}
