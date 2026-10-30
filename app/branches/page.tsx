import type { Metadata } from 'next'
import { BranchesPageContent } from '@/components/branches-page-content'
import { PageHero } from '@/components/page-hero'
import { getContent } from '@/lib/sanity/get-content'
import { pageMetadata } from '@/lib/seo'

export const generateMetadata = (): Promise<Metadata> => pageMetadata('branches')

export default async function BranchesPage() {
  const { site } = await getContent()
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
