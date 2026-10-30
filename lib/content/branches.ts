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
  image: string
  imageAlt: Localized
  /** Leave empty until the number is provided. */
  phone: string
  email?: string
  /** Employee in charge. Mostly used for warehouses. */
  manager?: PlaceManager
  /** Text or "lat,lng" used for the embedded map and the Google Maps link. Replace with exact coordinates. */
  mapQuery: string
  /** Optional Google Maps share link. It replaces the generated link when present. */
  mapUrl?: string
  order: number
  visible?: boolean
}

export const places: Place[] = [
  {
    id: 'riyadh',
    kind: 'branch',
    name: { ar: 'الفرع الرئيسي - الرياض', en: 'Main Branch - Riyadh' },
    address: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
    image: '/images/branch-riyadh.png',
    imageAlt: { ar: 'واجهة الفرع الرئيسي في الرياض', en: 'Exterior of the main branch in Riyadh' },
    phone: '',
    email: contact.email,
    mapQuery: 'Riyadh, Saudi Arabia',
    order: 1,
  },
  {
    id: 'jeddah',
    kind: 'branch',
    name: { ar: 'فرع جدة', en: 'Jeddah Branch' },
    address: { ar: 'جدة، المملكة العربية السعودية', en: 'Jeddah, Saudi Arabia' },
    image: '/images/branch-jeddah.png',
    imageAlt: { ar: 'واجهة فرع جدة', en: 'Exterior of the Jeddah branch' },
    phone: '',
    email: contact.email,
    mapQuery: 'Jeddah, Saudi Arabia',
    order: 2,
  },
  {
    id: 'warehouse-riyadh',
    kind: 'warehouse',
    name: { ar: 'المستودع الرئيسي - الرياض', en: 'Main Warehouse - Riyadh' },
    address: { ar: 'المنطقة الصناعية، الرياض', en: 'Industrial Area, Riyadh' },
    image: '/images/warehouse-main.png',
    imageAlt: { ar: 'المستودع الرئيسي مع منصات التحميل', en: 'The main warehouse with loading docks' },
    phone: '',
    manager: {
      name: { ar: 'اسم المسؤول', en: 'Manager name' },
      phone: '',
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
