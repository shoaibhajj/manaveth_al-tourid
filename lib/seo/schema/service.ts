import type { Locale } from '@/lib/i18n'
import { ENTITIES } from '../entities'
import { compact, t, absoluteUrl } from './helpers'

export function buildServiceSchema(service: any, locale: Locale, base: string) {
  const isAr = locale === 'ar'
  const slug = service.slug || service.id
  const serviceUrl = `${base}${isAr ? '' : '/en'}/services/${slug}`

  return compact({
    '@type': 'Service',
    '@id': `${serviceUrl}#service`,
    url: serviceUrl,
    name: t(service.title, locale) || t(service.name, locale),
    description: t(service.description, locale),
    provider: {
      '@type': 'Organization',
      '@id': `${base}/#organization`,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: ENTITIES.saudiArabia.name[locale], sameAs: ENTITIES.saudiArabia.sameAs },
      { '@type': 'City', name: ENTITIES.riyadh.name[locale], sameAs: ENTITIES.riyadh.sameAs },
      { '@type': 'City', name: ENTITIES.jeddah.name[locale], sameAs: ENTITIES.jeddah.sameAs },
    ],
    serviceType: isAr ? 'توريد وإعاشة تجارية' : 'Commercial Foodservice Supply',
    termsOfService: `${base}${isAr ? '' : '/en'}/#contact`,
  })
}
