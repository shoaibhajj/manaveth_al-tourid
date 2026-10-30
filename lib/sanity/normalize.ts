import { stegaClean } from 'next-sanity'
import type { Localized } from '../i18n'
import type { Place } from '../content/branches'
import type { Card } from '../content/services'
import type { GalleryItem } from '../content/gallery'
import type { Product } from '../content/products'
import type { IconKey } from '../content/types'
import {
  staticContent,
  type CtaButton,
  type GalleryCategory,
  type PageSeo,
  type SectionKey,
  type SiteContent,
  type StatItem,
} from '../content/model'
import { imageUrl } from './image'

// Sanity documents are loosely typed on purpose: every field is optional and falls back to the built-in copy.
/* eslint-disable @typescript-eslint/no-explicit-any */
type Doc = Record<string, any>

const ICONS: IconKey[] = [
  'concierge',
  'store',
  'truck',
  'ship',
  'award',
  'globe',
  'shield',
  'handshake',
  'gem',
  'users',
  'container',
]

/** Removes the invisible stega markers that click-to-edit adds, for values the code interprets. */
const clean = (value: unknown): string => (typeof value === 'string' ? stegaClean(value) : '')
const filled = (value: unknown): value is string => clean(value).trim() !== ''

function localized(value: Doc | null | undefined, fallback: Localized): Localized {
  const ar = filled(value?.ar) ? (value!.ar as string) : undefined
  const en = filled(value?.en) ? (value!.en as string) : undefined
  if (!ar && !en) return fallback
  return { ar: ar ?? en!, en: en ?? ar! }
}

function optionalLocalized(value: Doc | null | undefined): Localized | undefined {
  const ar = filled(value?.ar) ? (value!.ar as string) : undefined
  const en = filled(value?.en) ? (value!.en as string) : undefined
  if (!ar && !en) return undefined
  return { ar: ar ?? en!, en: en ?? ar! }
}

const iconOf = (value: unknown, fallback: IconKey): IconKey => {
  const key = clean(value) as IconKey
  return ICONS.includes(key) ? key : fallback
}

const list = (value: unknown): Doc[] => (Array.isArray(value) ? (value as Doc[]) : [])
const isVisible = (doc: Doc | null | undefined) => doc?.visible !== false

function altOf(image: Doc | null | undefined, fallback: Localized): Localized {
  const alt = optionalLocalized(image?.alt)
  return alt ? { ar: clean(alt.ar), en: clean(alt.en) } : fallback
}

function buttons(value: unknown, fallback: CtaButton[]): CtaButton[] {
  const mapped = list(value)
    .filter((button) => optionalLocalized(button.label) && filled(button.href))
    .map((button, index): CtaButton => ({
      label: localized(button.label, { ar: '', en: '' }),
      href: clean(button.href),
      style: clean(button.style) === 'secondary' || (!button.style && index > 0) ? 'secondary' : 'primary',
    }))
  return mapped.length ? mapped : fallback
}

function sectionText<T extends Record<string, Localized>>(section: Doc | null | undefined, fallback: T): T {
  if (!section) return fallback
  return {
    ...fallback,
    ...('eyebrow' in fallback ? { eyebrow: localized(section.eyebrow, fallback.eyebrow) } : {}),
    ...('title' in fallback ? { title: localized(section.title, fallback.title) } : {}),
    ...('subtitle' in fallback ? { subtitle: localized(section.description, fallback.subtitle) } : {}),
  }
}

/** A title may carry a line break; the second line is the highlighted one. */
function titleLines(title: Localized): Localized[] {
  const arLines = title.ar.split('\n').map((line) => line.trim()).filter(Boolean)
  const enLines = title.en.split('\n').map((line) => line.trim()).filter(Boolean)
  const count = Math.max(arLines.length, enLines.length)
  if (count > 1) {
    return Array.from({ length: count }, (_, index) => ({
      ar: arLines[index] ?? arLines.at(-1) ?? '',
      en: enLines[index] ?? enLines.at(-1) ?? '',
    }))
  }
  const split = (text: string): [string, string] => {
    const words = text.split(/\s+/)
    if (words.length < 3) return [text, '']
    const head = Math.ceil(words.length / 2)
    return [words.slice(0, head).join(' '), words.slice(head).join(' ')]
  }
  const [arFirst, arSecond] = split(title.ar)
  const [enFirst, enSecond] = split(title.en)
  if (!arSecond && !enSecond) return [title]
  return [
    { ar: arFirst, en: enFirst },
    { ar: arSecond, en: enSecond },
  ]
}

function seo(doc: Doc | null | undefined, fallback: PageSeo): PageSeo {
  if (!doc) return fallback
  return {
    title: localized(doc.title, fallback.title),
    description: localized(doc.description, fallback.description),
    shareImage: imageUrl(doc.shareImage, 1200) ?? fallback.shareImage,
  }
}

