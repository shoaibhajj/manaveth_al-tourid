'use client'

import { motion, type HTMLMotionProps } from 'motion/react'
import { useLocale } from './locale-provider'

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number
  y?: number
  x?: number
}

export function Reveal({ delay = 0, y = 28, x = 0, children, ...props }: RevealProps) {
  const { dir } = useLocale()
  const startX = dir === 'rtl' ? x : -x
  return (
    <motion.div
      initial={{ opacity: 0, y, x: startX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ delay = 0, children, ...props }: HTMLMotionProps<'li'> & { delay?: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.li>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  align = 'center',
}: {
  eyebrow: string
  title: string
  subtitle?: string
  light?: boolean
  align?: 'center' | 'start'
}) {
  return (
    <Reveal className={align === 'center' ? 'text-center' : 'text-start'}>
      <p className="mb-2 inline-flex items-center gap-2 text-sm font-bold tracking-wide text-gold md:text-base">
        <span className="h-px w-8 bg-gold" aria-hidden="true" />
        {eyebrow}
        <span className="h-px w-8 bg-gold" aria-hidden="true" />
      </p>
      <h2
        className={`text-balance text-2xl font-extrabold leading-tight md:text-4xl ${
          light ? 'text-cream' : 'text-forest'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-pretty md:text-lg ${light ? 'text-cream/70' : 'text-muted-foreground'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
