import type { PreviewConfig } from 'sanity'
import { statusLabels } from './fields'

type PreviewValue = Record<string, any>

/**
 * List and document preview for cards that have a localized name, an image, a visibility flag and an order.
 * Hidden items are marked in the title so they stand out in every list.
 *
 * `detail` and `detailFallback` are field paths (the fallback is used when the first is empty);
 * `detailLabels` translates stored values such as "branch" into readable text.
 */
export function cardPreview(
  options: { name?: string; media?: string; detail?: string; detailFallback?: string; detailLabels?: Record<string, string> } = {},
): PreviewConfig {
  const name = options.name ?? 'name'

  return {
    select: {
      ar: `${name}.ar`,
      en: `${name}.en`,
      media: options.media ?? 'image',
      visible: 'visible',
      order: 'order',
      ...(options.detail ? { detail: options.detail } : {}),
      ...(options.detailFallback ? { detailFallback: options.detailFallback } : {}),
    },
    prepare({ ar, en, media, visible, order, detail, detailFallback }: PreviewValue) {
      const title = ar || en || 'بدون اسم'
      const rawDetail = detail || detailFallback
      return {
        title: visible === false ? `[مخفي] ${title}` : title,
        subtitle: [
          visible === false ? statusLabels.hidden : statusLabels.visible,
          ar && en ? en : undefined,
          rawDetail ? (options.detailLabels?.[rawDetail] ?? rawDetail) : undefined,
          order != null ? `الترتيب ${order}` : undefined,
        ]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  }
}
