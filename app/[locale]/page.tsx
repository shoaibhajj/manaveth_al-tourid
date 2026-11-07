import type { Metadata } from 'next'
import { getContent } from '@/lib/sanity/get-content'
import { pageMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { CompanyNews } from '@/components/company-news'
import { Services } from '@/components/services'
import { FeaturedProducts } from '@/components/featured-products'
import { Gallery } from '@/components/gallery'
import { Stats } from '@/components/stats'
import { Sectors } from '@/components/sectors'
import { BranchesSection } from '@/components/branches-section'
import { ContactCta } from '@/components/contact-cta'
import { CustomSection } from '@/components/custom-section'

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  return pageMetadata('home', locale)
}

export default async function Home() {
  const content = await getContent()
  const {
    orderedSections,
    customSections,
    site,
    contact,
    services,
    sectors,
    stats,
    featuredProducts,
    galleryItems,
    galleryCategories,
    galleryFeatured,
    showCategoryFilter,
    companyPosts,
    branches,
  } = content

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const customMap = new Map((customSections || []).map((cs: any) => [cs.id, cs]))

  return (
    <main>
      {orderedSections.map((sec, idx) => {
        if (!sec.enabled) return null

        switch (sec.key) {
          case 'hero':
            return <Hero key={`hero-${idx}`} hero={site.hero} />
          case 'about':
            return <About key={`about-${idx}`} about={site.about} />
          case 'news':
          case 'newsFeed':
            return (
              <CompanyNews
                key={`news-${idx}`}
                posts={companyPosts}
                customTitle={sec.customTitle?.ar ? sec.customTitle : undefined}
              />
            )
          case 'services':
            return <Services key={`services-${idx}`} items={services} sectionHeading={site.servicesSection} />
          case 'featuredProducts':
            return (
              <FeaturedProducts
                key={`featured-${idx}`}
                products={featuredProducts}
                productsSection={site.productsSection}
              />
            )
          case 'gallery':
            return (
              <Gallery
                key={`gallery-${idx}`}
                items={galleryItems}
                categories={galleryCategories}
                featured={galleryFeatured}
                showCategoryFilter={showCategoryFilter}
                gallerySection={site.gallerySection}
                ui={site.ui}
              />
            )
          case 'stats':
            return <Stats key={`stats-${idx}`} stats={stats} statsSection={site.statsSection} />
          case 'sectors':
            return <Sectors key={`sectors-${idx}`} items={sectors} sectionHeading={site.sectorsSection} />
          case 'branches':
            return <BranchesSection key={`branches-${idx}`} branches={branches} branchesSection={site.branchesSection} />
          case 'contact':
            return <ContactCta key={`contact-${idx}`} contact={contact} branches={branches} labels={site.contact} />
          case 'custom': {
            const customData = sec.customSection || (sec.customSectionRef ? customMap.get(sec.customSectionRef) : null)
            if (!customData) return null
            return (
              <CustomSection
                key={`custom-${sec.customSectionRef || idx}`}
                section={{
                  ...customData,
                  title: sec.customTitle?.ar ? sec.customTitle : customData.title,
                }}
              />
            )
          }
          default:
            return null
        }
      })}
    </main>
  )
}
