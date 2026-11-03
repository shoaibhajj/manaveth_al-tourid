import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '@/lib/sanity/live'

/** Live content updates for editors in studio/preview mode only. Public visitors get high-speed cached responses. */
export async function SanityRuntime() {
  if (!SanityLive) return null
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null
  return (
    <>
      <SanityLive />
      <VisualEditing />
    </>
  )
}
