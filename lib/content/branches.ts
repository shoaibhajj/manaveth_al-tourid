import type { Localized } from '../i18n'
import { contact } from './contact'
import { visibleSorted } from './types'

export type PlaceManager = {
  name: Localized
  /** International or local format. Leave empty until the number is provided. */
  phone: string
}

export type Place = {
  id: string
  kind: 'branch' | 'warehouse'
  name: Localized
  address: Localized
  mediaType?: 'image' | 'video'
  image: string
  imageAlt: Localized
  videoUrl?: string
  videoPoster?: string
  imageFit?: 'cover' | 'contain'
  imagePosition?: 'top' | 'center' | 'bottom'
  aspectRatio?: '16/10' | '4/3' | '1/1' | '16/9'
  hotspot?: { x: number; y: number }
  /** Leave empty until the number is provided. */
  phone: string
  email?: string
  /** Employee in charge. Mostly used for warehouses. */
  manager?: PlaceManager
  /** Text or "lat,lng" used for the embedded map and the Google Maps link. Replace with exact coordinates. */
  mapQuery: string
  /** Optional Google Maps share link. It replaces the generated link when present. */
  mapUrl?: string
  /** Direct link for customers to post 5-star Google Maps reviews */
  reviewUrl?: string
  order: number
  visible?: boolean
}

export const places: Place[] = [
  {
    id: 'riyadh',
    kind: 'branch',
    name: { ar: 'الفرع الرئيسي - الرياض', en: 'Main Branch - Riyadh' },
    address: {
      ar: 'مكتب شركة منافذ التوريد التجارية، طريق الحائر، الدار البيضاء، الرياض 14519، المملكة العربية السعودية',
      en: 'Mnaveth ALTourid Trading Office, Al Hair Road, Al Dar Al Baida, Riyadh 14519, Saudi Arabia',
    },
    image: '/images/branch-riyadh.png',
    imageAlt: { ar: 'واجهة الفرع الرئيسي في الرياض', en: 'Exterior of the main branch in Riyadh' },
    imagePosition: 'top',
    aspectRatio: '1/1',
    phone: '+966509971699',
    email: contact.email,
    mapQuery: 'طريق الحائر، الدار البيضاء، الرياض 14519 المملكة العربية السعودية',
    mapUrl: 'https://maps.app.goo.gl/51haFKyZQLDaHPaC8',
    reviewUrl: 'https://maps.app.goo.gl/51haFKyZQLDaHPaC8',
    order: 1,
  },
  {
    id: 'jeddah',
    kind: 'branch',
    name: { ar: 'فرع جدة والمنطقة الغربية', en: 'Jeddah & Western Province Branch' },
    address: {
      ar: 'جدة، المملكة العربية السعودية',
      en: 'Jeddah, Saudi Arabia',
    },
    image: '/images/branch-jeddah.png',
    imageAlt: { ar: 'واجهة فرع جدة', en: 'Exterior of the Jeddah branch' },
    imagePosition: 'top',
    aspectRatio: '4/3',
    phone: '+966509971699',
    email: contact.email,
    mapQuery: 'Jeddah, Saudi Arabia',
    mapUrl: 'https://maps.google.com/?q=21.5433,39.1728',
    reviewUrl: 'https://maps.google.com/?q=21.5433,39.1728',
    order: 2,
  },
  {
    id: 'warehouse-riyadh',
    kind: 'warehouse',
    name: { ar: 'المستودع الرئيسي - الرياض', en: 'Main Warehouse - Riyadh' },
    address: {
      ar: 'المنطقة الصناعية، الرياض، المملكة العربية السعودية',
      en: 'Industrial Area, Riyadh, Saudi Arabia',
    },
    image: '/images/warehouse-main.png',
    imageAlt: { ar: 'المستودع الرئيسي مع منصات التحميل', en: 'The main warehouse with loading docks' },
    imagePosition: 'top',
    aspectRatio: '16/10',
    phone: '+966509971699',
    manager: {
      name: { ar: 'إدارة العمليات والتوريد المركزية', en: 'Central Operations & Logistics' },
      phone: '+966509971699',
    },
    mapQuery: 'Riyadh Industrial Area, Saudi Arabia',
    order: 1,
  },
]

export const getBranches = () => visibleSorted(places.filter((place) => place.kind === 'branch'))
export const getWarehouses = () => visibleSorted(places.filter((place) => place.kind === 'warehouse'))

export const getMapEmbedUrl = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`

export const getMapLinkUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
