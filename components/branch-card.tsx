import { ExternalLink, MapPin } from 'lucide-react'
import { getMapEmbedUrl, getMapLinkUrl, type Branch } from '@/lib/branches'

export function BranchCard({ branch }: { branch: Branch }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gold/30 bg-forest-deep/70 backdrop-blur-md">
      <div className="flex items-start gap-4 p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
          <MapPin className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-bold text-cream">{branch.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-cream/70">{branch.address}</p>
        </div>
      </div>

      <div className="aspect-[16/10] w-full border-y border-gold/20 bg-forest-deep">
        <iframe
          src={getMapEmbedUrl(branch.mapQuery)}
          title={`خريطة ${branch.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      </div>

      <div className="p-5">
        <a
          href={getMapLinkUrl(branch.mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-gradient px-5 py-3 font-bold text-forest-deep transition-transform hover:-translate-y-0.5"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          فتح في خرائط Google
        </a>
      </div>
    </article>
  )
}