function toCard(doc: Doc, index: number, fallbacks: Card[], defaults: { href: string; ctaLabel: Localized }): Card {
  const fallback = fallbacks[index] ?? fallbacks[0]
  const title = localized(doc.name, { ar: '', en: '' })
  return {
    id: doc._id,
    icon: doc.icon ? iconOf(doc.icon, 'concierge') : undefined,
    title,
    text: localized(doc.description, { ar: '', en: '' }),
    image: imageUrl(doc.image) ?? fallback?.image ?? staticContent.site.brand.heroImage,
    alt: altOf(doc.image, title),
    href: defaults.href,
    ctaLabel: defaults.ctaLabel,
    order: doc.order ?? index,
  }
}

function toPlace(doc: Doc, index: number): Place {
  const name = localized(doc.name, { ar: '', en: '' })
  const address = optionalLocalized(doc.address) ?? optionalLocalized(doc.city) ?? { ar: '', en: '' }
  const manager = doc.manager
  return {
    id: doc._id,
    kind: clean(doc.kind) === 'warehouse' ? 'warehouse' : 'branch',
    name,
    address,
    image: imageUrl(doc.image, 1200) ?? staticContent.site.brand.aboutImage,
    imageAlt: altOf(doc.image, name),
    phone: clean(doc.phone),
    email: filled(doc.email) ? clean(doc.email) : undefined,
    manager: manager && (optionalLocalized(manager.name) || filled(manager.phone))
      ? { name: localized(manager.name, { ar: '', en: '' }), phone: clean(manager.phone) }
      : undefined,
    mapQuery: clean(doc.mapQuery) || clean(address.en) || clean(address.ar),
    mapUrl: filled(doc.mapUrl) ? clean(doc.mapUrl) : undefined,
    order: doc.order ?? index,
  }
}

function toProduct(doc: Doc, index: number, featuredIds: Set<string>): Product {
  const name = localized(doc.name, { ar: '', en: '' })
  const showPrice = doc.showPrice !== false
  const tierDocs = list(doc.priceTiers).filter((tier) => typeof tier.price === 'number')
  const singleUnit = localized(doc.price?.unit, { ar: '', en: '' })
  const tierLabel = (tier: Doc): Localized => {
    const custom = optionalLocalized(tier.label)
    if (custom) return custom
    const unit = localized(tier.unit, singleUnit)
    const min = tier.minQuantity ?? 0
    const range = typeof tier.maxQuantity === 'number' ? `${min}–${tier.maxQuantity}` : `${min}+`
    return { ar: `${range} ${unit.ar}`.trim(), en: `${range} ${unit.en}`.trim() }
  }
  const tiers =
    showPrice && tierDocs.length
      ? {
          unit: localized(tierDocs[0].unit, singleUnit),
          items: tierDocs.map((tier) => ({ label: tierLabel(tier), amount: tier.price as number })),
        }
      : undefined
  const amount = doc.price?.amount
  const price = showPrice && !tiers && typeof amount === 'number' ? { amount, unit: singleUnit } : undefined
  return {
    id: doc._id,
    name,
    description: localized(doc.description, { ar: '', en: '' }),
    image: imageUrl(doc.image, 900) ?? staticContent.site.brand.heroImage,
    alt: altOf(doc.image, name),
    price,
    tiers,
    featured: featuredIds.has(doc._id) || doc.featured === true,
    order: doc.order ?? index,
  }
}

function toGalleryItem(doc: Doc, index: number): GalleryItem {
  const isVideo = clean(doc.mediaType) === 'video'
  const cover = imageUrl(isVideo ? (doc.poster ?? doc.image) : doc.image, 1400)
  const video = isVideo ? (doc.videoFileUrl ?? (filled(doc.videoUrl) ? clean(doc.videoUrl) : undefined)) : undefined
  return {
    id: doc._id,
    type: isVideo ? 'video' : 'image',
    src: cover ?? staticContent.site.brand.heroImage,
    videoSrc: video,
    alt: altOf(doc.image, localized(doc.alt, { ar: '', en: '' })),
    category: doc.categoryId ?? '',
    order: doc.order ?? index,
  }
}

