'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLocale } from './locale-provider'

/** Arrow pointing in the reading direction. Place inside an element with the `group` class. */
export function DirArrow({ className = 'size-4' }: { className?: string }) {
  const { dir } = useLocale()
  const Icon = dir === 'rtl' ? ArrowLeft : ArrowRight
  return (
    <Icon
      className={`${className} transition-transform rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1`}
      aria-hidden="true"
    />
  )
}
