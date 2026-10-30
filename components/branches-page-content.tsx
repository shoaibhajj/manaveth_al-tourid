'use client'

import { getBranches, getWarehouses, type Place } from '@/lib/content/branches'
import type { Localized } from '@/lib/i18n'
import { site } from '@/lib/content/site'
import { BranchCard } from './branch-card'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

function PlaceGroup({ title, places }: { title: Localized; places: Place[] }) {
  const { t } = useLocale()
  if (places.length === 0) return null

  return (
    <div>
      <h2 className="mb-6 text-2xl font-extrabold text-forest">{t(title)}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {places.map((place, i) => (
          <Reveal key={place.id} delay={i * 0.1}>
            <BranchCard place={place} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function BranchesPageContent() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 md:px-6">
        <PlaceGroup title={site.branchesPage.branchesTitle} places={getBranches()} />
        <PlaceGroup title={site.branchesPage.warehousesTitle} places={getWarehouses()} />
      </div>
    </section>
  )
}
