import Image from 'next/image'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import { Reveal } from './reveal'

export function ContactCta() {
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-forest-deep py-20 md:py-28">
      <Image src="/images/cta.png" alt="" fill sizes="100vw" className="-z-20 animate-ken-burns object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-forest-deep/95 via-forest-deep/80 to-forest-deep/40" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-6 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <h2 className="text-balance text-3xl font-extrabold leading-tight text-cream md:text-5xl">
            دعنا نكون <span className="text-gold-gradient">شريكك في النجاح</span>
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-lg text-cream/80">
            تواصل معنا اليوم للحصول على عرض سعر مفصل لأعمالك واحتياجاتك.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:info@mnafeth.com"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gold-gradient px-7 py-3.5 font-bold text-forest-deep shadow-lg shadow-gold/25 transition-transform hover:-translate-y-0.5"
            >
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/40" aria-hidden="true" />
              تواصل معنا
              <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="tel:+966500000000"
              className="inline-flex items-center gap-2 rounded-lg border border-cream/40 px-7 py-3.5 font-bold text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <Phone className="size-5" aria-hidden="true" />
              اتصل بنا
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="space-y-3 rounded-2xl border border-gold/30 bg-forest-deep/70 p-6 backdrop-blur-md">
            {[
              { icon: Phone, label: 'الهاتف', value: '+966 50 000 0000', dir: 'ltr' as const },
              { icon: Mail, label: 'البريد الإلكتروني', value: 'info@mnafeth.com', dir: 'ltr' as const },
              { icon: MapPin, label: 'العنوان', value: 'المملكة العربية السعودية' },
            ].map(({ icon: Icon, label, value, dir }) => (
              <li key={label} className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs text-cream/60">{label}</span>
                  <span className="block font-bold text-cream" dir={dir}>
                    {value}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