export function normalizeContent(data: Doc | null | undefined): SiteContent {
  if (!data || (!data.settings && !data.home && !data.products?.length)) return staticContent

  const base = staticContent
  const settings: Doc = data.settings ?? {}
  const home: Doc = data.home ?? {}
  const contactDoc: Doc = data.contact ?? {}

  const sectionFlags = (Object.keys(base.sections) as SectionKey[]).reduce(
    (flags, key) => {
      const source: Doc | undefined = key === 'featuredProducts' ? home.featuredProducts : home[key]
      flags[key] = source ? isVisible(source) : true
      return flags
    },
    {} as Record<SectionKey, boolean>,
  )

  // Hero
  const hero: Doc = home.hero ?? {}
  const heroTitle = localized(hero.title, {
    ar: base.site.hero.titleLines.map((line) => line.ar).join('\n'),
    en: base.site.hero.titleLines.map((line) => line.en).join('\n'),
  })
  const mediaIsVideo = clean(hero.mediaType) === 'video'
  const videoSrc = hero.videoFileUrl ?? (filled(hero.videoUrl) ? clean(hero.videoUrl) : undefined)
  const heroFeatures = list(hero.features)
    .filter((feature) => optionalLocalized(feature.label))
    .map((feature, index) => ({
      icon: iconOf(feature.icon, base.site.hero.features[index]?.icon ?? 'concierge'),
      label: localized(feature.label, { ar: '', en: '' }),
    }))

  // About
  const about: Doc = home.about ?? {}
  const paragraphs = list(about.paragraphs)
    .map((paragraph) => optionalLocalized(paragraph))
    .filter((paragraph): paragraph is Localized => Boolean(paragraph))
  const pillars = list(about.pillars)
    .filter((pillar) => optionalLocalized(pillar.title))
    .map((pillar, index) => ({
      icon: iconOf(pillar.icon, base.site.about.pillars[index]?.icon ?? 'gem'),
      title: localized(pillar.title, { ar: '', en: '' }),
      text: localized(pillar.text, { ar: '', en: '' }),
    }))

  const aboutParagraphs = paragraphs.length
    ? paragraphs
    : [localized(about.description, base.site.about.text)]

  // Stats
  const stats: StatItem[] = list(data.stats)
    .filter(isVisible)
    .map((stat, index) => ({
      id: stat._id,
      icon: iconOf(stat.icon, base.site.stats.items[index]?.icon ?? 'award'),
      value: Number(stat.value) || 0,
      prefix: filled(stat.prefix) ? clean(stat.prefix) : undefined,
      suffix: filled(stat.suffix) ? clean(stat.suffix) : undefined,
      label: localized(stat.label, { ar: '', en: '' }),
    }))

  // Places
  const places = list(data.places).filter(isVisible).map(toPlace)
  const branches = places.filter((place) => place.kind === 'branch')
  const warehouses = places.filter((place) => place.kind === 'warehouse')
  const primary = branches[0]

  // Products
  const featuredIds = new Set<string>(list(home.featuredProducts?.productIds) as unknown as string[])
  const products = list(data.products).filter(isVisible).map((doc, index) => toProduct(doc, index, featuredIds))
  const featuredOrder = (home.featuredProducts?.productIds ?? []) as string[]
  const featuredProducts = featuredOrder.length
    ? featuredOrder.map((id) => products.find((product) => product.id === id)).filter((p): p is Product => Boolean(p))
    : products.filter((product) => product.featured)

  // Gallery
  const galleryDocs = list(data.galleryItems).filter(isVisible)
  const featuredDoc = galleryDocs.find((doc) => doc.featured === true)
  const galleryItems = galleryDocs.filter((doc) => doc !== featuredDoc).map(toGalleryItem)
  const galleryCategories: GalleryCategory[] = list(data.galleryCategories)
    .filter(isVisible)
    .map((category) => ({ id: category._id, label: localized(category.name, { ar: '', en: '' }) }))
  const featuredAlt = featuredDoc ? altOf(featuredDoc.image, localized(featuredDoc.alt, base.galleryFeatured.alt)) : undefined

  // Contact
  const whatsapp = (channel: Doc | undefined, fallback: typeof base.contact.whatsapp.quote) => ({
    number: filled(channel?.number) ? clean(channel!.number) : fallback.number,
    label: localized(channel?.name, fallback.label),
    shortLabel: localized(channel?.shortLabel, fallback.shortLabel),
    message: (() => {
      const message = localized(channel?.message, fallback.message)
      return { ar: clean(message.ar), en: clean(message.en) }
    })(),
  })
  const addressDoc = optionalLocalized(settings.address)
  const productMessage = optionalLocalized(contactDoc.productOrderMessage)

  const contactTitle = localized(home.contact?.title, {
    ar: `${base.site.contact.titleStart.ar}\n${base.site.contact.titleHighlight.ar}`,
    en: `${base.site.contact.titleStart.en}\n${base.site.contact.titleHighlight.en}`,
  })
  const contactLines = titleLines(contactTitle)

  const footerLinks = list(home.footer?.links).filter((link) => optionalLocalized(link.label) && filled(link.href))

  const productsSection = {
    ...sectionText(home.featuredProducts, base.site.productsSection),
    cta: localized(home.featuredProducts?.buttonLabel, base.site.productsSection.cta),
  }

  return {
    ...base,
    source: 'sanity',
    sections: sectionFlags,
    showMaps: home.branches?.showMap !== false,
    contactButtons: buttons(home.contact?.buttons, []),
    site: {
      ...base.site,
      brand: {
        ...base.site.brand,
        name: localized(settings.companyName, base.site.brand.name),
        subtitle: localized(settings.tagline, base.site.brand.subtitle),
        logo: imageUrl(settings.logo, 600) ?? base.site.brand.logo,
        aboutImage: imageUrl(about.image, 1400) ?? base.site.brand.aboutImage,
        ctaImage: imageUrl(home.contact?.image, 1400) ?? base.site.brand.ctaImage,
      },
      hero: {
        ...base.site.hero,
        titleLines: titleLines(heroTitle),
        subtitle: localized(hero.text, base.site.hero.subtitle),
        badge: localized(hero.badge, base.site.hero.badge),
        features: heroFeatures.length ? heroFeatures : base.site.hero.features,
        buttons: buttons(hero.buttons, base.site.hero.buttons),
        media: {
          type: mediaIsVideo && videoSrc ? 'video' : 'image',
          image: imageUrl(hero.image, 2000) ?? base.site.hero.media.image,
          video: mediaIsVideo ? videoSrc : undefined,
          poster: imageUrl(hero.videoPoster, 2000),
        },
      },
      about: {
        ...base.site.about,
        eyebrow: localized(about.eyebrow, base.site.about.eyebrow),
        title: localized(about.title, base.site.about.title),
        text: aboutParagraphs[0],
        paragraphs: aboutParagraphs,
        imageAlt: altOf(about.image, base.site.about.imageAlt),
        pillars: pillars.length ? pillars : base.site.about.pillars,
      },
      servicesSection: sectionText(home.services, base.site.servicesSection),
      productsSection,
      gallerySection: sectionText(home.gallery, base.site.gallerySection),
      sectorsSection: sectionText(home.sectors, base.site.sectorsSection),
      branchesSection: sectionText(home.branches, base.site.branchesSection),
      stats: {
        label: localized(home.stats?.title, base.site.stats.label),
        items: stats,
      },
      contact: {
        ...base.site.contact,
        titleStart: contactLines[0] ?? base.site.contact.titleStart,
        titleHighlight: contactLines[1] ?? { ar: '', en: '' },
        text: localized(home.contact?.description, base.site.contact.text),
      },
      footer: {
        ...base.site.footer,
        description: localized(home.footer?.description, base.site.footer.description),
        rights: localized(home.footer?.copyright, base.site.footer.rights),
      },
      footerLinks: footerLinks.map((link) => ({
        label: localized(link.label, { ar: '', en: '' }),
        href: clean(link.href),
      })),
    },
    contact: {
      phone: clean(settings.phone) || primary?.phone || base.contact.phone,
      email: clean(settings.email) || base.contact.email,
      address: addressDoc ?? (primary?.address.ar ? primary.address : base.contact.address),
      whatsapp: {
        quote: whatsapp(contactDoc.whatsappQuote, base.contact.whatsapp.quote),
        orders: whatsapp(contactDoc.whatsappOrders, base.contact.whatsapp.orders),
      },
      productOrderMessage: productMessage
        ? { ar: clean(productMessage.ar), en: clean(productMessage.en) }
        : base.contact.productOrderMessage,
      social: list(settings.socialLinks)
        .filter((link) => filled(link.url))
        .map((link) => ({ platform: clean(link.platform), url: clean(link.url) })),
    },
    currency: localized(settings.currency, base.currency),
    products,
    featuredProducts,
    branches,
    warehouses,
    galleryCategories,
    galleryFeatured: featuredDoc
      ? {
          ...base.galleryFeatured,
          src: imageUrl(featuredDoc.image, 1800) ?? base.galleryFeatured.src,
          alt: featuredAlt ?? base.galleryFeatured.alt,
          caption: featuredAlt ?? base.galleryFeatured.caption,
        }
      : base.galleryFeatured,
    galleryItems,
    showCategoryFilter: home.gallery?.showCategoryFilter !== false,
    services: list(data.services)
      .filter(isVisible)
      .map((doc, index) =>
        toCard(doc, index, base.services, { href: '/#contact', ctaLabel: { ar: 'اطلب الخدمة', en: 'Request this service' } }),
      ),
    sectors: list(data.sectors)
      .filter(isVisible)
      .map((doc, index) => toCard(doc, index, base.sectors, { href: '/#contact', ctaLabel: base.site.ui.requestQuote })),
    seo: {
      home: seo(data.seoHome ?? settings.defaultSeo, base.seo.home),
      products: seo(data.seoProducts, base.seo.products),
      branches: seo(data.seoBranches, base.seo.branches),
    },
    favicon: imageUrl(settings.favicon, 256),
  }
}
