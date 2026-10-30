export type Branch = {
  id: string
  name: string
  address: string
  /** Text or "lat,lng" used for the embedded map and the Google Maps link. Replace with the exact branch coordinates. */
  mapQuery: string
}

export const branches: Branch[] = [
  {
    id: 'riyadh',
    name: 'الفرع الرئيسي - الرياض',
    address: 'الرياض، المملكة العربية السعودية',
    mapQuery: 'Riyadh, Saudi Arabia',
  },
  {
    id: 'jeddah',
    name: 'فرع جدة',
    address: 'جدة، المملكة العربية السعودية',
    mapQuery: 'Jeddah, Saudi Arabia',
  },
]

export const getMapEmbedUrl = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`

export const getMapLinkUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
