import type { PreviewConfig } from 'sanity'

type PreviewValue = Record<string, any>

/**
 * List and document preview for cards that have a localized name, an image, a visibility flag and an order.
 * Hidden items are marked in the title so they stand out in every list.
 */
export function cardPreview(options: { name?: string; media?: string; detail?: string } = {}): PreviewConfig {
  const name = options.name ?? 'name'

  return {
    select: {
      ar: `${name}.ar`,
      en: `${name}.en`,
      media: options.media ?? 'image',
      visible: 'visible',
      order: 'order',
      ...(options.detail ? { detail: options.detail } : {}),
    },
    prepare({ ar, en, media, visible, order, detail }: PreviewValue) {
      const title = ar || en || 'Untitled'
      return {
        title: visible === false ? `[Hidden] ${title}` : title,
        subtitle: [
          visible === false ? 'Hidden' : 'Visible',
          ar && en ? en : undefined,
          detail,
          order != null ? `#${order}` : undefined,
        ]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  }
}
