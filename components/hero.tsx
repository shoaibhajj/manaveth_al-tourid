'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ArrowLeft, ConciergeBell, FileText, Ship, Store, Truck } from 'lucide-react'

const features = [
  { icon: ConciergeBell, label: 'توريد المواد الغذائية' },
  { icon: Store, label: 'المطاعم والفنادق' },
  { icon: Truck, label: 'النقل البري' },
  { icon: Ship, label: 'الاستيراد البحري' },
]

const titleLines = ['شريكك الموثوق في', 'توريد المواد الغذائية']

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-forest-deep pt-28 pb-16"
    >
      <motion.div className="absolute inset-0 -z-20" style={{ y: imageY }}>
        <Image
          src="/images/hero.png"
          alt="ميناء تجاري عند الغروب فيه سفينة حاويات وشاحنة ومستودع"
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover"
        />
      </motion.div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-l from-forest-deep via-forest-deep/80 to-forest-deep/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-forest-deep to-transparent"
        aria-hidden="true"
      />

      <svg
        className="pointer-events-none absolute -left-10 top-24 -z-10 h-64 w-[60%] opacity-50"
        viewBox="0 0 800 200"
        fill="none"
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M0 ${100 + i * 12} C 150 ${20 + i * 10}, 250 ${180 - i * 8}, 400 ${100 + i * 6} S 650 ${20 + i * 12}, 800 ${100 + i * 4}`}
            stroke="var(--gold)"
            strokeWidth={1.2 - i * 0.3}
            strokeDasharray="600 600"
            className="animate-wave"
            style={{ animationDelay: `${i * -3}s` }}
          />
        ))}
      </svg>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-7xl px-4 md:px-6"
      >
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-light backdrop-blur-sm"
          >
            <span className="size-2 animate-pulse rounded-full bg-gold" aria-hidden="true" />
            خبرة موثوقة منذ عام 2001
          </motion.p>

          <h1 className="text-4xl font-extrabold leading-[1.25] text-cream md:text-6xl">
            {titleLines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${i === 1 ? 'text-gold-gradient' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-cream/80 md:text-xl"
          >
            {'من المصدر إلى وجهتك .. بجودة عالمية وسلاسل إمداد متكاملة.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gold-gradient px-7 py-3.5 font-bold text-forest-deep shadow-lg shadow-gold/25 transition-transform hover:-translate-y-0.5"
            >
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/40" aria-hidden="true" />
              <FileText className="size-5" aria-hidden="true" />
              طلب عرض سعر
            </a>
            <a
              href="#about"
              className="group inline-flex items-center gap-2 rounded-lg border border-cream/40 px-7 py-3.5 font-bold text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              تعرف علينا
              <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        <ul className="mt-14 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
          {features.map(({ icon: Icon, label }, i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 + i * 0.1 }}
              className="group flex flex-col items-center gap-3 rounded-xl border border-cream/10 bg-forest-deep/40 px-3 py-5 text-center backdrop-blur-md transition-colors hover:border-gold/50 hover:bg-forest/60"
            >
              <span
                className="animate-float text-gold transition-transform group-hover:scale-110"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <Icon className="size-9" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-cream">{label}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-cream/60 md:flex"
        aria-label="انتقل إلى قسم من نحن"
      >
        <span className="flex h-9 w-5 justify-center rounded-full border border-cream/40 pt-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-gold" />
        </span>
      </a>
    </section>
  )
}
