import Image from 'next/image'
import { ArrowLeft, ConciergeBell, Plus, Ship, Store, Truck } from 'lucide-react'
import { RevealItem, SectionHeading } from './reveal'

const services = [
  {
    icon: ConciergeBell,
    title: 'توريد المواد الغذائية',
    text: 'مجموعة واسعة من المنتجات الغذائية من مصادر موثوقة',
    image: '/images/service-food.png',
    alt: 'تشكيلة من الخضار الطازجة والأجبان وزيت الزيتون',
  },
  {
    icon: Store,
    title: 'المطاعم والفنادق',
    text: 'توريد احتياجات المطاعم والفنادق بجودة واستمرارية',
    image: '/images/service-hotels.png',
    alt: 'طاهٍ يجهز الأطباق في مطبخ فندق فاخر',
  },
  {
    icon: Truck,
    title: 'النقل البري',
    text: 'نقل آمن وسريع داخل وخارج المملكة',
    image: '/images/service-land.png',
    alt: 'شاحنة نقل على الطريق وقت الغروب',
  },
  {
    icon: Ship,
    title: 'الاستيراد البحري',
    text: 'استيراد من الأسواق العالمية بأفضل الأسعار',
    image: '/images/service-sea.png',
    alt: 'سفينة حاويات راسية في الميناء',
  },
]

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-forest py-20 md:py-28">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading eyebrow="خدماتنا" title="حلول متكاملة لسلسلة الإمداد الغذائية" light />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, text, image, alt }, i) => (
            <RevealItem
              key={title}
              delay={i * 0.1}
              whileHover={{ y: -8 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream/10 bg-forest-deep/60 transition-[border-color,box-shadow] duration-500 hover:border-gold/60 hover:shadow-2xl hover:shadow-black/30"
            >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-transparent" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold transition-all duration-500 group-hover:rotate-6 group-hover:bg-gold group-hover:text-forest-deep">
                      <Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-bold text-cream">{title}</h3>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/70">{text}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-4">
                    <a
                      href="#contact"
                      className="inline-flex size-9 items-center justify-center rounded-full border border-gold/50 text-gold transition-all group-hover:bg-gold group-hover:text-forest-deep"
                      aria-label={`اطلب خدمة ${title}`}
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                    </a>
                    <Plus className="size-5 text-cream/50 transition-transform duration-500 group-hover:rotate-90 group-hover:text-gold" aria-hidden="true" />
                  </div>
                </div>
            </RevealItem>
          ))}
        </ul>
      </div>
    </section>
  )
}
