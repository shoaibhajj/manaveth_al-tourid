import type { Metadata } from 'next'
import { BranchesPageContent } from '@/components/branches-page-content'
import { PageHero } from '@/components/page-hero'
import { getContent } from '@/lib/sanity/get-content'
import { pageMetadata } from '@/lib/seo'
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n'

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
  return pageMetadata('branches', locale)
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
