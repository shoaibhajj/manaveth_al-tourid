'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'
import { Award, Container, Globe, Users } from 'lucide-react'

const stats = [
  { icon: Award, value: 24, label: 'عام من الخبرة' },
  { icon: Users, value: 500, label: 'عميل من القطاعات المختلفة' },
  { icon: Container, value: 1200, label: 'شحنة سنويًا' },
  { icon: Globe, value: 20, label: 'دولة موردة' },
]

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })

  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v).toLocaleString('en-US')}+`
      },
    })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>0+</span>
}

export function Stats() {
  return (
    <section aria-label="إحصائيات الشركة" className="relative isolate overflow-hidden bg-forest-deep py-14">
      <Image src="/images/service-sea.png" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-forest-deep via-forest-deep/90 to-forest-deep/60" aria-hidden="true" />
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 md:grid-cols-4 md:[&>li:not(:last-child)]:border-e md:[&>li]:border-cream/10 md:px-6">
        {stats.map(({ icon: Icon, value, label }) => (
          <li key={label} className="group flex flex-col items-center text-center">
            <Icon
              className="mb-3 size-11 text-gold transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
              strokeWidth={1.3}
              aria-hidden="true"
            />
            <span className="text-4xl font-extrabold text-cream tabular-nums md:text-5xl" dir="ltr">
              <Counter to={value} />
            </span>
            <span className="mt-2 text-sm font-medium text-cream/75">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
