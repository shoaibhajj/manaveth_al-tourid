import imageUrlBuilder from '@sanity/image-url'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

const builder = isSanityConfigured
  ? imageUrlBuilder({ projectId: sanityEnv.projectId as string, dataset: sanityEnv.dataset as string })
  : null

/** Returns undefined when the field has no uploaded asset, so callers can fall back to the built-in image. */
export function imageUrl(source: unknown, width = 1600): string | undefined {
  const image = source as { asset?: unknown } | null | undefined
  if (!builder || !image?.asset) return undefined
  return builder.image(image as never).width(width).fit('max').auto('format').quality(85).url()
}
