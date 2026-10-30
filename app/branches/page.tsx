import type { Metadata } from 'next'
import { BranchesPageContent } from '@/components/branches-page-content'
import { PageHero } from '@/components/page-hero'
import { getContent } from '@/lib/sanity/get-content'
import { getLocale } from '@/lib/locale-server'

export async function generateMetadata(): Promise<Metadata> {
  const [locale, { seo }] = await Promise.all([getLocale(), getContent()])
  return {
    title: seo.branches.title[locale],
    description: seo.branches.description[locale],
    openGraph: seo.branches.shareImage ? { images: [seo.branches.shareImage] } : undefined,
  }
}

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
