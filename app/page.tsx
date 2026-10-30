import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Services } from '@/components/services'
import { Gallery } from '@/components/gallery'
import { Stats } from '@/components/stats'
import { Sectors } from '@/components/sectors'
import { ContactCta } from '@/components/contact-cta'
import { SiteFooter } from '@/components/site-footer'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Stats />
        <Sectors />
        <ContactCta />
      </main>
      <SiteFooter />
    </>
  )
}
