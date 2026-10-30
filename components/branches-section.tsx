'use client'

import Link from 'next/link'
import { BranchCard } from './branch-card'
import { DirArrow } from './dir-arrow'
import { useContent, useLocale } from './locale-provider'
import { Reveal, SectionHeading } from './reveal'

export function BranchesSection() {
  const { t, localize } = useLocale()
  const { site, branches } = useContent()
  const { branchesSection } = site

  return (
    <section id="branches" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow={t(branchesSection.eyebrow)}
          title={t(branchesSection.title)}
          subtitle={t(branchesSection.subtitle)}
        />
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
            {t(branchesSection.cta)}
            <DirArrow />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
