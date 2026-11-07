import type { Locale } from '@/lib/i18n'
import { ENTITIES } from '../entities'
import { compact, t, absoluteUrl } from './helpers'

export function buildOrganizationSchema(site: any, locale: Locale, base: string) {
  const isAr = locale === 'ar'
  const orgId = `${base}/#organization`
  const social = (site.contact?.social || []).map((s: any) => s.url).filter(Boolean)

  return compact({
    '@type': 'Organization',
    '@id': orgId,
    name: isAr ? 'شركة منافذ التوريد للتجارة' : 'Mnaveth ALTourid Trading Co.',
    alternateName: ['منافذ التوريد', 'Mnaveth ALTourid', 'Mnaveth'],
    legalName: 'شركة منافذ التوريد للتجارة',
    url: base,
    logo: absoluteUrl(site.brand?.logo || '/images/hero.png', base),
    image: absoluteUrl(site.brand?.ctaImage || '/images/hero.png', base),
    telephone: site.contact?.phone || '+966509971699',
    email: site.contact?.email || 'info@mnafeth.com',
    foundingDate: '2004',
    identifier: site.brand?.commercialRegistration || '1116011768',
    taxID: site.brand?.taxId || undefined,
    vatID: site.brand?.taxId ? `VAT ${site.brand.taxId}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: t(site.contact?.address, locale) || (isAr ? 'طريق الخرج، حي المنصورة' : 'Al Kharj Road, Al Mansourah'),
      addressLocality: isAr ? 'الرياض' : 'Riyadh',
      addressRegion: isAr ? 'منطقة الرياض' : 'Riyadh Province',
      postalCode: '12684',
      addressCountry: 'SA',
    },
    // G2: Disambiguation with Wikidata Knowledge Graph
    knowsAbout: [
      { '@type': 'Thing', name: ENTITIES.wholesale.name[locale], sameAs: ENTITIES.wholesale.sameAs },
      { '@type': 'Thing', name: ENTITIES.foodSupply.name[locale], sameAs: ENTITIES.foodSupply.sameAs },
      { '@type': 'Thing', name: ENTITIES.foodservice.name[locale], sameAs: ENTITIES.foodservice.sameAs },
      { '@type': 'Thing', name: ENTITIES.halal.name[locale], sameAs: ENTITIES.halal.sameAs },
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: ENTITIES.saudiArabia.name[locale], sameAs: ENTITIES.saudiArabia.sameAs },
      { '@type': 'City', name: ENTITIES.riyadh.name[locale], sameAs: ENTITIES.riyadh.sameAs },
      { '@type': 'City', name: ENTITIES.jeddah.name[locale], sameAs: ENTITIES.jeddah.sameAs },
    ],
    sameAs: social.length > 0 ? social : undefined,
  })
}

export function buildWebsiteSchema(base: string, locale: Locale) {
  const isAr = locale === 'ar'
  return compact({
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: isAr ? 'شركة منافذ التوريد' : 'Mnaveth ALTourid',
    publisher: { '@id': `${base}/#organization` },
    inLanguage: ['ar', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${base}/catalog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  })
}
