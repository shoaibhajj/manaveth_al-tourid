import { About } from '@/components/about'
import { BranchesSection } from '@/components/branches-section'
import { ContactCta } from '@/components/contact-cta'
import { FeaturedProducts } from '@/components/featured-products'
import { Gallery } from '@/components/gallery'
import { Hero } from '@/components/hero'
import { Sectors } from '@/components/sectors'
import { Services } from '@/components/services'
import { Stats } from '@/components/stats'
import { getContent } from '@/lib/sanity/get-content'

export default async function Home() {
  const { sections } = await getContent()

  return (
    <main>
      <Hero />
      {sections.about && <About />}
      {sections.services && <Services />}
      {sections.featuredProducts && <FeaturedProducts />}
      {sections.gallery && <Gallery />}
      {sections.stats && <Stats />}
      {sections.sectors && <Sectors />}
      {sections.branches && <BranchesSection />}
      {sections.contact && <ContactCta />}
    </main>
  )
}
