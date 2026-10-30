import { defineField, defineType } from 'sanity'
import { displayOrderings, orderField, visibleField } from '../../lib/fields'
import { requiredTranslation } from '../../lib/localization'
import { cardPreview } from '../../lib/preview'

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: 'Gallery category — تصنيف المعرض',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'localizedString', validation: requiredTranslation }),
    orderField,
    visibleField,
  ],
  orderings: displayOrderings,
  preview: cardPreview({ media: 'none' }),
})

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Gallery item — عنصر المعرض',
  type: 'document',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video file',
      description: 'Upload a video, or paste a video address below.',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video address',
      type: 'url',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'poster',
      title: 'Cover image',
      description: 'Optional. Shown before the video plays.',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      description: 'Describes the image or video for screen readers, in both languages.',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'galleryCategory' }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured item',
      description: 'Shown as the large item in the gallery.',
      type: 'boolean',
      initialValue: false,
    }),
    orderField,
    visibleField,
  ],
  orderings: displayOrderings,
  preview: {
    select: {
      ar: 'alt.ar',
      en: 'alt.en',
      image: 'image',
      poster: 'poster',
      mediaType: 'mediaType',
      category: 'category.name.en',
      visible: 'visible',
      order: 'order',
    },
    prepare: ({ ar, en, image, poster, mediaType, category, visible, order }) => {
      const title = ar || en || 'Untitled item'
      return {
        title: visible === false ? `[Hidden] ${title}` : title,
        subtitle: [
          visible === false ? 'Hidden' : 'Visible',
          mediaType === 'video' ? 'Video' : 'Image',
          category,
          order != null ? `#${order}` : undefined,
        ]
          .filter(Boolean)
          .join(' · '),
        media: image || poster,
      }
    },
  },
})
