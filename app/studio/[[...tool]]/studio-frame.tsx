'use client'

import dynamic from 'next/dynamic'

const Studio = dynamic(() => import('./studio'), {
  ssr: false,
  loading: () => (
    <p className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading Studio…</p>
  ),
})

/**
 * The Studio is a full-screen, left-to-right app. It sits above the site chrome so the site header,
 * footer and right-to-left direction do not affect it.
 */
export function StudioFrame() {
  return (
    <div dir="ltr" lang="en" className="fixed inset-0 z-[2147483000] bg-background">
      <Studio />
    </div>
  )
}
