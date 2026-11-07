import type { Metadata } from 'next'
import { getContent } from '@/lib/sanity/get-content'
import { pageMetadata } from '@/lib/seo'
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

export const generateMetadata = (): Promise<Metadata> => pageMetadata('home')

export default async function Home() {
  const { orderedSections, sections, customSections } = await getContent()

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const customMap = new Map((customSections || []).map((cs: any) => [cs.id, cs]))

  return (
    <main>
      {orderedSections.map((sec, idx) => {
        if (!sec.enabled) return null

        switch (sec.key) {
          case 'hero':
            return <Hero key={`hero-${idx}`} />
          case 'about':
            return sections.about !== false ? <About key={`about-${idx}`} /> : null
          case 'news':
          case 'newsFeed':
            return sections.news !== false ? (
              <CompanyNews
                key={`news-${idx}`}
                customTitle={sec.customTitle?.ar ? sec.customTitle : undefined}
              />
            ) : null
          case 'services':
            return sections.services !== false ? <Services key={`services-${idx}`} /> : null
          case 'featuredProducts':
            return sections.featuredProducts !== false ? <FeaturedProducts key={`featured-${idx}`} /> : null
          case 'gallery':
            return sections.gallery !== false ? <Gallery key={`gallery-${idx}`} /> : null
          case 'stats':
            return sections.stats !== false ? <Stats key={`stats-${idx}`} /> : null
          case 'sectors':
            return sections.sectors !== false ? <Sectors key={`sectors-${idx}`} /> : null
          case 'branches':
            return sections.branches !== false ? <BranchesSection key={`branches-${idx}`} /> : null
          case 'contact':
            return sections.contact !== false ? <ContactCta key={`contact-${idx}`} /> : null
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
