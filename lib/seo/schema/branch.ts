import type { Locale } from '@/lib/i18n'
import { compact, t, absoluteUrl } from './helpers'

export function buildBranchSchema(branch: any, locale: Locale, base: string) {
  const isAr = locale === 'ar'
  const branchId = `${base}/#branch-${branch.id}`
  const branchUrl = `${base}${isAr ? '' : '/en'}/branches#branch-${branch.id}`

  // Parse real coordinates from mapQuery if formatted as "lat,lng"
  let geo: any = undefined
  if (branch.mapQuery && branch.mapQuery.includes(',')) {
    const parts = branch.mapQuery.split(',').map((p: string) => parseFloat(p.trim()))
    if (!isNaN(parts[0]) && !isNaN(parts[1])) {
      geo = {
        '@type': 'GeoCoordinates',
        latitude: parts[0],
        longitude: parts[1],
      }
    }
  }

  const streetAddress = t(branch.address, locale)
  const cityName = t(branch.city, locale)

  return compact({
    '@type': ['WholesaleStore', 'LocalBusiness'],
    '@id': branchId,
    name: `${isAr ? 'شركة منافذ التوريد' : 'Mnaveth ALTourid'} - ${t(branch.name, locale)}`,
    legalName: 'شركة منافذ التوريد للتجارة',
    url: branchUrl,
    image: branch.image ? absoluteUrl(branch.image, base) : undefined,
    telephone: branch.phone || '+966509971699',
    email: branch.email || 'info@mnafeth.com',
    priceRange: '$$',
    currenciesAccepted: 'SAR',
    paymentAccepted: 'Bank Transfer, Credit Card, Cash',
    address: streetAddress || cityName ? {
      '@type': 'PostalAddress',
      streetAddress: streetAddress || undefined,
      addressLocality: cityName || (isAr ? 'الرياض' : 'Riyadh'),
      addressCountry: 'SA',
    } : undefined,
    geo,
    hasMap: branch.mapUrl || undefined,
    parentOrganization: {
      '@id': `${base}/#organization`,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
  })
}
