import type { Metadata } from 'next'
import { BranchesPageContent } from '@/components/branches-page-content'
import { PageHero } from '@/components/page-hero'
import { site } from '@/lib/content/site'
import { getLocale } from '@/lib/locale-server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return { title: site.metadata.branchesTitle[locale], description: site.branchesPage.subtitle[locale] }
}

export default function BranchesPage() {
  return (
    <main>
      <PageHero
        eyebrow={site.branchesPage.eyebrow}
        title={site.branchesPage.title}
        subtitle={site.branchesPage.subtitle}
      />
      <BranchesPageContent />
    </main>
  )
}
