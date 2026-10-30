import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Services } from '@/components/services'
import { FeaturedProducts } from '@/components/featured-products'
import { Gallery } from '@/components/gallery'
import { Stats } from '@/components/stats'
import { Sectors } from '@/components/sectors'
import { BranchesSection } from '@/components/branches-section'
import { ContactCta } from '@/components/contact-cta'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <FeaturedProducts />
      <Gallery />
      <Stats />
      <Sectors />
      <BranchesSection />
      <ContactCta />
    </main>
  )
}
