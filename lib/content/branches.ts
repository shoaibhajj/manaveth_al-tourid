import type { Localized } from '../i18n'
import { visibleSorted } from './types'

export type Place = {
  id: string
  kind: 'branch' | 'warehouse'
  name: Localized
  address: Localized
  /** Text or "lat,lng" used for the embedded map and the Google Maps link. Replace with exact coordinates. */
  mapQuery: string
  order: number
  visible?: boolean
}

export const places: Place[] = [
  {
    id: 'riyadh',
    kind: 'branch',
    name: { ar: 'الفرع الرئيسي - الرياض', en: 'Main Branch - Riyadh' },
    address: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
    mapQuery: 'Riyadh, Saudi Arabia',
    order: 1,
  },
  {
    id: 'jeddah',
    kind: 'branch',
    name: { ar: 'فرع جدة', en: 'Jeddah Branch' },
    address: { ar: 'جدة، المملكة العربية السعودية', en: 'Jeddah, Saudi Arabia' },
    mapQuery: 'Jeddah, Saudi Arabia',
    order: 2,
  },
]

export const getBranches = () => visibleSorted(places.filter((place) => place.kind === 'branch'))
export const getWarehouses = () => visibleSorted(places.filter((place) => place.kind === 'warehouse'))

export const getMapEmbedUrl = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`

export const getMapLinkUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
