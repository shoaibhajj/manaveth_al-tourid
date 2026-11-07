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
            return <About key={`about-${idx}`} />
          case 'news':
          case 'newsFeed':
            return (
              <CompanyNews
                key={`news-${idx}`}
                customTitle={sec.customTitle?.ar ? sec.customTitle : undefined}
              />
            )
          case 'services':
            return <Services key={`services-${idx}`} />
          case 'featuredProducts':
            return <FeaturedProducts key={`featured-${idx}`} />
          case 'gallery':
            return <Gallery key={`gallery-${idx}`} />
          case 'stats':
            return <Stats key={`stats-${idx}`} />
          case 'sectors':
            return <Sectors key={`sectors-${idx}`} />
          case 'branches':
            return <BranchesSection key={`branches-${idx}`} />
          case 'contact':
            return <ContactCta key={`contact-${idx}`} />
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
