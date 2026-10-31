import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '@/lib/sanity/live'

/** Live content updates for visitors, plus click-to-edit overlays when draft preview is on. */
export async function SanityRuntime() {
  if (!SanityLive) return null
  const { isEnabled } = await draftMode()
  return (
    <>
      <SanityLive />
      {isEnabled && <VisualEditing />}
    </>
  )
}
