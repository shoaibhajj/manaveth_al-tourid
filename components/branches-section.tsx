'use client'

import Link from 'next/link'
import { BranchCard } from './branch-card'
import { DirArrow } from './dir-arrow'
import { useContent, useLocale } from './locale-provider'
import { Reveal, SectionHeading } from './reveal'
import type { Place } from '@/lib/content/branches'

export function BranchesSection({
  branches: branchesProp,
  branchesSection: sectionProp,
}: {
  branches?: Place[]
  branchesSection?: any
} = {}) {
  const { t, localize } = useLocale()
  const { site, branches: contextBranches } = useContent()
  const branches = branchesProp ?? contextBranches ?? []
  const branchesSection = sectionProp ?? site?.branchesSection

  return (
    <section id="branches" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {branchesSection && (
          <SectionHeading
            eyebrow={t(branchesSection.eyebrow)}
            title={t(branchesSection.title)}
            subtitle={t(branchesSection.subtitle)}
          />
        )}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {branches.map((branch, i) => (
            <Reveal key={branch.id} delay={i * 0.1}>
              <BranchCard place={branch} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex justify-center">
          <Link
            href={localize('/branches')}
            className="group inline-flex items-center gap-2 rounded-lg border-2 border-gold px-7 py-3 font-bold text-forest transition-colors hover:bg-gold"
          >
            {branchesSection ? t(branchesSection.cta) : t({ ar: 'عرض جميع الفروع', en: 'View all branches' })}
            <DirArrow />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
